import ManyToOne from '../associations/many-to-one';
import OneToMany from '../associations/one-to-many';
import Model from '../model';

export default function HasManyDecorator(
  TargetClass: typeof Model,
  { sourceProperty, targetProperty }: any,
) {
  return (SourceClass: typeof Model) => {
    Model.addAssociation(new ManyToOne({
      sourceProperty,
      targetProperty,
      SourceClass,
      TargetClass,
    }));
    Model.addAssociation(new OneToMany({
      sourceProperty: targetProperty,
      targetProperty: sourceProperty,
      SourceClass: TargetClass,
      TargetClass: SourceClass,
    }));
  };
}
