"use client"

import { useState } from "react"
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

//Icons 
import {MoveLeft, Send} from "lucide-react"

export default function ForgotDialog({ open, setOpen, backToLogin }) {

  const [email, setEmail] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Password reset requested for:", email)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] text-black">
        <DialogHeader>
          <DialogTitle>Forgot Password</DialogTitle>
          <DialogDescription>
            Enter your email address and we'll send you a link to reset your password.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <div className="flex flex-row justify-between w-full mt-4">
                <Button className="bg-gray-600" onClick={() => { setOpen(false); backToLogin(true) } }>
                  <span className="flex flex-row items-center space-x-2">
                    <span><MoveLeft/></span>
                    <span>Back</span>
                  </span>
                </Button>
                <Button>
                  <span className="flex flex-row items-center space-x-2">
                    <span>Send</span>
                    <span><Send/></span>
                  </span>
                </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
