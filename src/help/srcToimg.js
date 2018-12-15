const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const writeFile = promisify(fs.writeFile)
const uuid = require('node-uuid')

module.exports = async(src, dir) => {
  if(/\.(jpg|png|gif)$/.test(src)) {
    await urlToImg(src, dir)
  } else {
    await base64ToImg(src, dir)
  }
}


/*
 url => img
 */
const urlToImg = promisify((url, dir, callback) => {
  // 判断连接是http请求还是https请求
  const mod = /^https:/.test(url) ? https : http
  // 获得拓展名 jpg、png、gif
  const ext = path.extname(url)
  // 拼接文件名
  const file = path.join(dir, `${uuid.v1()}${ext}`)
  mod.get(url, res => {
    res.pipe(fs.createWriteStream(file))
      .on('finish', () => {
        callback()
        console.info(file)
      })
  })
})

const base64ToImg = async (base64Str, dir) => {
  // data:image/jpeg;base64,/asdasdsdas...
  const matches = base64Str.match(/^data:(.+?);base64,(.+)$/)
  try {
    const ext = matches[1].split('/')[1].replace('jpeg', 'jpg')
    const file = path.join(dir, `${uuid.v1()}.${ext}`)
    const content = matches[2]
    await writeFile(file, content, 'base64')
    console.info(file)
  } catch (error) {
    console.info('非法base64')
  }
}
