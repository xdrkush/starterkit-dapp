import { VotingContext } from '@/contexts';
import {
    Box, Button, Input, FormControl, FormLabel, Text
} from '@chakra-ui/react';
import { useContext, useState } from 'react';

export function GetVoter() {
    const {getVoter} = useContext(VotingContext)
    const [addrVoter, setAddrVoter] = useState("")

    return (
        <Box>
            <Text fontSize="2xl">GetVoter ( {addrVoter} )</Text>
            <FormControl>
                <FormLabel>Target address</FormLabel>
                <Input
                    addrVoter={addrVoter.length === 42 ? "green.500" : "red.500"}
                    value={addrVoter}
                    onChange={(e) => setAddrVoter(e.target.value)}
                />
            </FormControl>
            <Button onClick={() => getVoter(addrVoter)}> Get Voter </Button>
        </Box>
    )
}