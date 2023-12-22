import React from 'react';
import Button from './components/Button';
import Display from './components/Display';

const App = () => {
   return (
      <div>
         <Display />
         <div>
            <Button type="INCREMENT" label="+" />
            <Button type="DECREMENT" label="-" />
            <Button type="ZERO" label="0" />
         </div>
      </div>
   );
};

export default App;
