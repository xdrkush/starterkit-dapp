
import { VotingContext } from '@/contexts';
import {
    Box, Button, Input, FormControl, FormLabel, Text
} from '@chakra-ui/react';
import { useContext, useState } from 'react';

export function GetProposal() {
    const {getOneProposal} = useContext(VotingContext)
    const [id, setId] = useState("")
    const [proposal, setProposal] = useState({})

    const submit = async () => {
        const p = await getOneProposal(Number(id))
        setProposal(p)
    }

    return (
        <Box>
            <Text fontSize="2xl">GetProposal ( {id} )</Text>
            <FormControl>
                <FormLabel>Target Proposal (uint)</FormLabel>
                <Input
                    focusBorderColor={id.length === 42 ? "green.500" : "red.500"}
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
            </FormControl>
            <Button onClick={submit}> Get Proposal </Button>

            {proposal && proposal.description && (
                <Box display="flex">
                    <Text> {
                        "Description: " + String(proposal.description) +
                        " - VoteCount: " + String(proposal.voteCount)}
                    </Text>
                </Box>
            )}
        </Box>
    )
}