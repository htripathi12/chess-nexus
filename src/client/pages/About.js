import React from 'react';
import { Box, Heading, Text, VStack, Icon, Flex, HStack, Center } from '@chakra-ui/react';
import { FaPuzzlePiece, FaBook, FaMicrochip } from 'react-icons/fa';

function About() {
    return (
        <Center minH="calc(100vh - 100px)" px={4}>
            <Box
                bg="gray.50"
                p={5}
                borderRadius="xl"
                boxShadow="md"
                maxW="700px"
                width="100%"
                border="2px solid #3182CE"
            >
                <VStack spacing={5} align="stretch">
                    <Heading as="h1" size="lg" color="black.700" textAlign="center">
                        About Chess Nexus
                    </Heading>

                    <Text fontSize="md" color="black.700">
                        Chess Nexus is a simple tool I built to help chess players study more effectively, using features
                        from both chess.com and lichess.org in one place.
                    </Text>

                    <Box
                        bg="white"
                        p={4}
                        borderRadius="lg"
                        boxShadow="lg"
                    >
                        <Heading as="h2" size="md" mb={4}>
                            What You Can Do Here
                        </Heading>
                        
                        <Flex direction="column" gap={8}>
                            <Box p={4} borderRadius="lg" boxShadow="sm">
                                <HStack mb={2}>
                                    <Icon as={FaPuzzlePiece} boxSize={5} color="teal.500" />
                                    <Heading as="h3" size="sm">
                                        Puzzle Practice
                                    </Heading>
                                </HStack>
                                <Text fontSize="sm">
                                    Work on tactical puzzles to improve your calculation skills. We've got thousands 
                                    of puzzles sorted by difficulty.
                                </Text>
                            </Box>

                            <Box p={4} borderRadius="lg" boxShadow="sm">
                                <HStack mb={2}>
                                    <Icon as={FaBook} boxSize={5} color="teal.500" />
                                    <Heading as="h3" size="sm">
                                        Opening Explorer
                                    </Heading>
                                </HStack>
                                <Text fontSize="sm">
                                    Check out different opening lines and see what moves are popular. Good for 
                                    preparing against specific opponents or learning new openings.
                                </Text>
                            </Box>

                            <Box p={4} borderRadius="lg" boxShadow="sm">
                                <HStack mb={2}>
                                    <Icon as={FaMicrochip} boxSize={5} color="teal.500" />
                                    <Heading as="h3" size="sm">
                                        Engine Analysis
                                    </Heading>
                                </HStack>
                                <Text fontSize="sm">
                                    Analyze your games with Stockfish to find mistakes and missed opportunities. 
                                    It runs right in your browser - no need to download anything.
                                </Text>
                            </Box>
                        </Flex>
                    </Box>
                </VStack>
            </Box>
        </Center>
    );
}

export default About;