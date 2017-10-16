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
  static stateManager = new StateManager();
  static paths: Object = {};
  static states: Object = {};

  public id: Number;
  private className: string = '';
  private path: string;
  private modifiedFields = {};
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

  public static fetch() {
    if (Yongo.server) {
      return Yongo.server.get(this.prototype.path)
        .then(response => this.getState().addList(response.data, `fetch${this.name}`));
    }
    return Promise.reject(new Error('There is no server configured'));
  }

  public static getState() {
    return this.stateManager.getState(this);
  }

  public static addAssociation(association: Association) {
    Model.getAssociations(association.SourceClass.name).push(association);
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
    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
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

  populate() {
    Model.getAssociations(this.className)
      .forEach(association => association.apply(this));
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
    this.syncStatus.creating = true;
    return Yongo.server.post(`${this.path}`, this)
      .then((response) => {
        this.syncStatus.creating = false;
        Model.stateManager.getState(<typeof Model> this.constructor).addModel(this);
        return response;
      });
  }

  delete() {
    if (this.syncStatus.pending.create) {
      throw new Error('The model is pending to creation.');
    }
    this.syncStatus.synced = false;
    this.syncStatus.deleting = true;
    return Yongo.server.post(`${this.path}/${this.id}`, this.modifiedFields)
      .then((response) => {
        this.syncStatus.deleting = false;
        Model.stateManager.getState(<typeof Model> this.constructor).removeModel(this);
        return response;
      });
  }
}
