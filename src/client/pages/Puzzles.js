import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [puzzleLoaded, setPuzzleLoaded] = useState(false);
    const [solutionRevealed, setSolutionRevealed] = useState(false);
    const [showRatingChange, setShowRatingChange] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);

    const [puzzleRating, setPuzzleRating] = useState(0);
    const [ratingChange, setPuzzleRatingChange] = useState(0);
    const [moveIndex, setMoveIndex] = useState(1);

    const customBoardRef = useRef(null);
    const chess = useRef(new Chess());
    const userRating = useRef(0);
    const eloLost = useRef(false);
    const puzzleCompleted = useRef(false);

    const auth = useAuth();
    const toast = useToast();
    const MotionBox = motion(Box);

    const navigate = useNavigate();


    const getPuzzleRating = useCallback(async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_URL + '/puzzles/rating', {
                headers: {
                    Authorization: `Bearer ${auth.getToken()}`,
                }
            });
            userRating.current = response.data.rating;
        } catch (error) {
            console.error(error);
        }
    }, [auth]);

    const handleScreenSize = () => {
        const width = window.innerWidth;
        if (width < 500) {
            return 200;
        } else if (width < 1100) {
            return 300;
        } else {
            return 550;
        }
    };

    useEffect(() => {
        if (auth.isLoggedIn) {
            getPuzzleRating();
        }
    }, [getPuzzleRating, auth.isLoggedIn]);

    useEffect(() => {
        setLoggedIn(auth.isLoggedIn);
    }, [auth]);

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
            setHasAnimated(false);
            eloLost.current = false;
            puzzleCompleted.current = false;
            setLoading(true);
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
            console.log(response);
            const newFen = response.data.fen;
            const moveList = response.data.moves.split(' ');
            setPuzzleRating(response.data.rating);
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
        const chessTwo = new Chess(initialFEN);
        try {
            moves.forEach(move => {
                chessTwo.move(move);
            });
        } catch (e) {
            console.error('Error loading PGN:', e);
        }
    
        let tempArr = chessTwo.history().slice(moveIndex);    
        setPuzzleSolution(tempArr);
    
        if (!eloLost.current) {
            handleEloRating(true);
            eloLost.current = true;
        }
    };

    const handleEloRating = async (isIncorrect) => {
        if (puzzleCompleted.current) return;

        const previousRating = userRating.current;
        const diff = Math.abs(previousRating - puzzleRating);
        let K = 32;

        if (diff < 100) {
            K = 16;
        } else if (diff > 200) {
            K = 40;
        }

        const expectedScore = 1 / (1 + Math.pow(10, (puzzleRating - previousRating) / 400));
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
            setPuzzleRatingChange(newRating - previousRating);
            setShowRatingChange(true);
        } catch (error) {
            console.error('There was an error updating the rating!', error);
        }
        puzzleCompleted.current = true;
    };

    const logMove = (move) => {
        const userMove = `${move.from}${move.to}`;
        const expectedMove = moves[moveIndex];
        //console.log(`User move: ${userMove}, Expected move: ${expectedMove}`);
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

    const analyzeGame = () => {
        navigate(`/play?fen=${encodeURIComponent(fen)}&orientation=${encodeURIComponent(orientation)}`, {
            state: {
                fen: fen,
                orientation: orientation,
            }
        });
    }

    
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
                        onUserMove={logMove}
                        chessInstance={chess.current}
                        disableBoard={incorrectMove || !puzzleLoaded}
                        boardWidth={handleScreenSize()}
                    />
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        marginTop: '3',
                        padding: '10px'
                    }}>
                        <Tooltip label="You have to log in to play puzzles" isDisabled={loggedIn}>
                            <Box
                                display="flex"
                                flexDirection="row"
                                alignItems="center"
                                gap={{ base: "0.5", md: "1", lg: "1.5" }}
                            >
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
                                <Button
                                    onClick={analyzeGame}
                                    bg='white'
                                    isDisabled={!loggedIn}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" strokeWidth="1.6" stroke="#008080" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
                                        <path d="M4 16v2a2 2 0 0 0 2 2h2" />
                                        <path d="M16 4h2a2 2 0 0 1 2 2v2" />
                                        <path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
                                        <path d="M8 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                                        <path d="M16 16l-2.5 -2.5" />
                                    </svg>
                                </Button>
                            </Box>
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
                            }}>
                                {userRating.current}
                            </Text>
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
                        }}>{puzzleRating}</Text>
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
                            initial={!hasAnimated ? { opacity: 0, y: 20 } : false}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            onAnimationComplete={() => setHasAnimated(true)}
                            marginTop="20px"
                            marginLeft="20px"
                            width="300px"
                            padding="15px"
                            bg="teal.50"
                            borderRadius="lg"
                            boxShadow="md"
                            border="2px solid #008080"
                            color="#008080"
                            background="linear-gradient(145deg, #e0f7fa, #b2ebf2)"
                        >
                            <Text fontWeight="bold" marginBottom="10px" fontSize="xl">
                                Solution:
                            </Text>
                            <Text fontSize="lg" letterSpacing="wide">
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