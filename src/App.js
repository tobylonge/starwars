import React, { useState, useEffect } from "react";
import Loader from "./Utils/Loader";
import Dropdown from "./Components/DropdownComponent";
import TableComponent from "./Components/TableComponent";
import CrawlComponent from "./Components/CrawlComponent";

const StarWarsBackGround = () => {
  const [films, setFilms] = useState([]);
  const [isloading, setIsloading] = useState(true);
  const [isFilmSelected, setIsFilmSelected] = useState(false);
  const [filmDetails, setFilmDetails] = useState([]);
  const [isErrorMsg, setIsErrorMsg] = useState(false);

  useEffect(() => {
    setIsloading(true);
    //check if data already exist it localstorage
    let value = JSON.parse(localStorage.getItem("starwarsfilms"));
    if (value) {
      setFilms(value);
      setIsloading(false);
    } else {
      //fetch from API
      loadData();
    }
  }, []);

  //get starwars data
  const loadData = () => {
    fetch(`https://swapi.co/api/films`)
      .then(response => response.json())
      .then(data => {
        if (data.results) {
          setFilms(data.results);
          //Save to local storage so it loads faster on future loads
          localStorage.setItem("starwarsfilms", JSON.stringify(data.results));
          setIsloading(false);
          setIsErrorMsg(false);
        }
      })
      .catch(error => {
        setIsloading(false);
        setIsErrorMsg(true);
      });
  };

  const viewDetails = film => {
    //close dropdown Modal
    setIsFilmSelected(true);
    setFilmDetails(film);
  };

  return (
    <div className="app">
      <div className="app-wrapper">
        {isloading ? (
          <Loader />
        ) : !isErrorMsg ? (
          <div className="container">
            <Dropdown data={films} viewDetails={film => viewDetails(film)} />
            {!isFilmSelected ? (
              <img src="logo.svg" className="app-logo" alt="logo" />
            ) : (
              <React.Fragment>
                <CrawlComponent filmDetails={filmDetails} />
                <TableComponent filmDetails={filmDetails} />
              </React.Fragment>
            )}
          </div>
        ) : (
          <div className="container">
            <p>
              We apologize for any inconvience but an unexpected error occurred while you were browsing our site.
              Please click on the reload button to try again
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StarWarsBackGround;
