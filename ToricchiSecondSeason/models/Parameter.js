"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
// Parametersテーブル
// パラメータ
let Parameter = class Parameter {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: 'int',
        comment: '通し番号'
    }),
    __metadata("design:type", Number)
], Parameter.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        name: 'Name',
        type: 'varchar',
        comment: '名前',
        length: 50,
        default: '何か設定しなさい'
    }),
    __metadata("design:type", String)
], Parameter.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        name: 'Value',
        type: 'varchar',
        comment: '値',
        length: 50,
        default: '何か設定しなさい'
    }),
    __metadata("design:type", String)
], Parameter.prototype, "value", void 0);
__decorate([
    typeorm_1.Column({
        name: 'VisibleLevel',
        type: 'int',
        comment: '好感度による表示',
        default: 0
    }),
    __metadata("design:type", Number)
], Parameter.prototype, "visibleLevel", void 0);
__decorate([
    typeorm_1.Column({
        name: 'Display',
        type: 'varchar',
        comment: '表示するパラメータ名',
        default: '何か設定しなさい'
    }),
    __metadata("design:type", String)
], Parameter.prototype, "display", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        name: 'CreatedAt',
        comment: '作成日'
    }),
    __metadata("design:type", Date)
], Parameter.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({
        name: 'UpdatedAt',
        comment: '更新日'
    }),
    __metadata("design:type", Date)
], Parameter.prototype, "updatedAt", void 0);
Parameter = __decorate([
    typeorm_1.Entity("Parameters")
], Parameter);
exports.default = Parameter;
//# sourceMappingURL=Parameter.js.map