# Log search plugin for [Dragory's ModMail](https://github.com/dragory/modmailbot)

## Description
This plugin allows everyone with permission to use the MM bot to search through the logs of a specified user or all logs ever created.  
If the command is run in a thread, the user it is with will always be taken as the search target.  
Please read [the documentation below](#usage) to learn how the commands work!  

## Attention
This plugin only works if your logStorage is set to local as the plugin only relays the log links, NOT log files.

### Setup:
Make sure your running at least v3.3.2 of Modmail.
in your config.ini file, make a new line and add:  
```ini
plugins[] = npm:MMPlugins/LogSearch
```
Restart your bot!

## Usage
Any system messages and commands are not taken into account when searching and are ignored.  
`userId` needs to be the users proper ID, obtainable in [developer mode](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-).

#### In A Thread
Signature: `logsearch <search query>`  
This will return a list of all logs that contain what you searched for.  
The search will be executed for the current threads user.

#### In The Inbox Server
Signature: `logsearch <userId> <search query>`  
This will return a list of all logs that contain what you searched for.  
The search will be executed for the userId you pass to the command.  
  
Signature: `logsearch global <search query>`  
This will return a list of all logs that contain what you searched for.  
The search will be executed globally, checking every log ever created.
