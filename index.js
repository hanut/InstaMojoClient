const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const DOWNLOAD_PATH = process.cwd() + path.sep + '.tmp' + path.sep;
if(!fs.existsSync(DOWNLOAD_PATH)) {
  fs.mkdirSync(DOWNLOAD_PATH);
}

function checkDownloadStatus(filename) {
  return new Promise((resolve, reject) => {
    try {
      let pathString = DOWNLOAD_PATH + filename;
      let fwatchInterval = null;
      fs.watchFile(pathString, (curr, prev) => {
        // console.log(`the current is: ${curr}`);
        // console.log(`the previous was: ${prev}`);
        if(fwatchInterval) {
          clearInterval(fwatchInterval);
        }
        fwatchInterval = setInterval(function() {
          clearInterval(fwatchInterval);
          resolve(pathString);
        }, 5000);
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = async function(year, month, username, password) {
  year = year || '';
  month = month || '';
  username = username || '';
  password = password || '';
  if(year === '') {
    throw new Error('Year is a required parameter');
  }
  if(month === '') {
    throw new Error('Month is a required parameter');
  }
  if(username === '' || password === '') {
    throw new Error('missing username or password');
  }
  try {
    const browser = await puppeteer.launch({dumpio: false, headless: true});
    // console.log(await browser.version() + ' started');
    const page = await browser.newPage();
    await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: DOWNLOAD_PATH})
    await page.goto('https://www.instamojo.com');
    // console.log('page loaded....click login')
    await page.click('.js-login-trigger');
    // console.log('clicked login');
    await page.$eval('#id_login_username', (ele, username) => {
      ele.value = username;
    }, username);
    await page.$eval('#id_login_password', (ele, password) => {
      ele.value = password;
    }, password);
    // console.log('login form populated');
    let navPromise = page.waitForNavigation();
    await page.$eval('#loginForm #submit', (ele) => ele.click());
    await navPromise;
    navPromise = page.waitForNavigation({waitUntil: 'networkidle2'});
    await page.goto('https://www.instamojo.com/payouts');
    await navPromise;
    // console.log('Payouts page loaded');
    await page.click('.btn.btn-block.push--right');
    // console.log('Invoices Dialog opened');
    let result = await page.$eval('ul.list-zebra--table', (element, data) => {
      const cYear =  data.year;
      const cMonth =  data.month;
      let list = element.querySelectorAll('li');
      if (list.length < 2) {
        return false;
      }
      let foundIndex = -1;
      for(let i=list.length - 1;i >= 0; i--){
        let issueDate = list[i].querySelector('.row .columns').innerText;
        if (issueDate === 'Issue Date') {
          continue;
        }
        issueDate = new Date(issueDate);
        let year = issueDate.getUTCFullYear();
        let month = issueDate.getUTCMonth() + 1;
        if(cYear === year && cMonth === month) {
          foundIndex = i;
        }
      }
      if(foundIndex === -1) {
        return false;
      }
      let invoiceId = (list[foundIndex].querySelector('a.payouts-invoice-id')).innerText;
      // console.log('invoice id: ' + invoiceId);
      aLink = document.createElement('a');
      aLink.href=`https://www.instamojo.com/invoices/${invoiceId}`;
      let filename = 'InstaMojo_report_'+ ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'][cMonth - 1] + '_' + cYear + '_'
        + Date.now() + '.pdf';
      aLink.download = filename;
      aLink.click();
      return filename;
    }, {year: year, month: month});
    if(!result){
      throw new Error('report not found');
    }
    // console.log(result);
    let reportPath = await checkDownloadStatus(result);
    await browser.close();
    return reportPath;
  } catch(error) {
    console.log(error);
    await browser.close();
    throw error;
  }
}
