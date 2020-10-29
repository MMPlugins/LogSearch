# Log search plugin for [Dragory's ModMail](https://github.com/dragory/modmailbot)

### Setup:
Make sure your running at least v3.0.3 of Modmail.
in your config.ini file, make a new line and add:  
```ini
plugins[] = npm:MMPlugins/LogSearch
```
Restart your bot!

## Usage
Any system messages and commands are not taken into account when searching and are ignored.

#### In A Thread
Signature: `logsearch <search query>`  
This will return a list of all logs that contain what you searched for.
The search will be executed for the current threads user.

#### In The Inbox Server
Signature: `logsearch <userId> <search query>`  
This will return a list of all logs that contain what you searched for.
The search will be executed for the userId you pass to the command.
