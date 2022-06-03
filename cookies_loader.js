import puppeteer from 'puppeteer';
import { promises as fs } from "fs";
import { cookies_path, url, login } from "./config.js";

export async function get_cookies() {
  if (await exists(cookies_path)) {
    return await load_cookies_from_file();
  }

  const browser = await puppeteer.launch();
  let cookies = await load_cookies_from_web(browser);
  await save_cookies(cookies);
  return cookies;
}


async function exists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function load_cookies_from_file() {
  console.log("Loading cookies from file")
  let cookies_string = await fs.readFile(cookies_path);
  return JSON.parse(cookies_string);
}

async function load_cookies_from_web(browser) {
  console.log("Loading cookies from browser");
  let page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  await page.type("#emailForm_email-input", login);
  await page.type("#emailForm_password-input", confog.password);

  await page.click("div.GJ3UU4RBDND.GJ3UU4RBAOD");
  await page.waitForNavigation();

  let cookies = await page.cookies();
  await page.close();

  return cookies;
}

async function save_cookies(cookies) {
  await fs.writeFile(cookies_path, JSON.stringify(cookies, null, 2));
}

