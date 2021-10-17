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

app.get('/', (req, res) => {
    res.send("<p>Hello World</p>")
}) 

app.get('/api/scores', (req, res) => {
  Score.find({}).then(scores => {
    res.json(scores)
  })
})

app.post('/api/users', (request, response) => {
  const body = request.body

  if (!body.username || !body.password) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  password = body.password

  const user = new User({
    username: body.username,
    password: password
  })

  user.save().then(savedUser => {
      response.json(savedUser)
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

app.post('/api/users/login', (request, response) => {
  const body = request.body

  let password = body.password
  let username = body.username

  // fetch the user and test password verification
  User.findOne({ username: username }, function(err, user) {
    if (err) throw err;
    
    // test a matching password
    user.comparePassword(password, function(err, isMatch) {
        if (err) throw err;
        console.log(password, isMatch); // -&gt; Password123: true
        isMatch ? response.send(true) : response.send(false)
    });
  });
})

app.delete('/api/scores/:id', (request, response) => {
  const id = Number(request.params.id)
  scores = scores.filter(score => score.id !== id)
  response.status(204).end()
})


app.get('/api/users', (request, response) => {
  User.find({}).then(result => {
    response.json(result)
  })
})

app.get('/api/users/login', (request, response) => {
  response.send('<h2>Hello</h2>')
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})