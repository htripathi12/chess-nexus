import React, { useState, useRef, useEffect } from 'react';
import CustomBoard from '../components/CustomBoard';
import Axios from 'axios';
import { Button } from '@chakra-ui/react';
import { Chess } from 'chess.js';

function Puzzles() {
    const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const [orientation, setOrientation] = useState('white');
    const customBoardRef = useRef(null);
    const chess = useRef(new Chess());

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const getNextPuzzle = async () => {
        try {
            const response = await Axios.get('http://localhost:3000/puzzles');
            const newFen = response.data.fen;
            const firstMove = response.data.moves.split(' ')[0];

            chess.current.load(newFen);

            // Set the new FEN and orientation
            setFen(newFen);
            const activePlayer = newFen.split(' ')[1];
            setOrientation(activePlayer === 'w' ? 'black' : 'white');

            // Make the first move in UCI format after a 1 second delay
            setTimeout(() => {
                chess.current.move(firstMove);

                const updatedFen = chess.current.fen();
                setFen(updatedFen);

                console.log(response.data);
            }, 1000);
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', paddingBottom: '50px' }}>
            <div style={{ margin: 'auto', display: 'flex', flexDirection: 'row' }}>
                <CustomBoard
                    ref={customBoardRef}
                    fen={fen}
                    orientation={orientation} // Pass the orientation prop
                    setFen={setFen}
                />
                <Button onClick={getNextPuzzle}>Next Puzzle</Button>
            </div>
        </div>
    );
}

export default Puzzles;
