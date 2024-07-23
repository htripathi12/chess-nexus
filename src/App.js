import React from 'react';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';

import RoutesAndNavbar from './components/RoutesAndNavbar.js';
import { AuthProvider } from './AuthContext.js';

function App() {
  return (
  <AuthProvider>
    <Router>
      <ChakraProvider>
        <Box bg="teal.400" minHeight="100vh" minWidth="100vw" overflow="hidden">
          <RoutesAndNavbar />
        </Box>
      </ChakraProvider>
      </Router>
  </AuthProvider>
  );
}

export default App;