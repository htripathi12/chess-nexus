import React, { useState, useCallback, useRef, useEffect } from 'react';
import CustomBoard from '../components/CustomBoard';
import BackButton from '../components/BackButton';
import axios from 'axios';
import { Box, Button, Text, Tooltip, Spinner, useToast } from '@chakra-ui/react';
import { Chess } from 'chess.js';
import { useAuth } from '../AuthContext';
import { motion } from 'framer-motion';



function Puzzles() {
    const [initialFEN, setInitialFEN] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const [orientation, setOrientation] = useState('white');

    const [moves, setMoves] = useState([]);
    const [puzzleSolution, setPuzzleSolution] = useState([]);

    const [incorrectMove, setIncorrectMove] = useState(false);
    const [moveInProgress, setMoveInProgress] = useState(false);
    const [loading, setLoading] = useState(false);
    const [firstPuzzle, setFirstPuzzle] = useState(true);
    const [puzzleLoaded, setPuzzleLoaded] = useState(false);
    const [solutionRevealed, setSolutionRevealed] = useState(false);
    const [showRatingChange, setShowRatingChange] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    const [rating, setRating] = useState(0);
    const [ratingChange, setRatingChange] = useState(0);
    const [moveIndex, setMoveIndex] = useState(1);

    const customBoardRef = useRef(null);
    const chess = useRef(new Chess());
    const userRating = useRef(0);
    const eloLost = useRef(false);
    const puzzleCompleted = useRef(false);

    const auth = useAuth();
    const toast = useToast();
    const MotionBox = motion(Box);

    const getPuzzleRating = useCallback(async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_URL + '/puzzles/rating', {
                headers: {
                    Authorization: `Bearer ${auth.getToken()}`,
                }
            });
            userRating.current = response.data.rating;
        } catch (error) {
            console.error('There was an error!', error);
        }
    }, [auth]);

    useEffect(() => {
        if (auth.isLoggedIn) {
            console.log('Getting puzzle rating');
            getPuzzleRating();
        }
    }, [getPuzzleRating, auth.isLoggedIn]);

    useEffect(() => {
        setLoggedIn(auth.isLoggedIn);
    }, [auth]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

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

    const getNextPuzzle = async () => {
        if (moveInProgress) return;

        try {
            setSolutionRevealed(false);
            setPuzzleSolution([]);
            setPuzzleLoaded(true);
            setShowRatingChange(false);
            setMoveInProgress(true);
            eloLost.current = false;
            puzzleCompleted.current = false;
            if (firstPuzzle) {
                setLoading(true);
            }
            setFirstPuzzle(false);
            setIncorrectMove(false);
            const response = await axios.get(process.env.REACT_APP_API_URL + '/puzzles',
                {
                    headers: {
                        Authorization: `Bearer ${auth.getToken()}`,
                    },
                    params: {
                        userRating: userRating.current,
                    }
                }
            );
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
                setMoveInProgress(false);
            }, 1000);
        } catch (error) {
            console.error('There was an error!', error);
            setMoveInProgress(false);
            setLoading(false);
        }
    };

    const revealSolution = () => {
        setSolutionRevealed(true);
        let tempArr = moves.slice(1);

        let chessTwo = new Chess(fen);
        try {
            tempArr.forEach(move => {
                chessTwo.move(move);
            });
        } catch (e) {
            console.error('Error loading PGN:', e);
        }
        chessTwo.history().shift();
        setPuzzleSolution(chessTwo.history());

        if (!eloLost.current) {
            handleEloRating(true);
            eloLost.current = true;
        }
    };

    const handleEloRating = async (isIncorrect) => {
        if (puzzleCompleted.current) return;

        const previousRating = userRating.current;
        const diff = Math.abs(previousRating - rating);
        let K = 32;

        if (diff < 100) {
            K = 16;
        } else if (diff > 200) {
            K = 40;
        }

        const expectedScore = 1 / (1 + Math.pow(10, (rating - previousRating) / 400));
        const actualScore = isIncorrect ? 0 : 1;

        const newRating = Math.round(previousRating + K * (actualScore - expectedScore));

        try {
            await axios.post(process.env.REACT_APP_API_URL + '/puzzles/updateRating',
                { rating: newRating },
                {
                    headers: {
                        Authorization: `Bearer ${auth.getToken()}`,
                    }
                }
            );
            userRating.current = newRating;
            setRatingChange(newRating - previousRating);
            setShowRatingChange(true);
        } catch (error) {
            console.error('There was an error updating the rating!', error);
        }
        puzzleCompleted.current = true;
    };

    const logMove = (sourceSquare, targetSquare) => {
        const userMove = sourceSquare + targetSquare;
        const expectedMove = moves[moveIndex];

        if (userMove === expectedMove) {
            showFeedback(true);
            const nextMove = moves[moveIndex + 1];
            setIncorrectMove(false);
            if (nextMove) {
                setTimeout(() => {
                    chess.current.move(nextMove);
                    setFen(chess.current.fen());
                    setMoveIndex(moveIndex => moveIndex + 2);
                }, 1000);
                if (!nextMove && !solutionRevealed) {
                    handleEloRating(false);
                }
            } else {
                handleEloRating(false);
                setPuzzleLoaded(false);
            }
        } else {
            showFeedback(false);
            setIncorrectMove(true);
            handleEloRating(true);
            setPuzzleLoaded(false);
        }
    };

    const redoPuzzle = () => {
        chess.current.load(initialFEN);
        setFen(initialFEN);
        setMoveIndex(1);
        setIncorrectMove(false);
        setShowRatingChange(false);
        setPuzzleLoaded(true);
        setSolutionRevealed(false);
    
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
                    <Spinner
                        size="xl"
                        style={{ width: '100px', height: '100px', color: 'white' }}
                        speed=".35s"
                        thickness='10px'
                    />
                    <div style={{ color: 'white', fontSize: '24px' }}>Loading Puzzles</div>
                </div>
            )}

            <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.0 }}
                style={{ position: 'absolute', top: '10px', left: '10px'}}
            >
                <BackButton />
            </motion.div>   

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'auto auto',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>

                <motion.div
                    style={{
                        margin: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                    }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.0 }}
                >
                    <CustomBoard
                        ref={customBoardRef}
                        fen={fen}
                        orientation={orientation}
                        setFen={setFen}
                        onMove={logMove}
                        chessInstance={chess.current}
                        disableBoard={incorrectMove || !puzzleLoaded}
                    />
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        marginTop: '3',
                        padding: '10px'
                    }}>
                        <Tooltip label="You have to log in to play puzzles" isDisabled={loggedIn}>
                            <Button
                                onClick={redoPuzzle}
                                bg='white'
                                isDisabled={!loggedIn}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-reload"
                                    width="35" height="35" viewBox="0 0 24 24" strokeWidth="1.6" stroke="#008080" fill="none"
                                    strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                                    <path d="M20 4v5h-5" />
                                </svg>
                            </Button>
                        </Tooltip>
                        <Tooltip label="You have to log in to play puzzles" isDisabled={loggedIn}>
                            <Button
                                onClick={getNextPuzzle}
                                bg='white'
                                isDisabled={!loggedIn}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-big-right"
                                    width="35" height="35" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#008080" fill="#008080"
                                    strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M4 9h8v-3.586a1 1 0 0 1 1.707 -.707l6.586 6.586a1 1 0 0 1 0 1.414l-6.586 6.586a1 
                                    1 0 0 1 -1.707 -.707v-3.586h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1z" />
                                </svg>
                            </Button>
                        </Tooltip>
                    </div>
                </motion.div>

                <motion.div
                    style={{
                        height: '550px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                    }}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.0 }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '300px',
                            marginLeft: '20px',
                            background: 'white',
                            borderRadius: '10px',
                            border: '2px solid #008080',
                            boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)',
                            padding: '10px',
                            marginBottom: '20px',
                        }}
                    >
                        <Text style={{
                            fontSize: '18px',
                            color: '#008080',
                            fontWeight: 'bold',
                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
                            textAlign: 'center',
                        }}>Your Rating</Text>
                        <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="center"
                            width="100%"
                        >
                            <Text style={{
                                fontSize: '28px',
                                color: '#008080',
                                fontWeight: 'bold',
                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
                                textAlign: 'center',
                                marginLeft: (showRatingChange && ratingChange) ? '15px' : '0px',
                            }}>{userRating.current}</Text>
                            {showRatingChange && ratingChange !== 0 && (
                                <Text style={{
                                    fontSize: '16px',
                                    color: ratingChange > 0 ? '#228B22' : 'red',
                                    fontWeight: 'bold',
                                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
                                    textAlign: 'center',
                                    position: 'relative',
                                }}>
                                    {ratingChange > 0 ? `+${ratingChange}` : ratingChange}
                                </Text>
                            )}
                        </Box>
                    </div>
                    
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '300px',
                            marginLeft: '20px',
                            background: 'white',
                            borderRadius: '10px',
                            border: '2px solid #008080',
                            boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)',
                            padding: '10px',
                        }}
                    >
                        <Text style={{
                            fontSize: '18px',
                            color: '#008080',
                            fontWeight: 'bold',
                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
                            textAlign: 'center',
                        }}>Puzzle Rating</Text>
                        <Text style={{
                            fontSize: '28px',
                            color: '#008080',
                            fontWeight: 'bold',
                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
                            textAlign: 'center',
                        }}>{rating}</Text>
                    </div>

                    <Tooltip label="You have to log in to play puzzles" isDisabled={loggedIn}>
                        <Button
                            onClick={revealSolution}
                            isDisabled={solutionRevealed || !puzzleLoaded || !loggedIn}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '300px',
                                marginLeft: '20px',
                                marginTop: '20px',
                                color: '#008080',
                                background: 'white',
                                borderRadius: '10px',
                                border: '2px solid #008080',
                                boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)',
                                padding: '10px',
                            }}
                        >
                            Reveal Solution
                        </Button>
                    </Tooltip>

                    {solutionRevealed && (
                        <MotionBox
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            marginTop="20px"
                            marginLeft="20px"
                            width="300px"
                            padding="15px"
                            bg="teal.50"
                            borderRadius="lg"
                            boxShadow="md"
                            border='2px solid #008080'
                            color='#008080'
                            background= 'linear-gradient(145deg, #e0f7fa, #b2ebf2)'
                        >
                            <Text 
                                fontWeight="bold" 
                                marginBottom="10px" 
                                fontSize="xl" 
                            >
                                Solution:
                            </Text>
                            <Text 
                                fontSize="lg" 
                                letterSpacing="wide"
                            >
                                {puzzleSolution.join(' ')}
                            </Text>
                        </MotionBox>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

export default Puzzles;