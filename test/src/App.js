import { useEffect } from 'react';
import Counter from './components/Counter';
import Note from './components/Note';
import Home from './components/Home';
import { Routes, Route, Link } from 'react-router-dom';

function App() {
   useEffect(() => {
      console.log('effect form app');
   }, []);
   return (
      <div>
         <nav>
            <ul>
               <li>
                  <Link to="/">Home</Link>
               </li>
               <li>
                  <Link to="/counter">counter</Link>
               </li>
               <li>
                  <Link to="/note">note</Link>
               </li>
            </ul>
         </nav>
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/counter" element={<Counter />} />
            <Route path="/note" element={<Note />} />
         </Routes>
      </div>
   );
}

export default App;
