import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

import { getWalletClient, getContract, prepareWriteContract, writeContract, readContract } from '@wagmi/core'
import { useAccount, useContractRead, useNetwork } from "wagmi"
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
    const [winningProposalID, setWinningProposalID] = useState(null);
    const [workflowStatus, setWorkflowStatus] = useState(null);
    const [listVoters, setListVoters] = useState([]);

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
        const winProposalID = await voting.read.winningProposalID()
        const wfStatus = await voting.read.workflowStatus()

        console.log('wfStatus', wfStatus)

        // Set state hook
        setWinningProposalID(winProposalID)
        setWorkflowStatus(wfStatus)
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
                isClosable: true
            })
        }
    }, [isConnected, address, chain?.id])

    // Admin
    const addVoter = async (_address) => {
        console.log('addVoter', _address)
        if (!_address) return;
        try {
            const { request } = await prepareWriteContract({
                address: contracts.voting.address,
                abi: contracts.voting.abi,
                functionName: 'addVoter',
                args: [String(_address)]
            })
            const { hash } = await writeContract(request)
            console.log('addVoter', request, hash)
        } catch (error) {
            throw error
        }
    }
    const startProposalsRegistering = async () => {
        console.log('startProposalsRegistering')
        try {
            const { request } = await prepareWriteContract({
                address: contracts.voting.address,
                abi: contracts.voting.abi,
                functionName: 'startProposalsRegistering'
            })
            const { hash } = await writeContract(request)
            console.log('startProposalsRegistering', request, hash)
        } catch (error) {
            throw error
        }
    }
    const endProposalsRegistering = async () => {
        console.log('endProposalsRegistering')
        try {
            const { request } = await prepareWriteContract({
                address: contracts.voting.address,
                abi: contracts.voting.abi,
                functionName: 'endProposalsRegistering'
            })
            const { hash } = await writeContract(request)
            console.log('endProposalsRegistering', request, hash)
        } catch (error) {
            throw error
        }
    }
    const startVotingSession = async () => {
        console.log('startVotingSession')
        try {
            const { request } = await prepareWriteContract({
                address: contracts.voting.address,
                abi: contracts.voting.abi,
                functionName: 'startVotingSession'
            })
            const { hash } = await writeContract(request)
            console.log('startVotingSession', request, hash)
        } catch (error) {
            throw error
        }
    }
    const endVotingSession = async () => {
        console.log('endVotingSession')
        try {
            const { request } = await prepareWriteContract({
                address: contracts.voting.address,
                abi: contracts.voting.abi,
                functionName: 'endVotingSession'
            })
            const { hash } = await writeContract(request)
            console.log('endVotingSession', request, hash)
        } catch (error) {
            throw error
        }
    }
    const tallyVotes = async () => {
        console.log('tallyVotes')
        try {
            const { request } = await prepareWriteContract({
                address: contracts.voting.address,
                abi: contracts.voting.abi,
                functionName: 'tallyVotes'
            })
            const { hash } = await writeContract(request)
            console.log('tallyVotes', request, hash)
        } catch (error) {
            throw error
        }
    }

    const getVoter = async (_address) => {
        console.log('getVoter', _address)
        if (!_address) return;
        try {
            const data = await readContract({
                address: contracts.voting.address,
                abi: contracts.voting.abi,
                functionName: 'getVoter',
                args: [String(_address)]
            })
            console.log('getVoter', data)
            return data
        } catch (error) {
            throw error
        }
    }
    const getOneProposal = async (_id) => {
        if (Number(_id) < 0) return;
        try {
            const data = await readContract({
                address: contracts.voting.address,
                abi: contracts.voting.abi,
                functionName: 'getOneProposal',
                args: [Number(_id)]
            })
            console.log('getOneProposal', data)
            return data
        } catch (error) {
            throw error
        }
    }
    const addProposal = async (_desc) => {
        console.log('addProposal', _desc)
        if (!_desc) return;
        try {
            const { request } = await prepareWriteContract({
                address: contracts.voting.address,
                abi: contracts.voting.abi,
                functionName: 'addProposal',
                args: [String(_desc)]
            })
            const { hash } = await writeContract(request)
            console.log('addProposal', request, hash)
        } catch (error) {
            throw error
        }
    }
    const setVote = async (_id) => {
        console.log('setVote', _id)
        if (!_id) return;
        try {
            const { request } = await prepareWriteContract({
                address: contracts.voting.address,
                abi: contracts.voting.abi,
                functionName: 'setVote',
                args: [Number(_id)]
            })
            const { hash } = await writeContract(request)
            console.log('setVote', request, hash)
        } catch (error) {
            throw error
        }
    }

    // export from hook
    return {
        address: contracts.voting.address,

        // State contract
        contract, owner, isOwner, isVoter,
        winningProposalID, workflowStatus,

        // Fn
        // admin
        addVoter, startProposalsRegistering, endProposalsRegistering,
        startVotingSession, endVotingSession, tallyVotes,
        // voter
        getVoter, getOneProposal, addProposal, setVote,

        // Event
        listVoters

    }
}
