require('dotenv').config();
const { Telegraf, session, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());

// Главное меню
bot.start((ctx) => {
    ctx.reply(
        'Привет! Нажми на кнопку для оставления заявки или обратной связи:',
        Markup.inlineKeyboard([
            [Markup.button.callback('Оставить заявку', 'leave_request')],
            [Markup.button.callback('Обратная связь', 'feedback')],
            [Markup.button.url('Сайт', 'https://alwa-group.ru')]
        ])
    );
});

// Обработка кнопки "Оставить заявку"
bot.action('leave_request', async (ctx) => {
    ctx.session = ctx.session || {};
    ctx.session.type = 'request';
    await ctx.reply('Пожалуйста, опишите, что вам нужно. Например: «Хочу откатные ворота 3,5 м с установкой»');
});

// Обработка кнопки "Обратная связь"
bot.action('feedback', async (ctx) => {
    ctx.session = ctx.session || {};
    ctx.session.type = 'feedback';
    await ctx.reply('Напишите ваш вопрос или пожелание. Мы ответим в ближайшее время.');
});

// Принимаем текст от пользователя
bot.on('text', async (ctx) => {
    if (ctx.session && ctx.session.type) {
        const username = ctx.from.username || 'без username';
        const userText = ctx.message.text;
        const type = ctx.session.type;

        let adminMessage = '';

        if (type === 'request') {
            adminMessage = `Новая заявка от @${username}: \n\n${ userText }`;
            await ctx.reply('Спасибо! Мы получили вашу заявку и скоро свяжемся с вами.');
        } else if (type === 'feedback') {
            adminMessage = `Сообщение от @${username}: \n\n${ userText }`;
            await ctx.reply('Спасибо за сообщение! Мы скоро вам ответим.');
        }

        // Отправка админу
        await ctx.telegram.sendMessage(process.env.ADMIN_ID, adminMessage);
        ctx.session.type = null; // сбрасываем после отправки
    }
});

bot.launch();