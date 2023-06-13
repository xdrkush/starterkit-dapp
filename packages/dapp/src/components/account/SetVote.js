
import { VotingContext } from '@/contexts';
import {
    Box, Button, Input, FormControl, FormLabel, Text
} from '@chakra-ui/react';
import { useContext, useState } from 'react';

export function SetVote() {
    const {setVote} = useContext(VotingContext)
    const [id, setId] = useState("")

    return (
        <Box>
            <Text fontSize="2xl">SetVote ( {id} )</Text>
            <FormControl>
                <FormLabel>Target address</FormLabel>
                <Input
                    focusBorderColor={id.length > 0 ? "green.500" : "red.500"}
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
            </FormControl>
            <Button onClick={() => setVote(id)}> Add Voter </Button>
        </Box>
    )
}