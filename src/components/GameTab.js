import React from 'react';
import { VStack, Text, Button, Flex } from '@chakra-ui/react';

function GameTab({ games, currentPage, totalPages, onPageChange }) {
    const gamesArray = Array.isArray(games) ? games : [];

    return (
        <VStack spacing={4} align="stretch" width="100%">
            {gamesArray.map((game, index) => (
                <Text key={index} fontSize="sm">
                    {game}
                </Text>
            ))}
            <Flex justifyContent="space-between" mt={4} width="100%">
                <Button 
                    onClick={() => onPageChange(currentPage - 1)} 
                    isDisabled={currentPage === 1}
                >
                    Previous
                </Button>
                <Text>Page {currentPage} of {totalPages}</Text>
                <Button 
                    onClick={() => onPageChange(currentPage + 1)} 
                    isDisabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </Flex>
        </VStack>
    );
}

export default GameTab;