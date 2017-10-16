import HasOne from '../associations/has-one';
import Model from '../model';

export default function BelongsToDecorator(SourceClass, { property }) {
  return (TargetClass: typeof Model) => {
    Model.addAssociation(new HasOne({
      property,
      SourceClass,
      TargetClass,
    }));
  };
}
