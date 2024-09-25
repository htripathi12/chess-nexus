import React, { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Flex, Stack, Box, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import axios from 'axios';
import CustomBoard from '../components/CustomBoard';
import SolidButton from '../components/SolidButton';
import { Chess } from 'chess.js';

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
        const response = await axios.get(process.env.PUBLIC_URL + '/puzzle');
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
        <SolidButton to="/play">Play ♟️</SolidButton>
        <SolidButton to="/puzzles">Puzzles 🧩</SolidButton>
        <SolidButton to="/learn">Learn 📚</SolidButton>
      </Stack>
    </Flex>
  );
}
