'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;

const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
};

const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

function shuffle(array) {
  var n = array.length, t, i;

  while (n) {
    i = Math.floor(Math.random() * n--);
    t = array[n];
    array[n] = array[i];
    array[i] = t;
  }
  return array;
}

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  let qList = [
    {
      type: 'text',
      text: '好きな食べ物はなんですか？'
    },
    {
      type: 'text',
      text: '出身地はどこですか？'
    },
    {
      type: 'text',
      text: '趣味はなんですか？'
    },
    {
      type: 'text',
      text: '好きな本はなんですか？'
    },
    {
      type: 'text',
      text: '好きなアーティストはいますか？'
    },
    {
      type: 'text',
      text: '休日は何をして過ごしていますか？'
    },
    {
      type: 'text',
      text: 'アウトドア派ですか、インドア派ですか？'
    },
    {
      type: 'text',
      text: 'どこに住んでいるんですか？'
    }
  ];
  let randomQList = shuffle(qList).slice(0, 4);
  return client.replyMessage(event.replyToken, randomQList);
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);
