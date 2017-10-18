import Association from './association';
import Model from '../model';
import Yongo from '../yongo';

export default class ManyToMany extends Association {
  public defaultValue = {};
  public isSourceList = true;
  constructor({
    sourceProperty, targetProperty, SourceClass, TargetClass,
  }) {
    super({
      sourceProperty, targetProperty, SourceClass, TargetClass,
    });
  }

  public apply(source) {
    if (!source[this.sourceProperty]) {
      source[this.sourceProperty] = {};
      return;
    }
    source.deactivateProxy();
    const listOfTargets = source[this.sourceProperty];
    if (Array.isArray(listOfTargets)) {
      source[this.sourceProperty] = {};
    }
    for (let index = 0; index < listOfTargets.length; index += 1) {
      const target = listOfTargets[index];
      const targetFound = Model.stateManager.states[this.TargetClass.name][target.id];
      if (targetFound) {
        targetFound.deactivateProxy();
        if (!targetFound[this.targetProperty]) {
          targetFound[this.targetProperty] = {};
        }
        targetFound[this.targetProperty][source.id] = source.getProxy();
        source[this.sourceProperty][targetFound.id] = targetFound;
        targetFound.activateProxy();
      } else {
        if (!target[this.targetProperty]) {
          target[this.targetProperty] = [];
        }
        target[this.targetProperty].push(source);
        const targetCreated = Model.stateManager.states[this.TargetClass.name].addObject(target);
        source[this.sourceProperty][targetCreated.id] = targetCreated;
        targetCreated.activateProxy();
      }
    }
    source.activateProxy();
  }
}
