"use client"

import { useEffect, useState } from "react"
import Link from 'next/link'
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog"
import { Separator } from "@/app/components/ui/separator"
import { Github, Mail } from 'lucide-react'

export default function LoginDialog({ open, setOpen, setShowSignup, setShowForgot}) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically handle the authentication logic
    console.log("Login attempted with:", { email, password })
    // For demo purposes, we'll just close the dialog
    setOpen(false)
  }

  const handleGoogleLogin = () => {
    console.log("Google login clicked")
    // Implement Google login logic here
  }

  const handleGithubLogin = () => {
    console.log("GitHub login clicked")
    // Implement GitHub login logic here
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] text-black">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>
              Welcome back! Choose your preferred method to access your account.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit">
                  <Mail className="mr-2 h-4 w-4" /> Login with Email
                </Button>
              </div>
            </form>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
            </div>
            <Button variant="outline" onClick={handleGoogleLogin}>
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              Continue with Google
            </Button>
            <Button variant="outline" onClick={handleGithubLogin}>
              <Github className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col items-center sm:items-start">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Button variant="link" className="p-0" onClick={() => { setOpen(false); setShowSignup(true); }}>
                Sign up
              </Button>
              <span>|</span>
              <Button variant="link" className="p-0" onClick={() => { setOpen(false); setShowForgot(true); }}>
                Forgot password?
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

