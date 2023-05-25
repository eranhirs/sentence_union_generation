import { Modal } from 'bootstrap';
import { useEffect, useRef } from 'react';
import { compareResultsNotice } from './texts';

const React = require("react");
const { ContinueButton } = require("./buttons");

function NoticeModal({ setModal, onContinueClicked }) {

    const modalRef = useRef(null);

    useEffect(() => {
        if (modal == null) {
            var modal = new Modal(modalRef.current)
            setModal(modal);
        }
    }, [])


    return <div className="modal fade" ref={modalRef} id="noticeModel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="noticeModelLabel" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
        <div className="modal-header">
            <h5 className="modal-title" id="noticeModelLabel">Instructions</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div className="modal-body">
            <section>
                {compareResultsNotice}
            </section>
        </div>
        <div className="modal-footer">
            <ContinueButton onContinueClicked={onContinueClicked} />
        </div>
        </div>
    </div>
</div>
}

export { NoticeModal };