const express = require('express');
const puppeteer = require('puppeteer');
const schedule = require('node-schedule');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Hard-coded selector
const BUTTON_SELECTOR = 'button[data-testid="claim-button"]';

// Middleware
app.use(express.static('public')); // Serve static files from 'public' folder
app.use(bodyParser.json());

// Function to claim the quest
async function claimQuest(url) {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        console.log(`Navigating to ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2' });

        console.log('Waiting for claim button to be visible');
        await page.waitForSelector(BUTTON_SELECTOR, { visible: true });

        console.log('Clicking the claim button');
        await page.click(BUTTON_SELECTOR);

        console.log('Quest claimed successfully!');
        await browser.close();
    } catch (error) {
        console.error('Error claiming quest:', error);
    }
}

// Endpoint to schedule the quest claim
app.post('/schedule', (req, res) => {
    const { url, time } = req.body;
    const [hour, minute] = time.split(':').map(num => parseInt(num, 10));
    const scheduleTime = new Date();

    scheduleTime.setHours(hour);
    scheduleTime.setMinutes(minute);
    scheduleTime.setSeconds(0);

    console.log(`Scheduling quest claim at ${scheduleTime}`);

    schedule.scheduleJob(scheduleTime, () => {
        console.log(`Running scheduled job at ${new Date()}`);
        claimQuest(url).catch(console.error);
    });

    res.json({ message: `Quest claim scheduled at ${time}` });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
