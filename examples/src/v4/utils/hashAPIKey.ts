import { sha256 } from 'js-sha256';

export const hashAPIKey = (apiKey: string) => sha256(apiKey).substring(0, 20);
