import setConfig from './utils/set-config';
import Model from './model';

class Yongo {
 public static server;
 public static reactFunction;
 public static stateManager;
 public static setConfig(config = {}) {
   setConfig(this, config);
 }
}

Yongo.setConfig();

export default Yongo;
