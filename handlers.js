import {Update, Context} from "./base.js";
import { Filters } from "./constants.js";
import { parseCommand } from "./utils.js";

class BaseHandler {
    /**
     * 
     * @param {(update: Update) => boolean} filter 
     * @param {(update: Update, context: Context) => Promise<void>} callback
     */
    constructor (filter, callback){
        this.filter = filter;
        this.callback = callback;
    }

    async canHandle (update){
        return this.filter(update);
    }

    async handle (update, context){
        if (await this.canHandle(update)){
            return await this.callback(update, context);
        }
    }
}

/**
 * Handle `message` updates containing a command.
 */
class CommandHandler extends BaseHandler {
    /**
     * @param {string} command 
     * @param {(update: Update, context: Context) => Promise<void>} callback
     */
    constructor (command, callback){
        super((update) => update.type === "message" && update?.message?.text && update.message.text.startsWith(`/${command}`), callback);
    }

    /**
     * 
     * @param {Update} update 
     * @param {Context} context 
     */
    async handle(update, context) {
        if (await this.canHandle(update)) {
            const args = parseCommand(update.message.text);
            context.args = args;
            
            return await this.callback(update, context);
        }
    }
}

/**
 * Handle `message` updates.
 */
class MessageHandler extends BaseHandler {
    /**
     * 
     * @param {Filters|function} filter 
     * @param {(update: Update, context: Context) => Promise<void>} callback
     */
    constructor (filter, callback){
        super((/**@type {Update}*/update) => {
            if (update.type !== "message") return false;
            if (typeof filter === "function") return filter(update);

            let flags = 0;

            if (update.message.text){
                flags |= Filters.TEXT;
                if (update.message.text.startsWith("/")){
                    flags |= Filters.COMMAND;
                }
            }

            if (update.message.photo){
                flags |= Filters.PHOTO;
            }

            if (update.message.video){
                flags |= Filters.VIDEO;
            }

            if (update.message.document){
                flags |= Filters.DOCUMENT;
            }

            if (update.message.media_group_id){
                flags |= Filters.MEDIA_GROUP;
            }

            if (update.message.forward_from_chat || update.message.forward_origin){
                flags |= Filters.FORWARDED;
            }

            return (filter & flags) !== 0;
        }, callback);
    }
}

/**
 * Handle various updates.
 */
class ConversationHandler {
    /**
     * @typedef {number} 
     */
    static END = -1;

    /**
     * @param {object} config - The configuration for the conversation handler.
     * @param {BaseHandler[]} config.entryPoints - Handlers to start the conversation.
     * @param {object} config.states - The states and corresponding handlers for each step of the conversation.
     * @param {BaseHandler[]} [config.fallbacks] - Handlers for fallback scenarios.
     * @param {BaseHandler[]} [config.globalHandlers] - Handlers that apply globally throughout the conversation.
     */
    constructor ({entryPoints, states, fallbacks = [], globalHandlers = []}) {
        this.entryPoints = entryPoints;
        this.states = states;
        this.fallbacks = fallbacks;
        this.globalHandlers = globalHandlers;
        this.activeConversations = new Map();
        this.isEnded = false;
        this.activeState = null;
    }

    reset(){
        this.isEnded = false;
        this.activeState = null;
    }

    async handle(update, context){
        const chat_id = update.message?.chat.id || update.callback_query?.message?.chat.id;
        if (this.activeConversations.has(chat_id)){
            const state = this.activeConversations.get(chat_id);
            if (this.states[state]) {
                
                for (const handler of this.globalHandlers) {
                    if (await handler.canHandle(update)) {
                        const globalResult = await handler.handle(update, context);
                        if (globalResult === -1) {
                            this.isEnded = true;
                            this.activeConversations.delete(chat_id);
                            return;
                        }
                    }
                }

                for (const handler of this.states[state]) {
                    if (await handler.canHandle(update)) {
                        const nextState = await handler.handle(update, context);
                        this.activeState = nextState;
                        if (nextState === -1) {
                            this.isEnded = true;
                            this.activeConversations.delete(chat_id);
                        } else {
                            this.activeConversations.set(chat_id, nextState);
                        }
                        return;
                    }
                }
            }
        } else {
            for (const handler of this.entryPoints) {
                if (await handler.canHandle(update)) {
                    const initialState = await handler.handle(update, context);
                    if (initialState !== -1) {
                        this.activeConversations.set(chat_id, initialState);
                    }
                    return;
                }
            }
        }

        for (const handler of this.fallbacks) {
            if (await handler.canHandle(update)) {
                await handler.handle(update, context);
                return;
            }
        }
    }
}

/**
 * Handle `callback_query` updates.
 */
class CallbackQueryHandler extends BaseHandler {
    /**
     * @param {(update: Update, context: Context) => Promise<void>} callback - The function to handle callback queries.
     */
    constructor (callback){
        super((update) => update.type === "callback_query" && update?.callback_query && typeof update.callback_query === "object", callback);
    }

    async handle(update, context) {
        if (await this.canHandle(update)) {
            return await this.callback(update, context);
        }
    }
}

/**
 * Handle `message` updates that contain `chat_member` information.
 */
class ChatMemberHandler extends BaseHandler {
    constructor(callback) {
        super((update) => update.type === "message" && update.effective_chat && update.effective_user, async (update, context) => {
            update.chat_member = await Context.bot.getChatMember({chat_id: update.effective_chat.id, user_id: update.effective_user.id});
            return callback(update, context);
        });
    }
}

/**
 * Handle `chat_member` updates.
 */
class ChatMemberUpdatedHandler extends BaseHandler {
    /**
     * 
     * @param {(update: Update, context: Context) => Promise<void>} callback
     */
    constructor(callback){
        super((update) => {
            return (update.type === "chat_member" || update.type === "my_chat_member") && update.chat_member && (update.chat_member?.old_chat_member || update.chat_member?.new_chat_member);
        }, callback);
    }
}

export {
MessageHandler,
CommandHandler,
ConversationHandler,
CallbackQueryHandler,
BaseHandler,
ChatMemberHandler,
ChatMemberUpdatedHandler
}