const express = require('express')
const app = express()
const port = 3000
const scraperjs = require('scraperjs')
const axios = require('axios');

let baseUrl = "localhost:3000/"

let urlProvJatim = "https://jatimdev.com/corona"
let urlProvJabar = "https://covid19-public.digitalservice.id/api/v1/rekapitulasi/jabar?level=kab"

let urlKotaSurabaya = "https://lawancovid-19.surabaya.go.id/area/report?tanggal=28-03-2020&id_kec="

app.get('/', (req, res) => {
  const listDaerah = ["provinsi", "kabupaten"]
  const output = [{"status_code" : 200}]
  const data = []

  listDaerah.forEach(function(daerah, index){
    data.push({
      "daerah" : daerah,
      "url" : baseUrl + daerah + "/"
    })
  })

  output.push({"data" : data})
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(output))
})

app.get('/provinsi/', (req, res) => {
  const listProvinsi = ["jawa timur", "jawa barat"]
  const output = [{"status_code" : 200}]
  const data = []

  listProvinsi.forEach(function(provinsi, index){
    data.push({
      "namaProvinsi" : provinsi,
      "url" : baseUrl + "provinsi/" + provinsi.replace(" ", "-")
    })
  })

  output.push({"data" : data})
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(output))
})

app.get('/provinsi/jawa-timur/', (req, res) => {
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
})

app.get('/provinsi/jawa-barat/', (req, res) => {
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
})

app.get('/kabupaten/surabaya', (req, res) => {
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
    const dataKecamatanTemp = {}
    for(i =0; i < (dataScrapingArr.length / 6); i++){
      if(dataScrapingArr[i*6] != ''){
        /* nama kecamatan */
        indexKecamatan++
        indexKelurahan = 0
        data[indexKecamatan] = {
          "kabupaten" : dataScrapingArr[i*6],
          "data" : []
        }
      }else{
        data[indexKecamatan].data[indexKelurahan] = {
         "kelurahan" :  dataScrapingArr[(i*6)+1],
         "ODP" : parseInt(dataScrapingArr[(i*6)+2]),
         "PDP" : parseInt(dataScrapingArr[(i*6)+3]),
         "positif" : parseInt(dataScrapingArr[(i*6)+4]),
         "sembuh" : parseInt(dataScrapingArr[(i*6)+5]),
        }
        indexKelurahan++
      }
    }

    output.push({"data" : data})
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(output))
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
