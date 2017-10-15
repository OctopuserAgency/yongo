import Association from './association';

export default function BelongsToMany(targetClass) {
  return (target) => {
    const pluralEnding = target.name.endsWith('s') ? 'es' : 's';
    const plural = `${target.name.toLowerCase()}${pluralEnding}`;
    targetClass.addAssociation(new Association({
      isList: true,
      property: plural,
      class: target,
    }));
  };
}
