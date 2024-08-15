import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Text, Link } from '@chakra-ui/react';

function BackButton() {
    return (
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
    );
}

export default BackButton;