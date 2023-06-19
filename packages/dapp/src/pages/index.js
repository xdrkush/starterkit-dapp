// page : /
import MainLayout from "@/components/layouts/Main.layout";
import { VotingContext } from "@/contexts/index";

import {
  Box,
  Heading,
} from '@chakra-ui/react';
import { useContext } from "react";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount()
  // Call hook
  const { address, owner, isOwner, isVoter } = useContext(VotingContext);

  return (
    <MainLayout>

      <Heading>Welcome to voting contract </Heading>

      {!isConnected ? (
        <Box>
          <p>Vous devez être connecté pour accèder au vote</p>

        </Box>
      ) : (
        <Box>
          <p>Address contract voting: {address} </p>
          <p>The owner on contract voting: {owner} </p>

          {isVoter && (
            <p>Owner: You are voter ! 🎉</p>
          )}

          {isOwner && (
            <p>Owner: You are owner ! 🎉</p>
          )}
        </Box>
      )}


    </MainLayout>
  )
}
