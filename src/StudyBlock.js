import React from "react";
import {Link as RouterLink} from 'react-router-dom';
import { Box, Center, Container, AbsoluteCenter, Flex, Link, Spacer, Button, ChakraProvider, FormControl, FormLabel, 
    Input, Stack, Text, Tabs, Table, Tbody, Td, Tr, Th, Thead, TabList, TabPanels, Tab, TabPanel, CardBody, Image, 
    Heading, Card, Divider, CardFooter, ButtonGroup } from '@chakra-ui/react';


function StudyBlock(props) {
    return (
        <RouterLink to={props.to}>
        <Card maxW='sm' backgroundColor='teal.700' boxShadow='xl'>
            <CardBody textColor="lightgrey">
                <Image
                    src={props.imageUrl}
                    borderRadius='lg'
                />
                <Stack mt='6' spacing='3'>
                    <Heading size='md'>{props.title}</Heading>
                    <Text fontSize={15}>
                        {props.children}
                    </Text>
                </Stack>
            </CardBody>
        </Card>
        </RouterLink>
    );
}

export default StudyBlock;