export type SortedPollAnswer = Amity.PollAnswer & { isLeading: boolean };

export function sortPollAnswers(answers: Amity.PollAnswer[]): SortedPollAnswer[] {
  const maxVoteCount = Math.max(0, ...answers.map((answer) => answer.voteCount));

  const sorted = answers
    .map((answer, index) => ({ answer, index }))
    .sort((a, b) => b.answer.voteCount - a.answer.voteCount || a.index - b.index)
    .map(({ answer }) => answer);

  return sorted.map((answer, index) => ({
    ...answer,
    isLeading: maxVoteCount > 0 && index === 0,
  }));
}
