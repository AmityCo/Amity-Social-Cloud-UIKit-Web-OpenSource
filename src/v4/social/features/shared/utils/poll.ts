export function getTotalVoteCount(answers: Amity.PollAnswer[]): number {
  return answers.reduce((total, answer) => total + answer.voteCount, 0);
}

export function getVotePercentage(voteCount: number, totalVoteCount: number): number {
  if (!totalVoteCount) return 0;
  return (voteCount / totalVoteCount) * 100;
}
