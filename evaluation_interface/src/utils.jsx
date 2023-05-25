import React from 'react';
import { diffChars, diffWords, diffSentences } from 'diff';


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

function rearrangeDiff(diff) {
    /*
    When texts are different, the diff library interchangably show "removed" and "add" for every pair of words which makes it hard to read the text.
    Combine all the subsequent removed together with all the adds.
    */
   
    let newDiff = []
    let stackRemoved = []
    let stackAdded = []
    for (const part of diff) {
        if (part.removed) {
            stackRemoved.push(part)
        } else if (part.added) {
            stackAdded.push(part)
        }
        // Don't break remove / add sequence on a space
        else if (part.value == ' ') {
            stackRemoved.push(part)
            stackAdded.push(part)
        } else {
            newDiff = newDiff.concat(stackRemoved, stackAdded);
            stackRemoved = []
            stackAdded = []
            newDiff.push(part)
        }
    }

    // Add leftover added and removed items
    newDiff = newDiff.concat(stackRemoved, stackAdded);

    return newDiff

}

function diffTexts(one, other, isMaster = false) {
    /*
     Diffs two texts and returns them in an html format
     */


    let diff = diffWords(one, other);
    diff = rearrangeDiff(diff);
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
        } else {
            const colorClassName = 'turker-removed-color'
            // Add per character
            part.value.split('').map((char) => {
                fragment.push(
                    <span className={`highlightable ${colorClassName}`}>
                        {char}
                    </span>
                )
            })
            fragment.push(" ")
        }
    });

    return <div className='input-group data-text'><section className="highlightable-container">{fragment.map((a) => a)}</section></div>

}


export { findAllInText, phraseToWords, diffTexts };