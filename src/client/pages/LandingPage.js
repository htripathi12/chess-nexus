import { useEffect } from 'react';
import { Flex, Text, Box, Button, SimpleGrid } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionText = motion(Text);
const MotionButton = motion(Button);

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/play');
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding="20px"
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity="0.1"
        backgroundRepeat="repeat"
      />

      <Flex
        direction="column"
        align="center"
        justify="center"
        maxWidth="1200px"
        width="100%"
        zIndex="1"
      >
        <MotionBox
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          textAlign="center"
          marginBottom="60px"
        >
          <MotionText
            fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
            fontWeight="bold"
            color="white"
            lineHeight="1.2"
            marginBottom="20px"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Text as="span" >Chess Nexus</Text>
          </MotionText>
          
          <MotionText
            fontSize={{ base: "lg", md: "xl" }}
            color="rgba(255, 255, 255, 0.9)"
            maxWidth="700px"
            margin="0 auto"
            lineHeight="1.6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            A simple tool that brings the best features from chess.com and lichess.org together in one place. 
            Analyze games, solve puzzles, and explore openings with powerful tools designed for serious chess study.
          </MotionText>
        </MotionBox>

        <MotionButton
          onClick={handleGetStarted}
          size="lg"
          bg="white"
          color="#008080"
          fontSize="xl"
          fontWeight="bold"
          padding="30px 50px"
          borderRadius="50px"
          boxShadow="0 8px 25px rgba(0, 0, 0, 0.2)"
          _hover={{
            bg: "#f8f8f8",
            transform: "translateY(-2px)",
            boxShadow: "0 12px 35px rgba(0, 0, 0, 0.25)"
          }}
          _active={{
            transform: "translateY(0px)"
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          marginBottom="80px"
        >
          Start Studying Now
        </MotionButton>

        <MotionBox
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          width="100%"
        >
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing="40px" maxWidth="900px" margin="0 auto">
            <MotionBox
              bg="rgba(255, 255, 255, 0.1)"
              backdropFilter="blur(10px)"
              borderRadius="20px"
              padding="40px 30px"
              textAlign="center"
              border="1px solid rgba(255, 255, 255, 0.2)"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.5 }}
              cursor="pointer"
              onClick={() => navigate('/puzzles')}
            >
              <Box
                fontSize="4xl"
                marginBottom="20px"
                color="white"
              >
                🧩
              </Box>
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="white"
                marginBottom="15px"
              >
                Puzzle Practice
              </Text>
              <Text
                color="rgba(255, 255, 255, 0.8)"
                lineHeight="1.6"
              >
                Work on tactical puzzles to improve your calculation skills. Thousands of puzzles sorted by difficulty.
              </Text>
            </MotionBox>

            <MotionBox
              bg="rgba(255, 255, 255, 0.1)"
              backdropFilter="blur(10px)"
              borderRadius="20px"
              padding="40px 30px"
              textAlign="center"
              border="1px solid rgba(255, 255, 255, 0.2)"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.5 }}
              cursor="pointer"
              onClick={() => navigate('/play')}
            >
              <Box
                fontSize="4xl"
                marginBottom="20px"
                color="white"
              >
                🔧
              </Box>
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="white"
                marginBottom="15px"
              >
                Engine Analysis
              </Text>
              <Text
                color="rgba(255, 255, 255, 0.8)"
                lineHeight="1.6"
              >
                Analyze your games with Stockfish to find mistakes and missed opportunities. Runs right in your browser.
              </Text>
            </MotionBox>

            <MotionBox
              bg="rgba(255, 255, 255, 0.1)"
              backdropFilter="blur(10px)"
              borderRadius="20px"
              padding="40px 30px"
              textAlign="center"
              border="1px solid rgba(255, 255, 255, 0.2)"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.5 }}
              cursor="pointer"
              onClick={() => navigate('/learn')}
            >
              <Box
                fontSize="4xl"
                marginBottom="20px"
                color="white"
              >
                📖
              </Box>
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="white"
                marginBottom="15px"
              >
                Opening Explorer
              </Text>
              <Text
                color="rgba(255, 255, 255, 0.8)"
                lineHeight="1.6"
              >
                Check out different opening lines and see what moves are popular. Perfect for preparation and learning.
              </Text>
            </MotionBox>
          </SimpleGrid>
        </MotionBox>
      </Flex>
    </Box>
  );
}