import React, { useState } from 'react';
import { fullHighlightTooltip, fullMatchDescription, highlightTooltip, noMatchDescription, partialMatchDescription } from './components/texts.jsx';
import { ExampleData, SubmissionData } from './models.jsx';

// Example 1

const example1 = new ExampleData(
    "1",
    "referenceAssignmentId",
    "example",
    "After scooping up jewelry and watches estimated to be worth 2 million euros the thieves reversed their car out of the store and set fire to it before making off in another vehicle.",
    "Robbers crash 4x4 into store , grabbing jewelry and watches , before setting car ablaze.",
    "After crashing 4x4 into store and scooping up jewelry and watches estimated to be worth 2 million euros the robbers reversed their car out of the store and set fire to it before making off in another vehicle.",
    [
        {
            "model": "model1",
            "mergedText": "After crashing 4x4 into store and scooping up jewelry and watches estimated to be worth 2 million euros the robbers reversed their car out of the store and set fire to it before making off in another vehicle."
        },
        {
            "model": "model2",
            "mergedText": "After crash 4x4 into store and scooping up jewelry and watches estimated to be worth 2 million euros the thieves reversed their car out of the store and set fire to it before making off in another vehicle.",
        },
        {
            "model": "model3",
            "mergedText": "After crashing into store and scooping up jewelry and watches estimated to be worth 2 million euros the thieves reversed their car out of the store and set fire to it before making off in another vehicle.",
        },
        {
            "model": "model4",
            "mergedText": "After scooping up jewelry and watches estimated to be worth 2 million euros the thieves reversed their car out of the store and set fire to it before making off in another vehicle.",
        },
        {
            "model": "model5",
            "mergedText": "After scooping up jewelry and watches estimated to be worth 2 million euros the thieves reversed their car out of the store and set fire to it before making off in another vehicle. Robbers crash 4x4 into store , grabbing jewelry and watches , before setting car ablaze.",
        }
    ],
    null,
    "someone",
    "some_assignment_id",
    "master_set_1"
);


const example2 = new ExampleData(
    "2",
    "referenceAssignmentId",
    "small_example",
    "After scooping up jewelry and watches estimated to be worth 2 million euros the thieves reversed their car out of the store and set fire to it before making off in another vehicle.",
    "Robbers crash 4x4 into store , grabbing jewelry and watches , before setting car ablaze.",
    "After crashing 4x4 into store and scooping up jewelry and watches estimated to be worth 2 million euros the robbers reversed their car out of the store and set fire to it before making off in another vehicle.",
    [
        {
            "model": "model1",
            "mergedText": "After crashing 4x4 into store and scooping up jewelry and watches estimated to be worth 2 million euros the robbers reversed their car out of the store and set fire to it before making off in another vehicle.",
        },
        {
            "model": "model2",
            "mergedText": "After crash 4x4 into store and scooping up jewelry and watches estimated to be worth 2 million euros the thieves reversed their car out of the store and set fire to it before making off in another vehicle.",
        }
    ],
    null,
    "someone",
    "some_assignment_id",
    "master_set_1"
);

const example3 = new ExampleData(
    "3",
    "referenceAssignmentId",
    "filled_example",
    "After scooping up jewelry and watches estimated to be worth 2 million euros the thieves reversed their car out of the store and set fire to it before making off in another vehicle.",
    "Robbers crash 4x4 into store , grabbing jewelry and watches , before setting car ablaze.",
    "After crashing 4x4 into store and scooping up jewelry and watches estimated to be worth 2 million euros the robbers reversed their car out of the store and set fire to it before making off in another vehicle.",
    [
        {
            "model": "model1",
            "mergedText": "After crashing 4x4 into store and scooping up jewelry and watches estimated to be worth 2 million euros the robbers reversed their car out of the store and set fire to it before making off in another vehicle."
        },
        {
            "model": "model2",
            "mergedText": "After crash 4x4 into store and scooping up jewelry and watches estimated to be worth 2 million euros the thieves reversed their car out of the store and set fire to it before making off in another vehicle."
        },
        {
            "model": "model3",
            "mergedText": "After crashing into store and scooping up jewelry and watches estimated to be worth 2 million euros the thieves reversed their car out of the store and set fire to it before making off in another vehicle."
        },
        {
            "model": "model4",
            "mergedText": "After scooping up jewelry and watches estimated to be worth 2 million euros the thieves reversed their car out of the store and set fire to it before making off in another vehicle."
        },
        {
            "model": "model5",
            "mergedText": "After scooping up jewelry and watches estimated to be worth 2 million euros the thieves reversed their car out of the store and set fire to it before making off in another vehicle. Robbers crash 4x4 into store , grabbing jewelry and watches , before setting car ablaze."
        }
    ],
    {
        "ratings": {
            'coverage': {0: 1, 1: 1, 2: 1, 3: 1, 4: 1},
            'faithfulness': {0: 1, 1: 1, 2: 1, 3: 1, 4: 1},
            'repetition': {0: 1, 1: 1, 2: 1, 3: 1, 4: 1},
            'fluency': {0: 1, 1: 1, 2: 1, 3: 1, 4: 1}
        }
    },
    "someone",
    "some_assignment_id",
    "master_set_1"
);



const examples = [
    example1,
    example2,
    example3
]

export { examples };