// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Voting is Ownable {
    using Counters for Counters.Counter;

    // Event
    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    event ProposalRegistered(uint proposalId);
    event Voted(address voter, uint proposalId);

    // Manage status
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    // Struct Voters
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    // Struct Proposal
    struct Proposal {
        string description;
        uint voteCount;
    }

    // State Whitelist
    mapping(address => bool) whitelist;
    Counters.Counter private totalWhitelist;
    // State Voters
    mapping(address => Voter) voters;
    // State Proposals
    Proposal[] proposals;
    // mapping (uint => Proposal) proposals;
    // Counters.Counter private totalProposals;

    // List
    WorkflowStatus currentStatus;
    uint public winningProposalId;

    // Initialisation
    constructor() {
        currentStatus = WorkflowStatus.RegisteringVoters;
    }

    // Modifier
    // Check is _address whitelisted
    modifier onlyWhitelisted(address _address) {
        require(whitelist[_address] == true, "You are not whitelisted!");
        _;
    }
    // Check _status is good workflowStatus with currentStatus
    modifier onlyDuringStatus(WorkflowStatus _status) {
        require(currentStatus == _status, "You have invalid workflow status.");
        _;
    }

    // Calcul winner proposal
    function _calcWinner() private {
        uint maxVoteCount = 0;
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > maxVoteCount) {
                maxVoteCount = proposals[i].voteCount;
                winningProposalId = i;
            }
        }
    }

    // Increment WorkflowStatus
    function incWorkflowStatus() public onlyOwner {
        WorkflowStatus lastStatus = currentStatus;

        if (uint(lastStatus) >= 5) {
            currentStatus = WorkflowStatus(0);
        } else if (uint(lastStatus) == 4) {
            _calcWinner();
            currentStatus = WorkflowStatus(uint(currentStatus) + 1);
        } else {
            currentStatus = WorkflowStatus(uint(currentStatus) + 1);
        }

        emit WorkflowStatusChange(lastStatus, currentStatus);
    }

    // Opening registration for Voters
    // | Mod : onlyOwner
    function registeringVoters() public onlyOwner {
        WorkflowStatus lastStatus = currentStatus;
        currentStatus = WorkflowStatus.RegisteringVoters;
        emit WorkflowStatusChange(currentStatus, lastStatus);
    }

    // Start registration Proposal
    // | Mod : onlyOwner
    function proposalsRegistrationStarted() public onlyOwner {
        WorkflowStatus lastStatus = currentStatus;
        currentStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(currentStatus, lastStatus);
    }

    // End registration Proposal
    // | Mod : onlyOwner
    function proposalsRegistrationEnded() public onlyOwner {
        WorkflowStatus lastStatus = currentStatus;
        currentStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(currentStatus, lastStatus);
    }

    // Start session Vote
    // | Mod : onlyOwner
    function votingSessionStarted() public onlyOwner {
        WorkflowStatus lastStatus = currentStatus;
        currentStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(currentStatus, lastStatus);
    }

    // Stop session Vote
    // | Mod : onlyOwner
    function votingSessionEnded() public onlyOwner {
        WorkflowStatus lastStatus = currentStatus;
        currentStatus = WorkflowStatus.VotingSessionEnded;

        // Calc Winner
        _calcWinner();

        emit WorkflowStatusChange(currentStatus, lastStatus);
    }

    // Votes Tallied
    // | Mod : onlyOwner
    function votesTallied() public onlyOwner {
        WorkflowStatus lastStatus = currentStatus;
        currentStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(currentStatus, lastStatus);
    }

    // Get Proposal winning
    // | Mod : onlyDuringStatus
    // | Return : Proposal
    function getWinningProposal()
        public
        view
        onlyDuringStatus(WorkflowStatus.VotesTallied)
        returns (Proposal memory)
    {
        return proposals[winningProposalId];
    }

    // Get Status
    // | Return : WorkflowStatus
    function getStatus() public view returns (WorkflowStatus) {
        return currentStatus;
    }

    // Get Voter
    // | Return : Voter
    function getVoter(address _addr) public view returns (Voter memory) {
        return voters[_addr];
    }

    // Get Proposal
    // | Return : Proposal
    function getProposal(
        uint proposalId
    ) public view returns (Proposal memory) {
        require(proposals.length > proposalId, "The proposal not exist!");
        return proposals[proposalId];
    }

    // Get isWhitelisted
    // | Return : bool
    function isWhitelisted(address _addr) public view returns (bool) {
        return whitelist[_addr];
    }

    // Add new address whitelisted
    // | Mod : onlyDuringStatus(WorkflowStatus) - onlyOwner
    function registerWhitelisted(
        address _addr
    ) public onlyOwner onlyDuringStatus(WorkflowStatus.RegisteringVoters) {
        require(_addr != address(0x00), "Address 0x00... not found");
        require(!whitelist[_addr], "Is already whitelisted!");

        whitelist[_addr] = true;
        totalWhitelist.increment();

        voters[_addr].isRegistered = true;

        emit VoterRegistered(_addr);
    }

    // Add new proposals (string)
    // | Mod : onlyDuringStatus(WorkflowStatus) - onlyWhitelisted(address)
    function newProposal(
        string memory _description
    )
        public
        onlyDuringStatus(WorkflowStatus.ProposalsRegistrationStarted)
        onlyWhitelisted(msg.sender)
    {
        proposals.push(Proposal({description: _description, voteCount: 0}));

        emit ProposalRegistered(proposals.length - 1);
    }

    // Add Voters to proposal
    // | Mod : onlyDuringStatus(WorkflowStatus) - onlyWhitelisted(address)
    function voteOnProposal(
        uint proposalId
    )
        public
        onlyDuringStatus(WorkflowStatus.VotingSessionStarted)
        onlyWhitelisted(msg.sender)
    {
        require(voters[msg.sender].isRegistered, "You dont registred");
        require(!voters[msg.sender].hasVoted, "You have already voted");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = proposalId;

        proposals[proposalId].voteCount++;

        emit Voted(msg.sender, proposalId);
    }
}
