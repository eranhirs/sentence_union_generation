import React, { useRef, useState } from 'react';
import { SkipButton } from './buttons.jsx';
import { Directions } from "./core_components.jsx";
import { Example } from './example.jsx';
import { contradictingInformationDescription, elaboratedDescription, entailingInformationDescription, fullHighlightTooltip, fullMatchDescription, highlightTooltip, newInformationDescription, partialHighlightTooltip, shortDescription } from './texts.jsx';


function ExamplesAccordion({ examples, accordionId, initialStep=1 }) {
  const exampleAccordionRef = useRef(null);
  
  return (
    <div className="accordion" id={`accordionFlushExample${accordionId}`}>
      {
        examples.map(function (object, i) {
          const uniqueExampleId = `${accordionId}-${i}`

          function scrollToExampleTop() {
            exampleAccordionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
          }
    

          return <div className="accordion-item"  ref={exampleAccordionRef}>
            <h2 className="accordion-header" id={`flushHeading${uniqueExampleId}`}>
              <button className="accordion-button collapsed fs-5" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapse-${uniqueExampleId}`} aria-expanded="false" aria-controls={`flush-collapse-${uniqueExampleId}`} onClick={scrollToExampleTop}>
                Click here to view an {object['exampleTitle'].toLowerCase()}
              </button>
            </h2>
            <div id={`flush-collapse-${uniqueExampleId}`} className="accordion-collapse collapse" aria-labelledby={`flushHeading${uniqueExampleId}`} data-bs-parent={`#accordionFlushExample${accordionId}`}>
              <div className="accordion-body">
                <Example exampleId={uniqueExampleId} exampleData={object} scrollToExampleTop={scrollToExampleTop} initialStep={initialStep} />
              </div>
            </div>
          </div>
        })
      }
    </div>
  )
}

function Instructions({ examples }) {

  const skipButton = <SkipButton onSubmit={undefined} submissionData={undefined} isSkipDisabled={true}/>

  return (
    <div>
      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <Directions title="1. Introduction">
                {shortDescription}
              </Directions>
            </div>

            <div className="col-12">
              <ExamplesAccordion examples={[examples[0]]} accordionId={1} /><br/>
            </div>
            <div className='col-12'>
              <Directions title="2. Elaborated instructions">
              <h4>2.1. Skip if the two sentences are unrelated or contradicting</h4>
              We are looking for sentence pairs with some similarity between them. If the two sentences mention different events, or they have contradicting facts, you should skip them using the {skipButton} button.
              <br/><br/><ExamplesAccordion examples={[examples[3]]} accordionId={2} /><br/>

              <h4>2.2. Step 3 (Highlight step)</h4>
              After choosing a base sentence, you should review the other sentence and highlight all new or more specific information.
              <br/>
              <u>a. Highlight repeating information only if it is more specific</u><br/>
              In some cases, the same piece of information will be stated in both sentences, at different levels of detail. You should highlight it only if it is more specific.<br/>
              <u>b. Highlight only the new information</u><br/>
              The new information you highlight is usually connected to other pieces of information which are not new. You should highlight only the new information.

              <br/><br/><ExamplesAccordion examples={[examples[4]]} accordionId={3} initialStep={1} /><br/>
              <h4>2.3. Step 4 (Merge step)</h4>
              You should create a sentence that conveys the information from the two sentences without redundancies.<br/>

              <u>a. Write a coherent sentence</u><br/>
              When writing the merged sentence, order the information in the sentence in a coherent stand-alone manner (as if the sentence would have been written from scratch). Avoid being distracted by the original split and ordering of information in the two original sentences.
            If needed, you may <span className="fw-bold">minimally</span> adjust the phrasing of the sentence to create a coherent merged sentence.<br/>

            <u>b. Use all highlights</u><br/>
            All highlights should be expressed in the merged sentence. Highlights will change colors from {highlightTooltip} to {fullHighlightTooltip} to help you. If you realize a highlight is redundant, you can go back and change the highlights, your merged sentence will not be deleted.<br/>

            <u>c. Write one sentence</u><br/>
            The merged text should consist of a single sentence.<br/>

            <u>d. Avoid repetition</u><br/>
            Each piece of information should appear only once in the merged sentence. Choose the more specific phrasing when there is a repetition.<br/>

            <u>e. Avoid paraphrasing</u><br/>
            To the extent possible, the merged sentence should preserve the original wording of the information.
              <br/><br/><ExamplesAccordion examples={[examples[5]]} accordionId={4} initialStep={1} /><br/>
              </Directions>
            </div>
          </div>

          {/* <div className="col-12">
            <Directions title="">
              {elaboratedDescription}
              </Directions>              
          </div> */}


        </div>
      </section>
    </div>
  );
}

export { Instructions };
