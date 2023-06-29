import { useContext, useEffect, useState } from 'react';
import { VotingContext } from '@/contexts';
import { Box, Text } from '@chakra-ui/react';
import { CardProposal } from '../proposal/ListProposals';

export function WinnerProposalId() {
    const { getOneProposal, winningProposalID, workflowStatus } = useContext(VotingContext)
    const [proposal, setProposal] = useState({})

    const loadProposal = async () => {
        const p = await getOneProposal(Number(winningProposalID))
        setProposal(p)
        console.log('loadProposal', p)
    }

    useEffect(() => {
        if (!Number(winningProposalID)) return
        loadProposal()

    }, [winningProposalID])

    return (
        <Box>
            {workflowStatus === 5 && (
                <>
                    <Text fontSize="2xl">winningProposalID: ( {Number(winningProposalID).toString()} )</Text>
                    {proposal && (
                        <CardProposal
                            proposalId={Number(winningProposalID).toString()}
                        />
                    )}
                </>
            )}
        </Box>
    )
}