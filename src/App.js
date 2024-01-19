import React from 'react';
import { Box, Center, AbsoluteCenter, Flex, Link, Spacer, Button, ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Link as RouterLink } from 'react-router-dom';

function App() {
  return (
    <Router>
      <ChakraProvider>
        <Box bg="teal.400" minHeight="100vh">
          {/*Navbar*/}
          <Flex as="nav" bg="teal.500" color="white" p={4}>
            <Box>
              <Button as={RouterLink} to="/" bg="teal.500" _hover={{bg: "gray.700"}}>
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chess-king" width="30" height="30" 
                  viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" 
                  stroke-linejoin="round">
                    
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M8 16l-1.447 .724a1 1 0 0 0 -.553 .894v2.382h12v-2.382a1 1 0 0 0 -.553 -.894l-1.447 -.724h-8z" />
                  <path d="M8.5 16a3.5 3.5 0 1 1 3.163 -5h.674a3.5 3.5 0 1 1 3.163 5z" />
                  <path d="M9 6h6" />
                  <path d="M12 3v8" />
                </svg>
              </Button>
            </Box>
            <Box p="2" ml="3" _hover={{bg: "gray.700", borderRadius: "lg"}}>
              <Link as={RouterLink} to="/" sx={{_hover: {textDecoration: "none"}}}>Home</Link>
            </Box>
            <Box p="2" ml="3" _hover={{bg: "gray.700", borderRadius: "lg"}}>
              <Link as={RouterLink} to="/about" sx={{_hover: {textDecoration: "none"}}}>About</Link>
            </Box>
            <Box p="2" ml="3" _hover={{bg: "gray.700", borderRadius: "lg"}}>
              <Link as={RouterLink} to="/contact" sx={{_hover: {textDecoration: "none"}}}>Contact</Link>
            </Box>
            <Spacer />
            <Box pr="5">
              <Button colorScheme="white" variant="outline" _hover={{ bg: "gray.700", color: "white" }}>
                <Link as={RouterLink} to="/login" sx={{_hover: {textDecoration: "none"}}}>Login</Link>
              </Button>
            </Box>
          </Flex>
          {/*Container for the rest of the page*/}
          <Flex>
            <Box border="1px" borderColor="gray.200" borderRadius="md">
              <Flex alignItems="flex-end" justifyContent="center" h="100%">
                hello
              </Flex>
            </Box>
            {/*Play Actions*/}
            <AbsoluteCenter  border="1px" borderColor="gray.200" borderRadius="md">
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
            </AbsoluteCenter>
          </Flex>
        </Box>
      </ChakraProvider>
    </Router>
  );
}

export default App;