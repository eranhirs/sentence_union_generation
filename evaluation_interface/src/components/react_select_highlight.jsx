import React, { useState, useRef, useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { findAllInText, phraseToWords } from '../utils.jsx';
import { HighlightTooltip } from './highlight_tooltip.jsx';
import { repetitionWarningDescription } from './texts.jsx';

class TextPart {
    constructor(start, end, text, isHighlighted, className, tooltip) {
        this.start = start;
        this.end = end;
        this.text = text;
        this.isHighlighted = isHighlighted;
        this.className = className;
        this.tooltip = tooltip;        
    }
}

function ReactSelectHighlight({ text, onChange, highlightedPhrases = null, useIndicesForHighlight = true, readOnly = false }) {
    /*
    param useIndicesForHighlight: When showing highlighted phrases for the original sentence, we use the indices (it would be weird if every "Sunday" in the sentence was highlighted).
                                  However, for showing the highlighted phrases for other sentences, we want to ignore the indices.
    */
    

    let initialTextParts = [new TextPart(0, text.length, text, false)];
    if (highlightedPhrases !== null) {
        for (const highlightedPhrase of highlightedPhrases) {
            if (useIndicesForHighlight) {
                initialTextParts = selectionToHiglightedObjects(highlightedPhrase['start'], highlightedPhrase['end'], initialTextParts, highlightedPhrase['className'], highlightedPhrase['tooltip'])
            } else {
                for (const wordWithRange of phraseToWords(highlightedPhrase['phrase'])) {
                    const word = wordWithRange['word'];
                    for (const range of findAllInText(word, text)) {
                        initialTextParts = selectionToHiglightedObjects(range[0], range[1], initialTextParts, highlightedPhrase['className'], highlightedPhrase['tooltip'] ? [repetitionWarningDescription, highlightedPhrase['tooltip']] : repetitionWarningDescription)
                    }
                }
            }
        }
    }
    const [highlightedObjects, setHighlightedObjects] = useState(initialTextParts);

    // Use ref to container to make sure the selection is of the correct element
    const highlightableContainerRef = useRef(null);    

    function selectionToHiglightedObjects(start, end, textParts, className, tooltip) {
        /*
        Add a selection to existing textParts
        */

        const selectedText = text.substr(start, end - start)

        const newHighlightedObject = new TextPart(start, end, selectedText, true, className, tooltip)

        const higlightedObjectsToRemove = [];
        const higlightedObjectsToAdd = [];            
        for (const highlightedObject of textParts) {
            const intersecting = highlightedObject.start <= newHighlightedObject.end && highlightedObject.end >= newHighlightedObject.start

            // If intersecting, combine the ranges
            if (intersecting) {
                if (highlightedObject.isHighlighted) {
                    higlightedObjectsToRemove.push(highlightedObject);
                    const newStart = Math.min(highlightedObject.start, newHighlightedObject.start);
                    const newEnd = Math.max(highlightedObject.end, newHighlightedObject.end);
                    newHighlightedObject.start = newStart
                    newHighlightedObject.end = newEnd
                    newHighlightedObject.text = text.substr(newStart, newEnd - newStart)
                } else {
                    higlightedObjectsToRemove.push(highlightedObject);
                    const startOffset = newHighlightedObject.start - highlightedObject.start
                    if (startOffset > 0) {
                        const newStart = highlightedObject.start
                        const newEnd = highlightedObject.start + startOffset
                        const newText = text.substr(newStart, newEnd - newStart);
                        
                        higlightedObjectsToAdd.push(new TextPart(newStart, newEnd, newText, false, className, tooltip))
                    }

                    const endOffset = highlightedObject.end - newHighlightedObject.end;
                    if (endOffset > 0) {
                        const newStart = newHighlightedObject.end
                        const newEnd = newHighlightedObject.end + endOffset
                        const newText = text.substr(newHighlightedObject.end, newEnd - newStart);

                        higlightedObjectsToAdd.push(new TextPart(newStart, newEnd, newText, false, className, tooltip))
                    }
                }
            }
        }

        // If not intersecting with anything, just add the range
        const filteredHighlightedObjects = textParts.filter(highlightedObject => !higlightedObjectsToRemove.includes(highlightedObject))
        const newHighlightedObjects = [...filteredHighlightedObjects, ...higlightedObjectsToAdd, newHighlightedObject]
        newHighlightedObjects.sort((a, b) => a.start - b.start)

        return newHighlightedObjects
    }

    function checkSelection(e) {
        if (readOnly !== true) {
            const selection = window.getSelection()
            const range = selection.getRangeAt(0);

            // Make sure the selection is of the correct element
            const isValidSelection = highlightableContainerRef.current == range.startContainer.parentElement.parentElement

            if (isValidSelection) {
                const selectedText = selection.toString();

                if (selectedText.trim() != "") {
                    // Take into consideration that the selection started from a span (startContainer) which has an offset compared to the full text
                    const selectedTextPartStart = parseInt(range.startContainer.parentElement['dataset']['start'])
                    const absoluteSelectionStart = selectedTextPartStart + range.startOffset
                    // endOffset will be wrong if it ends in another text, so better use selection length
                    const absoluteSelectionEnd = absoluteSelectionStart + selectedText.length

                    const newHighlightedObjects = selectionToHiglightedObjects(absoluteSelectionStart, absoluteSelectionEnd, highlightedObjects)

                    // Update internally the highlighted objects
                    setHighlightedObjects(newHighlightedObjects)

                    // Allow for externally updating the highlighted objects
                    onChange(newHighlightedObjects)
                }
            }
        }
        return true;
    }

    function textPartsToHTML(textParts) {
        const items = []
        for (const textPart of textParts) {
            let textPartIdx = 0
            for (const char of textPart.text) {
                let charComponent = char

                if (textPart.tooltip && textPart.isHighlighted) {
                    charComponent = <HighlightTooltip text={char} tooltipText={textPart.tooltip} />
                }      

                items.push(<span className={`${textPart.className} ${textPart.isHighlighted ? "highlight" : ""} highlightable`} data-start={textPart.start + textPartIdx} data-idx={textPartIdx}>
                    {charComponent}
                </span>)
                textPartIdx += 1
            }
        }
        return items
    }
    
    function catchMouseUpEverywhere() {
        /*
        Catch when mouse up is outside of the element, more about it here:
        https://stackoverflow.com/questions/11533098/how-to-catch-mouse-up-event-outside-of-element
        */

        const handleMouseUp = (event) => {
            document.removeEventListener('mouseup', handleMouseUp);
            checkSelection()          
        };
        
        document.addEventListener('mouseup', handleMouseUp);
    }

    return (
        <section key={highlightedPhrases.map(obj => obj.phrase)} ref={highlightableContainerRef} className={`highlightable-container ${readOnly ? '' : 'highlightable'}`} onMouseDown={catchMouseUpEverywhere} onDoubleClick={checkSelection} onMouseUpCapture={checkSelection}>
            {textPartsToHTML(highlightedObjects)}
        </section>
    )
}

export { ReactSelectHighlight };