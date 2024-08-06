import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Chess } from 'chess.js';

const EvaluationBar = ({ evaluation, orientation, isMate, fen }) => {
  const scoreToPercentage = (score) => {
    const cappedScore = Math.max(-10, Math.min(10, score));
    return ((cappedScore + 10) / 20) * 100;
  };

  let displayValue;
  let percentage;
  let playerToMove = fen.split(' ')[1];
  let tempChess = new Chess(fen);

  if (isMate) {
    let mateEval = playerToMove === 'w' ? evaluation : -evaluation;
    displayValue = `M${Math.abs(mateEval)}`;
    percentage = mateEval > 0 ? 100 : 0;
  } else {
    percentage = scoreToPercentage(evaluation);
    displayValue = evaluation > 0 ? `+${evaluation.toFixed(2)}` : evaluation.toFixed(2);
  }

  if (tempChess.isCheckmate()) {
    if (orientation === 'black') {
        (playerToMove === 'w') ? displayValue = '1-0' : displayValue = '0-1';
    } else {
        (playerToMove === 'w') ? displayValue = '0-1' : displayValue = '1-0';
    }
    percentage = 50;
  }


  const evaluationBoxHeight = 20;
  const containerHeight = 500;
  let pixelPosition = (percentage / 100) * containerHeight;
  pixelPosition = Math.max(evaluationBoxHeight / 2, Math.min(containerHeight - (evaluationBoxHeight / 2), pixelPosition));
  const textBoxPosition = orientation === 'black' ? `${(pixelPosition / containerHeight) * 100}%` : `${100 - (pixelPosition / containerHeight) * 100}%`;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      height="500px"
      width="50px"
      border="1px solid #008080"
      borderRadius="5px"
      overflow="hidden"
      position="relative"
      background="linear-gradient(to top, #f0f0f0, #ffffff)"
      boxShadow="0 5px 15px rgba(0, 0, 0, 0.5)"
    >
      <Box
        position="absolute"
        bottom="0"
        height="100%"
        width="100%"
        background={orientation === 'black' ? `linear-gradient(to bottom, #FFFFFF ${percentage}%, #008080 ${percentage}%)` : `linear-gradient(to top, #FFFFFF ${percentage}%, #008080 ${percentage}%)`}
        transition="background 0.5s ease"
      />
      <Box
        position="absolute"
        top={textBoxPosition}
        left="0"
        width="100%"
        transform="translateY(-50%)"
        backgroundColor="rgba(0, 0, 0, 0.75)"
        padding="2px 0"
        textAlign="center"
        borderRadius="4px"
      >
        <Text fontSize="sm" fontWeight="bold" color="white">
          {displayValue}
        </Text>
      </Box>
    </Box>
  );
};

export default EvaluationBar;