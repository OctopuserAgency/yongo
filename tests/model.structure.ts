import * as chai from 'chai';
import axios from 'axios';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as dream from 'dreamjs';
import Yongo, { Model } from '../src';
import { Root, HasManyToOne, HasManyToMany, HasOneToOne, HasOneToMany } from './utils/create-structure';
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
  describe('Fetching a model', () => {
    it('Fetching a model, his state should be populated', () => Root.fetch().then(() =>
      mockedStructure
        .forEach((root) => {
          expect(root.id).to.equal(Root.getState().findById(root.id).id);
        })));
    it('related ManyToOne states should be populated', () => Root.fetch().then(() => {
      Root.getState().getList()
        .forEach((root) => {
          Object.keys(root.hasManyToOne).map(key => root.hasManyToOne[key])
            .forEach((hasManyToOne) => {
              expect(hasManyToOne).to.equal(HasManyToOne.getState()[hasManyToOne.id]);
            });
        });
    }));
    it('related OneToOne states should be populated', () => Root.fetch().then(() => {
      Root.getState().getList()
        .forEach((root) => {
          expect(root.hasOneToOne).to.equal(HasOneToOne.getState()[root.hasOneToOne.id]);
          expect(root.hasOneToOne.oneToOneRoot).to.equal(root);
        });
    }));
    it('related ManyToMany states should be populated', () => Root.fetch().then(() => {
      Root.getState().getList()
        .forEach(root => Object.keys(root.hasManyToMany).map(key => root.hasManyToMany[key])
          .forEach((hasManyToMany) => {
            expect(hasManyToMany).to.equal(HasManyToMany.getState()[hasManyToMany.id]);
            Object.keys(hasManyToMany.manyToManyRoots)
              .map(key => hasManyToMany.manyToManyRoots[key])
              .forEach(root2 => expect(root).to.equal(root2));
          }));
    }));
    it('related OneToMany states should be populated', () => {
      Root.getState().getList()
        .forEach((root) => {
          expect(root.hasOneToMany).to.equal(HasOneToMany.getState()[root.hasOneToMany.id]);
          const { oneToManyRoots } = root.hasOneToMany;
          Object.keys(oneToManyRoots).map(key => oneToManyRoots[key]).forEach((root2) => {
            // console.log(root2, Root.getState()[root2.id]);
            expect(root2).to.equal(Root.getState()[root2.id]);
          });
        });
    });
    it('related associations should respect statuses on object if they exists on db');
    it('related associations should be populated when targets are populated');
  });
});
