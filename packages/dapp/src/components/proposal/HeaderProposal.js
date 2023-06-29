import { Button, Card, CardBody, CardFooter, CardHeader, Heading, Text } from '@chakra-ui/react'
import { useContext } from 'react'
import { VotingContext } from '@/contexts'

export default function HeaderProposal({ proposalId, description, totalVotes }) {
    const { setVote, workflowStatus } = useContext(VotingContext)
    return (
        <Card align='center'>
            <CardHeader>
                <Heading size='md'> Proposal: {proposalId.toString()} total: {totalVotes}</Heading>
            </CardHeader>
            <CardBody>
                <Text> {description} </Text>
            </CardBody>
            {workflowStatus === 3 && (
                <CardFooter>
                    <Button colorScheme='blue' onClick={() => setVote(proposalId)}>Vote for {proposalId.toString()} </Button>
                </CardFooter>
            )}
        </Card>
    )
}
