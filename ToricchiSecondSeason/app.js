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
const DiscordHelper_1 = require("./DiscordHelper");
const MessageConstants_1 = require("./MessageConstants");
const ParametersController_1 = require("./controllers/ParametersController");
const ReplyMessagesController_1 = require("./controllers/ReplyMessagesController");
const ToricchiHelper_1 = require("./ToricchiHelper");
const DbStore_1 = require("./DbStore");
'use strict';
// 設定項目
//const token = '<DiscordBOTのトークン>';
const token = 'NDE3ODkyMzU0NDgyMjQxNTQ2.D1P4aA.vTlIbi0U9qltG_zzfHoKNi1RCVk';
//ログイン処理
const Discord = require('discord.js');
const client = new Discord.Client();
client.on('ready', () => __awaiter(this, void 0, void 0, function* () {
    // 初期状態チェック
    // と言っても特に何もしていなくて、一旦DBにアクセスすることでテーブル作成しているだけ。
    yield ParametersController_1.default.all().then((parameter) => {
        if (parameter.length == 0) {
            console.log(MessageConstants_1.initialMessage);
        }
    }).catch((err) => {
        console.log(`${MessageConstants_1.failedMessage} ${err.message}`);
    });
    // データベースのデータをキャッシュする
    console.log(MessageConstants_1.cacheMessage);
    DbStore_1.initialize();
    // 完了メッセージ
    console.log(MessageConstants_1.startupMessage);
}));
// メッセージの受信
client.on('message', (message) => __awaiter(this, void 0, void 0, function* () {
    //Bot自身の発言を無視する
    if (message.author.bot) {
        return;
    }
    // 最後のメッセージを保持、表示
    yield DiscordHelper_1.memoryMessage(message);
    // 死んでたら更新処理のみ
    var isDead = yield ToricchiHelper_1.getParameterNumber("IsDead");
    if (!isDead) {
        // メッセージから特定の文字を除外する
        var tempMessage = DiscordHelper_1.replaceMessage(message.content);
        if (tempMessage.length > 0) {
            // 条件に合ったメッセージを取得
            var candidateList = yield getCandidateList(tempMessage);
            // 候補がある場合
            if (candidateList.length > 0) {
                // 発言者データ取得関数
                var character = yield ToricchiHelper_1.getCharacter(message);
                // ポイントの高い物から使用するメッセージを判定
                var messageData = candidateList[0];
                messageData = candidateList.find(function (value) {
                    return !value.requirePointMin || value.requirePointMin <= character.like;
                });
                // 単純なメッセージ返信
                if (messageData.reply) {
                    message.channel.send(messageData.reply);
                }
                // 関数の動的呼び出し
                var success = true;
                if (messageData.function) {
                    success = ToricchiHelper_1.evalFunction(messageData.function);
                }
                // 全て成功したら発言者に好感度加算
                if (success) {
                    if (messageData.friendryPoint) {
                        yield ToricchiHelper_1.addLike(character, messageData.friendryPoint);
                    }
                }
            }
        }
        else {
            // 除外した結果何もなくなった
            message.channel.send(`は？`);
        }
    }
}));
// ログイン
client.login(token);
/**
 * メッセージ候補を降順で取得する
 * @param messageContent メッセージ本文
 * @returns メッセージ候補リスト（ポイント降順）
 */
function getCandidateList(messageContent) {
    return __awaiter(this, void 0, void 0, function* () {
        var candidateList = [];
        // メッセージ一覧を取得（完了まで待つ）
        yield ReplyMessagesController_1.default.all().then((messageList) => {
            // 条件に合ったメッセージを集める
            messageList.forEach((value) => {
                if (messageContent.match(new RegExp(value.word, 'g'))) {
                    candidateList.push(value);
                }
            });
            // 降順に並び変える
            candidateList.sort(function (a, b) {
                if (a == null && b == null)
                    return 0;
                if (a == null)
                    return 1;
                if (b == null)
                    return -1;
                if (a.requirePointMin < b.requirePointMin)
                    return 1;
                if (a.requirePointMin > b.requirePointMin)
                    return -1;
                return 0;
            });
        }).catch((err) => {
            console.log(MessageConstants_1.dbErrMessage);
            console.log(err);
        });
        return candidateList;
    });
}
//# sourceMappingURL=app.js.map