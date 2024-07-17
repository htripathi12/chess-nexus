import React, { useState, useEffect } from 'react';
import { Box, Center, Container, Flex, Link, Spacer, Button, ChakraProvider, Text, VStack } from '@chakra-ui/react';
import { BrowserRouter as Router, Link as RouterLink, useLocation, Navigate } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import your existing components
import Play from './pages/Play.js';
import Puzzles from './pages/Puzzles';
import Learn from './pages/Learn.js';
import Login from './pages/Login.js';
import About from './pages/About.js'
import Contact from './pages/Contact.js';
import IntroPage from './pages/IntroPage.js';

const MotionBox = motion(Box);

function RoutesAndNavbar() {
  const location = useLocation();
  const [showIntro, setShowIntro] = useState(location.pathname === '/');

  useEffect(() => {
    if (location.pathname !== '/') {
      setShowIntro(false);
    }
  }, [location.pathname]);

  if (showIntro) {
    return <IntroPage onEnter={() => setShowIntro(false)} />;
  }
  
  return (
    <>
      {(location.pathname !== '/login' || location.pathname !== '/signup') && (
        <Flex as="nav" bg="teal.500" color="white" p={4}>
        {/*Navbar*/}
          <Box>
            <Button as={RouterLink} to="/" bg="teal.500" _hover={{bg: "teal.700"}}>
              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chess-king" width="30" height="30" 
                viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" 
                strokeLinejoin="round">
                  
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M8 16l-1.447 .724a1 1 0 0 0 -.553 .894v2.382h12v-2.382a1 1 0 0 0 -.553 -.894l-1.447 -.724h-8z" />
                <path d="M8.5 16a3.5 3.5 0 1 1 3.163 -5h.674a3.5 3.5 0 1 1 3.163 5z" />
                <path d="M9 6h6" />
                <path d="M12 3v8" />
              </svg>
            </Button>
          </Box>
          <Link as={RouterLink} to="/about" sx={{_hover: {textDecoration: "none"}}}>
            <Box p="2" ml="3" _hover={{bg: "teal.700", borderRadius: "lg"}}>
              About
            </Box>
          </Link>
            <Link as={RouterLink} to="/contact" style={{ textDecoration: 'none' }}>
              <Box p="2" ml="3" _hover={{ bg: "teal.700", borderRadius: "lg" }}>
                Contact
              </Box>
            </Link>
          <Spacer />
          <Link as={RouterLink} to="/login" _hover={{ textDecoration: "none" }}>
            <Button colorScheme="white" variant="outline" _hover={{ bg: "teal.700", color: "white" }}>
                Login
            </Button>
          </Link>
        </Flex>
      )}
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
          <Route path="/signup" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Container>
    </>
  );
}

function App() {
  return (
    <Router>
      <ChakraProvider>
        <Box bg="teal.400" minHeight="100vh" minWidth="100vw" overflow="hidden">
          <AnimatePresence>
            <RoutesAndNavbar />
          </AnimatePresence>
        </Box>
      </ChakraProvider>
    </Router>
  );
}

export default App;