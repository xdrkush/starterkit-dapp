// page : /
import MainLayout from "@/components/layout";
import { useToken } from "@/hooks/useToken"
import { useLib } from "@/hooks/useLib"
import { useState } from "react";

import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
} from '@chakra-ui/react';

export default function Home() {
  // Call hook
  const { addressToken, totalSupply, name, sendTx } = useToken();
  const { addressLib, ownerLib } = useLib();

  // State
  const [addressTo, setAddressTo] = useState()
  const [amount, setAmount] = useState()

  return (
    <MainLayout>

      <Heading>Welcome, </Heading>

      <Box>
        <p>addr lib: {addressLib} </p>
        <p>owner lib: {ownerLib} </p>
        <p>addr token: {addressToken} </p>
        <p>name token: {name} </p>
        <p>supply token: {totalSupply} </p>
      </Box>

      <Box
        rounded={'lg'}
        boxShadow={'lg'}
        p={8}>
        <Stack spacing={4}>
          <FormControl id="email">
            <FormLabel>Address ethereum To / Destinataire</FormLabel>
            <Input type="email" onChange={(e) => setAddressTo(e.target.value)} />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Amount / Montant</FormLabel>
            <Input type="number" onChange={(e) => setAmount(e.target.value)} />
          </FormControl>
          <Stack spacing={10}>
            <Button
              bg={'primary.500'}
              color={'white'}
              onClick={() => sendTx(addressTo, amount)}
              _hover={{
                bg: 'primary.900',
              }}>
              Transfert
            </Button>
          </Stack>
        </Stack>
      </Box>
    </MainLayout>
  )
}
