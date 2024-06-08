import React, { useState, useRef, useEffect } from 'react';
import CustomBoard from '../components/CustomBoard';
import Axios from 'axios';
import { Box, Center, Container, AbsoluteCenter, Flex, Link, Spacer, Button, Image, ChakraProvider, FormControl, FormLabel, 
    Input, Stack, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

function Puzzles() {
    const [fen, setFen] = useState('');
    const [winLoss, setWinLoss] = useState('');
    const [history, setHistory] = useState([]);
    const customBoardRef = useRef(null);

    
    useEffect(() => {
        // Disable scrolling when the component is mounted
        document.body.style.overflow = 'hidden';
        return () => {
            // Enable scrolling when the component is unmounted
            document.body.style.overflow = 'auto';
        };
    }, []);

    const getNextPuzzle = async (retryCount = 3) => {
        try {
            const response = await Axios.get('http://localhost:3000/puzzles');
            console.log(response);
        } catch (error) {
            console.error('There was an error!', error);
            if (retryCount > 0) {
                console.log(`Retrying... (${retryCount} attempts left)`);
                setTimeout(() => getNextPuzzle(retryCount - 1), 2000); // retry after 2 seconds
            }
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', paddingBottom: '50px' }}>
            <div style={{ margin: 'auto', display: 'flex', flexDirection: 'row'}}>
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
