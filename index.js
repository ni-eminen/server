const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Score = require('./models/score')
const bcrypt = require("bcryptjs")
const User = require('./models/user')

const app = express()
app.use(cors())
app.use(express.json())

let scores = []
const pw = "pass123"
const saltRounds = 10

const serverHash = (password) => {
  bcrypt.genSalt(10, (saltError, salt) => {
    if(saltError){
      throw saltError
    } else {
      bcrypt.hash(password, salt, (hashError, hash) => {
        if(hashError) {
          throw hashError
        } else {
          return hash
        }
      })
    }
  })
}



app.get('/', (req, res) => {
    res.send("<p>Hello World</p>")
}) 

app.get('/api/scores', (req, res) => {
  Score.find({}).then(scores => {
    res.json(scores)
  })
})

app.post('/api/scores', (request, response) => {
  const body = request.body

  if (!body.name || !body.score) {
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

app.delete('/api/scores/:id', (request, response) => {
  const id = Number(request.params.id)
  scores = scores.filter(score => score.id !== id)
  response.status(204).end()
})

app.post('/api/users', (request, response) => {
  console.log("yritetään postata", response.body)
  const body = request.body

  if (!body.username || !body.password) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  let password = serverHash(body.password)
  console.log("password hashed into: ", password)

  const user = new User({
    username: body.username,
    password: password
  })

  user.save().then(savedUser => {
      response.json(savedUser)
    })
})

app.get('/api/users', (request, response) => {
  User.find({}).then(result => {
    response.json(result)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})