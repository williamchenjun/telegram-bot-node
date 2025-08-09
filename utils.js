/* Functions that are not inherently part of Telegram bots. These are used for convenience. */
import { Update, Context } from "./base.js";
import { Permissions } from "./constants.js";

function filterObject(obj){
    return Object.fromEntries(
        Object.entries(obj).filter(([key, value]) => value !== null && value !== undefined)
    );
}

/**
 * 
 * @param {Permissions} requiredPermissions 
 * @returns 
 */
function accessControl(requiredPermissions = 0) {
    return (handler) => async (/**@type {Update}*/update, /**@type {Context}*/context) => {
        const userId = update.effective_user?.id;
        const admins = await context.bot.getChatAdministrators({chat_id: update.effective_chat.id});
        let userPermissions = 0;

        if (admins?.find(admin => admin?.status === "creator" && admin?.user.id === userId)) {
            userPermissions |= Permissions.OWNER;
        }

        if (admins?.find(admin => admin?.status === "administrator" && admin?.user.id === userId)){
            userPermissions |= Permissions.ADMIN;
        }

        userPermissions |= Permissions.ALL;

        const hasAccess = (userPermissions & requiredPermissions) > 0;

        if (hasAccess) {
            return handler(update, context);
        }

        // Deny Access
        await denyAccess(update, "You do not have the necessary permission to perform this action.")
    };
}

/**
 * Helper to send a denied access message.
 */
async function denyAccess(update, reason) {
    await update.effective_chat.sendMessage({
        text: `<b>Access Denied</b>\n${reason}`,
    });
}

function parseCommand(input) {
    const commandRegex = /^\/(\S+)(?:\s+(.*))?$/;
    const match = input.match(commandRegex);
    if (!match) return [];
    const argsPart = match[2] || '';

    // Updated regex to handle both curly quotes (“ ”) and straight quotes (" ")
    const tokenRegex = /“([^”]*)”|"(.*?)"|(\S+)/g;  // Matches both curly and straight quotes
    const args = [];
    let tokenMatch;

    while ((tokenMatch = tokenRegex.exec(argsPart)) !== null) {
        const arg = tokenMatch[1] !== undefined ? tokenMatch[1] :
                    tokenMatch[2] !== undefined ? tokenMatch[2] :
                    tokenMatch[3];
        args.push(arg);
    }

    return args;
}

export {
    filterObject,
    accessControl,
    denyAccess,
    parseCommand
}