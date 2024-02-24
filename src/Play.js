import React, { useRef, useState, useEffect } from 'react';

import Chessboard from 'chessboardjsx';
import { Chess } from 'chess.js';

function Play() {
    const chess = useRef(new Chess());
    const [fen, setFen] = useState('start');
    const [squareStyles, setSquareStyles] = useState({});    


   useEffect(() => {
        setFen(chess.current.fen());
    }, [chess]);

    const onDrop = ({ sourceSquare, targetSquare }) => {
        // Log FEN in variable
        const fen = chess.current.fen();
        try {
            // Try to make the move
            let move = chess.current.move({ from: sourceSquare, to: targetSquare });

            setSquareStyles({
                [sourceSquare]: { backgroundColor: 'rgba(200, 255, 255, 0.4)' }, 
                [targetSquare]: { backgroundColor: 'rgba(200, 255, 255, 0.4)' } 
            });

            setFen(chess.current.fen());
        } catch (error) {
            // The move was illegal
            chess.current.fen(fen);
        }
    };

    return (
        <div id="board1" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <Chessboard 
                position={fen}
                onDrop={onDrop}
                draggable={true}
                squareStyles={squareStyles}
                darkSquareStyle={{ backgroundColor: '#008080' }} 
                lightSquareStyle={{ backgroundColor: '#20B2AA' }} 
                boardStyle={{
                    border: '2px solid #008080', 
                    borderRadius: '5px',
                    boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
                }}
            />
        </div>

    );
}

export default Play;