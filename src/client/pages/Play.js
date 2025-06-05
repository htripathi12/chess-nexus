import React, { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { Box, Textarea, Button, Text, Select, Input, Spinner, Tab, Tabs, TabList } from '@chakra-ui/react';
import { Virtuoso } from 'react-virtuoso';

import CustomBoard from '../components/CustomBoard';
import EvaluationBar from '../components/EvaluationBar';
import BackButton from '../components/BackButton';

import { Chess } from 'chess.js';
import { motion } from 'framer-motion';

import { useSearchParams } from 'react-router-dom';

function Play() {
    // State variables
    const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const [orientation, setOrientation] = useState('white');

    const [fenError, setFenError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isMate, setIsMate] = useState(false);
    const [gamesLoaded, setGamesLoaded] = useState(false);

    const [bestMove, setBestMove] = useState([]);
    const [bestLine, setBestLine] = useState([]);
    const [ccPGN, setCCPGN] = useState([]);
    const [lichessPGN, setLichessPGN] = useState([]);
    const [history, setHistory] = useState([]);

    const [depth, setDepth] = useState(19);
    const [evaluation, setEvaluation] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);
    const [pgnDeviation, setPgnDeviation] = useState(0);

    const [redoStack, setRedoStack] = useState([]);
    const [originalPgnMoves, setOriginalPgnMoves] = useState([]);


    // Refs
    const customBoardRef = useRef(null);
    const pgnRef = useRef(null);
    const stockfishWorkerRef = useRef(null);
    const chessInstance = useRef(new Chess());
    const moveIndex = useRef(0);

    const auth = useAuth();
    
    const [searchParams] = useSearchParams();
    useEffect(() => {
        const urlFen = searchParams.get('fen');
        const urlOrientation = searchParams.get('orientation');
        
        if (urlFen) {
            try {
                // Validate the FEN before setting it
                const testChess = new Chess();
                testChess.load(urlFen);
                setFen(urlFen);
                chessInstance.current.load(urlFen);
            } catch (error) {
                console.error('Invalid FEN from URL:', error);
            }
        }
        
        if (urlOrientation && (urlOrientation === 'white' || urlOrientation === 'black')) {
            setOrientation(urlOrientation);
        }
    }, [searchParams]);
    
    const handleScreenSize = () => {
        return window.innerWidth * .3;
    };


    const getChessComPGNs = useCallback(async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_URL + '/account/chesscom', {
                params: {
                    chesscomUsername: auth.getChesscomUsername(),
                },
                headers: {
                    Authorization: `Bearer ${auth.getToken()}`,
                }
            });
            return response.data.pgnArray;
        } catch (error) {
            console.error(error);
        }
    }, [auth]);
    
    const getLichessGames = useCallback(async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_URL + '/account/lichess', {
            params: {
                lichessUsername: auth.getLichessUsername(),
            },
            headers: {
                Authorization: `Bearer ${auth.getToken()}`,
            }
            });
            return response.data.pgnArray;
        } catch (error) {
            console.error("Lichess games fetch error:", error);
            return null;
        }
    }, [auth]);

    // Fetch PGNs on component mount
    useEffect(() => {
        const fetchPGNs = async () => {
            try {
                const chesscompgn = await getChessComPGNs();
                const lichesspgn = await getLichessGames();
    
                const chesscompgnArray = chesscompgn ? chesscompgn.split('\n\n') : [];
                let lichesspgnArray = [];
                if (lichesspgn) {
                    try {
                        const games = lichesspgn.split('\n\n[').map((game, index) => 
                            index === 0 ? game : '[' + game
                        ).filter(game => game.trim());
                        lichesspgnArray = games.filter(pgn => pgn.includes('[Event'));
                    } catch (e) {
                        console.error("Error processing Lichess data:", e);
                    }
                }
                const combineInPairs = (array) => {
                    const combinedArray = [];
                    for (let i = 0; i < array.length; i += 2) {
                        if (i + 1 < array.length) {
                            combinedArray.push(array[i] + '\n\n' + array[i + 1]);
                        } else {
                            combinedArray.push(array[i]);
                        }
                    }
                    return combinedArray;
                };
    
                const combinedChesscompgn = chesscompgnArray.length > 0 ? combineInPairs(chesscompgnArray) : [];
                setCCPGN(combinedChesscompgn);
                setLichessPGN(lichesspgnArray);
                setGamesLoaded(true);
            } catch (error) {
                console.error("Error fetching games:", error);
            }
        };
    
        if (auth.isLoggedIn) {
            fetchPGNs();
        }
    }, [getChessComPGNs, getLichessGames, auth]);

    const convertSAN = React.useCallback((data) => {
        let index = data.indexOf(' pv ');
        let line = data.substring(index + 4).split(' ');
        let chessTwo = new Chess(fen);
        try {
            line.forEach(move => { 
                chessTwo.move(move);
            });
        } catch (e) {
            console.error('Error loading PGN:', e);
        }
        setBestLine(chessTwo.history().join(' '));
    }, [fen, setBestLine]);

    const runStockfish = React.useCallback((position) => {
        if (stockfishWorkerRef.current) {
            setLoading(true);
            stockfishWorkerRef.current.postMessage(`position fen ${position}`);
            stockfishWorkerRef.current.postMessage(`go depth ${depth}`);
        }
    }, [depth, setLoading, stockfishWorkerRef]);

    // Initialize and handle Stockfish messages
    useEffect(() => {
        stockfishWorkerRef.current = new Worker("./stockfish-16.1.js");
        stockfishWorkerRef.current.postMessage("uci");

        stockfishWorkerRef.current.onmessage = (e) => {
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
    }, [fen, convertSAN, runStockfish]);

    // Run Stockfish on fen or depth change
    useEffect(() => {
        setBestMove([[]]);
        runStockfish(fen);
    }, [fen, depth, runStockfish]);
    
    // Get opponent of user from PGN
    const getOtherUser = (pgn, platform) => {
        const whiteTag = '[White "';
        const blackTag = '[Black "';
        
        const startIndexWhite = pgn.indexOf(whiteTag) + whiteTag.length;
        const endIndexWhite = pgn.indexOf('"', startIndexWhite);
        const whiteUser = pgn.substring(startIndexWhite, endIndexWhite);
        
        const startIndexBlack = pgn.indexOf(blackTag) + blackTag.length;
        const endIndexBlack = pgn.indexOf('"', startIndexBlack);
        const blackUser = pgn.substring(startIndexBlack, endIndexBlack);    
    
        if (platform === 'Chess.com') {
            if (whiteUser === auth.getChesscomUsername()) {
                return blackUser;
            }
        } else {
            if (whiteUser === auth.getLichessUsername()) {
                return blackUser;
            }
        }
        
        return whiteUser;
    };

    // Check if user is playing as black
    const isUserBlack = useCallback((pgn, platform) => {
        const blackTag = '[Black "';
        const startIndexBlack = pgn.indexOf(blackTag) + blackTag.length;
        const endIndexBlack = pgn.indexOf('"', startIndexBlack);
        const blackUser = pgn.substring(startIndexBlack, endIndexBlack);
    
        if (platform === 'Chess.com') {
            return blackUser === auth.getChesscomUsername();
        } else {
            return blackUser === auth.getLichessUsername();
        }
    }, [auth]);
    
    // Handle best move from Stockfish
    const handleBestMove = (data) => {
        const bestMoveFull = data.split(' ')[1];
        const bestMoveSquares = [[bestMoveFull.substring(0, 2), bestMoveFull.substring(2, 4)]];
        setBestMove(bestMoveSquares);
        setLoading(false);
    };

    // Handle centipawn evaluation from Stockfish
    const handleCentipawnEvaluation = (data) => {
        const tempEval = data.split(' ')[9] / 100;
        const isWhiteTurn = chessInstance.current.turn() === 'w';
        setEvaluation(isWhiteTurn ? tempEval : -tempEval);
        setIsMate(false);
    };

    // Handle mate evaluation from Stockfish
    const handleMateEvaluation = (data) => {
        const mateInMoves = data.split(' ')[9];
        setEvaluation(mateInMoves);
        setIsMate(true);
    };

    // Handle FEN change
    const handleFenChange = (event) => {
        const inputFen = event.target.value;
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
        if (history.length > 0) {
            const lastMove = history[history.length - 1];
            setRedoStack([...redoStack, lastMove]);
            
            chessInstance.current.undo();
            setFen(chessInstance.current.fen());
            setHistory(history.slice(0, -1));
            moveIndex.current = history.length - 2;
            
            // If we're undoing a deviated move, decrease deviation counter
            if (pgnDeviation > 0) {
                setPgnDeviation(pgnDeviation - 1);
            }
        } else {
            //console.log("No moves to undo");
        }
    };

    // Implement the redo function
    const handleRedo = () => {
        // If we have deviated from the original PGN and have some moves in redoStack
        if (pgnDeviation === 0 && redoStack.length > 0) {
            const moveToRedo = redoStack[redoStack.length - 1];
            
            try {
                // Make the move from our redo stack
                chessInstance.current.move({
                    from: moveToRedo.from,
                    to: moveToRedo.to,
                    promotion: moveToRedo.promotion
                });
                
                // Update state
                setFen(chessInstance.current.fen());
                setHistory([...history, moveToRedo]);
                setRedoStack(redoStack.slice(0, -1));
                moveIndex.current = history.length;
            } catch (error) {
                console.error("Error redoing move:", error);
                // Clear invalid redo stack
                setRedoStack([]);
            }
        } 
        // If we're on the original PGN path and there are more moves
        else if (pgnDeviation === 0 && history.length < originalPgnMoves.length) {
            const nextPgnMove = originalPgnMoves[history.length];
            
            try {
                // Make the next move from original PGN
                chessInstance.current.move({
                    from: nextPgnMove.from,
                    to: nextPgnMove.to,
                    promotion: nextPgnMove.promotion
                });
                
                // Update state
                setFen(chessInstance.current.fen());
                setHistory([...history, nextPgnMove]);
                moveIndex.current = history.length;
            } catch (error) {
                console.error("Error applying next PGN move:", error);
            }
        }
    };

    // Handle PGN submission
    const handleSubmit = async () => {
        try {
            let pgn = pgnRef.current.value;
            const response = await axios.post(process.env.REACT_APP_API_URL + '/play', { pgn });
            if (response.data.status === 'success') {
                chessInstance.current.loadPgn(pgn);
                
                // Store the original PGN moves
                const originalMoves = chessInstance.current.history({ verbose: true });
                setOriginalPgnMoves(originalMoves);
                
                moveIndex.current = originalMoves.length - 1;
                const newFen = chessInstance.current.fen();
                setFen(newFen);
                setHistory(originalMoves);
                setPgnDeviation(0); // Reset deviation counter
                setRedoStack([]);   // Clear redo stack
            }
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    // Switch board orientation
    const handleSwitchOrientation = () => {
        setOrientation(orientation === 'white' ? 'black' : 'white');
    };

    // Load PGN and handle deviations
    const handleGameListClick = (pgn) => {
        try {
            chessInstance.current.loadPgn(pgn);
            
            // Store the original PGN moves
            const originalMoves = chessInstance.current.history({ verbose: true });
            setOriginalPgnMoves(originalMoves);
            
            setFen(chessInstance.current.fen());
            setHistory(originalMoves);
            setPgnDeviation(0); // Reset deviation counter
            setRedoStack([]);   // Clear redo stack
            
            if (selectedTab === 0) {
                setOrientation(isUserBlack(pgn, "Chess.com") ? 'white' : 'black');
            } else {
                setOrientation(isUserBlack(pgn) ? 'white' : 'black');
            }
            moveIndex.current = originalMoves.length - 1;
        } catch (error) {
            console.error(`Error loading PGN`, error);
        }
    };

    const handleUserMove = (move) => {
        // Check if this move deviates from the original PGN
        if (history.length < originalPgnMoves.length) {
            const nextPgnMove = originalPgnMoves[history.length];
            
            // If the user's move differs from the next move in the original PGN
            if (move.from !== nextPgnMove.from || move.to !== nextPgnMove.to || 
                (move.promotion && move.promotion !== nextPgnMove.promotion)) {
                setPgnDeviation(prev => prev + 1);
                setRedoStack([]); // Clear redo stack when deviating
            }
        }
        
        // Add move to history
        setHistory([...history, move]);
        moveIndex.current = history.length;
    };


    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.0 }}
                style={{
                    position: handleScreenSize() <= 200 ? 'relative' : 'absolute',
                    top: handleScreenSize() <= 200 ? '0px' : '10px',
                    left: handleScreenSize() <= 200 ? '0px' : '10px',
                    zIndex: 1,
                }}
                >
                <BackButton />
            </motion.div>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}>
                <motion.div 
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.0 }}
                    style={{ paddingRight: "20px", paddingBottom: "30px" }}
                >
                    <EvaluationBar evaluation={evaluation} orientation={orientation} isMate={isMate} fen={fen} height={handleScreenSize()} />
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
                        chessInstance={chessInstance.current}
                        orientation={orientation}
                        customArrows={bestMove}
                        boardWidth={handleScreenSize()}
                        onUserMove={handleUserMove}
                    />
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        marginTop: '10px',
                        justifyContent: 'space-between',
                    }}>
                        <Box>
                            <Button onClick={handleUndo} mr={2}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px"
                                    fill="#008080">
                                    <path d="M220-240v-480h80v480h-80Zm520 0L380-480l360-240v480Zm-80-240Zm0 90v-180l-136 90 136 90Z" />
                                </svg>
                            </Button>
                            <Button onClick={() => {handleRedo()}}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px"
                                    fill="#008080">
                                    <path d="M660-240v-480h80v480h-80Zm-440 0v-480l360 240-360 240Zm80-240Zm0 
                                    90 136-90-136-90v180Z" />
                                </svg>
                            </Button>
                        </Box>
                        <Button onClick={handleSwitchOrientation}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-switch-vertical"
                                width="32" height="32" viewBox="0 0 24 24" strokeWidth="1.8" stroke="#008080" fill="none"
                                strokeLinecap="round" strokeLinejoin="round">
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
                        width: '300px',
                    }}
                >
                    <div 
                        style={{
                            width: '100%',
                            height: '110px',
                            marginBottom: '15px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: loading ? 'transparent' : 'white',
                            borderRadius: '10px',
                            border: loading ? 'none' : '2px solid #008080',
                            boxShadow: loading ? 'none' : '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        {loading ? (
                            <Spinner 
                                size={handleScreenSize() === 550 ? 'xl' : 'md'} 
                                color="teal.500" 
                            />
                        ) : bestLine && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', 
                                    width: '100%',
                                    height: '100%',
                                    padding: '15px',
                                    overflow: 'hidden',
                                }}
                            >
                                <Text 
                                    fontSize="xl" 
                                    fontWeight="bold" 
                                    style={{ 
                                        width: '100%', 
                                        textAlign: 'center',
                                        marginBottom: '5px',
                                        color: 'black' 
                                    }}
                                >
                                    Best Line
                                </Text>
                                <Box 
                                    style={{ 
                                        width: '100%',
                                        height: '65px',
                                        overflowY: 'auto',
                                        paddingRight: '5px'
                                    }}
                                >
                                    <Text 
                                        fontSize="sm" 
                                        color="gray.700"
                                        style={{ 
                                            width: '100%', 
                                            textAlign: 'left'
                                        }}
                                    >
                                        {bestLine}
                                    </Text>
                                </Box>
                            </motion.div>
                        )}
                    </div>

                    <Select
                        placeholder="Select Depth"
                        value={depth}
                        id="depth"
                        onChange={(e) => setDepth(Number(e.target.value))}
                        width="100%"
                        margin="0 0 10px 0"
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
                        value={fen}
                        id="fen"
                        onChange={handleFenChange}
                        width="100%"
                        height="50px"
                        fontSize="16px"
                        padding="10px"
                        margin="0 0 10px 0"
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
                        id="pgn"
                        width="300px"
                        height={
                            handleScreenSize() === 200
                            ? '100px'
                            : handleScreenSize() === 300
                            ? '150px'
                            : '300px'
                        }
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
                    <Button onClick={handleSubmit} style={{ marginTop: '10px', width: '75px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px"
                            fill="#008080">
                            <path d="M170-228q-38-45-61-99T80-440h82q6 43 22 82.5t42 73.5l-56 
                            56ZM80-520q8-59 30-113t60-99l56 56q-26 34-42 73.5T162-520H80ZM438-82q-59-6-112.5-28.5T226-170l56-58q35
                            26 74 43t82 23v80ZM284-732l-58-58q47-37 101-59.5T440-878v80q-43 6
                            82.5 23T284-732ZM518-82v-80q44-6
                            83.5-22.5T676-228l58 58q-47 38-101.5 60T518-82Zm160-650q-35-26-75-43t-83-23v-80q59 6
                            113.5 28.5T734-790l-56 58Zm112 504-56-56q26-34 42-73.5t22-82.5h82q-8 59-30 113t-60
                            99Zm8-292q-6-43-22-82.5T734-676l56-56q38 45 61 99t29 113h-82ZM441-280v-247L337-423l-56-57
                            200-200 200 200-57 56-103-103v247h-80Z" />
                        </svg>
                    </Button>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        width: '300px',
                        height: '600px',
                        position: 'relative',
                        borderRadius: '10px',
                        border: '3px solid #1E8C87',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        padding: '15px',
                        marginLeft: '20px',
                        marginBottom: '15px',
                    }}
                >
                    <Tabs
                        orientation="horizontal"
                        variant="enclosed"
                        width="100%"
                        height="10%"
                        display="flex"
                        justifyContent="center"
                        onChange={(index) => {
                            setSelectedTab(index);
                            setSelectedButtonIndex(null);
                        }
                        }
                    >
                        <TabList
                            borderColor="#1E8C87"
                            borderBottom="none"
                            display="flex"
                            justifyContent="center"
                            width="100%"
                        >
                            <Tab 
                                justifyContent="center" 
                                borderRadius="10px" 
                                border="1px solid #1E8C87"
                                _selected={{ 
                                    color: "black", 
                                    bg: "#1E8C87",
                                    borderColor: "#1E8C87",
                                    borderBottom: "1px solid #1E8C87",
                                }}
                                mr={2}
                            >
                                Chess.com
                            </Tab>
                            <Tab 
                                justifyContent="center" 
                                borderRadius="10px" 
                                border="1px solid #1E8C87"
                                _selected={{ 
                                    color: "black", 
                                    bg: "#1E8C87",
                                    borderColor: "#1E8C87",
                                    borderBottom: "1px solid #1E8C87"
                                }}
                            >
                                Lichess.org
                            </Tab>
                        </TabList>
                    </Tabs>
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'stretch',
                            width: '100%',
                            height: '100%',
                            overflowY: 'auto',
                            marginTop: '10px',
                            padding: '0 5px',
                        }}
                    >
                        {auth.isLoggedIn && !gamesLoaded ? (
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                position: 'relative',
                                justifyContent: 'center',
                                height: '100%',
                            }}>
                                <Spinner boxSize="4rem" color="teal.500" />
                            </div>
                        ) : (
                            <div style={{ paddingTop: '10px', height: '500px' }}>
                                {selectedTab === 0 && (
                                    <Virtuoso
                                        style={{ height: '500px' }}
                                        totalCount={ccPGN.length}
                                        itemContent={(index) => {
                                            const pgn = ccPGN[index];
                                            const isSelected = selectedButtonIndex === index;
                                            
                                            return (
                                                <Button 
                                                    key={index} 
                                                    width="100%" 
                                                    p={9} 
                                                    mb={2} 
                                                    borderRadius="10px"
                                                    backgroundColor="#1E8C87"
                                                    color="white"
                                                    fontSize={14}
                                                    _hover={{
                                                        backgroundColor: "#17706B",
                                                    }}
                                                    onClick={() => {
                                                        handleGameListClick(pgn);
                                                        setSelectedButtonIndex(index);
                                                    }}
                                                    style={{
                                                        overflow: 'hidden',
                                                        border: isSelected 
                                                            ? "1px solid white" 
                                                            : "1px solid #17706B",
                                                        position: "relative",
                                                        transition: "all 0.2s ease"
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                        <span style={{ padding: '3px 0', color: isUserBlack(pgn, "Chess.com") ? 'white' : 'black' }}>{auth.getChesscomUsername()}</span>
                                                        <span style={{ padding: '3px 0', color: 'rgb(245, 191, 79)' }}>vs</span>
                                                        <span style={{ padding: '3px 0', color: isUserBlack(pgn, "Chess.com") ? 'black' : 'white' }}>{getOtherUser(pgn, "Chess.com")}</span>
                                                    </div>
                                                </Button>
                                            );
                                        }}
                                    />
                                )}
                                
                                {selectedTab === 1 && (
                                    <Virtuoso
                                        style={{ height: '500px' }}
                                        totalCount={lichessPGN.length}
                                        itemContent={(index) => {
                                            const pgn = lichessPGN[index];
                                            const isSelected = selectedButtonIndex === index;
                                            
                                            return (
                                                <Button 
                                                    key={index} 
                                                    width="100%" 
                                                    mb={2} 
                                                    p={9}
                                                    borderRadius="10px"
                                                    backgroundColor="#1E8C87"
                                                    color="white"
                                                    fontSize={14}
                                                    _hover={{
                                                        backgroundColor: "#17706B",
                                                    }}
                                                    onClick={() => {
                                                        handleGameListClick(pgn);
                                                        setSelectedButtonIndex(index);
                                                    }}
                                                    style={{
                                                        overflow: 'hidden',
                                                        border: isSelected 
                                                            ? "2px solid white" 
                                                            : "1px solid #17706B",
                                                        position: "relative",
                                                        transition: "all 0.2s ease"
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                        <span style={{ padding: '3px 0', color: isUserBlack(pgn) ? 'white' : 'black' }}>{auth.getLichessUsername()}</span>
                                                        <span style={{ padding: '3px 0', color: 'rgb(245, 191, 79)' }}>vs</span>
                                                        <span style={{ padding: '3px 0', color: isUserBlack(pgn) ? 'black' : 'white' }}>{getOtherUser(pgn)}</span>
                                                    </div>
                                                </Button>
                                            );
                                        }}
                                    />
                                )}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

export default Play;