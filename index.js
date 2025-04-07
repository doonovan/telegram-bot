require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

//  Указываешь URL, на который Telegram будет отправлять обновления
// bot.telegram.setWebhook('https://your-project-name.railway.app/webhook');


// Стартовое меню
bot.start((ctx) => {
    ctx.reply(
        'Добро пожаловать! Чем могу помочь?',
        Markup.keyboard([
            ['Сайт', 'Оставить заявку'],
            ['Обратная связь'],
        ]).resize()
    );
});

// Каталог
bot.hears('Сайт', (ctx) => {
    ctx.reply('Посетить сайт по ссылке:', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Перейти на сайт', url: 'https://alwa-group.ru/' }
                ]
            ]
        }
    });
});

// Оставить заявку
bot.hears('Оставить заявку', (ctx) => {
    ctx.reply(
        'Пожалуйста, отправьте ваше имя, телефон и интересующий товар. Мы свяжемся с вами!'
    );
    bot.action('text', (ctx) => {
        const msg = `Новая заявка от @${ ctx.from.username || 'без username' }: \n\n${ ctx.message.text }`;
        ctx.telegram.sendMessage(process.env.ADMIN_CHAT_ID, msg);
        ctx.reply('Спасибо! Ваша заявка принята.');
    });
});

// Обратная связь
bot.hears('Обратная связь', (ctx) => {
    ctx.reply('Напишите ваше сообщение, мы обязательно ответим!');
    bot.action('text', (ctx) => {
        const feedback = `Сообщение от @${ ctx.from.username || 'без username' }: \n\n${ ctx.message.text }`;
        ctx.telegram.sendMessage(process.env.ADMIN_CHAT_ID, feedback);
        ctx.reply('Спасибо за обратную связь!');
    });
});

bot.launch();
console.log('Бот запущен!');