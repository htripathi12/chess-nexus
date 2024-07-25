import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Container, VStack, Button, FormControl, FormLabel, 
  Input, Text, Heading, useToast, InputGroup, InputRightElement
} from '@chakra-ui/react';
import BackButton from '../components/BackButton';
import { useAuth } from '../AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();
    const { login, setLichessUsername, setChesscomUsername } = useAuth();

    const handleLogin = (e) => {
        e.preventDefault();
        Axios.post('http://localhost:8080/login', {
            email: email,
            password: password,
        }).then((response) => {
            const { lichessUsername, chesscomUsername, token } = response.data;
            login(token, lichessUsername, chesscomUsername);
            toast({
                title: "Login successful.",
                description: "You've been logged in.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            navigate('/')
        }).catch((error) => {
            console.error('There was an error!', error);
            toast({
                title: "An error occurred.",
                description: "Unable to log in.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        });
    }

    return (
        <Box minHeight="100vh" py={12}>
            <Box position="absolute" top="20px" left="20px">
                <BackButton />
            </Box>
            <Container position="relative" display="flex" justifyContent="center" pt={32}>
                <VStack 
                    spacing={8} 
                    bg="white" 
                    boxShadow="xl" 
                    borderRadius="xl" 
                    border={{ base: 'none', md: '2px solid #008080' }}
                    p={8}
                    height="500px"
                    width="500px"
                    align="stretch"
                >
                    <Heading textAlign="center" color="teal.500">Login</Heading>
                    <form onSubmit={handleLogin}>
                        <VStack spacing={4}>
                            <FormControl id="loginEmail" isRequired>
                                <FormLabel>Email address</FormLabel>
                                <Input 
                                    type="email" 
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    focusBorderColor="teal.400"
                                    borderColor="gray.400"
                                />
                            </FormControl>
                            <FormControl id="loginPassword" isRequired>
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <Input 
                                        type={showPassword ? "text" : "password"}
                                        value={password} 
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        focusBorderColor="teal.400"
                                        borderColor="gray.400"
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? "Hide" : "Show"}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <Button 
                                mt={4} 
                                colorScheme="teal" 
                                type="submit" 
                                width="full"
                                _hover={{ bg: "teal.600" }}
                            >
                                Login
                            </Button>
                        </VStack>
                    </form>
                    <Text textAlign="center" mt={6}>
                        Don't have an account?{" "}
                        <Button 
                            variant="link" 
                            color="teal.500" 
                            onClick={() => navigate('/signup')}
                            _hover={{ color: "teal.600" }}
                        >
                            Sign Up
                        </Button>
                    </Text>
                </VStack>
            </Container>
        </Box>
    );
}

export default Login;