import { VotingContext } from '@/contexts';
import {
    Box, Text
} from '@chakra-ui/react';
import { useContext } from 'react';
import Link from 'next/link'

export function ListProposals() {
    const { proposalsRegistred } = useContext(VotingContext)

    console.log('proposalsRegistred', proposalsRegistred)

    return (
        <Box>
            <Text fontSize="2xl">List Proposals ( {proposalsRegistred.length.toString()} )</Text>

            {proposalsRegistred.length > 0 && proposalsRegistred.map((log, i) => (
                <Text key={log.args.proposalId}>
                    <Link href={`/proposal/${log.args.proposalId.toString()}`}>Proposal n° {log.args.proposalId.toString()}</Link>
                </Text>
            ))}

        </Box>
    )
}