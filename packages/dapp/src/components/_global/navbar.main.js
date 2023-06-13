import {
    Box,
    Flex,
    Button,
    useColorModeValue,
    Menu,
    MenuButton,
    MenuList,
    MenuGroup,
    MenuDivider,
    MenuItem,
    Text
} from "@chakra-ui/react"
import Link from 'next/link'
import { ColorModeSwitcher } from "@/components/ColorSwitcher.js"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from 'wagmi';
import { useContext } from "react";
import { VotingContext } from "@/contexts";

export function Navbar({ isOpen }) {
    const { isConnected } = useAccount()
    const { isOwner, workflowStatus, winningProposalID } = useContext(VotingContext)

    console.log('Navbar', isOwner)

    return (
        <Box>
            <Flex
                w={"100%"}
                position="fixed"
                zIndex="10"
                bg={useColorModeValue("white", "gray.800")}
                color={useColorModeValue("gray.600", "white")}
                minH={"60px"}
                py={{ base: 2 }}
                px={{ base: 4 }}
                borderBottom={1}
                borderStyle={"solid"}
                borderColor={useColorModeValue("gray.100", "primary.100")}
                align={"center"}
            >
                {/* HOME LINK */}
                <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
                    <Box
                        display="flex"
                        color={useColorModeValue("gray.800", "white")}
                        fontSize={"lg"}
                        _hover={{
                            textDecoration: "none",
                            color: useColorModeValue("gray.800", "white"),
                        }}
                        fontWeight="bold"
                    >
                        <Link href="/">
                            Home Voting Contract
                        </Link>
                    </Box>
                </Flex>

                <Box px={2}>
                    <Text fontSize={"2xl"}>Status: {String(workflowStatus)}</Text>
                </Box>
                <Box px={2}>
                    <Text fontSize={"2xl"}>Winner: {String(winningProposalID)}</Text>
                </Box>

                {/* COLOR MODE */}
                <Box px={1}>
                    <ColorModeSwitcher justifySelf="flex-end" />
                </Box>

                <Box px={1}>
                    <Menu>
                        {!isConnected ? (
                            <ConnectButton
                                accountStatus={{
                                    smallScreen: "avatar",
                                    largeScreen: "full",
                                }}
                                chainStatus={{
                                    smallScreen: "none",
                                    largeScreen: "full",
                                }}
                            />
                        ) : (
                            <MenuButton as={Button}>
                                Profile
                            </MenuButton>
                        )}
                        <MenuList px={2}>
                            <ConnectButton
                                accountStatus={{
                                    smallScreen: "avatar",
                                    largeScreen: "full",
                                }}
                                chainStatus={{
                                    smallScreen: "none",
                                    largeScreen: "full",
                                }}
                            />
                            {isConnected && (
                                <>
                                    <MenuGroup title='Profile'>
                                        <Link href="/account"><MenuItem>My Account</MenuItem></Link>
                                        <Link href="/proposals"><MenuItem>Proposals</MenuItem></Link>
                                    </MenuGroup>
                                    <MenuDivider />
                                </>
                            )}
                            {isOwner && (
                                <MenuGroup title='Admin'>
                                    <MenuItem><Link href="/admin">Dashboard</Link></MenuItem>
                                </MenuGroup>
                            )}
                        </MenuList>
                    </Menu>
                </Box>

            </Flex >
        </Box >
    )
}
