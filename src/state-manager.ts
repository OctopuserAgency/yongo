import Model from './model';
import State from './state';

export default class StateManager {
  protected states = {};
  private stateHandler = {
    ownKeys(target) {
      const privateFields = ['Class', 'stateHandler'];
      const keys = Object.keys(target);
      privateFields.forEach(privateField => keys.splice(keys.indexOf(privateField), 1));
      return keys;
    },
  };

  public getState(ModelClass: typeof Model) {
    if (!this.states[ModelClass.name]) {
      const state = new State(ModelClass);
      this.states[ModelClass.name] = new Proxy(state, this.stateHandler);
    }
    return this.states[ModelClass.name];
  }
}
