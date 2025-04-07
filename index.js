equire('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Стартовое меню
bot.start((ctx) => {
    ctx.reply(
        'Добро пожаловать! Чем могу помочь?',
        Markup.keyboard([
            ['Каталог', 'Оставить заявку'],
            ['Обратная связь'],
        ]).resize()
    );
});

// Каталог
bot.hears('Каталог', (ctx) => {
    ctx.reply(
        'Разделы каталога:\n1. Откатные ворота\n2. Распашные ворота\n3. Шлагбаумы\n(Пока в разработке)'
    );
});

// Оставить заявку
bot.hears('Оставить заявку', (ctx) => {
    ctx.reply(
        'Пожалуйста, отправьте ваше имя, телефон и интересующий товар. Мы свяжемся с вами!'
    );
    bot.on('text', (ctx) => {
        const msg = Новая заявка от @${ ctx.from.username || 'без username' }: \n\n${ ctx.message.text };
        ctx.telegram.sendMessage(process.env.ADMIN_CHAT_ID, msg);
        ctx.reply('Спасибо! Ваша заявка принята.');
    });
});

// Обратная связь
bot.hears('Обратная связь', (ctx) => {
    ctx.reply('Напишите ваше сообщение, мы обязательно ответим!');
    bot.on('text', (ctx) => {
        const feedback = Сообщение от @${ ctx.from.username || 'без username' }: \n\n${ ctx.message.text };
        ctx.telegram.sendMessage(process.env.ADMIN_CHAT_ID, feedback);
        ctx.reply('Спасибо за обратную связь!');
    });
});

bot.launch();
console.log('Бот запущен!');