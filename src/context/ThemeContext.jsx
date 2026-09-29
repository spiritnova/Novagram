import React, { useContext, useState } from "react"

const ThemeContext = React.createContext()
const ThemeUpdateContext = React.createContext()


export function useTheme(){
    return useContext(ThemeContext)
}

export function useThemeUpdate(){
    return useContext(ThemeUpdateContext)
}


export function ThemeProvider({ children }){
    const [darkTheme, setDarkTheme] = useState(localStorage.getItem('theme') ? true : false)


    function toggleTheme(){
        setDarkTheme(current => !current)
        localStorage.setItem('theme', darkTheme)
    }


    return(
        <ThemeContext.Provider value={darkTheme}>
            <ThemeUpdateContext.Provider value={toggleTheme}>
                    {children}
            </ThemeUpdateContext.Provider>
        </ThemeContext.Provider>
    )
}