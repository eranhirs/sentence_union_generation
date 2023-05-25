import { Modal } from 'bootstrap';
import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { SubmissionData } from '../models.jsx';
import { examples } from "./../examples.jsx";
import { InstructionsButton, SkipButton, SubmitButton } from './buttons.jsx';
import { FeedbackComponent } from './feedback_component.jsx';
import { InstructionsModal } from './instructions_modal.jsx';
import { NoticeModal } from './notice_modal.jsx';
import { SkipValidationModal } from './skip_validation_modal.jsx';
import { ChooseSentenceStep, CompareResultsStep, HighlightPhrasesStep, MergeSentencesStep, ReadSentencesStep } from './steps.jsx';
import { StepsComponent } from './steps_component.jsx';
import { markHighlightedPhrasesAsMerged } from './submission_data_utils.jsx';
import { SubmitValidationModal } from './submit_validation_modal.jsx';
import { highlightTooltip } from './texts.jsx';


const COMPARISON_SCREEN_STEP = 5;


function Task({ taskData, isOnboarding, onSubmit, onError }) {
    const { sentence1Text, sentence2Text } = taskData;
    const { previousSubmissionData, masterSubmissionData } = taskData;

    // Training phase is when there is no previous submission, but there is a master submission
    const isTrainingPhase = previousSubmissionData == undefined && masterSubmissionData != undefined;
    const isProdTaggingPhase = previousSubmissionData == undefined && masterSubmissionData == undefined;

    // When showing the turkers their work, we save the assignment to a file. We want to avoid showing the turker confusing metadata.
    const { savedAssignment } = taskData;
    
    let [allowedStep, setAllowedStep] = useState(previousSubmissionData ? 5 : 2);
    const [chosenSentenceId, setChosenSentenceId] = useState(previousSubmissionData ? previousSubmissionData['chosenSentenceId'] : null);
    const [highlightedPhrases, setHighlightedPhrases] = useState(previousSubmissionData ? previousSubmissionData['highlightedPhrases'] : []);
    const [skipped, setSkipped] = useState(previousSubmissionData ? previousSubmissionData['skipped'] : false);
    // Evaluation phase is when there are both a previous submission and a master submission
    const isEvaluationPhase = previousSubmissionData != undefined && masterSubmissionData != undefined;

    let lastStep = 4;
    let lastStepShown = lastStep
    if (masterSubmissionData != undefined) {
        lastStep = COMPARISON_SCREEN_STEP;

        // Show last step only to evaluator (worker's will just be transitioned to last step after submitting)
        if (isEvaluationPhase) {
            lastStepShown = lastStep
        }
    }
    // Start from last step if evaluation step
    const [step, setStep] = useState(lastStepShown == COMPARISON_SCREEN_STEP ? COMPARISON_SCREEN_STEP : 1);

    // Comparison screen is when the worker is in training phase and in the comparison screen step
    const isComparisonScreen = isTrainingPhase && step == COMPARISON_SCREEN_STEP;

    let submitAction = null;
    if (isTrainingPhase) {
        if (!isComparisonScreen) {
            submitAction = "Training"
        } else {
            submitAction = "Comparison"
        }
    } else {
        submitAction = "Submit"
    }

    const [ mergedText, setMergedText ] = useState(previousSubmissionData ? previousSubmissionData['mergedText'] : "");
    const [ feedbackText, setFeedbackText ] = useState(previousSubmissionData ? previousSubmissionData['feedbackText'] || "" : "");
    // When retagging / evaluating turkers, the following fields are used to prefill information about the annotation
    const [ exampleId, setExampleId ] = useState(taskData['exampleId'] || null);
    const [ originalAnnotator, setOriginalAnnotator ] = useState(taskData['originalAnnotator'] || taskData['workerId']);
    const [ originalAnnotationIteration, setOriginalAnnotationIteration ] = useState(taskData['annotationIteration']);
    const [ assignmentId, setAssignmentId ] = useState(taskData['assignmentId'] || null);
    const [ reviewStatus, setReviewStatus ] = useState(taskData['reviewStatus']);
    const [ originalSkip, setOriginalSkip ] = useState(previousSubmissionData ? previousSubmissionData['skipped'] : null);
    const [ agreement, setAgreement ] = useState(taskData['agreementScore'] != undefined ? taskData['agreementScore'] : null);
    const [ agreementUpdated, setAgreementUpdated ] = useState(taskData['agreementUpdated'] || null);

    if (isTrainingPhase) {
        // Fix the chosen sentence id if we are in training
        setChosenSentenceIdAndResetNextSteps(masterSubmissionData['chosenSentenceId']);
    }

    function setChosenSentenceIdAndResetNextSteps(currSentenceId) {
        /*
        If the chosen sentence id changed, we now want to reset the next steps.
        */

        // Continue only if there was an actual change to the chosen sentence id
        if (currSentenceId != chosenSentenceId) {
            setChosenSentenceId(currSentenceId)

            resetStepThree();
            resetStepFour(currSentenceId);
        }
    }

    function resetStepThree() {
        // Reset highlighted phrases
        setHighlightedPhrases([])
    }

    function resetStepFour(currSentenceId) {
        // Set merged text to the current sentence id
        const { sentence1Text, sentence2Text } = taskData;
        const startingSentenceText = currSentenceId == 1 ? sentence1Text : sentence2Text
        setMergedText(startingSentenceText)        
    }

    function onSubmitWithTrainingValidation(submissionData) {
        // In training phase, we want to transition to worker to the comparison screen
        if (isTrainingPhase) {
            noticeModal.toggle();
        } else {
            onSubmitWithLog(submissionData)
        }
    }

    function onSubmitWithLog(submissionData) {
        console.log(submissionData)
        onSubmit(submissionData)
    }

    const submissionData = new SubmissionData(chosenSentenceId, highlightedPhrases, mergedText, feedbackText, taskData, skipped );

    const highlightedPhrasesCopy = markHighlightedPhrasesAsMerged(mergedText, highlightedPhrases)

    const highlightsNotIntegrated = highlightedPhrasesCopy.filter((highlightedPhrases) => highlightedPhrases['status'] == 'not-integrated')
    const highlightsWithoutStartOrEndExist = highlightedPhrasesCopy.filter((highlightPhrases) => isNaN(highlightPhrases['start']) || isNaN(highlightPhrases['end']))
    const noHighlights = highlightedPhrasesCopy.length === 0
    const mergedSentenceUnchanged = mergedText == sentence1Text || mergedText == sentence2Text

    // Validation
    const isMergedTextEmpty = !skipped && mergedText.trim() == "";
    const isMergedSentenceUnchanged = !skipped && mergedSentenceUnchanged
    const isAllHighlightsIntegrated = !skipped && highlightsNotIntegrated.length > 0
    const isAllHighlightsWithStartAndEnd = !skipped && highlightsWithoutStartOrEndExist.length > 0
    const isSentenceChangedButNoHighlights = !skipped && noHighlights && !mergedSentenceUnchanged
    const isFeedbackEmpty = feedbackText.trim() == ""
    const isSubmitDisabled = isFeedbackEmpty && (isMergedTextEmpty || isMergedSentenceUnchanged || isSentenceChangedButNoHighlights || isAllHighlightsWithStartAndEnd || skipped)
    const shouldShowValidationModal = isMergedTextEmpty || isMergedSentenceUnchanged || isSentenceChangedButNoHighlights || isAllHighlightsIntegrated || isAllHighlightsWithStartAndEnd

    // Modals
    const [ skipValidationModal, setSkipValidationModal ] = useState(null);
    const [ submitValidationModal, setSubmitValidationModal ] = useState(null);    
    const [ noticeModal, setNoticeModal ] = useState(null);    
    const submitValidationModalComponent = <SubmitValidationModal setModal={setSubmitValidationModal} onSubmit={onSubmitWithTrainingValidation} submissionData={submissionData} submitAction={submitAction} skipped={skipped} highlightTooltip={highlightTooltip} isSubmitDisabled={isSubmitDisabled} isMergedTextEmpty={isMergedTextEmpty} isMergedSentenceUnchanged={isMergedSentenceUnchanged} isSentenceChangedButNoHighlights={isSentenceChangedButNoHighlights} isAllHighlightsIntegrated={isAllHighlightsIntegrated} isAllHighlightsWithStartAndEnd={isAllHighlightsWithStartAndEnd} />
    const skipValidationModalComponent = <SkipValidationModal setModal={setSkipValidationModal} onSubmit={onSubmitWithTrainingValidation} isSubmitDisabled={isSubmitDisabled} isFeedbackEmpty={isFeedbackEmpty} feedbackText={feedbackText} setFeedbackText={setFeedbackText} submitAction={submitAction} submissionData={submissionData} />
    const noticeModalComponent = <NoticeModal onContinueClicked={() => setStep(COMPARISON_SCREEN_STEP)} setModal={setNoticeModal} />

    function onSubmitClicked(submissionData, skip=false) {
        const didUserPassValidation = isComparisonScreen
        if (didUserPassValidation) {
            onSubmitWithLog(submissionData)
        }

        if (skip == false) {
            submissionData.skipped = false;  // Update because submission is already initialized
            setSkipped(false);  // Update in case submission changes (e.g., feedback added)
            if (shouldShowValidationModal) {
                submitValidationModal.toggle()
            } else {
                onSubmitWithTrainingValidation(submissionData)
            }
        } else {
            submissionData.skipped = true;  // Update because submission is already initialized
            setSkipped(true);  // Update in case submission changes (e.g., feedback added)
            skipValidationModal.toggle()
        }
    }

    function onInstructionsClicked() {
        instructionsModal.toggle()
    }

    // We want to malformed highlights by not allowing to continue to step 4
    if (allowedStep >= 4 && isAllHighlightsWithStartAndEnd) {
        allowedStep = 3
    }

    // we are highlighting the other than the chosen sentence
    const highlightedSentenceId = chosenSentenceId == 1 ? 2 : 1

    const [ instructionsModal, setInstructionsModal ] = React.useState(null);
    const [ showReadInstructions, setShowReadInstructions ] = useState(true);

    // Don't show skip button if in evaluation phase (we are not submitting anything) or if the worker is in comparison screen (already submitted, no skip)
    const showSkipButton = !isEvaluationPhase && submitAction != "Comparison"

    return (
        <div>
            <InstructionsModal examples={examples} instructionsModal={instructionsModal} setInstructionsModal={setInstructionsModal} />
            <div className="container actual-task">
                {step == "1" && <ReadSentencesStep taskData={taskData} showReadInstructions={showReadInstructions} setShowReadInstructions={setShowReadInstructions} onInstructionsClicked={onInstructionsClicked} />}
                {step == "2" && <ChooseSentenceStep taskData={taskData} setStep={setStep} setAllowedStep={setAllowedStep} chosenSentenceId={chosenSentenceId} setChosenSentenceId={setChosenSentenceIdAndResetNextSteps} isTrainingPhase={isTrainingPhase} />}
                {step == "3" && <HighlightPhrasesStep taskData={taskData} chosenSentenceId={chosenSentenceId} highlightedSentenceId={highlightedSentenceId} highlightedPhrases={highlightedPhrases} setHighlightedPhrases={setHighlightedPhrases}  showReadInstructions={showReadInstructions} setShowReadInstructions={setShowReadInstructions}  />}
                {step == "3" && isAllHighlightsWithStartAndEnd && <Alert variant="danger">Please delete and recreate the highlights.</Alert>}
                {step == "4" && <MergeSentencesStep taskData={taskData} mergedText={mergedText} setMergedText={setMergedText} highlightedPhrases={highlightedPhrasesCopy} chosenSentenceId={chosenSentenceId} feedbackText={feedbackText} setFeedbackText={setFeedbackText} skipped={false} setSkipped={setSkipped}  showReadInstructions={showReadInstructions} setShowReadInstructions={setShowReadInstructions}  />}
                {step == COMPARISON_SCREEN_STEP && <CompareResultsStep submissionData={submissionData} masterSubmissionData={masterSubmissionData} isEvaluationPhase={isEvaluationPhase} sentence1Text={sentence1Text} sentence2Text = {sentence2Text} />}

                <div className="row">
                    <div className="col-4">
                        <InstructionsButton onInstructionsClicked={onInstructionsClicked} classNames="step-button" showQuestionMark={true} />
                    </div>
                    <div className="col-4">
                        {!isComparisonScreen && <StepsComponent step={step} setStep={setStep} allowedStep={allowedStep} numSteps={lastStepShown} componentId="task" />}
                    </div>
                    <div className="col-4">
                        {!isEvaluationPhase && <SubmitButton onSubmit={onSubmitClicked} submissionData={submissionData} isSubmitDisabled={step < lastStepShown} classNames="step-button" action={submitAction} />}
                        {showSkipButton && <SkipButton onSubmit={onSubmitClicked} submissionData={submissionData} isSkipDisabled={false} classNames="step-button" action={submitAction} />}
                        {/* {step == lastStep &&  <button type="button" className="btn btn-secondary step-button submit-button" onClick={() => onSubmitClicked(submissionData, true)}>
                            <HighlightTooltip text={<span>Skip {sendIcon}</span>} tooltipText="Submit HIT, but skip the merge step if the sentences are unrelated" />
                        </button>} */}
                    </div>
                </div>
                {submitValidationModalComponent}
                {skipValidationModalComponent}
                {noticeModalComponent}
                {!savedAssignment && !isProdTaggingPhase && !isTrainingPhase && 
                    <div className="row">
                        <div className="annotated-by-text">{exampleId ? `Example ID: ${exampleId}` : ""}</div>
                        <div className="annotated-by-text">{originalAnnotator ? `Annotated by: ${originalAnnotator}` : ""}</div>
                        <div className="annotated-by-text">{assignmentId ? `Assignment id: ${assignmentId}` : ""}</div>
                        <div className="annotated-by-text">{originalAnnotationIteration ? `Annotation iteration: ${originalAnnotationIteration}` : ""}</div>
                        <div className="annotated-by-text">{reviewStatus ? `Review status: ${reviewStatus}` : ""}</div>
                        <div className="annotated-by-text">{originalSkip != undefined ? `Skipped: ${originalSkip}` : ""}</div>
                        <div className="annotated-by-text">{agreement != undefined ? `Agreement score: ${agreement} (updated on: ${agreementUpdated})` : ""}</div>

                    </div>
                }

            </div>
        </div>
    );
}

export { Task };
