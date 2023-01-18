import Cookie from 'js-cookie';

const useCookie = (action, cookiename, value) =>{
    if (action === 'set'){
        Cookie.set(cookiename, value, {
            expires: 30, // Expires after 30 days
            secure: true,
            sameSite: 'none',
            path:'/'
        })
    }
    else if(action === 'get'){
       return Cookie.get(cookiename)
    }
    else if(action === 'remove'){
        return Cookie.remove(cookiename)
    }
}

export default useCookie;