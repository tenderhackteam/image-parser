const express = require("express");
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
app.use(cors())

const corsOptions = {
	origin: '*'
};

app.get("/getImage", cors(corsOptions), async (request, response) => {
    const image_id = request.query.image_id;
	const url = `https://zakupki.mos.ru/sku/view/${image_id}`;

	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto(url);
		await page.waitForSelector('.image-gallery-slides > div > div > img');

		await page.evaluateHandle(() => {
			return document.querySelector('.image-gallery-slides > div > div > img').src;
		}).then(data => response.send(data._remoteObject.value))
		.catch(err => response.sendStatus(500));
		page.close();
	} catch {
		response.sendStatus(500);
	}
});

app.listen(3001);