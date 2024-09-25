import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const SolidButton = ({ to, children }) => (
    <Box
      as={RouterLink}
      to={to}
      position="relative"
      width="400px"
      height="100px"
      overflow="hidden"
      border="1px solid #2A6E6D"    
      borderRadius="lg"
      boxShadow="xl"
      mb={4}
      bg="#319795"
      _hover={{ bg: "#2C7A7B" }}
    >
      <motion.div
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
  
export default SolidButton;