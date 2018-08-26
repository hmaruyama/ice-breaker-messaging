'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const async = require('async');
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

  if(event.message.text != 'ヘルプ'){
    return;
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
  console.log(event.userId);

  let userId;
  if(event.source.groupId) {
    userId = event.source.groupId;
  } else {
    userId = event.source.userId;
  }


  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }
  const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
  const start = async () => {
    await asyncForEach(randomQList, async (item) => {
      await waitFor(1000);
      client.pushMessage(userId, item);
      console.log(item);
    })
    console.log('Done');
  }
  start();




  // async.eachSeries(randomQList, function (item, callback) {
  //     console.log(item);
  //     client.pushMessage(userId, item);
  //     callback(null);
  // }, function (err) {
  // });
  return;
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);
