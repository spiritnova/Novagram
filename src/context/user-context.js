import React, { useContext } from  'react'

const UserContext = React.createContext({
    userData : ''
});

const useData = () =>{
    return useContext(UserContext)
}

export {UserContext, useData};