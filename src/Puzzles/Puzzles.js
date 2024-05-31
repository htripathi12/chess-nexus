import React, { useRef, useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

function Puzzles() {
    const chess = useRef(new Chess());
    const [fen, setFen] = useState(chess.current.fen());
    const [squareStyles, setSquareStyles] = useState({});

    useEffect(() => {
        setFen(chess.current.fen());
    }, []);

    const onDrop = (sourceSquare, targetSquare) => {
        let move = chess.current.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q' // Automatically promote to queen
        });

        if (move === null) return; // Invalid move

        setSquareStyles({
            [sourceSquare]: { backgroundColor: 'rgba(200, 255, 255, 0.4)' },
            [targetSquare]: { backgroundColor: 'rgba(200, 255, 255, 0.4)' }
        });

        setFen(chess.current.fen());
    };

    const onSquareClick = (square) => {
        setSquareStyles({ [square]: { backgroundColor: 'rgba(200, 255, 255, 0.4)' } });
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ margin: 'auto' }}>
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
            </div>
        </div>
    );
}

export default Puzzles;