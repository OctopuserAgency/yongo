import Yongo from './yongo';

export default class State {
  private Class;
  protected stateHandler = {
    set(target, property, value) {
      target.setModifiedField(property, value);
      return true;
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
    object.populate();
    const proxy = new Proxy(object, this.stateHandler);
    if (!Yongo.reactFunction) {
      this[object.id] = proxy;
    } else {
      Yongo.reactFunction(this, object.id, object);
    }
    return proxy;
  }

  public addList(payload, method) {
    const instances = [];
    for (let index = 0; index < payload.length; index += 1) {
      const object = new this.Class(payload[index]);
      object.getStatus().pending.create = false;
      object.getStatus().synced = true;
      object.populate();
      const proxy = new Proxy(object, this.stateHandler);
      instances.push(proxy);
      if (!Yongo.reactFunction) {
        this[object.id] = proxy;
      } else {
        Yongo.reactFunction(this, object.id, object);
      }
    }
    return instances;
  }
}
