const express = require('express')
const router = express.Router()

router.get('/', index)
router.get('/provinsi/', provinsi)
router.get('/kabupaten/', kabupaten)

function index(req, res){
  const listDaerah = ["provinsi"]
  const output = [{"status_code" : 200}]
  const data = []
  let baseUrl = req.headers.host + '/'
  listDaerah.forEach(function(daerah, index){
    data.push({
      "daerah" : daerah,
      "url" : baseUrl + daerah + "/"
    })
  })

  output.push({"data" : data})
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(output))
}

function provinsi(req, res){
  const listProvinsi = ["jawa timur", "jawa barat"]
  const output = [{"status_code" : 200}]
  const data = []
  let baseUrl = req.headers.host + '/'

  listProvinsi.forEach(function(provinsi, index){
    data.push({
      "namaProvinsi" : provinsi,
      "url" : baseUrl + "provinsi/" + provinsi.replace(" ", "-")
    })
  })

  output.push({"data" : data})
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(output))
}

function kabupaten(req, res){
  const listKabupaten = ["kota surabaya", "kabupaten gresik"]
  const output = [{"status_code" : 200}]
  const data = []
  let baseUrl = req.headers.host + '/'

  listKabupaten.forEach(function(kabupaten, index){
    data.push({
      "namaKabupaten" : kabupaten,
      "url" : baseUrl + "kabupaten/" + kabupaten.replace(" ", "-")
    })
  })

  output.push({"data" : data})
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(output))
}

module.exports = router