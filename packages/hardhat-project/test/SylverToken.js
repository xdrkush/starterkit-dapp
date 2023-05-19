const {
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("SylverToken", function () {

    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.

    async function deployFixture() {
        // Déploiement du contrat ERC20
        const supply = hre.ethers.utils.parseEther("420000000");
        const SylverToken = await ethers.getContractFactory("SylverToken");
        const sylverToken = await SylverToken.deploy(supply);
        await sylverToken.deployed();

        // Obtention des comptes pour les tests
        const [owner, addr1, addr2] = await ethers.getSigners();

        return { sylverToken, owner, addr1, addr2 };
    };


    describe("Deployment", function () {

        describe("Name, Symbol", () => {
            // Check token
            it("should have correct name and symbol", async () => {
                const { sylverToken } = await loadFixture(deployFixture);
                expect(await sylverToken.name()).to.equal("SylverToken");
                expect(await sylverToken.symbol()).to.equal("SYLV");
            });
        })


    })
})