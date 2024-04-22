import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import { ApolloClient, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context'
import Navbar from './components/Navbar';

// const httplink = createHttpLink({
//   uri: '/graphql'
// })
// const authLink = setContext((_, { headers }) => {
//   const token = localStorage.getItem('id_token');
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : '',
//     }
//   }
// })


const client = new ApolloClient({
  request: (operation) => {
    const token = localStorage.getItem("id_token");
    
    operation.setContext({
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      }
    });
  },
uri: "/graphql"
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route path='/' element={<SearchBooks />} />
            <Route path='/saved' element={<SavedBooks />} />
            <Route path='*' element={<h1 className='display-2'>Wrong Page!</h1>} />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
