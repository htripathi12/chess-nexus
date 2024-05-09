import React, { useRef, useState, useEffect } from 'react';
import { Box, Center, Container, AbsoluteCenter, Flex, Link, Spacer, Button, ChakraProvider, FormControl, FormLabel, 
    Input, Stack, Text, Tabs, Table, Tbody, Td, Tr, Th, Thead, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

import Chessboard from 'chessboardjsx';
import { Chess } from 'chess.js';

function Play() {
    const chess = useRef(new Chess());
    const [fen, setFen] = useState('start');
    const [squareStyles, setSquareStyles] = useState({});
    const [winLoss, winLossState] = useState('');
    const [history, setHistory] = useState([]);
    const [selectedSquare, setSelectedSquare] = useState(null);

    useEffect(() => {
        setFen(chess.current.fen());
        setHistory(chess.current.history());
    }, [chess]);

    const onDrop = ({ sourceSquare, targetSquare }) => {
        const fen = chess.current.fen();
        try {
            let move = chess.current.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q'
            });


            setSquareStyles({
                [sourceSquare]: { backgroundColor: 'rgba(200, 255, 255, 0.4)' }, 
                [targetSquare]: { backgroundColor: 'rgba(200, 255, 255, 0.4)' } 
            });

            setFen(chess.current.fen());
            setHistory(chess.current.history());

            if (chess.current.isGameOver()) {
                if (chess.current.isCheckmate()) {
                    winLossState('Checkmate');
                } else if (chess.current.isDraw()) {
                    winLossState('Draw');
                } else if (chess.current.isStalemate()) {
                    winLossState('Stalemate');
                } else if (chess.current.isThreefoldRepetition()) {
                    winLossState('Threefold Repetition');
                } else if (chess.current.isInsufficientMaterial()) {
                    winLossState('Insufficient Material');
                }
                return;
            }
        }
        catch (error) {
            chess.current.fen(fen);
        }
    };

    // TODO: Implement onSquareClick
    // const onSquareClick = (square) => {
    //     if (selectedSquare) {
    //         try {
    //             chess.current.move({ from: selectedSquare, to: square });
    //             setFen(chess.current.fen());
    //             setHistory(chess.current.history());
    //             setSquareStyles({
    //                 [selectedSquare]: { backgroundColor: 'rgba(200, 255, 255, 0.4)' },
    //                 [square]: { backgroundColor: 'rgba(200, 255, 255, 0.4)' }
    //             });
    //         } catch (error) {
    //             console.log(error);
    //         }
    //         setSelectedSquare(null);
    //     } else {
    //         setSelectedSquare(square);
    
    //         const moves = chess.current.moves({ square, verbose: true });
    
    //         const newSquareStyles = {};
    //         for (const move of moves) {
    //             newSquareStyles[move.to] = { 
    //                 backgroundColor: 'rgb(150, 225, 225)',
    //                 borderRadius: '50%',
    //                 width: '20px',
    //                 height: '20px',
    //                 top: '50%',
    //                 left: '50%',
    //                 marginTop: '25px',
    //                 boxShadow: '0px 0px 10px 1px rgba(0, 0, 0, 0.5)', // increased shadow
    //             };
    //         }
    //         setSquareStyles(newSquareStyles);
    //     }
    // };

    return (
        <div id="board1" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <Chessboard 
                position={fen}
                //onSquareClick={onSquareClick}
                onDrop={onDrop}
                draggable={true}
                squareStyles={squareStyles}
                darkSquareStyle={{ backgroundColor: '#008080' }} 
                lightSquareStyle={{ backgroundColor: '#20B2AA' }} 
                boardStyle={{
                    border: '2px solid #008080', 
                    borderRadius: '5px',
                    boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
                }}
                orientation='black'
            />
            <div style = {{flexDirection: 'column', paddingLeft: '20px'}}>
                <Button style={{ marginTop: '30px' }} onClick={() => {
                    chess.current.undo();
                    setFen(chess.current.fen());
                    setHistory(chess.current.history());
                }}>Previous Move</Button>
            </div>
            {winLoss && <div>{winLoss}</div>}
        </div>
    );
}

export default Play;