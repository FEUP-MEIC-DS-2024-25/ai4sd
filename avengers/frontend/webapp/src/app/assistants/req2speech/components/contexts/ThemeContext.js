"use client"

import { createContext, useState, useEffect } from "react"

const getInitialTheme = _ => {
  if (typeof window !== "undefined" && window.localStorage) {
    const storedPrefs = window.localStorage.getItem("color-theme")
    if (typeof storedPrefs === "string") {
      return storedPrefs
    }

    const userMedia = window.matchMedia("(prefers-color-scheme: dark)")
    if (userMedia.matches) {
      return "dark"
    }
  }

  // If you want to use dark theme as the default, return "dark" instead
  return "light"
}

export const ThemeContext = createContext()

export const ThemeProvider = ({ initialTheme, children }) => {
  const [theme, setTheme] = useState(getInitialTheme)

  const rawSetTheme = theme => {
    const body = window.document.body
    const isDark = theme === "dark"

    body.classList.remove(isDark ? "light" : "dark")
    body.classList.add(theme)

    localStorage.setItem("color-theme", theme)
  }

  if (initialTheme) {
    rawSetTheme(initialTheme)
  }

  useEffect(
    _ => {
      rawSetTheme(theme)
    },
    [theme]
  )

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}