import { ListProposals } from "@/components/proposal/ListProposals";
import AccountLayout from "@/components/layouts/Account.layout";
import { Grid, Heading, Stack, Spinner } from '@chakra-ui/react'
import { useContext, useEffect } from "react";
import { VotingContext } from "@/contexts";
import { useRouter } from "next/router";

export default function Proposals() {
    const { isVoter } = useContext(VotingContext)
    const router = useRouter()

    useEffect(() => {
        if (!isVoter) router.push('/')
    }, [isVoter])

    return (
        <>
            {!isVoter ? (
                <Stack direction='row' minH={"100vh"} justify='center' align="center" spacing={4}>
                    <Spinner size='xl' />
                </Stack>
            ) : (
                <AccountLayout>
                    <Heading>Proposals</Heading >

                    <Grid py={3} minH={"20vh"}>
                        <ListProposals />
                    </Grid>
                </AccountLayout>
            )
            }
        </>
    )
}