import { useAuth0 } from "@auth0/auth0-react";
import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import {LoginButton} from "./login";
import {LogoutButton} from "./logout";
import {Profile} from "./profile";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import './App.css';

function App() {
    const { isAuthenticated } = useAuth0();
return (
<>

<Router>
<Navbar />
<Routes>
<Route path='/' />
</Routes>
</Router>
{isAuthenticated ? (
          <>
            <Profile />
            <LogoutButton />
          </>
        ) : (
          <LoginButton />
        )}
</>
);
}
export default App;


