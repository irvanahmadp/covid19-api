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
    const output = {"status_code" : responseData.status_code, "provinsi" : "jawa-barat"}
    const data = []
    responseData.data.content.forEach(function(dataKabupaten, index){
      data[index] = {
        "kabupaten" : titleCase(dataKabupaten.nama_kab),
        "ODP" : dataKabupaten.odp_proses,
        "PDP" : dataKabupaten.pdp_proses,
        "positif" : dataKabupaten.positif,
        "sembuh" : dataKabupaten.sembuh,
        "meninggal" : dataKabupaten.meninggal,
      }
    })
    output.data = data
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
    const output = {"status_code" : 200, "provinsi" : "jawa-timur"}
    const data = []
    for(i =0; i < ((dataScrapingArr.length / 7) -1); i++){
      data[i] = {
        "kabupaten" : titleCase(dataScrapingArr[i*7]),
        "ODP" : parseInt(dataScrapingArr[(i*7)+3]),
        "PDP" : parseInt(dataScrapingArr[(i*7)+4]),
        "positif" : parseInt(dataScrapingArr[(i*7)+5]),
      }
    }

    output.data = data
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(output))
  })
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