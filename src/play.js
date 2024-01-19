import React from 'react';
import { Box, Center, Container, AbsoluteCenter, Flex, Link, Spacer, Button, ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Link as RouterLink } from 'react-router-dom';
import Chessboard from 'chessboardjsx';

function Play() {
    return (
        <div id="board1" style={{width: '400px'}}>
            <Chessboard position="start" draggable="true" />
        </div>
    );
}


export default Play;