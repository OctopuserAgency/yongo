import * as chai from 'chai';
import axios from 'axios';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import Yongo, { Model } from '../src';
import { Root, HasManyToOne, HasManyToMany } from './utils/create-structure';
import mockedResponse from './utils/mocked-response';

chai.use(sinonChai);
const { expect } = chai;

describe('Model class', function ModelClass() {
  let mockedStructure;
  let serverAxios;
  let xhr;

  this.timeout(50000);

  before(() => {
    mockedStructure = mockedResponse();
    serverAxios = {
      get() {
        return Promise.resolve({ data: mockedStructure });
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

  after(() => {
    sinon.restore(serverAxios);
    sinon.restore(axios.create);
  });

  it('save should call to put', async () => {
    const roots = await Root.fetch();
    const root = Root.getState()[mockedStructure[0].id];
    root.field1 = 'HEEY';
    root.save();
    expect(serverAxios.put).to.have.been.calledWith(`/roots/${root.id}`, { field1: 'HEEY' });
  });
  it('insert should call to post', async () => {
    const rootToCreate = {
      field1: 'string',
      field2: 2,
      field3: new Date(),
      hasManyToMany: [1, 2, 3],
      hasManyToOne: {},
      hasOneToMany: undefined,
      hasOneToOne: [1],
    };
    const root = new Root(rootToCreate);
    await root.insert();
    expect(serverAxios.post).to.have.been.calledWith('/roots', rootToCreate);
  });
  it('delete should call to delete', async () => {
    const roots = await Root.fetch();
    const root = Root.getState()[mockedStructure[0].id];
    root.field1 = 'HEEY';
    root.delete();
    expect(serverAxios.delete).to.have.been.calledWith(`/roots/${root.id}`);
  });
});
