
import { VotingContext } from '@/contexts';
import {
    Box, Input, FormControl, FormLabel, Text
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { CardProposal } from "@/components/proposal/ListProposals"

export function GetProposal() {
    const { getOneProposal, proposalsRegistred } = useContext(VotingContext)
    const [id, setId] = useState("")
    const [proposal, setProposal] = useState({})

    const submit = async () => {
        const p = await getOneProposal(Number(id))
        setProposal(p)
    }

    useEffect(() => {
        if (id.length < 0) return
        submit()
    }, [id])

    return (
        <Box>
            <Text fontSize="2xl">GetProposal ( {id} )</Text>
            <FormControl>
                <FormLabel>Target Proposal (uint) - Total ({proposalsRegistred.length})</FormLabel>
                <Input
                    type='number'
                    focusBorderColor={id.length === 42 ? "green.500" : "red.500"}
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
            </FormControl>

            {proposal && id.length > 0 && Number(id) <= proposalsRegistred.length && (
                <CardProposal proposalId={id} />
            )}
        </Box>
    )
}