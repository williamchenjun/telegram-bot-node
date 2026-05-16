import {Update, Context} from "./base.js";
import { Filters } from "./constants.js";
import { getMessage, isService, parseCommand } from "./utils.js";

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
        if (!(await this.canHandle(update))) {
            return false;
        }

        await this.callback(update, context);
        return true;
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
        super((update) => {
            const message = getMessage(update);
            const cmd = message?.text.split(/\s+/)[0]?.split("@")[0];
            return cmd === `/${command}`;
        }, callback);
    }

    /**
     * 
     * @param {Update} update 
     * @param {Context} context 
     */
    async handle(update, context) {
        if (!(await this.canHandle(update))) {
            return false;
        }

        const message = getMessage(update);

        if (!message?.text) {
            return false;
        }

        const args = parseCommand(message.text);
        context.args = args;
        await this.callback(update, context);

        return true;
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
            const message = getMessage(update);

            if (update.type !== "message") return false;
            if (typeof filter === "function") return filter(update);

            let flags = 0;

            if (message.text){
                flags |= Filters.TEXT;
                if (message.text.startsWith("/")){
                    flags |= Filters.COMMAND;
                }
            }

            if (message.photo || message.video || message.document || message.media_group_id) {
                flags |= Filters.MEDIA;
            }

            if (message.photo){
                flags |= Filters.PHOTO;
            }

            if (message.video){
                flags |= Filters.VIDEO;
            }

            if (message.document){
                flags |= Filters.DOCUMENT;
            }

            if (message.media_group_id){
                flags |= Filters.MEDIA_GROUP;
            }

            if (message.forward_from_chat || message.forward_origin){
                flags |= Filters.FORWARDED;
            }

            if (message.new_chat_members?.length) {
                flags |= Filters.NEW_CHAT_MEMBERS;
            }

            if (message.left_chat_member) {
                flags |= Filters.LEFT_CHAT_MEMBER;
            }

            if (isService(message)) {
                flags |= Filters.SERVICE_MESSAGES;
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
        const chat_id = update.message?.chat?.id ?? update.callback_query?.message?.chat?.id;
        if (chat_id === null) return false;
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
}

// /**
//  * Handle `chat_member` updates.
//  */
// class ChatMemberHandler extends BaseHandler {
//     /**
//      * @param {(update: Update, context: Context) => Promise<void>} callback
//      */
//     constructor(callback) {
//         super((update) => update.type === "chat_member" && update.effective_chat && update.effective_user, callback);
//     }
// }

/**
 * Handle `chat_member` and `my_chat_member` updates.
 */
class ChatMemberHandler extends BaseHandler {
    /**
     * @param {(update: Update, context: Context) => Promise<void>} callback
     */
    constructor(callback){
        super((update) => {
            if (update.type === "chat_member") {
                return (
                    update.chat_member && 
                    (update.chat_member?.old_chat_member || update.chat_member?.new_chat_member)
                )
            } else if (update.type === "my_chat_member") {
                return (
                    update.my_chat_member &&
                    (update.my_chat_member?.old_chat_member || update.my_chat_member?.new_chat_member)
                )
            }

            return false;
        }, callback);
    }
}

export {
MessageHandler,
CommandHandler,
ConversationHandler,
CallbackQueryHandler,
BaseHandler,
// ChatMemberHandler,
ChatMemberHandler
}