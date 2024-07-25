import React from 'react';
import {
  Box, Center, Container, Flex, Button, ChakraProvider, 
} from '@chakra-ui/react';
import { Link as RouterLink, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RoutesAndNavbar from './components/RoutesAndNavbar.js';
import { AuthProvider } from './AuthContext.js';

// Import your existing components
import Play from './pages/Play.js';
import Puzzles from './pages/Puzzles';
import Learn from './pages/Learn.js';
import Login from './pages/Login.js';
import Signup from './pages/Signup.js';
import About from './pages/About.js'
import Contact from './pages/Contact.js';
import Account from './pages/Account.js';


function App() {
  return (
    <AuthProvider>
      <Router>
        <ChakraProvider>
          <Box bg="teal.400" minHeight="100vh" minWidth="100vw" overflow="hidden">
            <RoutesAndNavbar />
            <Container maxW="100%">
              <Routes>
                <Route path="/" element={
                  <Center>
                    <Flex direction="column">
                      <Button as={RouterLink} to="/play" mb="2">
                        Play
                      </Button>
                      <Button as={RouterLink} to="/puzzles" mb="2">
                        Puzzles
                      </Button>
                      <Button as={RouterLink} to="/learn">
                        Learn
                      </Button>
                    </Flex>
                  </Center>
                }/>
                <Route path="/play" element={<Play />} />
                <Route path="/puzzles" element={<Puzzles />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="account" element={<Account />} />
              </Routes>
            </Container>
          </Box>
        </ChakraProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;