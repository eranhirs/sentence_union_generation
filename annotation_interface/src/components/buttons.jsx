import { HighlightTooltip } from "./highlight_tooltip";
import { QuestionMarkTooltip } from "./question_mark_tooltip";
import { skipButtonTooltip } from "./texts";

const React = require("react");
const { sendIcon, sendPlusIcon } = require("./icons");

function SubmitButton({onSubmit, submissionData, isSubmitDisabled, classNames="", action="submit"}) {
    const iconToUse = action != "Training" ? sendIcon : null; 
    const text = action != "Comparison" ? "Submit" : "Finish"
    let tooltipText = action == "submit" ? "Submit HIT" : "Submit & review your results"

    if (isSubmitDisabled) {
        tooltipText = "You need to reach the last step before you can submit"
    }

    const submitDisabledClassName = isSubmitDisabled ? "submit-disabled" : ""

    return <button type="button" className={`btn btn-primary submit-button ${submitDisabledClassName} ${classNames}`} data-bs-dismiss="modal" onClick={() => onSubmit(submissionData)} disabled={isSubmitDisabled}>
        <HighlightTooltip text={<span className="tooltip-available">{text} {iconToUse}</span>} tooltipText={tooltipText} />
    </button>
}

function SkipButton({onSubmit, submissionData, isSkipDisabled, classNames="", action="submit"}) {
    const iconToUse = action == "Submit" ? sendIcon : null; 
    const text = "Skip"


    return <button type="button" className={`btn btn-primary submit-button ${classNames}`} data-bs-dismiss="modal" onClick={() => onSubmit(submissionData, true)} disabled={isSkipDisabled}>
        <HighlightTooltip text={<span>{text} {iconToUse}</span>} tooltipText={skipButtonTooltip} />
    </button>
}

function InstructionsButton({ onInstructionsClicked, classNames="", showQuestionMark=false }) {
    return <button type="button" className={`btn btn-secondary instructions-button ${classNames}`} onClick={() => onInstructionsClicked()}>Instructions {showQuestionMark && <QuestionMarkTooltip tooltipText={"Click to see instructions and examples"}/>}</button>
}

function ContinueButton({onContinueClicked}) {
    return <button type="button" className={`btn btn-primary submit-button`} data-bs-dismiss="modal" onClick={onContinueClicked}>
        Continue
    </button>
}



export { SubmitButton, SkipButton, InstructionsButton, ContinueButton };