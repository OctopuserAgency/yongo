import setConfig from './utils/set-config';
import applyAssociation from './utils/apply-association';
import Association from './association';

export default class Model {
  static associations = {};
  static paths: Object = {};
  static server;
  static reactFunction;
  static stateManager;
  static states: Object = {};

  public id: Number;
  private className: string = '';
  private path: string;

  public static setConfig(config) {
    setConfig(this, config);
  }

  public static fetch() {
    if (this.server) {
      return this.server.get(this.prototype.path)
        .then((response) => {
          return this.addListToState(`fetch${this['name']}`, response.data);
        });
    }
    return Promise.reject(new Error('There is no server configured'));
  }

  public static getState(){
    if(this.states[this['name']]) {
      return this.states[this['name']];
    } else {
      this.states[this['name']] = {};
      return this.states[this['name']];
    }
  }

  public static addAssociation(className: string, association: Association) {
    this.getAssociations(className).push(association);
  }

  static getAssociations(className) {
    if (this.associations[className]) {
      return this.associations[className];
    }
    this.associations[className] = [];
    return this.associations[className];

  }

  static addToState(method, payload) {
    if (this.stateManager) {
      this.stateManager.commit(method, payload);
    } else {
      this.reactFunction(this.getState(), payload.id, payload);
    }
  }

  static addListToState(method, payload) {
    if (this.stateManager) {
      return this.stateManager.commit(method, payload);
    } else {
      payload.forEach((item) => {
        const object = new this(item);
        object.populate();
        this.reactFunction(this.getState(), item.id, object);
      });
      return this.getState();
    }
  }

  constructor(data = {}) {
    this.className = this.constructor['name'];
    this.path = Model.paths[this.className]
    if (Model.associations[this.className]){
      Model.associations[this.className].forEach((association) => {
        if (association.isList) {
          this[association.name] = [];
        }
      });
    }
    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
  }

  populate() {
    Model.getAssociations(this.className).forEach(association => applyAssociation(this, association));
  }

  save() {
    return Model.server.post(this.path, JSON.parse(JSON.stringify(this)));
  }
}
