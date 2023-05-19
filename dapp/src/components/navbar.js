import {
    Box,
    Flex,
    Stack,
    Link,
    useColorModeValue,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "@/components/ColorSwitcher.js"
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Navbar({ isOpen }) {

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
                    <Link
                        display="flex"
                        href={"#/home"}
                        color={useColorModeValue("gray.800", "white")}
                        fontSize={"lg"}
                        _hover={{
                            textDecoration: "none",
                            color: useColorModeValue("gray.800", "white"),
                        }}
                        fontWeight="bold"
                    >
                        Sylver Contract
                    </Link>
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
            </Flex>
        </Box>
    )
}
