import React from "react";
import { BrowserRouter as Router, Link as RouterLink } from 'react-router-dom';
import { Box, Center, Container, AbsoluteCenter, Flex, Link, Spacer, Button, ChakraProvider, FormControl, FormLabel, 
        Input, Stack, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

function Login() {
    return (
        <>
        <Button marginTop="3" bg='teal.400' border="1px" display="flex" flexDirection="row" color="white" _hover={{ bg: "teal.700", color: "white" }}>
            <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-big-left-filled" width="27" height="27" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M9.586 4l-6.586 6.586a2 2 0 0 0 0 2.828l6.586 6.586a2 2 0 0 0 2.18 .434l.145 -.068a2 2 0 0 0 1.089 -1.78v-2.586h7a2 2 0 0 0 2 -2v-4l-.005 -.15a2 2 0 0 0 -1.995 -1.85l-7 -.001v-2.585a2 2 0 0 0 -3.414 -1.414z" stroke-width="0" fill="currentColor" />
            </svg>
            </Link>
            <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}><Text ml={2}>Back</Text></Link>
        </Button>
        <AbsoluteCenter>
            <Container bg='teal.600' borderRadius="30" w='500px' h='400px' color="white" p={5} shadow="2xl"border="2px" borderColor="gray.400">            
                <Tabs isFitted variant="soft-rounded">
                    <TabList mb="1em">
                        <Tab color="white" _hover={{ color: "white", bg: "teal.800"}}>Login</Tab>
                        <Tab color="white" _hover={{ color: "white", bg: "teal.800" }}>Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <form>
                                <Stack spacing={3}>
                                    <FormControl id="email">
                                        <FormLabel>Email address</FormLabel>
                                        <Input type="email" />
                                    </FormControl>
                                    <FormControl id="password">
                                        <FormLabel>Password</FormLabel>
                                        <Input type="password" />
                                    </FormControl>
                                    <Button mt={4} colorScheme="teal" type="submit" _hover={{ bg: "teal.800" }}>
                                        Login
                                    </Button>
                                </Stack>
                            </form>
                        </TabPanel>
                        <TabPanel>
                            <form>
                                <Stack spacing={3}>
                                    <FormControl id="email">
                                        <FormLabel>Email address</FormLabel>
                                        <Input type="email" />
                                    </FormControl>
                                    <FormControl id="password">
                                        <FormLabel>Password</FormLabel>
                                        <Input type="password" />
                                    </FormControl>
                                    <Button mt={4} colorScheme="teal" type="submit" _hover={{ bg: "teal.800" }}>
                                        Sign Up
                                    </Button>
                                </Stack>
                            </form>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Container>
        </AbsoluteCenter></>
    );
}

export default Login;