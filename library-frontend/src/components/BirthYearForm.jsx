import { gql } from "@apollo/client"
import { useMutation } from "@apollo/client/react"
import { useState } from "react"

const EDIT_BORN_YEAR = gql`
  mutation editAuthor($author: String!, $setBornTo: Int!) {
    editAuthor(author: $author, setBornTo: $setBornTo) {
      name
      born
      id
    }
  }
`

const BirthYearForm = ({ authors }) => {
  const [name, setName] = useState("")
  const [born, setBorn] = useState("")

  const [editBornYear] = useMutation(EDIT_BORN_YEAR)

  const submit = (event) => {
    event.preventDefault()
    editBornYear({
      variables: { author: name, setBornTo: Number.parseInt(born) },
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
            <select onChange={({ target }) => setName(target.value)}>
              {authors.map((a) => (
                <option key={a.id}>{a.name}</option>
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
