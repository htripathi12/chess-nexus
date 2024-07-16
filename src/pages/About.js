import React from 'react';
import { Flex, Box, Heading, Text, VStack, Icon, SimpleGrid } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaChess, FaPuzzlePiece, FaBook, FaMicrochip, FaChartBar } from 'react-icons/fa';

const MotionBox = motion(Box);
const MotionSimpleGrid = motion(SimpleGrid);

function About() {
    const features = [
        { name: 'Game Analysis', icon: FaChess, description: 'Import and analyze your games from both chess.com and lichess.org in one place.' },
        { name: 'Puzzle Practice', icon: FaPuzzlePiece, description: 'Access a vast database of tactical puzzles from both platforms to sharpen your skills.' },
        { name: 'Opening Explorer', icon: FaBook, description: 'Improve your opening knowledge with a comprehensive database that combines information from both sites.' },
        { name: 'Engine Analysis', icon: FaMicrochip, description: 'Utilize the power of Stockfish, integrated via WebAssembly, for deep game analysis.' },
    ];

    return (
        <MotionBox
            bg="gray.50"
            p={[4, 6]}
            borderRadius="xl"
            boxShadow="2xl"
            maxW="800px"
            mx="auto"
            mt={10}
            mb={7}
            border={{ base: 'none', md: '2px solid #008080' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <VStack spacing={6} align="stretch">
                <Heading as="h1" size="xl" color="black.700" textAlign="center">
                    About Chess Nexus
                </Heading>

                <Text fontSize="md" color="black.700">
                    Chess Nexus is the ultimate bridge between chess.com and lichess.org, providing a unified study tool for chess enthusiasts. Our mission is to enhance your chess learning experience by combining the best features from both platforms.
                </Text>

                <MotionBox
                    bg="white"
                    p={4}
                    borderRadius="lg"
                    boxShadow="xl"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Heading as="h2" size="md" color="teal.600" mb={3}>
                        Key Features
                    </Heading>
                    <MotionSimpleGrid columns={[1, null, 2]} spacing={4}>
                        {features.map((feature, index) => (
                          <Flex justify="center" align="center">
                            <MotionBox
                              key={index}
                              p={3}
                              minWidth="300px"
                              height="150px"
                              borderRadius="md"
                              boxShadow="md"
                              bg="black.50"
                              initial={{ opacity: 0, x: -50 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <Icon as={feature.icon} boxSize={6} color="teal.500" mb={2} />
                              <Heading as="h3" size="sm" color="teal.600" mb={2}>
                                {feature.name}
                              </Heading>
                              <Text fontSize="sm" color="gray.700">
                                {feature.description}
                              </Text>
                            </MotionBox>
                          </Flex>
                        ))}
                    </MotionSimpleGrid>
                </MotionBox>

                <MotionBox
                    bg="white"
                    p={4}
                    borderRadius="lg"
                    boxShadow="xl"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Heading as="h2" size="md" color="teal.600" mb={3}>
                        Our Vision
                    </Heading>
                    <Text fontSize="sm" color="black.700">
                        Whether you're a casual player or a serious competitor, Chess Nexus provides the tools you need to take your game to the next level. By bridging the gap between chess.com and lichess.org, we offer a more comprehensive and efficient way to study and improve your chess.
                    </Text>
                </MotionBox>
            </VStack>
        </MotionBox>
    );
}

export default About;