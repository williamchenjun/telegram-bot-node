import {filterObject} from "./utils.js";
import { Context } from "./base.js";

/**
 * This object represents a unique message identifier.
 */
class MessageId {
    constructor(messageId){
        this.messageId = messageId;
    }
    /**
     * Unique message identifier. In specific instances (e.g., message containing a video sent to a big chat), the server might automatically schedule a message instead of sending it immediately. In such cases, this field will be 0 and the relevant message will be unusable until it is actually sent.
     * @returns {number}
     */
    get message_id(){return this.messageId?.message_id;}
}

/**
 * This object represents a message.
 */
class Message{
    constructor(message) {
        this.message = message;
    }

    toJSON() {
        return { ...this };
    }

    // ===== BASIC =====

    /**
     * Unique message identifier inside this chat. In specific instances (e.g., message containing a video sent to a big chat), the server might automatically schedule a message instead of sending it immediately. In such cases, this field will be 0 and the relevant message will be unusable until it is actually sent.
     * @returns {number}
     */
    get message_id(){return this.message?.message_id};

    /**
     * Optional. Unique identifier of a message thread or forum topic to which the message belongs; for supergroups and private chats only.
     * @returns {number}
     */
    get message_thread_id(){return this.message?.message_thread_id};

    /**
     * Optional. Sender of the message.
     * @returns {User}
     */
    get from(){return this.message?.from ? new User(this.message.from) : null};

    /**
     * Optional. Sender of the message when sent on behalf of a chat.
     * @returns {Chat}
     */
    get sender_chat(){return this.message?.sender_chat ? new Chat(this.message.sender_chat) : null};

    /**
     * Date the message was sent in Unix time. It is always a positive number, representing a valid date.
     * @returns {number}
     */
    get date(){return this.message?.date};

    /**
     * Chat the message belongs to.
     * @returns {Chat}
     */
    get chat(){return this.message?.chat ? new Chat(this.message.chat) : null};

    // ===== FORWARD / REPLY =====

    /**
     * Optional. Information about the original message for forwarded messages.
     * @returns {MessageOrigin}
     */
    get forward_origin(){
        return this.message?.forward_origin
            ? new MessageOrigin(this.message.forward_origin)
            : null;
    }

    /**
     * Optional. For replies in the same chat and message thread, the original message.
     * @returns {Message}
     */
    get reply_to_message(){
        return this.message?.reply_to_message
            ? new Message(this.message.reply_to_message)
            : null;
    }

    /**
     * Optional. Information about the message that is being replied to, which may come from another chat or forum topic.
     * @returns {ExternalReplyInfo}
     */
    get external_reply(){
        return this.message?.external_reply
            ? new ExternalReplyInfo(this.message.external_reply)
            : null;
    }

    /**
     * Optional. For replies to a story, the original story.
     * @returns {Story}
     */
    get reply_to_story(){
        return this.message?.reply_to_story
            ? new Story(this.message.reply_to_story)
            : null;
    }

    // ===== TEXT =====

    /**
     * Optional. For text messages, the actual UTF-8 text of the message.
     * @returns {string}
     */
    get text(){return this.message?.text};

    /**
     * Optional. Special entities that appear in the text.
     * @returns {MessageEntity[]}
     */
    get entities(){
        return this.message?.entities?.map(e => new MessageEntity(e));
    }

    // ===== MEDIA =====

    /**
     * Optional. Message is an animation, information about the animation.
     * @returns {Animation}
     */
    get animation(){return this.message?.animation ? new Animation(this.message.animation) : null};

    /**
     * Optional. Message is an audio file.
     * @returns {Audio}
     */
    get audio(){return this.message?.audio ? new Audio(this.message.audio) : null};

    /**
     * Optional. Message is a general file.
     * @returns {Document}
     */
    get document(){return this.message?.document ? new Document(this.message.document) : null};

    /**
     * Optional. Message contains paid media.
     * @returns {PaidMediaInfo}
     */
    get paid_media(){
        return this.message?.paid_media
            ? new PaidMediaInfo(this.message.paid_media)
            : null;
    }

    /**
     * Optional. Message is a photo.
     * @returns {PhotoSize[]}
     */
    get photo(){
        return this.message?.photo?.map(p => new PhotoSize(p));
    }

    /**
     * Optional. Message is a sticker.
     * @returns {Sticker}
     */
    get sticker(){return this.message?.sticker ? new Sticker(this.message.sticker) : null};

    /**
     * Optional. Message is a video.
     * @returns {Video}
     */
    get video(){return this.message?.video ? new Video(this.message.video) : null};

    /**
     * Optional. Message is a video note.
     * @returns {VideoNote}
     */
    get video_note(){return this.message?.video_note ? new VideoNote(this.message.video_note) : null};

    /**
     * Optional. Message is a voice message.
     * @returns {Voice}
     */
    get voice(){return this.message?.voice ? new Voice(this.message.voice) : null};

    // ===== CAPTION =====

    /**
     * Optional. Caption for the animation, audio, document, paid media, photo, video or voice.
     * @returns {string}
     */
    get caption(){return this.message?.caption};

    /**
     * Optional. Entities in caption.
     * @returns {MessageEntity[]}
     */
    get caption_entities(){
        return this.message?.caption_entities?.map(e => new MessageEntity(e));
    }

    // ===== OTHER CONTENT =====

    /**
     * Optional. Message is a checklist.
     * @returns {Checklist}
     */
    get checklist(){return this.message?.checklist ? new Checklist(this.message.checklist) : null};

    /**
     * Optional. Message is a contact.
     * @returns {Contact}
     */
    get contact(){return this.message?.contact ? new Contact(this.message.contact) : null};

    /**
     * Optional. Message is a dice.
     * @returns {Dice}
     */
    get dice(){return this.message?.dice ? new Dice(this.message.dice) : null};

    /**
     * Optional. Message is a game.
     * @returns {Game}
     */
    get game(){return this.message?.game ? new Game(this.message.game) : null};

    /**
     * Optional. Message is a poll.
     * @returns {Poll}
     */
    get poll(){return this.message?.poll ? new Poll(this.message.poll) : null};

    /**
     * Optional. Message is a venue.
     * @returns {Venue}
     */
    get venue(){return this.message?.venue ? new Venue(this.message.venue) : null};

    /**
     * Optional. Message is a location.
     * @returns {Location}
     */
    get location(){return this.message?.location ? new Location(this.message.location) : null};

    // ===== MEMBERS =====

    /**
     * Optional. New members that were added.
     * @returns {User[]}
     */
    get new_chat_members(){
        return this.message?.new_chat_members?.map(u => new User(u));
    }

    /**
     * Optional. A member was removed.
     * @returns {User}
     */
    get left_chat_member(){
        return this.message?.left_chat_member
            ? new User(this.message.left_chat_member)
            : null;
    }

    // ===== PAYMENTS =====

    /**
     * Optional. Message is an invoice for a payment.
     * @returns {Invoice}
     */
    get invoice(){
        return this.message?.invoice
            ? new Invoice(this.message.invoice)
            : null;
    }

    // ===== SERVICE =====

    /**
     * Optional. Service message: some tasks in a checklist were marked as done or not done.
     * @returns {ChecklistTasksDone}
     */
    get checklist_tasks_done(){
        return this.message?.checklist_tasks_done
            ? new ChecklistTasksDone(this.message.checklist_tasks_done)
            : null;
    }

    /**
     * Optional. Service message: tasks were added to a checklist.
     * @returns {ChecklistTasksAdded}
     */
    get checklist_tasks_added(){
        return this.message?.checklist_tasks_added
            ? new ChecklistTasksAdded(this.message.checklist_tasks_added)
            : null;
    }

    /**
     * Optional. Inline keyboard attached to the message.
     * @returns {InlineKeyboardMarkup}
     */
    get reply_markup(){
        return this.message?.reply_markup
            ? new InlineKeyboardMarkup(this.message.reply_markup)
            : null;
    }

    // ===== USEFUL METHODS =====

    /**
     * Message deep link.
     * 
     * For example: `https://t.me/c/123456/12`.
     * 
     * @returns {Promise<string>|Promise<null>}
     */
    async message_link(){
        const chat = await Context.bot.getChat(this.chat.id);
        if (chat){
            if (chat?.username) return `https://t.me/${chat.username}/${this.message_id}`;
            return `https://t.me/c/${this.chat.id}/${this.message_id}`;
        }
        return null;
    }

    /**
     * Use this method to edit text and game messages. On success, if the edited message is not an inline message, the edited `Message` is returned, otherwise `True` is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within 48 hours from the time they were sent.
     * 
     * Shortcut for `bot.editMessageText(...)`.
     * 
     * @param {{text: string, parse_mode: string, entities: Array<MessageEntity>, link_preview_options: LinkPreviewOptions, reply_markup: InlineKeyboardMarkup}} config 
     * @returns {Promise<Message>|Promise<boolean>}
     */
    async editText(config){
        return await Context.bot.editMessageText({"chat_id": this.chat.id, "message_id": this.message_id, ...config});
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

    Shortcut for `bot.deleteMessage(...)`.

    Returns `True` on success.
    * @returns {Promise<boolean>}
    */
    async delete(){
        return await Context.bot.deleteMessage({chat_id: this.chat.id, message_id: this.message_id});
    }

    /**
     * Use this method to reply to a text message. On success, the sent `Message` is returned.
     * @param {{text: string, parse_mode: string, link_preview_options: LinkPreviewOptions|{is_disabled: boolean, url: string, prefer_small_media: boolean, prefer_large_media: boolean, show_above_text: boolean}, disable_notification: boolean, protect_content: boolean, message_effect_id: string, reply_markup: InlineKeyboardMarkup|Object}} config 
     * @returns {Promise<Message>}
     */
    async reply(config){
        return await Context.bot.sendMessage({chat_id: this.chat.id, ...new ReplyParameters({message_id: this.message_id}), ...config});
    }

    /**
     * Use this method to add a message to the list of pinned messages in a chat. If the chat is not a private chat, the bot must be an administrator in the chat for this to work and must have the 'can_pin_messages' administrator right in a supergroup or 'can_edit_messages' administrator right in a channel. Returns `true` on success.
     * 
     * Shortcut of `bot.pinChatMessage()`.
     * 
     * @param {{business_connection_id?: string, disable_notification?: boolean}} config 
     * @returns {Promise<boolean>}
     */
    async pin(config){
        return await Context.bot.pinChatMessage({chat_id: this.chat.id, message_id: this.message_id, ...config})
    }

    /**
     * Use this method to remove a message from the list of pinned messages in a chat. In private chats and channel direct messages chats, all messages can be unpinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin messages in groups and channels respectively. Returns True on success.
     * 
     * Shortcut of `bot.unpinChatMessage()`.
     * 
     * @param {{business_connection_id?: string}} config 
     * @returns {Promise<boolean>}
     */
    async unpin(config){
        return await Context.bot.unpinChatMessage({chat_id: this.chat.id, message_id: this.message_id, ...config})
    }

    /**
     * Use this method to forward messages of any kind. Service messages and messages with protected content can't be forwarded. On success, the sent Message is returned.
     * 
     * Shortcut of `bot.forwardMessage()`.
     * 
     * @param {{chat_id: number|string, message_thread_id: number, disable_notification: boolean, protect_content: boolean}} config 
     * @returns {Promise<Message>}
     */
    async forward(config){
        return await Context.bot.forwardMessage({from_chat_id: this.chat.id, message_id: this.message_id, ...config});
    }
}

/**
 * This object represents a Telegram user or bot.
 */
class User{
    constructor(user) {
        this.user = user;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * Unique identifier for this user or bot. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier.
     * @returns {number}
     */
    get id(){return this.user?.id};

    /**
     * True, if this user is a bot.
     * @returns {boolean}
     */
    get is_bot(){return this.user?.is_bot};

    /**
     * User's or bot's first name.
     * @returns {string}
     */
    get first_name(){return this.user?.first_name};

    /**
     * Optional. User's or bot's last name.
     * @returns {string}
     */
    get last_name(){return this.user?.last_name};

    /**
     * Optional. User's or bot's username.
     * @returns {string}
     */
    get username(){return this.user?.username};

    /**
     * Optional. IETF language tag of the user's language.
     * @returns {string}
     */
    get language_code(){return this.user?.language_code};

    /**
     * Optional. True, if this user is a Telegram Premium user.
     * @returns {boolean}
     */
    get is_premium(){return this.user?.is_premium};

    /**
     * Optional. True, if this user added the bot to the attachment menu.
     * @returns {boolean}
     */
    get added_to_attachment_menu(){return this.user?.added_to_attachment_menu};

    /**
     * Optional. True, if the bot can be invited to groups. Returned only in getMe.
     * @returns {boolean}
     */
    get can_join_groups(){return this.user?.can_join_groups};

    /**
     * Optional. True, if privacy mode is disabled for the bot. Returned only in getMe.
     * @returns {boolean}
     */
    get can_read_all_group_messages(){return this.user?.can_read_all_group_messages};

    /**
     * Optional. True, if the bot supports inline queries. Returned only in getMe.
     * @returns {boolean}
     */
    get supports_inline_queries(){return this.user?.supports_inline_queries};

    /**
     * Optional. True, if the bot can be connected to a Telegram Business account to receive its messages. Returned only in getMe.
     * @returns {boolean}
     */
    get can_connect_to_business(){return this.user?.can_connect_to_business};

    /**
     * Optional. True, if the bot has a main Web App. Returned only in getMe.
     * @returns {boolean}
     */
    get has_main_web_app(){return this.user?.has_main_web_app};

    /**
     * Optional. True, if the bot has forum topic mode enabled in private chats. Returned only in getMe.
     * @returns {boolean}
     */
    get has_topics_enabled(){return this.user?.has_topics_enabled};

    /**
     * Optional. True, if the bot allows users to create and delete topics in private chats. Returned only in getMe.
     * @returns {boolean}
     */
    get allows_users_to_create_topics(){return this.user?.allows_users_to_create_topics};

    /**
     * Optional. True, if other bots can be created to be controlled by the bot. Returned only in getMe.
     * @returns {boolean}
     */
    get can_manage_bots(){return this.user?.can_manage_bots};

    /**
     * @returns {string} User's or bot's full name.
     */
    get full_name(){return `${this.first_name || ""}${this.first_name && this.last_name ? " " : ""}${this.last_name || ""}`;}

    /**
     * @returns {string} Returns an HTML `<a href>` hyperlink mentioning the user. If no name is passed, it will show their full name.
     */
    mention_html(name = null){
        if (name === null){
            let full_name = `${this.first_name || ""}${this.first_name && this.last_name ? " " : ""}${this.last_name || ""}`;
            return `<a href="tg://user?id=${this.user.id}">${full_name}</a>`;
        } else {
            return `<a href="tg://user?id=${this.user.id}">${name}</a>`;
        }
    }

    /**
     * Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     * 
     * If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever. Applied for supergroups and channels only.
     * 
     * Shortcut of `bot.banChatMember()`.
     * 
     * @param {{chat_id?: number, until_date: number, revoke_messages: boolean}} config 
     * @returns {Promise<boolean>}
     */
    async ban(config){
        const chat_id = Context.botData.get("effective_user_chat_id");
        if (chat_id){
            return await Context.bot.banChatMember({chat_id: chat_id, user_id: this.id, ...config});
        } else {
            try {
                const ban = await Context.bot.banChatMember({chat_id: config?.chat_id, user_id: this.id, ...config});
                return ban;
            } catch (error) {
                console.error(error);
                return null;
            }
        }
    }

    /**
     * Use this method to unban a previously banned user in a supergroup or channel. The user will not return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be removed from the chat. If you don't want this, use the parameter only_if_banned. Returns True on success.
     * 
     * Shortcut of `bot.unbanChatMember()`.
     * 
     * @param {{chat_id?: number, only_if_banned: boolean}} config 
     * @returns {Promise<boolean>}
     */
    async unban(config){
        const chat_id = Context.botData.get("effective_user_chat_id");
        if (chat_id){
            return await Context.bot.unbanChatMember({chat_id: chat_id, user_id: this.id, ...config});
        } else {
            try {
                const unban = await Context.bot.unbanChatMember({chat_id: config?.chat_id, user_id: this.id, ...config});
                return unban;
            } catch (error) {
                console.error(error);
                return null;
            }
        }
    }

    /**
     * Use this method to set a tag for a regular member in a group or a supergroup. The bot must be an administrator in the chat for this to work and must have the can_manage_tags administrator right. Returns True on success.
     * 
     * Shortcut of `bot.setChatMemberTag()`.
     * 
     * @param {{tag: string}} config 
     * @returns {Promise<boolean>}
     */
    async setChatMemberTag(config) {
        const chat_id = Context.botData.get("effective_user_chat_id");
        if (chat_id){
            return await Context.bot.setChatMemberTag({chat_id: chat_id, user_id: this.id, ...config});
        } else {
            try {
                const tag = await Context.bot.setChatMemberTag({chat_id: config?.chat_id, user_id: this.id, ...config});
                return tag;
            } catch (error) {
                console.error(error);
                return null;
            }
        }
    }
}

/**
 * This object describes the rating of a user based on their Telegram Star spendings.
 */
class UserRating {
    constructor(user_rating) {
        this.user_rating = user_rating;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * Current level of the user, indicating their reliability when purchasing digital goods and services. A higher level suggests a more trustworthy customer; a negative level is likely reason for concern.
     * @returns {number}
     */
    get level(){return this.user_rating?.level};

    /**
     * Numerical value of the user's rating; the higher the rating, the better.
     * @returns {number}
     */
    get rating(){return this.user_rating?.rating};

    /**
     * The rating value required to get the current level.
     * @returns {number}
     */
    get current_level_rating(){return this.user_rating?.current_level_rating};

    /**
     * Optional. The rating value required to get to the next level; omitted if the maximum level was reached.
     * @returns {number}
     */
    get next_level_rating(){return this.user_rating?.next_level_rating};
}

/**
 * This object contains information about the color scheme for a user's name, message replies and link previews based on a unique gift.
 */
class UniqueGiftColors {
    constructor(unique_gift_colors) {
        this.unique_gift_colors = unique_gift_colors;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * Custom emoji identifier of the unique gift's model.
     * @returns {string}
     */
    get model_custom_emoji_id(){return this.unique_gift_colors?.model_custom_emoji_id};

    /**
     * Custom emoji identifier of the unique gift's symbol.
     * @returns {string}
     */
    get symbol_custom_emoji_id(){return this.unique_gift_colors?.symbol_custom_emoji_id};

    /**
     * Main color used in light themes; RGB format.
     * @returns {number}
     */
    get light_theme_main_color(){return this.unique_gift_colors?.light_theme_main_color};

    /**
     * List of 1-3 additional colors used in light themes; RGB format.
     * @returns {number[]}
     */
    get light_theme_other_colors(){return this.unique_gift_colors?.light_theme_other_colors};

    /**
     * Main color used in dark themes; RGB format.
     * @returns {number}
     */
    get dark_theme_main_color(){return this.unique_gift_colors?.dark_theme_main_color};

    /**
     * List of 1-3 additional colors used in dark themes; RGB format.
     * @returns {number[]}
     */
    get dark_theme_other_colors(){return this.unique_gift_colors?.dark_theme_other_colors};
}

/**
 * This object represents a chat.
 */
class Chat {
    constructor(chat){
        this.chat = chat;
    }
    
    /**
     * @returns {number} Unique identifier for this chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.
     */
    get id(){return this.chat.id;}
    /**
     * @returns {string} Type of the chat, can be either “private”, “group”, “supergroup” or “channel”.
     */
    get type(){return this.chat.type;}
    /**
     * @returns {string} Optional. Title, for supergroups, channels and group chats.
     */
    get title(){return this.chat.hasOwnProperty("title")? this.chat.title : null;}
    /**
     * @returns {string} Optional. Username, for private chats, supergroups and channels if available.
     */
    get username(){return this.chat.hasOwnProperty("username")? this.chat.username : null;}
    /**
     * @returns {string} Optional. First name of the chat.
     */
    get first_name(){return this.chat.hasOwnProperty("first_name")? this.chat.first_name : null;}
    /**
     * @returns {string} Optional. Last name of the chat.
     */
    get last_name(){return this.chat.hasOwnProperty("last_name")? this.chat.last_name : null;}
    /**
     * @returns {string} Optional. Full name of the chat.
     */
    get full_name(){return `${this.first_name || ""}${this.first_name && this.last_name ? " " : ""}${this.last_name || ""}`}
    /**
     * @returns {boolean} Optional. True, if the supergroup chat is a forum (has topics enabled).
     */
    get is_forum(){return this.chat.hasOwnProperty("is_forum")? this.chat.is_forum : null;}
    /**
     * @returns {boolean} Optional. True, if the chat is the direct messages chat of a channel
     */
    get is_direct_messages(){return this.chat.hasOwnProperty("is_direct_messages")? this.chat.is_direct_messages : null;}
    
    /**
     * 
     * @param {{text: string, parse_mode: string, link_preview_options: LinkPreviewOptions|{is_disabled: boolean, url: string, prefer_small_media: boolean, prefer_large_media: boolean, show_above_text: boolean}, disable_notification: boolean, protect_content: boolean, message_effect_id: string, reply_parameters: ReplyParameters|Object, reply_markup: InlineKeyboardMarkup|Object}} config 
     * @returns {Promise<Message>}
     */
    async sendMessage(config){
        return await Context.bot.sendMessage({chat_id: this.id, ...config});
    }
    
    /**
     * Use this method to send photos. On success, the sent `Message` is returned.
     * 
     * Shortcut of `bot.sendPhoto()`.
     * 
     * @param {{message_thread_id: number, photo: InputFile|Blob|string, caption:string, parse_mode:string, caption_entities: Array<MessageEntity>, show_caption_above_media: boolean, has_spoiler:boolean, disable_notification:boolean, protect_content: boolean, message_effect_id: string, reply_parameters: ReplyParameters, reply_markup:InlineKeyboardMarkup}} config 
     * @returns {Promise<Message>}
     */
    async sendPhoto(config){
        return await Context.bot.sendPhoto({chat_id: this.id, ...config});
    }

    /**
     * Use this method to send video files, Telegram clients support MPEG4 videos (other formats may be sent as `Document`). On success, the sent `Message` is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.
     * 
     * Shortcut of `bot.sendVideo()`.
     * 
     * @param {{message_thread_id: number, video: InputFile|Blob|string, duration: number, width: number, height: number, thumbnail: InputFile|string, caption: string, parse_mode: string, caption_entities: Array<MessageEntity>, show_caption_above_media: boolean, has_spoiler: boolean, supports_streaming: boolean, disable_notification: boolean, protect_content: boolean, message_effect_id: string, reply_parameters: ReplyParameters, reply_markup: InlineKeyboardMarkup}} config 
     * @returns {Promise<Message>}
     */
    async sendVideo(config){
        return await Context.bot.sendVideo({chat_id: this.id, ...config});
    }

    /**
     * Use this method to send a group of photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type. On success, an array of `Messages` that were sent is returned.
     * 
     * Shortcut of `bot.sendMediaGroup()`.
     * 
     * @param {{message_thread_id: number, media: Array<InputMediaAudio>|Array<InputMediaDocument>|Array<InputMediaPhoto>|Array<InputMediaVideo>, disable_notification: boolean, protect_content: boolean, message_effect_id: string, reply_parameters: ReplyParameters}} config 
     * @returns {Promise<Message>}
     */
    async sendMediaGroup(config){
        return await Context.bot.sendMediaGroup({chat_id: this.id, ...config});
    }

    /**
     * Use this method to send general files. On success, the sent `Message` is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.
     * 
     * Shortcut of `bot.sendDocument()`.
     * 
     * @param {{document: InputFile|string, thumbnail: InputFile|string, caption:string, parse_mode: string, disable_content_type_detection:boolean, disable_notification: boolean, protect_content: boolean, message_effect_id: string, reply_parameters: ReplyParameters, reply_markup: InlineKeyboardMarkup}} config 
     * @returns {Promise<Message>}
     */
    async sendDocument(config){
        return await Context.bot.sendDocument({chat_id: this.id, ...config});
    }

    /**
     * Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns `True` on success.
     * 
     * Shortcut of `bot.sendChatAction()`.
     * 
     * @param {{message_thread_id: number, action: string}} config 
     * @returns {Promise<boolean>}
     */
    async sendChatAction(config){
        return await Context.bot.sendChatAction({chat_id: this.id, ...config});
    }

    /**
     * Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success.
     * 
     * If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever. Applied for supergroups and channels only.
     * 
     * Shortcut of `bot.banChatMember()`.
     * 
     * @param {{user_id: number, until_date: number, revoke_messages: boolean}} config 
     * @returns {Promise<boolean>}
     */
    async banChatMember(config){
        return await Context.bot.banChatMember({chat_id: this.id, ...config});
    }

    /**
     * Use this method to unban a previously banned user in a supergroup or channel. The user will not return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be removed from the chat. If you don't want this, use the parameter only_if_banned. Returns True on success.
     * 
     * Shortcut of `bot.unbanChatMember()`.
     * 
     * @param {{user_id: number, only_if_banned: boolean}} config 
     * @returns {Promise<boolean>}
     */
    async unbanChatMember(config){
        return await Context.bot.unbanChatMember({chat_id: this.id, ...config});
    }

    /**
     * Use this method to clear the list of pinned messages in a chat. In private chats and channel direct messages chats, no additional rights are required to unpin all pinned messages. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin all pinned messages in groups and channels respectively. Returns True on success.
     * 
     * Shortcut of `bot.unpinAllChatMessages()`.
     * 
     * @returns {Promise<boolean>}
     */
    async unpinAllChatMessages(){
        return await Context.bot.unpinAllChatMessages({chat_id: this.id});
    }

    /**
     * Use this method to get up-to-date information about the chat. Returns a `ChatFullInfo` object on success.
     * 
     * Shortcut of `bot.getChat()`.
     * 
     * @returns {Promise<ChatFullInfo>}
     */ 
    async getChat(){
        return await Context.bot.getChat({chat_id: this.id});
    }

    /**
     * Use this method to get a list of administrators in the chat, which aren't bots. Returns an Array of ChatMember objects.
     * 
     * Shortcut of `bot.getChat()`.
     * 
     * @returns {Promise<ChatMember>}
     */ 
    async getChatAdministrators(){
        return await Context.bot.getChatAdministrators({chat_id: this.id});
    }

    /**
     * Use this method to get the number of members in a chat. Returns Int on success.
     * 
     * Shortcut of `bot.getChatMemberCount()`.
     * 
     * @returns {Promise<number>}
     */ 
    async getChatMemberCount(){
        return await Context.bot.getChatMemberCount({chat_id: this.id});
    }

    /**
     * Use this method to generate a new primary invite link for a chat; any previously generated primary link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the new invite link as String on success.
     * 
     * Shortcut of `bot.exportChatInviteLink()`.
     * 
     * @returns {Promise<string>}
     */ 
    async exportChatInviteLink(){
        return await Context.bot.exportChatInviteLink({chat_id: this.id});
    }

    /**
     * Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. The link can be revoked using the method revokeChatInviteLink. Returns the new invite link as ChatInviteLink object.
     * 
     * Shortcut of `bot.createChatInviteLink()`.
     * 
     * @param {{name?: string, expire_date?: number, member_limit?: number, creates_join_request?: boolean}} config 
     * @returns {Promise<ChatInviteLink>}
     */ 
    async createChatInviteLink(config){
        return await Context.bot.createChatInviteLink({chat_id: this.id, ...config});
    }

    /**
     * Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the revoked invite link as ChatInviteLink object.
     * 
     * Shortcut of `bot.revokeChatInviteLink()`.
     * 
     * @param {{invite_link: string}} config 
     * @returns {Promise<ChatInviteLink>}
     */ 
    async revokeChatInviteLink(config){
        return await Context.bot.revokeChatInviteLink({chat_id: this.id, ...config});
    }

    /**
     * Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the edited invite link as a ChatInviteLink object.
     * 
     * Shortcut of `bot.editChatInviteLink()`.
     * 
     * @param {{invite_link: string, name?: string, expire_date?: number, member_limit?: number, creates_join_request?: boolean}} config 
     * @returns {Promise<ChatInviteLink>}
     */ 
    async editChatInviteLink(config){
        return await Context.bot.editChatInviteLink({chat_id: this.id, ...config});
    }

    /**
     * Use this method to approve a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success.
     * 
     * Shortcut of `bot.approveChatJoinRequest()`.
     * 
     * @param {{user_id: number}} config 
     * @returns {Promise<boolean>}
     */ 
    async approveChatJoinRequest(config){
        return await Context.bot.approveChatJoinRequest({chat_id: this.id, ...config});
    }

    /**
     * Use this method to decline a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success.
     * 
     * Shortcut of `bot.declineChatJoinRequest()`.
     * 
     * @param {{user_id: number}} config 
     * @returns {Promise<boolean>}
     */ 
    async declineChatJoinRequest(config){
        return await Context.bot.declineChatJoinRequest({chat_id: this.id, ...config});
    }

    /**
     * Use this method to set a tag for a regular member in a group or a supergroup. The bot must be an administrator in the chat for this to work and must have the can_manage_tags administrator right. Returns True on success.
     * 
     * Shortcut of `bot.setChatMemberTag()`.
     * 
     * @param {{user_id: number, tag: string}} config 
     * @returns {Promise<boolean>}
     */ 
    async setChatMemberTag(config){
        return await Context.bot.setChatMemberTag({chat_id: this.id, ...config});
    }
}

/**
 * This object represents a chat photo.
 */
class ChatPhoto {
    constructor(chat_photo){
        this.chat_photo = chat_photo;
    }
    
    /**
     * File identifier of small (160x160) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed.
     * @returns {string}
     */
    get small_file_id(){return this.chat_photo?.small_file_id;}
    /**
     * Unique file identifier of small (160x160) chat photo, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     * @returns {string}
     */
    get small_file_unique_id(){return this.chat_photo?.small_file_unique_id;}
    /**
     * File identifier of big (640x640) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed.
     * @returns {string}
     */
    get big_file_id(){return this.chat_photo?.big_file_id;}
    /**
     * Unique file identifier of big (640x640) chat photo, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     * @returns {string}
     */
    get big_file_unique_id(){return this.chat_photo?.big_file_unique_id;}
}

/**
 * This object represents a point on the map.
 */
class Location {
    constructor (location){
        this.location = location;
    }
    /**
     * Latitude as defined by the sender.
     * @returns {number}
     */
    get latitude(){return this.location?.latitude;}
    /**
     * Longitude as defined by the sender.
     * @returns {number}
     */
    get longitude(){return this.location?.longitude;}
    /**
     * Optional. The radius of uncertainty for the location, measured in meters; 0-1500.
     * @returns {number}
     */
    get horizontal_accuracy(){return this.location?.horizontal_accuracy;}
    /**
     * Optional. Time relative to the message sending date, during which the location can be updated; in seconds. For active live locations only.
     * @returns {number}
     */
    get live_period(){return this.location?.live_period;}
    /**
     * Optional. The direction in which user is moving, in degrees; 1-360. For active live locations only.
     * @returns {number}
     */
    get heading(){return this.location?.heading;}
    /**
     * Optional. The maximum distance for proximity alerts about approaching another chat member, in meters. For sent live locations only.
     * @returns {number}
     */
    get proximity_alert_radius(){return this.location?.proximity_alert_radius;}

}

/**
 * Describes the birthdate of a user.
 */
class Birthdate {
    constructor(birthdate){
        this.birthdate = birthdate;
    }
    /**
     * Day of the user's birth; 1-31.
     * @returns {number}
     */
    get day(){return this.birthdate?.day;}
    /**
     * Month of the user's birth; 1-12.
     * @returns {number}
     */
    get month(){return this.birthdate?.month;}
    /**
     * Optional. Year of the user's birth.
     * @returns {number}
     */
    get year(){return this.birthdate?.year;}
}

/**
 * Contains information about the start page settings of a Telegram Business account.
 */
class BusinessIntro {
    constructor (business_intro){
        this.business_intro = business_intro;
    }
    /**
     * Optional. Title text of the business intro.
     * @returns {string}
     */
    get title(){return this.business_intro?.title;}
    /**
     * Optional. Message text of the business intro.
     * @returns {string}
     */
    get message(){return this.business_intro?.message;}
    /**
     * Optional. Sticker of the business intro.
     * @returns {string}
     */
    get sticker(){return this.business_intro?.sticker;}

}

/**
 * Contains information about the location of a Telegram Business account.
 */
class BusinessLocation {
    constructor (business_location){
        this.business_location = business_location;
    }
    /**
     * Address of the business.
     * @returns {string}
     */
    get address(){return this.business_location?.address;}
    /**
     * Optional. Location of the business.
     * @returns {Location}
     */
    get location(){return new Location(this.business_location?.location);}
}

/**
 * Describes an interval of time during which a business is open.
 */
class BusinessOpeningHoursInterval {
    constructor (business_opening_hours_interval){
        this.business_opening_hours_interval = business_opening_hours_interval;
    }
    /**
     * The minute's sequence number in a week, starting on Monday, marking the start of the time interval during which the business is open; 0 - 7 * 24 * 60.
     * @returns {number}
     */
    get opening_minute(){return this.business_opening_hours_interval?.opening_minute;}
    /**
     * The minute's sequence number in a week, starting on Monday, marking the end of the time interval during which the business is open; 0 - 8 * 24 * 60.
     * @returns {number}
     */
    get closing_minute(){return this.business_opening_hours_interval?.closing_minute;}
}

/**
 * Describes the opening hours of a business.
 */
class BusinessOpeningHours {
    constructor (business_opening_hours) {
        this.business_opening_hours = business_opening_hours;
    }
    /**
     * Unique name of the time zone for which the opening hours are defined.
     * @returns {string}
     */
    get time_zone_name(){return this.business_opening_hours?.time_zone_name;}
    /**
     * List of time intervals describing business opening hours.
     * @returns {BusinessOpeningHoursInterval[]}
     */
    get opening_hours(){return this.business_opening_hours?.opening_hours.map(item => new BusinessOpeningHoursInterval(item));}
}

/**
 * This object describes the type of a reaction. Currently, it can be one of.
 */
class ReactionTypeEmoji {
    constructor (reaction_type_emoji){
        this.reaction_type_emoji = reaction_type_emoji;
    }
    /**
     * Type of the reaction, always “emoji”.
     * @returns {string}
     */
    get type(){return this.reaction_type_emoji?.type;}
    /**
     * Reaction emoji. Currently, it can be one of "👍", "👎", "❤", "🔥", "🥰", "👏", "😁", "🤔", "🤯", "😱", "🤬", "😢", "🎉", "🤩", "🤮", "💩", "🙏", "👌", "🕊", "🤡", "🥱", "🥴", "😍", "🐳", "❤‍🔥", "🌚", "🌭", "💯", "🤣", "⚡", "🍌", "🏆", "💔", "🤨", "😐", "🍓", "🍾", "💋", "🖕", "😈", "😴", "😭", "🤓", "👻", "👨‍💻", "👀", "🎃", "🙈", "😇", "😨", "🤝", "✍", "🤗", "🫡", "🎅", "🎄", "☃", "💅", "🤪", "🗿", "🆒", "💘", "🙉", "🦄", "😘", "💊", "🙊", "😎", "👾", "🤷‍♂", "🤷", "🤷‍♀", "😡".
     * @returns {string}
     */
    get emoji(){return this.reaction_type_emoji?.emoji;}
}

/**
 * The reaction is based on a custom emoji.
 */
class ReactionTypeCustomEmoji {
    constructor (reaction_type_custom_emoji){
        this.reaction_type_custom_emoji = reaction_type_custom_emoji;
    }
    /**
     * Type of the reaction, always “custom_emoji”.
     * @returns {string}
     */
    get type(){return this.reaction_type_custom_emoji?.type;}
    /**
     * Custom emoji identifier.
     * @returns {string}
     */
    get custom_emoji_id(){return this.reaction_type_custom_emoji?.custom_emoji_id;}
}

/**
 * The reaction is paid.
 */
class ReactionTypePaid {
    constructor (reaction_type_paid){
        this.reaction_type_paid = reaction_type_paid;
    }
    /**
     * Type of the reaction, always “paid”.
     * @returns {string}
     */
    get type(){return this.reaction_type_paid?.type;}
}

/**
 * This object describes the type of a reaction. Currently, it can be one of
- ReactionTypeEmoji
- ReactionTypeCustomEmoji
- ReactionTypePaid
 */
class ReactionType {
    constructor(reaction_type) {
        const typeToClassMap = {
            "emoji": ReactionTypeEmoji,
            "custom_emoji": ReactionTypeCustomEmoji,
            "paid": ReactionTypePaid,
        };

        const TargetClass = typeToClassMap[reaction_type.type];

        if (!TargetClass) {
            throw new Error("Reaction type not recognized.");
        }

        const instance = new TargetClass(reaction_type);

        return new Proxy(instance, {
            get(target, prop) {
                return prop in target ? target[prop] : undefined;
            },
            set(target, prop, value) {
                target[prop] = value;
                return true;
            }
        });
    }
}

/**
 * Describes actions that a non-administrator user is allowed to take in a chat.
 */
class ChatPermissions {
    /**
     * 
     * @param {{can_send_messages: boolean, can_send_audios: boolean, can_send_documents: boolean, can_send_photos: boolean, can_send_videos: boolean, can_send_video_notes: boolean, can_send_voice_notes: boolean, can_send_polls: boolean, can_send_other_messages: boolean, can_add_web_page_previews: boolean, can_change_info: boolean, can_invite_users: boolean, can_pin_messages: boolean, can_manage_topics: boolean}} chat_permissions 
     */
    constructor(chat_permissions){
        this.chat_permissions = chat_permissions;
    }
    /**
     * Optional. True, if the user is allowed to send text messages, contacts, giveaways, giveaway winners, invoices, locations and venues.
     * @returns {boolean}
     */
    get can_send_messages(){return this.chat_permissions?.can_send_messages;}
    /**
     * Optional. True, if the user is allowed to send audios.
     * @returns {boolean}
     */
    get can_send_audios(){return this.chat_permissions?.can_send_audios;}
    /**
     * Optional. True, if the user is allowed to send documents.
     * @returns {boolean}
     */
    get can_send_documents(){return this.chat_permissions?.can_send_documents;}
    /**
     * Optional. True, if the user is allowed to send photos.
     * @returns {boolean}
     */
    get can_send_photos(){return this.chat_permissions?.can_send_photos;}
    /**
     * Optional. True, if the user is allowed to send videos.
     * @returns {boolean}
     */
    get can_send_videos(){return this.chat_permissions?.can_send_videos;}
    /**
     * Optional. True, if the user is allowed to send video notes.
     * @returns {boolean}
     */
    get can_send_video_notes(){return this.chat_permissions?.can_send_video_notes;}
    /**
     * Optional. True, if the user is allowed to send voice notes.
     * @returns {boolean}
     */
    get can_send_voice_notes(){return this.chat_permissions?.can_send_voice_notes;}
    /**
     * Optional. True, if the user is allowed to send polls.
     * @returns {boolean}
     */
    get can_send_polls(){return this.chat_permissions?.can_send_polls;}
    /**
     * Optional. True, if the user is allowed to send animations, games, stickers and use inline bots.
     * @returns {boolean}
     */
    get can_send_other_messages(){return this.chat_permissions?.can_send_other_messages;}
    /**
     * Optional. True, if the user is allowed to add web page previews to their messages.
     * @returns {boolean}
     */
    get can_add_web_page_previews(){return this.chat_permissions?.can_add_web_page_previews;}
    /**
     * Optional. True, if the user is allowed to change the chat title, photo and other settings. Ignored in public supergroups.
     * @returns {boolean}
     */
    get can_change_info(){return this.chat_permissions?.can_change_info;}
    /**
     * Optional. True, if the user is allowed to invite new users to the chat.
     * @returns {boolean}
     */
    get can_invite_users(){return this.chat_permissions?.can_invite_users;}
    /**
     * Optional. True, if the user is allowed to pin messages. Ignored in public supergroups.
     * @returns {boolean}
     */
    get can_pin_messages(){return this.chat_permissions?.can_pin_messages;}
    /**
     * Optional. True, if the user is allowed to create forum topics. If omitted defaults to the value of can_pin_messages.
     * @returns {boolean}
     */
    get can_manage_topics(){return this.chat_permissions?.can_manage_topics;}
    toJSON(){
        return this.chat_permissions;
    }
}

/**
 * Represents a location to which a chat is connected.
 */
class ChatLocation {
    constructor (chat_location){
        this.chat_location = chat_location;
    }
    /**
     * The location to which the supergroup is connected. Can't be a live location.
     * @returns {Location}
     */
    get location(){return new Location(this.chat_location?.location);}
    /**
     * Location address; 1-64 characters, as defined by the chat owner.
     * @returns {string}
     */
    get address(){return this.chat_location?.address;}
}

/**
 * This object contains full information about a chat.
 */
class ChatFullInfo {
    constructor(chat_full_info){
        this.chat_full_info = chat_full_info;
    }
    /**
     * Unique identifier for this chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier.
     * @returns {number}
     */
    get id(){return this.chat_full_info?.id;}
    /**
     * Type of the chat, can be either “private”, “group”, “supergroup” or “channel”
     * @returns {string}
     */
    get type(){return this.chat_full_info?.type;}
    /**
     * Optional. Title, for supergroups, channels and group chats
     * @returns {string}
     */
    get title(){return this.chat_full_info?.title;}
    /**
     * Optional. Username, for private chats, supergroups and channels if available
     * @returns {string}
     */
    get username(){return this.chat_full_info?.username;}
    /**
     * Optional. First name of the other party in a private chat
     * @returns {string}
     */
    get first_name(){return this.chat_full_info?.first_name;}
    /**
     * Optional. Last name of the other party in a private chat
     * @returns {string}
     */
    get last_name(){return this.chat_full_info?.last_name;}
    /**
     * Optional. True, if the supergroup chat is a forum (has topics enabled)
     * @returns {boolean}
     */
    get is_forum(){return this.chat_full_info?.is_forum;}
    /**
     * Identifier of the accent color for the chat name and backgrounds of the chat photo, reply header, and link preview. See accent colors for more details.
     * @returns {number}
     */
    get accent_color_id(){return this.chat_full_info?.accent_color_id;}
    /**
     * The maximum number of reactions that can be set on a message in the chat
     * @returns {number}
     */
    get max_reaction_count(){return this.chat_full_info?.max_reaction_count;}
    /**
     * Optional. Chat photo
     * @returns {ChatPhoto}
     */
    get photo(){return new ChatPhoto(this.chat_full_info?.photo);}
    /**
     * Optional. If non-empty, the list of all active chat usernames; for private chats, supergroups and channels.
     * @returns {string[]}
     */
    get active_usernames(){return this.chat_full_info?.active_usernames;}
    /**
     * Optional. For private chats, the date of birth of the user
     * @returns {Birthdate}
     */
    get birthdate(){return new Birthdate(this.chat_full_info?.birthdate);}
    /**
     * Optional. For private chats with business accounts, the intro of the business
     * @returns {BusinessIntro}
     */
    get business_intro(){return new BusinessIntro(this.chat_full_info?.business_intro);}
    /**
     * Optional. For private chats with business accounts, the location of the business
     * @returns {BusinessLocation}
     */
    get business_location(){return new BusinessLocation(this.chat_full_info?.business_location);}
    /**
     * Optional. For private chats with business accounts, the opening hours of the business
     * @returns {BusinessOpeningHours}
     */
    get business_opening_hours(){return new BusinessOpeningHours(this.chat_full_info?.business_opening_hours);}
    /**
     * Optional. For private chats, the personal channel of the user
     * @returns {Chat}
     */
    get personal_chat(){return new Chat(this.chat_full_info?.personal_chat);}
    /**
     * Optional. List of available reactions allowed in the chat. If omitted, then all emoji reactions are allowed.
     * @returns {ReactionType[]}
     */
    get available_reactions(){return this.chat_full_info?.available_reactions.map(item => new ReactionType(item));}
    /**
     * Optional. Custom emoji identifier of the emoji chosen by the chat for the reply header and link preview background
     * @returns {string}
     */
    get background_custom_emoji_id(){return this.chat_full_info?.background_custom_emoji_id;}
    /**
     * Optional. Identifier of the accent color for the chat's profile background. See profile accent colors for more details.
     * @returns {number}
     */
    get profile_accent_color_id(){return this.chat_full_info?.profile_accent_color_id;}
    /**
     * Optional. Custom emoji identifier of the emoji chosen by the chat for its profile background
     * @returns {string}
     */
    get profile_background_custom_emoji_id(){return this.chat_full_info?.profile_background_custom_emoji_id;}
    /**
     * Optional. Custom emoji identifier of the emoji status of the chat or the other party in a private chat
     * @returns {string}
     */
    get emoji_status_custom_emoji_id(){return this.chat_full_info?.emoji_status_custom_emoji_id;}
    /**
     * Optional. Expiration date of the emoji status of the chat or the other party in a private chat, in Unix time, if any
     * @returns {number}
     */
    get emoji_status_expiration_date(){return this.chat_full_info?.emoji_status_expiration_date;}
    /**
     * Optional. Bio of the other party in a private chat
     * @returns {string}
     */
    get bio(){return this.chat_full_info?.bio;}
    /**
     * Optional. True, if privacy settings of the other party in the private chat allows to use `tg://user?id=<user_id>` links only in chats with the user
     * @returns {boolean}
     */
    get has_private_forwards(){return this.chat_full_info?.has_private_forwards;}
    /**
     * Optional. True, if the privacy settings of the other party restrict sending voice and video note messages in the private chat
     * @returns {boolean}
     */
    get has_restricted_voice_and_video_messages(){return this.chat_full_info?.has_restricted_voice_and_video_messages;}
    /**
     * Optional. True, if users need to join the supergroup before they can send messages
     * @returns {boolean}
     */
    get join_to_send_messages(){return this.chat_full_info?.join_to_send_messages;}
    /**
     * Optional. True, if all users directly joining the supergroup without using an invite link need to be approved by supergroup administrators
     * @returns {boolean}
     */
    get join_by_request(){return this.chat_full_info?.join_by_request;}
    /**
     * Optional. Description, for groups, supergroups and channel chats
     * @returns {string}
     */
    get description(){return this.chat_full_info?.description;}
    /**
     * Optional. Primary invite link, for groups, supergroups and channel chats
     * @returns {string}
     */
    get invite_link(){return this.chat_full_info?.invite_link;}
    /**
     * Optional. The most recent pinned message (by sending date)
     * @returns {Message}
     */
    get pinned_message(){return this.chat_full_info?.pinned_message;}
    /**
     * Optional. Default chat member permissions, for groups and supergroups
     * @returns {ChatPermissions}
     */
    get permissions(){return new ChatPermissions(this.chat_full_info?.permissions);}
    /**
     * Optional. True, if paid media messages can be sent or forwarded to the channel chat. The field is available only for channel chats.
     * @returns {boolean}
     */
    get can_send_paid_media(){return this.chat_full_info?.can_send_paid_media;}
    /**
     * Optional. For supergroups, the minimum allowed delay between consecutive messages sent by each unprivileged user; in seconds.
     * @returns {number}
     */
    get slow_mode_delay(){return this.chat_full_info?.slow_mode_delay;}
    /**
     * Optional. For supergroups, the minimum number of boosts that a non-administrator user needs to add in order to ignore slow mode and chat permissions.
     * @returns {number}
     */
    get unrestrict_boost_count(){return this.chat_full_info?.unrestrict_boost_count;}
    /**
     * Optional. The time after which all messages sent to the chat will be automatically deleted; in seconds.
     * @returns {number}
     */
    get message_auto_delete_time(){return this.chat_full_info?.message_auto_delete_time;}
    /**
     * Optional. True, if aggressive anti-spam checks are enabled in the supergroup. The field is only available to chat administrators.
     * @returns {boolean}
     */
    get has_aggressive_anti_spam_enabled(){return this.chat_full_info?.has_aggressive_anti_spam_enabled;}
    /**
     * Optional. True, if non-administrators can only get the list of bots and administrators in the chat.
     * @returns {boolean}
     */
    get has_hidden_members(){return this.chat_full_info?.has_hidden_members;}
    /**
     * Optional. True, if messages from the chat can't be forwarded to other chats.
     * @returns {boolean}
     */
    get has_protected_content(){return this.chat_full_info?.has_protected_content;}
    /**
     * Optional. True, if new chat members will have access to old messages; available only to chat administrators.
     * @returns {boolean}
     */
    get has_visible_history(){return this.chat_full_info?.has_visible_history;}
    /**
     * Optional. For supergroups, name of the group sticker set.
     * @returns {string}
     */
    get sticker_set_name(){return this.chat_full_info?.sticker_set_name;}
    /**
     * Optional. True, if the bot can change the group sticker set.
     * @returns {boolean}
     */
    get can_set_sticker_set(){return this.chat_full_info?.can_set_sticker_set;}
    /**
     * Optional. For supergroups, the name of the group's custom emoji sticker set. Custom emoji from this set can be used by all users and bots in the group.
     * @returns {string}
     */
    get custom_emoji_sticker_set_name(){return this.chat_full_info?.custom_emoji_sticker_set_name;}
    /**
     * Optional. Unique identifier for the linked chat, i.e. the discussion group identifier for a channel and vice versa; for supergroups and channel chats. This identifier may be greater than 32 bits and some programming languages may have difficulty/silent defects in interpreting it. But it is smaller than 52 bits, so a signed 64 bit integer or double-precision float type are safe for storing this identifier.
     * @returns {number}
     */
    get linked_chat_id(){return this.chat_full_info?.linked_chat_id;}
    /**
     * Optional. For supergroups, the location to which the supergroup is connected.
     * @returns {ChatLocation}
     */
    get location(){return new ChatLocation(this.chat_full_info?.location);}
    /**
     * Optional. For private chats, the rating of the user if any.
     * @returns {UserRating}
     */
    get rating(){return this.chat_full_info?.rating ? new UserRating(this.chat_full_info.rating) : null;}
    /**
     * Optional. For private chats, the first audio added to the profile of the user.
     * @returns {Audio}
     */
    get first_profile_audio(){return this.chat_full_info?.first_profile_audio ? new Audio(this.chat_full_info.first_profile_audio) : null;}
    /**
     * Optional. The color scheme based on a unique gift that must be used for the chat's name, message replies and link previews.
     * @returns {UniqueGiftColors}
     */
    get unique_gift_colors(){return this.chat_full_info?.unique_gift_colors ? new Audio(this.chat_full_info.unique_gift_colors) : null;}
    /**
     * Optional. The number of Telegram Stars a general user have to pay to send a message to the chat.
     * @returns {number}
     */
    get paid_message_star_count(){return this.chat_full_info?.paid_message_star_count ? new Audio(this.chat_full_info.paid_message_star_count) : null;}
}

/**
 * This object represents a general file (as opposed to photos, voice messages and audio files).
 */
class Document{
    constructor(document){
        this.document = document;
    }
    /**
     * Identifier for this file, which can be used to download or reuse the file.
     * @returns {string}
     */
    get file_id(){return this.document.file_id;}
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     * @returns {string}
     */
    get file_unique_id(){return this.document.file_unique_id;}
    /**
     * Optional. Document thumbnail as defined by the sender.
     * @returns {PhotoSize}
     */
    get thumbnail(){return new PhotoSize(this.document?.thumbnail);}
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     * @returns {number}
     */
    get file_size(){return this.document?.file_size;}
    /**
     * Optional. Original filename as defined by the sender.
     * @returns {string}
     */
    get file_name(){return this.document?.file_name;}
    /**
     * Optional. MIME type of the file as defined by the sender.
     * @returns {string}
     */
    get mime_type(){return this.document?.mime_type;}
}

/**
 * This object represents a video file.
 */
class Video {
    constructor(video){
        this.video = video;
    }

    /**
     * Identifier for this file, which can be used to download or reuse the file.
     * @returns {string}
     */
    get file_id(){return this.video.file_id;}
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     * @returns {string}
     */
    get file_unique_id(){return this.video.file_unique_id;}
    /**
     * Video width as defined by the sender.
     * @returns {number}
     */
    get width(){return this.video.width;}
    /**
     * Video height as defined by the sender.
     * @returns {number}
     */
    get height(){return this.video.height;}
    /**
     * Duration of the video in seconds as defined by the sender.
     * @returns {number}
     */
    get duration(){return this.video.duration;}
    /**
     * Optional. Video thumbnail.
     * @returns {PhotoSize}
     */
    get thumbnail(){return this.video.hasOwnProperty('thumbnail')? new PhotoSize(this.video.thumbnail) : null;}
    /**
     * Optional. Original filename as defined by the sender.
     * @returns {string}
     */
    get file_name(){return this.video.hasOwnProperty('file_name')? this.video.file_name : null;}
    /**
     * Optional. MIME type of the file as defined by the sender.
     * @returns {string}
     */
    get mime_type(){return this.video.hasOwnProperty('mime_type')? this.video.mime_type : null;}
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     * @returns {number}
     */
    get file_size(){return this.video.hasOwnProperty('file_size')? this.video.file_size : null;}
}

/**
 * This object represents a video file of a specific quality.
 */
class VideoQuality {
    constructor(video_quality) {
        this.video_quality = video_quality;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * Identifier for this file, which can be used to download or reuse the file.
     * @returns {string}
     */
    get file_id(){return this.video_quality?.file_id};

    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     * @returns {string}
     */
    get file_unique_id(){return this.video_quality?.file_unique_id};

    /**
     * Video width.
     * @returns {number}
     */
    get width(){return this.video_quality?.width};

    /**
     * Video height.
     * @returns {number}
     */
    get height(){return this.video_quality?.height};

    /**
     * Codec that was used to encode the video, for example, “h264”, “h265”, or “av01”.
     * @returns {string}
     */
    get codec(){return this.video_quality?.codec};

    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     * @returns {number}
     */
    get file_size(){return this.video_quality?.file_size};
}

/**
 * Describes the options used for link preview generation.
 */
class LinkPreviewOptions {
    /**
     * @constructor
     * @param {{is_disabled: boolean, url: string, prefer_small_media: boolean, prefer_large_media: boolean, show_above_text: boolean}} linkpreviewoptions 
     */
    constructor(linkpreviewoptions){
        this.linkpreviewoptions = linkpreviewoptions;
    }

    /**
     * @returns {boolean} `true`, if the link preview is disabled.
     */
    get is_disabled(){return this.linkpreviewoptions.hasOwnProperty("is_disabled")?this.linkpreviewoptions.is_disabled:null;}
    /**
     * @returns {string} URL to use for the link preview. If empty, then the first URL found in the message text will be used.
     */
    get url(){return this.linkpreviewoptions.hasOwnProperty("url")?this.linkpreviewoptions.url:null;}
    /**
     * @returns {boolean} `true`, if the media in the link preview is supposed to be shrunk; ignored if the URL isn't explicitly specified or media size change isn't supported for the preview.
     */
    get prefer_small_media(){return this.linkpreviewoptions.hasOwnProperty("prefer_small_media")?this.linkpreviewoptions.prefer_small_media:null;}
    /**
     * @returns {boolean} `true`, if the media in the link preview is supposed to be enlarged; ignored if the URL isn't explicitly specified or media size change isn't supported for the preview.
     */
    get prefer_large_media(){return this.linkpreviewoptions.hasOwnProperty("prefer_large_media")?this.linkpreviewoptions.prefer_large_media:null;}
    /**
     * @returns {boolean} `true`, if the link preview must be shown above the message text; otherwise, the link preview will be shown below the message text.
     */
    get show_above_text(){return this.linkpreviewoptions.hasOwnProperty("show_above_text")?this.linkpreviewoptions.show_above_text:null;}

    toJSON() {
        return filterObject({
            is_disabled: this.is_disabled,
            url: this.url,
            prefer_small_media: this.prefer_small_media,
            prefer_large_media: this.prefer_large_media,
            show_above_text: this.show_above_text
        });
    }
}

/**
 * Describes a Web App.
 */
class WebAppInfo {
    /**
     * 
     * @param {{url: string}} config 
     */
    constructor(config){
        this.config = config;
    }
    /**
     * An HTTPS URL of a Web App to be opened with additional data as specified in Initializing Web Apps.
     * @returns {string}
     */
    get url(){return this.config?.url;}
    toJSON(){return {url: this.url};}
}

/**
 * This object represents one button of an inline keyboard. Exactly one of the optional fields must be used to specify type of the button.
 */
class InlineKeyboardButton {
    /**
     * 
     * @param {{text: string, url: string, callback_data: string, web_app: WebAppInfo}} config 
     */
    constructor(config){
        this.config = config;
    }

    get text(){return this.config.text;}
    get url(){return this.config?.url;}
    get callback_data(){return this.config?.callback_data;}
    get web_app(){return this.config?.web_app;}
    toJSON(){
        return filterObject({
            text: this.text,
            url: this.url,
            callback_data: this.callback_data,
            web_app: this.web_app
        });
    }
}

/**
 * This object represents an inline keyboard that appears right next to the message it belongs to.
 */
class InlineKeyboardMarkup {
    /**
     * @constructor
     * @param {InlineKeyboardButton[][]} inline_keyboard 
     */
    constructor(inline_keyboard){
        this.inline_keyboard = inline_keyboard;
    }

    toJSON(){
        let markup = {inline_keyboard: []};

        for (let row = 0; row < this.inline_keyboard.length; row++){
            var buttonsRow = [];
            for (let col = 0; col < this.inline_keyboard[row].length; col++){
                var button = this.inline_keyboard[row][col];
                buttonsRow.push(button);
            }
            markup.inline_keyboard.push(buttonsRow);
        }

        return markup;
    }
}

/**
 * This object represents one size of a photo or a file / sticker thumbnail.
 */
class PhotoSize {
    constructor(photo_size){
        this.photo_size = photo_size;
    }

    get file_id(){return this.photo_size.file_id;}
    get file_unique_id(){return this.photo_size.file_unique_id;}
    get width(){return this.photo_size.width;}
    get height(){return this.photo_size.height;}
    get file_size(){return this.photo_size.hasOwnProperty('file_size')? this.photo_size.file_size : null;}
}

/**
 * This object represent a user's profile pictures.
 */
class UserProfilePhotos {
    constructor(user_profile_photos){
        this.user_profile_photos = user_profile_photos;
    }

    /**
     * Total number of profile pictures the target user has.
     * @returns {number}
     */
    get total_count(){return this.user_profile_photos?.total_count;}
    /**
     * Requested profile pictures (in up to 4 sizes each).
     * @returns {PhotoSize[]} 
     */
    get photos(){return this.user_profile_photos?.photos.map(photo => new PhotoSize(photo));}
}

/**
 * This object represents one special entity in a text message. For example, hashtags, usernames, URLs, etc.
 */
class MessageEntity {
    constructor(message_entity){
        this.message_entity = message_entity;
    }

    get type(){return this.message_entity.type;}
    get offset(){return this.message_entity.offset;}
    get length(){return this.message_entity.length;}
    get url(){return this.message_entity.hasOwnProperty('url') ? this.message_entity.url : null;}
    get user(){return this.message_entity.hasOwnProperty('user') ? new User(this.message_entity.user) : null;}
    get language(){return this.message_entity.hasOwnProperty('language') ? this.message_entity.language : null;}
    get custom_emoji_id(){return this.message_entity.hasOwnProperty('custom_emoji_id') ? this.message_entity.custom_emoji_id : null;}
}

/**
 * This object describes the origin of a message. It can be one of:
    - `MessageOriginUser`
    - `MessageOriginHiddenUser`
    - `MessageOriginChat`
    - `MessageOriginChannel`
 */
class MessageOrigin {
    constructor(message_origin) {
        const typeToClassMap = {
            "user": MessageOriginUser,
            "hidden_user": MessageOriginHiddenUser,
            "chat": MessageOriginChat,
            "channel": MessageOriginChannel
        };

        const TargetClass = typeToClassMap[message_origin.type];

        if (!TargetClass) {
            throw new Error("Message origin not recognized.");
        }

        const instance = new TargetClass(message_origin);

        return new Proxy(instance, {
            get(target, prop) {
                return prop in target ? target[prop] : undefined;
            },
            set(target, prop, value) {
                target[prop] = value;
                return true;
            }
        });
    }
}

/**
 * The message was originally sent by a known user.
 */
class MessageOriginUser{
    constructor(message_origin){
        this.message_origin = message_origin;
    }
    /**
     * @returns {string} Type of the message origin, always “user”.
     */
    get type(){return this.message_origin.type;}
    /**
     * @returns {number} Date the message was sent originally in Unix time.
     */
    get date(){return this.message_origin.date;}
    /**
     * @returns {User} User that sent the message originally.
     */
    get sender_user(){return new User(this.message_origin.sender_user);}

}

/**
 * The message was originally sent by an unknown user.
 */
class MessageOriginHiddenUser{
    constructor(message_origin){
        this.message_origin = message_origin;
    }

    /**
     * @returns {string} Type of the message origin.
     */
    get type(){return this.message_origin.type;}
    /**
     * @returns {number} Date the message was sent originally in Unix time.
     */
    get date(){return this.message_origin.date;}
    /**
     * @returns {string} User that sent the message originally.
     */
    get sender_user_name(){return this.message_origin.sender_user_name;}
}

/**
 * The message was originally sent to a channel chat.
 */
class MessageOriginChat{
    constructor(message_origin){
        this.message_origin = message_origin;
    }
    /**
     * @returns {string} Type of the message origin.
     */
    get type(){return this.message_origin.type;}
    /**
     * @returns {number} Date the message was sent originally in Unix time.
     */
    get date(){return this.message_origin.date;}
    /**
     * @returns {Chat} Channel chat to which the message was originally sent.
     */
    get sender_chat(){return new Chat(this.message_origin.sender_chat);}
    /**
     * @returns {string} For messages originally sent by an anonymous chat administrator, original message author signature.
     */
    get author_signature(){return this.message_origin.hasOwnProperty("author_signature")?this.message_origin.author_signature:null;}
}

class MessageOriginChannel{
    constructor(message_origin){
        this.message_origin = message_origin;
    }
    /**
     * @returns {string} Type of the message origin.
     */
    get type(){return this.message_origin.type;}
    /**
     * @returns {number} Date the message was sent originally in Unix time.
     */
    get date(){return this.message_origin.date;}
    /**
     * @returns {Chat} Channel chat to which the message was originally sent.
     */
    get chat(){return new Chat(this.message_origin.chat);}
    /**
     * @returns {number} Unique message identifier inside the chat.
     */
    get message_id(){return this.message_origin.message_id;}
    /**
     * @returns {string} Signature of the original post author.
     */
    get author_signature(){return this.message_origin.hasOwnProperty("author_signature")?this.message_origin.author_signature:null;}
}

class CallbackQuery {
    constructor(query){
        this.query = query;
    }

    /**
     * @returns {string} Unique identifier for this query.
     */
    get id(){return this.query.id;}
    /**
     * @returns {User} Sender.
     */
    get from(){return new User(this.query.from);}
    /**
     * @returns {InaccessibleMessage|Message} Message sent by the bot with the callback button that originated the query.
     */
    get message(){return this.query.hasOwnProperty('message') ? new MaybeInaccessibleMessage(this.query.message) : null;}
    /**
     * @returns {string} Identifier of the message sent via the bot in inline mode, that originated the query.
     */
    get inline_message_id(){return this.query.hasOwnProperty('inline_message_id') ? this.query.inline_message_id : null;}
    /**
     * @returns {string} Global identifier, uniquely corresponding to the chat to which the message with the callback button was sent. Useful for high scores in games.
     */
    get chat_instance(){return this.query.chat_instance;}
    /**
     * @returns {string} Data associated with the callback button. Be aware that the message originated the query can contain no callback buttons with this data.
     */
    get data(){return this.query.hasOwnProperty('data') ? this.query.data : null;}
    /**
     * @returns {string} Short name of a Game to be returned, serves as the unique identifier for the game.
     */
    get game_short_name(){return this.query.hasOwnProperty('game_short_name') ? this.query.game_short_name : null;}

    /**
     * Use this method to send answers to callback queries sent from inline keyboards. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, True is returned.
     * 
     * Shortcut for `bot.answerCallbackQuery`.
     * 
     * @param {{text: string, show_alert: boolean, url: string, cache_time: number}} config 
     * @returns {Promise<boolean>}
     */
    async answer(config = {}){
        return await Context.bot.answerCallbackQuery({callback_query_id: this.id, ...config});
    }
}

class MaybeInaccessibleMessage {
    constructor(maybe_inaccessible_message) {

        const TargetClass = maybe_inaccessible_message.date === 0 ? InaccessibleMessage : Message;

        if (!TargetClass) {
            throw new Error("Message date not recognized.");
        }

        const instance = new TargetClass(maybe_inaccessible_message);

        return new Proxy(instance, {
            get(target, prop) {
                return prop in target ? target[prop] : undefined;
            },
            set(target, prop, value) {
                target[prop] = value;
                return true;
            }
        });
    }
}

class InaccessibleMessage{
    constructor(inaccessible_message){
        this.inaccessible_message = inaccessible_message;
    }

    /**
     * @returns {Chat} Chat the message belonged to.
     */
    get chat(){return new Chat(this.inaccessible_message.chat);}
    /**
     * @returns {number} Unique message identifier inside the chat.
     */
    get message_id(){return this.inaccessible_message.message_id;}
    /**
     * @returns {number} Always 0.
     */
    get date(){return this.inaccessible_message.date;}
}

class WebhookInfo {
    constructor(webhookinfo){
        this.webhookinfo = webhookinfo;
    }
    
    get url() {return this.webhookinfo.url;}
    get has_custom_certificate() {return this.webhookinfo.has_custom_certificate;}
    get pending_update_count() {return this.webhookinfo.pending_update_count;}
    get ip_address() {return this.webhookinfo.hasOwnProperty("ip_address")? this.webhookinfo.ip_address : null;}
    get last_error_date() {return this.webhookinfo.hasOwnProperty("last_error_date")? this.webhookinfo.last_error_date : null;}
    get last_error_message() {return this.webhookinfo.hasOwnProperty("last_error_message")? this.webhookinfo.last_error_message : null;}
    get last_synchronization_error_date() {return this.webhookinfo.hasOwnProperty("last_synchronization_error_date")? this.webhookinfo.last_synchronization_error_date : null;}
    get max_connections() {return this.webhookinfo.hasOwnProperty("max_connections")? this.webhookinfo.max_connections : null;}
    get allowed_updates() {return this.webhookinfo.hasOwnProperty("allowed_updates")? this.webhookinfo.allowed_updates : null;}

    toJSON(){
        return this.webhookinfo;
    }
}

/**
 * This object represents a file ready to be downloaded. The file can be downloaded via the link `https://api.telegram.org/file/bot<token>/<file_path>`. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling `getFile`.
 */
class _File{
    constructor(file){
        this.file = file;
    }

    /**
     * Identifier for this file, which can be used to download or reuse the file
     */
    get file_id(){return this.file.file_id;}
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     */
    get file_unique_id(){return this.file.file_unique_id;}
    /**
     * File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     */
    get file_size(){return this.file.hasOwnProperty("file_size")? this.file.file_size : null;}
    /**
     * File path. Use `https://api.telegram.org/file/bot<token>/<file_path>` to get the file.
     * If using a local bot, calling `getFile` will lead to the file being saved locally.
     */
    get file_path(){return this.file.hasOwnProperty("file_path")? this.file.file_path : null;}

    /**
     * Download the file.
     * @returns {Promise<ArrayBuffer>}
     */
    async download(){
        const response = await fetch(`https://api.telegram.org/file/bot${Context.bot.token}/${this.file_path}`)
        .then(resp => resp.arrayBuffer()); // return as a blob
        return response;
    }
}

/**
 * Describes reply parameters for the message that is being sent.
 */
class ReplyParameters {
    /**
     * @constructor
     * @param {Object} reply_parameters 
     */
    constructor(reply_parameters){
        this.reply_parameters = reply_parameters;
    }

    /**
     * @returns {number} Identifier of the message that will be replied to in the current chat, or in the chat chat_id if it is specified
     */
    get message_id(){return this.reply_parameters.message_id;}
    /**
     * @returns {number|String} If the message to be replied to is from a different chat, unique identifier for the chat or username of the channel (in the format @channelusername). Not supported for messages sent on behalf of a business account.
     */
    get chat_id(){return this.reply_parameters.hasOwnProperty("chat_id")?this.reply_parameters.chat_id:null;}
    /**
     * @returns {Boolean} Pass True if the message should be sent even if the specified message to be replied to is not found. Always False for replies in another chat or forum topic. Always True for messages sent on behalf of a business account.
     */
    get allow_sending_without_reply(){return this.reply_parameters.hasOwnProperty("allow_sending_without_reply")?this.reply_parameters.allow_sending_without_reply:null;}
    /**
     * @returns {String} Quoted part of the message to be replied to; 0-1024 characters after entities parsing. The quote must be an exact substring of the message to be replied to, including bold, italic, underline, strikethrough, spoiler, and custom_emoji entities. The message will fail to send if the quote isn't found in the original message.
     */
    get quote(){return this.reply_parameters.hasOwnProperty("quote")?this.reply_parameters.quote:null;}
    /**
     * @returns {String} Mode for parsing entities in the quote. See formatting options for more details.
     */
    get quote_parse_mode(){return this.reply_parameters.hasOwnProperty("quote_parse_mode")?this.reply_parameters.quote_parse_mode:null;}
    /**
     * @returns {Array<MessageEntity>} A JSON-serialized list of special entities that appear in the quote. It can be specified instead of quote_parse_mode.
     */
    get quote_entities(){return this.reply_parameters.hasOwnProperty("quote_entities")?this.reply_parameters.quote_entities.map(entity => new MessageEntity(entity)):null;}
    /**
     * @returns {number} Position of the quote in the original message in UTF-16 code units.
     */
    get quote_position(){return this.reply_parameters.hasOwnProperty("quote_position")?this.reply_parameters.quote_position:null;}
}

/**
 * This object represents the contents of a file to be uploaded. Must be posted using `multipart/form-data` in the usual way that files are uploaded via the browser.
 */
class InputFile {
    /**
     * @param {object} config
     */
    constructor(config){
        this.input_file = config;
    }

    toJSON(){
        return this.input_file;
    }
}

/**
 * Represents an animation file (GIF or H.264/MPEG-4 AVC video without sound) to be sent.
 */
class InputMediaAnimation {
    /**
     * 
     * @param {{type: "animation", media: string, thumbnail: InputFile|string, caption: string, parse_mode: string, caption_entities: Array<MessageEntity>, show_caption_above_media: boolean, width: number, height: number, duration: number, has_spoiler: boolean}} input_media 
     */
    constructor(input_media) {
        this.input_media = input_media;
    }
    /**
     * Type of the result, must be `animation`.
     * @returns {string}
     */
    get type(){return this.input_media.type;}
    /**
     * File to send. Pass a `file_id` to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass `"attach://<file_attach_name>""` to upload a new one using `multipart/form-data` under `<file_attach_name>` name.
     * @returns {string}
     */
    get media(){return this.input_media.media;}
    /**
     * Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using `multipart/form-data`. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass `"attach://<file_attach_name>"` if the thumbnail was uploaded using `multipart/form-data` under `<file_attach_name>`.
     * @returns {InputFile|string}
     */
    get thumbnail(){return this.input_media.hasOwnProperty("thumbnail")?this.input_media.thumbnail:null;}
    /**
     * Caption of the animation to be sent, 0-1024 characters after entities parsing.
     * @returns {string}
     */
    get caption(){return this.input_media.hasOwnProperty("caption")?this.input_media.caption:null;}
    /**
     * Mode for parsing entities in the animation caption.
     * @returns {string}
     */
    get parse_mode(){return this.input_media.hasOwnProperty("parse_mode")?this.input_media.parse_mode:null;}
    /**
     * List of special entities that appear in the caption, which can be specified instead of parse_mode.
     * @returns {Array<MessageEntity>}
     */
    get caption_entities(){return this.input_media.hasOwnProperty("caption_entities")?this.input_media.caption_entities.map(entity => new MessageEntity(entity)):null;}
    /**
     * Pass `True`, if the caption must be shown above the message media.
     * @returns {boolean}
     */
    get show_caption_above_media(){return this.input_media.hasOwnProperty("show_caption_above_media")?this.input_media.show_caption_above_media:null;}
    /**
     * Animation width.
     * @returns {number}
     */
    get width(){return this.input_media.hasOwnProperty("width")?this.input_media.width:null;}
    /**
     * Animation height.
     * @returns {number}
     */
    get height(){return this.input_media.hasOwnProperty("height")?this.input_media.height:null;}
    /**
     * Animation duration in seconds.
     * @returns {number}
     */
    get duration(){return this.input_media.hasOwnProperty("duration")?this.input_media.duration:null;}
    /**
     * Pass `True` if the animation needs to be covered with a spoiler animation.
     * @returns {boolean}
     */
    get has_spoiler(){return this.input_media.hasOwnProperty("has_spoiler")?this.input_media.has_spoiler:null;}
    
    
    toJSON(){
        let obj = {};
        for (const [key, val] of Object.entries(this.input_media)){
            obj[key] = val;
        }
        return JSON.stringify(obj);
    }
}

/**
 * Represents a general file to be sent.
 */
class InputMediaDocument {
    /**
     * 
     * @param {{type: "document", media: string, thumbnail: InputFile|string, caption: string, parse_mode: string, caption_entities: Array<MessageEntity>, disable_content_type_detection: boolean}} input_media 
     */
    constructor(input_media) {
        this.input_media = input_media;
    }
    /**
     * Type of the result, must be `document`.
     * @returns {string}
     */
    get type(){return this.input_media.type;}
    /**
     * File to send. Pass a `file_id` to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass `"attach://<file_attach_name>""` to upload a new one using `multipart/form-data` under `<file_attach_name>` name.
     * @returns {string}
     */
    get media(){return this.input_media.media;}
    /**
     * Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using `multipart/form-data`. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass `"attach://<file_attach_name>"` if the thumbnail was uploaded using `multipart/form-data` under `<file_attach_name>`.
     * @returns {InputFile|string}
     */
    get thumbnail(){return this.input_media.hasOwnProperty("thumbnail")?this.input_media.thumbnail:null;}
    /**
     * Caption of the animation to be sent, 0-1024 characters after entities parsing.
     * @returns {string}
     */
    get caption(){return this.input_media.hasOwnProperty("caption")?this.input_media.caption:null;}
    /**
     * Mode for parsing entities in the animation caption.
     * @returns {string}
     */
    get parse_mode(){return this.input_media.hasOwnProperty("parse_mode")?this.input_media.parse_mode:null;}
    /**
     * List of special entities that appear in the caption, which can be specified instead of parse_mode.
     * @returns {Array<MessageEntity>}
     */
    get caption_entities(){return this.input_media.hasOwnProperty("caption_entities")?this.input_media.caption_entities.map(entity => new MessageEntity(entity)):null;}
    /**
     * Disables automatic server-side content type detection for files uploaded using `multipart/form-data`. Always `True`, if the document is sent as part of an album.
     * @returns {boolean}
     */
    get disable_content_type_detection(){return this.input_media.hasOwnProperty("disable_content_type_detection")?this.input_media.disable_content_type_detection:null;}
    
    
    toJSON(){
        let obj = {};
        for (const [key, val] of Object.entries(this.input_media)){
            obj[key] = val;
        }
        return JSON.stringify(obj);
    }
}

/**
 * Represents an audio file to be treated as music to be sent.
 */
class InputMediaAudio {
    /**
     * 
     * @param {{type: "audio", media: string, thumbnail: InputFile|string, caption: string, parse_mode: string, caption_entities: Array<MessageEntity>, duration: number, performer: string, title: string}} input_media 
     */
    constructor(input_media) {
        this.input_media = input_media;
    }
    /**
     * Type of the result, must be `audio`.
     * @returns {string}
     */
    get type(){return this.input_media.type;}
    /**
     * File to send. Pass a `file_id` to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass `"attach://<file_attach_name>""` to upload a new one using `multipart/form-data` under `<file_attach_name>` name.
     * @returns {string}
     */
    get media(){return this.input_media.media;}
    /**
     * Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using `multipart/form-data`. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass `"attach://<file_attach_name>"` if the thumbnail was uploaded using `multipart/form-data` under `<file_attach_name>`.
     * @returns {InputFile|string}
     */
    get thumbnail(){return this.input_media.hasOwnProperty("thumbnail")?this.input_media.thumbnail:null;}
    /**
     * Caption of the animation to be sent, 0-1024 characters after entities parsing.
     * @returns {string}
     */
    get caption(){return this.input_media.hasOwnProperty("caption")?this.input_media.caption:null;}
    /**
     * Mode for parsing entities in the animation caption.
     * @returns {string}
     */
    get parse_mode(){return this.input_media.hasOwnProperty("parse_mode")?this.input_media.parse_mode:null;}
    /**
     * List of special entities that appear in the caption, which can be specified instead of parse_mode.
     * @returns {Array<MessageEntity>}
     */
    get caption_entities(){return this.input_media.hasOwnProperty("caption_entities")?this.input_media.caption_entities.map(entity => new MessageEntity(entity)):null;}
    /**
     * Duration of the audio in seconds.
     * @returns {number}
     */
    get duration(){return this.input_media.hasOwnProperty("duration")?this.input_media.duration:null;}
    /**
     * Performer of the audio.
     * @returns {string}
     */
    get performer(){return this.input_media.hasOwnProperty("perfomer")?this.input_media.perfomer:null;}
    /**
     * Title of the audio.
     * @returns {string}
     */
    get title(){return this.input_media.hasOwnProperty("title")?this.input_media.title:null;}

    toJSON(){
        let obj = {};
        for (const [key, val] of Object.entries(this.input_media)){
            obj[key] = val;
        }
        return JSON.stringify(obj);
    }
}

/**
 * Represents a photo to be sent.
 */
class InputMediaPhoto {
    /**
     * 
     * @param {{type: "photo", media: string, caption: string, parse_mode: string, caption_entities: Array<MessageEntity>, show_caption_above_media: boolean, has_spoiler: boolean}} input_media 
     */
    constructor(input_media) {
        this.input_media = input_media;
        this.path = null;
    }
    /**
     * Type of the result, must be `photo`.
     * @returns {string}
     */
    get type(){return this.input_media.type;}
    /**
     * File to send. Pass a `file_id` to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass `"attach://<file_attach_name>""` to upload a new one using `multipart/form-data` under `<file_attach_name>` name.
     * @returns {string}
     */
    get media(){return this.input_media.media;}
    /**
     * Caption of the animation to be sent, 0-1024 characters after entities parsing.
     * @returns {string}
     */
    get caption(){return this.input_media.hasOwnProperty("caption")?this.input_media.caption:null;}
    /**
     * Mode for parsing entities in the animation caption.
     * @returns {string}
     */
    get parse_mode(){return this.input_media.hasOwnProperty("parse_mode")?this.input_media.parse_mode:null;}
    /**
     * List of special entities that appear in the caption, which can be specified instead of parse_mode.
     * @returns {Array<MessageEntity>}
     */
    get caption_entities(){return this.input_media.hasOwnProperty("caption_entities")?this.input_media.caption_entities.map(entity => new MessageEntity(entity)):null;}
    /**
     * Pass `True`, if the caption must be shown above the message media.
     * @returns {boolean}
     */
    get show_caption_above_media(){return this.input_media.hasOwnProperty("show_caption_above_media")?this.input_media.show_caption_above_media:null;}
    /**
     * Pass `True`, if the photo needs to be covered with a spoiler animation.
     * @returns {boolean}
     */
    get has_spoiler(){return this.input_media.hasOwnProperty("has_spoiler")?this.input_media.has_spoiler:null;}

    setPath(path){
        this.path = path;
        return this;
    }

    toJSON(){
        return this.input_media;
    }
}

/**
 * Represents a video to be sent.
 */
class InputMediaVideo {
    /**
     * 
     * @param {{type: "video", media: string, thumbnail: InputFile|string, caption: string, parse_mode: string, caption_entities: Array<MessageEntity>, show_caption_above_media: boolean, width: number, height: number, duration: number, supports_streaming: boolean, has_spoiler: boolean}} input_media 
     */
    constructor(input_media) {
        this.input_media = input_media;
        this.path = null;
    }
    /**
     * Type of the result, must be `video`.
     * @returns {string}
     */
    get type(){return this.input_media.type;}
    /**
     * File to send. Pass a `file_id` to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass `"attach://<file_attach_name>""` to upload a new one using `multipart/form-data` under `<file_attach_name>` name.
     * @returns {string}
     */
    get media(){return this.input_media.media;}
    /**
     * Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using `multipart/form-data`. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass `"attach://<file_attach_name>"` if the thumbnail was uploaded using `multipart/form-data` under `<file_attach_name>`.
     * @returns {InputFile|string}
     */
    get thumbnail(){return this.input_media.hasOwnProperty("thumbnail")?this.input_media.thumbnail:null;}
    /**
     * Caption of the animation to be sent, 0-1024 characters after entities parsing.
     * @returns {string}
     */
    get caption(){return this.input_media.hasOwnProperty("caption")?this.input_media.caption:null;}
    /**
     * Mode for parsing entities in the animation caption.
     * @returns {string}
     */
    get parse_mode(){return this.input_media.hasOwnProperty("parse_mode")?this.input_media.parse_mode:null;}
    /**
     * List of special entities that appear in the caption, which can be specified instead of parse_mode.
     * @returns {Array<MessageEntity>}
     */
    get caption_entities(){return this.input_media.hasOwnProperty("caption_entities")?this.input_media.caption_entities.map(entity => new MessageEntity(entity)):null;}
    /**
     * Pass `True`, if the caption must be shown above the message media.
     * @returns {boolean}
     */
    get show_caption_above_media(){return this.input_media.hasOwnProperty("show_caption_above_media")?this.input_media.show_caption_above_media:null;}
    /**
     * Video width.
     * @returns {number}
     */
    get width(){return this.input_media.hasOwnProperty("width")?this.input_media.width:null;}
    /**
     * Video height.
     * @returns {number}
     */
    get height(){return this.input_media.hasOwnProperty("height")?this.input_media.height:null;}
    /**
     * Video duration in seconds.
     * @returns {number}
     */
    get duration(){return this.input_media.hasOwnProperty("duration")?this.input_media.duration:null;}
    /**
     * Pass True if the uploaded video is suitable for streaming.
     * @returns {boolean}
     */
    get supports_streaming(){return this.input_media.hasOwnProperty("supports_streaming")?this.input_media.supports_streaming:null;}
    /**
     * Pass `True`, if the photo needs to be covered with a spoiler animation.
     * @returns {boolean}
     */
    get has_spoiler(){return this.input_media.hasOwnProperty("has_spoiler")?this.input_media.has_spoiler:null;}

    setPath(path){
        this.path = path;
        return this;
    }

    toJSON(){
        return this.input_media;
    }
}

/**
 * This object contains information about one member of a chat. Currently, the following 6 types of chat members are supported:

- ChatMemberOwner
- ChatMemberAdministrator
- ChatMemberMember
- ChatMemberRestricted
- ChatMemberLeft
- ChatMemberBanned

 */
class ChatMember {
    /** Owner of the group or channel. */
    static OWNER = "owner";
    /** Administrator of the group or channel. */
    static ADMINISTRATOR = "administrator";
    /** A basic member of the group or channel. */
    static MEMBER = "member";
    /** A restricted user in a group or channel. */
    static RESTRICTED = "restricted";
    /** A user who has left the group or channel. */
    static LEFT = "left";
    /** A user who has been kicked out or banned from the group or channel. */
    static BANNED = "kicked";

    constructor(data) {
        const statusToClassMap = {
            "creator": ChatMemberOwner,
            "administrator": ChatMemberAdministrator,
            "member": ChatMemberMember,
            "restricted": ChatMemberRestricted,
            "left": ChatMemberLeft,
            "kicked": ChatMemberBanned,
        };

        const TargetClass = statusToClassMap[data.status] || ChatMember;

        if (!TargetClass) {
            throw new Error("Chat member status not recognized.");
        }

        const instance = new TargetClass(data);

        Object.setPrototypeOf(this, TargetClass.prototype);

        Object.assign(this, instance);

        return this;
    }
}

/**
 * Represents a chat member that owns the chat and has all administrator privileges.
 */
class ChatMemberOwner {
    constructor (chat_member_owner) {
        this.chat_member_owner = chat_member_owner;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * The member's status in the chat, always “creator”.
     * @returns {string}
     */
    get status(){return "creator"};

    /**
     * Information about the user.
     * @returns {User}
     */
    get user(){return this.chat_member_owner.hasOwnProperty("user")? new User(this.chat_member_owner.user) : null};

    /**
     * True, if the user's presence in the chat is hidden.
     * @returns {boolean}
     */
    get is_anonymous(){return this.chat_member_owner.hasOwnProperty("is_anonymous") ? this.chat_member_owner.is_anonymous : null;}
    /**
     * Optional. Custom title for this user.
     * @returns {string}
     */
    get custom_title(){return this.chat_member_owner.hasOwnProperty("custom_title") ? this.chat_member_owner.custom_title : null;}

}

/**
 * Represents a chat member that has some additional privileges.
 */
class ChatMemberAdministrator {
    constructor (chat_administrator){
        this.chat_administrator = chat_administrator;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * The member's status in the chat, always "administrator".
     * @returns {string}
     */
    get status(){return "administrator"};

    /**
     * Information about the user.
     * @returns {User}
     */
    get user(){return this.chat_administrator.hasOwnProperty("user")? new User(this.chat_administrator.user) : null};

    /**
     * True, if the bot is allowed to edit administrator privileges of that user.
     * @returns {boolean}
     */
    get can_be_edited(){return this.chat_administrator.hasOwnProperty("can_be_edited")?this.chat_administrator.can_be_edited:null;}
    /**
     * True, if the user's presence in the chat is hidden.
     * @returns {boolean}
     */
    get is_anonymous(){return this.chat_administrator.hasOwnProperty("is_anonymous")?this.chat_administrator.is_anonymous:null;}
    /**
     * True, if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages and ignore slow mode. Implied by any other administrator privilege.
     * @returns {boolean}
     */
    get can_manage_chat(){return this.chat_administrator.hasOwnProperty("can_manage_chat")?this.chat_administrator.can_manage_chat:null;}
    /**
     * True, if the administrator can delete messages of other users.
     * @returns {boolean}
     */
    get can_delete_messages(){return this.chat_administrator.hasOwnProperty("can_delete_messages")?this.chat_administrator.can_delete_messages:null;}
    /**
     * True, if the administrator can manage video chats.
     * @returns {boolean}
     */
    get can_manage_video_chats(){return this.chat_administrator.hasOwnProperty("can_manage_video_chats")?this.chat_administrator.can_manage_video_chats:null;}
    /**
     * True, if the administrator can restrict, ban or unban chat members, or access supergroup statistics.
     * @returns {boolean}
     */
    get can_restrict_members(){return this.chat_administrator.hasOwnProperty("can_restrict_members")?this.chat_administrator.can_restrict_members:null;}
    /**
     * True, if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by the user).
     * @returns {boolean}
     */
    get can_promote_members(){return this.chat_administrator.hasOwnProperty("can_promote_members")?this.chat_administrator.can_promote_members:null;}
    /**
     * True, if the user is allowed to change the chat title, photo and other settings.
     * @returns {boolean}
     */
     get can_change_info(){return this.chat_administrator.hasOwnProperty("can_change_info")?this.chat_administrator.can_change_info:null;}
    /**
     * True, if the user is allowed to invite new users to the chat.
     * @returns {boolean}
     */
    get can_invite_users(){return this.chat_administrator.hasOwnProperty("can_invite_users")?this.chat_administrator.can_invite_users:null;}
    /**
     * True, if the administrator can post stories to the chat.
     * @returns {boolean}
     */
    get can_post_stories(){return this.chat_administrator.hasOwnProperty("can_post_stories")?this.chat_administrator.can_post_stories:null;}
    /**
     * True, if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat's story archive.
     * @returns {boolean}
     */
    get can_edit_stories(){return this.chat_administrator.hasOwnProperty("can_edit_stories")?this.chat_administrator.can_edit_stories:null;}
    /**
     * True, if the administrator can delete stories posted by other users.
     * @returns {boolean}
     */
    get can_delete_stories(){return this.chat_administrator.hasOwnProperty("can_delete_stories")?this.chat_administrator.can_delete_stories:null;}
    /**
     * Optional. True, if the administrator can post messages in the channel, or access channel statistics; for channels only.
     * @returns {boolean}
     */
    get can_post_messages(){return this.chat_administrator.hasOwnProperty("can_post_messages")?this.chat_administrator.can_post_messages:null;}
    /**
     * Optional. True, if the administrator can edit messages of other users and can pin messages; for channels only.
     * @returns {boolean}
     */
    get can_edit_messages(){return this.chat_administrator.hasOwnProperty("can_edit_messages")?this.chat_administrator.can_edit_messages:null;}
    /**
     * Optional. True, if the user is allowed to pin messages; for groups and supergroups only.
     * @returns {boolean}
     */
    get can_pin_messages(){return this.chat_administrator.hasOwnProperty("can_pin_messages")?this.chat_administrator.can_pin_messages:null;}
    /**
     * Optional. True, if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only.
     * @returns {boolean}
     */
    get can_manage_topics(){return this.chat_administrator.hasOwnProperty("can_manage_topics")?this.chat_administrator.can_manage_topics:null;}
    /**
     * Optional. Custom title for this user.
     * @returns {boolean}
     */
    get custom_title(){return this.chat_administrator.hasOwnProperty("custom_title")?this.chat_administrator.custom_title:null;}

}

/**
 * Represents a chat member that has no additional privileges or restrictions.
 */
class ChatMemberMember {
    constructor (chat_member_member){
        this.chat_member_member = chat_member_member;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * The member's status in the chat, always "member".
     * @returns {string}
     */
    get status(){return "member"};

    /**
     * Information about the user.
     * @returns {User}
     */
    get user(){return this.chat_member_member.hasOwnProperty("user")? new User(this.chat_member_member.user) : null};

    /**
     * Optional. Date when the user's subscription will expire; Unix time.
     * @returns {number}
     */
    get until_date(){return this.chat_member_member.hasOwnProperty("until_date")?this.chat_member_member.until_date:null;}
}

/**
 * Represents a chat member that is under certain restrictions in the chat. Supergroups only.
 */
class ChatMemberRestricted {
    constructor (chat_member_restricted){
        this.chat_member_restricted = chat_member_restricted;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * The member's status in the chat, always "restricted".
     * @returns {string}
     */
    get status(){return "restricted"};

    /**
     * Information about the user.
     * @returns {User}
     */
    get user(){return this.chat_member_restricted.hasOwnProperty("user")? new User(this.chat_member_restricted.user) : null};

    /**
     * True, if the user is a member of the chat at the moment of the request.
     * @returns {boolean}
     */
    get is_member(){return this.chat_member_restricted.hasOwnProperty("is_member")?this.chat_member_restricted.is_member:null;}
    /**
     * True, if the user is allowed to send text messages, contacts, giveaways, giveaway winners, invoices, locations and venues.
     * @returns {boolean}
     */
    get can_send_messages(){return this.chat_member_restricted.hasOwnProperty("can_send_messages")?this.chat_member_restricted.can_send_messages:null;}
    /**
     * True, if the user is allowed to send audios.
     * @returns {boolean}
     */
    get can_send_audios(){return this.chat_member_restricted.hasOwnProperty("can_send_audios")?this.chat_member_restricted.can_send_audios:null;}
    /**
     * True, if the user is allowed to send documents.
     * @returns {boolean}
     */
    get can_send_documents(){return this.chat_member_restricted.hasOwnProperty("can_send_documents")?this.chat_member_restricted.can_send_documents:null;}
    /**
     * True, if the user is allowed to send photos.
     * @returns {boolean}
     */
    get can_send_photos(){return this.chat_member_restricted.hasOwnProperty("can_send_photos")?this.chat_member_restricted.can_send_photos:null;}
    /**
     * True, if the user is allowed to send videos.
     * @returns {boolean}
     */
    get can_send_videos(){return this.chat_member_restricted.hasOwnProperty("can_send_videos")?this.chat_member_restricted.can_send_videos:null;}
    /**
     * True, if the user is allowed to send video notes.
     * @returns {boolean}
     */
    get can_send_video_notes(){return this.chat_member_restricted.hasOwnProperty("can_send_video_notes")?this.chat_member_restricted.can_send_video_notes:null;}
    /**
     * True, if the user is allowed to send voice notes.
     * @returns {boolean}
     */
    get can_send_voice_notes(){return this.chat_member_restricted.hasOwnProperty("can_send_voice_notes")?this.chat_member_restricted.can_send_voice_notes:null;}
    /**
     * True, if the user is allowed to send polls.
     * @returns {boolean}
     */
    get can_send_polls(){return this.chat_member_restricted.hasOwnProperty("can_send_polls")?this.chat_member_restricted.can_send_polls:null;}
    /**
     * True, if the user is allowed to send animations, games, stickers and use inline bots.
     * @returns {boolean}
     */
    get can_send_other_messages(){return this.chat_member_restricted.hasOwnProperty("can_send_other_messages")?this.chat_member_restricted.can_send_other_messages:null;}
    /**
     * True, if the user is allowed to add web page previews to their messages.
     * @returns {boolean}
     */
    get can_add_web_page_previews(){return this.chat_member_restricted.hasOwnProperty("can_add_web_page_previews")?this.chat_member_restricted.can_add_web_page_previews:null;}
    /**
     * True, if the user is allowed to change the chat title, photo and other settings.
     * @returns {boolean}
     */
    get can_change_info(){return this.chat_member_restricted.hasOwnProperty("can_change_info")?this.chat_member_restricted.can_change_info:null;}
    /**
     * True, if the user is allowed to invite new users to the chat.
     * @returns {boolean}
     */
    get can_invite_users(){return this.chat_member_restricted.hasOwnProperty("can_invite_users")?this.chat_member_restricted.can_invite_users:null;}
    /**
     * True, if the user is allowed to pin messages.
     * @returns {boolean}
     */
    get can_pin_messages(){return this.chat_member_restricted.hasOwnProperty("can_pin_messages")?this.chat_member_restricted.can_pin_messages:null;}
    /**
     * True, if the user is allowed to create forum topics.
     * @returns {boolean}
     */
    get can_manage_topics(){return this.chat_member_restricted.hasOwnProperty("can_manage_topics")?this.chat_member_restricted.can_manage_topics:null;}
    /**
     * Date when restrictions will be lifted for this user; Unix time. If 0, then the user is restricted forever.
     * @returns {number}
     */
    get until_date(){return this.chat_member_restricted.hasOwnProperty("until_date")?this.chat_member_restricted.until_date:null;}
}

/**
 * Represents a chat member that isn't currently a member of the chat, but may join it themselves.
 */
class ChatMemberLeft {
    constructor (chat_member_left) {
        this.chat_member_left = chat_member_left;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * The member's status in the chat, always "left".
     * @returns {string}
     */
    get status(){return "left"};

    /**
     * Information about the user.
     * @returns {User}
     */
    get user(){return this.chat_member_left.hasOwnProperty("user")? new User(this.chat_member_left.user) : null};
}

/**
 * Represents a chat member that was banned in the chat and can't return to the chat or view chat messages.
 */
class ChatMemberBanned {
    constructor (chat_member_banned) {
        this.chat_member_banned = chat_member_banned;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * The member's status in the chat, always "kicked".
     * @returns {string}
     */
    get status(){return "kicked"};

    /**
     * Information about the user.
     * @returns {User}
     */
    get user(){return this.chat_member_banned.hasOwnProperty("user")? new User(this.chat_member_banned.user) : null};

    /**
     * Date when restrictions will be lifted for this user; Unix time. If 0, then the user is restricted forever.
     * @returns {number}
     */
    get until_date(){return this.chat_member_banned.hasOwnProperty("until_date")?this.chat_member_banned.until_date:null;}
}

/**
 * Represents an invite link for a chat.
 */
class ChatInviteLink {
    constructor (chat_invite_link){
        this.chat_invite_link = chat_invite_link;
    }

    /**
     * The invite link. If the link was created by another chat administrator, then the second part of the link will be replaced with “…”.
     * @returns {string}
     */
    get invite_link(){return this.chat_invite_link?.invite_link;}
    /**
     * Creator of the link.
     * @returns {User}
     */
    get creator(){return new User(this.chat_invite_link?.creator);}
    /**
     * True, if users joining the chat via the link need to be approved by chat administrators.
     * @returns {boolean}
     */
    get creates_join_request(){return this.chat_invite_link?.creates_join_request;}
    /**
     * True, if the link is primary.
     * @returns {boolean}
     */
    get is_primary(){return this.chat_invite_link?.is_primary;}
    /**
     * True, if the link is revoked.
     * @returns {boolean}
     */
    get is_revoked(){return this.chat_invite_link?.is_revoked;}
    /**
     * Optional. Invite link name.
     * @returns {string}
     */
    get name(){return this.chat_invite_link?.name;}
    /**
     * Optional. Point in time (Unix timestamp) when the link will expire or has been expired.
     * @returns {number}
     */
    get expire_date(){return this.chat_invite_link?.expire_date;}
    /**
     * Optional. The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999.
     * @returns {number}
     */
    get member_limit(){return this.chat_invite_link?.member_limit;}
    /**
     * Optional. number of pending join requests created using this link.
     * @returns {number}
     */
    get pending_join_request_count(){return this.chat_invite_link?.pending_join_request_count;}
    /**
     * Optional. The number of seconds the subscription will be active for before the next payment.
     * @returns {number}
     */
    get subscription_period(){return this.chat_invite_link?.subscription_period;}
    /**
     * Optional. The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat using the link.
     * @returns {number}
     */
    get subscription_price(){return this.chat_invite_link?.subscription_price;}
}

/**
 * This object represents changes in the status of a chat member.
 */
class ChatMemberUpdated {
    constructor (chat_member_updated){
        this.chat_member_updated = chat_member_updated;
    }

    /**
     * Chat the user belongs to.
     * @returns {Chat}
     */
    get chat(){return new Chat(this.chat_member_updated?.chat)};
    /**
     * Performer of the action, which resulted in the change.
     * @returns {User}
     */
    get from(){return new User(this.chat_member_updated?.from)};
    /**
     * Date the change was done in Unix time.
     * @returns {number}
     */
    get date(){return this.chat_member_updated?.date};
    /**
     * Previous information about the chat member.
     * @returns {ChatMemberAdministrator|ChatMemberBanned|ChatMemberLeft|ChatMemberMember|ChatMemberRestricted|ChatMemberOwner}
     */
    get old_chat_member(){return new ChatMember(this.chat_member_updated?.old_chat_member)};
    /**
     * New information about the chat member.
     * @returns {ChatMemberAdministrator|ChatMemberBanned|ChatMemberLeft|ChatMemberMember|ChatMemberRestricted|ChatMemberOwner}
     */
    get new_chat_member(){return new ChatMember(this.chat_member_updated?.new_chat_member)};
    /**
     * Optional. Chat invite link, which was used by the user to join the chat; for joining by invite link events only.
     * @returns {ChatInviteLink}
     */
    get invite_link(){return new ChatInviteLink(this.chat_member_updated?.invite_link)};
    /**
     * Optional. True, if the user joined the chat after sending a direct join request without using an invite link and being approved by an administrator.
     * @returns {boolean}
     */
    get via_join_request(){return this.chat_member_updated?.via_join_request};
    /**
     * Optional. True, if the user joined the chat via a chat folder invite link.
     * @returns {boolean}
     */
    get via_chat_folder_invite_link(){return this.chat_member_updated?.via_chat_folder_invite_link};
}

/**
 * This object contains information about the quoted part of a message that is replied to by the given message.
 */
class TextQuote {
    constructor(text_quote) {
        this.text_quote = text_quote
    }
    /**
     * Text of the quoted part of a message that is replied to by the given message.
     * @returns {string}
     */
    get text(){return this.text_quote?.text};
    /**
     * Optional. Special entities that appear in the quote. Currently, only bold, italic, underline, strikethrough, spoiler, custom_emoji, and date_time entities are kept in quotes.
     * @returns {Array<MessageEntity>}
     */
    get entities(){return this.text_quote?.entities.map(entity => new MessageEntity(entity))};
    /**
     * Approximate quote position in the original message in UTF-16 code units as specified by the sender.
     * @returns {number}
     */
    get position(){return this.text_quote?.position};
    /**
     * Optional. True, if the quote was chosen manually by the message sender. Otherwise, the quote was added automatically by the server.
     * @returns {boolean}
     */
    get is_manual(){return this.text_quote?.is_manual};
}

/**
 * This object represents an animation file (GIF or H.264/MPEG-4 AVC video without sound).
 */
class Animation {
    constructor(animation) {
        this.animation = animation;
    }
    /**
     * Identifier for this file, which can be used to download or reuse the file.
     * @returns {string}
     */
    get file_id(){return this.animation?.file_id};
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     * @returns {string}
     */
    get file_unique_id(){return this.animation?.file_unique_id};
    /**
     * Video width as defined by the sender.
     * @returns {number}
     */
    get width(){return this.animation?.width};
    /**
     * Video height as defined by the sender.
     * @returns {number}
     */
    get height(){return this.animation?.height};
    /**
     * Duration of the video in seconds as defined by the sender.
     * @returns {number}
     */
    get duration(){return this.animation?.duration};
    /**
     * Optional. Animation thumbnail as defined by the sender.
     * @returns {PhotoSize}
     */
    get thumbnail(){return new PhotoSize(this.animation?.thumbnail)};
    /**
     * Optional. Original animation filename as defined by the sender.
     * @returns {string}
     */
    get file_name(){return this.animation?.file_name};
    /**
     * Optional. MIME type of the file as defined by the sender.
     * @returns {string}
     */
    get mime_type(){return this.animation?.mime_type};
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     * @returns {number}
     */
    get file_size(){return this.animation?.file_size};
}

/**
 * This object represents an audio file to be treated as music by the Telegram clients.
 */
class Audio {
    constructor(audio) {
        this.audio = audio;
    }
    /**
     * Identifier for this file, which can be used to download or reuse the file.
     * @returns {string}
     */
    get file_id(){return this.audio?.file_id};
    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file.
     * @returns {string}
     */
    get file_unique_id(){return this.audio?.file_unique_id};
    /**
     * Duration of the audio in seconds as defined by the sender.
     * @returns {number}
     */
    get duration(){return this.audio?.duration};
    /**
     * Optional. Performer of the audio as defined by the sender or by audio tags.
     * @returns {string}
     */
    get performer(){return this.audio?.performer};
    /**
     * Optional. Title of the audio as defined by the sender or by audio tags.
     * @returns {string}
     */
    get title(){return this.audio?.title};
    /**
     * Optional. Original audio filename as defined by the sender.
     * @returns {string}
     */
    get file_name(){return this.audio?.file_name};
    /**
     * Optional. MIME type of the file as defined by the sender.
     * @returns {string}
     */
    get mime_type(){return this.audio?.mime_type};
    /**
     * Optional. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value.
     * @returns {number}
     */
    get file_size(){return this.audio?.file_size};
    /**
     * Optional. Thumbnail of the album cover to which the music file belongs.
     * @returns {PhotoSize}
     */
    get thumbnail(){return new PhotoSize(this.audio?.thumbnail)};
}

/**
 * The paid media isn't available before the payment.
 */
class PaidMediaPreview {
    constructor(paid_media_preview) {
        this.paid_media_preview = paid_media_preview;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * Type of the paid media, always "preview".
     * @returns {string}
     */
    get type(){return "preview"};

    /**
     * Optional. Media width as defined by the sender.
     * @returns {number}
     */
    get width(){return this.paid_media_preview?.width};

    /**
     * Optional. Media height as defined by the sender.
     * @returns {number}
     */
    get height(){return this.paid_media_preview?.height};

    /**
     * Optional. Duration of the media in seconds as defined by the sender.
     * @returns {number}
     */
    get duration(){return this.paid_media_preview?.duration};
}

/**
 * The paid media is a photo.
 */
class PaidMediaPhoto {
    constructor(paid_media_photo) {
        this.paid_media_photo = paid_media_photo;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * Type of the paid media, always "photo".
     * @returns {string}
     */
    get type(){return "photo"};

    /**
     * The photo.
     * @returns {PhotoSize[]}
     */
    get photo(){
        return this.paid_media_photo?.photo?.map(p => new PhotoSize(p));
    };
}

/**
 * The paid media is a video.
 */
class PaidMediaVideo {
    constructor(paid_media_video) {
        this.paid_media_video = paid_media_video;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * Type of the paid media, always "video".
     * @returns {string}
     */
    get type(){return "video"};

    /**
     * The video.
     * @returns {Video}
     */
    get video(){
        return this.paid_media_video?.video
            ? new Video(this.paid_media_video.video)
            : null;
    };
}

/**
 * This object describes paid media. Currently, it can be one of

- PaidMediaPreview
- PaidMediaPhoto
- PaidMediaVideo

 */
class PaidMedia {
    /** The paid media isn't available before the payment. */
    static PREVIEW = "preview";
    /** The paid media is a photo. */
    static PHOTO = "photo";
    /** The paid media is a video. */
    static VIDEO = "video";

    constructor(data) {
        const typeToClassMap = {
            "preview": PaidMediaPreview,
            "photo": PaidMediaPhoto,
            "video": PaidMediaVideo,
        };

        const TargetClass = typeToClassMap[data?.type] || PaidMedia;

        if (!TargetClass) {
            throw new Error("Paid media type not recognized.");
        }

        const instance = new TargetClass(data);

        Object.setPrototypeOf(this, TargetClass.prototype);
        Object.assign(this, instance);

        return this;
    }
}

/**
 * Describes the paid media added to a message.
 */
class PaidMediaInfo {
    constructor(paidMediaInfo) {
        this.paidMediaInfo = paidMediaInfo;
    }

    /**
     * The number of Telegram Stars that must be paid to buy access to the media.
     * @returns {number}
     */
    get star_count(){return this.paidMediaInfo?.star_count};

    /**
     * Information about the paid media.
     * @returns {PaidMedia[]}
     */
    get paid_media(){
        return this.paidMediaInfo?.paid_media?.map(pm => new PaidMedia(pm));
    };
}

/**
 * This object describes the position on faces where a mask should be placed by default.
 */
class MaskPosition {
    constructor(mask_position) {
        this.mask_position = mask_position;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * The part of the face relative to which the mask should be placed.
     * @returns {string}
     */
    get point(){return this.mask_position?.point};

    /**
     * Shift by X-axis measured in widths of the mask scaled to the face size.
     * @returns {number}
     */
    get x_shift(){return this.mask_position?.x_shift};

    /**
     * Shift by Y-axis measured in heights of the mask scaled to the face size.
     * @returns {number}
     */
    get y_shift(){return this.mask_position?.y_shift};

    /**
     * Mask scaling coefficient.
     * @returns {number}
     */
    get scale(){return this.mask_position?.scale};
}

/**
 * This object represents a sticker.
 */
class Sticker {
    constructor(sticker) {
        this.sticker = sticker;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * Identifier for this file, which can be used to download or reuse the file.
     * @returns {string}
     */
    get file_id(){return this.sticker?.file_id};

    /**
     * Unique identifier for this file.
     * @returns {string}
     */
    get file_unique_id(){return this.sticker?.file_unique_id};

    /**
     * Type of the sticker.
     * @returns {string}
     */
    get type(){return this.sticker?.type};

    /**
     * Sticker width.
     * @returns {number}
     */
    get width(){return this.sticker?.width};

    /**
     * Sticker height.
     * @returns {number}
     */
    get height(){return this.sticker?.height};

    /**
     * True, if the sticker is animated.
     * @returns {boolean}
     */
    get is_animated(){return this.sticker?.is_animated};

    /**
     * True, if the sticker is a video sticker.
     * @returns {boolean}
     */
    get is_video(){return this.sticker?.is_video};

    /**
     * Optional. Sticker thumbnail.
     * @returns {PhotoSize}
     */
    get thumbnail(){
        return this.sticker?.thumbnail
            ? new PhotoSize(this.sticker.thumbnail)
            : null;
    }

    /**
     * Optional. Emoji associated with the sticker.
     * @returns {string}
     */
    get emoji(){return this.sticker?.emoji};

    /**
     * Optional. Name of the sticker set.
     * @returns {string}
     */
    get set_name(){return this.sticker?.set_name};

    /**
     * Optional. Premium animation for the sticker.
     * @returns {_File}
     */
    get premium_animation(){
        return this.sticker?.premium_animation
            ? new _File(this.sticker.premium_animation)
            : null;
    }

    /**
     * Optional. Mask position.
     * @returns {MaskPosition}
     */
    get mask_position(){
        return this.sticker?.mask_position
            ? new MaskPosition(this.sticker.mask_position)
            : null;
    }

    /**
     * Optional. Unique identifier for custom emoji.
     * @returns {string}
     */
    get custom_emoji_id(){return this.sticker?.custom_emoji_id};

    /**
     * Optional. True, if the sticker must be repainted.
     * @returns {boolean}
     */
    get needs_repainting(){return this.sticker?.needs_repainting};

    /**
     * Optional. File size in bytes.
     * @returns {number}
     */
    get file_size(){return this.sticker?.file_size};
}

/**
 * This object represents a story.
 */
class Story {
    constructor(story) {
        this.story = story;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * Chat that posted the story.
     * @returns {Chat}
     */
    get chat(){
        return this.story?.chat
            ? new Chat(this.story.chat)
            : null;
    }

    /**
     * Unique identifier for the story in the chat.
     * @returns {number}
     */
    get id(){return this.story?.id};
}

/**
 * This object represents a video message.
 */
class VideoNote {
    constructor(video_note) {
        this.video_note = video_note;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * Identifier for this file, which can be used to download or reuse the file.
     * @returns {string}
     */
    get file_id(){return this.video_note?.file_id};

    /**
     * Unique identifier for this file.
     * @returns {string}
     */
    get file_unique_id(){return this.video_note?.file_unique_id};

    /**
     * Video width and height (diameter of the video message).
     * @returns {number}
     */
    get length(){return this.video_note?.length};

    /**
     * Duration of the video in seconds.
     * @returns {number}
     */
    get duration(){return this.video_note?.duration};

    /**
     * Optional. Video thumbnail.
     * @returns {PhotoSize}
     */
    get thumbnail(){
        return this.video_note?.thumbnail
            ? new PhotoSize(this.video_note.thumbnail)
            : null;
    }

    /**
     * Optional. File size in bytes.
     * @returns {number}
     */
    get file_size(){return this.video_note?.file_size};
}

/**
 * This object represents a voice note.
 */
class Voice {
    constructor(voice) {
        this.voice = voice;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * Identifier for this file, which can be used to download or reuse the file.
     * @returns {string}
     */
    get file_id(){return this.voice?.file_id};

    /**
     * Unique identifier for this file.
     * @returns {string}
     */
    get file_unique_id(){return this.voice?.file_unique_id};

    /**
     * Duration of the audio in seconds.
     * @returns {number}
     */
    get duration(){return this.voice?.duration};

    /**
     * Optional. MIME type of the file.
     * @returns {string}
     */
    get mime_type(){return this.voice?.mime_type};

    /**
     * Optional. File size in bytes.
     * @returns {number}
     */
    get file_size(){return this.voice?.file_size};
}

/**
 * Describes a task in a checklist.
 */
class ChecklistTask {
    constructor(checklist_task) {
        this.checklist_task = checklist_task;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * Unique identifier of the task.
     * @returns {number}
     */
    get id(){return this.checklist_task?.id};

    /**
     * Text of the task.
     * @returns {string}
     */
    get text(){return this.checklist_task?.text};

    /**
     * Optional. Special entities that appear in the task text.
     * @returns {MessageEntity[]}
     */
    get text_entities(){
        return this.checklist_task?.text_entities?.map(e => new MessageEntity(e));
    }

    /**
     * Optional. User that completed the task.
     * @returns {User}
     */
    get completed_by_user(){
        return this.checklist_task?.completed_by_user
            ? new User(this.checklist_task.completed_by_user)
            : null;
    }

    /**
     * Optional. Chat that completed the task.
     * @returns {Chat}
     */
    get completed_by_chat(){
        return this.checklist_task?.completed_by_chat
            ? new Chat(this.checklist_task.completed_by_chat)
            : null;
    }

    /**
     * Optional. Completion date (Unix timestamp).
     * @returns {number}
     */
    get completion_date(){return this.checklist_task?.completion_date};
}

/**
 * Describes a checklist.
 */
class Checklist {
    constructor(checklist) {
        this.checklist = checklist;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * Title of the checklist.
     * @returns {string}
     */
    get title(){return this.checklist?.title};

    /**
     * Optional. Special entities that appear in the checklist title.
     * @returns {MessageEntity[]}
     */
    get title_entities(){
        return this.checklist?.title_entities?.map(e => new MessageEntity(e));
    }

    /**
     * List of tasks in the checklist.
     * @returns {ChecklistTask[]}
     */
    get tasks(){
        return this.checklist?.tasks?.map(t => new ChecklistTask(t));
    }

    /**
     * Optional. True, if users other than the creator can add tasks.
     * @returns {boolean}
     */
    get others_can_add_tasks(){return this.checklist?.others_can_add_tasks};

    /**
     * Optional. True, if users other than the creator can mark tasks as done.
     * @returns {boolean}
     */
    get others_can_mark_tasks_as_done(){return this.checklist?.others_can_mark_tasks_as_done};
}

/**
 * Describes a task to add to a checklist.
 */
class InputChecklistTask {
    constructor(input_checklist_task) {
        this.input_checklist_task = input_checklist_task;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * Unique identifier of the task.
     * @returns {number}
     */
    get id(){return this.input_checklist_task?.id};

    /**
     * Text of the task.
     * @returns {string}
     */
    get text(){return this.input_checklist_task?.text};

    /**
     * Optional. Mode for parsing entities in the text.
     * @returns {string}
     */
    get parse_mode(){return this.input_checklist_task?.parse_mode};

    /**
     * Optional. List of special entities that appear in the text.
     * @returns {MessageEntity[]}
     */
    get text_entities(){
        return this.input_checklist_task?.text_entities?.map(e => new MessageEntity(e));
    }
}

/**
 * Describes a checklist to create.
 */
class InputChecklist {
    constructor(input_checklist) {
        this.input_checklist = input_checklist;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * Title of the checklist.
     * @returns {string}
     */
    get title(){return this.input_checklist?.title};

    /**
     * Optional. Mode for parsing entities in the title.
     * @returns {string}
     */
    get parse_mode(){return this.input_checklist?.parse_mode};

    /**
     * Optional. List of special entities that appear in the title.
     * @returns {MessageEntity[]}
     */
    get title_entities(){
        return this.input_checklist?.title_entities?.map(e => new MessageEntity(e));
    }

    /**
     * List of tasks in the checklist.
     * @returns {InputChecklistTask[]}
     */
    get tasks(){
        return this.input_checklist?.tasks?.map(t => new InputChecklistTask(t));
    }

    /**
     * Optional. True if other users can add tasks.
     * @returns {boolean}
     */
    get others_can_add_tasks(){return this.input_checklist?.others_can_add_tasks};

    /**
     * Optional. True if other users can mark tasks as done or not done.
     * @returns {boolean}
     */
    get others_can_mark_tasks_as_done(){return this.input_checklist?.others_can_mark_tasks_as_done};
}

/**
 * Describes a service message about checklist tasks marked as done or not done.
 */
class ChecklistTasksDone {
    constructor(checklist_tasks_done) {
        this.checklist_tasks_done = checklist_tasks_done;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * Optional. Message containing the checklist whose tasks were updated.
     * @returns {Message}
     */
    get checklist_message(){
        return this.checklist_tasks_done?.checklist_message
            ? new Message(this.checklist_tasks_done.checklist_message)
            : null;
    }

    /**
     * Optional. Identifiers of the tasks that were marked as done.
     * @returns {number[]}
     */
    get marked_as_done_task_ids(){
        return this.checklist_tasks_done?.marked_as_done_task_ids;
    }

    /**
     * Optional. Identifiers of the tasks that were marked as not done.
     * @returns {number[]}
     */
    get marked_as_not_done_task_ids(){
        return this.checklist_tasks_done?.marked_as_not_done_task_ids;
    }
}

/**
 * Describes a service message about tasks added to a checklist.
 */
class ChecklistTasksAdded {
    constructor(checklist_tasks_added) {
        this.checklist_tasks_added = checklist_tasks_added;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * Optional. Message containing the checklist to which the tasks were added.
     * @returns {Message}
     */
    get checklist_message(){
        return this.checklist_tasks_added?.checklist_message
            ? new Message(this.checklist_tasks_added.checklist_message)
            : null;
    }

    /**
     * List of tasks added to the checklist.
     * @returns {ChecklistTask[]}
     */
    get tasks(){
        return this.checklist_tasks_added?.tasks?.map(t => new ChecklistTask(t));
    }
}

/**
 * This object represents a phone contact.
 */
class Contact {
    constructor(contact) {
        this.contact = contact;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * Contact's phone number.
     * @returns {string}
     */
    get phone_number(){return this.contact?.phone_number};

    /**
     * Contact's first name.
     * @returns {string}
     */
    get first_name(){return this.contact?.first_name};

    /**
     * Optional. Contact's last name.
     * @returns {string}
     */
    get last_name(){return this.contact?.last_name};

    /**
     * Optional. Contact's user identifier in Telegram.
     * @returns {number}
     */
    get user_id(){return this.contact?.user_id};

    /**
     * Optional. Additional data about the contact in the form of a vCard.
     * @returns {string}
     */
    get vcard(){return this.contact?.vcard};
}

/**
 * This object represents an animated emoji that displays a random value.
 */
class Dice {
    constructor(dice) {
        this.dice = dice;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * Emoji on which the dice throw animation is based.
     * @returns {string}
     */
    get emoji(){return this.dice?.emoji};

    /**
     * Value of the dice, 1-6 for “🎲”, “🎯” and “🎳” base emoji, 1-5 for “🏀” and “⚽” base emoji, 1-64 for “🎰” base emoji.
     * @returns {number}
     */
    get value(){return this.dice?.value};
}

/**
 * This object represents a game. Use BotFather to create and edit games, their short names will act as unique identifiers.
 */
class Game {
    constructor(game) {
        this.game = game;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * Title of the game.
     * @returns {string}
     */
    get title(){return this.game?.title};

    /**
     * Description of the game.
     * @returns {string}
     */
    get description(){return this.game?.description};

    /**
     * Photo that will be displayed in the game message in chats.
     * @returns {PhotoSize[]}
     */
    get photo(){
        return this.game?.photo?.map(p => new PhotoSize(p));
    }

    /**
     * Optional. Brief description of the game or high scores included in the game message. Can be automatically edited to include current high scores for the game when the bot calls setGameScore, or manually edited using editMessageText. 0-4096 characters.
     * @returns {string}
     */
    get text(){return this.game?.text};

    /**
     * Optional. Special entities that appear in text, such as usernames, URLs, bot commands, etc.
     * @returns {MessageEntity[]}
     */
    get text_entities(){
        return this.game?.text_entities?.map(e => new MessageEntity(e));
    }

    /**
     * Optional. Animation that will be displayed in the game message in chats. Upload via BotFather.
     * @returns {Animation}
     */
    get animation(){
        return this.game?.animation
            ? new Animation(this.game.animation)
            : null;
    }
}

/**
 * This object represents a message about a scheduled giveaway.
 */
class Giveaway {
    constructor(giveaway) {
        this.giveaway = giveaway;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * The list of chats which the user must join to participate in the giveaway.
     * @returns {Chat[]}
     */
    get chats(){
        return this.giveaway?.chats?.map(c => new Chat(c));
    }

    /**
     * Point in time (Unix timestamp) when winners of the giveaway will be selected.
     * @returns {number}
     */
    get winners_selection_date(){return this.giveaway?.winners_selection_date};

    /**
     * The number of users which are supposed to be selected as winners of the giveaway.
     * @returns {number}
     */
    get winner_count(){return this.giveaway?.winner_count};

    /**
     * Optional. True, if only users who join the chats after the giveaway started should be eligible to win.
     * @returns {boolean}
     */
    get only_new_members(){return this.giveaway?.only_new_members};

    /**
     * Optional. True, if the list of giveaway winners will be visible to everyone.
     * @returns {boolean}
     */
    get has_public_winners(){return this.giveaway?.has_public_winners};

    /**
     * Optional. Description of additional giveaway prize.
     * @returns {string}
     */
    get prize_description(){return this.giveaway?.prize_description};

    /**
     * Optional. A list of two-letter ISO 3166-1 alpha-2 country codes indicating the countries from which eligible users for the giveaway must come. If empty, then all users can participate in the giveaway. Users with a phone number that was bought on Fragment can always participate in giveaways.
     * @returns {string[]}
     */
    get country_codes(){return this.giveaway?.country_codes};

    /**
     * Optional. The number of Telegram Stars to be split between giveaway winners; for Telegram Star giveaways only.
     * @returns {number}
     */
    get prize_star_count(){return this.giveaway?.prize_star_count};

    /**
     * Optional. The number of months the Telegram Premium subscription won from the giveaway will be active for; for Telegram Premium giveaways only.
     * @returns {number}
     */
    get premium_subscription_month_count(){return this.giveaway?.premium_subscription_month_count};
}

/**
 * This object represents a message about the completion of a giveaway with public winners.
 */
class GiveawayWinners {
    constructor(giveaway_winners) {
        this.giveaway_winners = giveaway_winners;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * The chat that created the giveaway.
     * @returns {Chat}
     */
    get chat(){
        return this.giveaway_winners?.chat
            ? new Chat(this.giveaway_winners.chat)
            : null;
    }

    /**
     * Identifier of the message with the giveaway in the chat.
     * @returns {number}
     */
    get giveaway_message_id(){return this.giveaway_winners?.giveaway_message_id};

    /**
     * Point in time (Unix timestamp) when winners of the giveaway were selected.
     * @returns {number}
     */
    get winners_selection_date(){return this.giveaway_winners?.winners_selection_date};

    /**
     * Total number of winners in the giveaway.
     * @returns {number}
     */
    get winner_count(){return this.giveaway_winners?.winner_count};

    /**
     * List of up to 100 winners of the giveaway.
     * @returns {User[]}
     */
    get winners(){
        return this.giveaway_winners?.winners?.map(u => new User(u));
    }

    /**
     * Optional. The number of other chats the user had to join in order to be eligible for the giveaway.
     * @returns {number}
     */
    get additional_chat_count(){return this.giveaway_winners?.additional_chat_count};

    /**
     * Optional. The number of Telegram Stars that were split between giveaway winners; for Telegram Star giveaways only.
     * @returns {number}
     */
    get prize_star_count(){return this.giveaway_winners?.prize_star_count};

    /**
     * Optional. The number of months the Telegram Premium subscription won from the giveaway will be active for; for Telegram Premium giveaways only.
     * @returns {number}
     */
    get premium_subscription_month_count(){return this.giveaway_winners?.premium_subscription_month_count};

    /**
     * Optional. Number of undistributed prizes.
     * @returns {number}
     */
    get unclaimed_prize_count(){return this.giveaway_winners?.unclaimed_prize_count};

    /**
     * Optional. True, if only users who had joined the chats after the giveaway started were eligible to win.
     * @returns {boolean}
     */
    get only_new_members(){return this.giveaway_winners?.only_new_members};

    /**
     * Optional. True, if the giveaway was canceled because the payment for it was refunded.
     * @returns {boolean}
     */
    get was_refunded(){return this.giveaway_winners?.was_refunded};

    /**
     * Optional. Description of additional giveaway prize.
     * @returns {string}
     */
    get prize_description(){return this.giveaway_winners?.prize_description};
}

/**
 * This object contains basic information about an invoice.
 */
class Invoice {
    constructor(invoice) {
        this.invoice = invoice;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * Product name.
     * @returns {string}
     */
    get title(){return this.invoice?.title};

    /**
     * Product description.
     * @returns {string}
     */
    get description(){return this.invoice?.description};

    /**
     * Unique bot deep-linking parameter that can be used to generate this invoice.
     * @returns {string}
     */
    get start_parameter(){return this.invoice?.start_parameter};

    /**
     * Three-letter ISO 4217 currency code, or “XTR” for payments in Telegram Stars.
     * @returns {string}
     */
    get currency(){return this.invoice?.currency};

    /**
     * Total price in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies).
     * @returns {number}
     */
    get total_amount(){return this.invoice?.total_amount};
}

/**
 * This object contains information about one answer option in a poll.
 */
class PollOption {
    constructor(poll_option) {
        this.poll_option = poll_option;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * Unique identifier of the option, persistent on option addition and deletion.
     * @returns {string}
     */
    get persistent_id(){return this.poll_option?.persistent_id};

    /**
     * Option text, 1-100 characters.
     * @returns {string}
     */
    get text(){return this.poll_option?.text};

    /**
     * Optional. Special entities that appear in the option text. Currently, only custom emoji entities are allowed in poll option texts.
     * @returns {MessageEntity[]}
     */
    get text_entities(){
        return this.poll_option?.text_entities?.map(e => new MessageEntity(e));
    }

    /**
     * Number of users who voted for this option; may be 0 if unknown.
     * @returns {number}
     */
    get voter_count(){return this.poll_option?.voter_count};

    /**
     * Optional. User who added the option; omitted if the option wasn't added by a user after poll creation.
     * @returns {User}
     */
    get added_by_user(){
        return this.poll_option?.added_by_user
            ? new User(this.poll_option.added_by_user)
            : null;
    }

    /**
     * Optional. Chat that added the option; omitted if the option wasn't added by a chat after poll creation.
     * @returns {Chat}
     */
    get added_by_chat(){
        return this.poll_option?.added_by_chat
            ? new Chat(this.poll_option.added_by_chat)
            : null;
    }

    /**
     * Optional. Point in time (Unix timestamp) when the option was added; omitted if the option existed in the original poll.
     * @returns {number}
     */
    get addition_date(){return this.poll_option?.addition_date};
}

/**
 * This object contains information about a poll.
 */
class Poll {
    constructor(poll) {
        this.poll = poll;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * Unique poll identifier.
     * @returns {string}
     */
    get id(){return this.poll?.id};

    /**
     * Poll question, 1-300 characters.
     * @returns {string}
     */
    get question(){return this.poll?.question};

    /**
     * Optional. Special entities that appear in the question. Currently, only custom emoji entities are allowed in poll questions.
     * @returns {MessageEntity[]}
     */
    get question_entities(){
        return this.poll?.question_entities?.map(e => new MessageEntity(e));
    }

    /**
     * List of poll options.
     * @returns {PollOption[]}
     */
    get options(){
        return this.poll?.options?.map(o => new PollOption(o));
    }

    /**
     * Total number of users that voted in the poll.
     * @returns {number}
     */
    get total_voter_count(){return this.poll?.total_voter_count};

    /**
     * True, if the poll is closed.
     * @returns {boolean}
     */
    get is_closed(){return this.poll?.is_closed};

    /**
     * True, if the poll is anonymous.
     * @returns {boolean}
     */
    get is_anonymous(){return this.poll?.is_anonymous};

    /**
     * Poll type, currently can be “regular” or “quiz”.
     * @returns {string}
     */
    get type(){return this.poll?.type};

    /**
     * True, if the poll allows multiple answers.
     * @returns {boolean}
     */
    get allows_multiple_answers(){return this.poll?.allows_multiple_answers};

    /**
     * True, if the poll allows to change the chosen answer options.
     * @returns {boolean}
     */
    get allows_revoting(){return this.poll?.allows_revoting};

    /**
     * Optional. Array of 0-based identifiers of the correct answer options. Available only for polls in quiz mode which are closed or were sent (not forwarded) by the bot or to the private chat with the bot.
     * @returns {number[]}
     */
    get correct_option_ids(){return this.poll?.correct_option_ids};

    /**
     * Optional. Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters.
     * @returns {string}
     */
    get explanation(){return this.poll?.explanation};

    /**
     * Optional. Special entities like usernames, URLs, bot commands, etc. that appear in the explanation.
     * @returns {MessageEntity[]}
     */
    get explanation_entities(){
        return this.poll?.explanation_entities?.map(e => new MessageEntity(e));
    }

    /**
     * Optional. Amount of time in seconds the poll will be active after creation.
     * @returns {number}
     */
    get open_period(){return this.poll?.open_period};

    /**
     * Optional. Point in time (Unix timestamp) when the poll will be automatically closed.
     * @returns {number}
     */
    get close_date(){return this.poll?.close_date};

    /**
     * Optional. Description of the poll; for polls inside the Message object only.
     * @returns {string}
     */
    get description(){return this.poll?.description};

    /**
     * Optional. Special entities like usernames, URLs, bot commands, etc. that appear in the description.
     * @returns {MessageEntity[]}
     */
    get description_entities(){
        return this.poll?.description_entities?.map(e => new MessageEntity(e));
    }
}

/**
 * This object represents a venue.
 */
class Venue {
    constructor(venue) {
        this.venue = venue;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * Venue location. Can't be a live location.
     * @returns {Location}
     */
    get location(){
        return this.venue?.location
            ? new Location(this.venue.location)
            : null;
    }

    /**
     * Name of the venue.
     * @returns {string}
     */
    get title(){return this.venue?.title};

    /**
     * Address of the venue.
     * @returns {string}
     */
    get address(){return this.venue?.address};

    /**
     * Optional. Foursquare identifier of the venue.
     * @returns {string}
     */
    get foursquare_id(){return this.venue?.foursquare_id};

    /**
     * Optional. Foursquare type of the venue. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.).
     * @returns {string}
     */
    get foursquare_type(){return this.venue?.foursquare_type};

    /**
     * Optional. Google Places identifier of the venue.
     * @returns {string}
     */
    get google_place_id(){return this.venue?.google_place_id};

    /**
     * Optional. Google Places type of the venue. (See supported types.).
     * @returns {string}
     */
    get google_place_type(){return this.venue?.google_place_type};
}

/**
 * This object contains information about a message that is being replied to,
 * which may come from another chat or forum topic.
 */
class ExternalReplyInfo {
    constructor(external_reply_info) {
        this.external_reply_info = external_reply_info;
    }

    toJSON() {
        return { ...this };
    }

    /**
     * Origin of the message replied to by the given message.
     * @returns {MessageOrigin}
     */
    get origin(){
        return this.external_reply_info?.origin
            ? new MessageOrigin(this.external_reply_info.origin)
            : null;
    }

    /**
     * Optional. Chat the original message belongs to.
     * @returns {Chat}
     */
    get chat(){
        return this.external_reply_info?.chat
            ? new Chat(this.external_reply_info.chat)
            : null;
    }

    /**
     * Optional. Unique message identifier inside the original chat.
     * @returns {number}
     */
    get message_id(){return this.external_reply_info?.message_id};

    /**
     * Optional. Options used for link preview generation.
     * @returns {LinkPreviewOptions}
     */
    get link_preview_options(){
        return this.external_reply_info?.link_preview_options
            ? new LinkPreviewOptions(this.external_reply_info.link_preview_options)
            : null;
    }

    /**
     * Optional. Message is an animation.
     * @returns {Animation}
     */
    get animation(){
        return this.external_reply_info?.animation
            ? new Animation(this.external_reply_info.animation)
            : null;
    }

    /**
     * Optional. Message is an audio file.
     * @returns {Audio}
     */
    get audio(){
        return this.external_reply_info?.audio
            ? new Audio(this.external_reply_info.audio)
            : null;
    }

    /**
     * Optional. Message is a general file.
     * @returns {Document}
     */
    get document(){
        return this.external_reply_info?.document
            ? new Document(this.external_reply_info.document)
            : null;
    }

    /**
     * Optional. Message contains paid media.
     * @returns {PaidMediaInfo}
     */
    get paid_media(){
        return this.external_reply_info?.paid_media
            ? new PaidMediaInfo(this.external_reply_info.paid_media)
            : null;
    }

    /**
     * Optional. Message is a photo.
     * @returns {PhotoSize[]}
     */
    get photo(){
        return this.external_reply_info?.photo?.map(p => new PhotoSize(p));
    }

    /**
     * Optional. Message is a sticker.
     * @returns {Sticker}
     */
    get sticker(){
        return this.external_reply_info?.sticker
            ? new Sticker(this.external_reply_info.sticker)
            : null;
    }

    /**
     * Optional. Message is a forwarded story.
     * @returns {Story}
     */
    get story(){
        return this.external_reply_info?.story
            ? new Story(this.external_reply_info.story)
            : null;
    }

    /**
     * Optional. Message is a video.
     * @returns {Video}
     */
    get video(){
        return this.external_reply_info?.video
            ? new Video(this.external_reply_info.video)
            : null;
    }

    /**
     * Optional. Message is a video note.
     * @returns {VideoNote}
     */
    get video_note(){
        return this.external_reply_info?.video_note
            ? new VideoNote(this.external_reply_info.video_note)
            : null;
    }

    /**
     * Optional. Message is a voice message.
     * @returns {Voice}
     */
    get voice(){
        return this.external_reply_info?.voice
            ? new Voice(this.external_reply_info.voice)
            : null;
    }

    /**
     * Optional. True, if the message media is covered by a spoiler animation.
     * @returns {boolean}
     */
    get has_media_spoiler(){return this.external_reply_info?.has_media_spoiler};

    /**
     * Optional. Message is a checklist.
     * @returns {Checklist}
     */
    get checklist(){
        return this.external_reply_info?.checklist
            ? new Checklist(this.external_reply_info.checklist)
            : null;
    }

    /**
     * Optional. Message is a shared contact.
     * @returns {Contact}
     */
    get contact(){
        return this.external_reply_info?.contact
            ? new Contact(this.external_reply_info.contact)
            : null;
    }

    /**
     * Optional. Message is a dice.
     * @returns {Dice}
     */
    get dice(){
        return this.external_reply_info?.dice
            ? new Dice(this.external_reply_info.dice)
            : null;
    }

    /**
     * Optional. Message is a game.
     * @returns {Game}
     */
    get game(){
        return this.external_reply_info?.game
            ? new Game(this.external_reply_info.game)
            : null;
    }

    /**
     * Optional. Message is a scheduled giveaway.
     * @returns {Giveaway}
     */
    get giveaway(){
        return this.external_reply_info?.giveaway
            ? new Giveaway(this.external_reply_info.giveaway)
            : null;
    }

    /**
     * Optional. Giveaway with public winners.
     * @returns {GiveawayWinners}
     */
    get giveaway_winners(){
        return this.external_reply_info?.giveaway_winners
            ? new GiveawayWinners(this.external_reply_info.giveaway_winners)
            : null;
    }

    /**
     * Optional. Message is an invoice.
     * @returns {Invoice}
     */
    get invoice(){
        return this.external_reply_info?.invoice
            ? new Invoice(this.external_reply_info.invoice)
            : null;
    }

    /**
     * Optional. Message is a shared location.
     * @returns {Location}
     */
    get location(){
        return this.external_reply_info?.location
            ? new Location(this.external_reply_info.location)
            : null;
    }

    /**
     * Optional. Message is a poll.
     * @returns {Poll}
     */
    get poll(){
        return this.external_reply_info?.poll
            ? new Poll(this.external_reply_info.poll)
            : null;
    }

    /**
     * Optional. Message is a venue.
     * @returns {Venue}
     */
    get venue(){
        return this.external_reply_info?.venue
            ? new Venue(this.external_reply_info.venue)
            : null;
    }
}

export {
    _File,
    Animation,
    Audio,
    Birthdate,
    BusinessIntro,
    BusinessLocation,
    BusinessOpeningHours,
    BusinessOpeningHoursInterval,
    CallbackQuery,
    Chat,
    ChatFullInfo,
    ChatInviteLink,
    ChatLocation,
    ChatMember,
    ChatMemberAdministrator,
    ChatMemberBanned,
    ChatMemberLeft,
    ChatMemberMember,
    ChatMemberOwner,
    ChatMemberRestricted,
    ChatMemberUpdated,
    ChatPermissions,
    ChatPhoto,
    Checklist,
    ChecklistTask,
    ChecklistTasksAdded,
    ChecklistTasksDone,
    Dice,
    Document,
    ExternalReplyInfo,
    Game,
    Giveaway,
    GiveawayWinners,
    InaccessibleMessage,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    InputChecklist,
    InputChecklistTask,
    InputFile,
    InputMediaAnimation,
    InputMediaAudio,
    InputMediaDocument,
    InputMediaPhoto,
    InputMediaVideo,
    Invoice,
    LinkPreviewOptions,
    Location,
    MaybeInaccessibleMessage,
    Message,
    MessageEntity,
    MessageId,
    MessageOrigin,
    MessageOriginChannel,
    MessageOriginChat,
    MessageOriginHiddenUser,
    MessageOriginUser,
    PaidMedia,
    PaidMediaInfo,
    PaidMediaPhoto,
    PaidMediaPreview,
    PaidMediaVideo,
    PhotoSize,
    Poll,
    PollOption,
    ReactionType,
    ReactionTypeCustomEmoji,
    ReactionTypeEmoji,
    ReactionTypePaid,
    ReplyParameters,
    Sticker,
    Story,
    TextQuote,
    UniqueGiftColors,
    User,
    UserProfilePhotos,
    UserRating,
    Venue,
    Video,
    VideoQuality,
    VideoNote,
    Voice,
    WebAppInfo,
    WebhookInfo
}