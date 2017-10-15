import Association from './association';
import Model from './model';

export default function HasMany(targetClass: typeof Model, options: any) {
  return (target) => {
    target.addAssociation(target.name, new Association({
      isList: true,
      property: options.property,
      targetClass,
    }));
  };
}
