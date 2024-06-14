import React, { useState, useRef, useEffect } from 'react';
import CustomBoard from '../components/CustomBoard';
import Axios from 'axios';
import { Button } from '@chakra-ui/react';
import { Chess } from 'chess.js';

function Puzzles() {
    const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const [orientation, setOrientation] = useState('white');
    const [moves, setMoves] = useState([]);
    const [moveIndex, setMoveIndex] = useState(0);
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
            const moveList = response.data.moves.split(' ');
            setMoves(moveList);
            setMoveIndex(0);

            chess.current.load(newFen);
            setFen(newFen);

            const activePlayer = newFen.split(' ')[1];
            setOrientation(activePlayer === 'w' ? 'black' : 'white');

            // Make the first move in UCI format after a 1 second delay
            setTimeout(() => {
                chess.current.move(moveList[0]);

                const updatedFen = chess.current.fen();
                setFen(updatedFen);
                setMoveIndex(1);

                console.log(response.data);
            }, 1000);
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    const logMove = (sourceSquare, targetSquare) => {
        const userMove = sourceSquare + targetSquare;
        const expectedMove = moves[moveIndex];
        console.log(`User move: ${userMove}, Expected move: ${expectedMove}`);

        if (userMove === expectedMove) {
            console.log('Correct');
            setTimeout(() => {
                const nextMove = moves[moveIndex + 1];
                if (nextMove) {
                    chess.current.move(nextMove);
                    const updatedFen = chess.current.fen();
                    setFen(updatedFen);
                    setMoveIndex(moveIndex => moveIndex + 2);
                }
            }, 1000);
        } else {
            console.log('Incorrect');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', paddingBottom: '50px' }}>
            <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <CustomBoard
                    ref={customBoardRef}
                    fen={fen}
                    orientation={orientation}
                    setFen={setFen}
                    onMove={logMove}
                />
                <Button onClick={getNextPuzzle} marginTop="3" bg='teal.400' border="1px" display="flex" flexDirection="row" color="white" _hover={{ bg: "teal.700", color: "white" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-big-right-filled" width="35" height="35" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M12.089 3.634a2 2 0 0 0 -1.089 1.78l-.001 2.586h-6.999a2 2 0 0 0 -2 2v4l.005 .15a2 2 0 0 0 1.995 1.85l6.999 -.001l.001 2.587a2 2 0 0 0 3.414 1.414l6.586 -6.586a2 2 0 0 0 0 -2.828l-6.586 -6.586a2 2 0 0 0 -2.18 -.434l-.145 .068z" stroke-width="0" fill="currentColor" />
                    </svg>
                </Button>
            </div>
        </div>
    );
}

export default Puzzles;
