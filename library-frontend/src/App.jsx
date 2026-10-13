import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { skipToken, useApolloClient, useQuery, useSubscription } from '@apollo/client/react'
import Recommend from './components/Recommend'
import Notification from './components/Notification'
import { BOOK_ADDED_SUB, LOGGED_USER } from './queries'
import { addBookToCache } from './utils/apolloCache'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const [page, setPage] = useState('authors')
  const client = useApolloClient()
  const loggedInUser = useQuery(LOGGED_USER, token ? {} : skipToken )

  useSubscription(BOOK_ADDED_SUB, {
    onData: ({ data }) => {
      addBookToCache(client.cache, data.data.bookAdded)
      window.alert(`Added the book "${data.data.bookAdded.title}"`)

    }
  })

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.clearStore()
  }

  const notify = (message) => {
    setErrorMessage(message)
    setInterval(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <div>
      <Notification message={errorMessage}/>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {
          token && <>
              <button onClick={() => setPage('add')}>add book</button>
              <button onClick={() => setPage('recommend')}>recommend</button>
              <button onClick={onLogout}>logout</button>
            </>
        }
        { !token && <button onClick={() => setPage('login')}>login</button> }
      </div>
      
      <Authors show={page === 'authors'} token={token} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <LoginForm show={page === 'login'} setToken={setToken} setError={notify} setPage={setPage}/>

      {/* This component should only run if the user is logged in */}
      { token && <Recommend show={page === 'recommend' } user={loggedInUser.data?.me } />}
    </div>
  )
}

export default App
