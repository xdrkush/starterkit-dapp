const {
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Voting", function () {

    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.

    async function deployFixtureWhitelisted() {
        // Déploiement du contrat
        const Voting = await ethers.getContractFactory("Voting");
        const voting = await Voting.deploy();
        await voting.deployed();

        const [owner, addr1] = await ethers.getSigners();

        return { voting, owner, addr1 };
    };

    async function deployFixtureProposal() {
        // Déploiement du contrat
        const Voting = await ethers.getContractFactory("Voting");
        const voting = await Voting.deploy();
        await voting.deployed();

        const [owner, addr1, addr2] = await ethers.getSigners();

        // Whitelisted addr1
        await voting.registerWhitelisted(addr1.address)
        // Open registration proposal
        await voting.incWorkflowStatus()

        return { voting, owner, addr1, addr2 };
    };

    async function deployFixtureVote() {
        // Déploiement du contrat
        const Voting = await ethers.getContractFactory("Voting");
        const voting = await Voting.deploy();
        await voting.deployed();

        // Obtention des comptes pour les tests (provider)
        const [owner, addr1, addr2, addr3] = await ethers.getSigners();

        // Whitelisted addrN
        await voting.registerWhitelisted(addr1.address)
        await voting.registerWhitelisted(addr2.address)
        await voting.registerWhitelisted(addr3.address)
        // Open registration proposal
        await voting.incWorkflowStatus()
        // New proposal by addrN
        await voting.connect(addr1).newProposal("Proposal 1")
        await voting.connect(addr2).newProposal("Proposal 2")
        await voting.connect(addr3).newProposal("Proposal 3")
        // Close registration proposal
        await voting.incWorkflowStatus()
        // Open session vote
        await voting.incWorkflowStatus()

        return { voting, owner, addr1, addr2, addr3 };
    };
    async function deployFixtureTallied() {
        // Déploiement du contrat
        const Voting = await ethers.getContractFactory("Voting");
        const voting = await Voting.deploy();
        await voting.deployed();

        // Obtention des comptes pour les tests (provider)
        const [owner, addr1, addr2, addr3] = await ethers.getSigners();

        // Whitelisted addrN
        await voting.registerWhitelisted(addr1.address)
        await voting.registerWhitelisted(addr2.address)
        await voting.registerWhitelisted(addr3.address)
        // Open registration proposal
        await voting.incWorkflowStatus()
        // New proposal by addr1
        // New proposal by addrN
        await voting.connect(addr1).newProposal("Proposal 1")
        await voting.connect(addr2).newProposal("Proposal 2")
        await voting.connect(addr3).newProposal("Proposal 3")
        // Close registration proposal
        await voting.incWorkflowStatus()
        // Open session vote
        await voting.incWorkflowStatus()
        // Addr1 vote on proposal 0
        await voting.connect(addr1).voteOnProposal(2)
        await voting.connect(addr2).voteOnProposal(1)
        await voting.connect(addr3).voteOnProposal(1)

        return { voting, owner, addr1, addr2, addr3 };
    };

    describe("Deployment", function () {

        describe("Whitelisted", () => {

            it("should have correct owner", async () => {
                const { voting, owner } = await loadFixture(deployFixtureWhitelisted)

                expect(await voting.owner()).to.equal(owner.address);
            });

            it("should have correct status registration adddress", async () => {
                const { voting } = await loadFixture(deployFixtureWhitelisted)
                expect(await voting.getStatus()).to.equal(0);
            });

            it("should have correct addr1 is whitelisted", async () => {
                const { voting, addr1 } = await loadFixture(deployFixtureWhitelisted)
                // Whitelisted addr
                voting.registerWhitelisted(addr1.address)

                expect(await voting.isWhitelisted(addr1.address)).to.equal(true);
            });

            it("should have correct status start proposal", async () => {
                const { voting, addr1 } = await loadFixture(deployFixtureWhitelisted)
                // inncrement status
                voting.incWorkflowStatus()

                expect(await voting.getStatus()).to.equal(1);

                // New status : withelisted -> Err
                await expect(voting.registerWhitelisted(addr1.address))
                    .to.be.revertedWith("You have invalid workflow status.")
            });

        })

        describe("Proposal", () => {

            it("should have correct proposal registration", async () => {
                const { voting, addr1 } = await loadFixture(deployFixtureProposal)

                // Check
                expect(await voting.isWhitelisted(addr1.address)).to.equal(true);
                expect(await voting.getStatus()).to.equal(1);

                // Create Proposal
                await voting.connect(addr1).newProposal("Proposal 1")
                // Get Proposal
                const proposal = await voting.getProposal(0)
                expect(proposal[0]).to.equal("Proposal 1"); // description
                expect(proposal[1]).to.equal(0); // voteCount

            });

            it("should have correct status end proposal", async () => {
                const { voting, addr1 } = await loadFixture(deployFixtureProposal)
                voting.incWorkflowStatus()
                expect(await voting.getStatus()).to.equal(2);

                // New status : Create Proposal -> Err
                await expect(voting.connect(addr1).newProposal("Proposal 1"))
                    .to.be.revertedWith("You have invalid workflow status.")

            });

        })

        describe("Vote", () => {

            it("should have correct vote registration", async () => {
                const { voting, addr1 } = await loadFixture(deployFixtureVote)

                // Check
                expect(await voting.isWhitelisted(addr1.address)).to.equal(true);
                expect(await voting.getStatus()).to.equal(3);
                expect(typeof await voting.getProposal(0)).to.equal(typeof []);

                // Create Proposal
                await voting.connect(addr1).voteOnProposal(0)

                // Get Proposal
                const proposal = await voting.getProposal(0)
                expect(proposal[1]).to.equal(1); // proposal.voteCount

            });

            it("should have correct voter on proposalId", async () => {
                const { voting, addr1 } = await loadFixture(deployFixtureVote)

                // Create Proposal
                await voting.connect(addr1).voteOnProposal(0)
                expect((await voting.getProposal(0))[1]).to.equal(1);

                // Get Voter
                const voter = await voting.getVoter(addr1.address)
                expect(voter[0]).to.equal(true); // voter.isRegistred
                expect(voter[1]).to.equal(true); // voter.hasVoted
                expect(voter[2]).to.equal(0); // voter.proposalId

            });

            it("should have correct status end session vote", async () => {
                const { voting, addr1 } = await loadFixture(deployFixtureVote)
                voting.incWorkflowStatus()
                expect(await voting.getStatus()).to.equal(4);

                // New status : Vote on Proposal -> Err
                await expect(voting.connect(addr1).voteOnProposal(0))
                    .to.be.revertedWith("You have invalid workflow status.")
            });

        })

        describe("Tallied", () => {

            it("should have correct tallied", async () => {
                const { voting, addr1 } = await loadFixture(deployFixtureTallied)

                expect(await voting.isWhitelisted(addr1.address)).to.equal(true);

                voting.incWorkflowStatus() // Stop Session Vote
                voting.incWorkflowStatus() // Vote Tallied
                expect(await voting.getStatus()).to.equal(5);

                expect(Number(await voting.winningProposalId())).to.equal(1) // getWinningProposal

            });


            it("should have correct proposal winning public", async () => {
                const { voting, addr1, addr3 } = await loadFixture(deployFixtureTallied)

                expect(await voting.isWhitelisted(addr1.address)).to.equal(true);

                voting.incWorkflowStatus() // Stop Session Vote
                voting.incWorkflowStatus() // Vote Tallied
                expect(await voting.getStatus()).to.equal(5);

                const proposalWin = await voting.connect(addr3).getWinningProposal()

                expect(proposalWin[0]).to.equal("Proposal 2") // getWinningProposal

            });

            it("should have correct status end proposal", async () => {
                const { voting } = await loadFixture(deployFixtureTallied)
                voting.votingSessionEnded() // Stop Session Vote
                expect(await voting.getStatus()).to.equal(4);
                voting.incWorkflowStatus() // Vote Tallied
                expect(await voting.getStatus()).to.equal(5);

            });

        })

        describe("Event", () => {
            it("VoterRegistered:event", async () => {
                const { voting, addr1 } = await loadFixture(deployFixtureWhitelisted)

                await expect(voting.registerWhitelisted(addr1.address))
                    .to.emit(voting, "VoterRegistered")
                    .withArgs(String);
            })
            it("IncWorkflowStatus:event", async () => {
                const { voting } = await loadFixture(deployFixtureWhitelisted)

                await expect(voting.incWorkflowStatus())
                    .to.emit(voting, "WorkflowStatusChange")
                    .withArgs(0, 1);
            })
            it("ProposalRegistered:event", async () => {
                const { voting, addr1 } = await loadFixture(deployFixtureProposal)

                await expect(voting.connect(addr1).newProposal("Proposal 1"))
                    .to.emit(voting, "ProposalRegistered")
                    .withArgs(0);
            })
            it("Voted:event", async () => {
                const { voting, addr1 } = await loadFixture(deployFixtureVote)

                await expect(voting.connect(addr1).voteOnProposal(1))
                    .to.emit(voting, "Voted")
                    .withArgs(String, String);
            })
        })


    })
})