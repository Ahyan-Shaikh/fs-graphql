import { useQuery, skipToken } from "@apollo/client/react"
import { ALL_BOOKS } from "../queries"

const Recommend = ({ show, user }) => {

  const { data } = useQuery(ALL_BOOKS, user ? {
    variables: { genre: user?.favoriteGenre },
  }: skipToken )


  if (!show) {
    return null
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <strong>{ user?.favoriteGenre }</strong></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr> 
          { data && data.allBooks.map(b => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>)
          )}
        </tbody>
      </table>
    </div>
  )
}
export default Recommend