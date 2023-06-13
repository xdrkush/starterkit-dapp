// page : /contact
import AccountLayout from '@/components/layouts/Account.layout'
import { Grid, Heading } from '@chakra-ui/react'
import React from 'react'

import { AddProposal } from "@/components/account/AddProposal"
import { GetProposal } from "@/components/account/GetProposal"
import { GetVoter } from "@/components/account/GetVoter"
import { SetVote } from "@/components/account/SetVote"

export default function Account() {
  return (
    <AccountLayout>
      <Heading>Account</Heading>

      <Grid py={3} minH={"20vh"}>
        <AddProposal />
      </Grid>

      <Grid py={3} minH={"20vh"}>
        <GetProposal />
      </Grid>

      <Grid py={3} minH={"20vh"}>
        <GetVoter />
      </Grid>

      <Grid py={3} minH={"20vh"}>
        <SetVote />
      </Grid>

    </AccountLayout>
  )
}
