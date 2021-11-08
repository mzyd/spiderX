const cheerio = require('cheerio')
const { http, request } = require('./request')
const downloadImage = require('./download')

// 煎蛋分页格式 20211011-129, 日期-页码, 然后 base64

const reg = /\d{4}-\d{2}-\d{2}/
let date = new Date()
date = date.toISOString().split('T')[0]
date = reg.exec(date)[0].replace(/-/g, '')
var page = '-138'

function start() {

  if (!date) {
    return console.error('Err: date is null')
  }

  // https://wx2.sinaimg.cn/mw1024/7dd42f11ly1gw42rd7u0ug20c006ou0y.gif
  const pageFromTer = process.argv[2]
  if (pageFromTer && /\d+/.test(pageFromTer) && pageFromTer > 0) {
    page = '-' + process.argv[2]
  }

  const buff = Buffer.from(date + page, 'utf-8');
  let datepage = buff.toString('base64').replace(/=/, '')
  let url = `http://jandan.net/pic/${datepage}#comments`

  if (pageFromTer.includes('https') && pageFromTer.includes('.')) {
    console.log('pppppp', pageFromTer)
    downloadImage([{ pic: pageFromTer }], './fuss-jandan')
    return
  }
  if (pageFromTer.includes('https')) {
    url = 'https://jandan.net/top-3days'
    request(url).then(res => {
      const $ = cheerio.load(res)
      let elems = []
      $('li .row').each(function() {
        const pic = $('.text p a', this).attr('href').replace(/^\/\//, '')
        elems.push({ pic })
      })
      downloadImage(elems, './fuss-jandan')
    })
    return
  }

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
