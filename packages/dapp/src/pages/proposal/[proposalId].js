import { useRouter } from 'next/router'

import AccountLayout from "@/components/layouts/Account.layout";

export default function ProposalId() {
    const router = useRouter()
    const { proposalId } = router.query

    return (
        <AccountLayout>
            <p>Proposal Id ({proposalId})</p>
        </AccountLayout>
    )
}