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
}

@Path('/hasmany')
class HasManyToOne extends Model {
}

@Path('/hasmany')
class HasOneToOne extends Model {
}

@Path('/hasmany')
class HasOneToMany extends Model {
}

@Path('/roots')
@ManyToMany(HasManyToMany, { sourceProperty: 'hasManyToMany', targetProperty: 'manyToManyRoots' })
@ManyToOne(HasManyToOne, { sourceProperty: 'hasManyToOne', targetProperty: 'manyToOneRoot' })
@OneToOne(HasOneToOne, { sourceProperty: 'hasOneToOne', targetProperty: 'oneToOneRoot' })
@OneToMany(HasOneToMany, { sourceProperty: 'hasOneToMany', targetProperty: 'oneToManyRoots' })
class Root extends Model {
}


export { Root, HasManyToMany, HasManyToOne, HasOneToOne, HasOneToMany };
