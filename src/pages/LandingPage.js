import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Flex, Stack, Box, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import CustomBoard from '../components/CustomBoard';

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
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
      <Flex align="center" mt="10" width="100%" justifyContent="center">
          <CustomBoard
              disableBoard={true}
          
          />
      <Stack spacing={4} direction="column" align="center" pl="150px">
        <GradientButton to="/play">Play</GradientButton>
        <GradientButton to="/puzzles">Puzzles</GradientButton>
        <GradientButton to="/learn">Learn</GradientButton>
      </Stack>
    </Flex>
  );
}