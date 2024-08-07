import React, { useState, useRef, useEffect } from 'react';
import CustomBoard from '../components/CustomBoard';
import BackButton from '../components/BackButton';
import axios from 'axios';
import { 
	Box,
	Button, 
    Text, 
    Spinner,
    useToast,
} from '@chakra-ui/react';
import { Chess } from 'chess.js';
import { useAuth } from '../AuthContext';

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
    const [ratingChange, setRatingChange] = useState(0);

    const customBoardRef = useRef(null);
    const chess = useRef(new Chess());
    const userRating = useRef(0);

    const auth = useAuth();
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
        getPuzzleRating();
    }, []);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const getPuzzleRating = async () => {
        try {
            const response = await axios.get('http://localhost:8080/puzzles/rating', 
                {
                    headers: {
                        Authorization: `Bearer ${auth.getToken()}`,
                    }
                }
            );
            userRating.current = response.data.rating;
            console.log('Puzzle rating:', userRating.current);
        } catch (error) {
            console.error('There was an error!', error);
        }
    }

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
            const response = await axios.get('http://localhost:8080/puzzles', 
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

    const handleEloRating = async (isIncorrect) => {
        const previousRating = userRating.current; // Store previous rating
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
            await axios.post('http://localhost:8080/puzzles/updateRating', 
                { rating: newRating }, 
                {
                    headers: {
                        Authorization: `Bearer ${auth.getToken()}`,
                    }
                }
            );
            userRating.current = newRating;
			setRatingChange(newRating - previousRating);
            console.log('New user rating:', newRating);
        } catch (error) {
            console.error('There was an error updating the rating!', error);
        }
    };

    const logMove = (sourceSquare, targetSquare) => {
        const userMove = sourceSquare + targetSquare;
        const expectedMove = moves[moveIndex];
        console.log(`User move: ${userMove}, Expected move: ${expectedMove}`);
    
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
            } else {
                handleEloRating(false);
            }
        } else {
            showFeedback(false);
            setIncorrectMove(true);
            handleEloRating(true);
        }
    };

    const redoPuzzle = () => {
        chess.current.load(initialFEN);
        setFen(initialFEN);
        setMoveIndex(1);
        setIncorrectMove(false);

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
                <BackButton />
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
                <div style={{ height: '550px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
					<div 
						style={{ 
							display: 'flex', 
							flexDirection: 'column', 
							alignItems: 'center', 
							width: '300px',
							marginLeft: '20px',
							background: 'linear-gradient(145deg, #e0f7fa, #b2ebf2)',
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
						<Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" width="100%">
							<Text style={{
								fontSize: '28px',
								color: '#008080',
								fontWeight: 'bold',
								textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
								textAlign: 'center',
								marginLeft: '12px',
							}}>{userRating.current}</Text>
							<Text style={{
								fontSize: '16px',
								color: ratingChange > 0 ? 'green' : 'red',
								fontWeight: 'bold',
								textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
								textAlign: 'center',
								position: 'relative',
							}}>
								{ratingChange > 0 ? `+${ratingChange}` : ratingChange}
							</Text>
						</Box>
					</div>
                    <div 
                        style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            width: '300px',
                            marginLeft: '20px',
                            background: 'linear-gradient(145deg, #e0f7fa, #b2ebf2)',
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
                </div>
            </div>
        </div>
    );
}

export default Puzzles;