require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const {SERVER_PORT} = process.env
const {getAllAlbums, createAlbum, updateRating, deleteAlbum, getSuggestion, seed} = require('./controller.js')

app.use(express.json())
app.use(cors())
app.use(express.static('public'))
 
app.get('/', (req,res) => {
   res.status(200).sendFile(path.join(__dirname, '../public/index.html'))
})

app.get('/css', (req,res) => {
   res.status(200).sendFile(path.join(__dirname, '../public/styles.css'))
})

app.get('/js', (req,res) => {
   res.status(200).sendFile(path.join(__dirname, '../public/main.js'))
})
 
app.post('/seed', seed);
app.get('/albums', getAllAlbums);
app.post('/albums', createAlbum);
app.put('/albums/:id', updateRating);
app.delete('/albums/:id', deleteAlbum);
app.get('/suggest', getSuggestion);

 
app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`))