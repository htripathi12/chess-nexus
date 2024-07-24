import React from 'react';
import Axios from 'axios';
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Container,
  Text,
} from '@chakra-ui/react';

import { useAuth } from '../AuthContext';

function Account() {
  const { chesscomUsername, setChesscomUsername, lichessUsername, setLichessUsername, getToken } = useAuth();
  const toast = useToast();

  const handleChesscomSubmit = (e) => {
    e.preventDefault();
    if (chesscomUsername.trim()) {
      console.log('Chess.com username:', chesscomUsername);
      
      Axios.post('http://localhost:8080/account/chesscom', 
        { chesscomUsername },
        {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        }
      ).then((response) => {
        console.log(response);
        toast({
          title: 'Connected Chess.com username!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }).catch((error) => {
        console.error(error);
        toast({
          title: 'Failed to connect Chess.com username',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
    }
  };
  
  const handleLichessSubmit = (e) => {
    e.preventDefault();
    if (lichessUsername.trim()) {
      console.log('Lichess username:', lichessUsername);
      
      Axios.post('http://localhost:8080/account/lichess', 
        { lichessUsername },
        {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        }
      ).then((response) => {
        console.log(response);
        toast({
          title: 'Connected Lichess username!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }).catch((error) => {
        console.error(error);
        toast({
          title: 'Failed to connect Lichess username',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <Box bg="white" p={8} borderRadius="lg" boxShadow="lg">
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="xl" textAlign="center" color="teal.500">
            Connect Your Accounts
          </Heading>
          
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={2}>Chess.com</Text>
            <form onSubmit={handleChesscomSubmit}>
              <VStack spacing={4}>
                <FormControl id="chesscom-username">
                  <FormLabel>Chess.com Username</FormLabel>
                  <Input 
                    type="text" 
                    value={chesscomUsername}
                    onChange={(e) => setChesscomUsername(e.target.value)}
                    placeholder="Enter your Chess.com username"
                  />
                </FormControl>
                <Button 
                  type="submit" 
                  colorScheme="teal" 
                  size="md" 
                  width="full"
                  isDisabled={!chesscomUsername.trim()}
                >
                  Connect Chess.com
                </Button>
              </VStack>
            </form>
          </Box>

          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={2}>Lichess</Text>
            <form onSubmit={handleLichessSubmit}>
              <VStack spacing={4}>
                <FormControl id="lichess-username">
                  <FormLabel>Lichess Username</FormLabel>
                  <Input 
                    type="text"
                    value={lichessUsername}
                    onChange={(e) => setLichessUsername(e.target.value)}
                    placeholder="Enter your Lichess username"
                  />
                </FormControl>
                <Button 
                  type="submit" 
                  colorScheme="teal" 
                  size="md" 
                  width="full"
                  isDisabled={!lichessUsername.trim()}
                >
                  Connect Lichess
                </Button>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Box>
    </Container>
  );
}

export default Account;