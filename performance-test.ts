import axios from 'axios';
import * as sinon from 'sinon';
import * as dream from 'dreamjs';

import Yongo, {
  ManyToMany,
  ManyToOne,
  OneToOne,
  Model,
  Path,
  Field } from './src';


@Path('/hasone')
class HasManyToMany extends Model {
}

@Path('/hasmany')
class HasManyToOne extends Model {
}

@Path('/hasmany')
class HasOneToOne extends Model {
}

@Path('/roots')
@ManyToMany(HasManyToMany, { sourceProperty: 'hasManyToMany', targetProperty: 'manyToManyRoots' })
@ManyToOne(HasManyToOne, { sourceProperty: 'hasManyToOne', targetProperty: 'manyToOneRoot' })
@OneToOne(HasOneToOne, { sourceProperty: 'hasOneToOne', targetProperty: 'oneToOneRoot' })
/* @HasOne(HasOneModel, { property: 'hasOne' })
@BelongsTo(HasOneModel, { property: 'root' })
@BelongsToMany(HasManyModel, { property: 'roots' }) */
class Root extends Model {
}

const mockedResponse = dream
  .schema({
    id: Number,
    field1: String,
    field2: Number,
    field3: Date,
    hasOneToMany: {
      id: Number,
      field1: String,
      field2: Number,
      field3: Date,
    },
    hasOneToOne: {
      id: Number,
      field1: String,
      field2: Number,
      field3: Date,
    },
    hasManyToMany: [
      {
        id: Number,
        field1: String,
        field2: Number,
        field3: Date,
      },
      {
        id: Number,
        field1: String,
        field2: Number,
        field3: Date,
      },
      {
        id: Number,
        field1: String,
        field2: Number,
        field3: Date,
      },
    ],
    hasManyToOne: [
      {
        id: Number,
        field1: String,
        field2: Number,
        field3: Date,
      },
      {
        id: Number,
        field1: String,
        field2: Number,
        field3: Date,
      },
      {
        id: Number,
        field1: String,
        field2: Number,
        field3: Date,
      },
    ],
  }).generateRnd(100000).output();


const spy = sinon.stub(axios, 'create').returns({
  get() {
    return Promise.resolve({ data: mockedResponse });
  },
});
Yongo.setConfig({
  baseUrl: 'https://bsaseUrl',
});

Root.fetch().then(() => {
  console.log('finished');
});

debugger;

for (let i = 0; i < 10000000000; i += 1) {
  console.log('hey');
}
