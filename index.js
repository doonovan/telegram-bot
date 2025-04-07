require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

// Стартовое сообщение с кнопками
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

// Обработчик кнопки "Оставить заявку"
bot.action('leave_request', (ctx) => {
    ctx.reply('Пожалуйста, введите ваше сообщение для заявки.');

    // Начинаем диалог с пользователем: собираем текст заявки
    bot.on('text', async (ctx) => {
        if (ctx.message.chat.id === ctx.from.id) {
            const username = ctx.from.username || 'без username';
            const message = `Новая заявка от @${ username }: \n\n${ ctx.message.text }`;
            bot.telegram.sendMessage(ADMIN_CHAT_ID, message);
            ctx.reply('Заявка отправлена!');

            // Завершаем сбор сообщений
            bot.removeListener('text');
        }
    });
});

// Обработчик кнопки "Обратная связь"
bot.action('feedback', (ctx) => {
    ctx.reply('Пожалуйста, введите ваше сообщение для обратной связи.');

    // Начинаем диалог с пользователем: собираем текст обратной связи
    bot.on('text', async (ctx) => {
        if (ctx.message.chat.id === ctx.from.id) {
            const username = ctx.from.username || 'без username';
            const feedbackMessage = `Сообщение от @${ username }: \n\n${ ctx.message.text }`;
            bot.telegram.sendMessage(ADMIN_CHAT_ID, feedbackMessage);
            ctx.reply('Ваше сообщение отправлено в обратную связь!');

            // Завершаем сбор сообщений
            bot.removeListener('text');
        }
    });
});

// Запуск бота
bot.launch();