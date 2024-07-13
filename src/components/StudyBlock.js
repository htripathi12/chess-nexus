import React from "react";
import {Link as RouterLink} from 'react-router-dom';
import { Stack, Text, CardBody, Image, Heading, Card } from '@chakra-ui/react';


function StudyBlock(props) {
    return (
        <RouterLink to={props.to}>
        <Card maxW='xs' backgroundColor='teal.700' boxShadow='xl'
            _hover={{ transform: 'scale(1.03)', boxShadow: '0 0 .75rem #1a202c' }}
            transition='transform 0.2s, boxShadow 0.2s'
        >
            <CardBody textColor="whitesmoke">
                <Image
                    src={props.imageUrl}
                    borderRadius='lg'
                />
                <Stack mt='6' spacing='3'>
                    <Heading size='sm'>{props.title}</Heading>
                    <Text fontSize='sm'>
                        {props.children}
                    </Text>
                </Stack>
            </CardBody>
        </Card>
        </RouterLink>
    );
}

export default StudyBlock;