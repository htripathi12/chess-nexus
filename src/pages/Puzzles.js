import React, { useState, useRef, useEffect } from 'react';
import CustomBoard from '../components/CustomBoard';
import Axios from 'axios';
import { Box, Center, Container, AbsoluteCenter, Flex, Link, Spacer, Button, Image, ChakraProvider, FormControl, FormLabel, 
    Input, Stack, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

function Puzzles() {
    const [fen, setFen] = useState('');
    const [moveSequence, setMoveSequence] = useState(''); // Add a new state for the move sequence
    const customBoardRef = useRef(null);

    useEffect(() => {
        // Disable scrolling when the component is mounted
        document.body.style.overflow = 'hidden';
        return () => {
            // Enable scrolling when the component is unmounted
            document.body.style.overflow = 'auto';
        };
    }, []);

    const getNextPuzzle = () => {
        Axios.get('http://localhost:3000/puzzles')
            .then((response) => {
                setFen(response.data.FEN); // Update the fen state
                setMoveSequence(response.data.moveSequence); // Update the move sequence state
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', paddingBottom: '50px' }}>
            <div style={{ margin: 'auto', display: 'flex', flexDirection: 'row'}}>
                <CustomBoard
                    ref={customBoardRef}
                    fen={fen}
                    setFen={setFen}
                />
                <Button onClick={getNextPuzzle}>Next Puzzle</Button>
            </div>
        </div>
    );
}

export default Puzzles;
