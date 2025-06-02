import React, { useState, useEffect, forwardRef, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';

function getSquareColor(square) {
    const letter = square.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    const number = parseInt(square[1], 10);
    return (letter + number) % 2 === 0 ? 'light' : 'dark';
}

function mergeStyles(base = {}, extra = {}) {
  return { ...base, ...extra };
}

const CHECK_STYLE = { 
  backgroundImage: 'radial-gradient(circle, rgba(255, 0, 0, 0.84) 30%, rgba(255, 0, 0, 0.4) 65%, transparent 100%)'
};

function getCheckHighlight(chess) {
  if (!chess.inCheck()) return {};

  const turn = chess.turn();
  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.type === 'k' && piece.color === turn) {
        const file = String.fromCharCode(97 + c);
        const rank = 8 - r;
        return { [`${file}${rank}`]: CHECK_STYLE };
      }
    }
  }
  return {};
}


const CustomBoard = forwardRef(({ fen, orientation, setFen, onUserMove, chessInstance, disableBoard, customArrows, boardWidth }, ref) => {
    const [squareStyles, setSquareStyles] = useState({});
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [animationDuration, setAnimationDuration] = useState(250);

    const updateStyles = useCallback((base) => {
      const merged = mergeStyles(base, getCheckHighlight(chessInstance));
      setSquareStyles(merged);
    }, [chessInstance]);
    
    useEffect(() => {
        if (fen && fen !== chessInstance.fen()) {
            chessInstance.load(fen);
            setSelectedSquare(null);
            setTimeout(() => {
                updateStyles({});
            }, 0);
        }
    }, [fen, chessInstance, updateStyles]);
    
    useEffect(() => {
      updateStyles({});
    }, [fen, updateStyles]);

    const onDrop = (sourceSquare, targetSquare) => {
        if (disableBoard) return false;

        const prevFEN = chessInstance.fen();
        const move = chessInstance.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q',
        });

        if (!move) {
        chessInstance.load(prevFEN);
        return false;
        }

        onUserMove?.(move);
        setFen(chessInstance.fen());

        const moveHighlight = {
            [sourceSquare]: { backgroundColor: 'rgba(200,255,255,0.4)' },
            [targetSquare]: { backgroundColor: 'rgba(200,255,255,0.4)' },
        };
        updateStyles(moveHighlight);
        return true;
    };

    const onSquareClick = (square) => {
        if (disableBoard) return;

        setAnimationDuration(250); // Enable animation for click moves
        if (selectedSquare) {
        const legal = chessInstance
            .moves({ square: selectedSquare, verbose: true })
            .find((m) => m.to === square);

        if (legal) {
            const move = chessInstance.move({
            from: selectedSquare,
            to: square,
            promotion: 'q',
            });
            onUserMove?.(move);
            setFen(chessInstance.fen());

            const moveHighlight = {
            [selectedSquare]: { backgroundColor: 'rgba(200,255,255,0.4)' },
            [square]: { backgroundColor: 'rgba(200,255,255,0.4)' },
            };
            setSelectedSquare(null);
            updateStyles(moveHighlight);
            return;
        }
        }

        setSelectedSquare(square);
        highlightLegalMoves(square);
    };

    const highlightLegalMoves = (fromSquare) => {
        const moves = chessInstance.moves({ square: fromSquare, verbose: true });
        const dots = {};

        for (const m of moves) {
        if (m.flags.includes('c')) {
            const color =
            getSquareColor(m.to) === 'light'
                ? 'rgba(0,128,128,0.85)'
                : 'rgba(32,178,170,0.85)';
            dots[m.to] = {
            backgroundColor: 'rgba(222,184,135,1)',
            backgroundImage: `radial-gradient(ellipse at center, ${color} 55%, transparent 100%)`,
            };
        } else {
            dots[m.to] = {
            backgroundImage:
                'radial-gradient(circle at center, rgba(222,184,135,0.9) 23%, transparent 21%)',
            };
        }
        }

        updateStyles(dots);
    };

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