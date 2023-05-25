import { findAllInText, phraseToWords } from "../utils";
import { fullMatchDescription } from "./texts";

function markHighlightedPhrasesAsMerged(mergedText, highlightedPhrases) {
    /*
    To encourage the user to use all highlighted phrases, we change the color of those that were already used.
    This function identifies which word of the highlighted phrases were used.
    */

    // Copy highlighted phrases to not change it
    const highlightedPhrasesCopy = JSON.parse(JSON.stringify(highlightedPhrases));

    // Split highlighted phrases to words so we can color each word separately
    const highlightedPhrasesSplitToWords = []

    for (const highlightedPhrase of highlightedPhrasesCopy) {
        const words = phraseToWords(highlightedPhrase['phrase'])
        for (const wordWithRange of words) {
            const word = wordWithRange['word'];
            const range = wordWithRange['range'];
            const anyFound = findAllInText(word, mergedText).length > 0;

            // Create a copy not to change the original highlighted phrase
            const newHighlightedPhrase = JSON.parse(JSON.stringify(highlightedPhrase));
            newHighlightedPhrase.start = highlightedPhrase.start + range[0]
            newHighlightedPhrase.end = highlightedPhrase.start + range[1]

            newHighlightedPhrase['phrase'] = word
            if (anyFound) {
                newHighlightedPhrase['className'] = 'full-highlight'
                newHighlightedPhrase['tooltip'] = fullMatchDescription
                newHighlightedPhrase['status'] = 'integrated'
            } else {
                newHighlightedPhrase['className'] = 'yellow-highlight'
                newHighlightedPhrase['status'] = 'not-integrated'
            }

            highlightedPhrasesSplitToWords.push(newHighlightedPhrase);
        }

    }
    
    return highlightedPhrasesSplitToWords
}

export { markHighlightedPhrasesAsMerged };
