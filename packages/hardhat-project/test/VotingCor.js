const {
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("VotingCor", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.

    async function deployFixtureRegisterVoter() {
        // Déploiement du contrat
        const VotingCor = await ethers.getContractFactory("VotingCor");
        const votingCor = await VotingCor.deploy();
        await votingCor.deployed();

        // Get provider with signer
        const [owner, addr1, addr2, addr3] = await ethers.getSigners();

        return { votingCor, owner, addr1, addr2, addr3 };
    };

    async function deployFixtureProposal() {
        // Call child fixture 
        const { votingCor, owner, addr1, addr2, addr3 } = await loadFixture(deployFixtureRegisterVoter)

        // Add Voters (2)
        await votingCor.addVoter(addr1.address);
        await votingCor.addVoter(addr2.address);

        return { votingCor, owner, addr1, addr2, addr3 };
    };

    async function deployFixtureVote() {
        const { votingCor, owner, addr1, addr2, addr3 } = await loadFixture(deployFixtureProposal)

        // Start registering Vote
        await votingCor.startProposalsRegistering()

        // Create 3 Proposals
        await votingCor.connect(addr1).addProposal("Proposal 1")
        await votingCor.connect(addr2).addProposal("Proposal 2")
        await votingCor.connect(addr1).addProposal("Proposal 3")

        // Close Registering Proposal
        await votingCor.endProposalsRegistering()

        return { votingCor, owner, addr1, addr2, addr3 };
    };

    async function deployFixtureTallied() {
        const { votingCor, owner, addr1, addr2, addr3 } = await loadFixture(deployFixtureVote)

        // Start voting session
        await votingCor.startVotingSession()

        // 2 vote on proposal 2
        await votingCor.connect(addr1).setVote(2)
        await votingCor.connect(addr2).setVote(2)

        return { votingCor, owner, addr1, addr2, addr3 };
    };

    describe("Deployment", function () {

        describe("Registration", () => {

            it("should have correct owner", async () => {
                const { votingCor, owner } = await loadFixture(deployFixtureRegisterVoter)
                // Check is good owner
                expect(await votingCor.owner()).to.equal(owner.address);
            });

            it("should have correct registration voter", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureRegisterVoter)
                const addr1Providder = votingCor.connect(addr1)

                // Add new voter
                await votingCor.addVoter(addr1.address);

                // Check if voter is register
                expect((await addr1Providder.getVoter(addr1.address))[0]).to.equal(true);
            });

            it("should have correct addr2 is not registration to voter", async () => {
                const { votingCor, addr1, addr2 } = await loadFixture(deployFixtureRegisterVoter)
                const addr1Providder = votingCor.connect(addr1)

                // Add new voter
                await votingCor.addVoter(addr1.address);

                // Check if voter is not register
                expect((await addr1Providder.getVoter(addr2.address))[0]).to.equal(false);
            });

            it("should have correct error if is already register", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureRegisterVoter)

                // Add new voter
                await votingCor.addVoter(addr1.address);

                // Check if voter is already register
                await expect(votingCor.addVoter(addr1.address))
                    .to.be.revertedWith("Already registered")
            });

            it("should have correct not getVoter if not voter", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureRegisterVoter)

                // Check if not a voter
                await expect(votingCor.getVoter(addr1.address))
                    .to.be.revertedWith("You're not a voter")
            });

        })

        describe("Proposal", () => {

            it("should have correct status for register proposal", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureProposal)
                const addr1Provider = votingCor.connect(addr1)

                // Check if already voter
                expect((await addr1Provider.getVoter(addr1.address))[0]).to.equal(true);

                // Status for Create Proposal
                await votingCor.startProposalsRegistering()

                // Get Proposal
                const proposal = await addr1Provider.getOneProposal(0)

                // Check if good proposal
                expect(proposal[0]).to.equal("GENESIS"); // description
                expect(proposal[1]).to.equal(0); // voteCount

            });

            it("should have correct for add new proposal", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureProposal)
                const addr1Provider = votingCor.connect(addr1)

                // Check if already voter
                expect((await addr1Provider.getVoter(addr1.address))[0]).to.equal(true);

                // Status for Create Proposal
                await votingCor.startProposalsRegistering()

                // Create Proposal
                await addr1Provider.addProposal("Proposal 1")

                // Get Proposal
                const proposal = await addr1Provider.getOneProposal(1)

                // Check new proposal
                expect(proposal[0]).to.equal("Proposal 1"); // description
                expect(proposal[1]).to.equal(0); // voteCount

            });

            it("should have correct status for dont create new proposal", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureProposal)
                const addr1Provider = votingCor.connect(addr1)

                // Check status not ready for register proposal
                await expect(addr1Provider.addProposal("Proposal 1"))
                    .to.be.revertedWith("Proposals are not allowed yet")

            });

            it("should have correct dont create new proposal empty", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureProposal)
                const addr1Provider = votingCor.connect(addr1)

                // Status for Create Proposal
                await votingCor.startProposalsRegistering()

                // Check if no propose empty proposal
                await expect(addr1Provider.addProposal(""))
                    .to.be.revertedWith("Vous ne pouvez pas ne rien proposer")

            });

            it("should have correct status for end to registred new proposal", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureProposal)
                const addr1Provider = votingCor.connect(addr1)

                // Stop status registering proposal
                votingCor.endProposalsRegistering()

                // New status : Create Proposal -> Err
                await expect(addr1Provider.addProposal("Proposal 1"))
                    .to.be.revertedWith("Proposals are not allowed yet")

            });
        })

        describe("Vote", () => {

            it("should have correct status is not open vote registration", async () => {
                const { votingCor, addr1, addr2 } = await loadFixture(deployFixtureVote)
                const addr1Provider = votingCor.connect(addr1)

                // Check voters
                expect((await addr1Provider.getVoter(addr1.address))[0]).to.equal(true);
                expect((await addr1Provider.getVoter(addr2.address))[0]).to.equal(true);
                // Check Proposal
                expect((await addr1Provider.getOneProposal(0))[0]).to.equal('GENESIS');
                expect((await addr1Provider.getOneProposal(3))[0]).to.equal('Proposal 3');

                // Check if not status for vote
                await expect(addr1Provider.setVote(1))
                    .to.be.revertedWith("Voting session havent started yet")

            });

            it("should have correct vote registration", async () => {
                const { votingCor, addr1, addr2 } = await loadFixture(deployFixtureVote)
                const addr1Provider = votingCor.connect(addr1)
                const addr2Provider = votingCor.connect(addr2)

                // Check
                expect((await addr1Provider.getVoter(addr1.address))[0]).to.equal(true);
                expect((await addr1Provider.getVoter(addr2.address))[0]).to.equal(true);
                expect((await addr1Provider.getOneProposal(0))[0]).to.equal('GENESIS');
                expect((await addr1Provider.getOneProposal(3))[0]).to.equal('Proposal 3');

                // Start session voting
                await votingCor.startVotingSession()

                // Create Proposal (addr1)
                await addr1Provider.setVote(1)
                // Check Get Proposal
                expect((await addr1Provider.getOneProposal(1))[1]).to.equal(1);

                // Create Proposal (addr2)
                await addr2Provider.setVote(1)
                // Check Get Proposal
                expect((await addr2Provider.getOneProposal(1))[1]).to.equal(2);


            });
            
            it("should have correct error for vote by no Voters", async () => {
                const { votingCor, addr3 } = await loadFixture(deployFixtureVote)
                const addr3Provider = votingCor.connect(addr3)

                // Start session voting
                await votingCor.startVotingSession()

                // Check if voter no register can't vote
                await expect(addr3Provider.setVote(1))
                    .to.be.revertedWith("You're not a voter")

            });

        })

        describe("Tallied", () => {

            it("should have correct status for dont have tallied", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureTallied)
                const addr1Provider = votingCor.connect(addr1)

                // Check get proposal
                expect((await addr1Provider.getOneProposal(2))[1]).to.equal(2);

                // Check if not good status for tallyVotes
                await expect(votingCor.tallyVotes())
                    .to.be.revertedWith("Current status is not voting session ended")
            });

            it("should have correct tallied", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureTallied)
                const addr1Provider = votingCor.connect(addr1)

                // Check proposal
                expect((await addr1Provider.getOneProposal(2))[1]).to.equal(2);
                
                // Stop session vote
                await votingCor.endVotingSession()
                
                // Tally vote
                votingCor.tallyVotes()

                // Check if a good winning proposal
                expect(Number(await votingCor.winningProposalID())).to.equal(2) // getWinningProposal

            });

        })

        describe("Event", () => {
            it("Event -> VoterRegistered", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureRegisterVoter)

                // Check if event return good value
                await expect(votingCor.addVoter(addr1.address))
                    .to.emit(votingCor, "VoterRegistered")
                    .withArgs(String);
            })
            it("Event -> WorkflowStatusChange", async () => {
                const { votingCor } = await loadFixture(deployFixtureRegisterVoter)

                // Check if event return good value
                await expect(votingCor.startProposalsRegistering())
                    .to.emit(votingCor, "WorkflowStatusChange")
                    .withArgs(0, 1);
            })
            it("Event -> ProposalRegistered", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureProposal)

                // Start registering proposal
                await votingCor.startProposalsRegistering()

                // Check if event return good value
                await expect(votingCor.connect(addr1).addProposal("Proposal 1"))
                    .to.emit(votingCor, "ProposalRegistered")
                    .withArgs(1);
            })
            it("Event -> Voted", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureVote)

                // Start voting session
                await votingCor.startVotingSession()

                // Check if event return good value
                await expect(votingCor.connect(addr1).setVote(1))
                    .to.emit(votingCor, "Voted")
                    .withArgs(String, String);
            })
        })


    })
})