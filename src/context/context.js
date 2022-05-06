import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

const GithubProvider = ({children}) => {

    const [githubUser, setGithubUser] = useState(mockUser);
    const [repos,setRepos] = useState(mockRepos);
    const [followers,Setfollowers] = useState(mockFollowers);

    const [request,setRequest] = useState(0);
    const[loading,setLoading] = useState(false);
    const [error,setError] = useState({show : false, msg : ''});

    const searchGithubUser = async (user) => {
        toggleError();
        setLoading(true);
        const response = await axios(`${rootUrl}/users/${user}`).catch(error => console.log(error));
        if (response){
            setGithubUser(response.data)
            
            const {login,followers_url} = response.data;

            //repose
            axios(`${rootUrl}/users/${login}/repos?per_page=100`).then(response => setRepos(response.data) )
            //followers
            axios(`${followers_url}?per_page=100`).then(response => Setfollowers(response.data) )

        }else{
            toggleError(true,'User not found...')
        }

        checkRequest();
        setLoading(false);


    }

    const checkRequest = () => {
        axios(`${rootUrl}/rate_limit`).then(({data :{rate : {remaining}}}) =>{
            setRequest(remaining)
            if(remaining === 0){

                toggleError(true , 'Sorry! You are out of hourly requests limit...')   
            }

        }).catch((error) => console.log(error))
    }

    const toggleError = (show = false,msg = '') => {
        setError({show,msg})
    }

    useEffect(checkRequest,[])

    return <GithubContext.Provider value={{githubUser,repos,followers,request,error,searchGithubUser,loading}}>{children}</GithubContext.Provider>

};

export {GithubProvider, GithubContext};
