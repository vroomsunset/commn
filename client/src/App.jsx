
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx';
import Feed from './pages/Feed.jsx';
import Signup from './pages/Signup.jsx';
import './App.css'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/explore' element={<Feed/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
