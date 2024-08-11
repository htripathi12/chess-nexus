import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Chessboard } from 'react-chessboard';

// Function to determine the color of a square
function getSquareColor(square) {
    const letter = square.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    const number = parseInt(square[1], 10);
    return (letter + number) % 2 === 0 ? 'light' : 'dark';
}

const CustomBoard = forwardRef(({ fen, orientation, setFen, setWinLoss, onMove, chessInstance, disableBoard, customArrows }, ref) => {
    const [squareStyles, setSquareStyles] = useState({});
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [animationDuration, setAnimationDuration] = useState(250);


    // Function to highlight the king in check
    const highlightKingInCheck = useCallback((styles = {}) => {
        const kingPosition = chessInstance.board().flat().find(piece => piece && piece.type === 'k' && piece.color === chessInstance.turn());
        if (kingPosition) {
            styles[kingPosition.square] = {
                backgroundImage: 'radial-gradient(circle at center, rgba(255, 0, 0, 1) 25%, rgba(255, 0, 0, 0) 80%)'
            };
        }
        setSquareStyles(styles);
    }, [chessInstance]);

    useEffect(() => {
        if (fen && fen !== chessInstance.fen()) {
            chessInstance.load(fen);
            setSquareStyles({});
            setSelectedSquare(null);

            // Check if the king is in check after loading the new position
            if (chessInstance.isCheck()) {
                highlightKingInCheck();
            }
        }
    }, [fen, chessInstance, highlightKingInCheck]);

    // Function to handle piece drop
    const onDrop = (sourceSquare, targetSquare) => {
        if (disableBoard) return false;

        const previousFen = chessInstance.fen();

        try {
            let move = chessInstance.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q' // always promote to queen
            });

            if (move === null) {
                // Invalid move, revert to previous state
                chessInstance.load(previousFen);
                return false;
            }

            // Log the move
            if (onMove) {
                onMove(sourceSquare, targetSquare);
            }

            // Highlight the move squares
            setSquareStyles({
                [sourceSquare]: { backgroundColor: 'rgba(200, 255, 255, 0.4)' },
                [targetSquare]: { backgroundColor: 'rgba(200, 255, 255, 0.4)' }
            });

            // Highlight the king if in check
            if (chessInstance.isCheck()) {
                highlightKingInCheck();
            }

            setFen(chessInstance.fen());

            // Check for game over conditions
            if (chessInstance.isGameOver()) {
                handleGameOver();
            }
            return true;
        } catch (error) {
            chessInstance.load(previousFen); // Revert to previous state on error
            return false;
        }
    };

    // Function to handle square click
    const onSquareClick = (square) => {
        if (disableBoard) return;

        setAnimationDuration(250); // Enable animation for click moves
        if (selectedSquare) {
            const legalMove = chessInstance
                .moves({ square: selectedSquare, verbose: true })
                .some(move => move.to === square);

            if (legalMove) {
                chessInstance.move({ from: selectedSquare, to: square, promotion: 'q' });

                // Log the move
                if (onMove) {
                    onMove(selectedSquare, square);
                }

                setFen(chessInstance.fen());
                setSquareStyles({
                    [selectedSquare]: { backgroundColor: 'rgba(200, 255, 255, 0.4)' },
                    [square]: { backgroundColor: 'rgba(200, 255, 255, 0.4)' }
                });
                setSelectedSquare(null);

                if (chessInstance.isCheck()) {
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
        const moves = chessInstance.moves({ square, verbose: true });
        const newSquareStyles = {};

        for (const move of moves) {
            const squareColor = getSquareColor(move.to);
            if (move.flags.includes('c')) {
                let circleColor = squareColor === 'light' ? 'rgba(0, 128, 128, 0.85)' : 'rgba(32, 178, 170, 0.85)';
                newSquareStyles[move.to] = {
                    backgroundColor: 'rgba(222, 184, 135, 1)',
                    backgroundImage: `radial-gradient(ellipse at center, ${circleColor} 55%, transparent 100%)`
                };
            } else {
                newSquareStyles[move.to] = {
                    backgroundImage: 'radial-gradient(circle at center, rgba(222, 184, 135, 0.9) 23%, transparent 21%)' // Increased opacity
                };
            }
        }
        

        if (chessInstance.isCheck()) {
            highlightKingInCheck(newSquareStyles);
        }

        setSquareStyles(newSquareStyles);
    };

    // Function to handle game over conditions
    const handleGameOver = () => {
        if (chessInstance.isCheckmate()) {
            setWinLoss('Checkmate');
        } else if (chessInstance.isDraw()) {
            setWinLoss('Draw');
        } else if (chessInstance.isStalemate()) {
            setWinLoss('Stalemate');
        } else if (chessInstance.isThreefoldRepetition()) {
            setWinLoss('Threefold Repetition');
        } else if (chessInstance.isInsufficientMaterial()) {
            setWinLoss('Insufficient Material');
        }
    };

    // Expose undoMove function to parent component
    useImperativeHandle(ref, () => ({
        undoMove: () => {
            chessInstance.undo();
            setFen(chessInstance.fen());
            setSquareStyles({});
        }
    }));

    return (
        <div style={{ position: 'relative' }}>
            <Chessboard
                position={fen}
                onSquareClick={onSquareClick}
                showPromotionDialog={false}
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
                customArrows={customArrows}
                animationDuration={animationDuration}
            />
        </div>
    );
});

export default CustomBoard;
