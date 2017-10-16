import Model from '../model';

export default class Association {
  public property: string;
  public TargetClass: typeof Model;
  public SourceClass: typeof Model;
  constructor({
    property, SourceClass, TargetClass,
  }) {
    this.property = property;
    this.TargetClass = TargetClass;
    this.SourceClass = SourceClass;
  }
}
