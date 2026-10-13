import { gql } from "@apollo/client"

const BOOK_DETAILS_FRAGMENT = gql`
  fragment BookDetails on Book {
    id
    title
    author {
      name
      born
      id
    }
    published
    genres
  }
`

export const ADD_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS_FRAGMENT}
`

export const ALL_BOOKS = gql`
  query getBooks(
    $genre: String
  ) {
    allBooks(genre: $genre) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS_FRAGMENT}
`

export const ALL_AUTHORS = gql`
  query getAuthors {
    allAuthors {
      name
      born
      id
    }
  }
`

export const LOGIN_USER = gql`
  mutation login(
    $username: String!
    $password: String!
  ) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const EDIT_BORN_YEAR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      id
    }
  }
`
// Returns the User object which is currently logged in
export const LOGGED_USER = gql`
  query {
    me {
      username
      favoriteGenre
      id
    }
  }
`

export const BOOK_ADDED_SUB =  gql`
  subscription bookAdded {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS_FRAGMENT}
`