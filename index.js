require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

// Стартовое сообщение с кнопками
bot.start((ctx) => {
    ctx.reply('Привет! Нажми на кнопку для оставления заявки или для перехода на сайт:', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Оставить заявку', callback_data: 'leave_request' },
                    { text: 'Сайт', url: 'https://alwa-group.ru' } // Ссылка на сайт
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

// Запуск бота
bot.launch();