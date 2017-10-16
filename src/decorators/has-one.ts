import HasOne from '../associations/has-one';
import Model from '../model';

export default function HasOneDecorator(TargetClass: typeof Model, { property }: any) {
  return (SourceClass: typeof Model) => {
    Model.addAssociation(new HasOne({
      property,
      SourceClass,
      TargetClass,
    }));
  };
}
