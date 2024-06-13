import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

// Function to determine the color of a square
function getSquareColor(square) {
    const letter = square.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    const number = parseInt(square[1], 10);
    return (letter + number) % 2 === 0 ? 'light' : 'dark';
}

const CustomBoard = forwardRef(({ fen, orientation, setFen, setWinLoss }, ref) => {
    const chess = useRef(new Chess());
    const [squareStyles, setSquareStyles] = useState({});
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [animationDuration, setAnimationDuration] = useState(250);
    const [promotionMove, setPromotionMove] = useState(null);
    const [showPromotionOptions, setShowPromotionOptions] = useState(false);
    const [promotionSquare, setPromotionSquare] = useState(null);

    useEffect(() => {
        if (fen && fen !== chess.current.fen()) {
            chess.current.load(fen);
            setSquareStyles({});
            setSelectedSquare(null);

            // Check if the king is in check after loading the new position
            if (chess.current.isCheck()) {
                highlightKingInCheck();
            }
        }
    }, [fen]);

    // Function to handle piece drop
    const onDrop = (sourceSquare, targetSquare) => {
        const previousFen = chess.current.fen();
        const isPromotion = (sourceSquare[1] === '7' && targetSquare[1] === '8') ||
                            (sourceSquare[1] === '2' && targetSquare[1] === '1');
        if (isPromotion) {
            setPromotionMove({ from: sourceSquare, to: targetSquare });
            setPromotionSquare(targetSquare);
            setShowPromotionOptions(true);
            return false; // Returning false to prevent the default promotion dialog
        }

        try {
            let move = chess.current.move({
                from: sourceSquare,
                to: targetSquare
            });

            if (move === null) {
                // Invalid move, revert to previous state
                chess.current.load(previousFen);
                return false;
            }

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
            return true;
        } catch (error) {
            chess.current.load(previousFen); // Revert to previous state on error
            return false;
        }
    };

    const handlePromotion = (piece) => {
        const { from, to } = promotionMove;
        const move = chess.current.move({
            from,
            to,
            promotion: piece
        });

        if (move === null) {
            // Invalid move, return false
            setShowPromotionOptions(false);
            return false;
        }

        // Update the FEN string and return true
        setFen(chess.current.fen());
        setShowPromotionOptions(false);

        // Highlight the move squares
        setSquareStyles({
            [from]: { backgroundColor: 'rgba(200, 255, 255, 0.4)' },
            [to]: { backgroundColor: 'rgba(200, 255, 255, 0.4)' }
        });

        // Highlight the king if in check
        if (chess.current.isCheck()) {
            highlightKingInCheck();
        }

        // Check for game over conditions
        if (chess.current.isGameOver()) {
            handleGameOver();
        }
        return true;
    };

    // Function to handle square click
    const onSquareClick = (square) => {
        setAnimationDuration(250); // Enable animation for click moves
        if (selectedSquare) {
            const legalMove = chess.current
                .moves({ square: selectedSquare, verbose: true })
                .some(move => move.to === square);

            if (legalMove) {
                let move = { from: selectedSquare, to: square };

                if (selectedSquare[1] === '7' && square[1] === '8') {
                    setPromotionMove(move);
                    setPromotionSquare(square);
                    setShowPromotionOptions(true);
                    return;
                }

                chess.current.move(move);
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

    // Expose undoMove function to parent component
    useImperativeHandle(ref, () => ({
        undoMove: () => {
            chess.current.undo();
            setFen(chess.current.fen());
            setSquareStyles({});
        }
    }));

    return (
        <div style={{ position: 'relative' }}>
            <Chessboard
                position={fen}
                orientation={orientation}
                onSquareClick={onSquareClick}
                onPieceDrop={onDrop}
                areArrowsAllowed={true}
                customSquareStyles={squareStyles}
                boardOrientation={orientation}
                boardWidth={550}
                customDarkSquareStyle={{ backgroundColor: '#008080' }}
                customLightSquareStyle={{ backgroundColor: '#20B2AA' }}
                customBoardStyle={{
                    border: '2px solid #008080',
                    borderRadius: '5px',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
                }}
                animationDuration={animationDuration}
                onPieceDragEnd={() => setAnimationDuration(0)}
            />
            {showPromotionOptions && promotionSquare && (
                <div style={{
                    position: 'absolute',
                    top: promotionSquare[1] === '8' ? '10px' : 'auto',
                    bottom: promotionSquare[1] === '1' ? '10px' : 'auto',
                    left: `${(promotionSquare.charCodeAt(0) - 97) * 68}px`,
                    zIndex: 1000,
                    background: 'white',
                    border: '1px solid black',
                    borderRadius: '5px',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <button onClick={() => handlePromotion('q')}>Queen</button>
                    <button onClick={() => handlePromotion('r')}>Rook</button>
                    <button onClick={() => handlePromotion('b')}>Bishop</button>
                    <button onClick={() => handlePromotion('n')}>Knight</button>
                </div>
            )}
        </div>
    );
});

export default CustomBoard;
