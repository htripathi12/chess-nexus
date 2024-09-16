import React, { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { Box, Textarea, Button, Text, Select, Input, Spinner, Tab, Tabs, TabList } from '@chakra-ui/react';

import CustomBoard from '../components/CustomBoard';
import EvaluationBar from '../components/EvaluationBar';
import BackButton from '../components/BackButton';

import { Chess } from 'chess.js';
import { motion } from 'framer-motion';



function Play() {
    // State variables
    const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const [orientation, setOrientation] = useState('white');

    const [fenError, setFenError] = useState(false);
    const [pgnLoaded, setPgnLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isMate, setIsMate] = useState(false);
    const [gamesLoaded, setGamesLoaded] = useState(false);
    const [usingSideline, setUsingSideline] = useState(false);

    const [bestMove, setBestMove] = useState([]);
    const [bestLine, setBestLine] = useState([]);
    const [ccPGN, setCCPGN] = useState([]);
    const [lichessPGN, setLichessPGN] = useState([]);
    const [history, setHistory] = useState([]);
    const [sidelineHistory, setSidelineHistory] = useState([]);

    const [depth, setDepth] = useState(19);
    const [evaluation, setEvaluation] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);

    // Refs
    const customBoardRef = useRef(null);
    const pgnRef = useRef(null);
    const stockfishWorkerRef = useRef(null);
    const chessInstance = useRef(new Chess());
    const moveIndex = useRef(0);

    const auth = useAuth();

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
            console.error(error);
        }
    }, [auth]);

    // Fetch PGNs on component mount
    useEffect(() => { 
        const fetchPGNs = async () => {
            try {
                const chesscompgn = await getChessComPGNs();
                const lichesspgn = await getLichessGames();
    
                const chesscompgnArray = chesscompgn ? chesscompgn.split('\n\n') : [];
                const lichesspgnArray = lichesspgn ? lichesspgn.split('\n\n') : [];
                
                if (lichesspgnArray.length > 0) {
                    lichesspgnArray.pop();
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
                const combinedLichesspgn = lichesspgnArray.length > 0 ? combineInPairs(lichesspgnArray) : [];
    
                setCCPGN(combinedChesscompgn);
                setLichessPGN(combinedLichesspgn);
                setGamesLoaded(true);
            } catch (error) {
                // Suppress error
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
        stockfishWorkerRef.current = new Worker("./stockfish.js");
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

    // Prevent page scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);
    
    // Get other user from Chess.com PGN
    const getOtherUserCC = (pgn) => {
        const whiteTag = '[White "';
        const blackTag = '[Black "';
        
        const startIndexWhite = pgn.indexOf(whiteTag) + whiteTag.length;
        const endIndexWhite = pgn.indexOf('"', startIndexWhite);
        const whiteUser = pgn.substring(startIndexWhite, endIndexWhite);
        
        const startIndexBlack = pgn.indexOf(blackTag) + blackTag.length;
        const endIndexBlack = pgn.indexOf('"', startIndexBlack);
        const blackUser = pgn.substring(startIndexBlack, endIndexBlack);
        
        if (whiteUser === auth.getChesscomUsername()) {
            return blackUser;
        }
        
        return whiteUser;
    };

    // Get other user from Lichess PGN
    const getOtherUserLichess = (pgn) => {
        const whiteTag = '[White "';
        const blackTag = '[Black "';
        
        const startIndexWhite = pgn.indexOf(whiteTag) + whiteTag.length;
        const endIndexWhite = pgn.indexOf('"', startIndexWhite);
        const whiteUser = pgn.substring(startIndexWhite, endIndexWhite);
        
        const startIndexBlack = pgn.indexOf(blackTag) + blackTag.length;
        const endIndexBlack = pgn.indexOf('"', startIndexBlack);
        const blackUser = pgn.substring(startIndexBlack, endIndexBlack);
        
        if (whiteUser === auth.getLichessUsername()) {
            return blackUser;
        }
        
        return whiteUser;
    };

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
        if (usingSideline) {
            if (sidelineHistory.length > 0) {
                chessInstance.current.undo();
                setFen(chessInstance.current.fen());
                setSidelineHistory(sidelineHistory.slice(0, -1));
            } else {
                setUsingSideline(false);
                setHistory(history);
                moveIndex.current = history.length - 1;
            }
        } else {
            if (history.length > 0) {
                chessInstance.current.undo();
                setFen(chessInstance.current.fen());
                setHistory(history.slice(0, -1));
            }
        }
    };

    // TODO: FIX REDO
    const handleRedo = () => {
        if (usingSideline) {
            moveIndex.current += 1;
            const move = sidelineHistory[moveIndex.current];
            chessInstance.current.move(move);
            setFen(chessInstance.current.fen());
            setSidelineHistory(sidelineHistory);
        } else {
            moveIndex.current += 1;
            const move = history[moveIndex.current];
            chessInstance.current.move(move);
            setFen(chessInstance.current.fen());
            setHistory(history);
        }
    };

    // Handle PGN submission
    const handleSubmit = async () => {
        try {
            let pgn = pgnRef.current.value;
            const response = await axios.post(process.env.REACT_APP_API_URL + '/play', { pgn });
            if (response.data.status === 'success') {
                chessInstance.current.loadPgn(pgn);
                setPgnLoaded(true);
                moveIndex.current = chessInstance.current.history().length - 1;
                const newFen = chessInstance.current.fen();
                setFen(newFen);
                setHistory(chessInstance.current.history({ verbose: true }));
            } else {
                setPgnLoaded(false);
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
            setFen(chessInstance.current.fen());
            setPgnLoaded(true);
            setHistory(chessInstance.current.history({ verbose: true }));
            setSidelineHistory([]);
            setUsingSideline(false);
            moveIndex.current = chessInstance.current.history().length - 1;
        } catch (error) {
            console.error(`Error loading PGN`, error);
        }
    };


    return (
        <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
            <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.0 }}
                style={{ position: 'absolute', top: '10px', left: '10px'}}
            >
                <BackButton />
            </motion.div>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                marginLeft: '50px'
            }}>
                <motion.div 
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.0 }}
                    style={{ paddingRight: "20px", paddingBottom: "30px" }}
                >
                    <EvaluationBar evaluation={evaluation} orientation={orientation} isMate={isMate} fen={fen} />
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
                            {pgnLoaded && (
                                <Button onClick={() => {handleRedo()}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px"
                                        fill="#008080">
                                        <path d="M660-240v-480h80v480h-80Zm-440 0v-480l360 240-360 240Zm80-240Zm0 
                                        90 136-90-136-90v180Z" />
                                    </svg>
                                </Button>
                            )}
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
                                    color: 'black' 
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
                        id="depth"
                        onChange={(e) => setDepth(Number(e.target.value))}
                        width="300px"
                        margin="125px 0 0 0"
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
                        id="pgn"
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
                    <Button onClick={handleSubmit} style={{ marginTop: '10px', width: '75px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px"
                            fill="#008080">
                            <path d="M170-228q-38-45-61-99T80-440h82q6 43 22 82.5t42 73.5l-56 
                            56ZM80-520q8-59 30-113t60-99l56 56q-26 34-42 73.5T162-520H80ZM438-82q-59-6-112.5-28.5T226-170l56-58q35
                            26 74 43t82 23v80ZM284-732l-58-58q47-37 101-59.5T440-878v80q-43 6-82.5 23T284-732ZM518-82v-80q44-6
                            83.5-22.5T676-228l58 58q-47 38-101.5 60T518-82Zm160-650q-35-26-75-43t-83-23v-80q59 6 113.5
                            28.5T734-790l-56 58Zm112 504-56-56q26-34 42-73.5t22-82.5h82q-8 59-30 113t-60
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
                            <div style={{ paddingTop: '10px' }}>
                                {(selectedTab === 0) && ccPGN.map((pgn, index) => (
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
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        border: "1px solid #17706B",
                                        ...(selectedButtonIndex === index && {
                                            boxShadow: "0 0 10px 0px rgba(255, 255, 255)",
                                            borderRadius: "10px",
                                        }),
                                    }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <span style={{ padding: '3px 0' }}>{auth.getChesscomUsername()}</span>
                                        <span style={{ padding: '3px 0' }}>vs</span>
                                        <span style={{ padding: '3px 0' }}>{getOtherUserCC(pgn)}</span>
                                    </div>
                                </Button>
                            ))}
                            {(selectedTab === 1) && lichessPGN.map((pgn, index) => (
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
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                    }}
                                    onClick={() => {
                                        handleGameListClick(pgn);
                                        setSelectedButtonIndex(index);
                                    }}
                                    style={{
                                        overflow: 'hidden',
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        border: "1px solid #17706B",
                                        ...(selectedButtonIndex === index && {
                                            boxShadow: "0 0 10px 0px rgba(255, 255, 255)",
                                            borderRadius: "10px",
                                        }),
                                    }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <span style={{ padding: '3px 0' }}>{auth.getLichessUsername()}</span>
                                        <span style={{ padding: '3px 0' }}>vs</span>
                                        <span style={{ padding: '3px 0' }}>{getOtherUserLichess(pgn)}</span>
                                    </div>
                                </Button>
                            ))}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

export default Play;