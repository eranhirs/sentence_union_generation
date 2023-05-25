import * as React from "react";

function FeedbackComponent({skipped, feedbackText, setFeedbackText}) {
    return <section className="feedback-component">
        <h5 className="card-title">Feedback {!skipped ? "(optional)" : ""}</h5>
        <textarea className="feedback-textarea"
        onChange={(e) => setFeedbackText(e.target.value)}
        placeholder="Write here feedback about the example or the task"
        value={feedbackText} />
    </section>
}

export { FeedbackComponent };