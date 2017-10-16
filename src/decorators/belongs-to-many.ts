import HasMany from '../associations/has-many';
import Model from '../model';

export default function BelongsToManyDecorator(SourceClass, { property }) {
  return (TargetClass: typeof Model) => {
    Model.addAssociation(new HasMany({
      property,
      SourceClass,
      TargetClass,
    }));
  };
}
