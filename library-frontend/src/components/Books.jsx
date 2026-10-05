import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client/react"
const ALL_BOOKS = gql`
  query getBooks {
    allBooks {
      title
      author
      published
      id
    }
  }
`

const Books = (props) => {
  const result = useQuery(ALL_BOOKS)

  if (!props.show) {
    return null
  }

  const books = !result.data ? [] : result.data.allBooks
  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
