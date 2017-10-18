import Model from '../model';

export default function Field(defaultValue) {
  return (target: any, property: string | symbol) => {
    (<typeof Model> target.constructor).addField(property, defaultValue);
  };
}
