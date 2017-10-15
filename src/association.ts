import Model from './model';

export default class Association {
  property: string;
  isList: boolean;
  targetClass: typeof Model;
  constructor(options) {
    this.property = options.property;
    this.isList = options.isList;
    this.targetClass = options.targetClass;
  }
}
