const puppeteer =  require('puppeteer')
const { mn } = require('./config/default')
const srcToImg = require('./help/srcToimg');

(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://image.baidu.com')
  console.info('进入百度图片')
  await page.setViewport({
    width: 1920,
    height: 10800
  })

  await page.focus('#kw')
  console.info('ss')
  await page.keyboard.sendCharacter('sexy')
  await page.click('.s_search')
  console.info('去详情列表页')
  page.on('load', async () => {
    console.info('加载中，请稍后')
    const srcs = await page.evaluate(() => {
      const images = document.querySelectorAll('img.main_img')
      return Array.prototype.map.call(images, img => img.src)
    })
    console.info(`获得 ${srcs.length} 图片，开始爬`)
    srcs.forEach(async (src) => {
      await page.waitFor(1000)
      await srcToImg(src, mn)
    })
    await browser.close()
  })

})()
