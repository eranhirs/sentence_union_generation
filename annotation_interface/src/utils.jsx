import React from 'react';
import { diffChars } from 'diff';


function escapeRegExp(string) {
    // See https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function findAllInText(textToSearchFor, textToSearchIn) {
    /*
    finds all ranges of `textToSearchFor` in `textToSearchIn`.
    See https://stackoverflow.com/questions/3410464/how-to-find-indices-of-all-occurrences-of-one-string-in-another-in-javascript
    */

    let ranges = []

    // Searching for "" doesn't make sense & stuck the browser
    if (textToSearchFor != "") {
        // Regex explanation: We are searching for complete words, so \W is used to indicate a character which is not an alpha letter , and we also want to catch cases where it is at the beginning or end of the sentence.
        const regex = new RegExp(`(^|\\W)${escapeRegExp(textToSearchFor)}(\\W|$)`, "gi");
        let result;
        while ( result = regex.exec(textToSearchIn) ) {
            // The +1 is because of the \W, we shouldn't add +1 if it's the beginning of a sentence
            const startIndex = result.index == 0 ? 0 : result.index + 1
            ranges.push([startIndex, startIndex + textToSearchFor.length]);
        }
    }

    return ranges
}


function phraseToWords(phrase) {
    /*
    Very naive split of phrases to words (should work well when text is tokenized)
    */

    const wordsWithRanges = []
    const words = phrase.trim().split(" ")

    // When trimming the phrase, if there is a space at the beginning then there will be an offset later when using word.length
    const numSpacesAtTheBeginningOfString = phrase.search(/\S/)
    
    // Add indices to each word by counting word lengths
    let start_index = 0
    for (const word of words) {
        wordsWithRanges.push({
            "word": word,
            "range": [start_index + numSpacesAtTheBeginningOfString, start_index + numSpacesAtTheBeginningOfString + word.length]
        })
        start_index += word.length + 1
    }

    return wordsWithRanges
}


function diffTexts(one, other, isMaster = false) {
    /*
     Diffs two texts and returns them in an html format
     */


    const diff = diffChars(one, other);
    const fragment = [];
    const colorToUse = isMaster? "master-text-diff" : "turker-text-diff"

    diff.forEach((part) => {
        // Show only original text
        if (!part.removed) {
            const colorClassName = part.added ? colorToUse : 'auto';
            // Add per character
            part.value.split('').map((char) => {
                fragment.push(
                    <span className={`highlightable ${colorClassName}`}>
                        {char}
                    </span>
                )
            })
        }
    });

    return <div className='input-group highlight-within-text-area-container data-text'><section className="highlightable-container">{fragment.map((a) => a)}</section></div>

}


export { findAllInText, phraseToWords, diffTexts };