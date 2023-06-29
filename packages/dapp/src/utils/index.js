import JSConfetti from 'js-confetti';
export const confetti = (_i) => {
    const arr = [
        () => new JSConfetti().addConfetti(),
        () => new JSConfetti().addConfetti({
            emojis: ['🌈', '🚀', '💥', '✨', '💫', '🦄'],
        }),
        () => new JSConfetti().addConfetti({
            emojis: ['🇦', '🇱', '🇾', '🇷', '🦄'],
        })
    ]
    if (!_i) _i = Math.floor(Math.random() * (arr.length))

    return arr[_i]()
}

export const workflowStatusSTR = [
    "Registering voters is opened", "Proposal registering is opened",
    "Proposal registering is closed", "Voting session is open",
    "Voting session is closed", "Tally voters"
]
