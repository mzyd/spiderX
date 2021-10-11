// const https = require('https')
// const http = require('http')
const cheerio = require('cheerio')
const fs = require('fs')
const { http } = require('./request')
const downloadImage = require('./download')

// 煎蛋分页格式 20211011-129, 日期-页码, 然后 base64

const reg = /\d{4}-\d{2}-\d{2}/
let date = new Date()
date = date.toISOString().split('T')[0]
date = reg.exec(date)[0]
var page = '2'


// http.get('http://tva1.sinaimg.cn/large/002oJcAwgy1gv4ix3y2nfj60tz0x4wgj02.jpg', function(res){
//   let html = ''
//   res.on('data', function(chunk){
//     html += chunk
//   })
//   res.on('end', function() {
//     console.log('html--', html)
//     resolve(html)
//   })
// })


function start() {

  if (!date) {
    return console.error('Err: date is null')
  }

  const buff = Buffer.from(date + page, 'utf-8');
  const datepage = buff.toString('base64').replace(/=/, '')
  const url = `http://jandan.net/pic/${datepage}#comments`

  http(url).then(res => {
    const $ = cheerio.load(res)
    let elems = []
    $('li .row').each(function() {
      const pic = $('.text p a', this).attr('href').replace(/^\/\//, '')
      elems.push({ pic })
    })
    downloadImage(elems, './fuss-jandan')
  })
}
start()
