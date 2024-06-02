import React, { useState, useRef, useEffect } from 'react';
import CustomBoard from '../CustomBoard';

function Puzzles() {
    const [fen, setFen] = useState('');
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ margin: 'auto' }}>
                <CustomBoard
                    ref={customBoardRef}
                    fen={fen}
                    setFen={setFen}
                />
            </div>
        </div>
    );
}

export default Puzzles;
