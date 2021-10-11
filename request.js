const https = require('https')
const http = require('http')

module.exports = {
  request: (url) => {
    return new Promise((resolve, reject) => {
      https.get(url, function(res){
        let html = ''
        res.on('data', function(chunk){
          html += chunk
        })
        res.on('end', function() {
          resolve(html)
        })
      })
    })
    //   .on('error', (e) => {
    //   console.log('ERR: ', e)
    // })
  },

  http: (url) => {
    return new Promise((resolve, reject) => {
      http.get(url, function(res){
        let html = ''
        res.on('data', function(chunk){
          html += chunk
        })
        res.on('end', function() {
          // console.log('html--', html)
          resolve(html)
        })
      })
    })
  }

}

