import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Chessboard } from 'react-chessboard';


function getSquareColor(square) {
    const letter = square.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    const number = parseInt(square[1], 10);
    return (letter + number) % 2 === 0 ? 'light' : 'dark';
}

const CustomBoard = forwardRef(({ fen, orientation, setFen, setWinLoss, onMove, chessInstance }, ref) => {
    const [squareStyles, setSquareStyles] = useState({});
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [animationDuration, setAnimationDuration] = useState(250);

    useEffect(() => {
        if (fen && fen !== chessInstance.fen()) {
            chessInstance.load(fen);
            setSquareStyles({});
            setSelectedSquare(null);

            if (chessInstance.isCheck()) {
                highlightKingInCheck();
            }
        }
    }, [fen, chessInstance]);

    const onDrop = (sourceSquare, targetSquare) => {
        const previousFen = chessInstance.fen();

        try {
            let move = chessInstance.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q'
            });

            if (move === null) {
                chessInstance.load(previousFen);
                return false;
            }

            if (onMove) {
                onMove(sourceSquare, targetSquare);
            }

            setSquareStyles({
                [sourceSquare]: { backgroundColor: 'rgba(200, 255, 255, 0.4)' },
                [targetSquare]: { backgroundColor: 'rgba(200, 255, 255, 0.4)' }
            });

            if (chessInstance.isCheck()) {
                highlightKingInCheck();
            }

            setFen(chessInstance.fen());

            if (chessInstance.isGameOver()) {
                handleGameOver();
            }
            return true;
        } catch (error) {
            chessInstance.load(previousFen);
            return false;
        }
    };

    const onSquareClick = (square) => {
        setAnimationDuration(250);
        if (selectedSquare) {
            const legalMove = chessInstance
                .moves({ square: selectedSquare, verbose: true })
                .some(move => move.to === square);

            if (legalMove) {
                chessInstance.move({ from: selectedSquare, to: square, promotion: 'q' });

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

    const highlightLegalMoves = (square) => {
        const moves = chessInstance.moves({ square, verbose: true });
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

        if (chessInstance.isCheck()) {
            highlightKingInCheck(newSquareStyles);
        }

        setSquareStyles(newSquareStyles);
    };

    const highlightKingInCheck = (styles = {}) => {
        const kingPosition = chessInstance.board().flat().find(piece => piece && piece.type === 'k' && piece.color === chessInstance.turn());
        if (kingPosition) {
            styles[kingPosition.square] = {
                backgroundImage: 'radial-gradient(circle at center, rgba(255, 0, 0, 1) 25%, rgba(255, 0, 0, 0) 80%)'
            };
        }
        setSquareStyles(styles);
    };

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
                animationDuration={animationDuration}
                onPieceDragEnd={() => setAnimationDuration(0)}
            />
        </div>
    );
});

export default CustomBoard;
