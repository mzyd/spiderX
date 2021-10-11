const https = require('https')
const cheerio = require('cheerio')
const fs = require('fs')
const { request } = require('./request')

function start(n) {
  if (n === 0) return
  const limit = 25
  n -= 1
  let startIndex = n * limit
  let url = `https://movie.douban.com/top250?start=${startIndex}&filter=`
  request(url).then(res => {
    const $ = cheerio.load(res)
    let allTheFilms = []
    // let arr = $('li .item')
    $('li .item').each(function() {
      // this 循环时 指向当前这个电影
      // 当前这个电影下面的title
      // 相当于this.querySelector
      const title = $('.title', this).text();
      const star = $('.rating_num', this).text();
      const pic = $('.pic img', this).attr('src');
      // console.log(title, star, pic);
      // 存 数据库
      // 没有数据库存成一个json文件 fs
      allTheFilms.push({
        title, star, pic
      })
    })

    fs.writeFile('./films.json', JSON.stringify(allTheFilms), function(err) {
      if(!err){
        console.log('文件写入完毕');
      }
    })

    downloadImage(allTheFilms, startIndex)

    if (n >= 0) {
      start(n)
    }
  }).catch(err => {
    console.log('ERR: ', err)
  })
}

start(4)

// 4
// i = 0 ; i < 25; n = 75

function downloadImage(allFilms, n) {
  for(let i = 0; i < allFilms.length; i++){
    console.log(`第${n+i}张图片开始下载`)
    const picUrl = allFilms[i].pic
    // fs.writeFile('./xx.png','内容')
    https.get(picUrl, function(res){
      res.setEncoding('binary')
      let str = ''
      res.on('data', function(chunk) {
        str += chunk
      })
      res.on('end', function(){
        fs.writeFile(`./fuss-images/${n + i}.png`,str,'binary',function(err){
          if(!err){
            // console.log(`第${n+i}张图片下载成功`)
          }
        })
      })
    })
  }
}

