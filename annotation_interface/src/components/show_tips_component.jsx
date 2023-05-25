import * as React from "react";

function ShowTipsComponent({isExample, showReadInstructions, setShowReadInstructions}) {

    return <span className="show-tips-link">{!isExample && !showReadInstructions && <a className="fs-6" onClick={() => setShowReadInstructions(true)}>Show tips</a>}</span>
}

export { ShowTipsComponent };