import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const EvaluationBar = ({ evaluation, orientation }) => {
  const scoreToPercentage = (score) => {
    const cappedScore = Math.max(-10, Math.min(10, score));
    return ((cappedScore + 10) / 20) * 100;
  };

  const percentage = scoreToPercentage(evaluation);
  const textBoxPosition = `${100 - percentage}%`;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      height="500px"
      width="60px"
      border="1px solid #ccc"
      borderRadius="5px"
      overflow="hidden"
      position="relative"
      background="linear-gradient(to top, #f0f0f0, #ffffff)"
    >
      <Box
        position="absolute"
        bottom="0"
        height="100%"
        width="100%"
        background={orientation === 'black' ? `linear-gradient(to bottom, #008080 ${percentage}%, #FFFFFF ${percentage}%)` : `linear-gradient(to top, #008080 ${percentage}%, #FFFFFF ${percentage}%)`}
        transition="background 0.5s ease"
      />
      <Box
        position="absolute"
        top={textBoxPosition}
        left="50%"
        transform="translate(-50%, -50%)"
        backgroundColor="rgba(0, 0, 0, 0.75)"
        padding="2px 6px"
        borderRadius="4px"
      >
        <Text fontSize="sm" fontWeight="bold" color="white">
          {evaluation > 0 ? `+${evaluation}` : evaluation}
        </Text>
      </Box>
    </Box>
  );
};

export default EvaluationBar;
