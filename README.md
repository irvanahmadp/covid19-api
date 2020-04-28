# Covid19-api

- List daerah

  Get http://covid19-api-id.herokuapp.com/

  Response:
  `{
    "status_code": 200,
    "data": [
      {
        "daerah": "provinsi",
        "url": "https://covid19-api-id.herokuapp.com/provinsi/"
      }
    ]
  }`


- List provinsi

  Get https://covid19-api-id.herokuapp.com/provinsi/

  Response:
  `{
    "status_code": 200,
    "data": [
      {
        "namaProvinsi": "Jawa Timur",
        "url": "https://covid19-api-id.herokuapp.com/provinsi/jawa-timur"
      },
      {
        "namaProvinsi": "Jawa Barat",
        "url": "https://covid19-api-id.herokuapp.com/provinsi/jawa-barat"
      }
    ]
  }`

- Data penyebaran setiap kota/kabupaten di Jawa Barat

  Get https://covid19-api-id.herokuapp.com/provinsi/jawa-barat

  Response:
  `{
    "status_code": 200,
    "provinsi": "jawa-barat",
    "data": [
      {
        "kabupaten": "Kabupaten Bandung",
        "ODP": 207,
        "PDP": 58,
        "positif": 33,
        "sembuh": 2,
        "meninggal": 2
      }
    ]
  }`
