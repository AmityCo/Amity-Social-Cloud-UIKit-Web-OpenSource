import { AdEngine } from './AdEngine';

export class AdSupplier {
  static #instance: AdSupplier;

  private constructor() {}

  public static get instance(): AdSupplier {
    if (!AdSupplier.#instance) {
      AdSupplier.#instance = new AdSupplier();
    }
    return AdSupplier.#instance;
  }

  recommendedAds({
    ads,
    placement,
    count,
    communityId,
  }: {
    ads: Amity.Ad[];
    placement: Amity.AdPlacement;
    count: number;
    communityId?: string;
  }) {
    // calculate impression age
    const impressionAges = this.#calculateImpressionAges(ads);

    // calculate score for all ads
    const scores = new Map<string, number>();
    ads.forEach((ad) => {
      const relevancy = (ad.targets?.communityIds || []).includes(communityId || '') ? 1 : 0;
      const impressionAge = impressionAges.get(ad.adId);
      if (impressionAge == null) return;
      const score = relevancy + Math.pow(Math.E, 2 * impressionAge);
      scores.set(ad.adId, score);
    });

    return this.#selectAdsByWeightedRandomChoice({ ads, scores, count });
  }

  #calculateImpressionAges(ads: Amity.Ad[]) {
    const recencySortedAds = ads.sort((ad1, ad2) => {
      return AdEngine.instance.getLastSeen(ad2.adId) - AdEngine.instance.getLastSeen(ad1.adId);
    });

    const impressionAges = new Map<string, number>();
    const minLastSeen = AdEngine.instance.getLastSeen(
      recencySortedAds[recencySortedAds.length - 1].adId,
    );
    const maxLastSeen = AdEngine.instance.getLastSeen(recencySortedAds[0].adId);

    if (maxLastSeen === minLastSeen) {
      recencySortedAds.forEach((ad) => {
        impressionAges.set(ad.adId, 1);
      });
    } else {
      recencySortedAds.forEach((ad, index) => {
        const impressionAge = index / recencySortedAds.length;
        impressionAges.set(ad.adId, impressionAge);
      });
    }
    return impressionAges;
  }

  #weightedRandomChoice(weights: number[]) {
    let cumulativeWeight = 0;
    const randomValue = Math.random();

    for (let i = 0; i < weights.length; i++) {
      cumulativeWeight += weights[i];
      if (randomValue < cumulativeWeight) {
        return i;
      }
    }

    return weights.length - 1;
  }

  #selectAdsByWeightedRandomChoice({
    ads: inputAds,
    scores,
    count,
  }: {
    ads: Amity.Ad[];
    scores: Map<string, number>;
    count: number;
  }) {
    const ads = [...inputAds];
    const selectedAds = [];

    while (selectedAds.length < count && ads.length > 0) {
      const totalScore = ads.reduce((acc, ad) => acc + (scores.get(ad.adId) || 0), 0);
      const weights = ads.map((ad) => (scores.get(ad.adId) || 0) / totalScore);

      const likelihoods = weights.map((weight) => weight / weights.reduce((acc, w) => acc + w, 0));
      const selectedAdIndex = this.#weightedRandomChoice(likelihoods);

      selectedAds.push(ads[selectedAdIndex]);
      ads.splice(selectedAdIndex, 1);
    }

    return selectedAds;
  }
}
