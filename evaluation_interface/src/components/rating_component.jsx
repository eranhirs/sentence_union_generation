import React, { useState, useRef, useEffect } from 'react';
import { diffTexts } from '../utils.jsx';
import { Directions } from './core_components.jsx';
import { exclamationMarkIcon, questionMarkIcon } from './icons.jsx';
import { Sentence } from './sentence.jsx'
import {  paraphrasesNote, ratingInstructionsWithoutReference, ratingInstructionsWithReference, relativeRatingsInstructions, taskDescription } from './texts.jsx';

function RatingComponent({ taskData, stepObj, ratings, setRating }) {
    const { sentence1Text, sentence2Text, referenceMergedText } = taskData;
    // const sentence1 = <Sentence title="Sentence 1" text={sentence1Text} />
    // const sentence2 = <Sentence title="Sentence 2" text={sentence2Text} />
    const referenceMergedTextComponent = <Sentence title="Reference sentence" text={referenceMergedText} />

    const isIntroductionPage = stepObj['id'] == 'introduction'
    const stepId = stepObj['id']
    const showReference = stepObj['show_reference']
    const currRatingObj = ratings[stepId] || {}
    const criterionName = stepObj['full_name'];
    const ciretrionInstructions = stepObj['instructions'];

    let instructionsRow
    if (Object.keys(stepObj['scales']).length > 0) {
        instructionsRow = <tr className="instructions-row">
            <th>
                {exclamationMarkIcon}
            </th>
            <td colSpan={3}>
                <div className='row'>
                    <div className='col scale-col'>
                        Use the following scale:
                    </div>
                    {Object.keys(stepObj['scales']).map(scaleText =>
                        <div className='col scale-col'>
                            {scaleText} - {stepObj['scales'][scaleText]}
                        </div>
                    )}
                </div>
            </td>
        </tr>
    }

    // From 5 to [1,2,3,4,5] so we can iterate it
    const scaleRange = Array.apply(null, Array(stepObj['scaleRange'])).map(function (_, i) {return i;});
    
    return (
        <div className="row">
            <div className="col-12 fs-5">
                <Directions title={<span>Evaluating generated sentences</span>}>
                {isIntroductionPage && taskDescription}
                </Directions>
            </div>
            {isIntroductionPage && <div className="col-12 fs-5">
                <Directions>
                    <h4>Instructions</h4>
                    {showReference ? ratingInstructionsWithReference : ratingInstructionsWithoutReference}
                    {!showReference && <span><br/><br/>{paraphrasesNote}</span>}
                </Directions>
            </div>}
            {!isIntroductionPage && <div className="col-12 fs-5">
                <Directions>
                    <h4 className='criterion-name'>{`${criterionName} criterion`}</h4>
                    {ciretrionInstructions}
                    {/* <br/><br/>
                    Note: {relativeRatingsInstructions} */}
                </Directions>
            </div>}
            {showReference && <div className="col-12">
                <section>
                    {/* {sentence1}
                    {sentence2} */}
                    {referenceMergedTextComponent}
                </section>
            </div>}
            <table className='table table-stripped table-hover'>
                <thead>
                    <tr>
                        <th scope="col">
                            #
                        </th>
                        <th scope="col">
                            System sentence {showReference ? "(compared to reference)" : ""}
                        </th>
                        {!isIntroductionPage && 
                            <th scope="col" className="rank-column">
                                Rank {criterionName}
                            </th>
                        }
                    </tr> 
                </thead>
                <tbody>
                    {instructionsRow}
                    {
                        taskData['mergedTexts'].map((mergedTextObj, idx) => 
                            <tr>
                                <th>
                                    {idx + 1}
                                </th>
                                <td>
                                    {showReference ? diffTexts(referenceMergedText, mergedTextObj['mergedText']) : mergedTextObj['mergedText']}
                                </td>
                                {!isIntroductionPage && 
                                <td>
                                    <div className='container'>
                                        <div className='row'>
                                            <div className='col-1' />
                                            {
                                                scaleRange.map((_, innerIdx) => {
                                                    const currValue = innerIdx + 1
                                                    const isChecked = currRatingObj[mergedTextObj['model']] == currValue

                                                    return (<div className='col-2'>
                                                        <input className="form-check-input" type="radio" name={`rating-${stepId}-${idx}`} id={`rating-${stepId}-${innerIdx}-${idx}`} onClick={() => setRating(mergedTextObj['model'], currValue)} checked={isChecked ? "true" : ""} />
                                                    </div>)
                                                })
                                            }
                                        </div>
                                        <div className='row'>
                                            <div className='col-1' />
                                            {
                                                scaleRange.map((_, innerIdx) => 
                                                    <div className='col-2 rating-num-column'>
                                                        {innerIdx+1}
                                                    </div>
                                                )
                                            }
                                        </div>
                                        {/* <div className='row'>
                                            <div className='col-4'>
                                                <label className="form-check-label" for={`rating-${stepId}-0-${idx}`}>
                                                    Worst
                                                </label>
                                            </div>
                                            <div className='col-4'>
                                            </div>
                                            <div className='col-4'>
                                                <label className="form-check-label" for={`rating-${stepId}-${mergedText.length - 1}-${idx}`}>
                                                    Best
                                                </label>
                                            </div>
                                        </div> */}
                                    </div>
                                </td>}
                            </tr>    
                        )
                    }
                </tbody>
            </table>      
        </div>
    )
}

export { RatingComponent };
