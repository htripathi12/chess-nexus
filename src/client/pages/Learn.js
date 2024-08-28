import React from 'react';
import BackButton from '../components/BackButton.js';
import { Box, Text, Center } from '@chakra-ui/react';

function Learn() {
    return (
        <div>
            <BackButton />
            <Center height="80vh">
                <Box 
                    p={100} 
                    bg="teal.50"
                    border="1px solid"
                    borderColor="teal.700"
                    borderRadius="xl" 
                    boxShadow="lg" 
                    textAlign="center"
                >
                    <Text fontSize="2xl" fontWeight="bold" color="teal.600">
                        This portion of the website is still under development.
                    </Text>
                    <Text fontSize="lg" color="teal.500" mt={4}>
                        Check back soon for exciting new features!
                    </Text>
                </Box>
            </Center>

        </div>
    );
}
export default Learn;