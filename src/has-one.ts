import Association from './association';
import Model from './model';

export default function HasOne(targetClass: typeof Model, options: any) {
  return (target) => {
    target.addAssociation(target.name, new Association({
      isList: false,
      property: options.property,
      targetClass,
    }));
  };
}
