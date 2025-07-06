import { CallbackQuery, Chat, LinkPreviewOptions, Message, WebhookInfo, _File, User, ChatMember, ChatMemberAdministrator, ChatMemberBanned, ChatMemberMember, ChatMemberLeft, ChatMemberRestricted, ChatMemberOwner, InputFile, ChatMemberUpdated, Document, ChatFullInfo, ChatPermissions, MessageId, UserProfilePhotos} from "./components.js";
import { BaseHandler, ConversationHandler } from "./handlers.js";
import fs from "fs";
import { FormData } from "node-fetch";
import fetch from "node-fetch";
import express from "express";
import { UpdateType } from "./constants.js";
import { Queue, Schedule } from "./extra.js";
import path from "path";
import { fileURLToPath } from 'url';
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Represents the context of the bot instance.
 */
class Context{
    /**
     * The shared bot instance.
     * @type {Bot|null}
     */
    static bot = null;
    /**
     * Context arguments array.
     * @type {Array<string>}
     */
    static args = [];
    /**
     * Bot specific data tied to the bot context.
     */
    static botData = new Map();

    /**
     * 
     * @param {Update} update 
     * @param {Bot} bot 
     */
    constructor (update, bot){
        /**
         * An update.
         */
        this.update = update;
        /**
         * The bot instance in this context.
         */
        this.bot = bot;
        /**
         * User specific data tied to the bot context.
         */
        this.userData = new Map();
        /**
         * Chat specific data tied to the bot context.
         */
        this.chatData = new Map();
        /**Array of words after a command. Quotation marks can be used to wrap multiple words together.
         * @type {string[]} 
         * */
        this.args = [];
    }

    /**
     * Get information about a file.
     * @param {Document} document 
     * @returns {Promise<_File>|null}
     */
    async getFile(document){
        if (document.file_size > 20*1024) {
            console.error("File size is too big.");
            return;
        }

        const response = await fetch(this.bot.endpoint + "getFile", {
            method: "POST",
            body: JSON.stringify({
                file_id: document.file_id
            })
        });

        return await response.json();
    }

    /**
     * Schedule a task to run repeatedly.
     * @param {{interval: number, callback: (update: Update, context: Context) => Promise<void>}} config 
     * @returns {Schedule} Schedule ID.
     */
    static schedule(config){
        const schedule = setInterval(config.callback, config.interval);
        console.log(`Scheduled task ${schedule} started.`);
        return new Schedule(schedule);
    }
}

/**
 * Represents the update object.
 */
class Update {
    /**@type {ChatMember} */
    #chat_member = null;

    constructor(update){
        this.update = update;
    }

    /**
     * Get the update type.
     * @returns {'message'|'edited_message'|'channel_post'|'edited_channel_post'|'business_connection'|'business_message'|'edited_business_message'|'deleted_business_message'|'message_reaction'|'message_reaction_count'|'inline_query'|'chosen_inline_result'|'callback_query'|'shipping_query'|'pre_checkout_query'|'purchased_paid_media'|'poll'|'my_chat_member'|'chat_member'|'chat_join_request'|'chat_boost'|'removed_chat_boost'}
     */
    get type(){
        const types = UpdateType.ALL;
        for (const type of types){
            if (this.update.hasOwnProperty(type)){
                return type;
            }
        }
        return "Unknown Update Type";
    }

    /**
     * @returns {number} The update's unique identifier. Update identifiers start from a certain positive number and increase sequentially. This identifier becomes especially handy if you're using webhooks, since it allows you to ignore repeated updates or to restore the correct update sequence, should they get out of order. If there are no new updates for at least a week, then identifier of the next update will be chosen randomly instead of sequentially.
     */
    get update_id() {return this.update.update_id;}
    /**
     * @returns {Message} New incoming message of any kind - text, photo, sticker, etc..
     */
    get message() {return this.update.hasOwnProperty("message")? new Message(this.update.message): null;}
    /**
     * @returns {Message} New version of a message that is known to the bot and was edited. This update may at times be triggered by changes to message fields that are either unavailable or not actively used by your bot.
     */
    get edited_message() {return this.update.hasOwnProperty("edited_message")? new Message(this.update.edited_message): null;}
    /**
     * @returns {Message} New incoming channel post of any kind - text, photo, sticker, etc..
     */
    get channel_post() {return this.update.hasOwnProperty("channel_post")? new Message(this.update.channel_post): null;}
    /**
     * @returns {Message} New version of a channel post that is known to the bot and was edited. This update may at times be triggered by changes to message fields that are either unavailable or not actively used by your bot.
     */
    get edited_channel_post() {return this.update.hasOwnProperty("edited_channel_post")? new Message(this.update.edited_channel_post): null;}
    /**
     * @returns {CallbackQuery} New incoming callback query.
     */
    get callback_query() {return this.update.hasOwnProperty("callback_query")? new CallbackQuery(this.update.callback_query): null;}
    /**
     * @returns {Chat} The effective chat the update comes from.
     */
    get effective_chat() {
        if(this.update?.message){
            let message = new Message(this.update.message);
            return message.chat;
        } else if (this.update?.callback_query){
            let message = new Message(this.update.callback_query.message);
            return message.chat;
        } else if (this.update?.chat_member){
            return new Chat(this.update.chat_member.chat);
        }
    }
    /**
     * @returns {User} The effective user the update comes from.
     */
    get effective_user() {
        if(this.update.hasOwnProperty("message")){
            let message = new Message(this.update.message);
            let chat_id = message.chat.id;
            Context.botData.set("effective_user_chat_id", chat_id);
            return message.from;
        } else if (this.update.hasOwnProperty("callback_query")){
            let user = new User(this.update.callback_query.from);
            return user;
        } else if (this.update?.chat_member){
            return new User(this.update.chat_member.from);
        }
    }
    /**
     * @returns {Message} The effective message that is sent.
     */
    get effective_message() {
        if(this.update.hasOwnProperty("message")){
            let message = new Message(this.update.message);
            return message;
        } else if (this.update.hasOwnProperty("callback_query")){
            let message = new Message(this.update.callback_query.message);
            return message;
        }
    }

    /**
     * @returns {ChatMemberAdministrator|ChatMemberOwner|ChatMemberMember|ChatMemberBanned|ChatMemberLeft|ChatMemberRestricted|ChatMemberUpdated}
     */
    get chat_member(){
        let update;

        if (this.#chat_member){
            update = {
                ...this.update,
                chat_member: Object.values(this.#chat_member)[0]
            }
        }
        
        if (update && update?.chat_member){
            this.#chat_member = update.chat_member;
            return new ChatMember(update.chat_member);
        } else if (this.update?.chat_member) {
            return new ChatMemberUpdated(this.update.chat_member);
        }
        return null;
    }

    set chat_member(value){
        this.#chat_member = value;
    }

    toJSON() {
        let update;

        if (this.#chat_member){
            update = {
                ...this.update,
                type: this.type,
                chat_member: Object.values(this.#chat_member)[0]
            }

            return update;
        }

        return this.update;
    }
    
}

/**
 * Represents the bot builder.
 */
class App {

    static defaultParams = {};
    #queue = new Queue();

    /**
     * @type {Update[]}
     */
    static updateHistory = [];

    /**
     * Store a number of past updates.
     * @param {Update} item 
     */
    static cache(item){
        App.updateHistory.push(item);

        if (App.updateHistory.length > 40) {
            App.updateHistory.shift();
        }
    }

    constructor (){
        this.api_key = null;
        this.update = null;
        this.context = null;
        this.last_update_id = null;
        this.bot = null;
        this.handlers = {
            global: [],
            conversation: null
        };
        this.server = null;
        this.express = null;
        this.base_url = null;
        this.ngrokTunnel = null;
        this.test_mode = false;
        this.update_offset = 0;
        this.lastProcessedTime = 0;
        this.timeout = null;

    }

    /**
     * Configure the app.
     * @param {{test: boolean}} options 
     */
    config(options){
        this.test_mode = options.test;
        return this;
    }

    /**
     * 
     * @param {{method: string, params: object|FormData, type: string}} config 
     * @returns 
     */
    static HTTP(config){
        
        if (config.params instanceof FormData){
            return {
                method: "POST",
                body: config.params,
            };
        } else {
            let type = "application/json; charset=UTF-8";

            return {
                method: "POST",
                headers: new Headers({
                    "Content-Type": config.type || type,
                }),
                body: JSON.stringify({
                method: config.method, 
                ...config.params,
                ...App.defaultParams
                }),
            };
        }
    }

    /**
     * Define a custom webhook endpoint response. You can integrate this with `Context`.
     * @param {"POST"|"GET"} method 
     * @param {string} path 
     * @param {(req: import("express").Request, res: import("express").Response) => Promise<void>} callback 
     */
    addEndPoint(method = "GET", path = "/", callback){
        if (!this.express) {
            console.error("Express server is uninitialised.");
            return;
        }

        if (method === "GET"){
            return this.express.get(path, callback);
        }

        return this.express.post(path, callback);
    }

    /**
     * Set default values.
     * @param {{parse_mode:string, link_preview_options: LinkPreviewOptions, disable_notification: boolean, protect_content: boolean}} config 
     * @returns 
     */
    defaults(config){
        App.defaultParams = config;
        return this;
    }

    /**
     * Set up a local telegram endpoint.
     * @param {string} url 
     * @returns 
     */
    baseUrl(url){
        this.base_url = url;
        return this;
    }

    /**
     * API token.
     * @param {string} api_key 
     * @returns 
     */
    token(api_key){
        this.api_key = api_key;
        return this;
    }

    /**
     * Initialize the app and create a bot instance in the current context.
     * @returns {App}
     */
    build(){
        if (!this.api_key) throw new Error("API KEY needs to be passed first.");
        this.bot = new Bot(this.api_key, this.test_mode);
        if (this.base_url){
            this.bot.endpoint = `${this.base_url}${this.api_key}/${this.test_mode ? "test/" : ""}`;
        }
        Context.bot = this.bot;
        return this;
    }

    /**
     * Add an update handler.
     * @param {BaseHandler} handler 
     */
    addHandler(handler){
        if (handler instanceof ConversationHandler && !this.handlers.conversation){
            this.handlers.conversation = handler;
            return this;
        }

        this.handlers.global.push(handler);
        return this;
    }

    /**
     * Set up a webhook.
     * @param {string} url 
     * @param {{url:string, drop_pending_updates: boolean, max_connections: number, certificate: InputFile, ip_address: string, secret_token: string, allowed_updates: string[]}} config
     * @returns 
     */
    async setWebhook(config){
        let params = App.HTTP({method: "setWebhook", params: {...config}});
        const response = await fetch(this.bot.endpoint, params);
        const data = await response.json();
    
        if (response.ok && data.url != ''){
            return true;
        }
    
        throw new Error("Failed to set the webhook:", data);
    }

    /**
     * Delete the webhook.
     * @returns {Promise<boolean>|Promise<Error>}
     */
    async deleteWebhook(){
    
        let config = App.HTTP({method: "deleteWebhook", params: {}});
        const response = await fetch(this.bot.endpoint, config);
    
        if (response.ok){
            return true;
        }
    
        throw new Error("Failed to delete the webhook.");
    }

    /**
     * Retrieve information about the webhook.
     * @returns {Promise<boolean>|Promise<WebhookInfo>}
     */
    async getWebhookInfo(){
        let config = App.HTTP({method: "getWebhookInfo", params: {}});
        const response = await fetch(this.bot.endpoint, config);
        const data = await response.json();
    
        if (response.ok){
            return new WebhookInfo(data.result);
        } else {
            console.warn("No webhook information:", data);
            return false;
        }
    }

    /**
     * This is a convenience function. It applies a rate limit for processing updates. This is in order to avoid being timed out by your webhook provider (assuming you don't have a good plan).
     */
    async _applyRateLimit() {
        const now = Date.now();

        // If the time between updates is too short, introduce a delay
        const delay = Math.max(0, this.lastProcessedTime + 1000 - now); // Delay for 1 second between updates
        if (delay > 0) {
            // console.log(`Rate limit exceeded, waiting for ${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        // Update the last processed time to the current time
        this.lastProcessedTime = Date.now();
    }

    /**
     * Retrieves the update object and passes it to the handlers.
     * @param {Update} update 
     * @returns 
     */
    async getUpdates(update){
        this.update = update;
        if (this.update.update_id === this.last_update_id) return;
        this.last_update_id = this.update.update_id;
        if (!this.bot) throw new Error("The bot instance does not exist.");
        if (!this.context) this.context = new Context(this.update, this.bot);

        this.context.update = this.update;

        this.#queue.addTask(() => new Promise(async res => {
            await this._applyRateLimit();
            if (this.handlers.conversation){
                const handled = await this.handlers.conversation.handle(this.update, this.context);
                if (this.handlers.conversation.isEnded){
                    this.handlers.conversation.reset();
                }
                if (handled) return;
            }
    
            for (const handler of this.handlers.global){
                await handler.handle(this.update, this.context);
            }

            res();
        }));

        if (!this.#queue.running){
            await this.#queue.processQueue();
        }
    }

    /**
     * Use this method to receive incoming updates using long polling (wiki). Returns an Array of Update objects.
     * @param {{offset: number, limit: number, timeout: number, allowed_updates: string[]}} config 
     * @param {boolean} debug
     */
    async run_polling(config, debug){
        if (this.timeout) clearTimeout(this.timeout)
        try {
            const params = App.HTTP({method: "getUpdates", params: {
                offset: this.update_offset,
                ...config
            }});
            const response = await fetch(this.bot.endpoint, params);

            if (!response.ok){
                throw new Error(`Unable to fetch updates (${response.status}): ${await response.text()}`);
            }

            const updates = await response.json();

            if (updates.ok && updates.result.length){
                if (debug) console.log(`[${new Date().toISOString()}] Update ${updates.result.at(-1).update_id}:\n${updates.result.at(-1)}`);
                for (const data of updates.result){
                    const update = new Update(data);

                    if (update.update_id > this.update_offset){
                        this.update_offset = update.update_id + 1;

                        await this.getUpdates(update);
                    }
                }
                
            }

            this.timeout = setTimeout(() => this.run_polling(config), 1000);
        } catch (error) {
            console.error("Error fetching updates:", error);
            this.timeout = setTimeout(() => this.run_polling(config), 1000);
        }
    }

    /**
     * Starts up the webhook for the bot. If you don't have `.env` file set up, you will need to define these values manually.
     * @param {{url: string, allowed_updates:string[], webhookPath: string, port: number, serverTimeout: number, secretToken: string, debug: boolean}} config 
     */
    async run(config = {}){
        if (this.server) {
            console.warn("Server already running.");
            return;
        }
        
        const app = express();
        this.express = app;
        const PORT = config.port || 3000;
        app.use(express.json());
        app.use(cors());

        app.post(config.webhookPath || "/", async (req, res) => {
            if (config?.debug){
                console.log("DEBUG:", JSON.stringify(req.body, null, 2));
            }
            const incomingToken = req.headers["x-telegram-bot-api-secret-token"];
            
            if ((process.env.SECRET_TOKEN || config.secretToken) && ![process.env.SECRET_TOKEN, config.secretToken].includes(incomingToken)) {
                console.warn('Invalid secret token:', incomingToken);
                return res.status(403).send('Forbidden');
            }

            res.status(200).send("ok");
            const update = new Update(req.body);
            try {
                // Store updates for future use.
                App.cache(update);
                await this.getUpdates(update);
            } catch (error) {
                console.error(`Error processing update:`, error);
            }
        });

        (async () => {
            this.server = app.listen(PORT, async () => {
                const url = config.url || process.env.WEBHOOK_URL;
                console.log(`WEBHOOK URL: ${url}`);
                const webhookInfo = await this.getWebhookInfo();

                // If webhook is already set at the correct URL, don't reset.
                if (webhookInfo.url === url){
                    console.log(`Webhook is already set at ${url}`);
                    return;
                }

                // If webhook is set to a different url, reset.
                if (webhookInfo.url){
                    try {
                        const deleted = await this.deleteWebhook();
                        if (deleted){
                            console.log("Webhook deleted.");
                        }
                    } catch (error) {
                        console.error(`Unable to delete webhook:`, error);
                    }
                }

                const allowed_updates = config.allowed_updates || [UpdateType.ALL];

                // If webhook is set incorrectly or unset, set it up.
                await this.setWebhook({url: url, drop_pending_updates: true, secret_token: process.env.SECRET_TOKEN, allowed_updates: allowed_updates});
                console.log(`Webhook set at ${url}`);
            });
        
            this.server.timeout = config.serverTimeout || 0;
        })();
    }

    /**
     * Kills the express server.
     */
    async stop() {
        if (this.server) {
            console.log("Stopping server...");
            this.server.close(() => {
                console.log("Server stopped.");
            });
        }
    }
}

/**
 * Represents a bot object.
 */
class Bot {
    /**
     * 
     * @param {string} token 
     */
    constructor (token, test_mode = false){
        this.token = token;
        this.endpoint = `https://api.telegram.org/bot${token}/${test_mode ? "test/" : ""}`
    }

    /**
     * Use this method to send text messages. On success, the sent `Message` is returned.
     * @param {{chat_id: number|string, message_thread_id: number, text: string, parse_mode: string, link_preview_options: LinkPreviewOptions|{is_disabled: boolean, url: string, prefer_small_media: boolean, prefer_large_media: boolean, show_above_text: boolean}, disable_notification: boolean, protect_content: boolean, message_effect_id: string, reply_parameters: ReplyParameters|Object, reply_markup: InlineKeyboardMarkup|Object}} config 
     * @returns {Promise<Message>|Promise<null>}
     */
    async sendMessage(config){
        let params = App.HTTP({method: "sendMessage", params: config});
        const response = await fetch(this.endpoint, params);
        if (!response.ok){
            console.error("Error:", await response.text());
            return null;
        }
        const message = await response.json();
        return new Message(message.result);
    }

    /**
     * Use this method to send photos. On success, the sent `Message` is returned.
     * 
     * For example:
     * 
     * ```
     * await bot.sendPhoto({chat_id: chat_id, photo: await fs.openAsBlob(path)});
     * ```
     * 
     * @param {{chat_id: number|string, message_thread_id: number, photo: InputFile|Blob|string, caption:string, parse_mode:string, caption_entities: Array<MessageEntity>, show_caption_above_media: boolean, has_spoiler:boolean, disable_notification:boolean, protect_content: boolean, message_effect_id: string, reply_parameters: ReplyParameters, reply_markup:InlineKeyboardMarkup}} config 
     * @returns {Promise<Message>}
     */
    async sendPhoto(config){
        const formdata = new FormData();
        for (const [key, val] of Object.entries({...config, ...App.defaultParams})){
        formdata.append(key, val);
        }
        let params = App.HTTP({params: formdata});
        const response = await fetch(this.endpoint + "sendPhoto", params)
        .then(resp => resp.json());
        return new Message(response.result);
    }

    /**
     * Use this method to delete a message, including service messages, with the following limitations:
    - A message can only be deleted if it was sent less than 48 hours ago.
    - Service messages about a supergroup, channel, or forum topic creation can't be deleted.
    - A dice message in a private chat can only be deleted if it was sent more than 24 hours ago.
    - Bots can delete outgoing messages in private chats, groups, and supergroups.
    - Bots can delete incoming messages in private chats.
    - Bots granted `can_post_messages` permissions can delete outgoing messages in channels.
    - If the bot is an administrator of a group, it can delete any message there.
    - If the bot has can_delete_messages permission in a supergroup or a channel, it can delete any message there.

    Returns `True` on success.
     * @param {{chat_id: number|string, message_id: number}} config 
     * @returns {Promise<boolean>}
     */
    async deleteMessage(config){
        let params = App.HTTP({method: "deleteMessage", params: config});
        const response = await fetch(this.endpoint, params)
        .then(resp => resp.json());
        return response.result;
    }

    /**
     * Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     * 
     * If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever. Applied for supergroups and channels only.
     * 
     * @param {{chat_id: number|string, user_id: number, until_date: number, revoke_messages: boolean}} config 
     * @returns {Promise<boolean>}
     */
    async banChatMember(config){
        let params = App.HTTP({method: "banChatMember", params: config});
        const response = await fetch(this.endpoint, params)
        .then(resp => resp.json());
        return response.result;
    }

    /**
     * Use this method to unban a previously banned user in a supergroup or channel. The user will not return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be removed from the chat. If you don't want this, use the parameter only_if_banned. Returns True on success.
     * @param {{chat_id: number|string, user_id: number, only_if_banned: boolean}} config 
     * @returns {Promise<boolean>}
     */
    async unbanChatMember(config){
        let params = App.HTTP({method: "unbanChatMember", params: config});
        const response = await fetch(this.endpoint, params)
        .then(resp => resp.json());
        return response.result;
    }

    /**
     * Use this method to send answers to callback queries sent from inline keyboards. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, True is returned.
     * @param {{callback_query_id: string, text: string, show_alert: boolean, url: string, cache_time: number}} config 
     * @returns {Promise<boolean>}
     */
    async answerCallbackQuery(config){
        let params = App.HTTP({method: "answerCallbackQuery", params: config});
        const response = await fetch(this.endpoint, params)
        .then(resp => resp.json());
        return response.result;
    }

    /**
     * Use this method to send video files, Telegram clients support MPEG4 videos (other formats may be sent as `Document`). On success, the sent `Message` is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.
     * 
     * For example:
     * 
     * ```
     * await bot.sendVideo({chat_id: chat_id, video: await fs.openAsBlob(path)});
     * ```
     * 
     * @param {{chat_id: string|number, message_thread_id: number, video: InputFile|Blob|string, duration: number, width: number, height: number, thumbnail: InputFile|string, caption: string, parse_mode: string, caption_entities: Array<MessageEntity>, show_caption_above_media: boolean, has_spoiler: boolean, supports_streaming: boolean, disable_notification: boolean, protect_content: boolean, message_effect_id: string, reply_parameters: ReplyParameters, reply_markup: InlineKeyboardMarkup}} config 
     * @returns {Promise<Message>}
     */
    async sendVideo(config){
        const formdata = new FormData();
        for (const [key, val] of Object.entries({...config, ...App.defaultParams})){
            formdata.append(key, val);
        }

        let params = App.HTTP({params: formdata});
        const response = await fetch(this.endpoint + "sendVideo", params)
        .then(resp => resp.json());
        return new Message(response.result);
    }

    /**
     * Use this method to edit text and game messages. On success, if the edited message is not an inline message, the edited `Message` is returned, otherwise `True` is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
     * @param {{chat_id: string|number, message_id: number, inline_message_id: string, text: string, parse_mode: string, entities: Array<MessageEntity>, link_preview_options: LinkPreviewOptions, reply_markup: InlineKeyboardMarkup}} config 
     * @returns {Promise<Message>|Promise<boolean>}
     */
    async editMessageText(config){
        let params = App.HTTP({method: "editMessageText", params: config});
        const response = await fetch(this.endpoint, params);
        if (!response.ok){
            console.error(`Failed to edit message text:`, await response.text());
            return false;
        }
        const message = await response.json();
        if (message.result instanceof Boolean){
            return message.result;
        }
        return new Message(message.result);
    }

    /**
     * Use this method to add a message to the list of pinned messages in a chat. If the chat is not a private chat, the bot must be an administrator in the chat for this to work and must have the 'can_pin_messages' administrator right in a supergroup or 'can_edit_messages' administrator right in a channel. Returns `true` on success.
     * @param {{business_connection_id: string, chat_id: string|number, message_id: number, disable_notification: boolean}} config 
     * @returns {Promise<boolean>}
     */
    async pinChatMessage(config){
        let params = App.HTTP({method: "pinChatMessage", params: config});
        const response = await fetch(this.endpoint, params);
        if (!response.ok){
            console.error(`Failed to pin message:`, await response.text());
            return false;
        }
        const message = await response.json();
        return message.result;
    }

    /**
     * Use this method to edit animation, audio, document, photo, or video messages. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo or a video otherwise. When an inline message is edited, a new file can't be uploaded; use a previously uploaded file via its `file_id` or specify a URL. On success, if the edited message is not an inline message, the edited `Message` is returned, otherwise `True` is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
     * @param {{chat_id: string|number, message_id: number, inline_message_id: string, media: InputMediaAnimation|InputMediaAudio|InputMediaDocument|InputMediaPhoto|InputMediaVideo, reply_markup: InlineKeyboardMarkup}} config 
     * @returns {Promise<Message>|Promise<boolean>}
     */
    async editMessageMedia(config){
        let params = App.HTTP({method: "editMessageMedia", params: config});
        const response = await fetch(this.endpoint, params)
        .then(resp => resp.json());
        if (response.result instanceof Boolean){
            return response.result;
        }
        return new Message(response.result);
    }

    /**
     * Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns `True` on success.
     * @param {{chat_id: number|string, message_thread_id: number, action: string}} config 
     * @returns {Promise<boolean>}
     */
    async sendChatAction(config){
        let params = App.HTTP({method: "sendChatAction", params: config});
        const response = await fetch(this.endpoint, params)
        .then(resp => resp.json());
        return response.result;
    }

    /**
     * Use this method to send a group of photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type. On success, an array of `Messages` that were sent is returned.
     * @param {{chat_id: string|number, message_thread_id: number, media: Array<InputMediaAudio>|Array<InputMediaDocument>|Array<InputMediaPhoto>|Array<InputMediaVideo>, disable_notification: boolean, protect_content: boolean, message_effect_id: string, reply_parameters: ReplyParameters}} config 
     * @returns {Promise<Message>}
     */
    async sendMediaGroup(config){
        const formdata = new FormData();
        
        for (const [key, val] of Object.entries({...config, ...App.defaultParams})){
            if (key == "media") continue;
            formdata.append(key, val);
        }

        const media = config.media;

        formdata.append("media", JSON.stringify(media));

        for (const item of media){
            const filepath = item.path;
            const filename = item.media.replace("attach://", "");
            const blob = await fs.openAsBlob(filepath);
            formdata.append(filename, blob);
        }

        const params = App.HTTP({params: formdata});
        const response = await fetch(this.endpoint + "sendMediaGroup", params)
        .then(resp => resp.json());

        if (!response.result){
            throw new Error(`Error sending media group: ${JSON.stringify(response, null, 2)}`);
        }

        return response.result.map(message => new Message(message));
    }

    /**
     * Use this method to get basic information about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a `File` object is returned. The file can then be downloaded via the link `https://api.telegram.org/file/bot<token>/<file_path>`, where `<file_path>` is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling `getFile` again.
     * 
     * If you are using a local Telegram bot, you can upload and download up to 2GB.
     * 
     * @param {{file_id: string}} config 
     * @returns {Promise<_File>}
     */
    async getFile(config){
        let params = App.HTTP({method: "getFile", params: config});
        const response = await fetch(this.endpoint, params)
        .then(resp => resp.json());
        return new _File(response.result);
    }

    /**
     * Use this method to send general files. On success, the sent `Message` is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
     * @param {{chat_id: number|string, document: InputFile|string, thumbnail: InputFile|string, caption:string, parse_mode: string, disable_content_type_detection:boolean, disable_notification: boolean, protect_content: boolean, message_effect_id: string, reply_parameters: ReplyParameters, reply_markup: InlineKeyboardMarkup}} config 
     * @returns {Promise<Message>}
     */
    async sendDocument(config){
        const formdata = new FormData();
        for (const [key, val] of Object.entries({...config, ...App.defaultParams})){
            if (key == "document") continue;
            formdata.append(key, val);
        }

        formdata.append("document", config.document, "Archive.zip");

        let params = App.HTTP({params: formdata});
        const response = await fetch(this.endpoint + "sendDocument", params)
        .then(resp => resp.json());
        return new Message(response.result);
    }

    /**
     * Use this method to get information about a member of a chat. The method is only guaranteed to work for other users if the bot is an administrator in the chat. Returns a `ChatMember` object on success.
     * @param {{chat_id: string|number, user_id: number}} config 
     * @returns {Promise<ChatMemberMember>|Promise<ChatMemberRestricted>|Promise<ChatMemberBanned>|Promise<ChatMemberOwner>|Promise<ChatMemberAdministrator>|Promise<ChatMemberLeft>}
     */
    async getChatMember(config){
        let params = App.HTTP({method: "getChatMember", params: config});
        const response = await fetch(this.endpoint, params);

        if (!response.ok){
            console.error(await response.text());
            return null;
        }
        const resp = await response.json();
        return new ChatMember(resp.result);
    }

    /**
     * Use this method to get up-to-date information about the chat. Returns a `ChatFullInfo` object on success.
     * @param {string|number} chat_id Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`).
     * @returns {Promise<ChatFullInfo>|Promise<null>}
     */
    async getChat(chat_id){
        const response = await fetch(this.endpoint + "getChat", {
            method: "POST",
            body: JSON.stringify({
                chat_id: chat_id
            })
        });
        
        if (!response.ok){
            console.error("Error:", await response.text());
            return null;
        }
        const resp = await response.json();

        return new ChatFullInfo(resp.result);
    } 

    /**
     * Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass True for all permissions to lift restrictions from a user. Returns True on success.
     * @param {{chat_id: number|string, user_id: number, permissions: ChatPermissions, use_independent_chat_permissions: boolean, until_date: number}} config 
     */
    async restrictChatMember(config){
        let params = App.HTTP({method: "restrictChatMember", params: config});
        const response = await fetch(this.endpoint, params);
        
        if (!response.ok){
            console.error("Error:", await response.text());
            return null;
        }

        const result = await response.json();
        return result.result;
    }

    /**
     * Use this method to forward messages of any kind. Service messages and messages with protected content can't be forwarded. On success, the sent Message is returned.
     * @param {{chat_id: number|string, message_thread_id: number, from_chat_id: number|string, disable_notification: boolean, protect_content: boolean, message_id: number}} config 
     * @returns {Promise<Message>}
     */
    async forwardMessage(config){
        let params = App.HTTP({method: "forwardMessage", params: config});
        const response = await fetch(this.endpoint, params);
        
        if (!response.ok){
            console.error("Error:", await response.text());
            return null;
        }

        const result = await response.json();
        return new Message(result.result);
    }

    /**
     * Use this method to forward multiple messages of any kind. If some of the specified messages can't be found or forwarded, they are skipped. Service messages and messages with protected content can't be forwarded. Album grouping is kept for forwarded messages. On success, an array of MessageId of the sent messages is returned.
     * @param {{chat_id: number|string, message_thread_id: number, from_chat_id: number|string, disable_notification: boolean, protect_content: boolean, message_ids: number[]}} config 
     * @returns {Promise<MessageId[]>}
     */
    async forwardMessages(config){

        if (config.message_ids.length > 100 || config.message_ids.length < 1){
            console.error("The array of message ids must be between 1 and 100.");
            return null;
        }

        let params = App.HTTP({method: "forwardMessages", params: config});
        const response = await fetch(this.endpoint, params);
        
        if (!response.ok){
            console.error("Error:", await response.text());
            return null;
        }

        const result = await response.json();
        return result.result.map(x => new MessageId(x));
    }

    /**
     * Use this method to get a list of profile pictures for a user. Returns a `UserProfilePhotos` object.
     * @param {{user_id: number, limit: number, offset: number}} config 
     * @returns 
     */
    async getUserProfilePhotos(config){
        let params = App.HTTP({method: "getUserProfilePhotos", params: config});
        const response = await fetch(this.endpoint, params);
        
        if (!response.ok){
            console.error("Error:", await response.text());
            return null;
        }

        const result = await response.json();
        return new UserProfilePhotos(result.result);
    }

}

export {
    App,
    Bot,
    Update,
    Context
}