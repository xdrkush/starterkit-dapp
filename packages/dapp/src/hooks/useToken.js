// hook : useToken
import { useEffect, useState } from 'react'
import { getWalletClient, getContract, writeContract } from '@wagmi/core'
import { useAccount, useNetwork } from "wagmi"
import { ethers } from "ethers"
import contracts from "@/config/contracts.json"

export function useToken() {
    const { isConnected, address } = useAccount()
    const { chain } = useNetwork()

    // init state
    const [token, setToken] = useState({});
    const [totalSupply, setTotalSupply] = useState(null);
    const [name, setName] = useState(null);

    // Load contract
    useEffect(() => {
        const init = async () => {
            // get contract with provider connected
            const walletClient = await getWalletClient()
            const t = getContract({
                address: contracts.token.address,
                abi: contracts.token.abi,
                walletClient
            })

            // set state hook
            setToken(t)
            setTotalSupply(ethers.utils.formatEther(await t.read.totalSupply()))
            setName(await t.read.name())
        }

        // Load Fn
        init()

    }, [isConnected, address, chain?.id])

    // Fn hook
    const sendTx = async (_to, _value) => {
        const { hash } = await writeContract({
            address: contracts.token.address,
            abi: contracts.token.abi,
            functionName: 'transfer',
            args: [_to, _value],
        })

        return hash
    }

    // export from hook
    return {
        addressToken: contracts.token.address,
        token,
        totalSupply,
        name,
        sendTx
    }
}
