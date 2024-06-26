import React, { useState, useRef, useEffect } from 'react';
import CustomBoard from '../components/CustomBoard';
import axios from 'axios';
import { Textarea, Button, Text, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Chess } from 'chess.js';

function Puzzles() {
    const [initialFEN, setInitialFEN] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const [orientation, setOrientation] = useState('white');
    const [moves, setMoves] = useState([]);
    const [moveIndex, setMoveIndex] = useState(1);
    const customBoardRef = useRef(null);
    const chess = useRef(new Chess());
    const [puzzleCompleted, setPuzzleCompleted] = useState(false);
    const [incorrectMove, setIncorrectMove] = useState(false);


    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const getNextPuzzle = async () => {
        try {
            setPuzzleCompleted(false);
            setIncorrectMove(false);
            const response = await axios.get('http://localhost:3000/puzzles');
            const newFen = response.data.fen;
            const moveList = response.data.moves.split(' ');
            setMoves(moveList);

            chess.current.load(newFen);
            setFen(newFen);
            setInitialFEN(newFen);

            const activePlayer = newFen.split(' ')[1];
            setOrientation(activePlayer === 'w' ? 'black' : 'white');

            setTimeout(() => {
                chess.current.move(moveList[0]);
                setFen(chess.current.fen());
                setMoveIndex(1);
                console.log(response.data);
            }, 1000);
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    const logMove = (sourceSquare, targetSquare) => {
        const userMove = sourceSquare + targetSquare;
        const expectedMove = moves[moveIndex];
        console.log(`User move: ${userMove}, Expected move: ${expectedMove}`);

        if (userMove === expectedMove) {
            console.log('Correct');
            const nextMove = moves[moveIndex + 1];
            setPuzzleCompleted(true);
            if (nextMove) {
                setTimeout(() => {
                    setPuzzleCompleted(false);
                    chess.current.move(nextMove);
                    setFen(chess.current.fen());
                    setMoveIndex(moveIndex => moveIndex + 2);
                }, 1000);
            } else {
                setPuzzleCompleted(true);
            }
        } else {
            console.log('Incorrect');
            setIncorrectMove(true); // Set incorrect move state
        }
    };

    const redoPuzzle = () => {
        chess.current.load(initialFEN);
        setFen(initialFEN);
        setMoveIndex(1);
        setIncorrectMove(false);

        // Make the first move after resetting
        const firstMove = moves[0];
        if (firstMove) {
            setTimeout(() => {
                chess.current.move(firstMove);
                setFen(chess.current.fen());
            }, 1000);
        }
    };

    return (
        <div style={{ position: 'relative', height: '100vh', paddingBottom: '50px' }}>
            <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
                    <Button marginTop="3" bg='teal.400' border="1px" color="white" _hover={{ bg: "teal.700", color: "white" }} width="auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-big-left-filled" 
                            width="27" height="27" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" 
                            strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M9.586 4l-6.586 6.586a2 2 0 0 0 0 2.828l6.586 6.586a2 2 0 0 0 2.18 .434l .145 -.068a2 2 0 0 
                                0 1.089 -1.78v-2.586h7a2 2 0 0 0 2 -2v-4l-.005 -.15a2 2 0 0 0 -1.995 -1.85l-7 -.001v-2.585a2 2 0
                                0 0 -3.414 -1.414z" strokeWidth="0" fill="currentColor" />
                        </svg>
                        <Text ml={2}>Back</Text>
                    </Button>
                </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                    <CustomBoard
                        ref={customBoardRef}
                        fen={fen}
                        orientation={orientation}
                        setFen={setFen}
                        onMove={logMove}
                        chessInstance={chess.current}
                        disableBoard={incorrectMove} // Pass disableBoard prop to disable the board
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '3', padding: '10px' }}>
                        <Button onClick={redoPuzzle} bg='teal.400' border="1px" color="white" _hover={{ bg: "teal.700", color: "white" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-reload" width="35" height="35" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                                <path d="M20 4v5h-5" />
                            </svg>
                        </Button>
                        <Button onClick={getNextPuzzle} bg='teal.400' border="1px" color="white" _hover={{ bg: "teal.700", color: "white" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-big-right-filled" width="35" height="35" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M12.089 3.634a2 2 0 0 0 -1.089 1.78l-.001 2.586h-6.999a2 2 0 0 0 -2 2v4l.005 .15a2 2 0 0 0 1.995 1.85l6.999 -.001l.001 2.587a2 2 0 0 0 3.414 1.414l6.586 -6.586a2 2 0 0 0 0 -2.828l-6.586 -6.586a2 2 0 0 0 -2.18 -.434l-.145 .068z" stroke-width="0" fill="currentColor" />
                            </svg>
                        </Button>
                    </div>
                    {puzzleCompleted &&
                        <div style={{
                            position: 'absolute',
                            right: '-150px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            padding: '20px',
                            backgroundColor: '#008000',                       
                            borderRadius: '10px',
                            color: '#fff',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            boxShadow: '0px 0px 10px 3px rgba(0, 0, 0, 0.2)',
                            border: '1px solid #fff'
                        }}>Correct!</div>
                    }
                    {incorrectMove &&
                        <div style={{
                            position: 'absolute',
                            right: '-150px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            padding: '20px',
                            backgroundColor: '#ff0000',
                            borderRadius: '10px',
                            color: '#fff',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            boxShadow: '0px 0px 10px 3px rgba(0, 0, 0, 0.2)',
                            border: '1px solid #fff'
                        }}>Incorrect!</div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Puzzles;
