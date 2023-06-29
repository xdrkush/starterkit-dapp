// page : /
import { ListVotes } from "@/components/home/ListVotes";
import { WinnerProposalId } from "@/components/home/WinnerProposalId";
import MainLayout from "@/components/layouts/Main.layout";
import { VotingContext } from "@/contexts/index";

import {
  Box, Grid,
  Heading,
} from '@chakra-ui/react';
import { useContext } from "react";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount()
  // Call hook
  const { address, owner, isOwner, isVoter, votingIsConnected, winningProposalID } = useContext(VotingContext);

  return (
    <MainLayout>

      <Heading>Welcome to voting contract </Heading>

      {!isConnected && (
        <Box>
          <p>Vous devez être connecté pour accèder au vote</p>
        </Box>

      )}

      {!votingIsConnected ? (
        <Box>
          <p>Le contrat semble ne pas être connecté.</p>
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

          <Grid py={3} minH={"20vh"}>
            <WinnerProposalId />
          </Grid>

          <Grid py={3} minH={"20vh"}>
            <ListVotes />
          </Grid>

        </Box >
      )
      }


    </MainLayout >
  )
}
