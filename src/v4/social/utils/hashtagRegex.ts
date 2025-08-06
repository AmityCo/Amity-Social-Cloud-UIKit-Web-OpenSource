// hashtag with sharp sign
export const hashtagRegex = /(?<![\p{L}\p{N}\p{M}_#])#([\p{L}\p{N}\p{M}_]{1,100})/gu;

// hashtag without sharp sign
export const hashtagTextRegex = /^[\p{L}\p{N}\p{M}_]+$/u;

export const MAX_HASHTAGS = 30; // Maximum number of hashtags allowed in the editor
export const MAX_HASHTAG_LENGTH = 100; // Maximum characters in a hashtag text (excluding #)
