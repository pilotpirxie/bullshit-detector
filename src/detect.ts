import { phrases } from "./phrases";

export type Detected = {
  phrase: string;
  index: number;
};

export function detect({
  text,
  ignorePhrases,
  throwAtCountOrAbove,
  throwOverPercentage,
}: {
  text: string;
  ignorePhrases?: string[];
  throwAtCountOrAbove?: number;
  throwOverPercentage?: number;
}) {
  const phrasesToSearch = ignorePhrases
    ? phrases.filter((phrase) => !ignorePhrases.includes(phrase))
    : phrases;
  const normalizedText = text.toLowerCase().replaceAll("-", " ");
  let detected: Detected[] = [];
  for (const phrase of phrasesToSearch) {
    let detectedPhraseIndex = normalizedText.indexOf(phrase);
    do {
      if (detectedPhraseIndex !== -1) {
        detected.push({ phrase, index: detectedPhraseIndex });
        detectedPhraseIndex = normalizedText.indexOf(
          phrase,
          detectedPhraseIndex + 1,
        );
      }
    } while (detectedPhraseIndex !== -1);
  }

  const totalDetectedLength = detected.reduce(
    (acc, { phrase }) => acc + phrase.length,
    0,
  );

  const percentage = totalDetectedLength / normalizedText.length;
  if (throwAtCountOrAbove && detected.length >= throwAtCountOrAbove) {
    throw new Error("Too many bs phrases detected");
  }

  const count = detected.length;
  if (throwOverPercentage && percentage > throwOverPercentage) {
    throw new Error("Too many bs phrases detected");
  }

  return {
    detected,
    percentage,
    count,
  };
}
