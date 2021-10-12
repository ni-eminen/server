const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Score = require('./models/score')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("<p>Hello World</p>")
}) 

app.get('/api/scores', (req, res) => {
  Score.find({}).then(scores => {
    res.json(scores)
  })
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const score = new Score({
    name: body.name,
    score: body.score
  })

  score.save().then(savedScore => {
    response.json(savedScore)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})