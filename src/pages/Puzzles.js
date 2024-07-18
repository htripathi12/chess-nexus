import React, { useState, useRef, useEffect } from 'react';
import CustomBoard from '../components/CustomBoard';
import axios from 'axios';
import { 
    Button, 
    Text, 
    Link, 
    Spinner,
    useToast,
  } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Chess } from 'chess.js';

function Puzzles() {
    const [initialFEN, setInitialFEN] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const [orientation, setOrientation] = useState('white');
    const [moves, setMoves] = useState([]);
    const [moveIndex, setMoveIndex] = useState(1);
    const [incorrectMove, setIncorrectMove] = useState(false);
    const [moveInProgress, setMoveInProgress] = useState(false);
    const [loading, setLoading] = useState(false);
    const [firstPuzzle, setFirstPuzzle] = useState(true);
    const [puzzleLoaded, setPuzzleLoaded] = useState(false);
    const [rating, setRating] = useState(0);

    const customBoardRef = useRef(null);
    const chess = useRef(new Chess());

    const toast = useToast();

    const showFeedback = (isCorrect) => {
      toast({
        title: isCorrect ? "Correct!" : "Incorrect!",
        status: isCorrect ? "success" : "error",
        duration: 1500,
        isClosable: true,
        position: "top",
        variant: "solid",
      });
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const getNextPuzzle = async () => {
        if (moveInProgress) return;

        try {
            setPuzzleLoaded(true);
            setMoveInProgress(true);
            if (firstPuzzle) {
                setLoading(true);
            }
            setFirstPuzzle(false);
            setIncorrectMove(false);
            const response = await axios.get('http://localhost:8080/puzzles');
            const newFen = response.data.fen;
            const moveList = response.data.moves.split(' '); 
            setRating(response.data.rating);
            setMoves(moveList);

            chess.current.load(newFen);
            setFen(newFen);
            setInitialFEN(newFen);

            setLoading(false);

            const activePlayer = newFen.split(' ')[1];
            setOrientation(activePlayer === 'w' ? 'black' : 'white');

            setTimeout(() => {
                chess.current.move(moveList[0]);
                setFen(chess.current.fen());
                setMoveIndex(1);
                console.log(response.data);
                setMoveInProgress(false);
            }, 1000);
        } catch (error) {
            console.error('There was an error!', error);
            setMoveInProgress(false);
            setLoading(false);
        }
    };

    const logMove = (sourceSquare, targetSquare) => {
        const userMove = sourceSquare + targetSquare;
        const expectedMove = moves[moveIndex];
        console.log(`User move: ${userMove}, Expected move: ${expectedMove}`);

        if (userMove === expectedMove) {
            console.log('Correct');
            showFeedback(true);
            const nextMove = moves[moveIndex + 1];
            setIncorrectMove(false);
            if (nextMove) {
                setTimeout(() => {
                    chess.current.move(nextMove);
                    setFen(chess.current.fen());
                    setMoveIndex(moveIndex => moveIndex + 2);
                }, 1000);
            }
        } else {
            console.log('Incorrect');
            showFeedback(false);
            setIncorrectMove(true);
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
            {loading && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 10
              }}>
                    <Spinner size="xl" style={{ width: '100px', height: '100px', color: 'white' }} speed=".35s" thickness='10px'/>
                    <div style={{ color: 'white', fontSize: '24px' }}>Loading Puzzles</div>
              </div>
            )}
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
                        disableBoard={incorrectMove || !puzzleLoaded}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '3', padding: '10px' }}>
                        <Button onClick={redoPuzzle} bg='teal.400' border="1px" color="white" _hover={{ bg: "teal.700", color: "white" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-reload" width="35" height="35" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                                <path d="M20 4v5h-5" />
                            </svg>
                        </Button>
                        <Button onClick={getNextPuzzle} bg='teal.400' border="1px" color="white" _hover={{ bg: "teal.700", color: "white" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-big-right-filled" width="35" height="35" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M12.089 3.634a2 2 0 0 0 -1.089 1.78l-.001 2.586h-6.999a2 2 0 0 0 -2 2v4l.005 .15a2 2 0 0 0 1.995 1.85l6.999 -.001l.001 2.587a2 2 0 0 0 3.414 1.414l6.586 -6.586a2 2 0 0 0 0 -2.828l-6.586 -6.586a2 2 0 0 0 -2.18 -.434l-.145 .068z" strokeWidth="0" fill="currentColor" />
                            </svg>
                        </Button>
                    </div>
                </div>
                <div style={{ height: '550px', display: 'flex', alignItems: 'flex-start' }}>
                    <div 
                        style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            width: '300px',
                            maxHeight: '150px',
                            marginLeft: '20px',
                            background: 'linear-gradient(145deg, #e0f7fa, #b2ebf2)',
                            borderRadius: '10px',
                            border: '2px solid #008080',
                            boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)',
                            padding: '10px',
                        }}
                    >
                        <Text style={{
                            fontSize: '28px',
                            color: '#008080',
                            fontWeight: 'bold',
                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
                            textAlign: 'center',
                        }}>{rating}</Text>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Puzzles;
