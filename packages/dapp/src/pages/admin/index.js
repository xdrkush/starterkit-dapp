// page : /admin
import AdminLayout from '@/components/layouts/Admin.layout'
import { useContext, useEffect } from 'react'
import { AddVoter } from '@/components/admin/AddVoter'
import { SwitchStatus } from '@/components/admin/SwitchStatus'
import { Grid, Heading, Spinner, Stack } from '@chakra-ui/react'
import { ListVoters } from '@/components/admin/ListVoters'
import { VotingContext } from '@/contexts'
import { useRouter } from 'next/router'

export default function Admin() {
  const { isOwner, workflowStatus } = useContext(VotingContext)
  const router = useRouter()

  useEffect(() => {
    if (!isOwner) router.push('/')
  }, [isOwner, router])

  return (
    <>
      {!isOwner ? (
        <Stack direction='row' minH={"100vh"} justify='center' align="center" spacing={4}>
          <Spinner size='xl' />
        </Stack>
      ) : (
        <AdminLayout>
          <Heading>Admin</Heading>

          {workflowStatus === 0 && (
            <Grid py={3} minH={"20vh"}>
              <AddVoter />
            </Grid>
          )}

          <Grid py={3} minH={"20vh"}>
            <SwitchStatus />
          </Grid>

          <Grid py={3} minH={"20vh"}>
            <ListVoters />
          </Grid>

        </AdminLayout>
      )}
    </>
  )
}
