import Axios from 'axios';
import frameworkDetect from './framework-detect';

export default function setConfig(targetClass, config) {
  if (config.baseUrl) {
    targetClass.server = Axios.create({
      baseURL: config.baseUrl,
    });
  }
  if (config.framework) {
    switch (frameworkDetect(config.framework)) {
      case 'Vue':
        targetClass.reactFunction = config.framework.set;
        break;
      default:
        targetClass.reactFunction = (object, property, value) =>
          Object.defineProperty(object, property, { value });
        break;
    }
  }
  targetClass.stateManager = config.stateManager;
}
