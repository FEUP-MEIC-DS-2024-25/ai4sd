'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

//Authentication Related Dialogs
import LoginDialog from "@/app/components/auth/loginDialog"
import SignUpDialog from "@/app/components/auth/signupDialog"
import ForgotDialog from "@/app/components/auth/forgotDialog"

// Pictures
import logo from "@/app/pictures/logo.svg";

export default function Navbar() {

  //Navbar Dynamic state
  const [isFixed, setIsFixed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  //Authentication Modals
  const [activeDialog, setActiveDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  //Show other modals
  const [showSignup, setShowSignup] = useState(false); 
  const [showForgot, setShowForgot] = useState(false);
  
  //Auxiliary variables to counter the non-immediate state updates of react 
  const [signup, setSignup] = useState(false); 
  const [forgot, setForgot] = useState(false); 

  //Fix navbar on top uppon scroll
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 100) {
        setIsFixed(true)
      } else {
        setIsFixed(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  //Show Login Dialog
  useEffect(() => {
    if (activeDialog) {
      // Delay showing the dialog to ensure state has updated
      const timer = setTimeout(() => setShowLoginDialog(true), 0);
      return () => clearTimeout(timer);
    } else {
      setShowLoginDialog(false);
    }
  }, [activeDialog]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  //Update the state of the signup variable after the showSignup state fully changes
  useEffect(() => {
    
    if(showSignup){

      // Delay showing the dialog to ensure state has updated
      const timer = setTimeout(() => setSignup(true), 0);
      return () => clearTimeout(timer);
    } else {
      setSignup(false); 
    }
  
  }, [showSignup])
  
  //Update the state of the forgot variable after the showForgot state fully changes
  useEffect(() => {
    
    if(showForgot){
      // Delay showing the dialog to ensure state has updated
      const timer = setTimeout(() => setForgot(true), 0);
      return () => clearTimeout(timer);
    } else {
      setSignup(false); 
    }
  
  }, [showForgot])

  return (
    <nav
      className={`w-full transition-all duration-300 ease-in-out ${
        isFixed
          ? 'fixed top-0 left-0 shadow-md z-50 bg-neutral-950 bg-opacity-70'
          : 'relative bg-neutral-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image src={logo} width={100} height={100} alt='AI4SD'/>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink href="/">Home</NavLink>
              <NavLink href="#" onClick={() => setActiveDialog(true)}>Login</NavLink>
              <NavLink href="#">About</NavLink>
              <NavLink href="#">Contact</NavLink>
              {showLoginDialog && <LoginDialog open={activeDialog} setOpen={setActiveDialog} setShowSignup={setShowSignup} setShowForgot={setShowForgot}/>}
              {signup && <SignUpDialog open={showSignup} setOpen={setShowSignup} backToLogin={setActiveDialog}/>}
              {forgot && <ForgotDialog open={showForgot} setOpen={setShowForgot} backToLogin={setActiveDialog}/>}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200"
            >
                <span className="sr-only">Open navigation menu</span>
            {isMobileMenuOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink href="/" mobile>Home</NavLink>
          <NavLink href="#" mobile>About</NavLink>
          <NavLink href="#" mobile>Services</NavLink>
          <NavLink href="#" mobile>Contact</NavLink>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, children, mobile = false, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${
        mobile
          ? 'block text-base'
          : 'text-sm'
      } text-gray-200 px-3 py-2 rounded-md font-medium relative overflow-hidden group transition-all duration-300 ease-out hover:scale-110`}
    >
      <span className="relative z-10">{children}</span>
      { !mobile && <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gray-200 transform origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></span>}
    </Link>
  )
}

