import React from "react";
import { Box, Center, Container, AbsoluteCenter, Flex, Link, Spacer, Button, ChakraProvider, FormControl, FormLabel, 
        Input, Stack, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

function Login() {
    return (
        <AbsoluteCenter>
            <Container bg='teal.600' borderRadius="30" w='500px' h='400px' color="white" p={5}>
                <Tabs isFitted variant="enclosed">
                    <TabList mb="1em">
                        <Tab color="white" _hover={{ bg: "teal.800" }}>Login</Tab>
                        <Tab color="white" _hover={{ bg: "teal.800" }}>Sign Up</Tab>
                    </TabList>
                    <TabPanels paddingTop="0px;">
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
        </AbsoluteCenter>
    );
}

export default Login;