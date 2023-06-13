import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

import { getWalletClient, getContract } from '@wagmi/core'
import { useAccount, useNetwork } from "wagmi"
import { isAddress } from 'viem'

import contracts from "@/config/contracts.json"

export function useVoting() {
    const { isConnected, address } = useAccount()
    const { chain } = useNetwork()
    const toast = useToast()

    // init state
    const [contract, setContract] = useState({});
    const [owner, setOwner] = useState(null);
    const [isVoter, setIsVoter] = useState(null);
    const [isOwner, setIsOwner] = useState(null);

    // Load contract
    const loadContract = async () => {
        // get contract with provider connected
        const walletClient = await getWalletClient()
        const voting = getContract({
            address: contracts.voting.address,
            abi: contracts.voting.abi,
            walletClient
        })

        const owner = isAddress(await voting.read.owner()) ? await voting.read.owner() : null

        // set state hook
        setContract(voting)
        setOwner(owner)
        // setIsVoter()
        setIsOwner((owner === address))

    }

    useEffect(() => {
        if (!isConnected) return;
        try {
            loadContract()
        } catch (error) {
            toast({
                title: 'Error Contract !',
                description: "Impossible de trouver le contract.",
                status: 'error',
                duration: 9000,
                position: 'top-right',
                isClosable: true,
            })
            throw error
        }

    }, [isConnected, address, chain?.id])

    // export from hook
    return {
        address: contracts.voting.address,

        contract, owner, isOwner, isVoter
    }
}
