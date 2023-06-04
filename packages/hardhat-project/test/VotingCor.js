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

        const [owner, addr1, addr2] = await ethers.getSigners();

        return { votingCor, owner, addr1, addr2 };
    };

    async function deployFixtureProposal() {
        // Déploiement du contrat
        const VotingCor = await ethers.getContractFactory("VotingCor");
        const votingCor = await VotingCor.deploy();
        await votingCor.deployed();

        const [owner, addr1, addr2] = await ethers.getSigners();

        await votingCor.addVoter(addr1.address);

        return { votingCor, owner, addr1, addr2 };
    };

    async function deployFixtureVote() {
        // Déploiement du contrat
        const VotingCor = await ethers.getContractFactory("VotingCor");
        const votingCor = await VotingCor.deploy();
        await votingCor.deployed();

        const [owner, addr1, addr2, addr3] = await ethers.getSigners();

        // Create 2 Voters
        await votingCor.addVoter(addr1.address);
        await votingCor.addVoter(addr2.address);

        await votingCor.startProposalsRegistering()

        // Create 3 Proposals
        await votingCor.connect(addr1).addProposal("Proposal 1")
        await votingCor.connect(addr2).addProposal("Proposal 2")
        await votingCor.connect(addr1).addProposal("Proposal 3")

        await votingCor.endProposalsRegistering()

        return { votingCor, owner, addr1, addr2, addr3 };
    };

    async function deployFixtureTallied() {
        // Déploiement du contrat
        const VotingCor = await ethers.getContractFactory("VotingCor");
        const votingCor = await VotingCor.deploy();
        await votingCor.deployed();

        const [owner, addr1, addr2, addr3] = await ethers.getSigners();

        // Create 2 Voters
        await votingCor.addVoter(addr1.address);
        await votingCor.addVoter(addr2.address);

        await votingCor.startProposalsRegistering()

        // Create 3 Proposals
        await votingCor.connect(addr1).addProposal("Proposal 1")
        await votingCor.connect(addr2).addProposal("Proposal 2")
        await votingCor.connect(addr1).addProposal("Proposal 3")

        await votingCor.endProposalsRegistering()
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
                expect(await votingCor.owner()).to.equal(owner.address);
            });

            it("should have correct registration", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureRegisterVoter)
                const addr1Providder = votingCor.connect(addr1)

                await votingCor.addVoter(addr1.address);

                expect((await addr1Providder.getVoter(addr1.address))[0]).to.equal(true);
            });

            it("should have correct addr2 is not registration", async () => {
                const { votingCor, addr1, addr2 } = await loadFixture(deployFixtureRegisterVoter)
                const addr1Providder = votingCor.connect(addr1)

                await votingCor.addVoter(addr1.address);

                expect((await addr1Providder.getVoter(addr2.address))[0]).to.equal(false);
            });

            it("should have correct error if is already register", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureRegisterVoter)

                await votingCor.addVoter(addr1.address);

                // Not voter
                await expect(votingCor.addVoter(addr1.address))
                    .to.be.revertedWith("Already registered")
            });

            it("should have correct not getVoter if not Voter", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureRegisterVoter)

                // Not voter
                await expect(votingCor.getVoter(addr1.address))
                    .to.be.revertedWith("You're not a voter")
            });

        })

        describe("Proposal", () => {

            it("should have correct status for register proposal", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureProposal)
                const addr1Provider = votingCor.connect(addr1)

                // Check
                expect((await addr1Provider.getVoter(addr1.address))[0]).to.equal(true);

                // Status for Create Proposal
                await votingCor.startProposalsRegistering()

                // Get Proposal
                const proposal = await addr1Provider.getOneProposal(0)

                expect(proposal[0]).to.equal("GENESIS"); // description
                expect(proposal[1]).to.equal(0); // voteCount

            });

            it("should have correct add new proposal", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureProposal)
                const addr1Provider = votingCor.connect(addr1)

                // Check
                expect((await addr1Provider.getVoter(addr1.address))[0]).to.equal(true);

                // Status for Create Proposal
                await votingCor.startProposalsRegistering()

                // Create Proposal
                await addr1Provider.addProposal("Proposal 1")

                // Get Proposal
                const proposal = await addr1Provider.getOneProposal(1)

                expect(proposal[0]).to.equal("Proposal 1"); // description
                expect(proposal[1]).to.equal(0); // voteCount

            });

            it("should have correct dont create new proposal", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureProposal)
                const addr1Provider = votingCor.connect(addr1)

                // New status : Create Proposal -> Err
                await expect(addr1Provider.addProposal("Proposal 1"))
                    .to.be.revertedWith("Proposals are not allowed yet")

            });

            it("should have correct dont create new proposal empty", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureProposal)
                const addr1Provider = votingCor.connect(addr1)

                // Status for Create Proposal
                await votingCor.startProposalsRegistering()

                // New status : Create Proposal -> Err
                await expect(addr1Provider.addProposal(""))
                    .to.be.revertedWith("Vous ne pouvez pas ne rien proposer")

            });

            it("should have correct status for end to registred new proposal", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureProposal)
                const addr1Provider = votingCor.connect(addr1)

                votingCor.endProposalsRegistering()

                // New status : Create Proposal -> Err
                await expect(addr1Provider.addProposal("Proposal 1"))
                    .to.be.revertedWith("Proposals are not allowed yet")

            });
        })

        describe("Vote", () => {

            it("should have correct status is note open vote registration", async () => {
                const { votingCor, addr1, addr2 } = await loadFixture(deployFixtureVote)
                const addr1Provider = votingCor.connect(addr1)

                // Check
                expect((await addr1Provider.getVoter(addr1.address))[0]).to.equal(true);
                expect((await addr1Provider.getVoter(addr2.address))[0]).to.equal(true);
                expect((await addr1Provider.getOneProposal(0))[0]).to.equal('GENESIS');
                expect((await addr1Provider.getOneProposal(3))[0]).to.equal('Proposal 3');

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

                // // Create Proposal
                await addr1Provider.setVote(1)
                // // Get Proposal
                expect((await addr1Provider.getOneProposal(1))[1]).to.equal(1);

                // // Create Proposal
                await addr2Provider.setVote(1)
                // // Get Proposal
                expect((await addr2Provider.getOneProposal(1))[1]).to.equal(2);


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

                // // Create Proposal
                await addr1Provider.setVote(1)
                // // Get Proposal
                expect((await addr1Provider.getOneProposal(1))[1]).to.equal(1);

                // // Create Proposal
                await addr2Provider.setVote(1)
                // // Get Proposal
                expect((await addr2Provider.getOneProposal(1))[1]).to.equal(2);


            });

            it("should have correct error for vote by no Voters", async () => {
                const { votingCor, addr3 } = await loadFixture(deployFixtureVote)
                const addr3Provider = votingCor.connect(addr3)

                // Start session voting
                await votingCor.startVotingSession()

                await expect(addr3Provider.setVote(1))
                    .to.be.revertedWith("You're not a voter")

            });

        })

        describe("Tallied", () => {

            it("should have noy correct status for tallied", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureTallied)
                const addr1Provider = votingCor.connect(addr1)

                // Check
                expect((await addr1Provider.getOneProposal(2))[1]).to.equal(2);

                votingCor.tallyVotes()

                await expect(votingCor.tallyVotes())
                    .to.be.revertedWith("Current status is not voting session ended")
            });

            it("should have correct tallied", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureTallied)
                const addr1Provider = votingCor.connect(addr1)

                // Check
                expect((await addr1Provider.getOneProposal(2))[1]).to.equal(2);
                
                await votingCor.endVotingSession()
                
                votingCor.tallyVotes()

                expect(Number(await votingCor.winningProposalID())).to.equal(2) // getWinningProposal

            });

            // it("should have correct proposal winning public", async () => {
            //     const { voting, addr1, addr3 } = await loadFixture(deployFixtureTallied)

            //     expect(await voting.isWhitelisted(addr1.address)).to.equal(true);

            //     voting.incWorkflowStatus() // Stop Session Vote
            //     voting.incWorkflowStatus() // Vote Tallied
            //     expect(await voting.getStatus()).to.equal(5);

            //     const proposalWin = await voting.connect(addr3).getWinningProposal()

            //     expect(proposalWin[0]).to.equal("Proposal 2") // getWinningProposal

            // });

            // it("should have correct status end proposal", async () => {
            //     const { voting } = await loadFixture(deployFixtureTallied)
            //     voting.votingSessionEnded() // Stop Session Vote
            //     expect(await voting.getStatus()).to.equal(4);
            //     voting.incWorkflowStatus() // Vote Tallied
            //     expect(await voting.getStatus()).to.equal(5);

            // });

        })

        describe("Event", () => {
            it("VoterRegistered:event", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureRegisterVoter)

                await expect(votingCor.addVoter(addr1.address))
                    .to.emit(votingCor, "VoterRegistered")
                    .withArgs(String);
            })
            it("WorkflowStatusChange:event", async () => {
                const { votingCor } = await loadFixture(deployFixtureRegisterVoter)

                await expect(votingCor.startProposalsRegistering())
                    .to.emit(votingCor, "WorkflowStatusChange")
                    .withArgs(0, 1);
            })
            it("ProposalRegistered:event", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureProposal)

                await votingCor.startProposalsRegistering()

                await expect(votingCor.connect(addr1).addProposal("Proposal 1"))
                    .to.emit(votingCor, "ProposalRegistered")
                    .withArgs(1);
            })
            it("Voted:event", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureVote)

                await votingCor.startVotingSession()

                await expect(votingCor.connect(addr1).setVote(1))
                    .to.emit(votingCor, "Voted")
                    .withArgs(String, String);
            })
        })


    })
})