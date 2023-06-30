import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { Profile } from './Profile'; 

function Navbar() {
  const { isAuthenticated, loginWithRedirect, logout} = useAuth0();
  const [click, setClick] = useState(false);

  const handleLogin = () => {
    loginWithRedirect();
  };

  const handleLogout = () => {
    logout();
  };
  
  const handleSignUp =() =>{
    loginWithRedirect({ screen_hint: 'signup' });
  }
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  useEffect(() => {
    const showButton = () => {
      if (window.innerWidth <= 960) {
        setClick(false);
      }
    };

    showButton();
    window.addEventListener('resize', showButton);

    return () => {
      window.removeEventListener('resize', showButton);
    };
  }, []);

  return (
    <>
      <nav className='navbar'>
  <div className='navbar-container'>
    <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
      LOVELY Perfume
      <i className='fab fa-typo3' />
    </Link>
    <div className='menu-icon' onClick={handleClick}>
      <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
    </div>
    <ul className={click ? 'nav-menu active' : 'nav-menu'}>      
     
      {isAuthenticated ? (
        <>
           <li className='nav-item'>
        <Link
          to='/services'
          className='nav-links'
          onClick={closeMobileMenu}
        >
          Services
        </Link>
      </li>
      <li className='nav-item'>
        <Link
          to='/products'
          className='nav-links'
          onClick={closeMobileMenu}
        >
          Products
        </Link>
      </li>
          <li className='nav-item'>
            <span className='nav-links' onClick={handleLogout}>
              Cerrar sesión
            </span>
          </li>
          <li className='nav-item'>
            <Profile /> 
          </li>
        </>
      ) : (
        <><li className='nav-item'>
                  <span className='nav-links' onClick={handleLogin}>
                    Iniciar sesión
                  </span>
                </li><li className='nav-item'>
                    <span className='nav-links' onClick={handleSignUp}>Sign-Up</span>
                  </li></>   
      )}
      {!isAuthenticated && (
            
            <li className='nav-item'>
              <Link to='/sign-up' className='nav-links-mobile' onClick={closeMobileMenu}>
                Sign Up
              </Link>
            </li>
          )}
    </ul>
  </div>
</nav>
</>
  );
}

export default Navbar;
