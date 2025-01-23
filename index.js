const axios = require('axios');
const fs = require('fs');

// Configuration
const votesPageUrl = ''; // Replace With the API page where you can see the Steam ID's
const webhookUrl = ''; // Replace with your actual webhook URL
const apiKey = ''; // Replace with your actual API key
const serverSlug = ''; // Replace with your server slug
const checkInterval = 5 * 60 * 1000; // Check every 5 minutes (300,000 milliseconds)


const databasePath = './database.json';


function readDatabase() {
  try {
    const data = fs.readFileSync(databasePath, 'utf-8');
    const database = JSON.parse(data);
    console.log('Database loaded:', database);
    return database;
  } catch (error) {
    console.error('Error reading database:', error.message);
    return {};
  }
}


function saveDatabase(database) {
  try {
    fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));
    console.log('Database saved successfully.');
  } catch (error) {
    console.error('Error saving database:', error.message);
  }
}


async function fetchRecentVoters() {
  try {
    console.log('Fetching recent voters...');
    const response = await axios.get(votesPageUrl);
    const data = response.data;

    console.log('Raw API response:', JSON.stringify(data, null, 2));

    if (data && Array.isArray(data.votes)) {
      console.log(`Fetched ${data.votes.length} voters.`);
      return data.votes;
    } else {
      console.error('Unexpected response format:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching recent voters:', error.message);
    return [];
  }
}


function isVoteValid(database, steamID) {
  const lastVoteTime = database[steamID];
  const currentTime = Date.now();
  const twelveHoursAgo = currentTime - (12 * 60 * 60 * 1000); // 12 hours ago in milliseconds

  return !lastVoteTime || lastVoteTime < twelveHoursAgo;
}


async function processVotes(voters) {
  const database = readDatabase();
  const newVoters = [];

  for (let steamID of voters) {
    if (isVoteValid(database, steamID)) {
      console.log(`New vote detected for Steam ID: ${steamID}`);
      database[steamID] = Date.now(); 
      newVoters.push(`[Steam Profile](https://steamcommunity.com/profiles/${steamID})`);
    }
  }

  if (newVoters.length > 0) {
    console.log('New voters detected. Sending to webhook...');
    await sendToWebhook(newVoters);
    saveDatabase(database); 
  } else {
    console.log('No new voters found.');
  }
}


async function sendToWebhook(voters) {
  try {
    const payload = {
      content: `New voters detected:\n${voters.join('\n')}`,
      username: 'Voter Notifier',
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const response = await axios.post(webhookUrl, payload, config);
    console.log(`Webhook response: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.error('Error sending data to webhook:', error.message);
  }
}


async function monitorAndSendVoters() {
  console.log('Checking for voters...');
  const allVoters = await fetchRecentVoters();
  if (allVoters.length > 0) {
    console.log(`Found ${allVoters.length} voters. Processing...`);
    await processVotes(allVoters);
  } else {
    console.log('No voters to process.');
  }
}


console.log(`Starting voter monitoring with an interval of ${checkInterval / 1000} seconds.`);
setInterval(monitorAndSendVoters, checkInterval);


monitorAndSendVoters();

