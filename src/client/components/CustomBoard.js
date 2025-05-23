import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Chessboard } from 'react-chessboard';

// Function to determine the color of a square
function getSquareColor(square) {
    const letter = square.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    const number = parseInt(square[1], 10);
    return (letter + number) % 2 === 0 ? 'light' : 'dark';
}

const CustomBoard = forwardRef(({ fen, orientation, setFen, onUserMove, chessInstance, disableBoard, customArrows, boardWidth }, ref) => {
    const [squareStyles, setSquareStyles] = useState({});
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [animationDuration, setAnimationDuration] = useState(250);

    useEffect(() => {
        if (fen && fen !== chessInstance.fen()) {
            chessInstance.load(fen);
            setSquareStyles({});
            setSelectedSquare(null);
        }
    }, [fen, chessInstance]);

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

            // Call the onUserMove callback with the move details
            if (onUserMove) {
                onUserMove(move);
            }

            // Highlight the move squares
            setSquareStyles({
                [sourceSquare]: { backgroundColor: 'rgba(200, 255, 255, 0.4)' },
                [targetSquare]: { backgroundColor: 'rgba(200, 255, 255, 0.4)' }
            });

            setFen(chessInstance.fen());

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
            const legalMoves = chessInstance.moves({ 
                square: selectedSquare, 
                verbose: true 
            });
            
            const matchingMove = legalMoves.find(move => move.to === square);

            if (matchingMove) {
                const move = chessInstance.move({ 
                    from: selectedSquare, 
                    to: square, 
                    promotion: 'q' 
                });

                // Call the onUserMove callback with the move details
                if (onUserMove) {
                    onUserMove(move);
                }

                setFen(chessInstance.fen());
                setSquareStyles({
                    [selectedSquare]: { backgroundColor: 'rgba(200, 255, 255, 0.4)' },
                    [square]: { backgroundColor: 'rgba(200, 255, 255, 0.4)' }
                });
                setSelectedSquare(null);

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
                    backgroundImage: 'radial-gradient(circle at center, rgba(222, 184, 135, 0.9) 23%, transparent 21%)'
                };
            }
        }

        setSquareStyles(newSquareStyles);
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
                boardWidth={boardWidth}
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