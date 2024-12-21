"use client"

import React, { useEffect, useRef } from "react"
import { Textarea } from "./textarea"

export default function ExpandingTextarea({
  handleSubmit,
  message,
  setMessage, 
  placeholder = "Type a message...",
  maxHeight = 250,
}) {

  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`
    }
  }, [message, maxHeight])

  const handleChange = (e) => {
    setMessage(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if(message.trim()){
        setMessage(message.trim())
        handleSubmit()
        setMessage("")
      }
    }
  }

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="pr-12 min-h-[48px] max-h-[250px] resize-none overflow-y-auto dark:text-gray-200 "
      />
    </div>
  )
}