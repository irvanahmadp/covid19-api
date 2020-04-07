const express = require('express')
const router = express.Router()

const protocol = 'https'

router.get('/', index)
router.get('/provinsi/', provinsi)
router.get('/kabupaten/', kabupaten)

function index(req, res){
  const listDaerah = ["provinsi"]
  const output = {"status_code" : 200}
  const data = []
  let baseUrl = protocol + '://' + req.headers.host + '/'
  listDaerah.forEach(function(daerah, index){
    data.push({
      "daerah" : daerah,
      "url" : baseUrl + daerah + "/"
    })
  })

  output.data = data
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(output))
}

function provinsi(req, res){
  const listProvinsi = ["jawa timur", "jawa barat"]
  const output = {"status_code" : 200}
  const data = []
  let baseUrl = protocol + '://' + req.headers.host + '/'

  listProvinsi.forEach(function(provinsi, index){
    data.push({
      "namaProvinsi" : titleCase(provinsi),
      "url" : baseUrl + "provinsi/" + provinsi.replace(" ", "-")
    })
  })

  output.data = data
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(output))
}

function kabupaten(req, res){
  const listKabupaten = ["kota surabaya", "kabupaten gresik"]
  const output = {"status_code" : 200}
  const data = []
  let baseUrl = req.headers.host + '/'

  listKabupaten.forEach(function(kabupaten, index){
    data.push({
      "namaKabupaten" : titleCase(kabupaten),
      "url" : baseUrl + "kabupaten/" + kabupaten.replace(" ", "-")
    })
  })

  output.data = data
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(output))
}

function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  // Directly return the joined string
  return splitStr.join(' '); 
}

module.exports = router