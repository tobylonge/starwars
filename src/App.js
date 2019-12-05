import React, { useState, useEffect } from "react";
import axios from "axios";
import localForage from "localforage";
import Loader from "./Utils/Loader";
import Dropdown from "./Components/DropdownComponent";
import TableComponent from "./Components/TableComponent";
import CrawlComponent from "./Components/CrawlComponent";

const StarWarsBackGround = () => {

    const [starwars, setStarwars] = useState([]);
    const [isloading, setIsloading] = useState(true);
    const [isDetails, setIsDetails] = useState(false);
    const [movieDetails, setMovieDetails] = useState([]);
    const [isErrorMsg, setIsErrorMsg] = useState(false);


  useEffect(() => {
    setIsloading(true);
      //check if data already exist it localstorage
      localForage.getItem("starwarsfilms", (err, value) => {
        if (value) {
          setStarwars(value);
          setIsloading(false);
        } else {
          //fetch from API
          loadData();
        }
      });
  }, []);

  useEffect(() => {
    localForage.setItem("starwarsfilms", starwars).catch(err => {
      console.log(err);
    });
  }, [starwars])

  //get starwars data
  const loadData = () => {
    axios
      .get(`https://swapi.co/api/films`)
      .then(response => {
        if (response.data.results) {

          setStarwars(response.data.results);
          //Save to local storage so it loads faster on future loads
            setIsloading(false);
            setIsErrorMsg(false);
        }
      })
      .catch(error => {
        setIsloading(false);
        setIsErrorMsg(true);
      });
  };



  const viewDetails = movie => {
    //close dropdown Modal
    setIsDetails(true);
    setMovieDetails(movie);
  };

  
    return (
      <div className="app">
        <div className="app-wrapper">
          {isloading ? (
            <Loader />
          ) : (
            !isErrorMsg ?
            <div className="container">
              <Dropdown data={starwars} viewDetails={movie => viewDetails(movie)} />
              {!isDetails ? (
                <img src="logo.svg" className="app-logo" alt="logo" />
              ) : (
                <React.Fragment>
                  <CrawlComponent movieDetails={movieDetails} />
                  <TableComponent movieDetails={movieDetails} />
                </React.Fragment>
              )}
            </div>
            :
            <div className="container">
              <p>We apologize for any inconvience but an unexpected error occurred while you were browsing our site. Please click on the reload button to try again</p>
            </div>
          )}
        </div>
      </div>
    );
}

export default StarWarsBackGround;
