import { ListProposals } from "@/components/proposal/ListProposals";
import AccountLayout from "@/components/layouts/Account.layout";
import { Grid, Heading } from '@chakra-ui/react'

export default function Proposals() {
    return (
        <AccountLayout>
            <Heading>Proposals</Heading>

            <Grid py={3} minH={"20vh"}>
                <ListProposals />
            </Grid>

        </AccountLayout>
    )
}