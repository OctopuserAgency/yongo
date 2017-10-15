import Axios from 'axios';
import frameworkDetect from './framework-detect';

export default function setConfig(model, config) {
  if (config.baseUrl) {
    model.server = Axios.create({
      baseURL: config.baseUrl,
    });
  }
  if (config.framework) {
    switch (frameworkDetect(config.framework)) {
      case 'Vue':
        model.reactFunction = config.framework.set;
        break;
      default:
        model.reactFunction = (object, property, value) => Object.defineProperty(object, property, { value });
        break;
    }
  } else {
    model.reactFunction = (object, property, value) =>{
      object[property] = value;
      return object;
    };
  }
  model.stateManager = config.stateManager;
}
