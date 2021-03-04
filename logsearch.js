module.exports = function ({ knex, commands, logs, threads }) {
    const actualLogsearchCommand = async (msg, args, thread) => {
        const userIdToSearch = args.userId || (thread && thread.user_id);
        let globalSearch = false;
        if (userIdToSearch === "global") {
            globalSearch = true;
        }
        const toSearch = args["toSearch"];

        let matchingMessages;
        if (globalSearch) {
            matchingMessages = await knex
            .distinct("*")
            .from("thread_messages")
            .innerJoin("threads", "threads.id", "thread_messages.thread_id")
            .where("body", "like", `%${toSearch}%`)
            .whereNot("message_type", 1)
            .whereNot("message_type", 6)
            .whereNot("message_type", 7);
        } else {
            matchingMessages = await knex
            .distinct("*")
            .from("thread_messages")
            .innerJoin("threads", "threads.id", "thread_messages.thread_id")
            .where("threads.user_id", userIdToSearch)
            .where("body", "like", `%${toSearch}%`)
            .whereNot("message_type", 1)
            .whereNot("message_type", 6)
            .whereNot("message_type", 7);
        } 

        let formatted = "";
        const handledUrls = [];
        for (const matchingThread of matchingMessages) {
            if (handledUrls.includes(matchingThread.thread_id)) continue;
            handledUrls.push(matchingThread.thread_id);

            const urlThread = await threads.findById(matchingThread.thread_id);
            formatted += `\n${await logs.getLogUrl(urlThread)}`;
        }

        if (thread) {
            if (matchingMessages.length === 0) {
                thread.postSystemMessage(`No logs from this user contain the text \`${toSearch}\``);
            } else {
                thread.postSystemMessage(`The following ${handledUrls.length} logs contain the text \`${toSearch}\`:${formatted}`);
            }
        } else {
            if(matchingMessages.length === 0) {
                msg.channel.createMessage(`No logs from this user contain the text \`${toSearch}\``);
            } else {
                msg.channel.createMessage(`The following ${handledUrls.length} logs contain the text \`${toSearch}\`:${formatted}`);
            }
        }
    };

    commands.addInboxServerCommand("logsearch", [{ name: "userId", type: "string", required: true}, { name: "toSearch", type: "string", "required": true, "catchAll": true }], actualLogsearchCommand);
    commands.addInboxThreadCommand("logsearch", [{ name: "toSearch", type: "string", "required": true, "catchAll": true }], actualLogsearchCommand);
}