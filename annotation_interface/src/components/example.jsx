import React, { useRef, useState } from 'react';
import { readSentencesStepInstruction, chooseSentenceStepInstruction, highlightPhrasesStepInstruction, mergeSentencesStepInstruction } from './texts.jsx';
import { ChooseSentenceStep, HighlightPhrasesStep, MergeSentencesStep, ReadSentencesStep } from './steps.jsx';
import { StepsComponent } from './steps_component.jsx';
import { HighlightTooltip } from './highlight_tooltip.jsx';
import { questionMarkIcon } from './icons.jsx';
import { markHighlightedPhrasesAsMerged } from './submission_data_utils.jsx';

function ListGroupItem({ currStep, step, itemId, onClick }) {
    const activeClass = currStep == step ? "active " : ""

    return (
        <a className={`list-group-item list-group-item-action ${activeClass}`} id={`list-step-${itemId}-list`} data-bs-toggle="list" href={`#list-step-${itemId}`} role="tab" aria-controls="list-step-{itemId}" onClick={() => onClick(step)}>Step {step}</a>
    )
}

function ListItem({ currStep, step, itemId, children }) {
    const activeClass = currStep == step ? "show active " : ""

    return (
        <div className={`tab-pane fade ${activeClass}`} id={`list-step-${itemId}`} role="tabpanel" aria-labelledby={`list-step-${itemId}-list`}>{children}</div>
    )
}

function Example({ exampleId, exampleData, scrollToExampleTop, initialStep=1 }) {
    const [step, setStep] = useState(initialStep);
    const { step1Extra, step2Extra, step3Extra, step4Extra } = exampleData;
    const { masterSubmissionData } = exampleData;
    const { mergedText, chosenSentenceId, highlightedPhrases } = masterSubmissionData || {};
    let { allowedLastStep } = exampleData
    const lastStep = 4;

    if (allowedLastStep == null) {
        allowedLastStep = lastStep;
    }

    const exampleRef = useRef(null);    
    
    const quesitonMarkWithTooltip = <HighlightTooltip text={<small className="text-muted">{questionMarkIcon}</small>} tooltipText={"Click on the numbers to see all the subsequent steps."}></HighlightTooltip>

    const highlightedSentenceId = null
    let highlightedPhrasesCopy = null
    if (highlightedPhrases != undefined) {
        highlightedPhrasesCopy = markHighlightedPhrasesAsMerged(mergedText, highlightedPhrases)
    }
    // The mergedHighlightedPhrases was used to highlight the merged sentence in examples, but it got confusing so was removed
    const mergedHighlightedPhrases = []

    return (
        <section className="example" ref={exampleRef}>
            {step == 1 && allowedLastStep == null && <p className="fs-5">These are the steps you should take to create the merged sentence: {quesitonMarkWithTooltip}</p>}

            {step == 1 && <ReadSentencesStep taskData={exampleData} isExample={true} />}
            {step == 2 && <ChooseSentenceStep taskData={exampleData} setStep={() => {}} setAllowedStep={() => {}} chosenSentenceId={chosenSentenceId} setChosenSentenceId={() => {}} isExample={true} />}
            {step == 3 && <HighlightPhrasesStep taskData={exampleData} chosenSentenceId={chosenSentenceId} highlightedSentenceId={highlightedSentenceId} highlightedPhrases={highlightedPhrases} setHighlightedPhrases={() => {}} isExample={true} />}
            {step == 4 && <MergeSentencesStep taskData={exampleData} mergedText={mergedText} setMergedText={() => {}} highlightedPhrases={highlightedPhrasesCopy} mergedHighlightedPhrases={mergedHighlightedPhrases} chosenSentenceId={chosenSentenceId} feedbackText={null} setFeedbackText={() => {}} isExample={true} />}

            {step == 1 && <div className="step-extra fs-5">{step1Extra}</div>}
            {step == 2 && <div className="step-extra fs-5">{step2Extra}</div>}
            {step == 3 && <div className="step-extra fs-5">{step3Extra}</div>}
            {step == 4 && <div className="step-extra fs-5">{step4Extra}</div>}            
            <StepsComponent step={step} setStep={setStep} numSteps={4} allowedStep={allowedLastStep} componentId={`example-${exampleId}`} isExample={true} onStepClickedCallback={scrollToExampleTop} />
        </section>
    );
}

export { Example };
