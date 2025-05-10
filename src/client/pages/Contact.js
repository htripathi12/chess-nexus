import React from 'react';
import { Box, Heading, Text, VStack, Image, Link, Flex, Icon, SimpleGrid } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { DiReact, DiNodejs, DiPython, DiJavascript1, DiJava, DiHtml5, DiMysql } from 'react-icons/di';
import { SiC, SiCplusplus } from "react-icons/si";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

function Contact() {
    const skills = [
        { name: 'React', icon: DiReact, color: '#00d8ff' },
        { name: 'Node.js', icon: DiNodejs, color: '#339933' },
        { name: 'Python', icon: DiPython, color: '#3776AB' },
        { name: 'JavaScript', icon: DiJavascript1, color: '#EBC700'},
        { name: 'SQL', icon: DiMysql, color: '#4479A1' },
        { name: 'Java', icon: DiJava, color: '#007396' },
        { name: 'C', icon: SiC, color: '#A8B9CC' },
        { name: 'C++', icon: SiCplusplus, color: '#00599C' },
        { name: 'HTML5', icon: DiHtml5, color: '#E34F26'}
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
                <Flex direction={['column', 'row']} align="center" justify="center">
                    <MotionBox
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Image
                            src="./assets/ProfilePic.jpg"
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

                <Text fontSize="sm" color="gray.700">
                    I'm a passionate software developer with expertise in building web applications.
                    Currently, I'm pursuing my undergraduate degree in Computer Science
                    at Purdue University as a sophomore concentrating in Software Engineering and Systems.
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
                        Professional Background
                    </Heading>
                    <Text fontSize="sm" color="gray.700" mb={3}>
                        I began my journey in the tech world through an entrepreneurial venture, running my
                        own shoe reselling business. It was there that I first dabbled in the development
                        of raffle bots, sparking my initial interest in computer science. This curiosity
                        pushed me to grow my programming skillset, eventually leading me to do R&D data science
                        research at Raytheon, providing me with a deeper insight into the field. Through
                        these experiences, I discovered my true passion lies in web development. Right now, I'm
                        working towards expanding my skills in React, SQL, and MongoDB, aiming
                        to become a full stack software engineer.
                    </Text>

                    <SimpleGrid columns={3} spacing={3} alignItems="center" justifyContent="space-evenly">
                        {skills.map((skill, index) => (
                            <MotionFlex
                                key={index}
                                align="center"
                                justify="center"
                                bg={skill.color}
                                color="white"
                                p={2}
                                borderRadius="md"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3, type: "spring", stiffness: 800, damping: 10 }}
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
                    boxShadow="xl"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Heading as="h2" size="md" color="teal.600" mb={3}>
                        Personal Interests
                    </Heading>
                    <Text fontSize="sm" color="gray.700">
                        Outside of work, I love playing basketball, video games, and skateboarding.
                        I also enjoy the thrill of poker, from the excitement of big hands and memories with friends
                        to the mathematical strategy behind the game. Coding is obviously a big part of my life,
                        but my passion for chess is even greater which is why I made Chess Nexus - the perfect combination of the two.
                    </Text>
                </MotionBox>

                <MotionBox
                    p={6}
                    bg="gray.50"
                    borderRadius="md"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Box w="50%" h="2px" bg="teal" mx="auto" mb={2}></Box>
                    <Box w="25%" h="2px" bg="teal" mx="auto" mb={2}></Box>
                    <Box w="2.5%" h="2px" bg="teal" mx="auto" mb={4}></Box>
                    <Flex
                        direction="column"
                        align="center"
                        justify="center"
                    >
                        <Box
                            fontSize="xs"
                            maxWidth={400}
                            textAlign="center"
                        >
                            Thank you all for visiting Chess Nexus! If you'd like to view the source code you can do so{' '}
                            <Link href="https://github.com/htripathi12/chess-nexus" isExternal color="blue.500">
                                here.
                            </Link>
                        </Box>
                    </Flex>
                </MotionBox>

            </VStack>
        </MotionBox>
    );
}

export default Contact;