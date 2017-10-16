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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var sinon = require("sinon");
var dream = require("dreamjs");
var src_1 = require("./src");
var HasOneModel = /** @class */ (function (_super) {
    __extends(HasOneModel, _super);
    function HasOneModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        src_1.Field()
    ], HasOneModel.prototype, "city", void 0);
    __decorate([
        src_1.Field()
    ], HasOneModel.prototype, "field1", void 0);
    __decorate([
        src_1.Field()
    ], HasOneModel.prototype, "language", void 0);
    __decorate([
        src_1.Field()
    ], HasOneModel.prototype, "totalPlaces", void 0);
    __decorate([
        src_1.Field()
    ], HasOneModel.prototype, "description", void 0);
    HasOneModel = __decorate([
        src_1.Path('/events')
    ], HasOneModel);
    return HasOneModel;
}(src_1.Model));
var HasManyModel = /** @class */ (function (_super) {
    __extends(HasManyModel, _super);
    function HasManyModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        src_1.Field()
    ], HasManyModel.prototype, "city", void 0);
    __decorate([
        src_1.Field()
    ], HasManyModel.prototype, "field1", void 0);
    __decorate([
        src_1.Field()
    ], HasManyModel.prototype, "language", void 0);
    __decorate([
        src_1.Field()
    ], HasManyModel.prototype, "totalPlaces", void 0);
    __decorate([
        src_1.Field()
    ], HasManyModel.prototype, "description", void 0);
    HasManyModel = __decorate([
        src_1.Path('/events')
    ], HasManyModel);
    return HasManyModel;
}(src_1.Model));
var Root = /** @class */ (function (_super) {
    __extends(Root, _super);
    function Root() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        src_1.Field()
    ], Root.prototype, "city", void 0);
    __decorate([
        src_1.Field()
    ], Root.prototype, "field1", void 0);
    __decorate([
        src_1.Field()
    ], Root.prototype, "language", void 0);
    __decorate([
        src_1.Field()
    ], Root.prototype, "totalPlaces", void 0);
    __decorate([
        src_1.Field()
    ], Root.prototype, "description", void 0);
    Root = __decorate([
        src_1.Path('/events'),
        src_1.HasMany(HasManyModel, { property: 'hasMany' }),
        src_1.HasOne(HasOneModel, { property: 'hasOne' })
    ], Root);
    return Root;
}(src_1.Model));
var mockedResponse = dream
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
}).generateRnd(100000).output();
var spy = sinon.stub(axios_1.default, 'create').returns({
    get: function () {
        return Promise.resolve({ data: mockedResponse });
    },
});
src_1.default.setConfig({
    baseUrl: 'https://bsaseUrl',
});
debugger;
Root.fetch().then(function () {
    console.log('finished');
});
