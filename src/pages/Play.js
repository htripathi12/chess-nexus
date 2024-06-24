import React, { useState, useRef, useEffect } from 'react';
import { Textarea, Link, Button, Text } from '@chakra-ui/react';
import { BrowserRouter as Router, Link as RouterLink } from 'react-router-dom';
import CustomBoard from '../components/CustomBoard';
import { Chess } from 'chess.js';
import axios from 'axios';

function Play() {
    const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const [winLoss, setWinLoss] = useState('');
    const [history, setHistory] = useState([]);
    const [pgnLoaded, setPgnLoaded] = useState(false);
    const customBoardRef = useRef(null);
    const chessInstance = useRef(new Chess());
    const pgnRef = useRef(null);
    const moveIndex = useRef(0);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    useEffect(() => {
        if (fen && history[history.length - 1] !== fen) {
            setHistory((prevHistory) => [...prevHistory, fen]);
        }
    }, [fen]);

    const handleUndo = () => {
        if (moveIndex.current > 0) {
            moveIndex.current -= 1;
            chessInstance.current.undo();
            setFen(chessInstance.current.fen());
        }
    };

    const handleNextMove = () => {
        const moves = chessInstance.current.history();
        if (moveIndex.current < moves.length) {
            chessInstance.current.move(moves[moveIndex.current]);
            setFen(chessInstance.current.fen());
            moveIndex.current += 1;
        }
    };

    const handleSubmit = async () => {
        try {
            const pgn = pgnRef.current.value;
            const response = await axios.post('http://localhost:3000/play', { pgn });
            console.log(response.data);
            if (response.data.status === 'success') {
                chessInstance.current.loadPgn(pgn);
                setPgnLoaded(true);
                moveIndex.current = 0;
                setFen(chessInstance.current.fen());
            } else {
                setPgnLoaded(false);
                setWinLoss(response.data.message);
            }
        } catch (error) {
            console.error('There was an error!', error);
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
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CustomBoard
                        ref={customBoardRef}
                        fen={fen}
                        setFen={setFen}
                        setWinLoss={setWinLoss}
                        chessInstance={chessInstance.current}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '10px' }}>
                        <Button onClick={handleUndo}>
                            Previous Move
                        </Button>
                        {pgnLoaded && <Button onClick={handleNextMove}>Next Move</Button>}
                    </div>
                </div>
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-start',
                    marginLeft: '20px', 
                }}>
                    <Textarea
                        ref={pgnRef}
                        width="300px"
                        height="300px"
                        fontSize="16px"
                        padding="10px"
                        resize="none"
                        border="3px solid"
                        borderColor="#1E8C87"
                        borderRadius="8px"
                        placeholder="Enter PGN"
                        focusBorderColor="#008080"
                        _hover={{
                            borderColor: "#008080",
                        }}
                        sx={{
                            '::placeholder': {
                                color: '#008080',
                            },
                        }}
                    />
                    <Button style={{ marginTop: '10px' }} onClick={handleSubmit}>
                        Submit
                    </Button>
                </div>
            </div>
            {winLoss && <div>{winLoss}</div>}
        </div>
    );
}

export default Play;
