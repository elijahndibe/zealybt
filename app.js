const express = require('express');
const puppeteer = require('puppeteer');
const schedule = require('node-schedule');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3030;

// Hard-coded selector
const BUTTON_SELECTOR = 'button[data-testid="claim-button"]';

// Middleware
app.use(express.static('public')); // Serve static files from 'public' folder
app.use(bodyParser.json());

// Function to claim the quest
async function claimQuest(url) {
    const browser = await puppeteer.launch({ headless: false }); // Set headless to true for no UI
    const page = await browser.newPage();

    // Navigate to the provided quest URL
    await page.goto(url);

    // Click the claim button
    await page.click(BUTTON_SELECTOR);

    console.log('Quest claimed successfully!');

    await browser.close();
}

// Endpoint to schedule the quest claim
app.post('/schedule', (req, res) => {
    const { url, time } = req.body;
    const [hour, minute] = time.split(':').map(num => parseInt(num, 10));
    const scheduleTime = `0 ${minute} ${hour} * * *`; // Cron format

    schedule.scheduleJob(scheduleTime, () => {
        console.log(`Claiming quest at ${time}`);
        claimQuest(url).catch(console.error);
    });

    res.json({ message: `Quest claim scheduled at ${time}` });
});

app.listen(port, () => {
    console.log(`Server running port ${port}`);
});

