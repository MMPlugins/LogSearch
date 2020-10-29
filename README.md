# Log search plugin for [Dragory's ModMail](https://github.com/dragory/modmailbot)

### Setup:
Make sure your running at least v3.0.3 of Modmail.
in your config.ini file, make a new line and add:  
```ini
plugins[] = npm:MMPlugins/LogSearch
```
Restart your bot!

### Usage

Use `[prefix]logsearch things to search...` (by default, your prefix is !) in any thread to search through the given users logs.
The bot will send a list with all logs from the user that contain what you searched for.
