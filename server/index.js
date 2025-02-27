const express = require('express')
const app = express()

require('dotenv').config()

app.get("/" , (req, res) =>{
    res.send('hello world')
})

app.listen(5000,   () =>{
    console.log('baza ishladi')
})