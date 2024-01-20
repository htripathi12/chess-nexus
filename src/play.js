import React, { useRef, useState, useEffect } from 'react';
import { Box, Center, Container, AbsoluteCenter, Flex, Link, Spacer, Button, ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Link as RouterLink } from 'react-router-dom';

import Chessboard from 'chessboardjsx';
import { Chess } from 'chess.js';

function Play() {
    const chess = useRef(new Chess());
    const [fen, setFen] = useState('start');
    const [squareStyles, setSquareStyles] = useState({});

    useEffect(() => {
        setFen(chess.current.fen());
    }, [chess]);

    const onDrop = ({ sourceSquare, targetSquare }) => {
        let move = chess.current.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q'
        });

        if (move === null) {
            alert("Invalid move");
            return;
        }

        setSquareStyles({
            [sourceSquare]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
            [targetSquare]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' }
        });

        setFen(chess.current.fen());
    };

    return (
        <div id="board1" style={{width: '400px'}}>
            <Chessboard 
                position={fen}
                onDrop={onDrop}
                draggable={true}
                squareStyles={squareStyles}
            />
        </div>
    );
}

export default Play;