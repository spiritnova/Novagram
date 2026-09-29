import React, { useContext, useEffect, useState } from "react"

const ThemeContext = React.createContext()
const ThemeUpdateContext = React.createContext()

const STORAGE_KEY = 'novagram_theme'

export function useTheme(){
    return useContext(ThemeContext)
}

export function useThemeUpdate(){
    return useContext(ThemeUpdateContext)
}

// A saved choice wins; otherwise follow the visitor's system setting
function initialTheme(){
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if(saved) return saved === 'dark'
    } catch {
        // storage unavailable, fall through to the system setting
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

export function ThemeProvider({ children }){
    const [darkTheme, setDarkTheme] = useState(initialTheme)

    // Design tokens (src/styles/tokens.css) switch on this attribute
    useEffect(() => {
        document.documentElement.dataset.theme = darkTheme ? 'dark' : 'light'
        try {
            localStorage.setItem(STORAGE_KEY, darkTheme ? 'dark' : 'light')
        } catch {
            // the choice just won't persist
        }
    }, [darkTheme])

    function toggleTheme(){
        setDarkTheme(current => !current)
    }

    return(
        <ThemeContext.Provider value={darkTheme}>
            <ThemeUpdateContext.Provider value={toggleTheme}>
                    {children}
            </ThemeUpdateContext.Provider>
        </ThemeContext.Provider>
    )
}
