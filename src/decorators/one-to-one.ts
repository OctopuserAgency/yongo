import OneToOne from '../associations/one-to-one';
import Model from '../model';

export default function HasManyDecorator(
  TargetClass: typeof Model,
  { sourceProperty, targetProperty }: any,
) {
  return (SourceClass: typeof Model) => {
    Model.addAssociation(new OneToOne({
      sourceProperty,
      targetProperty,
      SourceClass,
      TargetClass,
    }));
    Model.addAssociation(new OneToOne({
      sourceProperty: targetProperty,
      targetProperty: sourceProperty,
      SourceClass: TargetClass,
      TargetClass: SourceClass,
    }));
  };
}
