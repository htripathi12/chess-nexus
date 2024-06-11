import React, { useState, useRef, useEffect } from 'react';
import CustomBoard from '../components/CustomBoard';
import Axios from 'axios';
import { Button } from '@chakra-ui/react';

function Puzzles() {
    const [fen, setFen] = useState('');
    const [winLoss, setWinLoss] = useState('');
    const customBoardRef = useRef(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    useEffect(() => {
        console.log('FEN updated:', fen);
    }, [fen]);

    const getNextPuzzle = async () => {
        try {
            const response = await Axios.get('http://localhost:3000/puzzles');
            setFen(response.data.fen);
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
                    setFen={setFen}
                    setWinLoss={setWinLoss}
                />
                <Button onClick={getNextPuzzle}>Next Puzzle</Button>
            </div>
        </div>
    );
}

export default Puzzles;
