import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, Routes } from 'react-router-dom';
import Users from './pages/Users';
import Home from './pages/Home';
import User from './components/User';
import SingleUser from './pages/SingleUser';
import Notification from './components/Notification';
import SingleBlog from './pages/SingleBlog';
import { checkUserAuth } from './reducers/loginSlice';
import NavBar from './components/NavBar';
const App = () => {
   const dispatch = useDispatch();
   const { status } = useSelector((state) => state.userAccount);
   useEffect(() => {
      if (status === 'idle') {
         dispatch(checkUserAuth());
      }
   }, [status, dispatch]);
   return (
      <div>
         <NavBar />
         <Notification />
         <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/users' element={<Users />} />
            <Route path='/users/:id' element={<SingleUser />} />
            <Route path='/blogs/:id' element={<SingleBlog />} />
         </Routes>
      </div>
   );
};

export default App;
