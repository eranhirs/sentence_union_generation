import * as React from "react";
import { Modal } from "bootstrap";
import { Instructions } from "./instructions";
import { questionMarkIcon } from "./icons";

function InstructionsModal({ examples, instructionsModal, setInstructionsModal }) {
    
    const modalRef = React.useRef(null);

    React.useEffect(() => {
        if (myModal == null) {
            var myModal = new Modal(modalRef.current)
            setInstructionsModal(myModal)

            // myModal.toggle()
        }
    }, [])
 
    return (
    <div className="modal fade" ref={modalRef} id="instructionsModel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="instructionsModelLabel" aria-hidden="true">
        <div className="modal-dialog modal-fullscreen">
            <div className="modal-content">
                <div className="modal-header">
                    <div className="row">
                        <div className="col-1"></div>
                        <div className="col-11">
                            <h4 className="modal-title" id="instructionsModelLabel">Instructions</h4>
                        </div>
                    </div>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <Instructions examples={examples} />
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Done reading instructions and examples</button>
                </div>
            </div>
        </div>
    </div>
    )
}

export { InstructionsModal };