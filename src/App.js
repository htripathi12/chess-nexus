import React from 'react';
import { Box, Container, ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RoutesAndNavbar from './client/components/RoutesAndNavbar';
import { AuthProvider } from './client/AuthContext';

// Import your existing components
import Play from './client/pages/Play';
import Puzzles from './client/pages/Puzzles';
import Learn from './client/pages/Learn';
import Login from './client/pages/Login';
import Signup from './client/pages/Signup';
import About from './client/pages/About';
import Contact from './client/pages/Contact';
import Account from './client/pages/Account';
import LandingPage from './client/pages/LandingPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ChakraProvider>
          <Box bg="teal.400" minHeight="100vh" minWidth="100vw" overflow="hidden">
            <RoutesAndNavbar />
            <Container maxW="100%">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/play" element={<Play />} />
                <Route path="/puzzles" element={<Puzzles />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/account" element={<Account />} />
              </Routes>
            </Container>
          </Box>
        </ChakraProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;