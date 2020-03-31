const express = require('express')
const router = express.Router()
const scraperjs = require('scraperjs')
const axios = require('axios')

let urlKotaSurabaya = "https://lawancovid-19.surabaya.go.id/area/report?tanggal=28-03-2020&id_kec="

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