import axios from 'axios';
import * as sinon from 'sinon';
import * as dream from 'dreamjs';
import Yongo, {
  HasOne,
  HasMany,
  Model,
  Path,
  Field } from './src';


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

@Path('/events')
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

const mockedResponse = dream
  .schema({
    id: Number,
    field1: String,
    field2: Number,
    field3: Date,
    hasOne: {
      id: Number,
      field1: String,
      field2: Number,
      field3: Date,
    },
    hasMany: [
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

debugger;
Root.fetch().then(() => {
  console.log('finished');
});
