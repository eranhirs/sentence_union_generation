import * as React from 'react';
import './App.css';
// import MTurkFormComponent from './components/MTurkFormComponent';
import { examples } from "./examples.jsx";
import { Task } from './components/task';
import MTurkComponent from './components/mturk_component';

function App() {
  let someExample = examples[0]
  someExample = window.taskData = {"exampleId": "val1230~!~val1230.txt~!~21252___val1230~!~0.txt~!~30297", "referenceAssignmentId": "3GA6AFUKOOPANF87LBKG7YLGAATH3R", "sentence1Text": "The \"highly decorated\" former Army Ranger's list of accomplishments is a long one considering his 34 years: In addition to being \"active\" at the finish line after the Boston Marathon bombs went off, he helped save Richard Donohue Jr., the officer who lost all his blood after his femoral vein was severed during an exchange of fire with Tamerlan and Dzhokhar Tsarnaev.", "sentence2Text": "Moynihan is a decorated Army Ranger with stints in Iraq from 2005 to 2008, according to the police department.", "referenceMergedText": "Moynihan, the \"highly decorated\" former Army Ranger's list of accomplishments is a long one considering his 34 years: In addition to stints in Iraq from 2005 to 2008, according to the police department, and being \"active\" at the finish line after the Boston Marathon bombs went off, he helped save Richard Donohue Jr., the officer who lost all his blood after his femoral vein was severed during an exchange of fire with Tamerlan and Dzhokhar Tsarnaev.", "mergedTexts": [{"model": "longest", "mergedText": "The \"highly decorated\" former Army Ranger's list of accomplishments is a long one considering his 34 years: In addition to being \"active\" at the finish line after the Boston Marathon bombs went off, he helped save Richard Donohue Jr., the officer who lost all his blood after his femoral vein was severed during an exchange of fire with Tamerlan and Dzhokhar Tsarnaev."}, {"model": "concat", "mergedText": "The \"highly decorated\" former Army Ranger's list of accomplishments is a long one considering his 34 years: In addition to being \"active\" at the finish line after the Boston Marathon bombs went off, he helped save Richard Donohue Jr., the officer who lost all his blood after his femoral vein was severed during an exchange of fire with Tamerlan and Dzhokhar Tsarnaev. Moynihan is a decorated Army Ranger with stints in Iraq from 2005 to 2008, according to the police department."}], "predIteration": "naive", "predIterationReason": "First naive iteration"}

return (
    <MTurkComponent defaultTaskData={someExample}>
      <Task
        isOnboarding={false}
        onError={() => { }}
      />
    </MTurkComponent>
  );
}

export default App;
