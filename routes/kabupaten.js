const express = require('express')
const router = express.Router()
const scraperjs = require('scraperjs')
const axios = require('axios')

var date = new Date()
if(date.getHours() + 7 < 18){
  var tanggal = date.getDate() - 1
  if(tanggal == -1){
    switch(date.getMonth()){
      case 0:
        tanggal = 31
        break
      case 1:
        tanggal = 29
        break
      case 2:
        tanggal = 31
        break
      case 3:
        tanggal = 30
        break
      case 4:
        tanggal = 31
        break
      case 5:
        tanggal = 30
        break
      case 6:
        tanggal = 31
        break
      case 7:
        tanggal = 31
        break
      case 8:
        tanggal = 30
        break
      case 9:
        tanggal = 31
        break
      case 10:
        tanggal = 30
        break
      case 11:
        tanggal = 31
        break
    }
  }
  var urlKotaSurabayaDate = tanggal + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
}else{
  var urlKotaSurabayaDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
}

let urlKotaSurabaya = "https://lawancovid-19.surabaya.go.id/area/report?tanggal=" + urlKotaSurabayaDate + "&id_kec="

router.get('/kabupaten/surabaya', kotaSurabaya)

function kotaSurabaya(req, res){
  scraperjs.StaticScraper.create(urlKotaSurabaya)
  .scrape(function($) {
    return $("td").map(function() {
      return $(this).text()
    }).get()
  })
  .then(function(dataScrapingArr) {
    const output = [{"status_code" : 200}, {"kabupaten" : "kota surabaya"}]
    const data = []
    
    let indexKecamatan = -1
    let indexKelurahan = 0
    for(i =0; i < (dataScrapingArr.length / 7); i++){
      if(dataScrapingArr[i*7] != ''){
        /* nama kecamatan */
        indexKecamatan++
        indexKelurahan = 0
        data[indexKecamatan] = {
          "kabupaten" : dataScrapingArr[i*7],
          "data" : []
        }
      }else{
        data[indexKecamatan].data[indexKelurahan] = {
         "kelurahan" :  dataScrapingArr[(i*7)+1],
         "ODP" : parseInt(dataScrapingArr[(i*7)+2]),
         "PDP" : parseInt(dataScrapingArr[(i*7)+3]),
         "positif" : parseInt(dataScrapingArr[(i*7)+4]),
         "sembuh" : parseInt(dataScrapingArr[(i*7)+5]),
         "meninggal" : parseInt(dataScrapingArr[(i*7)+6]),

        }
        indexKelurahan++
      }
    }

    output.push({"data" : data})
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(output))
  })
}

module.exports = router