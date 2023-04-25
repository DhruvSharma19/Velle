import './App.css';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Messenger from './pages/Messenger';
import Friend from './pages/Friend';
import Search from './pages/Search';
import Profile from './pages/Profile';
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path="/">
          <Route index element={<Signup/>}/>
          <Route path="home" element={<Home/>}/>
          <Route path="messenger">
            <Route path=":id" element={<Messenger/>}/>
          </Route>
          <Route path="friend">
            <Route path=":id" element={<Friend/>}/>
          </Route>
          <Route path="search" element={<Search/>}/>
          <Route path="profile">
            <Route path=":id" element={<Profile/>}/>
          </Route>
          <Route path="signup" element={<Signup/>}/>
        </Route>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
