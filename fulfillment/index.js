'use strict';

process.env.DEBUG = 'actions-on-google:*';
const functions = require('firebase-functions');
const { dialogflow } = require('actions-on-google');

const app = dialogflow();

app.intent('Memo Intent', (conv, { any, memoListen, end }) => {

  // ユーザが「終了」と言った場合
  if (end === '終了') {
    conv.close('終了します。メモを確認するときはまた呼んでくださいね。');
    return;
  }
  
  // ユーザが「メモを聞く」と言った場合
  if (memoListen === 'メモを聞く') {
    const memo = conv.user.storage.memo;
    // メモが存在しない場合
    if (memo === undefined) {
      conv.ask('メモがありません。メモする言葉を話しかけてください。');
      return;
    // メモが存在する場合
    } else {
      conv.ask(memo);
      conv.ask('新たにメモを取る場合はメモする言葉を、終了する場合は「終了」と話しかけてください。');
      return;
    }
  }

  // userStorageに保存する
  conv.user.storage.memo = any;
  conv.close(any + 'をメモしました。終了します。メモを確認するときはまた呼んでくださいね。');
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);