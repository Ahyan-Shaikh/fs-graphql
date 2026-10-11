import { useMutation } from "@apollo/client/react"
import { useState } from "react"
import { LOGIN_USER } from "../queries"



const LoginForm = ({ show, setToken, setError, setPage}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
    },
    onError: (error) => {
      setError(`login failed ${error.message}`)
    }
  })

  if (!show) return null

  const submit = (event) => {
    event.preventDefault()
    login({ variables: { username, password }})
    setPage('authors')
    setUsername('')
    setPassword('')
  }


  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          <label>
            username <input value={username} onChange={({ target }) => setUsername(target.value)}/>
          </label>
        </div>
        <div>
          <label>
            password <input type="password" value={password} onChange={({ target }) => setPassword(target.value)}/>
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm