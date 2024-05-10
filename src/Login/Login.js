import React, { useState } from 'react';
import { BrowserRouter as Router, Link as RouterLink } from 'react-router-dom';
import { Box, Center, Container, AbsoluteCenter, Flex, Link, Spacer, Button, Image, ChakraProvider, FormControl, FormLabel, 
        Input, Stack, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import OAuth2Callback from './auth.js';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
    }

    return (
        <>
        <Button marginTop="3" bg='teal.400' border="1px" display="flex" flexDirection="row" color="white" _hover={{ bg: "teal.700", color: "white" }}>
            <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-big-left-filled" 
                    width="27" height="27" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" 
                    stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M9.586 4l-6.586 6.586a2 2 0 0 0 0 2.828l6.586 6.586a2 2 0 0 0 2.18 .434l.145 -.068a2 2 0 0 
                        0 1.089 -1.78v-2.586h7a2 2 0 0 0 2 -2v-4l-.005 -.15a2 2 0 0 0 -1.995 -1.85l-7 -.001v-2.585a2 2 0
                        0 0 -3.414 -1.414z" stroke-width="0" fill="currentColor" />
                </svg>
            </Link>
            <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}><Text ml={2}>Back</Text></Link>
        </Button>
        <AbsoluteCenter>
            <Container bg='teal.600' borderRadius="30" w='500px' h='500px' color="white" p={5} shadow="2xl" border="2px" borderColor="gray.400">            
                <Tabs isFitted variant="soft-rounded">
                    <TabList mb="1em" border="1px" borderRadius="21px">
                        <Tab color="white" _hover={{ color: "white", bg: "teal.800"}} _active={{ transform: "translateX(10px)", 
                            transition: "transform 0.2s" }}>Login</Tab>
                        <Tab color="white" _hover={{ color: "white", bg: "teal.800"}} _active={{ transform: "translateX(10px)", 
                            transition: "transform 0.2s" }}>Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <form>
                                <Stack spacing={3}>
                                    <FormControl id="loginEmail">
                                        <FormLabel>Email address</FormLabel>
                                        <Input type="email" />
                                    </FormControl>
                                    <FormControl id="loginPassword">
                                        <FormLabel>Password</FormLabel>
                                        <Input type="password" />
                                    </FormControl>
                                    <Button mt={4} colorScheme="teal" type="submit" _hover={{ bg: "teal.800" }}>
                                        Login
                                    </Button>
                                    <Flex align="center" my="4">
                                        <Box flex="1" height="1px" bg="white" />
                                        <Text mx="2" color="white" fontSize="sm" fontWeight="700">Provider Login</Text>
                                        <Box flex="1" height="1px" bg="white" />
                                    </Flex>

                                    <Box display="flex" justifyContent="space-evenly" paddingTop="10px">
                                        <Button onClick={OAuth2Callback} bg="transparent" _hover={{ bg: "transparent" }}>
                                            <Image src="/chesscom.png" alt="chess.com" width="100px" borderRadius="5px" />
                                        </Button>
                                        <Button onClick={OAuth2Callback} bg="transparent" _hover={{ bg: "transparent" }}>
                                            <Image src="lichess.png" alt="lichess.org" width="135px" borderRadius="5px"/>
                                        </Button>
                                    </Box>
                                </Stack>
                            </form>
                        </TabPanel>
                        <TabPanel>
                            <form onSubmit={handleSubmit}>
                                <Stack spacing={3}>
                                <FormControl id="signupEmail">
                                    <FormLabel>Email address</FormLabel>
                                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                                </FormControl>
                                <FormControl id="signupPassword">
                                    <FormLabel>Password</FormLabel>
                                    <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                                </FormControl>
                                <Button mt={4} colorScheme="teal" type="submit" _hover={{ bg: "teal.800" }}>
                                    Sign Up
                                </Button>
                                    <Flex align="center" my="4">
                                        <Box flex="1" height="1px" bg="white" />
                                        <Text mx="2" color="white" fontSize="sm" fontWeight="700">Provider Signup</Text>
                                        <Box flex="1" height="1px" bg="white" />
                                    </Flex>

                                    <Box display="flex" justifyContent="space-evenly" paddingTop="10px">
                                        <Button onClick={OAuth2Callback} bg="transparent" _hover={{ bg: "transparent" }}>
                                            <Image src="/chesscom.png" alt="chess.com" width="100px" borderRadius="5px" />
                                        </Button>
                                        <Button onClick={OAuth2Callback} bg="transparent" _hover={{ bg: "transparent" }}>
                                            <Image src="lichess.png" alt="lichess.org" width="135px" borderRadius="5px"/>
                                        </Button>
                                    </Box>
                                </Stack>
                            </form>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Container>
        </AbsoluteCenter>
        </>
    );
}


export default Login;