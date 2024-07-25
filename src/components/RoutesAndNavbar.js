import React, { useState, useEffect } from 'react';
import {
  Box, Center, Container, Flex, Link, Text, Spacer, Button, Menu,
  MenuButton, MenuList, MenuItem
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import your existing components
import Play from '../pages/Play.js';
import Puzzles from '../pages/Puzzles';
import Learn from '../pages/Learn.js';
import Login from '../pages/Login.js';
import Signup from '../pages/Signup.js';
import About from '../pages/About.js'
import Contact from '../pages/Contact.js';
import IntroPage from '../pages/IntroPage.js';
import Account from '../pages/Account.js';

// Import Contexts
import { useAuth } from '../AuthContext.js';

const MotionBox = motion(Box);

function RoutesAndNavbar() {
  const location = useLocation();
  const [showIntro, setShowIntro] = useState(location.pathname === '/');
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== '/') {
      setShowIntro(false);
    }
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      {showIntro ? (
        <IntroPage key="intro" onEnter={() => setShowIntro(false)} />
      ) : (
        <MotionBox
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {(location.pathname !== '/login' && location.pathname !== '/signup') && (
            <Flex as="nav" bg="teal.500" color="white" p={5} maxH={20}>
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
                {isLoggedIn ? (
                  <Menu>
                    <MenuButton
                      as={Button}  
                      backgroundColor="teal.500"
                      _hover={{ bg: "teal.600" }} 
                      _active={{ bg: "teal.600" }}
                      width="60px"
                      height="60px"
                      borderRadius="full"
                      transition="all 0.2s"
                      p={0}
                      position="relative"
                      top="-7px"
                    >
                      <Box
                        as="span"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        width="100%"
                        height="100%"
                        transition="transform 0.2s, box-shadow 0.2s"
                        _hover={{
                          boxShadow: "0 0 8px 2px rgba(0, 128, 128, 0.6)"
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-user-circle"
                          width="55"
                          height="55"
                          viewBox="0 0 24 24"
                          strokeWidth="1.1"
                          stroke="#FFFFFF"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                          <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                          <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
                        </svg>
                      </Box>
                    </MenuButton>
                    <MenuList textColor="black">
                      <MenuItem onClick={() => navigate("/account")}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-invoice" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                          <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                          <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                          <path d="M9 7l1 0" />
                          <path d="M9 13l6 0" />
                          <path d="M13 17l2 0" />
                        </svg>
                        <Text paddingLeft={3}>Account</Text>
                      </MenuItem>
                      <MenuItem onClick={logout}>
                        <svg fill="none" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '3px' }}>
                          <path d="M17 16L21 12M21 12L17 8M21 12L7 12M13 16V17C13 18.6569 11.6569 20 10 20H6C4.34315 20 
                          3 18.6569 3 17V7C3 5.34315 4.34315 4 6 4H10C11.6569 4 13 5.34315 13 7V8" stroke="black"
                            strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                        </svg>
                        <Text paddingLeft={2}>Sign Out</Text>
                      </MenuItem>
                    </MenuList>
                  </Menu>
              ) : (
                <Link as={RouterLink} to="/login" _hover={{ textDecoration: "none" }}>
                  <Button colorScheme="white" variant="outline" _hover={{ bg: "teal.700", color: "white" }}>
                      Login
                  </Button>
                </Link>
              )}
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
              <Route path="/signup" element={<Signup />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="account" element={<Account />} />
            </Routes>
          </Container>
        </MotionBox>
      )}
    </AnimatePresence>
  );
}

export default RoutesAndNavbar;