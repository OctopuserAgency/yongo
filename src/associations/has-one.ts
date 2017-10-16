import Association from './association';
import Model from '../model';
import Yongo from '../yongo';

export default class HasOne extends Association {
  constructor({ property, SourceClass, TargetClass }) {
    super({ property, SourceClass, TargetClass });
  }

  public apply(source) {
    source[this.property] = this.TargetClass.getState().addObject(source[this.property]);
  }
}
