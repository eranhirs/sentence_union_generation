import * as React from "react";
import { HighlightTooltip } from "./highlight_tooltip";
import { stepObjToIdx } from "./utils";

function StepsComponent({step, setStep, numSteps, allowedStep, componentId, stepsList}) {

    function createStepCheckbox(stepObj) {
        const allowedStepIdx = stepObjToIdx(allowedStep, stepsList)
        const stepIdx = stepObjToIdx(stepObj, stepsList)
        const stepId = stepObj['id']
        const currStepIdx = stepObjToIdx(step, stepsList)

        const isDisabled = allowedStepIdx < stepIdx;
        return <input type="radio" className="btn-check" name={`${componentId}-btnradio`} id={`${componentId}-btnradio${stepId}`} autocomplete="off" checked={stepIdx == currStepIdx ? "true" : ""} disabled={isDisabled ? "true" : ""} onClick={() => setStep(stepObj)} />
    }

    function createStep(stepObj) {
        const allowedStepIdx = stepObjToIdx(allowedStep, stepsList)
        const stepIdx = stepObjToIdx(stepObj, stepsList)
        const currStepIdx = stepObjToIdx(step, stepsList)

        const isDisabled = allowedStepIdx < stepIdx;

        let tooltipText = `This button is disabled because you haven't completed the previous steps`
        const stepId = stepObj['id']

        let stepLabel = stepObj['short_name']
        if (isDisabled) {
            stepLabel = <HighlightTooltip text={stepLabel} tooltipText={tooltipText} />
        }
        return <label className="btn btn-outline-primary step-label" for={`${componentId}-btnradio${stepId}`}>{stepLabel}</label>
    }

    return <div className={`btn-group steps-btn-group`} role="group" aria-label="Switch steps">
        {stepsList.map(stepObj => {
            return [
                createStepCheckbox(stepObj),
                createStep(stepObj)
            ]
        })}
    </div>
}

export { StepsComponent };