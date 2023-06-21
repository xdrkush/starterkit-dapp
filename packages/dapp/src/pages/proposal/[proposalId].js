import { useRouter } from 'next/router'
import AccountLayout from "@/components/layouts/Account.layout";
import { useContext, useEffect, useState } from 'react';
import { VotingContext } from '@/contexts';
import { Heading, Text, Button } from '@chakra-ui/react';

export default function ProposalId() {
    const { getOneProposal, setVote } = useContext(VotingContext)
    const router = useRouter()
    const { proposalId } = router.query
    const [proposal, setProposal] = useState({})

    const loadProposal = async () => {
        const p = await getOneProposal(Number(proposalId))
        setProposal(p)
        console.log('loadProposal', p)
    }

    useEffect(() => {
        if (!proposalId) return
        loadProposal()

    }, [proposalId])

    return (
        <AccountLayout>
            <Heading>Proposal Id ({proposalId})</Heading>
            {proposal && (
                <>
                    <Text>Description: {proposal.description}</Text>
                    <Text>Total votes: {Number(proposal.voteCount).toString()}</Text>
                    <Button onClick={() => setVote(proposalId)}> Vote for {proposalId} </Button>

                </>
            )}
        </AccountLayout>
    )
}