import React, { useMemo } from 'react';

import { useVoting } from '@/hooks/useVoting';
import { VotingContext } from '@/contexts';

export const VotingProvider = ({ children }) => {
    // Hook
    const {
        address, contract, owner, isOwner, isVoter
    } = useVoting()

    // Memory
    const values = useMemo(() => ({
        address, contract, owner,
        isOwner, isVoter
    }), [address, contract, owner, isOwner, isVoter])

    // Contexts
    return <VotingContext.Provider value={{...values}}>{children}</VotingContext.Provider>;
};
