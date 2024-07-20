import React, { useState, useRef, useEffect } from 'react';
import { Textarea, Button, Text, Select, Input, Spinner } from '@chakra-ui/react';
import CustomBoard from '../components/CustomBoard';
import EvaluationBar from '../components/EvaluationBar';
import BackButton from '../components/BackButton';
import { Chess } from 'chess.js';
import axios from 'axios';
import { motion } from 'framer-motion';

function Play() {
    // State variables
    const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const [fenInput, setFenInput] = useState(fen);
    const [fenError, setFenError] = useState(false);
    const [winLoss, setWinLoss] = useState('');
    const [history, setHistory] = useState([]);
    const [pgnLoaded, setPgnLoaded] = useState(false);
    const [orientation, setOrientation] = useState('white');
    const [loading, setLoading] = useState(false);
    const [bestMove, setBestMove] = useState([]);
    const [bestLine, setBestLine] = useState([]);
    const [depth, setDepth] = useState(19);
    const [evaluation, setEvaluation] = useState(0);
    const [isMate, setIsMate] = useState(false);

    // Refs
    const customBoardRef = useRef(null);
    const chessInstance = useRef(new Chess());
    const pgnRef = useRef(null);
    const moveIndex = useRef(0);
    const stockfishWorkerRef = useRef(null);

    // Initialize and handle Stockfish messages
    useEffect(() => {
        stockfishWorkerRef.current = new Worker("./stockfish.js");
        stockfishWorkerRef.current.postMessage("uci");

        stockfishWorkerRef.current.onmessage = (e) => {
            console.log(e.data);
            if (e.data.startsWith('bestmove')) {
                handleBestMove(e.data);
            } else if (e.data.includes('cp')) {
                handleCentipawnEvaluation(e.data);
            } else if (e.data.includes('mate')) {
                handleMateEvaluation(e.data);
            }
            if (e.data.includes('pv')) {
                convertSAN(e.data);
            }
        };

        return () => {
            if (stockfishWorkerRef.current) {
                stockfishWorkerRef.current.terminate();
            }
        };
    }, []);

    // Run Stockfish on fen or depth change
    useEffect(() => {
        setBestMove([[]]);
        runStockfish(fen);
    }, [fen, depth]);

    // Prevent page scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    // Track fen history
    useEffect(() => {
        if (fen && history[history.length - 1] !== fen) {
            setHistory((prevHistory) => [...prevHistory, fen]);
        }
    }, [fen]);

    // Handle best move from Stockfish
    const handleBestMove = (data) => {
        const bestMoveFull = data.split(' ')[1];
        const bestMoveSquares = [[bestMoveFull.substring(0, 2), bestMoveFull.substring(2, 4)]];
        setBestMove(bestMoveSquares);
        setLoading(false);
    };

    const convertSAN = (data) => {
        const parts = data.split(' ');
        let lineParts = parts.slice(17);
        lineParts = lineParts.slice(0, 21);
        let line = lineParts.join(' ');
        console.log("BEST LINE: " + line);
        setBestLine(line);
    }

    // Handle centipawn evaluation from Stockfish
    const handleCentipawnEvaluation = (data) => {
        const tempEval = data.split(' ')[9] / 100;
        const isWhiteTurn = chessInstance.current.turn() === 'w';
        setEvaluation(isWhiteTurn ? tempEval : -tempEval);
    };

    // Handle mate evaluation from Stockfish
    const handleMateEvaluation = (data) => {
        const mateInMoves = data.split(' ')[9];
        setEvaluation(mateInMoves);
        setIsMate(true);
    };

    // Run Stockfish analysis
    const runStockfish = (position) => {
        if (stockfishWorkerRef.current) {
            setLoading(true);
            stockfishWorkerRef.current.postMessage(`position fen ${position}`);
            stockfishWorkerRef.current.postMessage(`go depth ${depth}`);
        }
    };

    // Handle FEN change
    const handleFenChange = (event) => {
        const inputFen = event.target.value;
        setFenInput(inputFen);
        try {
            chessInstance.current.load(inputFen);
            setFenError(false);
            setFen(inputFen);
            runStockfish(inputFen);
        } catch (e) {
            setFenError(true);
        }
    };

    // Undo the last move
    const handleUndo = () => {
        if (chessInstance.current.history().length > 0) {
            chessInstance.current.undo();
            const newFen = chessInstance.current.fen();
            setFen(newFen);
            setFenInput(newFen);
            runStockfish(newFen);
        }
    };

    // Move to the next move in the history
    const handleNextMove = () => {
        const moves = chessInstance.current.history();
        if (moveIndex.current < moves.length) {
            chessInstance.current.move(moves[moveIndex.current]);
            const newFen = chessInstance.current.fen();
            setFen(newFen);
            setFenInput(newFen);
            moveIndex.current += 1;
        }
    };

    // Handle PGN submission
    const handleSubmit = async () => {
        try {
            let pgn = pgnRef.current.value;
            const response = await axios.post('http://localhost:8080/play', { pgn });
            console.log(response.data);
            if (response.data.status === 'success') {
                chessInstance.current.loadPgn(pgn);
                setPgnLoaded(true);
                moveIndex.current = 0;
                const newFen = chessInstance.current.fen();
                setFen(newFen);
                setFenInput(newFen);
            } else {
                setPgnLoaded(false);
                setWinLoss(response.data.message);
            }
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    // Switch board orientation
    const handleSwitchOrientation = () => {
        setOrientation(orientation === 'white' ? 'black' : 'white');
    };

    return (
        <div style={{ position: 'relative', height: '100vh', paddingBottom: '50px', overflow: 'hidden' }}>
            <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.0 }}
                style={{ position: 'absolute', top: '10px', left: '10px'}}
            >
                <BackButton />
            </motion.div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <motion.div 
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.0 }}
                    style={{ paddingRight: "20px", paddingBottom: "30px" }}
                >
                    <EvaluationBar evaluation={evaluation} orientation={orientation} isMate={isMate} />
                </motion.div>
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.0 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                    <CustomBoard
                        ref={customBoardRef}
                        fen={fen}
                        setFen={setFen}
                        setWinLoss={setWinLoss}
                        chessInstance={chessInstance.current}
                        orientation={orientation}
                        customArrows={bestMove}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '10px' }}>
                        <Button onClick={handleUndo}>
                            Previous Move
                        </Button>
                        {pgnLoaded && <Button onClick={handleNextMove}>Next Move</Button>}
                        <Button onClick={handleSwitchOrientation}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-switch-vertical" width="30" height="30" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M3 8l4 -4l4 4" />
                                <path d="M7 4l0 9" />
                                <path d="M13 16l4 4l4 -4" />
                                <path d="M17 10l0 10" />
                            </svg>
                        </Button>
                    </div>
                </motion.div>
                <motion.div 
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.0 }}
                    style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        marginLeft: '20px', 
                        position: 'relative',
                        alignItems: 'center',
                    }}
                >
                    {loading && (
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            position: 'absolute', 
                            top: '30px',
                        }}>
                            <Spinner size="xl" color="teal.500" />
                        </div>
                    )}
                    {!loading && bestLine && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                width: '300px',
                                maxHeight: '150px',
                                position: 'absolute',
                                top: '-30px',
                                marginBottom: '30px',
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                border: '2px solid #008080',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                padding: '15px',
                            }}
                        >
                            <Text 
                                fontSize="xl" 
                                fontWeight="bold" 
                                style={{ 
                                    width: '100%', 
                                    textAlign: 'center',
                                    marginBottom: '10px',
                                    color: '#2C7A7B' 
                                }}
                            >
                                Best Line
                            </Text>
                            <Text 
                                fontSize="sm" 
                                color="gray.700" 
                                style={{ 
                                    width: '100%', 
                                    textAlign: 'left',
                                    overflowY: 'auto',
                                    paddingRight: '5px'
                                }}
                            >
                                {bestLine}
                            </Text>
                        </motion.div>
                    )}
                    <Select
                        placeholder="Select Depth"
                        value={depth}
                        onChange={(e) => setDepth(Number(e.target.value))}
                        mt={4}
                        width="300px"
                        margin="120px 0 0 0"
                        border="3px solid"
                        borderColor="#1E8C87"
                        borderRadius="8px"
                        focusBorderColor="#008080"
                        _hover={{
                            borderColor: "#008080",
                        }}
                    >
                        {[...Array(24).keys()].map(i => (
                            <option key={i} value={i + 1}>Depth: {i + 1}</option>
                        ))}
                    </Select>
                    <Input
                        value={fenInput}
                        onChange={handleFenChange}
                        width="300px"
                        height="50px"
                        fontSize="16px"
                        padding="10px"
                        margin="10px 0"
                        border="3px solid"
                        borderColor={fenError ? "red" : "#1E8C87"}
                        borderRadius="8px"
                        placeholder="Enter FEN"
                        focusBorderColor="#008080"
                        _hover={{
                            borderColor: "#008080",
                        }}
                        sx={{
                            '::placeholder': {
                                color: '#008080',
                            },
                        }}
                        onFocus={(event) => event.target.select()}
                        spellCheck="false"
                    />
                    <Textarea
                        ref={pgnRef}
                        width="300px"
                        height="300px"
                        fontSize="16px"
                        padding="10px"
                        resize="none"
                        margin="0px 0"
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
                    <Button onClick={handleSubmit} style={{ marginTop: '10px', width: '300px' }}>Submit</Button>
                </motion.div>
            </div>
            {winLoss && <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.0 }}
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    zIndex: 1000
                }}
            >
                {winLoss}
            </motion.div>}
        </div>

    );
}

export default Play;
