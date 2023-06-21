import { VotingContext } from '@/contexts';
import {
    Box, Text
} from '@chakra-ui/react';
import { useContext } from 'react';

export function ListVoters() {
    const { listVoters } = useContext(VotingContext)

    return (
        <Box>
            <Text fontSize="2xl">List Voter ( {listVoters.length.toString()} )</Text>

            {listVoters.length > 0 && listVoters.map((log, i) => {
                return (
                    <Text key={"voter-" + log.args.voterAddress}>Voter: {log.args.voterAddress}</Text>
                )
            })}

        </Box>
    )
}
