import {
    Box,
    Flex,
    Stack,
    Button,
    Link as CLink,
    useColorModeValue,
    Menu,
    MenuButton,
    MenuList,
    MenuGroup,
    MenuDivider,
    MenuItem
} from "@chakra-ui/react"
import Link from 'next/link'
import { ColorModeSwitcher } from "@/components/ColorSwitcher.js"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from 'wagmi';
import { useContext } from "react";
import { VotingContext } from "@/contexts";

export function Navbar({ isOpen }) {
    const { isConnected } = useAccount()
    const { isOwner } = useContext(VotingContext)

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

                {/* COLOR MODE */}
                <Box>
                    <Stack
                        flex={{ base: 1, md: 0 }}
                        justify={"flex-end"}
                        direction={"row"}
                    >

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
                        <ColorModeSwitcher justifySelf="flex-end" />
                    </Stack>
                </Box>

                <Box>
                    <Menu>
                        <MenuButton as={Button}>
                            {!isConnected ? "Connect" : "Profile"}
                        </MenuButton>
                        <MenuList>
                            <MenuGroup title='Profile'>
                                <MenuItem><Link href="/account">My Account</Link></MenuItem>
                                <MenuItem><Link href="/proposals">Proposals</Link></MenuItem>
                            </MenuGroup>
                            <MenuDivider />
                            {isOwner && (
                                <MenuGroup title='Admin'>
                                    <MenuItem><Link href="/admin">Dashboard</Link></MenuItem>
                                </MenuGroup>
                            )}
                        </MenuList>
                    </Menu>
                </Box>

            </Flex>
        </Box>
    )
}
