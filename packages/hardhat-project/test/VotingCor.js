const {
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect, assert } = require("chai");

// expectRevert, expectEvent
// Utiliser les contexts intelligent
// 

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

    context("Context Default", () => {
        let votingCor, owner, addr1;

        describe('Storage (Default) with before', () => {
                
            before(async () => {
                // Get Contract
                const VotingCor = await ethers.getContractFactory("VotingCor");
                // Deploy Contract
                votingCor = await VotingCor.deploy();
                votingCor.deployed();
                [owner, addr1] = await ethers.getSigners();
            })

            describe('Owner', () => {
                it("Expect: should have correct owner", async () => {
                    // Check is good owner
                    expect(await votingCor.owner()).to.be.hexEqual(owner.address);
                });
                
                it("Expect: should dont have correct owner", async () => {
                    // Check is not good owner
                    expect(await votingCor.owner()).to.be.not.hexEqual(addr1.address);
                });
                
                it("Assert: should have correct owner", async () => {
                    // Check is good owner
                    assert.equal(await votingCor.owner(), owner.address);
                });
            })

            describe('WinningProposalID', () => {
                
                it("Expect: should have correct default winningProposalID", async () => {
                    expect(await votingCor.winningProposalID()).to.be.equal(0);
                });

                it("Assert: should have correct default winningProposalID", async () => {
                    assert.equal(await votingCor.winningProposalID(), 0);
                });
            })

            describe('WorkflowStatus', () => {
                
                it("Expect: should have correct default workflowStatus", async () => {
                    // Check is good owner
                    expect(await votingCor.workflowStatus()).to.be.equal(0);
                });

                it("Assert: should have correct default workflowStatus", async () => {
                    // Check is good owner
                    assert.equal(await votingCor.workflowStatus(), 0);
                });
            })
        });
        
    })

    describe("Deployment", function () {

        describe("Registration", () => {

            it("should have correct registration voter (addr1)", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureRegisterVoter)
                const addr1Providder = votingCor.connect(addr1)

                // Add new voter
                await votingCor.addVoter(addr1.address);

                const voter = await addr1Providder.getVoter(addr1.address)
                // Check if voter is register
                expect(voter[0]).to.be.equal(true);
                expect(voter.isRegistered).to.be.equal(true);
                expect(voter.hasVoted).to.be.equal(false);
                expect(voter.votedProposalId).to.be.equal(0);
            });

            it("should have correct addr2 is not registration to voter", async () => {
                const { votingCor, addr1, addr2 } = await loadFixture(deployFixtureRegisterVoter)
                const addr1Providder = votingCor.connect(addr1)

                // Add new voter
                await votingCor.addVoter(addr1.address);

                const voter = await addr1Providder.getVoter(addr2.address)
                // Check if voter is not register
                expect(voter.isRegistered).to.be.equal(false);
            });

            it("should have correct error if is already register", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureRegisterVoter)

                // Add new voter
                await votingCor.addVoter(addr1.address);

                // Check if voter is already register
                await expect(votingCor.addVoter(addr1.address))
                    .to.be.be.revertedWith("Already registered")
            });

            it("should have correct not getVoter if not voter", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureRegisterVoter)

                // Check if not a voter
                await expect(votingCor.getVoter(addr1.address))
                    .to.be.be.revertedWith("You're not a voter")
            });

            it("should have correct error for not good status", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureRegisterVoter)

                // Status for Create Proposal
                await votingCor.startProposalsRegistering()

                // Check error if not good status for add voter
                await expect(votingCor.addVoter(addr1.address))
                    .to.be.be.revertedWith("Voters registration is not open yet");
            });

        })

        describe("Proposal", () => {

            it("should have correct status for register proposal", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureProposal)
                const addr1Provider = votingCor.connect(addr1)

                // Status for Create Proposal
                await votingCor.startProposalsRegistering()

                // Get Proposal
                const proposal = await addr1Provider.getOneProposal(0)

                // Check if good proposal
                expect(proposal.description).to.be.equal("GENESIS"); // description
                expect(proposal.voteCount).to.be.equal(0); // voteCount

            });

            it("should have correct for add new proposal", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureProposal)
                const addr1Provider = votingCor.connect(addr1)

                // Status for Create Proposal
                await votingCor.startProposalsRegistering()

                // Create Proposal
                await addr1Provider.addProposal("Proposal 1")

                // Get Proposal
                const proposal = await addr1Provider.getOneProposal(1)

                // Check new proposal
                expect(proposal.description).to.be.equal("Proposal 1"); // description
                expect(proposal.voteCount).to.be.equal(0); // voteCount

            });

            it("should have correct status for dont create new proposal", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureProposal)
                const addr1Provider = votingCor.connect(addr1)

                // Check status not ready for register proposal
                await expect(addr1Provider.addProposal("Proposal 1"))
                    .to.be.be.revertedWith("Proposals are not allowed yet")

            });

            it("should have correct status for end to registred new proposal", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureProposal)
                const addr1Provider = votingCor.connect(addr1)

                // Stop status registering proposal
                votingCor.endProposalsRegistering()

                // New status : Create Proposal -> Err
                await expect(addr1Provider.addProposal("Proposal 1"))
                    .to.be.be.revertedWith("Proposals are not allowed yet")

            });

            it("should have correct dont create new proposal empty", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureProposal)
                const addr1Provider = votingCor.connect(addr1)

                // Status for Create Proposal
                await votingCor.startProposalsRegistering()

                // Check if no propose empty proposal
                await expect(addr1Provider.addProposal(""))
                    .to.be.be.revertedWith("Vous ne pouvez pas ne rien proposer")

            });

            it("should have correct error for not good status for start proposals registering", async () => {
                const { votingCor } = await loadFixture(deployFixtureProposal)

                votingCor.startProposalsRegistering()
                // Stop status registering proposal
                votingCor.endProposalsRegistering()

                // Check if no propose empty proposal
                await expect(votingCor.startProposalsRegistering())
                    .to.be.be.revertedWith("Registering proposals cant be started now")

            });

        })

        describe("Vote", () => {

            it("should have correct status is not open vote registration", async () => {
                const { votingCor, addr1, addr2 } = await loadFixture(deployFixtureVote)
                const addr1Provider = votingCor.connect(addr1)

                // Check if not status for vote
                await expect(addr1Provider.setVote(1))
                    .to.be.be.revertedWith("Voting session havent started yet")

            });

            it("should have correct vote registration", async () => {
                const { votingCor, addr1, addr2 } = await loadFixture(deployFixtureVote)
                const addr1Provider = votingCor.connect(addr1)
                const addr2Provider = votingCor.connect(addr2)

                // Start session voting
                await votingCor.startVotingSession()

                // Create Proposal (addr1)
                await addr1Provider.setVote(1)
                // Check Get Proposal
                expect((await addr1Provider.getOneProposal(1))[1]).to.be.equal(1);

                // Create Proposal (addr2)
                await addr2Provider.setVote(1)
                // Check Get Proposal
                expect((await addr2Provider.getOneProposal(1)).voteCount).to.be.equal(2);

            });

            it("should have correct error for vote by already voter", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureVote)
                const addr1Provider = votingCor.connect(addr1)

                // Start session voting
                await votingCor.startVotingSession()
                await addr1Provider.setVote(1)

                // Check if voter no register can't vote
                await expect(addr1Provider.setVote(1))
                    .to.be.be.revertedWith("You have already voted")

            });

            it("should have correct error for vote on proposal not found", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureVote)
                const addr1Provider = votingCor.connect(addr1)

                // Start session voting
                await votingCor.startVotingSession()

                // Check if voter no register can't vote
                await expect(addr1Provider.setVote(7))
                    .to.be.be.revertedWith("Proposal not found")

            });

            it("should have correct error for vote by no Voters", async () => {
                const { votingCor, addr3 } = await loadFixture(deployFixtureVote)
                const addr3Provider = votingCor.connect(addr3)

                // Start session voting
                await votingCor.startVotingSession()

                // Check if voter no register can't vote
                await expect(addr3Provider.setVote(1))
                    .to.be.be.revertedWith("You're not a voter")

            });

        })

        describe("Tallied", () => {

            it("should have correct tallied", async () => {
                const { votingCor } = await loadFixture(deployFixtureTallied)

                // Stop session vote
                await votingCor.endVotingSession()

                // Tally vote
                votingCor.tallyVotes()

                // Check if a good winning proposal
                expect(Number(await votingCor.winningProposalID())).to.be.equal(2) // getWinningProposal

            });

            it("should have not correct status for tallied", async () => {
                const { votingCor } = await loadFixture(deployFixtureTallied)

                // Check if a good winning proposal
                expect(votingCor.tallyVotes())
                    .to.be.be.revertedWith("Current status is not voting session ended") // getWinningProposal

            });

        })

        describe("WorkflowStatus", () => {
            it("should have correct WorkflowStatus ", async () => {
                const { votingCor } = await loadFixture(deployFixtureVote)

                // Check if status is not good for start proposal registering
                expect(await votingCor.workflowStatus()).to.be.equal(2);

            });
            
            it("should have correct error for not good status to startProposalsRegistering", async () => {
                const { votingCor } = await loadFixture(deployFixtureVote)

                // Start session voting
                await votingCor.startVotingSession()
                await votingCor.endVotingSession()

                // Check if status is not good for start proposal registering
                await expect(votingCor.startProposalsRegistering())
                    .to.be.be.revertedWith("Registering proposals cant be started now");

            });

            it("should have correct error for not good status to startProposalsRegistering", async () => {
                const { votingCor } = await loadFixture(deployFixtureVote)

                // Start session voting
                await votingCor.startVotingSession()
                await votingCor.endVotingSession()

                // Check if status is not good for start proposal registering
                await expect(votingCor.startProposalsRegistering())
                    .to.be.be.revertedWith("Registering proposals cant be started now");

            });

            it("should have correct error for not good status for endProposalsRegistering", async () => {
                const { votingCor } = await loadFixture(deployFixtureProposal)

                votingCor.startProposalsRegistering()
                votingCor.endProposalsRegistering()
                votingCor.startVotingSession()

                // Check if no propose empty proposal
                await expect(votingCor.endProposalsRegistering())
                    .to.be.be.revertedWith("Registering proposals havent started yet")

            });

            it("should have correct error for not good status for startVotingSession", async () => {
                const { votingCor } = await loadFixture(deployFixtureVote)

                // Start session voting
                await votingCor.startVotingSession()
                await votingCor.endVotingSession()

                // Check if voter no register can't vote
                await expect(votingCor.startVotingSession())
                    .to.be.be.revertedWith("Registering proposals phase is not finished")

            });

            it("should have correct error for not good status to endVotingSession", async () => {
                const { votingCor } = await loadFixture(deployFixtureRegisterVoter)

                // Status for Create Proposal
                await votingCor.startProposalsRegistering()
                await votingCor.endProposalsRegistering()

                // Check error if not good status for add voter
                await expect(votingCor.endVotingSession())
                    .to.be.be.revertedWith("Voting session havent started yet");
            });

            it("should have correct status for dont have tallied", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureTallied)
                const addr1Provider = votingCor.connect(addr1)

                // Check get proposal
                expect((await addr1Provider.getOneProposal(2)).voteCount).to.be.equal(2);

                // Check if not good status for tallyVotes
                await expect(votingCor.tallyVotes())
                    .to.be.be.revertedWith("Current status is not voting session ended")
            });
        })

        describe("Event", () => {
            it("Event -> VoterRegistered", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureRegisterVoter)

                // Check if event return good value
                await expect(votingCor.addVoter(addr1.address))
                    .to.be.emit(votingCor, "VoterRegistered")
                    .withArgs(addr1.address);
            })

            it("Event -> WorkflowStatusChange startProposalsRegistering", async () => {
                const { votingCor } = await loadFixture(deployFixtureRegisterVoter)

                // Check if event return good value
                await expect(votingCor.startProposalsRegistering())
                    .to.be.emit(votingCor, "WorkflowStatusChange")
                    .withArgs(0, 1);
            })
            
            it("Event -> ProposalRegistered", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureProposal)
                
                votingCor.startProposalsRegistering()

                // Check if event return good value
                await expect(votingCor.connect(addr1).addProposal("Proposal 1"))
                    .to.be.emit(votingCor, "ProposalRegistered")
                    .withArgs(1);
                })
            it("Event -> Voted", async () => {
                const { votingCor, addr1 } = await loadFixture(deployFixtureVote)

                // Start voting session
                await votingCor.startVotingSession()

                // Check if event return good value
                await expect(votingCor.connect(addr1).setVote(1))
                    .to.be.emit(votingCor, "Voted")
                    .withArgs(String, String);
            })
        })

    })
})