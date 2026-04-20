    import { useAuth } from "../hooks/useAuth";
    import { Navigate } from "react-router";
    import React from 'react'
    import Loader from "../../common/Loader";

    const Protected = ({children}) => {
        const { loading,user } = useAuth()


        if(loading){
            return (<Loader />)
        }

        if(!user){
            return <Navigate to={'/login'} />
        }
        
        return children
    }

    export default Protected