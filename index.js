// Подключение библиотеки dotenv
require("dotenv").config();

// Получение ключей из переменных окружения
const apiKey = process.env.OPENAI_API_KEY;
const telegramToken = process.env.TELEGRAM_BOT_TOKEN;

// Остальная часть вашего кода остается без изменений
const { Bot } = require("grammy");
const axios = require("axios");

const bot = new Bot(telegramToken);

async function chatWithGpt(prompt) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Ошибка при обращении к API:", error.response.data);
    return "Произошла ошибка при обращении к GPT.";
  }
}

// Обработка текстовых сообщений
bot.on("message:text", async (ctx) => {
  const userInput = ctx.message.text;
  const botResponse = await chatWithGpt(userInput);
  await ctx.reply(botResponse);
});

// Запуск бота
bot
  .start()
  .then(() => console.log("Бот запущен"))
  .catch((error) => console.error("Ошибка при запуске бота:", error));
