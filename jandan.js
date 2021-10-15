const cheerio = require('cheerio')
const { http } = require('./request')
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

  const pageFromTer = process.argv[2]
  if (pageFromTer && /\d+/.test(pageFromTer) && pageFromTer > 0) {
    page = '-' + process.argv[2]
  }

  const buff = Buffer.from(date + page, 'utf-8');
  let datepage = buff.toString('base64').replace(/=/, '')
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
