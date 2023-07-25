import { useEffect, useState } from 'react'
import personServices from './services/persons'
import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]);
  
  const [newName, setNewName] = useState('')

  const [newNumber, setNewNumber] = useState('')

  const [newSearchInput, setNewSearchInput] = useState('')

  const [notification, setNotification] = useState(null)
  const [errorState, setErrorState] = useState(false)
  useEffect(() => {
    personServices
      .getAll()
      .then(personsData => {
        setPersons(personsData)
      })
  }, [])

  const handleNumberChange = (event) => {
    let numberInput = event.target.value
    setNewNumber(numberInput)
  }

  const handleNameChange = (event) => {
    let userInput = event.target.value;
    setNewName(userInput);
  }

  const handleSearchChange = (event) => {
    let searchInput = event.target.value;
    setNewSearchInput(searchInput);
  }
  
  const filterNames = (filterTerm) => {
    console.log('persons is: ', persons)
    return persons.filter(personObj => {
      console.log('personObj is : ', personObj)
      if (personObj) {
        let name = personObj.name.toLowerCase()
        return name.includes(filterTerm.toLowerCase())
      }
    })
  }

  const isUnique = name => {
    let nameIdx = persons.findIndex(personObj => personObj.name === name)
    return nameIdx === -1;
  }
  
  const handleDataSubmit = (event) => {
    event.preventDefault()
    if (isUnique(newName)) {
      let newPerson = {
        name: newName,
        number: newNumber
      }
      
      personServices
        .create(newPerson)
        .then(returnedPerson => {
          setPersons([...persons, returnedPerson])
          setNotification(`Added ${returnedPerson.name}`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
    } else {
      let personObj = persons.find(person => person.name === newName)
      let editedPerson = {...personObj, number: newNumber}
      if (window.confirm(`Are you sure you want to edit ${newName}?`)) {
        personServices
          .editPerson(editedPerson)
          .then(returnedPerson => {
            let uneditedPersons = persons.filter(person => person.name !== newName);
            setNotification(`Edited ${editedPerson.name}`)
            setTimeout(() => {
              setNotification(null)
            }, 5000)
            setPersons(uneditedPersons.concat(returnedPerson))
          })
          .catch(error => {
            console.log(error)
            setErrorState(true)
            setNotification(`Information of ${newName} has already been removed from the server`)
            setTimeout(() => {
              setNotification(null)
              setErrorState(false)
            }, 5000)
            setPersons(persons.filter(person => person.name !== newName))
          })
      }
    }
    setNewName('')
    setNewNumber('')
  }

  const deletePersonReq = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personServices
        .deletePerson(id) 
        .then(status => {
          if (status === 'No Content') {
            let newPersons = persons.filter(person => person.id !== id);
            setPersons(newPersons)
            setNotification(`${name} deleted`)
            setTimeout(() => setNotification(null), 5000)
          }
        })
        .catch(error => {
          console.log('error occurred')
        })
    }
  }

  let displayNames = filterNames(newSearchInput)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification isError={errorState} message={notification} />
      <Filter searchTerm={newSearchInput} handleChange={handleSearchChange}/>
      <h2>Add a new</h2>
      <PersonForm 
        dataHandler={handleDataSubmit}
        nameInput={newName}
        nameHandler={handleNameChange}
        numberInput={newNumber}
        numberHandler={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons deleteHandler={deletePersonReq} names={displayNames}/>
    </div>
  )
}

export default App