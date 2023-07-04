import { gql } from '@apollo/client';
// login user mutation
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;
// add user mutation
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        bookCount
        savedBooks {
          authors
          bookId
          image
          link
          title
          description
        }
      }
    }
  }
`;
// save book mutation
export const SAVE_BOOK = gql`
mutation saveBook($newBook: BookInput!) {
  saveBook(newBook: $newBook) {
    _id
    username
    email
    bookCount
    savedBooks {
      authors
      description
      bookId
      image
      link
      title
    }
  }
}
`;
//remove book mutation
export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!) {
  removeBook(bookId: $bookId) {
    username
    email
    bookCount
    savedBooks {
      authors
      description
      bookId
      image
      link
      title
    }
  }
}
`;
