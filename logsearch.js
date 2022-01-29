module.exports = function ({ knex, commands, logs, threads, config }) {
  const logsAreLinks = config.logStorage === "local" ? true : false;

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

    if (logsAreLinks) {
      for (const matchingThread of matchingMessages) {
        if (handledUrls.includes(matchingThread.thread_id)) continue;
        handledUrls.push(matchingThread.thread_id);

        const urlThread = await threads.findById(matchingThread.thread_id);
        formatted += `${await logs.getLogUrl(urlThread)} (Thread #${matchingThread.thread_number}, ${urlThread.user_name})\n`;
      }
    } else {
      for (const matchingThread of matchingMessages) {
        if (handledUrls.includes(matchingThread.thread_id)) continue;
        handledUrls.push(matchingThread.thread_id);

        formatted += `Thread #${matchingThread.thread_number} (${matchingThread.user_name})\n`;
      }
    }

    if (matchingMessages.length === 0) {
      msg.channel.createMessage({
        content: `No logs contain the text \`${toSearch}\``,
        messageReferenceID: msg.id,
      });
    } else {
      let toSend = `The following ${handledUrls.length} logs contain the text \`${toSearch}\`:\n${formatted}`;
      toSend = toSend.match(/(.|[\r\n]){1,1900}[\n$]/g);

      for (const chunk of toSend) {
        msg.channel.createMessage({ content: chunk });
      }
    }
  };

  commands.addInboxServerCommand(
    "logsearch",
    [
      { name: "userId", type: "string", required: true },
      { name: "toSearch", type: "string", required: true, catchAll: true },
    ],
    actualLogsearchCommand
  );
  commands.addInboxThreadCommand(
    "logsearch",
    [{ name: "toSearch", type: "string", required: true, catchAll: true }],
    actualLogsearchCommand
  );
};
