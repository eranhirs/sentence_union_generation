import { Modal } from 'bootstrap';
import { useEffect, useRef } from 'react';
import { FeedbackComponent } from './feedback_component';

const React = require("react");
const { SkipButton } = require("./buttons");

function SkipValidationModal({ setModal, onSubmit, isSubmitDisabled, isFeedbackEmpty, feedbackText, setFeedbackText, submitAction, submissionData }) {

    const modalRef = useRef(null);

    useEffect(() => {
        if (skipModal == null) {
            var skipModal = new Modal(modalRef.current)
            setModal(skipModal);
        }
    }, [])


    return <div className="modal fade" ref={modalRef} id="skipValidationModel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="skipValidationModelLabel" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
        <div className="modal-header">
            <h5 className="modal-title" id="skipValidationModelLabel">Submit {isSubmitDisabled ? "error" : "warning"}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div className="modal-body">
            {isFeedbackEmpty && <section>
                Please explain in details why this example should be skipped.
            </section>}
            {!isFeedbackEmpty && <section>You are about to skip this example.</section>}
            <div className="row"><FeedbackComponent skipped={true} feedbackText={feedbackText} setFeedbackText={setFeedbackText} />                    </div>
        </div>
        <div className="modal-footer">
            <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Cancel</button>
            <SkipButton onSubmit={onSubmit} submissionData={submissionData} isSkipDisabled={isFeedbackEmpty} action={submitAction}/>
        </div>
        </div>
    </div>
</div>
}

export { SkipValidationModal };