import express from "express";
import fs from "fs";
import chrome from "selenium-webdriver/chrome.js";
import cors from "cors";
import { Builder, By, until } from "selenium-webdriver";

const app = express();
const port = 3000;
app.use(cors());

async function scrapeData() {
  let options = new chrome.Options();

  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    const url = "https://nepsealpha.com/investment-calandar/ipo";
    await driver.get(url);

    await driver.wait(until.elementLocated(By.css("table.table")), 10000);

    let rows = await driver.findElements(By.css("table.table tbody tr"));
    let tableData = [];
    for (let i = 0; i < 3 && i < rows.length; i++) {
      let row = rows[i];
      let columns = await row.findElements(By.css("td"));
      let rowData = [];

      for (let column of columns) {
        let text = await column.getText();
        rowData.push(text);
      }
      tableData.push(rowData);
    }
    return tableData;
  } catch (e) {
    console.error(`An error occurred: ${e}`);
    throw e;
  } finally {
    await driver.quit();
  }
}

app.post("/scrape-data", async (req, res) => {
  try {
    const data = await scrapeData();
    res.json(data);
  } catch (e) {
    res
      .status(500)
      .json({ error: "An error occurred while scraping the data." });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
