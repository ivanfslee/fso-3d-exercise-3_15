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

app.get('/api/persons/:id', (request, response, next) => {
  let id = request.params.id
  People.findById(id)
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  let { name, number } = request.body
  
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

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const editedPerson = {
    name: body.name,
    phoneNumber: body.number
  }
  People.findByIdAndUpdate(request.params.id, editedPerson, {new: true})
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  let id = request.params.id
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