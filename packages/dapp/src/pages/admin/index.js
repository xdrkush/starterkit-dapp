// page : /admin
import AdminLayout from '@/components/layouts/Admin.layout'
import React from 'react'
import { AddVoter } from '@/components/admin/AddVoter'
import { SwitchStatus } from '@/components/admin/SwitchStatus'
import { Grid, Heading } from '@chakra-ui/react'

export default function Admin() {
  return (
    <AdminLayout>
      <Heading>Admin</Heading>

      <Grid py={3} minH={"20vh"}>
        <AddVoter />
      </Grid>

      <Grid py={3} minH={"20vh"}>
        <SwitchStatus />
      </Grid>

    </AdminLayout>
  )
}
