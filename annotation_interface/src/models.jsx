class SubmissionData {
    constructor(chosenSentenceId, highlightedPhrases, mergedText, feedbackText, taskData, skipped = false) {
        this.chosenSentenceId = chosenSentenceId;
        this.highlightedPhrases = highlightedPhrases;
        this.mergedText = mergedText;
        this.feedbackText = feedbackText;
        this.taskData = taskData;
        this.skipped = skipped;
    }
}

class ExampleData {
    /*
    This class has two utilities (should probably be split):
    - used for providing examples in the instructions
    - used as demo data for prefilling
    */

    constructor(exampleId, exampleTitle, sentence1Text, sentence2Text, previousSubmissionData, masterSubmissionData,
        step1Extra, step2Extra, step3Extra, step4Extra, allowedLastStep,
        originalAnnotator, assignmentId, annotationIteration, reviewStatus,
        agreementScore, agreementUpdated
    ) {
        this.exampleId = exampleId;
        this.exampleTitle = exampleTitle;
        this.sentence1Text = sentence1Text;
        this.sentence2Text = sentence2Text;
        this.previousSubmissionData = previousSubmissionData;
        this.masterSubmissionData = masterSubmissionData;
        this.step1Extra = step1Extra;
        this.step2Extra = step2Extra;
        this.step3Extra = step3Extra;
        this.step4Extra = step4Extra;
        this.allowedLastStep = allowedLastStep;
        this.originalAnnotator = originalAnnotator;
        this.assignmentId = assignmentId;
        this.annotationIteration = annotationIteration;
        this.reviewStatus = reviewStatus;
        this.agreementScore = agreementScore;
        this.agreementUpdated = agreementUpdated;
    }
}


export { SubmissionData, ExampleData };