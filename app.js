
const express = require('express')
const app = express()
const port = 3000
const scraperjs = require('scraperjs')

const url_prov_jatim = "https://jatimdev.com/corona"

app.get('/provinsi/jawa-timur/', (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  scraperjs.StaticScraper.create(url_prov_jatim)
  .scrape(function($) {
    return $("td").map(function() {
      return $(this).text()
    }).get()
  })
  .then(function(dataScrapingArr) {    
    const data = []
    for(i =0; i < ((dataScrapingArr.length / 5) -1); i++){
      data[i] = { 
        "kabupaten" : dataScrapingArr[i*5],
        "ODP" : dataScrapingArr[(i*5)+1],
        "PDP" : dataScrapingArr[(i*5)+2],
        "positif" : dataScrapingArr[(i*5)+3],
      }
    }
    res.end(JSON.stringify(data))
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
