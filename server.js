const express = require('express')
const path = require('path')

const app = express()

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'flappy.html'))
})

app.use('/css', express.static('css'))
app.use('/fonts', express.static('fonts'))
app.use('/imgs', express.static('imgs'))
app.use('/js', express.static('js'))

app.listen(process.env.PORT || 8080, () => console.log('Executando...'))