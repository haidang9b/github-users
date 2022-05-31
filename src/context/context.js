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
  const [error, setError] = useState({ show: false, message: "" });

  const checkRequests = async () => {
    setLoading(true);
    await axios(`${rootUrl}/rate_limit`)
      .then((data) => {
        let remaining = data.data.rate.remaining;
        setRequests(remaining);
        if (remaining === 0) {
          toggleError(
            true,
            "You have reached your request limit. Please wait a minute and try again."
          );
        } else {
          toggleError();
        }
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const searchGithubUser = async (user) => {
    setLoading(true);
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    );
    console.log(response);
    if (response) {
      const { login, followers_url } = response.data;
      setGithubUser(response.data);
      setLoading(false);
      getUserRepos(login);
      getUserFollowers(followers_url);
    } else {
      toggleError(true, "User not found");
    }
    checkRequests();
  };

  const getUserRepos = async (user) => {
    const response = await axios(
      `${rootUrl}/users/${user}/repos?per_page=100`
    ).catch((err) => console.log(err));
    if (response) {
      setRepos(response.data);
    } else {
      toggleError(true, "User not found");
    }
  };

  const getUserFollowers = async (followers_url) => {
    const response = await axios(`${followers_url}?per_page=100`).catch((err) =>
      console.log(err)
    );
    if (response) {
      setFollowers(response.data);
    } else {
      toggleError(true, "User not found");
    }
  };

  useEffect(() => {
    checkRequests();
    // eslint-disable-next-line
  }, []);
  const toggleError = (show = false, message = "") => {
    setError({ show, message });
  };
  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        toggleError,
        loading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};
export { GithubContext, GithubProvider };
