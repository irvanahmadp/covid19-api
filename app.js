const express = require('express')
const app = express()
const port = process.env.PORT || 3001
var cors = require('cors')

const mainRouter = require('./routes/main.js')
const provinsiRouter = require('./routes/provinsi.js')
const kabupatenRouter = require('./routes/kabupaten.js')

app.use(cors({
  origin: '*'
}));
app.use(mainRouter)
app.use(provinsiRouter)
app.use(kabupatenRouter)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
