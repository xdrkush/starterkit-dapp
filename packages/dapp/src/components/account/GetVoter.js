import { VotingContext } from '@/contexts';
import {
    Box, Button, Input, FormControl, FormLabel, Text
} from '@chakra-ui/react';
import { useContext, useState } from 'react';

export function GetVoter() {
    const { getVoter } = useContext(VotingContext)
    const [addrVoter, setAddrVoter] = useState("")
    const [voter, setVoter] = useState({})

    const submit = async () => {
        const v = await getVoter(addrVoter)
        setVoter(v)
    }

    return (
        <Box>
            
            <Box>
                <Text fontSize="2xl">GetVoter ( {addrVoter} )</Text>
                <FormControl>
                    <FormLabel>Target Voter (address)</FormLabel>
                    <Input
                        focusBorderColor={addrVoter.length === 42 ? "green.500" : "red.500"}
                        value={addrVoter ? addrVoter : ""}
                        onChange={(e) => setAddrVoter(e.target.value)}
                    />
                </FormControl>
                <Button onClick={submit}> Get Voter </Button>
            </Box>

            {voter && voter.isRegistered !== undefined && (
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