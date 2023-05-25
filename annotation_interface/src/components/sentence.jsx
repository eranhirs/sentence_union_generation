import React, { useState, useRef } from 'react';
import { HighlightWithinTextarea, Selection } from 'react-highlight-within-textarea';
import { ReactSelectHighlight } from './react_select_highlight';

const Sentence = ({ title, text, disabled = false, highlighted = false, readOnly = true, onClick = null, highlightedPhrases = [], useIndicesForHighlight = true, setHighlightPhrase = null, mergedText = null }) => {
    const onChange = (textParts) => {
        if (!readOnly) {
            setHighlightPhrase(textParts)
        }
    }

    const inputRef = useRef(null);

    return (
        <section key={[highlightedPhrases.map(obj => obj.phrase), mergedText]} className={`sentence ${onClick != null ? "clickable " : " "}`}>
            <h5 className="card-title">{title}</h5>
            <div className={`input-group highlight-within-text-area-container data-text ${disabled ? "disabled " : " "} ${highlighted ? "highlighted" : " "}`} onClick={() => onClick ? onClick() : " "} ref={inputRef}>
                <ReactSelectHighlight text={text} onChange={onChange} highlightedPhrases={highlightedPhrases} useIndicesForHighlight={useIndicesForHighlight} readOnly={disabled || readOnly} />
            </div>
        </section>
    );
}

export { Sentence };
