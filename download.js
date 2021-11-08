const fs = require('fs')
const http = require('http')
const https = require('https')
var flag = true

function getLastImageNum(dirName) {

  // TODO: 检查有没有文件夹
  fs.access(dirName, (err) => {
    console.log('Access Err : ', err)
  })

  fs.mkdir(dirName, (err) => {
    console.log('Mkdir ERR: ', err)
  })

  const readDir = fs.readdirSync(dirName)
  if (readDir.length < 1) {
    console.error('Error: Therr is no files')
    return 0
  }
  var last = readDir.toString().replace(/\.png/g, '')
      .replace(/\.DS_Store,/, '')
      .split(',')
      .map((item) => parseInt(item))
      .sort((a, b) => a - b)
  return last[last.length - 1]
}

function downloadByHttps(pic, dirName, last) {
  https.get(pic, function(res){
    res.setEncoding('binary')
    let str = ''
    res.on('data', function(chunk) {
      str += chunk
    })
    res.on('end', function(){
      fs.writeFile(`${dirName}/${last}.png`, str, 'binary', function(err){
        if(!err){
          console.log(`第${last}张图片下载成功`)
        }
      })
    })
  })
}

module.exports = function downloadImage(list, dirName) {

  if (!flag) return
  let last = getLastImageNum(dirName)
  last = last ? last + 1 : 0
  flag = false

  list.map(item => item.pic).forEach((url, i) => {
    console.log(`第${i + 1}张图片开始下载`)
    if (!url.includes('https')) {
      url = 'https://' + url
    }
    downloadByHttps(url, dirName, last + i)
  })

  // for(let i = 0; i < list.length; i++){
  //   console.log(`第${i + 1}张图片开始下载`)
  //   let picUrl = list[i].pic
  //   if (!list[i].pic.includes('https')) {
  //     picUrl = 'https://' + list[i].pic
  //   }
  //   downloadByHttps(picUrl, dirName, last + i)
  // } // for

}
