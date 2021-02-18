

module.exports = function(photo) {
    require('dotenv').config({path: '.env'})
    const Telegraf = require('telegraf');
    var fs = require('fs');

    let options = {
    channelMode: true    // Handle `channel_post` updates as messages (optional)
    }

    const bot = new Telegraf(process.env.BOT_TOKEN, options);
    
    // bot.start((ctx) => {
    // ctx.reply('Welcome!')
    // });
    bot.hears("bye", ctx => console.log(ctx.chat.id));
    // bot.help((ctx) => ctx.reply('Send me a sticker'))
    // bot.on('sticker', (ctx) => ctx.reply('👍'));
    bot.telegram.sendPhoto('@tahminoglucom', {source: fs.readFileSync(photo)}, {caption: '\n\n\nGünlük tahmin! - Türkiyenin en büyük ve ücretsiz banko iddia tahminleri uygulaması - Tahminoğlu! Profesyonel ekip tarafından yapılan günlük banko tahminler ve maç analizleri!'});
    // bot.hears('hi', (ctx) => ctx.reply('Hey there'));
    bot.launch()
}