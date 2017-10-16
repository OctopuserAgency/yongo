import HasMany from '../associations/has-many';
import Model from '../model';

export default function HasManyDecorator(TargetClass: typeof Model, { property }: any) {
  return (SourceClass: typeof Model) => {
    Model.addAssociation(new HasMany({
      property,
      SourceClass,
      TargetClass,
    }));
  };
}
