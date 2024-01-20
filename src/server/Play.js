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
        // create a new chess game
        let game = new Chess();

        // try to make the move
        let move = game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q' // always promote to a queen for simplicity
        });

        // illegal move
        if (move === null) return;

        // if the move is legal, update the position
        setFen(game.fen());
    };

    return (
        <div id="board1" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <Chessboard 
                position={fen}
                onDrop={onDrop}
                draggable={true}
                squareStyles={squareStyles}
                darkSquareStyle={{ backgroundColor: '#008080' }} // Teal color for dark squares
                lightSquareStyle={{ backgroundColor: '#20B2AA' }} // Lighter teal color for light squares
                boardStyle={{
                    border: '2px solid #008080', // Teal border
                    borderRadius: '5px',
                    boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
                }}
            />
        </div>
    );
}

export default Play;