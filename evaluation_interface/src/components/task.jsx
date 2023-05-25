import React, { useEffect, useRef, useState } from 'react';
import { all_task_data } from '../examples.jsx';
import { SubmissionData } from '../models.jsx';
import { diffTexts } from '../utils.jsx';
import { SubmitButton } from './buttons.jsx';
import { RatingComponent } from './rating_component.jsx';
import { StepsComponent } from './steps_component.jsx';
import { SubmitValidationModal } from './submit_validation_modal.jsx';
import { coverageInstructions, coverageScales, faithfulnessInstructions, faithfulnessScales, fluencyInstructions, repetitionInstructions, repetitionScales } from './texts.jsx';
import { stepObjToIdx } from './utils.jsx';
import { diffChars, diffWords, diffSentences } from 'diff';


function Task({ taskData, isOnboarding, onSubmit, onError }) {
    const { mergedTexts } = taskData;
    const { prevSubmissionData } = taskData;

    const criteria = [
    {
        "short_name": "Introduction",
        "id": "introduction",
        "scales": {}
    },
    {
        "full_name": "Information Coverage",
        "short_name": "Coverage",
        "id": "coverage",
        "instructions": coverageInstructions,
        "show_reference": true,
        "scales": coverageScales,
        "scaleRange": 4
    },
    {
        "full_name": "Information Faithfulness",
        "short_name": "Faithfulness",
        "id": "faithfulness",
        "instructions": faithfulnessInstructions,
        "show_reference": true,
        "scales": faithfulnessScales,
        "scaleRange": 4
    },
    {
        "full_name": "Semantic Repetition",
        "short_name": "Repetition",
        "id": "repetition",
        "instructions": repetitionInstructions,
        "scales": repetitionScales,
        "scaleRange": 4
    },
    {
        "full_name": "Fluency",
        "short_name": "Fluency",
        "id": "fluency",
        "instructions": fluencyInstructions,
        "scales": {},
        "scaleRange": 5
    }
    ]

    const [step, setStep] = useState(criteria[0]);
    let [allowedStep, setAllowedStep] = useState(prevSubmissionData ? criteria[criteria.length - 1] : criteria[1]);

    const [ ratings, setRatings ] = useState(prevSubmissionData ? prevSubmissionData['ratings'] || {} : {});
    const [ exampleId, setExampleId ] = useState(taskData['exampleId'] || null);
    const [ originalAnnotator, setOriginalAnnotator ] = useState(taskData['originalAnnotator'] || taskData['workerId']);
    const [ originalAnnotationIteration, setOriginalAnnotationIteration ] = useState(taskData['annotationIteration']);
    const [ assignmentId, setAssignmentId ] = useState(taskData['assignmentId'] || null);

    function onSubmitWithLog(submissionData) {
        console.log(submissionData)
        onSubmit(submissionData)
    }

    const submissionData = new SubmissionData(ratings, taskData);

    function isStepComplete(stepObj) {
        const stepId = stepObj['id']
        const currRatingsObj = ratings[stepId] || []

        return Object.keys(currRatingsObj).length == mergedTexts.length
    }

    function setRating(mergedSentenceIdx, stepValue) {
        const stepId = step['id']
        const currRatingsObj = ratings[stepId] || {}
        ratings[stepId] = currRatingsObj
        currRatingsObj[mergedSentenceIdx] = stepValue

        // Necessary to activate react rerender
        const ratingsCopy = {}
        Object.assign(ratingsCopy, ratings)
        setRatings(ratingsCopy)

        if (isStepComplete(step) && (step['id'] == allowedStep['id'])) {
            const stepIdx = stepObjToIdx(step, criteria)
            const nextStepIdx = stepIdx + 1
            if (criteria.length > nextStepIdx) {
                const nextStep = criteria[nextStepIdx]
                setAllowedStep(nextStep)
            }
        }
    }

    const ratingsComplete = isStepComplete(criteria[criteria.length - 1])
    const isSubmitDisabled = !ratingsComplete
    const shouldShowValidationModal = false

    // Modals
    const [ submitValidationModal, setSubmitValidationModal ] = useState(null);
    const submitValidationModalComponent = <SubmitValidationModal setModal={setSubmitValidationModal} onSubmit={onSubmitWithLog} submissionData={submissionData} />

    function onSubmitClicked(submissionData, skip=false) {
        const didUserPassValidation = true
        if (didUserPassValidation) {
            onSubmitWithLog(submissionData)
        }
        if (shouldShowValidationModal) {
            submitValidationModal.toggle()
        } else {
            onSubmitWithLog(submissionData)
        }
    }

    return (
        <div>
            <div className="container actual-task">
                <RatingComponent taskData={taskData} stepObj={step} ratings={ratings} setRating={setRating} />

                {submitValidationModalComponent}
                <div className='row justify-content-center'>
                    <div className='col-md-8'>
                        <StepsComponent step={step} setStep={setStep} allowedStep={allowedStep} stepsList={criteria} />
                    </div>
                    <div className='col-4'>
                        <SubmitButton onSubmit={onSubmitClicked} submissionData={submissionData} isSubmitDisabled={isSubmitDisabled} classNames="step-button" />
                    </div>
                </div>
                {false && 
                    <div className="row">
                        <div className="annotated-by-text">{exampleId ? `Example ID: ${exampleId}` : ""}</div>
                        <div className="annotated-by-text">{originalAnnotator ? `Annotated by: ${originalAnnotator}` : ""}</div>
                        <div className="annotated-by-text">{assignmentId ? `Assignment id: ${assignmentId}` : ""}</div>
                        <div className="annotated-by-text">{originalAnnotationIteration ? `Annotation iteration: ${originalAnnotationIteration}` : ""}</div>
                    </div>
                }
            </div>
        </div>
    );
}

export { Task };
