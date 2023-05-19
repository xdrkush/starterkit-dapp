import MainLayout from "@/components/layout";
import { useAccount } from 'wagmi';

export default function Home() {
  const { address, isConnecting, isDisconnected } = useAccount()
  
  console.log('home', address, isConnecting, isDisconnected)

  return (
    <MainLayout>
      <p>Home</p>
    </MainLayout>
  )
}
