import { expect } from 'chai';
import axios from 'axios';
import * as sinon from 'sinon';
import dream = require ('dreamjs');
import { Root, HasOneModel, HasManyModel } from './utils/create-structure';
import { Model } from '../src';

describe('Model class', () => {
  let mockedResponse;
  let xhr;
  before(() => {
    mockedResponse = dream
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
        ]
      }).generateRnd(10).output();
    const spy = sinon.stub(axios, 'create').returns({
      get() {
        return Promise.resolve({ data: mockedResponse });
      }
    });
    Model.setConfig({
      baseUrl: 'https://baseUrl',
    });
  });

  it('state should be populated', () => {
    return Root.fetch().then(() => {
      (<any>Object).values(Root.getState()).forEach(
        (root) => {
          expect(root.hasOne).to.equal(HasOneModel.getState()[root.hasOne.id].id);
        }
      )
    })
  });
  it('structure should be complete');
  it('save should call to post')
});
