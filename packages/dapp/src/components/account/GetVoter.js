import { VotingContext } from '@/contexts';
import {
    Box, Button, Input, FormControl, FormLabel, Text
} from '@chakra-ui/react';
import { useContext, useState } from 'react';

export function GetVoter() {
    const {getVoter} = useContext(VotingContext)
    const [addrVoter, setAddrVoter] = useState("")
    const [voter, setVoter] = useState({})

    const submit = async () => {
        const v = await getVoter(addrVoter)
        console.log('submit', v)
        setVoter(v)
    }

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
            <Button onClick={submit}> Get Voter </Button>

            {voter && (
                <>
                    <Text> {
                        "isRegistered: " + String(voter.isRegistered) + 
                        " - hasVoted: " + String(voter.hasVoted) + 
                        " - votedProposalId: " + String(voter.votedProposalId)}
                    </Text>
                </>
            )}
        </Box>
    )
}