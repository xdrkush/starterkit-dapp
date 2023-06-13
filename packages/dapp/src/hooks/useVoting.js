import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

import { getWalletClient, getContract, prepareWriteContract, writeContract, readContract } from '@wagmi/core'
import { useAccount, useContractRead, useNetwork } from "wagmi"
import { isAddress } from 'viem'

import contracts from "@/config/contracts.json"
import { useError } from './useError';

export function useVoting() {
    const { isConnected, address } = useAccount()
    const { chain } = useNetwork()
    const { setError } = useError()
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
        if (!_address) return;
        try {
            const { request } = await prepareWriteContract({
                address: contracts.voting.address,
                abi: contracts.voting.abi,
                functionName: 'addVoter',
                args: [String(_address)]
            })
            const { hash } = await writeContract(request)
            return hash
        } catch (err) {
            setError(err.message)
        }
    }
    const startProposalsRegistering = async () => {
        try {
            const { request } = await prepareWriteContract({
                address: contracts.voting.address,
                abi: contracts.voting.abi,
                functionName: 'startProposalsRegistering'
            })
            const { hash } = await writeContract(request)
            return hash
        } catch (err) {
            setError(err.message)
        }
    }
    const endProposalsRegistering = async () => {
        try {
            const { request } = await prepareWriteContract({
                address: contracts.voting.address,
                abi: contracts.voting.abi,
                functionName: 'endProposalsRegistering'
            })
            const { hash } = await writeContract(request)
            return hash
        } catch (err) {
            setError(err.message)
        }
    }
    const startVotingSession = async () => {
        try {
            const { request } = await prepareWriteContract({
                address: contracts.voting.address,
                abi: contracts.voting.abi,
                functionName: 'startVotingSession'
            })
            const { hash } = await writeContract(request)
            return hash
        } catch (err) {
            setError(err.message)
        }
    }
    const endVotingSession = async () => {
        try {
            const { request } = await prepareWriteContract({
                address: contracts.voting.address,
                abi: contracts.voting.abi,
                functionName: 'endVotingSession'
            })
            const { hash } = await writeContract(request)
            return hash
        } catch (err) {
            setError(err.message)
        }
    }
    const tallyVotes = async () => {
        try {
            const { request } = await prepareWriteContract({
                address: contracts.voting.address,
                abi: contracts.voting.abi,
                functionName: 'tallyVotes'
            })
            const { hash } = await writeContract(request)
            return hash
        } catch (err) {
            setError(err.message)
        }
    }

    const getVoter = async (_address) => {
        if (!_address) return;
        try {
            const data = await readContract({
                address: contracts.voting.address,
                abi: contracts.voting.abi,
                functionName: 'getVoter',
                args: [String(_address)]
            })
            return data
        } catch (err) {
            setError(err.message)
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
            return data
        } catch (err) {
            setError(err.message)
        }
    }
    const addProposal = async (_desc) => {
        if (!_desc) return;
        try {
            const { request } = await prepareWriteContract({
                address: contracts.voting.address,
                abi: contracts.voting.abi,
                functionName: 'addProposal',
                args: [String(_desc)]
            })
            const { hash } = await writeContract(request)
            return hash
        } catch (err) {
            setError(err.message)
        }
    }
    const setVote = async (_id) => {
        if (!_id) return;
        try {
            const { request } = await prepareWriteContract({
                address: contracts.voting.address,
                abi: contracts.voting.abi,
                functionName: 'setVote',
                args: [Number(_id)]
            })
            const { hash } = await writeContract(request)
            return hash
        } catch (err) {
            setError(err.message)
        }
    }

    // export from hook
    return {
        // Static
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
