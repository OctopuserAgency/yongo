import {
  BelongsTo,
  HasOne,
  HasMany,
  Model,
  Path,
  State,
  Field } from '../../src';


@State({})
@Path('/events')
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

@State({})
@Path('/events')
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

@State({})
@Path('/events')
@HasOne(HasOneModel, { property: 'hasOne' })
@HasMany(HasManyModel, { property: 'hasMany' })
class Root extends Model {
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
