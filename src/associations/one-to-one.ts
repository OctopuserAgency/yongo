import Association from './association';
import Model from '../model';
import Yongo from '../yongo';

export default class OneToOne extends Association {
  public defaultValue = undefined;
  public isSourceList = false;
  constructor({
    sourceProperty, targetProperty, SourceClass, TargetClass,
  }) {
    super({
      sourceProperty, targetProperty, SourceClass, TargetClass,
    });
  }

  public apply(source) {
    const target = source[this.sourceProperty];
    if (!target) {
      source[this.sourceProperty] = undefined;
      return;
    }
    source.deactivateProxy();
    const targetFound = Model.stateManager.states[this.TargetClass.name][target.id];
    if (targetFound) {
      targetFound.deactivateProxy();
      targetFound[this.targetProperty] = source.getProxy();
      source[this.sourceProperty] = targetFound;
      targetFound.activateProxy();
    } else {
      target[this.targetProperty] = source;
      const targetCreated = Model.stateManager.states[this.TargetClass.name].addObject(target);
      source[this.sourceProperty] = targetCreated;
      targetCreated.activateProxy();
    }
    source.activateProxy();
  }
}
