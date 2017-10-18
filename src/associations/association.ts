import Model from '../model';

export default class Association {
  public sourceProperty: string;
  public targetProperty: string;
  public TargetClass: typeof Model;
  public SourceClass: typeof Model;
  constructor({
    sourceProperty, targetProperty, SourceClass, TargetClass,
  }) {
    this.sourceProperty = sourceProperty;
    this.targetProperty = targetProperty;
    this.TargetClass = TargetClass;
    this.SourceClass = SourceClass;
  }
}
