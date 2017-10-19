import setConfig from './utils/set-config';
import Association from './associations/association';
import StateManager from './state-manager';
/*
this is the main Class (almost static) that allows us to
configure server in case of REST API configuration or reactive
functions (Vue)
*/
import Yongo from './yongo';

export default class Model {
  static UPDATING = 'updating';
  static INSERTING = 'inserting';
  static PENDING_SAVE = 'pending_save';
  static PENDING_CREATE = 'pending_create';
  static SYNCED = 'synced';
  static associations = {};
  static paths: Object = {};
  static states: Object = {};
  public static stateManager = new StateManager();
  static fields = {};

  public id: Number;
  private className: string = '';
  private path: string;
  private modifiedFields = {};
  private activationHandler = {};
  private actualHandler = {};
  public syncStatus = {
    updating: false,
    creating: false,
    deleting: false,
    pending: {
      save: false,
      create: true,
    },
    synced: false,
  };
  private proxy;

  public static fetch() {
    if (Yongo.server) {
      return Yongo.server.get(this.prototype.path)
        .then(response => this.getState().addList(response.data, `fetch${this.name}`));
    }
    return Promise.reject(new Error('There is no server configured'));
  }

  public static addField(field, defaultValue) {
    if (!Model.fields[this.name]) {
      Model.fields[this.name] = {};
    }
    if (defaultValue) {
      Model.fields[this.name][field] = {
        defaultValue,
      };
    }
  }

  public static getState() {
    return this.stateManager.getState(this);
  }

  public static addAssociation(association: Association) {
    if (!Model.associations[association.SourceClass.name]) {
      Model.associations[association.SourceClass.name] = [];
    }
    Model.stateManager.getState(association.SourceClass);
    Model.associations[association.SourceClass.name].push(association);
  }

  public static getAssociations(className) {
    if (this.associations[className]) {
      return this.associations[className];
    }
    this.associations[className] = [];
    return this.associations[className];
  }

  constructor(data = undefined) {
    this.className = this.constructor.name;
    this.path = Model.paths[this.className];
    if (data.id) {
      this.id = data.id;
    }
    if (data && Model.fields[this.className]) {
      Object.keys(Model.fields[this.className]).forEach((key) => {
        if (data[key]) {
          this[key] = data[key];
        } else {
          this[key] = Model.fields[this.className].defaultValue;
        }
      });
    }
    const associations = Model.associations[this.className];
    for (let index = 0; index < associations.length; index += 1) {
      const associationField = associations[index].sourceProperty;
      this[associationField] = data[associationField];
    }
  }

  public setModifiedField(field, value) {
    if (!this.syncStatus.pending.create) {
      this.syncStatus.pending.save = true;
      this.syncStatus.synced = false;
      this.modifiedFields[field] = value;
    }
  }

  public getStatus() {
    return this.syncStatus;
  }

  public getProxy(proxy) {
    return this.proxy;
  }

  public setProxy(proxy) {
    this.proxy = proxy;
  }

  public setActivationProxy(activationHandler, handler) {
    this.activationHandler = activationHandler;
    this.actualHandler = handler;
  }

  public activateProxy() {
    (<any> this.actualHandler).set = (<any> this.activationHandler).set;
  }

  public deactivateProxy() {
    (<any> this.actualHandler).set = undefined;
  }

  populate() {
    const associations = Model.associations[this.className];
    for (let index = 0; index < associations.length; index += 1) {
      associations[index].apply(this);
    }
  }

  save() {
    if (this.syncStatus.deleting) {
      throw new Error('This model is marked as deleting');
    }
    if (this.syncStatus.pending.create || this.syncStatus.synced) {
      return Promise.resolve();
    }
    this.syncStatus.updating = true;
    return Yongo.server.put(`${this.path}/${this.id}`, this.modifiedFields)
      .then((response) => {
        this.syncStatus.updating = false;
        return response;
      });
  }

  insert() {
    if (this.syncStatus.synced) {
      throw new Error('The model is already synced.');
    }
    const associations = Model.associations[this.className];
    const createModels = [];
    const sendingModel = {};
    Object.assign(sendingModel, this.getSimplifiedObject());
    this.syncStatus.pending.create = false;
    this.syncStatus.creating = true;
    associations.forEach((association) => {
      if (!sendingModel[association.sourceTarget]) {
        return;
      }
      if (association.isSourceList) {
        const keys = Object.keys(sendingModel[association.sourceTarget]);
        keys.forEach((key) => {
          const target = sendingModel[association.sourceTarget][key];
          if (target.syncStatus.pending.create) {
            createModels.push(target.insert());
          }
        });
        sendingModel[association.sourceTarget] = keys;
      } else {
        sendingModel[association.sourceTarget] = sendingModel[association.sourceTarget].id;
      }
    });
    return Promise.all(createModels).then(() => Yongo.server.post(this.path, sendingModel)
      .then((response) => {
        this.syncStatus.creating = false;
        Model.stateManager.getState(<typeof Model> this.constructor).addModel(this);
        return response;
      }));
  }

  delete() {
    if (this.syncStatus.pending.create) {
      throw new Error('The model is pending to creation.');
    }
    this.syncStatus.synced = false;
    this.syncStatus.deleting = true;
    return Yongo.server.delete(`${this.path}/${this.id}`)
      .then((response) => {
        this.syncStatus.deleting = false;
        Model.stateManager.getState(<typeof Model> this.constructor).removeModel(this);
        return response;
      });
  }

  private getSimplifiedObject() {
    const privateFields = ['className', 'modifiedFields', 'activationHandler', 'actualHandler', 'syncStatus', 'path'];
    const keys = Object.keys(this);
    privateFields.forEach(privateField => keys.splice(keys.indexOf(privateField), 1));
    const simplifiedObject = {};
    keys.forEach((key) => { simplifiedObject[key] = this[key]; });
    return simplifiedObject;
  }
}
