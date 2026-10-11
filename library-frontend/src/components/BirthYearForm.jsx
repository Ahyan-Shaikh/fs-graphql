import { useMutation } from "@apollo/client/react"
import { useState } from "react"
import { ALL_AUTHORS, EDIT_BORN_YEAR } from "../queries"


const BirthYearForm = ({ authors }) => {
  const [name, setName] = useState("")
  const [born, setBorn] = useState("")

  const [editBornYear] = useMutation(EDIT_BORN_YEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const submit = (event) => {
    event.preventDefault()
    editBornYear({
      variables: { name, setBornTo: Number.parseInt(born) },
      onCompleted: (data) => {
        console.log(data)
      },
    })
  }
  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <label>
            name
            <select name="name" onChange={({ target }) => setName(target.value)}>
              {authors.map((a) => (
                <option key={a.id} value={a.name}>{a.name}</option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            born
            <input
              type="number"
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
          </label>
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}
export default BirthYearForm
