// page : /contact
import AccountLayout from '@/components/layouts/Account.layout'
import { Grid, Heading, Spinner, Stack } from '@chakra-ui/react'
import React, { useContext, useEffect } from 'react'

import { AddProposal } from "@/components/account/AddProposal"
import { GetProposal } from "@/components/account/GetProposal"
import { GetVoter } from "@/components/account/GetVoter"
import { VotingContext } from '@/contexts'
import { useRouter } from 'next/router'

export default function Account() {
  const { workflowStatus, isVoter } = useContext(VotingContext)
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
          <Heading>Account</Heading>

          {workflowStatus === 1 && (
            <Grid py={3} minH={"20vh"}>
              <AddProposal />
            </Grid>
          )}

          {workflowStatus >= 1 && (
            <Grid py={3} minH={"20vh"}>
              <GetProposal />
            </Grid>
          )}

          <Grid py={3} minH={"20vh"}>
            <GetVoter />
          </Grid>

        </AccountLayout>
      )}
    </>
  )
}
