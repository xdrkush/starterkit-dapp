import { VotingContext } from '@/contexts';
import {
    Box, Button, Input, FormControl, FormLabel, Text
} from '@chakra-ui/react';
import { useContext, useState } from 'react';

export function AddVoter() {
    const {addVoter} = useContext(VotingContext)
    const [addressTo, setAddressTo] = useState("")

    return (
        <Box>
            <Text fontSize="2xl">AddVoter ( {addressTo} )</Text>
            <FormControl>
                <FormLabel>Target address</FormLabel>
                <Input
                    focusBorderColor={addressTo.length === 42 ? "green.500" : "red.500"}
                    value={addressTo}
                    onChange={(e) => setAddressTo(e.target.value)}
                />
            </FormControl>
            <Button onClick={() => addVoter(addressTo)}> Add Voter </Button>
        </Box>
    )
}