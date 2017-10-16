import {
  HasOne,
  HasMany,
  Model,
  Path,
  Field } from '../../src';


@Path('/hasone')
class HasOneModel extends Model {
  @Field()
  city;
  @Field()
  field1;
  @Field()
  language;
  @Field()
  totalPlaces;
  @Field()
  description;
}

@Path('/hasmany')
class HasManyModel extends Model {
  @Field()
  city;
  @Field()
  field1;
  @Field()
  language;
  @Field()
  totalPlaces;
  @Field()
  description;
}

@Path('/roots')
@HasMany(HasManyModel, { property: 'hasMany' })
@HasOne(HasOneModel, { property: 'hasOne' })
class Root extends Model {
  hasOne;
  hasMany;
  @Field()
  city;
  @Field()
  field1;
  @Field()
  language;
  @Field()
  totalPlaces;
  @Field()
  description;
}


export { Root, HasManyModel, HasOneModel };
