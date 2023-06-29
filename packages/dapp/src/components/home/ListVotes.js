import { VotingContext } from '@/contexts';
import {
    Box, Text
} from '@chakra-ui/react';
import { useContext } from 'react';

export function ListVotes() {
    const { historyVotes } = useContext(VotingContext)

    console.log('historyVotes', historyVotes)

    return (
        <Box>

            {historyVotes.length > 0 && (
                <>
                    <Text fontSize="2xl">List Votes ( {historyVotes.length.toString()} )</Text>

                    {historyVotes.map((log, i) => (
                        <Text key={log.args.voter + "-" + i}> <b>{log.args.voter}</b> has voted on proposal n° <b>{log.args.proposalId.toString()}</b></Text>
                    ))}

                </>
            )}

        </Box>
    )
}