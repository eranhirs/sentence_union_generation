import React, { useState, useRef, useEffect } from 'react';
import { readSentencesStepInstruction, chooseSentenceStepInstruction, highlightPhrasesStepInstruction, mergeSentencesStepInstruction, contradictingInformationDescription, newInformationDescription, entailmentDescription, entailingInformationDescription, fullMatchDescription, partialMatchDescription, noMatchDescription, compareResultsStepInstruction } from './texts.jsx';
import { Sentence } from './sentence.jsx'
import { Directions } from "./core_components.jsx";
import { Modal } from 'bootstrap';
import { diffTexts, findAllInText, phraseToWords } from '../utils.jsx';
import { trashIcon } from './icons.jsx';
import { HighlightTooltip } from './highlight_tooltip.jsx';
import { ShowTipsComponent } from './show_tips_component.jsx';
import { Alert } from 'react-bootstrap';
import { FeedbackComponent } from './feedback_component.jsx';
import { InstructionsButton } from './buttons.jsx';
import { markHighlightedPhrasesAsMerged } from './submission_data_utils.jsx';


function ReadSentencesStep({ taskData, showReadInstructions = false, isExample=false, setShowReadInstructions=null, onInstructionsClicked=null }) {
    const { sentence1Text, sentence2Text } = taskData;
    const sentence1 = <Sentence title="Sentence 1" text={sentence1Text} />
    const sentence2 = <Sentence title="Sentence 2" text={sentence2Text} />
    
    return (
        <div className="row">
            <div className="col-12 fs-5">
                {showReadInstructions && <Alert onClose={() => setShowReadInstructions(false)} dismissible>Tip: You should first read the instructions and examples, you can see them by clicking the Instructions button below.</Alert>}
                <Directions title={<span>Step 1: Reading the text <ShowTipsComponent isExample={isExample} showReadInstructions={showReadInstructions} setShowReadInstructions={setShowReadInstructions}/></span>}>
                    {readSentencesStepInstruction}
                </Directions>
            </div>
            <div className="col-12">
                <section>
                    {sentence1}
                    {sentence2}
                </section>
            </div>
        </div>
    )
}

function ChooseSentenceStep({ taskData, setStep, setAllowedStep, chosenSentenceId, setChosenSentenceId, isExample = false, isTrainingPhase = false }) {
    const { sentence1Text, sentence2Text } = taskData;

    let chooseSentence = function(chosenSentenceId) {
        continueToNextStep();
        setChosenSentenceId(chosenSentenceId);
    }

    function continueToNextStep() {
        setAllowedStep(4); 
        setStep(3);
    }

    let trainingNoticeElement = null
    if (isTrainingPhase) {
        trainingNoticeElement = <Alert onClick={continueToNextStep} className="training-phase-alert">You are in the training phase, so we already chose Sentence {chosenSentenceId} for you. Please click here to continue to Step 3.</Alert>
        chooseSentence = null;
    }

    const sentence1 = <Sentence title="Sentence 1" text={sentence1Text} onClick={() => chooseSentence(1)} highlighted={chosenSentenceId==1} disabled={isTrainingPhase} />
    const sentence2 = <Sentence title="Sentence 2" text={sentence2Text} onClick={() => chooseSentence(2)} highlighted={chosenSentenceId==2} disabled={isTrainingPhase} />

    return (
        <div className="row">
            <div className="col-12 fs-5">
                <Directions title="Step 2: Choosing the more comprehensive base sentence">
                    {chooseSentenceStepInstruction}
                </Directions>
            </div>
            <div className="col-md-12">
                {sentence1}
            </div>
            <div className="col-md-12">
                {sentence2}
            </div>
            <div className="col-md-12">
                {trainingNoticeElement}
            </div>
        </div>
    )
}

function HighlightPhrasesStep({ taskData, chosenSentenceId, highlightedSentenceId, highlightedPhrases, setHighlightedPhrases, isExample = false, showReadInstructions = false, setShowReadInstructions=null }) {
    const { sentence1Text, sentence2Text } = taskData;

    const sentence1 = <Sentence title="Sentence 1" text={sentence1Text} disabled={chosenSentenceId==1} highlighted={chosenSentenceId==1} highlightedPhrases={highlightedPhrases} useIndicesForHighlight={chosenSentenceId != 1} setHighlightPhrase={setHighlightPhrase} readOnly={isExample} />
    const sentence2 = <Sentence title="Sentence 2" text={sentence2Text} disabled={chosenSentenceId==2} highlighted={chosenSentenceId==2} highlightedPhrases={highlightedPhrases} useIndicesForHighlight={chosenSentenceId != 2} setHighlightPhrase={setHighlightPhrase} readOnly={isExample} />

    function setHighlightPhrase(textParts) {
        const highlightedPhrases = []
        for (const textPart of textParts) {
            if (textPart.isHighlighted) {
                highlightedPhrases.push({
                    "phrase": textPart.text,
                    "start": textPart.start,
                    "end": textPart.end,
                    "sentenceId": highlightedSentenceId
                })
            }
        }
        setHighlightedPhrases(highlightedPhrases)
    }

    function removeHighlightedPhrase(highlightedPhraseObject) {
        setHighlightedPhrases(highlightedPhrases.filter(object => object != highlightedPhraseObject))
    }
    
    const highlightedPhrasesListComponent = <section className="highlighted-phrases-list">Highlighted phrases: {highlightedPhrases.length > 0 && highlightedPhrases.map(function(object, i) {
            return <span className="highlighted-phrase-list-component highlight data-text" onClick={() => removeHighlightedPhrase(object)}><HighlightTooltip text={<span>{object['phrase']} <span className="trash-icon">{trashIcon}</span></span>} tooltipText="Click to delete the highlight" /></span>
        }).reduce((prev, curr) => [prev, ", ", curr])}</section>


    return (
        <div className="row">
            <div className="col-12 fs-5">
            {showReadInstructions && <Alert onClose={() => setShowReadInstructions(false)} dismissible>Tip: You should read the elaborated instructions for the highlight step (Step 3), you can see them by clicking the Instructions button below.</Alert>}
                <Directions title={<span>Step 3: Highlighting additional information <ShowTipsComponent isExample={isExample} showReadInstructions={showReadInstructions} setShowReadInstructions={setShowReadInstructions}/></span>}>
                    {highlightPhrasesStepInstruction}
                </Directions>
            </div>
            <div className="col-12">
                {sentence1}
                {!isExample && chosenSentenceId != 1 && highlightedPhrasesListComponent}
                {sentence2}
                {!isExample && chosenSentenceId != 2 && highlightedPhrasesListComponent}                
            </div>
        </div>
    )
}


function MergeSentencesStep({ taskData, mergedText, setMergedText, highlightedPhrases, mergedHighlightedPhrases, chosenSentenceId, feedbackText, setFeedbackText, skipped, setSkipped, isExample = false, showReadInstructions = false, setShowReadInstructions=null }) {
    const { sentence1Text, sentence2Text } = taskData;

    const sentence1 = <Sentence title="Sentence 1" text={sentence1Text} disabled={true} highlighted={chosenSentenceId==1} highlightedPhrases={highlightedPhrases} useIndicesForHighlight={chosenSentenceId != 1} mergedText={mergedText} />
    const sentence2 = <Sentence title="Sentence 2" text={sentence2Text} disabled={true} highlighted={chosenSentenceId==2} highlightedPhrases={highlightedPhrases} useIndicesForHighlight={chosenSentenceId != 2} mergedText={mergedText} />

    const mergedSentenceTextArea = <section>
        <h5 className="card-title">Merged sentence</h5>
        <textarea
            className="data-text"
            onChange={(e) => setMergedText(e.target.value)}
            placeholder="Please complete here the merged sentence"
            value={mergedText}
            disabled={skipped}
        />
    </section>

    const mergedSentenceHighlightable = <Sentence title="Merged sentence" text={mergedText} disabled={false} highlighted={false} useIndicesForHighlight={true} highlightedPhrases={mergedHighlightedPhrases} setHighlightPhrase={() => {}} readOnly={true} />

    const feedbackTextComponent = <FeedbackComponent feedbackText={feedbackText} setFeedbackText={setFeedbackText} />

    return (
        <div className="row merge-sentences-step" key={highlightedPhrases}>
            <div className="col-12 fs-5">
                {showReadInstructions && <Alert onClose={() => setShowReadInstructions(false)} dismissible>Tip: You should read the elaborated instructions for the merge step (Step 4), you can see them by clicking the Instructions button below.</Alert>}
                <Directions title={<span>Step 4: Writing the merged sentence <ShowTipsComponent isExample={isExample} showReadInstructions={showReadInstructions} setShowReadInstructions={setShowReadInstructions}/></span>}>
                    {mergeSentencesStepInstruction}
                </Directions>
            </div>
            <div className="col-12">
                {sentence1}
                {sentence2}
                {!isExample && mergedSentenceTextArea}
                {isExample && mergedSentenceHighlightable}
                {!isExample && feedbackTextComponent}
            </div>
        </div>
    )
}

function CompareResultsStep({ submissionData, masterSubmissionData, isEvaluationPhase, sentence1Text, sentence2Text }) {

    // The number is meaningless to workers so we should hide it, also they should be directed to use a specific base sentence like the master annotatio
    const showChosenSentenceIdComparison = isEvaluationPhase

    let submissionChosenSentence = "Skipped"
    let submissionHighlightedSentence = "Skipped"
    if (!submissionData.skipped) {
        const submissionHighlightedPhrasesCopy = markHighlightedPhrasesAsMerged(submissionData.mergedText, submissionData.highlightedPhrases);
        submissionChosenSentence = <Sentence text={submissionData.chosenSentenceId==1 ? sentence1Text : sentence2Text} readOnly={true} highlightedPhrases={submissionData.highlightedPhrases} highlighted={true} useIndicesForHighlight={false} mergedText={submissionData.mergedText} />
        submissionHighlightedSentence = <Sentence text={submissionData.chosenSentenceId==1 ? sentence2Text : sentence1Text} highlightedPhrases={submissionHighlightedPhrasesCopy} useIndicesForHighlight={true} readOnly={true} mergedText={submissionData.mergedText} />
    }

    let masterSubmissionChosenSentence = "Skipped"
    let masterSubmissionHighlightedSentence = "Skipped"
    if (!masterSubmissionData.skipped) {
        const masterHighlightedPhrasesCopy = markHighlightedPhrasesAsMerged(masterSubmissionData.mergedText, masterSubmissionData.highlightedPhrases);
        masterSubmissionChosenSentence = <Sentence text={masterSubmissionData.chosenSentenceId==1 ? sentence1Text : sentence2Text} readOnly={true} highlighted={true} highlightedPhrases={masterSubmissionData.highlightedPhrases} useIndicesForHighlight={false} mergedText={masterSubmissionData.mergedText} />
        masterSubmissionHighlightedSentence = <Sentence text={masterSubmissionData.chosenSentenceId==1 ? sentence2Text : sentence1Text} disabled={false} highlighted={false} highlightedPhrases={masterHighlightedPhrasesCopy} useIndicesForHighlight={true} readOnly={true} mergedText={masterSubmissionData.mergedText} />
    }

    return (
        <div className="row">
            <div className="col-12 fs-5">
                <Directions title={<span>Step 5: Evaluating yourself (only for the training phase)</span>}>
                    {compareResultsStepInstruction}
                </Directions>
            </div>
            <table className="table table-light table-hover table-bordered align-middle">
                <thead>
                    <tr>
                        <th scope="col">
                        </th>
                        <th scope="col">
                            Yours
                        </th>
                        <th scope="col">
                            Trained Annotators
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">
                            Chosen base sentence
                        </th>
                        <td>
                            {submissionChosenSentence}
                        </td>
                        <td>
                            {masterSubmissionChosenSentence}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            Other sentence highlights
                        </th>
                        <td>
                            {submissionHighlightedSentence}
                        </td>
                        <td>
                            {masterSubmissionHighlightedSentence}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            Merged Sentence
                        </th>
                        <td>
                            {submissionData.skipped ? "Skipped" : masterSubmissionData.skipped ? <div className='input-group highlight-within-text-area-container data-text'>{submissionData.mergedText}</div> : diffTexts(masterSubmissionData.mergedText, submissionData.mergedText)}
                        </td>
                        <td>
                            {masterSubmissionData.skipped ? "Skipped" : submissionData.skipped ? <div className='input-group highlight-within-text-area-container data-text'>{masterSubmissionData.mergedText}</div> : diffTexts(submissionData.mergedText, masterSubmissionData.mergedText, true)}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}


export { ReadSentencesStep, ChooseSentenceStep, HighlightPhrasesStep, MergeSentencesStep, CompareResultsStep };
