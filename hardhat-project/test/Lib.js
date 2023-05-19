const {
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Lib", function () {

    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.

    async function deployFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, addr2] = await ethers.getSigners();

        // Depploy Contract : SylerToken
        const supply = hre.ethers.utils.parseEther("420000000");
        const SylverToken = await ethers.getContractFactory("SylverToken");
        const sylverToken = await SylverToken.deploy(supply);
        await sylverToken.deployed();

        // Deploy Contract : Lib
        const Lib = await ethers.getContractFactory("Lib");
        const lib = await Lib.deploy(sylverToken.address);

        return { lib, owner, addr2 };
    }

    describe("Deployment", function () {

        // test if msg.sender == owner
        it("Should egal to owner", async function () {
            const { lib, owner } = await loadFixture(deployFixture);

            expect(await lib.getOwner()).to.equal(owner.address);
        });

        // test if msg.sender != owner
        it("Should be not egal to owner", async function () {
            const { lib, addr2 } = await loadFixture(deployFixture);

            // Provider / No-Owner
            const addr2Provider = lib.connect(addr2);

            await expect(addr2Provider.getOwner()).to.be.revertedWith("Vous ne pouvez pas execute cette fonction");
        });

    })
})