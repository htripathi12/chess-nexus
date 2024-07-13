import React from 'react';
import StudyBlock from '../components/StudyBlock.js';
import { BrowserRouter as Router, Link as RouterLink } from 'react-router-dom';
import { Link, Button, Text } from '@chakra-ui/react';

import CaroKann from '../assets/Caro-Kann.png';
import ModernDefense from '../assets/ModernDefense.png';
import SicilianDefense from '../assets/SicilianDefense.png';


function Learn() {
    return (
        <div>
            <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
                <Button marginTop="3" bg='teal.400' border="1px" color="white" _hover={{ bg: "teal.700", color: "white" }} width="auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-big-left-filled" 
                        width="27" height="27" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" 
                        strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M9.586 4l-6.586 6.586a2 2 0 0 0 0 2.828l6.586 6.586a2 2 0 0 0 2.18 .434l .145 -.068a2 2 0 0 
                            0 1.089 -1.78v-2.586h7a2 2 0 0 0 2 -2v-4l-.005 -.15a2 2 0 0 0 -1.995 -1.85l-7 -.001v-2.585a2 2 0
                            0 0 -3.414 -1.414z" strokeWidth="0" fill="currentColor" />
                    </svg>
                    <Text ml={2}>Back</Text>
                </Button>
            </Link>
            <div style={{display: 'flex', flexDirection: 'row', marginTop: '30px', justifyContent: 'space-evenly'}}>            
                <StudyBlock to="/caro-kann" imageUrl={CaroKann} title="Caro-Kann Defense">
                    Dive into the intriguing world of the Caro-Kann Defense, where Black meets 1. e4 with the confident
                    stride of 1...c6. This defense boasts a robust structure that allows for swift piece development, all
                    while laying the groundwork for a resilient defense. With careful play, the Caro-Kann promises a
                    fortress-like defense fit for any strategic mastermind.
                </StudyBlock>
                
                <StudyBlock to="/modern-defense" imageUrl={ModernDefense} title="Modern Defense">
                    Explore the Modern Defense (1...g6), where Black delays central pawn advances for flexible piece 
                    deployment. The fianchettoed bishop on g7 pressures the long diagonal, creating asymmetry and 
                    counterattacking opportunities. Despite sacrificing immediate central control, the Modern Defense's 
                    strategic flexibility makes it a captivating choice for disrupting traditional chess paradigms.
                </StudyBlock>

                <StudyBlock to="/sicilian-defense" imageUrl={SicilianDefense} title="Sicilian Defense">
                    Discover the Sicilian Defense, where Black's counterattacking move 1...c5 targets White's central pawn 
                    structure. With its rich history and numerous variations, the Sicilian offers a wide range of strategic 
                    possibilities. Despite conceding the center early on, the Sicilian Defense rewards boldness and 
                    resourcefulness, leading to thrilling battles for the center.
                </StudyBlock>
            </div>
        </div>
    );
}
export default Learn;