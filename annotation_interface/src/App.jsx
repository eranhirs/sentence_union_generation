import * as React from 'react';
import './App.css';
// import MTurkFormComponent from './components/MTurkFormComponent';
import { examples } from "./examples.jsx";
import { Task } from './components/task';
import MTurkComponent from './components/mturk_component';

function App() {
  let someExample = examples[0]

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
