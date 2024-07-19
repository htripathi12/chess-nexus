import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Text, Link } from '@chakra-ui/react';
import BackButton from '../components/BackButton';


function Signup() {
    return (
        <div>
            <BackButton />
            <h1>Signup</h1>
        </div>
    );
}

export default Signup;