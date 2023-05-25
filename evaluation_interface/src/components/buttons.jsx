import { HighlightTooltip } from "./highlight_tooltip";

const React = require("react");
const { sendIcon, sendPlusIcon } = require("./icons");

function SubmitButton({onSubmit, submissionData, isSubmitDisabled, classNames="", action="submit"}) {
    const iconToUse = sendIcon;
    const text = "Submit"
    let tooltipText = "Submit HIT"

    if (isSubmitDisabled) {
        tooltipText = "You need to rate all the merged texts for every criterion before you can submit"
    }

    const submitDisabledClassName = isSubmitDisabled ? "submit-disabled" : ""

    return <button type="button" className={`btn btn-primary submit-button ${submitDisabledClassName} ${classNames}`} data-bs-dismiss="modal" onClick={() => onSubmit(submissionData)} disabled={isSubmitDisabled}>
        <HighlightTooltip text={<span className="tooltip-available">{text} {iconToUse}</span>} tooltipText={tooltipText} />
    </button>
}


export { SubmitButton };