import React, { useState } from 'react';

const repetitionWarningDescription = "This word is highlighted to emphasize that it exists in both sentences, such repetition should usually be avoided"

const paraphrasesNote = "Certain statements may convey identical information through distinct phrasing. For instance, one statement may indicate that a proposal was \"rejected\", while another may state that the proposal was \"turned down\". In such cases, it is required to evaluate the sentence based on the underlying meaning conveyed, irrespective of the specific terminology employed."
const taskDescription = "Following the previous \"Merge two sentences into one unifying sentence\" task, for each pair of source sentences we now have a unifying single sentence created by workers such as yourself. We used this data to automatically generate sentences using Artificial Intelligence, and we would like you to rate the success of these generations."
const ratingInstructionsWithReference = "First, please read the following reference sentence. Then, you are presented with various merged sentences created by different systems, which you need to rate. There are four rating criteria, and each rating criterion will have its own instructions."
const ratingInstructionsWithoutReference = "You are presented with various merged sentences created by different systems, which you need to rate. There are four rating criteria, and each rating criterion will have its own instructions."
const relativeRatingsInstructions = "Ratings are from best to worst, relative to the other choices (ties are allowed)."

const coverageInstructions = "Any piece of information described in the reference sentence should be implied from the system sentence, otherwise it is considered missing. Different phrasings of the information are allowed, provided that they convey the equivalent underlying meaning. Rate the following system sentences based on the amount of information they cover from the reference sentence."
const faithfulnessInstructions = "Any piece of information described in the system sentence should be implied from the reference sentence, otherwise it is considered unfaithful. Different phrasings of the information are allowed, provided that they convey the equivalent underlying meaning. Rate the following system sentences based on the their faithfulness to the reference sentence."
const repetitionInstructions = "A piece of information should be introduced only once to the reader of the sentence, unless necessary to repeat for grammaticallity reasons. Otherwise, it is considered a semantic repetition. Rate the following merged sentences based on the amount of their semantic repetition."
const fluencyInstructions = "The sentence should progress fluently, form a coherent whole and it should be easy to understand the text. Rate the following merged sentences based on their fluency."

const coverageScales = {
    "4": "Nothing is missing.",
    "3": "Minor details are missing.",
    "2": "Some information is missing.",
    "1": "Substantial information is missing."
}

const faithfulnessScales = {
    "4": "Nothing is unfaithful.",
    "3": "Minor details are unfaithful.",
    "2": "Some information is unfaithful.",
    "1": "Substantial information is unfaithful."
}

const repetitionScales = {
    "4": "Nothing is repeated.",
    "3": "Minor details are repeated.",
    "2": "Some information is repeated.",
    "1": "Substantial information is repeated."
}

export {repetitionWarningDescription, taskDescription, ratingInstructionsWithReference, ratingInstructionsWithoutReference, coverageInstructions, faithfulnessInstructions, repetitionInstructions, fluencyInstructions, relativeRatingsInstructions, coverageScales, faithfulnessScales, repetitionScales, paraphrasesNote};