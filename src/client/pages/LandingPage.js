import React, { useEffect, useRef, useState } from 'react';
import { Flex, Stack, Text } from '@chakra-ui/react';
import axios from 'axios';
import CustomBoard from '../components/CustomBoard';
import SolidButton from '../components/SolidButton';
import { Chess } from 'chess.js';

export default function LandingPage() {
  const chess = useRef(new Chess());

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <Flex align="center" mt="10" width="100%" justifyContent="center">
      <Stack spacing={4} direction="column" align="center">
        <SolidButton to="/play">Play ♟️</SolidButton>
        <SolidButton to="/puzzles">Puzzles 🧩</SolidButton>
        <SolidButton to="/learn">Learn 📚</SolidButton>
      </Stack>
    </Flex>
  );
}
