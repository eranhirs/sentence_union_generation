function stepObjToIdx(stepObj, stepsList) {
    const stepIdToStepIdx = Object.assign({}, ...stepsList.map((stepObj, idx) => ({[stepObj['id']]: idx})));


    return stepIdToStepIdx[stepObj['id']]
}

export {stepObjToIdx}