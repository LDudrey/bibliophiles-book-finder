import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations'
import { GET_ME } from '../utils/queries'
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
// TODO: 
// 1. Remove the useEffect() Hook that sets the state for UserData.
// 2. Instead, use the useQuery() Hook to execute the GET_ME query on load
// and save it to a variable named userData.
// 3. Use the useMutation() Hook to execute the REMOVE_BOOK mutation in the handleDeleteBook() 
// function instead of the deleteBook() function that's imported from API file. 
// (Make sure you keep the removeBookId() function in place!)
const SavedBooks = ({ bookId, isLoggedInUser = false }) => {
  const [removeBookId, { error }] = useMutation(REMOVE_BOOK, {
    update(cache, { data: { removeBook } }) {
      try {
        cache.writeQuery({
          query: GET_ME,
          data: { me: removeBook },
        });
      } catch (err) {
        console.error(err);
      }
    },
  });

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    try {
      const { data } = await removeBookId({
        variables: { bookId },
      });
    } catch (err) {
      console.error(err);
    }
  };

if (!bookId.length) {
  return <h3>No Books saved yet</h3>;
}




// if data isn't here yet, say so
if (!userDataLength) {
  return <h2>LOADING...</h2>;
}

return (
  <>
    <div fluid className="text-light bg-dark p-5">
      <Container>
        <h1>Viewing saved books!</h1>
      </Container>
    </div>
    <Container>
      <h2 className='pt-5'>
        {userData.savedBooks.length
          ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
          : 'You have no saved books!'}
      </h2>
      <Row>
        {userData.savedBooks.map((book) => {
          return (
            <Col md="4">
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

    </Container>
  </>
);
};

export default SavedBooks;

