import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react';
import { VotingContext } from '@/contexts';
import { Box, Text } from '@chakra-ui/react';

export function WinnerProposalId() {
    const { getOneProposal, winningProposalID } = useContext(VotingContext)
    const [proposal, setProposal] = useState({})

    const loadProposal = async () => {
        const p = await getOneProposal(Number(winningProposalID))
        setProposal(p)
        console.log('loadProposal', p)
    }

    useEffect(() => {
        if (!winningProposalID) return
        loadProposal()

    }, [winningProposalID])

    return (
        <Box>
            {winningProposalID && winningProposalID !== 0 && (
                <>
                    <Text fontSize="2xl">winningProposalID: ( {winningProposalID.toString()} )</Text>
                    {proposal && (
                        <>
                            <Text>Description: {proposal.description}</Text>
                            <Text>Total votes: {Number(proposal.voteCount).toString()}</Text>
                        </>
                    )}
                </>
            )}
        </Box>
    )
}