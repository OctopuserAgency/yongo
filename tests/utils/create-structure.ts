import {
  ManyToMany,
  ManyToOne,
  OneToOne,
  OneToMany,
  Model,
  Path,
  Field } from '../../src';


@Path('/hasone')
class HasManyToMany extends Model {
  @Field('default')
  field1;
  @Field(2)
  field2;
  @Field(new Date())
  field3;
}

@Path('/hasmany')
class HasManyToOne extends Model {
  @Field('default')
  field1;
  @Field(2)
  field2;
  @Field(new Date())
  field3;
}

@Path('/hasmany')
class HasOneToOne extends Model {
  @Field('default')
  field1;
  @Field(2)
  field2;
  @Field(new Date())
  field3;
}

@Path('/hasmany')
class HasOneToMany extends Model {
  @Field('default')
  field1;
  @Field(2)
  field2;
  @Field(new Date())
  field3;
}

@Path('/roots')
@ManyToMany(HasManyToMany, { sourceProperty: 'hasManyToMany', targetProperty: 'manyToManyRoots' })
@ManyToOne(HasManyToOne, { sourceProperty: 'hasManyToOne', targetProperty: 'manyToOneRoot' })
@OneToOne(HasOneToOne, { sourceProperty: 'hasOneToOne', targetProperty: 'oneToOneRoot' })
@OneToMany(HasOneToMany, { sourceProperty: 'hasOneToMany', targetProperty: 'oneToManyRoots' })
class Root extends Model {
  @Field('default')
  field1;
  @Field(2)
  field2;
  @Field(new Date())
  field3;
}


export { Root, HasManyToMany, HasManyToOne, HasOneToOne, HasOneToMany };
