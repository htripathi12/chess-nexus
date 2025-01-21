import React, { useEffect } from 'react';
import { Flex, Stack } from '@chakra-ui/react';
import SolidButton from '../components/SolidButton';

export default function LandingPage() {
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
