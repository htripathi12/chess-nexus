import React, { useEffect, useState } from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';

const MotionBox = motion(Box);

function IntroPage({ onEnter }) {
  const controls = useAnimation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const sequence = async () => {
        await controls.start("welcome");
        await new Promise(resolve => setTimeout(resolve, 400));
        await controls.start("to");
        await new Promise(resolve => setTimeout(resolve, 400));
        await controls.start("chessNexus");
        await new Promise(resolve => setTimeout(resolve, 750));
        await controls.start("fadeOut");
        await new Promise(resolve => setTimeout(resolve, 500));
        onEnter();
      };
      sequence();
    }
  }, [controls, onEnter, isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <MotionBox
      initial={{ opacity: 1 }}
      animate={controls}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      height="100vh"
      width="100vw"
      bg="teal.400"
      color="white"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
      position="relative"
    >
      <VStack spacing={0} position="absolute" height="100%" width="100%" overflow="hidden">
        <MotionBox
          initial={{ y: "-100%" }}
          animate={controls}
          variants={{
            welcome: { y: 0, transition: { duration: 1, ease: [0.8, 0, 0.2, 1] } },
            to: { y: 0 },
            chessNexus: { y: 0 },
            fadeOut: { y: 0 }
          }}
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgGradient="linear(to-br, teal.300, teal.400, teal.500)"
          boxShadow="inset 0 0 100px rgba(0,0,0,0.1)"
        >
          <Text 
            fontSize="200px" 
            fontWeight="bold" 
            color="#014D4E"
            textShadow="2px 2px 4px rgba(0,0,0,0.1)"
          >
            Welcome
          </Text>
        </MotionBox>
        <MotionBox
          initial={{ y: "100%" }}
          animate={controls}
          variants={{
            welcome: { y: "100%" },
            to: { y: 0, transition: { duration: 1, ease: [0.8, 0, 0.2, 1] } },
            chessNexus: { y: 0 },
            fadeOut: { y: 0 }
          }}
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgGradient="linear(to-br, teal.300, teal.400, teal.500)"
          boxShadow="inset 0 0 100px rgba(0,0,0,0.1)"
        >
          <Text fontSize="200px" fontWeight="bold" color="#014D4E" textShadow="2px 2px 4px rgba(0,0,0,0.1)">
            to
          </Text>
        </MotionBox>
        <MotionBox
          initial={{ x: "-100%" }}
          animate={controls}
          variants={{
            welcome: { x: "-100%" },
            to: { x: "-100%" },
            chessNexus: { x: 0, transition: { duration: 1, ease: [0.6, 0, 0.2, 1] } },
            fadeOut: { x: 0 }
          }}
          position="absolute"
          top={0}
          left={0}
          width="50%"
          height="100%"
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          bgGradient="linear(to-r, teal.300 0%, teal.400 25%, teal.500 100%)"
          overflow="hidden"
        >
          <Text marginRight="20px" fontSize="150px" fontWeight="bold" color="#014D4E" marginLeft="150px">
            Chess
          </Text>
        </MotionBox>
        <MotionBox
          initial={{ x: "100%" }}
          animate={controls}
          variants={{
            welcome: { x: "100%" },
            to: { x: "100%" },
            chessNexus: { x: 0, transition: { duration: 1, ease: [0.6, 0, 0.2, 1] } },
            fadeOut: { x: 0 }
          }}
          position="absolute"
          top={0}
          left="50%"
          width="50%"
          height="100%"
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          bgGradient="linear(to-r, teal.500 10%, teal.400 75%, teal.300 100%)"
          overflow="hidden"
        >
          <Text marginLeft="20px" fontSize="150px" fontWeight="bold" color="#014D4E">
            Nexus
          </Text>
        </MotionBox>
      </VStack>
    </MotionBox>
  );
}

export default IntroPage;
