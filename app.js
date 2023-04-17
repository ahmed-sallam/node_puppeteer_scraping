const puppeteer = require('puppeteer');
const XLSX = require('xlsx');

// get the product page link from the command line argument
// example
// https://www.aliexpress.us/item/1005005452757962.html
const productPageLink = process.argv[2];

// check if the product page link is provided
if (!productPageLink) {
  console.error('Please provide the AliExpress product page link as a command line argument.');
  process.exit(1);
}
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(productPageLink, { waitUntil: 'networkidle2' });
    const productNames = await page.$$eval('.product-title-text', elements => elements.map(el => el.textContent.trim()));
  
    // create an Excel workbook and add the product names to a sheet
    const workbook = XLSX.utils.book_new();
    const sheetName = 'Product Names';
    const worksheet = XLSX.utils.aoa_to_sheet([productNames]);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, 'product-names.xlsx');
    console.log('Product names saved to product-names.xlsx');
  
    await browser.close();
  })();