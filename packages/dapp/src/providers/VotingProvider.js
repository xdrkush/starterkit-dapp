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
        listVoters
    } = useVoting()

    // Memory
    const values = useMemo(() => ({
        address, contract, owner, isOwner, isVoter,
        winningProposalID, workflowStatus,
        addVoter, startProposalsRegistering, endProposalsRegistering,
        startVotingSession, endVotingSession, tallyVotes,
        getVoter, getOneProposal, addProposal, setVote,
        listVoters

    }), [
        address, contract, owner, isOwner, isVoter,
        winningProposalID, workflowStatus,
        addVoter, startProposalsRegistering, endProposalsRegistering,
        startVotingSession, endVotingSession, tallyVotes,
        getVoter, getOneProposal, addProposal, setVote,
        listVoters

    ])

    // Contexts
    return <VotingContext.Provider value={values}>{children}</VotingContext.Provider>;
};
