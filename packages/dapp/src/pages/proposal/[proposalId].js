import { useRouter } from 'next/router'
import AccountLayout from "@/components/layouts/Account.layout";
import { useContext, useEffect, useState } from 'react';
import { VotingContext } from '@/contexts';
import { Grid } from '@chakra-ui/react';
import HeaderProposal from '@/components/proposal/HeaderProposal';

export default function ProposalId() {
    const { getOneProposal, isVoter } = useContext(VotingContext)
    const router = useRouter()
    const { proposalId } = router.query
    const [proposal, setProposal] = useState({})

    useEffect(() => {
        if (!isVoter) router.push('/')
    }, [isVoter])

    const loadProposal = async () => {
        const p = await getOneProposal(Number(proposalId))
        setProposal(p)
    }

    useEffect(() => {
        if (!proposalId) return
        loadProposal()
    }, [proposalId, loadProposal])

    return (
        <>
            {proposalId && proposal && isVoter && (
                <AccountLayout>
                    <Grid py={3} minH={"20vh"}>
                        <HeaderProposal
                            proposalId={proposalId}
                            description={proposal.description}
                            totalVotes={Number(proposal.voteCount).toString()}
                        />
                    </Grid>
                </AccountLayout>
            )}
        </>
    )
}