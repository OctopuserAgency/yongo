import Association from './association';

export default function BelongsTo(targetClass) {
  return (target) => {
    console.log(target)
    const singular = target.name.toLowerCase();
    targetClass.addAssociation(new Association({
      isList: false,
      property: singular,
      class: target,
    }));
  };
}
