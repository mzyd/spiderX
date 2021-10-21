const fs = require('fs')

// stats:
// {
//   dev: 2114,
//   ino: 48064969,
//   mode: 33188,
//   nlink: 1,
//   uid: 85,
//   gid: 100,
//   rdev: 0,
//   size: 527,
//   blksize: 4096,
//   blocks: 8,
//   atime: Mon, 10 Oct 2011 23:24:11 GMT,
//   mtime: Mon, 10 Oct 2011 23:24:11 GMT,
//   ctime: Mon, 10 Oct 2011 23:24:11 GMT,
//   birthtime: Mon, 10 Oct 2011 23:24:11 GMT
// }

const readDir = fs.readdirSync('./fuss-jandan')

const dirName = './fuss-jandan/'

var hash = {}

readDir.forEach((item, index) => {
  const filePath = dirName + item

  if (fs.statSync(filePath).isDirectory()) return

  var stats = fs.statSync(filePath)

  if (!hash[stats.size]) {
    hash[stats.size] = item
  } else {
    console.log('The picture is duplicated -> ', hash[stats.size], ' : ', item)
    fs.unlinkSync(dirName + item)
  }
})

console.log('*** DONE ***')

