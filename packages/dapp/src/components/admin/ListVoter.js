
import { VotingContext } from '@/contexts';
import {
    Box, Text
} from '@chakra-ui/react';
import { useContext, useState } from 'react';

export function ListVoter() {
    const {listVoters} = useContext(VotingContext)

    return (
        <Box>
            <Text fontSize="2xl">List Voter (  )</Text>
        </Box>
    )
}