import "@rainbow-me/rainbowkit/styles.css";
import {
    Grid,
    GridItem,
    Container
} from "@chakra-ui/react"
import { Navbar } from "@/components/_global/navbar.main";

export default function AdminLayout({ children }) {
    return (
        <Grid
            templateAreas={`"nav" "main"`}
            gridTemplateRows={"60px 1fr"}
        >
            <GridItem area={"nav"}>
                <Navbar />
            </GridItem>

            <GridItem minH="80vh" area={"main"}>
                <Container as="main" maxW="container.lg" pt="5">
                    {children}
                </Container>
            </GridItem>
        </Grid>
    )
}
