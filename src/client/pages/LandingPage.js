import React, { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Flex, Stack, Box, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import axios from 'axios';
import CustomBoard from '../components/CustomBoard';
import { Chess } from 'chess.js';

const GradientButton = ({ to, children }) => (
  <Box
    as={RouterLink}
    to={to}
    position="relative"
    width="400px"
    height="100px"
    overflow="hidden"
    borderRadius="lg"
    boxShadow="lg"
    mb={4}
  >
    <motion.div
      initial={{ scale: 1, background: 'linear-gradient(90deg, #81E6D9, #319795)' }}
      whileHover={{ scale: 1.05, background: 'linear-gradient(90deg, #319795, #81E6D9)' }}
      transition={{ duration: 0.3 }}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 'lg',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text fontSize="2xl" fontWeight="bold" color="white">
        {children}
      </Text>
    </motion.div>
  </Box>
);

export default function LandingPage() {
  const [fen, setFen] = useState(null);
  const chess = useRef(new Chess());

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const fetchPuzzle = async () => {
      try {
        const response = await axios.get('http://localhost:8080/puzzle');
        console.log(response.data.puzzle.body.fen);
        chess.current.load(response.data.puzzle.body.fen);
        const currentFEN = chess.current.fen();
        setFen(currentFEN);
        localStorage.setItem('lastPuzzleFEN', currentFEN);
        localStorage.setItem('lastPuzzleFetchDate', new Date().toISOString());
      } catch (error) {
        console.error(error);
      }
    };

    fetchPuzzle();

    const intervalId = setInterval(fetchPuzzle, 86400000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Flex align="center" mt="10" width="100%" justifyContent="center">
      {fen ? (
        <CustomBoard key={fen} fen={fen} chessInstance={chess.current} setFen={setFen} />
      ) : (
        <Text>Loading puzzle...</Text>
      )}
      <Stack spacing={4} direction="column" align="center" pl="150px">
        <GradientButton to="/play">Play ♟️</GradientButton>
        <GradientButton to="/puzzles">Puzzles 🧩</GradientButton>
        <GradientButton to="/learn">Learn 📚</GradientButton>
      </Stack>
    </Flex>
  );
}