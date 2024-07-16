import React, { useEffect } from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';

const MotionBox = motion(Box);

function IntroPage({ onEnter }) {
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      await controls.start("welcome");
      await new Promise(resolve => setTimeout(resolve, 500));
      await controls.start("to");
      await new Promise(resolve => setTimeout(resolve, 500));
      await controls.start("chessNexus");
      await new Promise(resolve => setTimeout(resolve, 500));
      onEnter();
    };
    sequence();
  }, [controls, onEnter]);

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      height="100vh"
      width="100vw"
      bg="black"
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
            welcome: { y: 0, transition: { duration: 0.5 } },
            to: { y: 0 },
            chessNexus: { y: 0 }
          }}
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bg="teal.400"
        >
          <Text fontSize="200px" fontWeight="bold" color="#014D4E">
            Welcome
          </Text>
        </MotionBox>
        <MotionBox
          initial={{ y: "100%" }}
          animate={controls}
          variants={{
            welcome: { y: "100%" },
            to: { y: 0, transition: { duration: 0.5 } },
            chessNexus: { y: 0 }
          }}
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bg="teal.400"
        >
          <Text fontSize="200px" fontWeight="bold" color="#014D4E">
            to
          </Text>
        </MotionBox>
        <MotionBox
          initial={{ x: "-100%" }}
          animate={controls}
          variants={{
            welcome: { x: "-100%" },
            to: { x: "-100%" },
            chessNexus: { x: 0, transition: { duration: 0.5 } },
            exit: { opacity: 0, transition: { duration: 0.5 } }
          }}
          position="absolute"
          top={0}
          left={0}
          width="50%"
          height="100%"
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          bg="teal.400"
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
            chessNexus: { x: 0, transition: { duration: 0.5 } },
            exit: { opacity: 0, transition: { duration: 0.5 } }
          }}
          position="absolute"
          top={0}
          left="50%"
          width="50%"
          height="100%"
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          bg="teal.400"
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
