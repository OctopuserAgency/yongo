import ManyToMany from '../associations/many-to-many';
import Model from '../model';

export default function HasManyDecorator(
  TargetClass: typeof Model,
  { sourceProperty, targetProperty }: any,
) {
  return (SourceClass: typeof Model) => {
    Model.addAssociation(new ManyToMany({
      sourceProperty,
      targetProperty,
      SourceClass,
      TargetClass,
    }));
    Model.addAssociation(new ManyToMany({
      sourceProperty: targetProperty,
      targetProperty: sourceProperty,
      SourceClass: TargetClass,
      TargetClass: SourceClass,
    }));
  };
}
