import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { getUserInfo } from './api.js';
import { mainKeyboard, someKeyboard } from './keyboard.js';

dotenv.config();

const token = process.env.TOKEN;
const owner = process.env.CHAT_ID;

let unfinishedCommand = {};

const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  if (msg.text === "Start") {
    bot.sendMessage(chatId, 'Choose ', { // прикрутим клаву
      reply_markup: {
        resize_keyboard: true,
        keyboard: mainKeyboard
      }
    });
  }

  if (msg.text === "Search") {
    bot.sendMessage(chatId, 'Send /user {name}');

    bot.sendMessage(chatId, 'Choose 2', { 
      reply_markup: {
        resize_keyboard: true,
        inline_keyboard: someKeyboard
      }
    });
  }
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;

  let img = '';
  console.log(query.data);
  if (query.data === 'moreKeks') { // если кот
    img = 'keks.png';
  }

  if (query.data === 'morePes') { // если пёс
    img = 'pes.png';
  }

  if (img) {
    bot.sendMessage(chatId, img, { // прикрутим клаву
      reply_markup: {
        inline_keyboard: mainKeyboard
      }
    });
  } else {
    bot.sendMessage(chatId, 'Непонятно, давай попробуем ещё раз?', { // прикрутим клаву
      reply_markup: {
        inline_keyboard: mainKeyboard
      }
    });
  }
});

bot.onText(/\/user (\S+)/, async (msg, [_, userName]) => {
  const userInfo = await getUserInfo(userName);

  bot.sendMessage(msg.chat.id, ...userInfo)
})

bot.onText(/^\/user$/, (msg, _) => {
  unfinishedCommand[msg.chat.id] = '/user'

  bot.sendMessage(msg.chat.id, "Now input user name");
})

bot.onText(/^\w+$/, async (msg) => {
  if (unfinishedCommand[msg.chat.id] === '/user') {
    const userName = msg.text;
    const userInfo = await getUserInfo(userName);

    delete unfinishedCommand[msg.chat.id];

    bot.sendMessage(msg.chat.id, ...userInfo)
  }
})