import * as React from 'react';
import CourseList from './components/CourseList';
import AddCourse from './components/AddCourse';

/**
 * The overall layout of the app
 */
const App: React.SFC = function App() {
  return (
    <div>
      <CourseList />
      <AddCourse />
    </div>
  );
};

export default App;
