"use client"

import { ChevronRight, Plus, User, Settings, LogOut } from "lucide-react"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useState } from "react"

import DarkModeToggle from "./DarkModeToggle"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog"

export default function Header({ user = { name: "User", avatar: "/placeholder.svg?height=40&width=40" }, isCollapsed = false, toggleCollapse = () => {} }) {
    const [dialogOpen, setDialogOpen] = useState(false)

    return (
        <div 
            className="absolute top-0 right-5 flex flex-row justify-between items-center transition-all duration-300 ease-in-out mt-4"
        >
            <div className="flex flex-row space-x-4 items-center mr-4">

                {/* Darkmode */}
                <DarkModeToggle/>

                {/* Profile */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex flex-row items-center space-x-4 dark:text-gray-200 text-gray-800">
                        <p className="text-sm font-semibold">{user.name}</p>
                        <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src={user.avatar} alt="User Image" />
                            <AvatarFallback>{user.name}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                            <User size={16} className="mr-2" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onSelect={() => setDialogOpen(true)}>
                            <Settings size={16} className="mr-2" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                            <LogOut size={16} className="mr-2" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Settings</DialogTitle>
                        <DialogDescription>
                            TODO
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}