const express = require('express')
const path = require('path')

const app = express()

app.use(express.static('.'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'flappy.html'))
})

app.listen(process.env.PORT || 8080, () => console.log('Executando...'))