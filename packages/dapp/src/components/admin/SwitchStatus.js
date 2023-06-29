
import { VotingContext } from '@/contexts';
import {
    Box, Button, Text
} from '@chakra-ui/react';
import { useContext } from 'react';
import { workflowStatusSTR } from "@/utils";

const ButtonStatus = () => {
    const {
        workflowStatus,
        startProposalsRegistering, endProposalsRegistering,
        startVotingSession, endVotingSession, tallyVotes
    } = useContext(VotingContext)

    switch (workflowStatus) {
        case 0:
            return <Button onClick={() => startProposalsRegistering()}> startProposalsRegistering </Button>;
        case 1:
            return <Button onClick={() => endProposalsRegistering()}> endProposalsRegistering </Button>;
        case 2:
            return <Button onClick={() => startVotingSession()}> startVotingSession </Button>;
        case 3:
            return <Button onClick={() => endVotingSession()}> endVotingSession </Button>;
        case 4:
            return <Button onClick={() => tallyVotes()}> tallyVotes </Button>;
        default:
            return <Text>Session fini !</Text>;
    }
}

export function SwitchStatus() {
    const { workflowStatus } = useContext(VotingContext)

    return (
        <Box>
            <Text fontSize={"2xl"}>SwitchStatus (Status: {`${workflowStatus} = ${workflowStatusSTR[String(workflowStatus)]}`})</Text>

            {workflowStatus >= 0 && (
                <ButtonStatus />
            )}
        </Box>
    )
}