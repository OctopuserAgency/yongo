(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("axios"));
	else if(typeof define === 'function' && define.amd)
		define("promise-handler", ["axios"], factory);
	else if(typeof exports === 'object')
		exports["promise-handler"] = factory(require("axios"));
	else
		root["promise-handler"] = factory(root["axios"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_7__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var state_manager_1 = __webpack_require__(4);
/*
this is the main Class (almost static) that allows us to
configure server in case of REST API configuration or reactive
functions (Vue)
*/
var yongo_1 = __webpack_require__(1);
var Model = /** @class */ (function () {
    function Model(data) {
        if (data === void 0) { data = {}; }
        var _this = this;
        this.className = '';
        this.className = this.constructor.name;
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
    Model.fetch = function () {
        var _this = this;
        if (yongo_1.default.server) {
            return yongo_1.default.server.get(this.prototype.path)
                .then(function (response) { return _this.getState().addList(response.data, "fetch" + _this.name); });
        }
        return Promise.reject(new Error('There is no server configured'));
    };
    Model.getState = function () {
        return this.stateManager.getState(this);
    };
    Model.addAssociation = function (association) {
        Model.getAssociations(association.SourceClass.name).push(association);
    };
    Model.getAssociations = function (className) {
        if (this.associations[className]) {
            return this.associations[className];
        }
        this.associations[className] = [];
        return this.associations[className];
    };
    Model.prototype.populate = function () {
        var _this = this;
        Model.getAssociations(this.className)
            .forEach(function (association) { return association.apply(_this); });
    };
    Model.prototype.save = function () {
        return yongo_1.default.server.post(this.path, JSON.parse(JSON.stringify(this)));
    };
    Model.associations = {};
    Model.stateManager = new state_manager_1.default();
    Model.paths = {};
    Model.states = {};
    return Model;
}());
exports.default = Model;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var set_config_1 = __webpack_require__(6);
var Yongo = /** @class */ (function () {
    function Yongo() {
    }
    Yongo.setConfig = function (config) {
        if (config === void 0) { config = {}; }
        set_config_1.default(this, config);
    };
    return Yongo;
}());
Yongo.setConfig();
exports.default = Yongo;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Association = /** @class */ (function () {
    function Association(_a) {
        var property = _a.property, SourceClass = _a.SourceClass, TargetClass = _a.TargetClass;
        this.property = property;
        this.TargetClass = TargetClass;
        this.SourceClass = SourceClass;
    }
    return Association;
}());
exports.default = Association;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var model_1 = __webpack_require__(0);
exports.Model = model_1.default;
var has_many_1 = __webpack_require__(9);
exports.HasMany = has_many_1.default;
var has_one_1 = __webpack_require__(11);
exports.HasOne = has_one_1.default;
var path_1 = __webpack_require__(13);
exports.Path = path_1.default;
var field_1 = __webpack_require__(14);
exports.Field = field_1.default;
var yongo_1 = __webpack_require__(1);
exports.default = yongo_1.default;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = __webpack_require__(5);
var StateManager = /** @class */ (function () {
    function StateManager() {
        this.states = {};
        this.stateHandler = {
            ownKeys: function (target) {
                var privateFields = ['Class', 'stateHandler'];
                var keys = Object.keys(target);
                privateFields.forEach(function (privateField) { return keys.splice(keys.indexOf(privateField), 1); });
                return keys;
            },
        };
    }
    StateManager.prototype.getState = function (ModelClass) {
        if (!this.states[ModelClass.name]) {
            var state = new state_1.default(ModelClass);
            this.states[ModelClass.name] = new Proxy(state, this.stateHandler);
        }
        return this.states[ModelClass.name];
    };
    return StateManager;
}());
exports.default = StateManager;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var yongo_1 = __webpack_require__(1);
var State = /** @class */ (function () {
    function State(Class) {
        this.stateHandler = {
            set: function (target, property, value) {
                console.log(target, property, value);
                return true;
            },
        };
        this.Class = Class;
    }
    State.prototype.addObject = function (payload, method) {
        var object = new this.Class(payload);
        object.populate();
        var proxy = new Proxy(object, this.stateHandler);
        if (!yongo_1.default.reactFunction) {
            this[object.id] = object;
        }
        else {
            yongo_1.default.reactFunction(this, object.id, object);
        }
        return object;
    };
    State.prototype.addList = function (payload, method) {
        var instances = [];
        for (var index = 0; index < payload.length; index += 1) {
            var object = new this.Class(payload[index]);
            object.populate();
            var proxy = new Proxy(object, this.stateHandler);
            instances.push(object);
            if (!yongo_1.default.reactFunction) {
                this[object.id] = object;
            }
            else {
                yongo_1.default.reactFunction(this, object.id, object);
            }
        }
        return instances;
    };
    return State;
}());
exports.default = State;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __webpack_require__(7);
var framework_detect_1 = __webpack_require__(8);
function setConfig(targetClass, config) {
    if (config.baseUrl) {
        targetClass.server = axios_1.default.create({
            baseURL: config.baseUrl,
        });
    }
    if (config.framework) {
        switch (framework_detect_1.default(config.framework)) {
            case 'Vue':
                targetClass.reactFunction = config.framework.set;
                break;
            default:
                targetClass.reactFunction = function (object, property, value) {
                    return Object.defineProperty(object, property, { value: value });
                };
                break;
        }
    }
    targetClass.stateManager = config.stateManager;
}
exports.default = setConfig;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),
/* 8 */
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var has_many_1 = __webpack_require__(10);
var model_1 = __webpack_require__(0);
function HasManyDecorator(TargetClass, _a) {
    var property = _a.property;
    return function (SourceClass) {
        model_1.default.addAssociation(new has_many_1.default({
            property: property,
            SourceClass: SourceClass,
            TargetClass: TargetClass,
        }));
    };
}
exports.default = HasManyDecorator;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var association_1 = __webpack_require__(2);
var HasMany = /** @class */ (function (_super) {
    __extends(HasMany, _super);
    function HasMany(_a) {
        var property = _a.property, SourceClass = _a.SourceClass, TargetClass = _a.TargetClass;
        return _super.call(this, { property: property, SourceClass: SourceClass, TargetClass: TargetClass }) || this;
    }
    HasMany.prototype.apply = function (source) {
        source[this.property] = this.TargetClass.getState().addList(source[this.property]);
    };
    return HasMany;
}(association_1.default));
exports.default = HasMany;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var has_one_1 = __webpack_require__(12);
var model_1 = __webpack_require__(0);
function HasOneDecorator(TargetClass, _a) {
    var property = _a.property;
    return function (SourceClass) {
        model_1.default.addAssociation(new has_one_1.default({
            property: property,
            SourceClass: SourceClass,
            TargetClass: TargetClass,
        }));
    };
}
exports.default = HasOneDecorator;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var association_1 = __webpack_require__(2);
var HasOne = /** @class */ (function (_super) {
    __extends(HasOne, _super);
    function HasOne(_a) {
        var property = _a.property, SourceClass = _a.SourceClass, TargetClass = _a.TargetClass;
        return _super.call(this, { property: property, SourceClass: SourceClass, TargetClass: TargetClass }) || this;
    }
    HasOne.prototype.apply = function (source) {
        source[this.property] = this.TargetClass.getState().addObject(source);
    };
    return HasOne;
}(association_1.default));
exports.default = HasOne;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function Path(path) {
    return function (target) { target.paths[target.name] = path; };
}
exports.default = Path;


/***/ }),
/* 14 */
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