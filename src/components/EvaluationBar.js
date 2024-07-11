import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const EvaluationBar = ({ evaluation, orientation }) => {
  const scoreToPercentage = (score) => {
    const cappedScore = Math.max(-10, Math.min(10, score));
    return ((cappedScore + 10) / 20) * 100;
  };

  const percentage = scoreToPercentage(evaluation);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      height="500"
      width="50px"
      border="1px solid #ccc"
      borderRadius="5px"
      overflow="hidden"
      position="relative"
    >
      <Box
              position="absolute"
              bottom="0"
              height="100%"
              width="100%"
              background={orientation === 'black' ? `linear-gradient(to bottom, white ${percentage}%, #008080 ${percentage}%)` : `linear-gradient(to top, white ${percentage}%, #008080 ${percentage}%)`}
            />
      <Text position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" fontSize="md" fontWeight="bold">
        {evaluation > 0 ? `+${evaluation}` : evaluation}
      </Text>
    </Box>
  );
};

export default EvaluationBar;
