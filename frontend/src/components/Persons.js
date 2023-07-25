const Persons = (props) => {
  return (
    <div>
      {props.names
        .map((personObj) => {
          return (
            <ul key={personObj.id}>
              {personObj.name} {personObj.number}
              <button onClick={() => props.deleteHandler(personObj.id, personObj.name)}>Delete</button>
            </ul>
          )
        })
      }
    </div>
  )
}

export default Persons
