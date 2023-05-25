class SubmissionData {
    constructor(ratings, taskData) {
        this.ratings = ratings;
        this.taskData = taskData;
    }
}

class ExampleData {
    /*
    This class has two utilities (should probably be split):
    - used for providing examples in the instructions
    - used as demo data for prefilling
    */

    constructor(exampleId, referenceAssignmentId, exampleTitle, sentence1Text, sentence2Text, referenceMergedText,
        mergedTexts, prevSubmissionData, originalAnnotator, assignmentId, annotationIteration
    ) {
        this.exampleId = exampleId;
        this.referenceAssignmentId = referenceAssignmentId;
        this.exampleTitle = exampleTitle;
        this.sentence1Text = sentence1Text;
        this.sentence2Text = sentence2Text;
        this.referenceMergedText = referenceMergedText;
        this.mergedTexts = mergedTexts;
        this.prevSubmissionData = prevSubmissionData;
        this.originalAnnotator = originalAnnotator;
        this.assignmentId = assignmentId;
        this.annotationIteration = annotationIteration;
    }
}


export { SubmissionData, ExampleData };