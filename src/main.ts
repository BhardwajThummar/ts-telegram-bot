import TelegramBot, { CallbackQuery, InlineKeyboardMarkup, Message } from 'node-telegram-bot-api';
import dotenv from 'dotenv';
dotenv.config();

interface KeyboardButton {
    text: string;
    callback_data?: string;
    reply_markup?: InlineKeyboardMarkup;
}
interface Keyboard {
    inline_keyboard: KeyboardButton[][];
}
interface KeyboardButton {
    text: string;
    reply_markup?: InlineKeyboardMarkup;
}
const token = process.env.TELEGRAM_BOT_TOKEN || '';
const bot = new TelegramBot(token, { polling: true });

function generateMainMenuButtons(): Keyboard {
    return {
        inline_keyboard: [
            [{ text: 'MM1', callback_data: 'MM1' }],
            [{ text: 'MM2', callback_data: 'MM2' }],
            [{ text: 'MM3', callback_data: 'MM3' }],
            [{ text: 'MM4', callback_data: 'MM4' }],
        ],
    };
}

function generateSubMenuButtons(menuNumber: string): Keyboard {
    return {
        inline_keyboard: [
            [{ text: `${menuNumber}-SM1`, callback_data: `${menuNumber}-SM1` }],
            [{ text: `${menuNumber}-SM2`, callback_data: `${menuNumber}-SM2` }],
            [{ text: `${menuNumber}-SM3`, callback_data: `${menuNumber}-SM3` }],
        ],
    };
}

function generateSubSubMenuButtons(menuNumber: string, subMenuNumber: string): Keyboard {
    return {
        inline_keyboard: [
            [{ text: `${menuNumber}-${subMenuNumber}-SSM1`, callback_data: `${menuNumber}-${subMenuNumber}-SSM1` }],
        ],
    };
}

bot.onText(/\/start/, (msg: Message) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'This is the main menu (MM)', { reply_markup: generateMainMenuButtons() });
});

bot.on('callback_query', (callbackQuery: CallbackQuery) => {
    const chatId = callbackQuery.message?.chat.id;
    const data = callbackQuery.data?.split('-');
    const menuNumber = data?.[0];
    const subMenuNumber = data?.[1];
    const subSubMenuNumber = data?.[2];

    if (!subMenuNumber) {
        bot.sendMessage(chatId!, 'This is the sub menu (SM)', { reply_markup: generateSubMenuButtons(menuNumber!) });
    } else if (!subSubMenuNumber) {
        bot.sendMessage(chatId!, 'This is the sub-sub menu (SSM) and the end.', { reply_markup: generateSubSubMenuButtons(menuNumber!, subMenuNumber!) });
    } else {
        bot.sendMessage(chatId!, 'This is the main menu (MM)', { reply_markup: generateMainMenuButtons() });
    }
});