import { VotingContext } from '@/contexts';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
    Box, Input, FormControl, FormLabel, Text, Card, Stack, CardBody, Heading, CardFooter
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { CardProposal } from '../proposal/ListProposals';
import { isAddress } from 'viem';

const CardVoter = ({ addrVoter }) => {
    const { getVoter } = useContext(VotingContext)
    const [voter, setVoter] = useState({})

    const loadVoter = async () => {
        const v = await getVoter(String(addrVoter))
        setVoter(v)
    }

    useEffect(() => {
        if (!addrVoter) return
        loadVoter()
    }, [addrVoter])

    return (
        <>
            {voter && (
                <Card
                    my={4}
                    direction={{ base: 'column', sm: 'row' }}
                    overflow='hidden'
                    variant='outline'
                >
                    <Stack>
                        <CardBody>
                            <Heading size='md'>{addrVoter}</Heading>

                            <Text py='1'>
                                hasVoted: {!voter.hasVoted ? (
                                    <CloseIcon color='red' />
                                ) : (
                                    <CheckIcon color='green' />
                                )}
                            </Text>
                            <Text py='1'>
                                isRegistered: {!voter.isRegistered ? (
                                    <CloseIcon color='red' />
                                ) : (
                                    <CheckIcon color='green' />
                                )}
                            </Text>
                        </CardBody>
                        {voter.votedProposalId >= 1 && (
                            <CardFooter>
                                <CardProposal
                                    proposalId={voter.votedProposalId.toString()}
                                />
                            </CardFooter>
                        )}
                    </Stack>
                </Card>
            )}
        </>
    )
}

export function GetVoter() {
    const [addrVoter, setAddrVoter] = useState("")
    const [addrIsOk, setAddrIsOk] = useState(null)

    useEffect(() => {
        // Mettre regex
        if (isAddress(addrVoter)) {
            setAddrIsOk(true)
        }
    }, [addrVoter])
    
    return (
        <Box>

            <Box>
                <Text fontSize="2xl">GetVoter ( {addrVoter} )</Text>
                <FormControl>
                    <FormLabel>Target Voter (address)</FormLabel>
                    <Input
                        focusBorderColor={addrVoter.length === 42 ? "green.500" : "red.500"}
                        value={addrVoter ? addrVoter : ""}
                        onChange={(e) => setAddrVoter(e.target.value)}
                    />
                </FormControl>
            </Box>

            {addrIsOk && (
                <CardVoter addrVoter={addrVoter} />
            )}
        </Box>
    )
}