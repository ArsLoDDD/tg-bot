const { Telegraf } = require("telegraf");
const cc = require("currency-codes");
const axios = require("axios");
const TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  "5606877865:AAFYatJHNYpFZhuIghC2tCVD4z9_Clej8ec";

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
  return ctx.reply("hi girls");
});

bot.hears(/^['\/'][A-Z]+$/i, async (ctx) => {
  const clientCurCode = ctx.message.text.slice(1);
  const currencyName = cc.code(clientCurCode);

  if (!currencyName) {
    return ctx.reply("Error currency");
  }
  if (clientCurCode === "rub" || clientCurCode === "RUB") {
    return ctx.reply("Сосі хуй");
  }
  try {
    const currencyObj = await axios.get(
      "https://api.monobank.ua/bank/currency"
    );
    console.log(currencyName.number);
    const arrayValut = currencyObj.data;
    const qwe = currencyObj.data.filter(
      ({ currencyCodeA }) =>
        Number(currencyCodeA) === Number(currencyName.number)
    );
    if (qwe.length === 0 || qwe[0].rateBuy === undefined) {
      return ctx.reply("not found");
    }
    return ctx.reply(
      `Купівля: ${qwe[0].rateBuy.toFixed(
        2
      )} | Продаж: ${qwe[0].rateSell.toFixed(2)}`
    );
  } catch (error) {
    return ctx.reply("error");
  }
});
bot.startPolling();
