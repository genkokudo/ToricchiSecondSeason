"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// とりっっちに関する処理
const ParametersController_1 = require("./controllers/ParametersController");
const Character_1 = require("./models/Character");
const CharactersController_1 = require("./controllers/CharactersController");
const MessageConstants_1 = require("./MessageConstants");
const DbStore_1 = require("./DbStore");
// **** とりっっちに関する関数をここに集めておく**** //
// 多分、awaitしてもスレッドが分かれてて競合するので、初期化処理でしゅとくしておくべき
// とりっっちのパラメータキャッシュ
var parameterCache = null;
// TODO:利用者データのキャッシュ
/**
 * 利用者データを取得する
 * 無ければ作成する
 * @param message メッセージデータ
 * @returns 利用者データ
 */
function getCharacter(message) {
    return __awaiter(this, void 0, void 0, function* () {
        // 利用者データを探す
        CharactersController_1.default.get(message.author.id).then((character) => {
            return character;
        }).catch((err) => {
            // 無かったので作成
            console.log(MessageConstants_1.makeCharacterMessage);
            var newCharacter = new Character_1.default();
            newCharacter.id = message.author.id;
            newCharacter.like = 0;
            newCharacter.name = message.author.username;
            CharactersController_1.default.add(newCharacter).then((character) => {
                return character;
            }).catch((err) => {
                console.log(MessageConstants_1.dbErrMessage);
                console.log(err);
                return null;
            });
        });
        return null;
    });
}
exports.getCharacter = getCharacter;
/**
 * 利用者データに好感度を加算する
 * @param character 利用者データ
 * @param like ポイント増分
 * @returns 利用者データ
 */
function addLike(character, like) {
    return __awaiter(this, void 0, void 0, function* () {
        // 最小値は-5
        character.like = Math.max(-5, character.like + like);
        // 更新
        CharactersController_1.default.update(character.id, character).then((character) => {
            return character;
        }).catch((err) => {
            console.log(MessageConstants_1.dbErrMessage);
            console.log(err);
            return null;
        });
        return null;
    });
}
exports.addLike = addLike;
/**
 * メッセージ受信ごとにとりっっちの状態を更新する
 */
function updateToricchi() {
    return __awaiter(this, void 0, void 0, function* () {
        // MP回復
        yield updateParameterMax("Mp", "MaxMp", 1);
        yield updateParameterMax("Unko", "MaxUnko", 1);
        // 収入加算
        var income = yield getParameterNumber("Income");
        yield updateParameter("Money", income);
        // 戦闘不能ならばHP回復
        console.log("HPを更新します");
        var isDead = yield getParameterNumber("IsDead");
        if (isDead) {
            var temp = yield updateParameterMax("Hp", "MaxHp", 1);
            // 最大値になっていたら復活
            if (Number(temp.value) === (yield getParameterNumber("MaxHp"))) {
                yield updateParameter("IsDead", -1);
            }
        }
    });
}
exports.updateToricchi = updateToricchi;
/**
 * 最大値を考慮して加算する
 * @param name パラメータ名
 * @param maxName 最大値パラメータ名
 * @param addValue 加算値
 * @returns 処理後のパラメータ
 */
function updateParameterMax(name, maxName, addValue) {
    return __awaiter(this, void 0, void 0, function* () {
        var tempmax = null;
        yield getParameter(maxName).then((a) => { tempmax = a; });
        var maxHp = Number(tempmax.value);
        return yield updateParameter(name, addValue, maxHp);
    });
}
exports.updateParameterMax = updateParameterMax;
/**
 * パラメータを指定してステータスを取得する
 * @param name パラメータ名
 * @returns 処理後のパラメータ
 */
function getParameter(name) {
    return __awaiter(this, void 0, void 0, function* () {
        // シングルトンでキャッシュする
        if (!parameterCache) {
            yield ParametersController_1.default.all().then((val) => {
                console.log("パラメータをキャッシュします" + name);
                parameterCache = val;
            }).catch((err) => {
                console.log(MessageConstants_1.failedMessage);
                console.log(err);
            });
        }
        console.log(parameterCache);
        // 探す
        var result = parameterCache.find(item => item.name === name);
        return result;
    });
}
exports.getParameter = getParameter;
/**
 * パラメータを指定してステータスの数値を取得する
 * @param name パラメータ名
 * @returns 処理後のパラメータ
 */
function getParameterNumber(name) {
    return __awaiter(this, void 0, void 0, function* () {
        var value = yield getParameter(name);
        return Number(value.value);
    });
}
exports.getParameterNumber = getParameterNumber;
/**
 * ステータスを更新する
 * @param name パラメータ名
 * @param addValue 加算値
 * @param max 最大値、なければ判定なし、0の時は判定されない
 * @returns 処理後のパラメータ
 */
function updateParameter(name, addValue, max = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        // 取得する
        var tempParameter = yield getParameter(name);
        // 加える
        if (max) {
            tempParameter.value = (Math.min(max, Number(tempParameter.value) + addValue)).toString();
        }
        else {
            tempParameter.value = (Number(tempParameter.value) + addValue).toString();
        }
        //// 保存
        //return await ParameterController.update(tempParameter.id, tempParameter);
        console.log("更新しました");
        console.log(tempParameter);
        return tempParameter; //////TODO:
    });
}
exports.updateParameter = updateParameter;
// **** 動的に呼び出す関数をここに集めておく**** //
/**
 * 引数で示された名前の関数を呼び出す
 * @param functionName 関数名
 * @returns 関数の結果
 */
function evalFunction(functionName) {
    try {
        return eval(functionName + "()");
    }
    catch (err) {
        console.log(err);
        return false;
    }
}
exports.evalFunction = evalFunction;
function Help() {
}
// 各テーブルをDBに一括保存する
function Save() {
    return __awaiter(this, void 0, void 0, function* () {
        var connection = yield DbStore_1.default.createConnection();
        yield connection.transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
            yield transactionalEntityManager.save(parameterCache);
            //await transactionalEntityManager.save(photos);
        }));
    });
}
//# sourceMappingURL=ToricchiHelper.js.map