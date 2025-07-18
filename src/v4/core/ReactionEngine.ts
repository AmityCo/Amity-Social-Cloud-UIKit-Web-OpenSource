import { LiveReactionRepository } from '@amityco/ts-sdk';

export interface ReactionCount {
  reactionName: string;
  count: number;
}
class ReactionEngine {
  processReactions(reactions: Amity.LiveReaction[]): ReactionCount[] {
    // Step 1: Group by reactionName
    const reactionGroups = new Map<string, number>();
    reactions.forEach((reaction) => {
      reactionGroups.set(
        reaction.reactionName,
        (reactionGroups.get(reaction.reactionName) || 0) + 1,
      );
    });

    // Step 2: Convert to ReactionCount array
    const reactionCounts: ReactionCount[] = Array.from(reactionGroups.entries()).map(
      ([name, count]) => ({ reactionName: name, count }),
    );

    // Step 3: Distribute to 5 lanes
    return this.distributeTo5Lanes(reactionCounts);
  }

  private distributeTo5Lanes(reactionCounts: ReactionCount[]): ReactionCount[] {
    const lanes: ReactionCount[] = [];

    // Sort the count descendingly
    const sortedReactions = [...reactionCounts].sort((a, b) => b.count - a.count);

    let remainingLanes = 5;

    for (let i = 0; i < sortedReactions.length && remainingLanes > 0; i++) {
      const reaction = sortedReactions[i];
      const remainingReactions = sortedReactions.length - i;

      // Calculate how many lanes this reaction can occupy
      const minLanesNeeded = Math.min(1, remainingLanes); // อย่างน้อย 1 lane
      const maxLanesAllowed = Math.min(remainingLanes - (remainingReactions - 1), reaction.count);
      const lanesForThisReaction = Math.max(minLanesNeeded, maxLanesAllowed);

      // Distribute the reaction count across the lanes
      const countPerLane = Math.floor(reaction.count / lanesForThisReaction);
      const remainder = reaction.count % lanesForThisReaction;

      for (let j = 0; j < lanesForThisReaction; j++) {
        const count = countPerLane + (j < remainder ? 1 : 0);
        lanes.push({ reactionName: reaction.reactionName, count });
      }

      remainingLanes -= lanesForThisReaction;
    }

    return lanes;
  }
}

// Observable source simulation
export class ReactionObservable {
  private engine = new ReactionEngine();

  private postId: string;

  constructor(postId: string) {
    this.postId = postId;
  }

  subscribe(callback: (lanes: ReactionCount[]) => void): () => void {
    const unsubscriber = LiveReactionRepository.getReactions(this.postId, (data) => {
      callback(this.engine.processReactions(data));
    });
    return () => {
      unsubscriber();
    };
  }
}
