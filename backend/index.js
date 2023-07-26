require('dotenv').config()
const express = require('express')
const People = require('./models/people')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())

morgan.token('req-body', (req) => {
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :response-time ms - :req-body'));

app.use(express.json())
app.use(express.static('build'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    {
      "id": 5,
      "name": "Ivan Lee",
      "number": "32423432"
    }
]

const isUnique = (name) => {
  let nameIdx = persons.findIndex(person => person.name === name) 
  return nameIdx === -1
}

app.get('/api/persons', (request, response) => {
  People.find({}).then(people => {
    response.json(people)
  })
})

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  let id = Number(request.params.id)
  let person = persons.find(person => person.id === id);
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  let { name, number } = request.body
  
  // if (name === undefined || number === undefined || !isUnique(name)) {
  //   return response.status(404).json({error: 'name must be unique'})
  // }

  // let newId = Math.floor(Math.random() * 1000000) 

  // let newPerson = {
  //   name,
  //   number,
  //   id: newId
  // }

  // persons = persons.concat(newPerson)
  // response.json(newPerson).status(200)
  if (name === undefined || number === undefined) {
    return response.status(400).json({error: 'content missing'})
  }
  const person = new People({
    name,
    phoneNumber: number
  })
  
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  let id = request.params.id
  // persons = persons.filter(person => person.id !== id)
  People.findByIdAndRemove(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})