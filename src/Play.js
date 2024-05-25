import React, { useRef, useState, useEffect } from 'react';
import { Button, ChakraProvider } from '@chakra-ui/react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

// Function to determine the color of a square
function getSquareColor(square) {
    const letter = square.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    const number = parseInt(square[1], 10);
    return (letter + number) % 2 === 0 ? 'light' : 'dark';
}

function Play() {
    const chess = useRef(new Chess());
    const [fen, setFen] = useState(chess.current.fen());
    const [squareStyles, setSquareStyles] = useState({});
    const [winLoss, setWinLoss] = useState('');
    const [selectedSquare, setSelectedSquare] = useState(null);

    useEffect(() => {
        setFen(chess.current.fen());
    }, []);

    // Function to handle piece drop
    const onDrop = (sourceSquare, targetSquare) => {
        const fen = chess.current.fen();
        try {
            let move = chess.current.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q' // Automatically promote to queen
            });

            if (move === null) return; // Invalid move

            // Highlight the move squares
            setSquareStyles({
                [sourceSquare]: { backgroundColor: 'rgba(200, 255, 255, 0.4)' },
                [targetSquare]: { backgroundColor: 'rgba(200, 255, 255, 0.4)' }
            });

            // Highlight the king if in check
            if (chess.current.isCheck()) {
                highlightKingInCheck();
            }

            setFen(chess.current.fen());

            // Check for game over conditions
            if (chess.current.isGameOver()) {
                handleGameOver();
            }
        } catch (error) {
            chess.current.load(fen); // Revert to previous state on error
        }
    };

    // Function to handle square click
    const onSquareClick = (square) => {
        if (selectedSquare) {
            const legalMove = chess.current
                .moves({ square: selectedSquare, verbose: true })
                .some(move => move.to === square);

            if (legalMove) {
                chess.current.move({ from: selectedSquare, to: square });
                setFen(chess.current.fen());
                setSquareStyles({
                    [selectedSquare]: { backgroundColor: 'rgba(200, 255, 255, 0.4)' },
                    [square]: { backgroundColor: 'rgba(200, 255, 255, 0.4)' }
                });
                setSelectedSquare(null);

                if (chess.current.isCheck()) {
                    highlightKingInCheck();
                }
                return;
            }
        }

        setSelectedSquare(square);
        highlightLegalMoves(square);
    };

    // Function to highlight legal moves
    const highlightLegalMoves = (square) => {
        const moves = chess.current.moves({ square, verbose: true });
        const newSquareStyles = {};

        for (const move of moves) {
            const squareColor = getSquareColor(move.to);
            if (move.flags.includes('c')) {
                let circleColor = squareColor === 'light' ? '#008080' : '#20B2AA';
                newSquareStyles[move.to] = {
                    backgroundColor: 'rgba(211, 211, 211, 1)',
                    backgroundImage: `radial-gradient(ellipse at center, ${circleColor} 50%, transparent 100%)`
                };
            } else {
                newSquareStyles[move.to] = {
                    backgroundImage: 'radial-gradient(circle at center, rgba(211, 211, 211, 1) 20%, rgba(211, 211, 211, 0) 26%)'
                };
            }
        }

        if (chess.current.isCheck()) {
            highlightKingInCheck(newSquareStyles);
        }

        setSquareStyles(newSquareStyles);
    };

    // Function to highlight the king in check
    const highlightKingInCheck = (styles = {}) => {
        const kingPosition = chess.current.board().flat().find(piece => piece && piece.type === 'k' && piece.color === chess.current.turn());
        if (kingPosition) {
            styles[kingPosition.square] = {
                backgroundImage: 'radial-gradient(circle at center, rgba(255, 0, 0, 1) 25%, rgba(255, 0, 0, 0) 80%)'
            };
        }
        setSquareStyles(styles);
    };

    // Function to handle game over conditions
    const handleGameOver = () => {
        if (chess.current.isCheckmate()) {
            setWinLoss('Checkmate');
        } else if (chess.current.isDraw()) {
            setWinLoss('Draw');
        } else if (chess.current.isStalemate()) {
            setWinLoss('Stalemate');
        } else if (chess.current.isThreefoldRepetition()) {
            setWinLoss('Threefold Repetition');
        } else if (chess.current.isInsufficientMaterial()) {
            setWinLoss('Insufficient Material');
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', height: '100vh' }}>
            <Chessboard
                position={fen}
                onSquareClick={onSquareClick}
                onPieceDrop={onDrop}
                customSquareStyles={squareStyles}
                boardOrientation="white"
                boardWidth={550}
                customDarkSquareStyle={{ backgroundColor: '#008080' }}
                customLightSquareStyle={{ backgroundColor: '#20B2AA' }}
                customBoardStyle={{
                    border: '2px solid #008080',
                    borderRadius: '5px',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
                }}
                animationDuration={0}
            />
            <div style={{ flexDirection: 'column' }}>
                <Button style={{ marginTop: '30px' }} onClick={() => {
                    chess.current.undo();
                    setFen(chess.current.fen());
                    setSquareStyles({});
                }}>Previous Move</Button>
            </div>
            {winLoss && <div>{winLoss}</div>}
        </div>
    );
}

export default Play;
