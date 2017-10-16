import * as chai from 'chai';
import axios from 'axios';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as dream from 'dreamjs';
import Yongo, { Model } from '../src';
import { Root, HasOneModel, HasManyModel } from './utils/create-structure';

chai.use(sinonChai);
const { expect } = chai;

describe('Model class', function ModelClass() {
  let mockedResponse;
  let serverAxios;
  let xhr;

  this.timeout(50000);

  before(() => {
    console.log('generating');
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
        ],
      }).generateRnd(10).output();
    serverAxios = {
      get() {
        return Promise.resolve({ data: mockedResponse });
      },
      post(url, payload) {
        return Promise.resolve({ data: payload });
      },
      put(url, payload) {
        return Promise.resolve({ data: payload });
      },
      delete(url, payload) {
        return Promise.resolve({ data: payload });
      },
    };
    sinon.spy(serverAxios, 'post');
    sinon.spy(serverAxios, 'put');
    sinon.spy(serverAxios, 'delete');
    const spy = sinon.stub(axios, 'create').returns(serverAxios);
    Yongo.setConfig({
      baseUrl: 'https://baseUrl',
    });
  });

  it('Fetching a model, his state should be populated', () => Root.fetch().then(() =>
    mockedResponse
      .forEach((root) => {
        expect(root.id).to.equal(Root.getState()[root.id].id);
      })));
  it('Fetching a model, related HasOne states should be populated', () => Root.fetch().then(() => {
    Object.keys(Root.getState()).map(key => Root.getState()[key])
      .forEach(root => expect(root.hasOne).to.equal(HasOneModel.getState()[root.hasOne.id]));
  }));
  it('Fetching a model, related HasMany states should be populated', () => Root.fetch().then(() => {
    Object.keys(Root.getState()).map(key => Root.getState()[key])
      .forEach(root => root.hasMany.forEach(hasMany =>
        expect(hasMany).to.equal(HasManyModel.getState()[hasMany.id])));
  }));
  it('save should call to put', async () => {
    const roots = await Root.fetch();
    const root = Root.getState()[mockedResponse[0].id];
    root.field1 = 'HEEY';
    root.save();
    expect(serverAxios.put).to.have.been.calledWith(`/roots/${root.id}`, { field1: 'HEEY' });
  });
  it('insert should call to post', async () => {
    const rootToCreate = mockedResponse[0];
    delete rootToCreate.id;
    const root = new Root(rootToCreate);
    root.insert();
    expect(serverAxios.post).to.have.been.calledWith('/roots', JSON.parse(JSON.stringify(root)));
  });
  it('delete should call to delete', async () => {
    const roots = await Root.fetch();
    const root = Root.getState()[mockedResponse[0].id];
    root.field1 = 'HEEY';
    root.delete();
    expect(serverAxios.delete).to.have.been.calledWith(`/roots/${root.id}`);
  });
});
