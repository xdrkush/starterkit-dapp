import { VotingContext } from '@/contexts';
import {
    Box, Text, Button, Card, CardBody, CardFooter, Heading, Stack
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link'

export const CardProposal = ({ proposalId }) => {
    const { getOneProposal } = useContext(VotingContext)
    const [proposal, setProposal] = useState({})

    const loadProposal = async () => {
        const p = await getOneProposal(Number(proposalId))
        setProposal(p)
    }

    useEffect(() => {
        if (!proposalId) return
        loadProposal()
    }, [proposalId])

    return (
        <Card
            my={4}
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'
        >
            {proposal && (
                <Stack>
                    <CardBody>
                        <Heading size='md'>Proposal n° {proposalId}</Heading>

                        <Text py='1'>
                            {proposal.description}
                        </Text>
                    </CardBody>

                    <CardFooter>
                        <Link href={`/proposal/${proposalId}`}>
                            <Button variant='solid' colorScheme='blue'>
                                En savoir plus sur la proposal n° {proposalId}
                            </Button>
                        </Link>
                    </CardFooter>
                </Stack>
            )}
        </Card>
    )
}

export function ListProposals() {
    const { proposalsRegistred } = useContext(VotingContext)

    return (
        <Box>

            {proposalsRegistred.length > 0 ? (
                <>
                    <Text fontSize="2xl">List Proposals ( {proposalsRegistred.length.toString()} )</Text>

                    {/* Because dev no emit first genesis proposal */}
                    {new Array({args:{proposalId: 0n}}, ...proposalsRegistred).map((log, i) => {
                        
                        console.log('log', log)
                        return (
                            <Box key={log.args.proposalId}>
                                <CardProposal
                                    proposalId={log.args.proposalId.toString()}
                                />
                            </Box>
                        )
                    })}

                </>
            ) : (
                <>
                    <Text>Il n'y a aucune proposal...</Text>
                </>
            )}
        </Box>
    )
}