import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, AbsoluteCenter, Button, FormControl, FormLabel, Input, Stack, Text} from '@chakra-ui/react';
import BackButton from '../components/BackButton';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        Axios.post('http://localhost:8080/login', {
            email: email,
            password: password,
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.error('There was an error!', error);
        });
    }

    return (
        <>
        <BackButton />
        <AbsoluteCenter>
            <Container bg='teal.600' borderRadius="30" w='500px' h='500px' color="white" p={5} shadow="2xl" border="2px" borderColor="gray.400">            
                <Text fontSize="2xl" fontWeight="bold" mb={4}>Login</Text>
                <form onSubmit={handleLogin}>
                    <Stack spacing={3}>
                        <FormControl id="loginEmail">
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                        </FormControl>
                        <FormControl id="loginPassword">
                            <FormLabel>Password</FormLabel>
                            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                        </FormControl>
                        <Button mt={4} colorScheme="teal" type="submit" _hover={{ bg: "teal.800" }}>
                            Login
                        </Button>
                    </Stack>
                </form>
                <Text mt={4}>Don't have an account?</Text>
                <Button mt={2} colorScheme="teal" onClick={() => navigate('/signup')} _hover={{ bg: "teal.800" }}>
                    Sign Up
                </Button>
            </Container>
        </AbsoluteCenter>
        </>
    );
}

export default Login;