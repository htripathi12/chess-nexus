import React from 'react';
import { Box, Center, Container, AbsoluteCenter, Flex, Link, Spacer, Button, ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Link as RouterLink, useLocation } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

import Play from './Play';
import Puzzles from './Puzzles/Puzzles';
import Learn from './Learn/Learn';
import Login from './Login/Login';

function RoutesAndNavbar() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/login' && (
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
          <Box p="2" ml="3" _hover={{bg: "teal.700", borderRadius: "lg"}}>
            <Link as={RouterLink} to="/about" sx={{_hover: {textDecoration: "none"}}}>About</Link>
          </Box>
          <Box p="2" ml="3" _hover={{bg: "teal.700", borderRadius: "lg"}}>
            <Link as={RouterLink} to="/contact" sx={{_hover: {textDecoration: "none"}}}>Contact</Link>
          </Box>
          <Spacer />
          <Link as={RouterLink} to="/login" _hover={{ textDecoration: "none" }}>
            <Button colorScheme="white" variant="outline" _hover={{ bg: "teal.700", color: "white" }}>
                Login
            </Button>
          </Link>
        </Flex>
      )}
      <Container h="100vh" maxW="100%" border="1px solid green">
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
        </Routes>
      </Container>
    </>
  );
}

function App() {
  return (
    <Router>
      <ChakraProvider>
        <Box bg="teal.400" minHeight="100vh">
          <RoutesAndNavbar />
        </Box>
      </ChakraProvider>
    </Router>
  );
}

export default App;