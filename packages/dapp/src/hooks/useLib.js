// hook : useLib
import { useEffect, useState } from 'react'
import { getWalletClient, getContract } from '@wagmi/core'
import { useAccount, useNetwork } from "wagmi"
import contracts from "@/config/contracts.json"

export function useLib() {
    const { isConnected, address } = useAccount()
    const { chain } = useNetwork()

    // init state
    const [lib, setLib] = useState({});
    const [ownerLib, setOwnerLib] = useState(null);

    // Load contract
    useEffect(() => {
        const init = async () => {
            // get contract with provider connected
            const walletClient = await getWalletClient()
            const l = getContract({
                address: contracts.lib.address,
                abi: contracts.lib.abi,
                walletClient
            })

            // set state hook
            setLib(l)
            setOwnerLib(await l.read.getOwner())
        }

        // Load Fn
        init()

    }, [isConnected, address, chain?.id])

    // export from hook
    return {
        addressLib: contracts.lib.address,
        lib,
        ownerLib
    }
}
