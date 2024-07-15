import React from 'react';
import { Box, Heading, Text, VStack, Image, Button, Flex, Icon, SimpleGrid } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { DiReact, DiNodejs, DiPython } from 'react-icons/di';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

function Contact() {
    const skills = [
        { name: 'React', icon: DiReact, color: 'blue.500' },
        { name: 'Node.js', icon: DiNodejs, color: 'green.500' },
        { name: 'Python', icon: DiPython, color: 'yellow.500' },
    ];

    return (
        <MotionBox
            bg="gray.50"
            p={[4, 6]}
            borderRadius="xl"
            boxShadow="xl"
            maxW="800px"
            mx="auto"
            mt={8}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <VStack spacing={6} align="stretch">
                <Flex direction={['column', 'row']} align="center" justify="space-between">
                    <MotionBox
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Image
                            src="https://via.placeholder.com/130"
                            alt="Profile Picture"
                            borderRadius="full"
                            boxSize="130px"
                            objectFit="cover"
                        />
                    </MotionBox>
                    <Box ml={[0, 6]} mt={[4, 0]}>
                        <Heading as="h1" size="lg" color="teal.700">
                            Hersh Tripathi
                        </Heading>
                        <Text fontSize="lg" color="teal.600" fontWeight="bold">
                            Software Developer
                        </Text>
                        <Flex mt={2}>
                          <a href="https://www.linkedin.com/in/hersh-tripathi-663a47225/" target="_blank" rel="noopener noreferrer">
                            <Icon
                              as={FaLinkedin}
                              boxSize={8}
                              color="teal.500"
                              mr={3}
                              cursor="pointer"
                              _hover={{ color: 'teal.700', transform: 'scale(1.2)' }}
                              transition="transform 0.2s ease-in-out"
                            />
                          </a>
                          <a href="https://github.com/htripathi12" target="_blank" rel="noopener noreferrer">
                            <Icon
                              as={FaGithub}
                              boxSize={8}
                              color="teal.500"
                              mr={3}
                              cursor="pointer"
                              _hover={{ color: 'teal.700', transform: 'scale(1.2)' }}
                              transition="transform 0.2s ease-in-out"
                            />
                          </a>
                          <a href="mailto:tripathihersh@gmail.com">
                            <Icon
                              as={FaEnvelope}
                              boxSize={8}
                              color="teal.500"
                              mr={3}
                              cursor="pointer"
                              _hover={{ color: 'teal.700', transform: 'scale(1.2)' }}
                              transition="transform 0.2s ease-in-out"
                            />
                          </a>
                        </Flex>
                    </Box>
                </Flex>

                <Text fontSize="md" color="gray.700">
                    I'm a passionate software developer with expertise in building web applications.
                    Currently I'm pursuing my undergraduate degree as a sophomore in Computer Science
                    at Purdue University. 
                </Text>

                <MotionBox
                    bg="white"
                    p={4}
                    borderRadius="lg"
                    boxShadow="md"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Heading as="h2" size="md" color="teal.600" mb={3}>
                        Professional Background
                    </Heading>
                    <Text fontSize="sm" color="gray.700" mb={3}>
                        I have a strong background in software development, having worked on multiple projects across various domains.
                        My core competencies include React, Node.js, and Python. I am also proficient in cloud technologies such as AWS and Azure.
                    </Text>
                    <SimpleGrid columns={3} spacing={3}>
                        {skills.map((skill, index) => (
                            <MotionFlex
                                key={index}
                                align="center"
                                justify="center"
                                bg={skill.color}
                                color="white"
                                p={2}
                                borderRadius="md"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                            >
                                <Icon as={skill.icon} boxSize={5} mr={1} />
                                <Text fontSize="sm" fontWeight="bold">{skill.name}</Text>
                            </MotionFlex>
                        ))}
                    </SimpleGrid>
                </MotionBox>

                <MotionBox
                    bg="white"
                    p={4}
                    borderRadius="lg"
                    boxShadow="md"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Heading as="h2" size="md" color="teal.600" mb={3}>
                        Personal Interests
                    </Heading>
                    <Text fontSize="sm" color="gray.700">
                        Outside of work, I enjoy hiking, reading, and exploring new places. I am also an avid chess player and love to participate in local tournaments.
                    </Text>
                </MotionBox>

                <Button
                    as={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    bg="teal.400"
                    color="white"
                    _hover={{ bg: "teal.500" }}
                    size="md"
                    leftIcon={<FaEnvelope />}
                >
                    Contact Me
                </Button>
            </VStack>
        </MotionBox>
    );
}

export default Contact;