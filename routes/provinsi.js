const express = require('express')
const router = express.Router()
const scraperjs = require('scraperjs')
const axios = require('axios')

let urlProvJatim = "https://jatimdev.com/corona"
let urlProvJabar = "https://covid19-public.digitalservice.id/api/v1/rekapitulasi/jabar?level=kab"

router.get('/provinsi/jawa-timur/', jawaTimur)
router.get('/provinsi/jawa-barat/', jawaBarat)

function jawaBarat(req, res){
  axios.get(urlProvJabar)
  .then(function(response){
    responseData = response.data
    const output = [{"status_code" : responseData.status_code}, {"provinsi" : "jawa-barat"}]
    const data = []
    responseData.data.content.forEach(function(dataKabupaten, index){
      data[index] = {
        "kabupaten" : dataKabupaten.nama_kab,
        "ODP" : dataKabupaten.odp_proses,
        "PDP" : dataKabupaten.pdp_proses,
        "positif" : dataKabupaten.positif,
        "sembuh" : dataKabupaten.sembuh,
        "meninggal" : dataKabupaten.meninggal,
      }
    })
    output.push({"data" : data})
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(output))
  })
  .catch(function(error){
    console.log(error)
  })
}

function jawaTimur(req, res){
  scraperjs.StaticScraper.create(urlProvJatim)
  .scrape(function($) {
    return $("td").map(function() {
      return $(this).text()
    }).get()
  })
  .then(function(dataScrapingArr) {
    const output = [{"status_code" : 200}, {"provinsi" : "jawa-timur"}]
    const data = []
    for(i =0; i < ((dataScrapingArr.length / 5) -1); i++){
      data[i] = {
        "kabupaten" : dataScrapingArr[i*5],
        "ODP" : parseInt(dataScrapingArr[(i*5)+1]),
        "PDP" : parseInt(dataScrapingArr[(i*5)+2]),
        "positif" : parseInt(dataScrapingArr[(i*5)+3]),
      }
    }

    output.push({"data" : data})
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(output))
  })
}

module.exports = router