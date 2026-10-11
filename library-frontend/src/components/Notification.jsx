const Notification = ({ message }) => {

  if (!message) {
    return null
  }
  const style = {
    color: 'red'
  }
  return (
    <div style={style}>
      { message }
    </div>
  )
}

export default Notification