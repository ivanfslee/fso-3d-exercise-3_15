const Filter = (props) => {
  return (
    <div>
      filter shown with <input value={props.searchTerm} onChange={props.handleChange} />
    </div>
  )
}
export default Filter