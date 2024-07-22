import React, { useState } from 'react';
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
} from '@chakra-ui/react';

function Account() {
  const [chesscomUsername, setChesscomUsername] = useState('');
  const [lichessUsername, setLichessUsername] = useState('');
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Chess.com username:', chesscomUsername);
    console.log('Lichess username:', lichessUsername);
    
    toast({
      title: 'Usernames submitted',
      description: 'Your usernames have been logged to the console.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.md" py={10}>
      <Box bg="white" p={8} borderRadius="lg" boxShadow="lg">
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="xl" textAlign="center" color="teal.500">
            Account Settings
          </Heading>
          <form onSubmit={handleSubmit}>
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
                size="lg" 
                width="full"
              >
                Save Changes
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Container>
  );
}

export default Account;