import Association from '../association';

export default function applyAssociation(object, association: Association) {
  const TargetClass = association.targetClass;
  if (association.isList) {
    console.log(object, association, object[association.property])
    const list = object[association.property];
    object[association.property] = list.map((item) => {
      const insertObject = new TargetClass(item);
      TargetClass.reactFunction(TargetClass.getState(), item.id, insertObject);
      return item.id;
    });
  } else {
    const insertObject = new TargetClass(object[association.property]);
    TargetClass.reactFunction(TargetClass.getState(), insertObject.id, insertObject);
    object[association.property] = insertObject.id;
  }
}
