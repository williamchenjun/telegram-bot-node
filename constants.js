/**
 * User interaction permissions levels.
 */
const Permissions = {
  NONE: 0,
  MEMBER: 1 << 0,
  ADMIN:  1 << 1,
  OWNER:  1 << 2,
  ALL:    (1 << 0) | (1 << 1) | (1 << 2),
};

/**
 * This object represents an incoming update.
 */
class UpdateType {
    static MESSAGE = "message";
    static EDITED_MESSAGE = "edited_message";
    static CHANNEL_POST = "channel_post";
    static EDITED_CHANNEL_POST = "edited_channel_post";
    static BUSINESS_CONNECTION = "business_connection";
    static BUSINESS_MESSAGE = "business_message";
    static EDITED_BUSINESS_MESSAGE = "edited_business_message";
    static DELETED_BUSINESS_MESSAGE = "deleted_business_message";
    static MESSAGE_REACTION = "message_reaction";
    static MESSAGE_REACTION_COUNT = "message_reaction_count";
    static INLINE_QUERY = "inline_query";
    static CHOSEN_INLINE_RESULT = "chosen_inline_result";
    static CALLBACK_QUERY = "callback_query";
    static SHIPPING_QUERY = "shipping_query";
    static PRE_CHECKOUT_QUERY = "pre_checkout_query";
    static PURCHASED_PAID_MEDIA = "purchased_paid_media";
    static POLL = "poll";
    static MY_CHAT_MEMBER = "my_chat_member";
    static CHAT_MEMBER = "chat_member";
    static CHAT_JOIN_REQUEST = "chat_join_request";
    static CHAT_BOOST = "chat_boost";
    static REMOVED_CHAT_BOOST = "removed_chat_boost";
    static ALL = Object.values(UpdateType).filter(value => typeof value === "string");
};

/**
 * Tell the user that something is happening on the bot's side
 */
const ChatAction = {
    /**
     * `TYPING` for text messages.
     */
    TYPING: "typing",
    /**
     * `upload_photo` for photos.
     */
    UPLOAD_PHOTO: "upload_photo",
    /**
     * `record_video` or `upload_video` for videos.
     */
    RECORD_VIDEO: "record_video",
    /**
     * `record_video` or `upload_video` for videos.
     */
    UPLOAD_VIDEO: "upload_video",
    /**
     * `record_voice` or `upload_voice` for voice notes.
     */
    RECORD_VOICE: "record_voice",
    /**
     * `record_voice` or `upload_voice` for voice notes.
     */
    UPLOAD_VOICE: "upload_voice",
    /**
     * `upload_document` for general files.
     */
    UPLOAD_DOCUMENT: "upload_document",
    /**
     * `choose_sticker` for stickers.
     */
    CHOOSE_STICKER: "choose_sticker",
    /**
     * `find_location` for location data.
     */
    FIND_LOCATION: "find_location",
    /**
     * `record_video_note` or `upload_video_note` for video notes.
     */
    RECORD_VOICE_NOTE: "record_video_note",
    /**
     * `record_video_note` or `upload_video_note` for video notes.
     */
    UPLOAD_VOICE_NOTE: "upload_video_note"
};

/**
 * Parse mode determines how the text in messages is formatted.
 */
const ParseMode = {
    /**
     * Use HTML tags. Only the following are allowed: 
     * 
     * `b`, `i`, `code`, `pre`, `a href`, `s`, `del`, `u`, `span class="tg-spoiler"`, `tg-spoiler`, `tg-emoji emoji-id`, `pre code class="language-{language}"`, `blockquote`, `blockquote expandable`.
     * 
     * @see {@link https://core.telegram.org/bots/api#html-style|**Telegram Bot API**}
     */
    HTML: "HTML",
    /**
     * Use Markdown. Only the following are allowed:
     * 
     * - \*\*: bold
     * - _ _: italic
     * - [url]\(https://\): inline url
     * - \`\`: inline fixed-width code
     * - \`\`\` \`\`\`: pre-formatted fixed-width code (you can specify the language).
     * 
     * Note that escaping is __not__ allowed inside entities, so they must be opened and closed first.
     * @see {@link https://core.telegram.org/bots/api#markdown-style|**Telegram Bot API**}
     */
    Markdown: "Markdown",
    /**
     * Use Markdown V2. Only the following are allowed:
     * - \*\*: bold
     * - _ _: italic
     * - __ __: underline
     * - ~ ~: strikethrough
     * - || ||: spoiler
     * - [url]\(https://\): inline url
     * - ![emoji]\(tg://emoji?id=\): emoji
     * - \`\`: inline fixed-width code
     * - \`\`\` \`\`\`: pre-formatted fixed-width code (you can specify the language).
     * - \>: blockquote
     * - \*\*\> ||: expandable blockquote (end with double line, you can write on multiple lines with \>).
     * 
     * Any character with code between 1 and 126 in markdown V2 can be escaped with the \\ character.
     * 
     * @see {@link https://www.eso.org/~ndelmott/ascii.html|**ASCII Character Chart**}
     * @see {@link https://core.telegram.org/bots/api#markdownv2-style|**Telegram Bot API**}
     */
    MarkdownV2: "MarkdownV2"
};

/**
 * Message filters.
 */
class Filters {
    /**
     * @param {number} NONE - No filters.
     */
    static NONE = 0;
    /**
     * @param {number} TEXT - Represent a text message.
     */
    static TEXT = 1 << 0;
    /**
     * @param {number} PHOTO - Represent a message containing a photo.
     */
    static PHOTO  = 1 << 1;
    /**
     * @param {number} VIDEO - Represent a message containing a video.
     */
    static VIDEO = 1 << 2;
    /**
     * @param {number} DOCUMENT - Represent a message containing a document.
     */
    static DOCUMENT = 1 << 3;
    /**
     * @param {number} COMMAND - Represent a message starting with a command (e.g. `/command TEXT`).
     */
    static COMMAND = 1 << 4;
    /**
     * @param {number} MEDIA_GROUP - Represent a message containing a media group.
     */
    static MEDIA_GROUP = 1 << 5;
    /**
     * @param {number} FORWARDED - Represent a forwarded message.
     */
    static FORWARDED = 1 << 6;
    /**
     * @param {number} ALL - Represent any kind of message.
     */
    static ALL = Filters.TEXT | Filters.PHOTO | Filters.VIDEO | Filters.DOCUMENT | Filters.COMMAND | Filters.MEDIA_GROUP | Filters.FORWARDED;

    /**
     * Regex pattern.
     * @param {RegExp} pattern 
     * @returns 
     */
    static regex(pattern) {
        return (update) => {
            if (!update.message || typeof update.message.text !== 'string') {
                return false;
            }
            return pattern.test(update.message.text);
        };
    }
    
}

/**
 * Message effect IDs that show up when the message is received.
 */
const MessageEffect = {
    /**
     * 🔥 Fire animation.
     */
    FIRE: "5104841245755180586",
    /**
     * 👍🏻 Thumbs up animation.
     */
    THUMBS_UP: "5107584321108051014",
    /**
     * ❤️ Hearts animation.
     */
    HEART: "5159385139981059251",
    /**
     * 🎉 Party animation.
     */
    PARTY: "5046509860389126442",
    /**
     * 👎🏻 Thumbs down animation.
     */
    THUMBS_DOWN: "5104858069142078462",
    /**
     * 💩 Poop animation.
     */
    POOP: "5046589136895476101"
}

export {
    ChatAction,
    ParseMode,
    MessageEffect,
    Filters,
    Permissions,
    UpdateType
}