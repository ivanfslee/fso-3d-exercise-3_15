const PersonForm = props => {
  return (
    <form onSubmit={props.dataHandler}>
      <div>
        name: <input value={props.nameInput} onChange={props.nameHandler} />
      </div>
      <div>
        number: <input value={props.numberInput} onChange={props.numberHandler} />
      </div>
      <div>
        <button type="submit" >add</button>
      </div>
    </form>
  )
}

export default PersonForm