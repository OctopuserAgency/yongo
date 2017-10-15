(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("axios"));
	else if(typeof define === 'function' && define.amd)
		define("promise-handler", ["axios"], factory);
	else if(typeof exports === 'object')
		exports["promise-handler"] = factory(require("axios"));
	else
		root["promise-handler"] = factory(root["axios"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_4__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Association = /** @class */ (function () {
    function Association(options) {
        this.property = options.property;
        this.isList = options.isList;
        this.targetClass = options.targetClass;
    }
    return Association;
}());
exports.default = Association;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var model_1 = __webpack_require__(2);
exports.Model = model_1.default;
var has_many_1 = __webpack_require__(7);
exports.HasMany = has_many_1.default;
var belongs_to_many_1 = __webpack_require__(8);
exports.BelongsToMany = belongs_to_many_1.default;
var belongs_to_1 = __webpack_require__(9);
exports.BelongsTo = belongs_to_1.default;
var has_one_1 = __webpack_require__(10);
exports.HasOne = has_one_1.default;
var path_1 = __webpack_require__(11);
exports.Path = path_1.default;
var state_1 = __webpack_require__(12);
exports.State = state_1.default;
var field_1 = __webpack_require__(13);
exports.Field = field_1.default;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var set_config_1 = __webpack_require__(3);
var apply_association_1 = __webpack_require__(6);
var Model = /** @class */ (function () {
    function Model(data) {
        if (data === void 0) { data = {}; }
        var _this = this;
        this.className = '';
        this.className = this.constructor['name'];
        this.path = Model.paths[this.className];
        if (Model.associations[this.className]) {
            Model.associations[this.className].forEach(function (association) {
                if (association.isList) {
                    _this[association.name] = [];
                }
            });
        }
        Object.keys(data).forEach(function (key) {
            _this[key] = data[key];
        });
    }
    Model.setConfig = function (config) {
        set_config_1.default(this, config);
    };
    Model.fetch = function () {
        var _this = this;
        if (this.server) {
            return this.server.get(this.prototype.path)
                .then(function (response) {
                return _this.addListToState("fetch" + _this['name'], response.data);
            });
        }
        return Promise.reject(new Error('There is no server configured'));
    };
    Model.getState = function () {
        if (this.states[this['name']]) {
            return this.states[this['name']];
        }
        else {
            this.states[this['name']] = {};
            return this.states[this['name']];
        }
    };
    Model.addAssociation = function (className, association) {
        this.getAssociations(className).push(association);
    };
    Model.getAssociations = function (className) {
        if (this.associations[className]) {
            return this.associations[className];
        }
        this.associations[className] = [];
        return this.associations[className];
    };
    Model.addToState = function (method, payload) {
        if (this.stateManager) {
            this.stateManager.commit(method, payload);
        }
        else {
            this.reactFunction(this.getState(), payload.id, payload);
        }
    };
    Model.addListToState = function (method, payload) {
        var _this = this;
        if (this.stateManager) {
            return this.stateManager.commit(method, payload);
        }
        else {
            payload.forEach(function (item) {
                var object = new _this(item);
                object.populate();
                _this.reactFunction(_this.getState(), item.id, object);
            });
            return this.getState();
        }
    };
    Model.prototype.populate = function () {
        var _this = this;
        Model.getAssociations(this.className).forEach(function (association) { return apply_association_1.default(_this, association); });
    };
    Model.prototype.save = function () {
        return Model.server.post(this.path, JSON.parse(JSON.stringify(this)));
    };
    Model.associations = {};
    Model.paths = {};
    Model.states = {};
    return Model;
}());
exports.default = Model;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __webpack_require__(4);
var framework_detect_1 = __webpack_require__(5);
function setConfig(model, config) {
    if (config.baseUrl) {
        model.server = axios_1.default.create({
            baseURL: config.baseUrl,
        });
    }
    if (config.framework) {
        switch (framework_detect_1.default(config.framework)) {
            case 'Vue':
                model.reactFunction = config.framework.set;
                break;
            default:
                model.reactFunction = function (object, property, value) { return Object.defineProperty(object, property, { value: value }); };
                break;
        }
    }
    else {
        model.reactFunction = function (object, property, value) {
            object[property] = value;
            return object;
        };
    }
    model.stateManager = config.stateManager;
}
exports.default = setConfig;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function frameworkDetect(framework) {
    if (framework.name.indexOf('Vue') >= -1) {
        return 'Vue';
    }
    return null;
}
exports.default = frameworkDetect;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function applyAssociation(object, association) {
    var TargetClass = association.targetClass;
    if (association.isList) {
        console.log(object, association, object[association.property]);
        var list = object[association.property];
        object[association.property] = list.map(function (item) {
            var insertObject = new TargetClass(item);
            TargetClass.reactFunction(TargetClass.getState(), item.id, insertObject);
            return item.id;
        });
    }
    else {
        var insertObject = new TargetClass(object[association.property]);
        TargetClass.reactFunction(TargetClass.getState(), insertObject.id, insertObject);
        object[association.property] = insertObject.id;
    }
}
exports.default = applyAssociation;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var association_1 = __webpack_require__(0);
function HasMany(targetClass, options) {
    return function (target) {
        target.addAssociation(target.name, new association_1.default({
            isList: true,
            property: options.property,
            targetClass: targetClass,
        }));
    };
}
exports.default = HasMany;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var association_1 = __webpack_require__(0);
function BelongsToMany(targetClass) {
    return function (target) {
        var pluralEnding = target.name.endsWith('s') ? 'es' : 's';
        var plural = "" + target.name.toLowerCase() + pluralEnding;
        targetClass.addAssociation(new association_1.default({
            isList: true,
            property: plural,
            class: target,
        }));
    };
}
exports.default = BelongsToMany;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var association_1 = __webpack_require__(0);
function BelongsTo(targetClass) {
    return function (target) {
        console.log(target);
        var singular = target.name.toLowerCase();
        targetClass.addAssociation(new association_1.default({
            isList: false,
            property: singular,
            class: target,
        }));
    };
}
exports.default = BelongsTo;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var association_1 = __webpack_require__(0);
function HasOne(targetClass, options) {
    return function (target) {
        target.addAssociation(target.name, new association_1.default({
            isList: false,
            property: options.property,
            targetClass: targetClass,
        }));
    };
}
exports.default = HasOne;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function Path(path) {
    return function (target) { target.paths[target['name']] = path; };
}
exports.default = Path;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function State(state) {
    if (state === void 0) { state = {}; }
    return function (target) {
        target.prototype.state = state;
    };
}
exports.default = State;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function Field() {
    return function (target, property) {
    };
}
exports.default = Field;


/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map