const { promisify } = require('util');
const puppeteer = require('puppeteer');
const fs = require('fs');
const delay = promisify(setTimeout);
const pageScroll = require('./page-scroll');

var newsItems = [
    {
        "href": "https://en.prothomalo.com/bangladesh/53w9yack4a",
        "headline": "Bangladesh loses remittance worth Tk 750b in hundi: CID",
        "date": "08 Sep 2022"
    },
    {
        "href": "https://en.prothomalo.com/bangladesh/53w9yack4a",
        "headline": "Bangladesh loses remittance worth Tk 750b in hundi: CID",
        "date": "08 Sep 2022"
    },
    {
        "href": "https://en.prothomalo.com/bangladesh/53w9yack4a",
        "headline": "Bangladesh loses remittance worth Tk 750b in hundi: CID",
        "date": "08 Sep 2022"
    },
    {
        "href": "https://en.prothomalo.com/bangladesh/53w9yack4a",
        "headline": "Bangladesh loses remittance worth Tk 750b in hundi: CID",
        "date": "08 Sep 2022"
    },
    {
        "href": "https://en.prothomalo.com/bangladesh/53w9yack4a",
        "headline": "Bangladesh loses remittance worth Tk 750b in hundi: CID",
        "date": "08 Sep 2022"
    },
    {
        "href": "https://en.prothomalo.com/bangladesh/53w9yack4a",
        "headline": "Bangladesh loses remittance worth Tk 750b in hundi: CID",
        "date": "08 Sep 2022"
    },
    {
        "href": "https://en.prothomalo.com/bangladesh/53w9yack4a",
        "headline": "Bangladesh loses remittance worth Tk 750b in hundi: CID",
        "date": "08 Sep 2022"
    },
  ];

  
(async () => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto('https://en.prothomalo.com/topic/Money-laundering')
    await loadAllContent(page)
    var newsItems = await scrapNewsMeta(page)
    var data = await scrapNewsDetails(page, newsItems)
    saveToJSON(data)
    await browser.close()
})().catch((error) => {
    console.error("the message is " + error.message)
})


async function loadAllContent(page) {
    console.log('Load More Started')
    while(await page.$('.load-more-content') !== null) {
        await page.click(".load-more-content");
        await delay(800);
    }
    console.log('Load More Done')
}

async function scrapNewsMeta(page) {
    console.log('Meta Data Scrapping started')
    const data = await page.$$eval('.left_image_right_news', async function(options) {
        return options.map(function(option) {
            return {
                'href': option.querySelector('.card-with-image-zoom').getAttribute('href'),
                'headline': option.querySelector('.headline-title').innerText,
                'date': option.querySelector('.published-time').innerText,
            }
        }) 
    })
    console.log('Meta Data Scrapping done')
    return data
}

async function scrapNewsDetails(page, newsItems) {
    console.log('Details Scrapping started')

    for (const newsMeta of newsItems) {

        console.log(`Geeting details for ${newsMeta.href}`)
        await page.goto(newsMeta.href, {waitUntil: 'load', timeout: 0})
        await pageScroll.autoScroll(page, 300)

        newsMeta['headline'] = await page.$eval('.storytitleInfo-m__story-headline__30dXX', function(option) {
            return option.innerText
        })
        newsMeta['content'] = await page.$$eval('p', function(options) {
            return options.map(function(option) {
                return option.innerText
            })
        })

        if(await page.$('.qt-image') !== null) {
            newsMeta['image'] =  await page.$eval('.qt-image', function(option) {
                return option.src
            })
        }
    }
   
    console.log('Total ' + newsItems.length + ' Item Found')
    return newsItems
}

function saveToJSON(data) {
    const stringData = JSON.stringify(data, null, 4);
    fs.writeFile('data.json', stringData, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
}
