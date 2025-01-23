# Vote Notification Bot

A simple Node.js script to monitor server votes from https://serverlist.gg/ and send notifications to a Discord webhook when a new vote is detected. This tool is designed to help server owners stay informed about voting activity on their servers.

## Features
- Fetches recent votes from the server list API.
- Tracks voters to avoid duplicate notifications.
- Sends notifications to a Discord webhook when a new vote is detected.

## Requirements
- Node.js (version 14 or higher recommended)
- NPM (comes with Node.js installation)

## Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/Korivash/Servergg-Vote-Tracker
   cd vote-notification-bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `database.json` file in the root directory:
   ```bash
   echo "{}" > database.json
   ```

4. Update the following variables in the `index.js` file:
   - `votesPageUrl`: URL of the server votes API.
   - `webhookUrl`: Your Discord webhook URL.
   - `apiKey`: API key for the server list (if applicable).

## Usage
1. Start the bot:
   ```bash
   npm start
   ```

2. The script will:
   - Check for new votes every 5 minutes (configurable).
   - Send notifications for new voters to the specified Discord webhook.

## Example Notification
When a new vote is detected, a message is sent to the Discord webhook in the following format:
```
New voters detected:
[Steam Profile](https://steamcommunity.com/profiles/76561198060997349)
[Steam Profile](https://steamcommunity.com/profiles/76561198302178778)
```

## Developer
This project was developed by [Korivash](https://github.com/korivash).

## License
This project is licensed under the ISC License. Feel free to modify and share!

