import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

import { getWalletClient, getContract, prepareWriteContract, writeContract, readContract, watchContractEvent } from '@wagmi/core'
import { useAccount, useConfig, useContractEvent, useNetwork, useWebSocketPublicClient } from "wagmi"
import { decodeEventLog, isAddress, createPublicClient, http, parseAbiItem } from 'viem'
import { hardhat } from 'viem/chains'


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
    const [proposalsRegistred, setProposalsRegistred] = useState([]);
    const [historyVotes, setHistoryVotes] = useState([]);
    const [historyWorkflowStatus, setHistoryWorkflowStatus] = useState([]);

    // Viem client
    const client = createPublicClient({
        chain: hardhat,
        transport: http(),
    })

    // Init
    useEffect(() => {
        if (!isConnected) return;
        try {
            loadContract()
            getEventsHistory()
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

    const getEventsHistory = async () => {

        // VoterRegistered
        const logsVoterRegistered = await client.getLogs({
            // address: contracts.voting.address,
            // abi: contracts.voting.abi,
            event: parseAbiItem('event VoterRegistered(address voterAddress)'),
            fromBlock: 0n,
            toBlock: 1000n
        })
        setListVoters(logsVoterRegistered)
        console.log('listVoters', logsVoterRegistered, listVoters)

        // WorkflowStatusChange
        const logsWorkflowStatusChange = await client.getLogs({
            // address: contracts.voting.address,
            // abi: contracts.voting.abi,
            event: parseAbiItem('event WorkflowStatusChange(uint8 previousStatus,uint8 newStatus)'),
            fromBlock: 0n,
            toBlock: 1000n
        })
        setHistoryWorkflowStatus(logsWorkflowStatusChange)
        console.log('historyWorkflowStatus', logsWorkflowStatusChange)

        // ProposalRegistered
        const logsProposalRegistered = await client.getLogs({
            // address: contracts.voting.address,
            // abi: contracts.voting.abi,
            event: parseAbiItem('event ProposalRegistered(uint proposalId)'),
            fromBlock: 0n,
            toBlock: 1000n
        })
        setProposalsRegistred(logsProposalRegistered)
        console.log('proposalsRegistred', proposalsRegistred)

        // Voted
        const logsHistoryVotes = await client.getLogs({
            // address: contracts.voting.address,
            // abi: contracts.voting.abi,
            event: parseAbiItem('event Voted(address voter, uint proposalId)'),
            fromBlock: 0n,
            toBlock: 1000n
        })
        setHistoryVotes(logsHistoryVotes)
        console.log('historyVotes', historyVotes)

    }

    // Set Workflow status with event WorkflowStatusChange
    watchContractEvent({
        address: contracts.voting.address,
        abi: contracts.voting.abi,
        eventName: 'WorkflowStatusChange',
    }, (log) => {
        setWorkflowStatus(log[0].args.newStatus)
    })
    // Set List Voters with event VoterRegistered
    watchContractEvent({
        address: contracts.voting.address,
        abi: contracts.voting.abi,
        eventName: 'VoterRegistered',
    }, (log) => {
        console.log('event VoterRegistred', [...listVoters, log])
        setListVoters([...listVoters, ...log])
    })
    // Set List Votes with event Voted
    // watchContractEvent({
    //     address: contracts.voting.address,
    //     abi: contracts.voting.abi,
    //     eventName: 'Voted',
    // }, (log) => {
    //     setHistoryVotes([...historyVotes, log])
    // })

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

    // Voter
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
        listVoters, proposalsRegistred, historyVotes, historyWorkflowStatus
    }
}
