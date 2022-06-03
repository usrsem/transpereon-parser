import puppeteer from 'puppeteer';
import { zip } from "./functools.js";
import { url } from "./config.js";
import { sleep } from "./time.js";
import { get_cookies } from "./cookies_loader.js";


async function main() {
  const browser = await puppeteer.launch({ headless: false });
  let cookies = await get_cookies();

  console.log("Loading page");
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setCookie(...cookies);
  await page.goto(url, { waitUntil: "networkidle2" });

  console.log("Loading table");
  await page
    .waitForSelector(".taF3.gxHeaderRow.taLK>.taG3>table>tbody>tr.taE3>td");


  console.log("Loading titles");
  let titles = await page.evaluate(() => {
    let selector = ".taF3.gxHeaderRow.taLK>.taG3>table>tbody>tr.taE3>td"
    let rows = Array.from(document.querySelectorAll(selector));
    return rows.map(td => td.innerText)
  });

  await sleep(1);

  console.log("Starting table parsing");
  for (let i = 0; i < 1000; ++i) {
    let data = await page.evaluate(() => {
      let selector = "table.taKJE.gridData>tbody>tr";

      let data = Array.from(document.querySelectorAll(selector))
        .map(row => Array.from(row.children)
          .filter(td => Array.from(td.classList).includes("taGJE"))
          .map(td => td.innerText));

      return data;
    });

    
    let result = data.map(row => zip(titles, row));
    console.log(result[-1]);

    await sleep(1);
  }
}

(async () => { await main() })();

