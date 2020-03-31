const express = require('express')
const app = express()
const port = process.env.PORT || 8000
const scraperjs = require('scraperjs')
const axios = require('axios');

let url_prov_jatim = "https://jatimdev.com/corona"
let url_prov_jabar = "https://covid19-public.digitalservice.id/api/v1/rekapitulasi/jabar?level=kab"

app.get('/provinsi/', (req, res) => {
  const provinsi = ["jawa-timur", "jawa-barat"]
  const output = [{"status_code" : 200}]
  const data = []

  provinsi.forEach(function(provinsi, index){
    data.push({"namaProvinsi" : provinsi})
  })

  output.push({"data" : data})
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(output))
})

app.get('/provinsi/jawa-timur/', (req, res) => {
  scraperjs.StaticScraper.create(url_prov_jatim)
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
  axios.get(url_prov_jabar)
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
