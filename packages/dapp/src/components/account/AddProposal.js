
import { VotingContext } from '@/contexts';
import {
    Box, Button, Input, FormControl, FormLabel, Text
} from '@chakra-ui/react';
import { useContext, useState } from 'react';

export function AddProposal() {
    const {addProposal} = useContext(VotingContext)
    const [description, setDescription] = useState("")

    return (
        <Box>
            <Text fontSize="2xl">CreateProposal ( {description} )</Text>
            <FormControl>
                <FormLabel>Target address</FormLabel>
                <Input
                    focusBorderColor={description.length === 42 ? "green.500" : "red.500"}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </FormControl>
            <Button onClick={() => addProposal(description)}> Create Proposal </Button>
        </Box>
    )
}