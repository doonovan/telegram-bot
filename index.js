require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

//  Указываешь URL, на который Telegram будет отправлять обновления
// bot.telegram.setWebhook('https://your-project-name.railway.app/webhook');


// Обработчик команды /start
bot.start((ctx) => {
    ctx.reply('Привет! Нажми на кнопку для оставления заявки или обратной связи:', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Оставить заявку', callback_data: 'leave_request' },
                    { text: 'Обратная связь', callback_data: 'feedback' }
                ]
            ]
        }
    });
});

// Обработчик для кнопки "Оставить заявку"
bot.action('leave_request', (ctx) => {
    const message = `Новая заявка от @${ ctx.from.username || 'без username' }: \n\n${ ctx.message.text }`;
    bot.telegram.sendMessage(adminChatId, message); // Отправка сообщения админу
    ctx.reply('Заявка отправлена!');
});

// Обработчик для кнопки "Обратная связь"
bot.action('feedback', (ctx) => {
    const feedback = `Сообщение от @${ ctx.from.username || 'без username' }: \n\n${ ctx.message.text }`;
    bot.telegram.sendMessage(adminChatId, feedback); // Отправка сообщения админу
    ctx.reply('Ваше сообщение отправлено в обратную связь!');
});

// Запуск бота
bot.launch();