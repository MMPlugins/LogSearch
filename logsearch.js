module.exports = function ({ knex, commands, logs, threads }) {
    commands.addInboxThreadCommand("logsearch", [{ name: "toSearch", type: "string", "required": true, "catchAll": true}], async (msg, args, thread) => {
        const toSearch = args["toSearch"];

        const matchingMessages = await knex
            .distinct("*")
            .from("thread_messages")
            .innerJoin("threads", "threads.id", "thread_messages.thread_id")
            .where("threads.user_id", thread.user_id)
            .where("body", "like", `%${toSearch}%`)
            .whereNot("message_type", 1)
            .whereNot("message_type", 6)
            .whereNot("message_type", 7);

        let formatted = "";
        const handledUrls = [];
        for (const matchingThread of matchingMessages) {
            if (handledUrls.includes(matchingThread.thread_id)) continue;
            handledUrls.push(matchingThread.thread_id);

            const urlThread = await threads.findById(matchingThread.thread_id);
            formatted += `\n${await logs.getLogUrl(urlThread)}`;
        }

        thread.postSystemMessage(`The following ${handledUrls.length} logs contain the text \`${toSearch}\`:${formatted}`);
    });
}