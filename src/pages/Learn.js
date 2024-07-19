import React from 'react';
import StudyBlock from '../components/StudyBlock.js';
import BackButton from '../components/BackButton.js';
import { BrowserRouter as Router, Link as RouterLink } from 'react-router-dom';
import { Link, Button, Text } from '@chakra-ui/react';


function Learn() {
    return (
        <div>
            <BackButton />
            <div style={{display: 'flex', flexDirection: 'row', marginTop: '30px', justifyContent: 'space-evenly'}}>            
                <StudyBlock to="/caro-kann" imageUrl="/assets/Caro-Kann.png" title="Caro-Kann Defense">
                    Dive into the intriguing world of the Caro-Kann Defense, where Black meets 1. e4 with the confident
                    stride of 1...c6. This defense boasts a robust structure that allows for swift piece development, all
                    while laying the groundwork for a resilient defense. With careful play, the Caro-Kann promises a
                    fortress-like defense fit for any strategic mastermind.
                </StudyBlock>
                
                <StudyBlock to="/modern-defense" imageUrl="/assets/ModernDefense.png" title="Modern Defense">
                    Explore the Modern Defense (1...g6), where Black delays central pawn advances for flexible piece 
                    deployment. The fianchettoed bishop on g7 pressures the long diagonal, creating asymmetry and 
                    counterattacking opportunities. Despite sacrificing immediate central control, the Modern Defense's 
                    strategic flexibility makes it a captivating choice for disrupting traditional chess paradigms.
                </StudyBlock>

                <StudyBlock to="/sicilian-defense" imageUrl="/assets/SicilianDefense.png" title="Sicilian Defense">
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