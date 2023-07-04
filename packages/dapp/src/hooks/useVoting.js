import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

import { getWalletClient, getContract, prepareWriteContract, writeContract, readContract, watchContractEvent } from '@wagmi/core'
import { useAccount, useConfig, useContractEvent, useNetwork, useWebSocketPublicClient } from "wagmi"
import { decodeEventLog, isAddress, createPublicClient, http, parseAbiItem } from 'viem'
import { hardhat } from 'viem/chains'

import contracts from "@/config/contracts.json"
import { useError } from './useError';
import { client, config } from "@/config"
import { confetti } from '@/utils';

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
    const [votingIsConnected, setVotingIsConnected] = useState(null);
    const [proposalsRegistred, setProposalsRegistred] = useState([]);
    const [historyVotes, setHistoryVotes] = useState([]);
    const [historyWorkflowStatus, setHistoryWorkflowStatus] = useState([]);

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

    useEffect(() => {
        if (!address || !isConnected) return
        checkRoles()
    }, [address, contract])

    // Load contract
    const loadContract = async () => {
        try {
            // get contract with provider connected
            const walletClient = await getWalletClient()
            console.log('hook', config)
            const voting = getContract({
                address: config.contracts.voting.address,
                abi: config.contracts.voting.abi,
                walletClient
            })
            

            const owner = isAddress(await voting.read.owner()) ? await voting.read.owner() : null
            const wfStatus = await voting.read.workflowStatus()
            
            // Set state hook
            setWinningProposalID(await voting.read.winningProposalID())
            setWorkflowStatus(wfStatus)
            setContract(voting)
            setOwner(owner)
            setIsOwner(owner === address)
            setVotingIsConnected(true)

            await checkRoles()

        } catch (error) {
            setError("Impossible de se connecter au contrat, êtes vous sur le bon réseaux ?")
            setVotingIsConnected(false)
        }
    }
    const checkRoles = async () => {
        try {
            const voter = await getVoter(address)
            if (voter) setIsVoter(true)
        } catch (error) {
            setIsVoter(false)
        }
        try {
            const owner = isAddress(await contract.read.owner()) ? await contract.read.owner() : null
            if (owner) setIsOwner(owner === address)
        } catch (error) {
            setIsOwner(false)
        }

        await confetti()
    }
    /**
     * Event History Log
     */

    const getEventsHistory = async () => {
        const fromBlock = BigInt(Number(await client.getBlockNumber()) - 15000)
        try {
            // VoterRegistered
            const logsVoterRegistered = await client.getLogs({
                address: config.contracts.voting.address,
                event: parseAbiItem('event VoterRegistered(address voterAddress)'),
                fromBlock: Number(fromBlock) >= 0 ? fromBlock : 0n,
            })
            setListVoters(logsVoterRegistered)
            console.log('listVoters', logsVoterRegistered, listVoters)
        } catch (error) {
            setError(error.message)
        }

        try {
            // WorkflowStatusChange
            const logsWorkflowStatusChange = await client.getLogs({
                address: config.contracts.voting.address,
                event: parseAbiItem('event WorkflowStatusChange(uint8 previousStatus,uint8 newStatus)'),
                fromBlock: Number(fromBlock) >= 0 ? fromBlock : 0n,
            })
            setHistoryWorkflowStatus(logsWorkflowStatusChange)
            console.log('historyWorkflowStatus', logsWorkflowStatusChange)
        } catch (error) {
            setError(error.message)
        }

        try {
            // ProposalRegistered
            const logsProposalRegistered = await client.getLogs({
                address: config.contracts.voting.address,
                event: parseAbiItem('event ProposalRegistered(uint proposalId)'),
                fromBlock: Number(fromBlock) >= 0 ? fromBlock : 0n,
            })
            setProposalsRegistred(logsProposalRegistered)
            console.log('proposalsRegistred', logsProposalRegistered)
        } catch (error) {
            setError(error.message)
        }

        try {
            // Voted
            const logsHistoryVotes = await client.getLogs({
                address: config.contracts.voting.address,
                event: parseAbiItem('event Voted(address voter, uint proposalId)'),
                fromBlock: Number(fromBlock) >= 0 ? fromBlock : 0n,
            })
            setHistoryVotes(logsHistoryVotes)
            console.log('historyVotes', logsHistoryVotes)
        } catch (error) {
            setError(error.message)
        }

        // initWatcher()
    }

    // const initWatcher = async () => {
    //     const fromBlock = BigInt(Number(await client.getBlockNumber()) - 15000)
    //     try {
    //         const filter = await client.createContractEventFilter({
    //             abi: config.contracts.voting.abi,
    //             address: config.contracts.voting.address,
    //             eventName: 'VoterRegistered',
    //             fromBlock: Number(fromBlock) >= 0 ? fromBlock : 0n,
    //         })
    //         const logs = await client.getFilterLogs({ filter })

    //         console.log('logs 1', logs)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    /**
     * Watcher
     */

    // Set Workflow status with event WorkflowStatusChange
    watchContractEvent({
        address: config.contracts.voting.address,
        abi: config.contracts.voting.abi,
        eventName: 'WorkflowStatusChange',
    }, (log) => {
        setWorkflowStatus(log[0].args.newStatus)
    })
    // Set List Voters with event VoterRegistered
    // watchContractEvent({
    //     address: config.contracts.voting.address,
    //     abi: config.contracts.voting.abi,
    //     eventName: 'VoterRegistered',
    // }, (log) => {
    //     console.log('event VoterRegistred', listVoters, [...listVoters, ...log])
    //     setListVoters([...listVoters, ...log])
    // })

    // Set List Voters with event VoterRegistered
    // useContractEvent({
    //     address: config.contracts.voting.address,
    //     abi: config.contracts.voting.abi,
    //     eventName: 'VoterRegistered',
    //     listener(log) {
    //         console.log(log)
    //     },
    // })

    // Set List Votes with event Voted
    // watchContractEvent({
    //     address: config.contracts.voting.address,
    //     abi: config.contracts.voting.abi,
    //     eventName: 'Voted',
    // }, (log) => {
    //     setHistoryVotes([...historyVotes, ...log])
    // })

    // Admin
    const addVoter = async (_address) => {
        if (!_address) return;
        try {
            const { request } = await prepareWriteContract({
                address: config.contracts.voting.address,
                abi: config.contracts.voting.abi,
                functionName: 'addVoter',
                args: [String(_address)]
            })
            const { hash } = await writeContract(request)
            await confetti()
            return hash
        } catch (err) {
            setError(err.message)
        }
    }
    const startProposalsRegistering = async () => {
        try {
            const { request } = await prepareWriteContract({
                address: config.contracts.voting.address,
                abi: config.contracts.voting.abi,
                functionName: 'startProposalsRegistering'
            })
            const { hash } = await writeContract(request)
            await confetti()
            return hash
        } catch (err) {
            setError(err.message)
        }
    }
    const endProposalsRegistering = async () => {
        try {
            const { request } = await prepareWriteContract({
                address: config.contracts.voting.address,
                abi: config.contracts.voting.abi,
                functionName: 'endProposalsRegistering'
            })
            const { hash } = await writeContract(request)
            await confetti()
            return hash
        } catch (err) {
            setError(err.message)
        }
    }
    const startVotingSession = async () => {
        try {
            const { request } = await prepareWriteContract({
                address: config.contracts.voting.address,
                abi: config.contracts.voting.abi,
                functionName: 'startVotingSession'
            })
            const { hash } = await writeContract(request)
            await confetti()
            return hash
        } catch (err) {
            setError(err.message)
        }
    }
    const endVotingSession = async () => {
        try {
            const { request } = await prepareWriteContract({
                address: config.contracts.voting.address,
                abi: config.contracts.voting.abi,
                functionName: 'endVotingSession'
            })
            const { hash } = await writeContract(request)
            await confetti()
            return hash
        } catch (err) {
            setError(err.message)
        }
    }
    const tallyVotes = async () => {
        try {
            const { request } = await prepareWriteContract({
                address: config.contracts.voting.address,
                abi: config.contracts.voting.abi,
                functionName: 'tallyVotes'
            })
            const { hash } = await writeContract(request)

            setWinningProposalID(await contract.read.winningProposalID())
            await confetti()

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
                address: config.contracts.voting.address,
                abi: config.contracts.voting.abi,
                functionName: 'getVoter',
                args: [String(_address)]
            })
            return data
        } catch (err) {
            setError("Vous devez être enregitrer comme voter. " + err.message)
        }
    }
    const getOneProposal = async (_id) => {
        if (Number(_id) < 0) return;
        try {
            const data = await readContract({
                address: config.contracts.voting.address,
                abi: config.contracts.voting.abi,
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
                address: config.contracts.voting.address,
                abi: config.contracts.voting.abi,
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
                address: config.contracts.voting.address,
                abi: config.contracts.voting.abi,
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
        address: config.contracts.voting.address,
        // State contract
        contract, owner, isOwner, isVoter, votingIsConnected,
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
