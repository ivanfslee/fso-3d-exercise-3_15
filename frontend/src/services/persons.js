import axios from 'axios'
// const baseUrl = 'http://localhost:3001/api/persons'
const baseUrl = '/api/persons'//current working build
// const baseUrl = 'http://localhost:3008/api/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = (newPersonObj) => {
  const request = axios.post(baseUrl, newPersonObj)
  return request.then(response => response.data)
} 

const deletePerson = (personId) => {
  const request = axios.delete(baseUrl + `/${personId}`)
  return request.then(response => response.statusText)
}

const editPerson = (editedPersonObj) => {
  const request = axios.put(baseUrl + `/${editedPersonObj.id}`, editedPersonObj)
  return request
    .then(response => response.data)
}

export default { getAll, create, editPerson, deletePerson }