import React, { useState, useRef, useEffect } from 'react';
import { Link, Button, Text } from '@chakra-ui/react';
import { BrowserRouter as Router, Link as RouterLink } from 'react-router-dom';
import CustomBoard from '../CustomBoard';

function Play() {
    const [fen, setFen] = useState('');
    const [winLoss, setWinLoss] = useState('');
    const customBoardRef = useRef(null);

    useEffect(() => {
        // Disable scrolling when the component is mounted
        document.body.style.overflow = 'hidden';
        return () => {
            // Enable scrolling when the component is unmounted
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div>
            <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
                <Button marginTop="3" bg='teal.400' border="1px" display="flex" flexDirection="row" color="white" _hover={{ bg: "teal.700", color: "white" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-big-left-filled" 
                        width="27" height="27" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" 
                        strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M9.586 4l-6.586 6.586a2 2 0 0 0 0 2.828l6.586 6.586a2 2 0 0 0 2.18 .434l.145 -.068a2 2 0 0 
                            0 1.089 -1.78v-2.586h7a2 2 0 0 0 2 -2v-4l-.005 -.15a2 2 0 0 0 -1.995 -1.85l-7 -.001v-2.585a2 2 0
                            0 0 -3.414 -1.414z" strokeWidth="0" fill="currentColor" />
                    </svg>
                    <Text ml={2}>Back</Text>
                </Button>
            </Link>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px'}}>
                <div>
                    <CustomBoard
                        ref={customBoardRef}
                        fen={fen}
                        setFen={setFen}
                        setWinLoss={setWinLoss}
                    />
                    <Button style={{ marginTop: '10px', alignSelf: 'flex-start' }} onClick={() => {
                        customBoardRef.current.undoMove();
                    }}>Previous Move</Button>
                </div>
            </div>
            {winLoss && <div>{winLoss}</div>}
        </div>
    );
}

export default Play;
