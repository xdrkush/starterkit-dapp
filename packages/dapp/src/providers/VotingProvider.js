import React, { useMemo } from 'react';

import { useVoting } from '@/hooks/useVoting';
import { VotingContext } from '@/contexts';

export const VotingProvider = ({ children }) => {
    // Hook
    const {
        // State contract
        address, contract, owner, isOwner, isVoter,
        winningProposalID, workflowStatus,
        // Fn
        // admin
        addVoter, startProposalsRegistering, endProposalsRegistering,
        startVotingSession, endVotingSession, tallyVotes,
        // voter
        getVoter, getOneProposal, addProposal, setVote,
        // Event
        listVoters, proposalsRegistred, historyVotes
    } = useVoting()

    // Memory
    const values = useMemo(() => ({
        address, contract, owner, isOwner, isVoter,
        winningProposalID, workflowStatus,
        addVoter, startProposalsRegistering, endProposalsRegistering,
        startVotingSession, endVotingSession, tallyVotes,
        getVoter, getOneProposal, addProposal, setVote,
        listVoters, proposalsRegistred, historyVotes

    }), [
        address, contract, owner, isOwner, isVoter,
        winningProposalID, workflowStatus,
        addVoter, startProposalsRegistering, endProposalsRegistering,
        startVotingSession, endVotingSession, tallyVotes,
        getVoter, getOneProposal, addProposal, setVote,
        listVoters, proposalsRegistred, historyVotes

    ])

    // Contexts
    return <VotingContext.Provider value={values}>{children}</VotingContext.Provider>;
};
