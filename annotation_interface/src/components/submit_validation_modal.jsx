import { Modal } from 'bootstrap';

const { useEffect, useRef, useState } = require("react");
const React = require("react");
const { SubmitButton } = require("./buttons");

function SubmitValidationModal({ setModal, onSubmit, submissionData, submitAction, skipped, highlightTooltip, isSubmitDisabled, isMergedTextEmpty, isMergedSentenceUnchanged, isSentenceChangedButNoHighlights, isAllHighlightsIntegrated, isAllHighlightsWithStartAndEnd }) {
    const modalRef = useRef(null);

    useEffect(() => {
        if (myModal == null) {
            var myModal = new Modal(modalRef.current)
            setModal(myModal);
        }
    }, [])

    return <div className="modal fade" ref={modalRef} id="submitValidationModel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="submitValidationModelLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="submitValidationModelLabel">Submit {isSubmitDisabled ? "error" : "warning"}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                {skipped && <section>You are trying to skip creating a merged sentence.</section>}
                {isMergedTextEmpty && <section>You are trying to submit an empty merged sentence. If you believe you should skip creating a merged sentence, please use the skip checkbox instead. <br/><br/></section>}
                {isMergedSentenceUnchanged && <section>You are trying to submit the base sentence without adding any information to it from the other sentence. This is possible only if the information in the former completely contains the information in the latter. <br/><br/></section>}
                {isSentenceChangedButNoHighlights && <section>You made changes to the base sentence, but you didn't use the highlighting tool, please go back to Step 3. <br/><br/></section>}
                {isAllHighlightsIntegrated && <section>Some of your highlights could not be found in the merged sentence (colored {highlightTooltip}). You should remove unused highlights, unless you think we couldn't find them automatically (for example, if you rephrased the highlighted word). <br/><br/></section>}
                {isAllHighlightsWithStartAndEnd && <section>Some highlights are malformed, please go to step 3, delete the highlights and make the same highlights again. <br/><br/></section>}
                {isSubmitDisabled && <section>Submit disabled. While this use case is allowed, you have to provide feedback explaining your decision.</section>}
                {!isSubmitDisabled && <section>You can submit, but please carefully read the instructions beforehand if you are uncertain about this warning.</section>}
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Cancel</button>
                <SubmitButton onSubmit={onSubmit} submissionData={submissionData} isSubmitDisabled={isSubmitDisabled} action={submitAction} />
            </div>
            </div>
        </div>
    </div>
}

export { SubmitValidationModal };