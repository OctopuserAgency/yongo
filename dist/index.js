(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("axios"));
	else if(typeof define === 'function' && define.amd)
		define("promise-handler", ["axios"], factory);
	else if(typeof exports === 'object')
		exports["promise-handler"] = factory(require("axios"));
	else
		root["promise-handler"] = factory(root["axios"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_9__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var state_manager_1 = __webpack_require__(6);
/*
this is the main Class (almost static) that allows us to
configure server in case of REST API configuration or reactive
functions (Vue)
*/
var yongo_1 = __webpack_require__(2);
var Model = /** @class */ (function () {
    function Model(data) {
        if (data === void 0) { data = undefined; }
        var _this = this;
        this.className = '';
        this.modifiedFields = {};
        this.activationHandler = {};
        this.actualHandler = {};
        this.syncStatus = {
            updating: false,
            creating: false,
            deleting: false,
            pending: {
                save: false,
                create: true,
            },
            synced: false,
        };
        this.className = this.constructor.name;
        this.path = Model.paths[this.className];
        if (data.id) {
            this.id = data.id;
        }
        if (data && Model.fields[this.className]) {
            Object.keys(Model.fields[this.className]).forEach(function (key) {
                if (data[key]) {
                    _this[key] = data[key];
                }
                else {
                    _this[key] = Model.fields[_this.className].defaultValue;
                }
            });
        }
        var associations = Model.associations[this.className];
        for (var index = 0; index < associations.length; index += 1) {
            var associationField = associations[index].sourceProperty;
            this[associationField] = data[associationField];
        }
    }
    Model.fetch = function () {
        var _this = this;
        if (yongo_1.default.server) {
            return yongo_1.default.server.get(this.prototype.path)
                .then(function (response) { return _this.getState().addList(response.data, "fetch" + _this.name); });
        }
        return Promise.reject(new Error('There is no server configured'));
    };
    Model.addField = function (field, defaultValue) {
        if (!Model.fields[this.name]) {
            Model.fields[this.name] = {};
        }
        if (defaultValue) {
            Model.fields[this.name][field] = {
                defaultValue: defaultValue,
            };
        }
    };
    Model.getState = function () {
        return this.stateManager.getState(this);
    };
    Model.addAssociation = function (association) {
        if (!Model.associations[association.SourceClass.name]) {
            Model.associations[association.SourceClass.name] = [];
        }
        Model.stateManager.getState(association.SourceClass);
        Model.associations[association.SourceClass.name].push(association);
    };
    Model.getAssociations = function (className) {
        if (this.associations[className]) {
            return this.associations[className];
        }
        this.associations[className] = [];
        return this.associations[className];
    };
    Model.prototype.setModifiedField = function (field, value) {
        if (!this.syncStatus.pending.create) {
            this.syncStatus.pending.save = true;
            this.syncStatus.synced = false;
            this.modifiedFields[field] = value;
        }
    };
    Model.prototype.getStatus = function () {
        return this.syncStatus;
    };
    Model.prototype.getProxy = function (proxy) {
        return this.proxy;
    };
    Model.prototype.setProxy = function (proxy) {
        this.proxy = proxy;
    };
    Model.prototype.setActivationProxy = function (activationHandler, handler) {
        this.activationHandler = activationHandler;
        this.actualHandler = handler;
    };
    Model.prototype.activateProxy = function () {
        this.actualHandler.set = this.activationHandler.set;
    };
    Model.prototype.deactivateProxy = function () {
        this.actualHandler.set = undefined;
    };
    Model.prototype.populate = function () {
        var associations = Model.associations[this.className];
        for (var index = 0; index < associations.length; index += 1) {
            associations[index].apply(this);
        }
    };
    Model.prototype.save = function () {
        var _this = this;
        if (this.syncStatus.deleting) {
            throw new Error('This model is marked as deleting');
        }
        if (this.syncStatus.pending.create || this.syncStatus.synced) {
            return Promise.resolve();
        }
        this.syncStatus.updating = true;
        return yongo_1.default.server.put(this.path + "/" + this.id, this.modifiedFields)
            .then(function (response) {
            _this.syncStatus.updating = false;
            return response;
        });
    };
    Model.prototype.insert = function () {
        var _this = this;
        if (this.syncStatus.synced) {
            throw new Error('The model is already synced.');
        }
        var associations = Model.associations[this.className];
        var createModels = [];
        var sendingModel = {};
        Object.assign(sendingModel, this.getSimplifiedObject());
        this.syncStatus.pending.create = false;
        this.syncStatus.creating = true;
        associations.forEach(function (association) {
            if (!sendingModel[association.sourceTarget]) {
                return;
            }
            if (association.isSourceList) {
                var keys = Object.keys(sendingModel[association.sourceTarget]);
                keys.forEach(function (key) {
                    var target = sendingModel[association.sourceTarget][key];
                    if (target.syncStatus.pending.create) {
                        createModels.push(target.insert());
                    }
                });
                sendingModel[association.sourceTarget] = keys;
            }
            else {
                sendingModel[association.sourceTarget] = sendingModel[association.sourceTarget].id;
            }
        });
        return Promise.all(createModels).then(function () { return yongo_1.default.server.post(_this.path, sendingModel)
            .then(function (response) {
            _this.syncStatus.creating = false;
            Model.stateManager.getState(_this.constructor).addModel(_this);
            return response;
        }); });
    };
    Model.prototype.delete = function () {
        var _this = this;
        if (this.syncStatus.pending.create) {
            throw new Error('The model is pending to creation.');
        }
        this.syncStatus.synced = false;
        this.syncStatus.deleting = true;
        return yongo_1.default.server.delete(this.path + "/" + this.id)
            .then(function (response) {
            _this.syncStatus.deleting = false;
            Model.stateManager.getState(_this.constructor).removeModel(_this);
            return response;
        });
    };
    Model.prototype.getSimplifiedObject = function () {
        var _this = this;
        var privateFields = ['className', 'modifiedFields', 'activationHandler', 'actualHandler', 'syncStatus', 'path'];
        var keys = Object.keys(this);
        privateFields.forEach(function (privateField) { return keys.splice(keys.indexOf(privateField), 1); });
        var simplifiedObject = {};
        keys.forEach(function (key) { simplifiedObject[key] = _this[key]; });
        return simplifiedObject;
    };
    Model.UPDATING = 'updating';
    Model.INSERTING = 'inserting';
    Model.PENDING_SAVE = 'pending_save';
    Model.PENDING_CREATE = 'pending_create';
    Model.SYNCED = 'synced';
    Model.associations = {};
    Model.paths = {};
    Model.states = {};
    Model.stateManager = new state_manager_1.default();
    Model.fields = {};
    return Model;
}());
exports.default = Model;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Association = /** @class */ (function () {
    function Association(_a) {
        var sourceProperty = _a.sourceProperty, targetProperty = _a.targetProperty, SourceClass = _a.SourceClass, TargetClass = _a.TargetClass;
        this.sourceProperty = sourceProperty;
        this.targetProperty = targetProperty;
        this.TargetClass = TargetClass;
        this.SourceClass = SourceClass;
    }
    return Association;
}());
exports.default = Association;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var set_config_1 = __webpack_require__(8);
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
/* 3 */
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
var association_1 = __webpack_require__(1);
var model_1 = __webpack_require__(0);
var OneToMany = /** @class */ (function (_super) {
    __extends(OneToMany, _super);
    function OneToMany(_a) {
        var sourceProperty = _a.sourceProperty, targetProperty = _a.targetProperty, SourceClass = _a.SourceClass, TargetClass = _a.TargetClass;
        var _this = _super.call(this, {
            sourceProperty: sourceProperty, targetProperty: targetProperty, SourceClass: SourceClass, TargetClass: TargetClass,
        }) || this;
        _this.defaultValue = undefined;
        _this.isSourceList = false;
        return _this;
    }
    OneToMany.prototype.apply = function (source) {
        var target = source[this.sourceProperty];
        if (!target) {
            source[this.sourceProperty] = undefined;
            return;
        }
        source.deactivateProxy();
        var targetFound = model_1.default.stateManager.states[this.TargetClass.name][target.id];
        if (targetFound) {
            targetFound.deactivateProxy();
            if (!targetFound[this.targetProperty]) {
                targetFound[this.targetProperty] = {};
            }
            targetFound[this.targetProperty][source.id] = source.getProxy();
            source[this.sourceProperty] = targetFound;
            targetFound.activateProxy();
        }
        else {
            if (!target[this.targetProperty]) {
                target[this.targetProperty] = [];
            }
            target[this.targetProperty].push(source);
            var targetCreated = model_1.default.stateManager.states[this.TargetClass.name].addObject(target);
            source[this.sourceProperty] = targetCreated;
            targetCreated.activateProxy();
        }
        source.activateProxy();
    };
    return OneToMany;
}(association_1.default));
exports.default = OneToMany;


/***/ }),
/* 4 */
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
var association_1 = __webpack_require__(1);
var model_1 = __webpack_require__(0);
var ManyToOne = /** @class */ (function (_super) {
    __extends(ManyToOne, _super);
    function ManyToOne(_a) {
        var sourceProperty = _a.sourceProperty, targetProperty = _a.targetProperty, SourceClass = _a.SourceClass, TargetClass = _a.TargetClass;
        var _this = _super.call(this, {
            sourceProperty: sourceProperty, targetProperty: targetProperty, SourceClass: SourceClass, TargetClass: TargetClass,
        }) || this;
        _this.defaultValue = {};
        _this.isSourceList = true;
        return _this;
    }
    ManyToOne.prototype.apply = function (source) {
        if (!source[this.sourceProperty]) {
            source[this.sourceProperty] = {};
            return;
        }
        source.deactivateProxy();
        var listOfTargets = source[this.sourceProperty];
        if (Array.isArray(listOfTargets)) {
            source[this.sourceProperty] = {};
        }
        for (var index = 0; index < listOfTargets.length; index += 1) {
            var target = listOfTargets[index];
            var targetFound = model_1.default.stateManager.states[this.TargetClass.name][target.id];
            if (targetFound) {
                targetFound.deactivateProxy();
                targetFound[this.targetProperty] = source.getProxy();
                source[this.sourceProperty][targetFound.id] = targetFound;
                targetFound.activateProxy();
            }
            else {
                if (!target[this.targetProperty]) {
                    target[this.targetProperty] = [];
                }
                target[this.targetProperty] = source;
                var targetCreated = model_1.default.stateManager.states[this.TargetClass.name].addObject(target);
                source[this.sourceProperty][targetCreated.id] = targetCreated;
                targetCreated.activateProxy();
            }
        }
        source.activateProxy();
    };
    return ManyToOne;
}(association_1.default));
exports.default = ManyToOne;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var model_1 = __webpack_require__(0);
exports.Model = model_1.default;
var one_to_one_1 = __webpack_require__(11);
exports.OneToOne = one_to_one_1.default;
var one_to_many_1 = __webpack_require__(13);
exports.OneToMany = one_to_many_1.default;
var many_to_many_1 = __webpack_require__(14);
exports.ManyToMany = many_to_many_1.default;
var many_to_one_1 = __webpack_require__(16);
exports.ManyToOne = many_to_one_1.default;
var path_1 = __webpack_require__(17);
exports.Path = path_1.default;
var field_1 = __webpack_require__(18);
exports.Field = field_1.default;
var yongo_1 = __webpack_require__(2);
exports.default = yongo_1.default;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = __webpack_require__(7);
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var yongo_1 = __webpack_require__(2);
var State = /** @class */ (function () {
    function State(Class) {
        this.stateHandler = {
            set: function (target, property, value) {
                target.setModifiedField(property, value);
                return true;
            },
            ownKeys: function (target) {
                var privateFields = ['className', 'modifiedFields', 'activationHandler', 'actualHandler', 'syncStatus', 'path'];
                var keys = Object.keys(target);
                privateFields.forEach(function (privateField) { return keys.splice(keys.indexOf(privateField), 1); });
                return keys;
            },
        };
        this.Class = Class;
    }
    State.prototype.addModel = function (model) {
        this[model.id] = model;
    };
    State.prototype.removeModel = function (model) {
        delete this[model.id];
    };
    State.prototype.addModels = function (models) {
        for (var index = 0; index < models.length; index += 1) {
            this[models[index].id] = models[index];
        }
    };
    State.prototype.addObject = function (payload, method) {
        var object = new this.Class(payload);
        object.getStatus().pending.create = false;
        object.getStatus().synced = true;
        var handler = {};
        object.setActivationProxy(this.stateHandler, handler);
        var proxy = new Proxy(object, handler);
        proxy.setProxy(proxy);
        if (!yongo_1.default.reactFunction) {
            this[object.id] = proxy;
        }
        else {
            yongo_1.default.reactFunction(this, object.id, object);
        }
        object.populate();
        return proxy;
    };
    State.prototype.addList = function (payload, method) {
        var instances = [];
        for (var index = 0; index < payload.length; index += 1) {
            var object = new this.Class(payload[index]);
            object.getStatus().pending.create = false;
            object.getStatus().synced = true;
            var handler = {};
            object.setActivationProxy(this.stateHandler, handler);
            var proxy = new Proxy(object, handler);
            proxy.setProxy(proxy);
            if (!yongo_1.default.reactFunction) {
                this[object.id] = proxy;
            }
            else {
                yongo_1.default.reactFunction(this, object.id, object);
            }
            object.populate();
            instances.push(proxy);
        }
        return instances;
    };
    State.prototype.findById = function (id) {
        return this[id];
    };
    State.prototype.getList = function () {
        var _this = this;
        return Object.keys(this).map(function (key) { return _this[key]; });
    };
    return State;
}());
exports.default = State;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __webpack_require__(9);
var framework_detect_1 = __webpack_require__(10);
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
/* 9 */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),
/* 10 */
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var one_to_one_1 = __webpack_require__(12);
var model_1 = __webpack_require__(0);
function HasManyDecorator(TargetClass, _a) {
    var sourceProperty = _a.sourceProperty, targetProperty = _a.targetProperty;
    return function (SourceClass) {
        model_1.default.addAssociation(new one_to_one_1.default({
            sourceProperty: sourceProperty,
            targetProperty: targetProperty,
            SourceClass: SourceClass,
            TargetClass: TargetClass,
        }));
        model_1.default.addAssociation(new one_to_one_1.default({
            sourceProperty: targetProperty,
            targetProperty: sourceProperty,
            SourceClass: TargetClass,
            TargetClass: SourceClass,
        }));
    };
}
exports.default = HasManyDecorator;


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
var association_1 = __webpack_require__(1);
var model_1 = __webpack_require__(0);
var OneToOne = /** @class */ (function (_super) {
    __extends(OneToOne, _super);
    function OneToOne(_a) {
        var sourceProperty = _a.sourceProperty, targetProperty = _a.targetProperty, SourceClass = _a.SourceClass, TargetClass = _a.TargetClass;
        var _this = _super.call(this, {
            sourceProperty: sourceProperty, targetProperty: targetProperty, SourceClass: SourceClass, TargetClass: TargetClass,
        }) || this;
        _this.defaultValue = undefined;
        _this.isSourceList = false;
        return _this;
    }
    OneToOne.prototype.apply = function (source) {
        var target = source[this.sourceProperty];
        if (!target) {
            source[this.sourceProperty] = undefined;
            return;
        }
        source.deactivateProxy();
        var targetFound = model_1.default.stateManager.states[this.TargetClass.name][target.id];
        if (targetFound) {
            targetFound.deactivateProxy();
            targetFound[this.targetProperty] = source.getProxy();
            source[this.sourceProperty] = targetFound;
            targetFound.activateProxy();
        }
        else {
            target[this.targetProperty] = source;
            var targetCreated = model_1.default.stateManager.states[this.TargetClass.name].addObject(target);
            source[this.sourceProperty] = targetCreated;
            targetCreated.activateProxy();
        }
        source.activateProxy();
    };
    return OneToOne;
}(association_1.default));
exports.default = OneToOne;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var one_to_many_1 = __webpack_require__(3);
var many_to_one_1 = __webpack_require__(4);
var model_1 = __webpack_require__(0);
function HasManyDecorator(TargetClass, _a) {
    var sourceProperty = _a.sourceProperty, targetProperty = _a.targetProperty;
    return function (SourceClass) {
        model_1.default.addAssociation(new one_to_many_1.default({
            sourceProperty: sourceProperty,
            targetProperty: targetProperty,
            SourceClass: SourceClass,
            TargetClass: TargetClass,
        }));
        model_1.default.addAssociation(new many_to_one_1.default({
            sourceProperty: targetProperty,
            targetProperty: sourceProperty,
            SourceClass: TargetClass,
            TargetClass: SourceClass,
        }));
    };
}
exports.default = HasManyDecorator;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var many_to_many_1 = __webpack_require__(15);
var model_1 = __webpack_require__(0);
function HasManyDecorator(TargetClass, _a) {
    var sourceProperty = _a.sourceProperty, targetProperty = _a.targetProperty;
    return function (SourceClass) {
        model_1.default.addAssociation(new many_to_many_1.default({
            sourceProperty: sourceProperty,
            targetProperty: targetProperty,
            SourceClass: SourceClass,
            TargetClass: TargetClass,
        }));
        model_1.default.addAssociation(new many_to_many_1.default({
            sourceProperty: targetProperty,
            targetProperty: sourceProperty,
            SourceClass: TargetClass,
            TargetClass: SourceClass,
        }));
    };
}
exports.default = HasManyDecorator;


/***/ }),
/* 15 */
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
var association_1 = __webpack_require__(1);
var model_1 = __webpack_require__(0);
var ManyToMany = /** @class */ (function (_super) {
    __extends(ManyToMany, _super);
    function ManyToMany(_a) {
        var sourceProperty = _a.sourceProperty, targetProperty = _a.targetProperty, SourceClass = _a.SourceClass, TargetClass = _a.TargetClass;
        var _this = _super.call(this, {
            sourceProperty: sourceProperty, targetProperty: targetProperty, SourceClass: SourceClass, TargetClass: TargetClass,
        }) || this;
        _this.defaultValue = {};
        _this.isSourceList = true;
        return _this;
    }
    ManyToMany.prototype.apply = function (source) {
        if (!source[this.sourceProperty]) {
            source[this.sourceProperty] = {};
            return;
        }
        source.deactivateProxy();
        var listOfTargets = source[this.sourceProperty];
        if (Array.isArray(listOfTargets)) {
            source[this.sourceProperty] = {};
        }
        for (var index = 0; index < listOfTargets.length; index += 1) {
            var target = listOfTargets[index];
            var targetFound = model_1.default.stateManager.states[this.TargetClass.name][target.id];
            if (targetFound) {
                targetFound.deactivateProxy();
                if (!targetFound[this.targetProperty]) {
                    targetFound[this.targetProperty] = {};
                }
                targetFound[this.targetProperty][source.id] = source.getProxy();
                source[this.sourceProperty][targetFound.id] = targetFound;
                targetFound.activateProxy();
            }
            else {
                if (!target[this.targetProperty]) {
                    target[this.targetProperty] = [];
                }
                target[this.targetProperty].push(source);
                var targetCreated = model_1.default.stateManager.states[this.TargetClass.name].addObject(target);
                source[this.sourceProperty][targetCreated.id] = targetCreated;
                targetCreated.activateProxy();
            }
        }
        source.activateProxy();
    };
    return ManyToMany;
}(association_1.default));
exports.default = ManyToMany;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var many_to_one_1 = __webpack_require__(4);
var one_to_many_1 = __webpack_require__(3);
var model_1 = __webpack_require__(0);
function HasManyDecorator(TargetClass, _a) {
    var sourceProperty = _a.sourceProperty, targetProperty = _a.targetProperty;
    return function (SourceClass) {
        model_1.default.addAssociation(new many_to_one_1.default({
            sourceProperty: sourceProperty,
            targetProperty: targetProperty,
            SourceClass: SourceClass,
            TargetClass: TargetClass,
        }));
        model_1.default.addAssociation(new one_to_many_1.default({
            sourceProperty: targetProperty,
            targetProperty: sourceProperty,
            SourceClass: TargetClass,
            TargetClass: SourceClass,
        }));
    };
}
exports.default = HasManyDecorator;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function Path(path) {
    return function (target) { target.paths[target.name] = path; };
}
exports.default = Path;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function Field(defaultValue) {
    return function (target, property) {
        target.constructor.addField(property, defaultValue);
    };
}
exports.default = Field;


/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map