import { useQuery } from "@apollo/client/react"
import { useState } from "react"
import { ALL_BOOKS } from "../queries"

// leaving useState empty because on the server it looks for undefiend and thus returns all the books
// it is not a mistake but deliberately written
const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState()
  const { data, loading } = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre }
  })

  if (!props.show || loading) {
    return null
  }


  return (
    <div>
      <h2>books</h2>
      <p>in genre <strong>{!selectedGenre ? 'all genres' : selectedGenre}</strong></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data.allBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setSelectedGenre('refactoring')}>refactoring</button>
        <button onClick={() => setSelectedGenre('agile')}>agile</button>
        <button onClick={() => setSelectedGenre('patterns')}>patterns</button>
        <button onClick={() => setSelectedGenre('design')}>design</button>
        <button onClick={() => setSelectedGenre('crime')}>crime</button>
        <button onClick={() => setSelectedGenre('classic')}>classic</button>
        {/* here as well we will set the state to undefined instead of null, as server looks for undefined */}
        <button onClick={() => setSelectedGenre(undefined)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
