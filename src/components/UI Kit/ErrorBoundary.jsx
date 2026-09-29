import React from "react";

// Catches errors while rendering its children (including a page chunk that failed to download)
// and shows `fallback` instead. When `resetKey` changes, for example on navigation, it tries again.
class ErrorBoundary extends React.Component{
    state = {
        hasError: false
    }

    static getDerivedStateFromError(){
        return {
            hasError: true
        }
    }

    componentDidUpdate(prevProps){
        if(this.state.hasError && prevProps.resetKey !== this.props.resetKey){
            this.setState({ hasError: false })
        }
    }

    componentDidCatch(err, info){
        console.log(err, info)
    }

    render(){
        if(this.state.hasError){
            return this.props.fallback
        }

        return this.props.children
    }
}


export default ErrorBoundary
