import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client/react"
import BirthYearForm from "./BirthYearForm"

const ALL_AUTHORS = gql`
  query getAuthors {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)

  if (!props.show) {
    return null
  }

  const authors = !result.data ? [] : result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <BirthYearForm authors={authors} />
    </div>
  )
}

export default Authors
