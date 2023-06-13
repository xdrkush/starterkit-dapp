
import { VotingContext } from '@/contexts';
import {
    Box, Button, Input, FormControl, FormLabel, Text
} from '@chakra-ui/react';
import { useContext, useState } from 'react';

export function GetProposal() {
    const {getOneProposal} = useContext(VotingContext)
    const [id, setId] = useState("")

    return (
        <Box>
            <Text fontSize="2xl">GetProposal ( {id} )</Text>
            <FormControl>
                <FormLabel>Target address</FormLabel>
                <Input
                    focusBorderColor={id.length === 42 ? "green.500" : "red.500"}
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
            </FormControl>
            <Button onClick={() => getOneProposal(Number(id))}> Get Proposal </Button>
        </Box>
    )
}