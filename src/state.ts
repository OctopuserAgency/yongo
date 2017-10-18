import Yongo from './yongo';

export default class State {
  private Class;
  protected stateHandler = {
    set(target, property, value) {
      target.setModifiedField(property, value);
      console.log('seting', property);
      return true;
    },
    ownKeys(target) {
      const privateFields = ['className', 'modifiedFields', 'activationHandler', 'actualHandler', 'syncStatus', 'path'];
      const keys = Object.keys(target);
      privateFields.forEach(privateField => keys.splice(keys.indexOf(privateField), 1));
      return keys;
    },
  };

  constructor(Class) {
    this.Class = Class;
  }

  public addModel(model) {
    this[model.id] = model;
  }

  public removeModel(model) {
    delete this[model.id];
  }

  public addModels(models) {
    for (let index = 0; index < models.length; index += 1) {
      this[models[index].id] = models[index];
    }
  }

  public addObject(payload: any, method: string | undefined) {
    const object = new this.Class(payload);
    object.getStatus().pending.create = false;
    object.getStatus().synced = true;
    const handler = {};
    object.setActivationProxy(this.stateHandler, handler);
    const proxy = new Proxy(object, handler);
    proxy.setProxy(proxy);
    if (!Yongo.reactFunction) {
      this[object.id] = proxy;
    } else {
      Yongo.reactFunction(this, object.id, object);
    }
    object.populate();
    return proxy;
  }

  public addList(payload, method) {
    const instances = [];
    for (let index = 0; index < payload.length; index += 1) {
      const object = new this.Class(payload[index]);
      object.getStatus().pending.create = false;
      object.getStatus().synced = true;
      const handler = {};
      object.setActivationProxy(this.stateHandler, handler);
      const proxy = new Proxy(object, handler);
      proxy.setProxy(proxy);
      if (!Yongo.reactFunction) {
        this[object.id] = proxy;
      } else {
        Yongo.reactFunction(this, object.id, object);
      }
      object.populate();
      instances.push(proxy);
    }
    return instances;
  }

  public findById(id) {
    return this[id];
  }

  public getList() {
    return Object.keys(this).map(key => this[key]);
  }
}
