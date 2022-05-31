import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);

  const [requests, setRequests] = useState(0);
  const [loading, setLoading] = useState(false);
    const [error, setError] = useState({show: false, message: ''});
  const checkRequests = async() => {
    setLoading(true);
    await axios(`${rootUrl}/rate_limit`)
      .then((data) => {
        let remaining = data.data.rate.remaining;
        setRequests(remaining);
        console.log(requests);
        if(remaining === 0){
            toggleError(true, 'You have reached your request limit. Please wait a minute and try again.')
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    checkRequests();
  }, []);
const toggleError = (show, message) => {
    setError({show, message});
}
  return (
    <GithubContext.Provider value={{ githubUser, repos, followers, requests, error }}>
      {children}
    </GithubContext.Provider>
  );
};
export { GithubContext, GithubProvider };
