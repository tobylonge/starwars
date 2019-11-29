import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import axios from "axios";
import Loader from "../Utils/Loader";
import {_sumEle, _sortDescLetters, _sortDescNumbers, _sortAscNumbers, _sortAscLetters, _getYear} from '../Utils/helpers';
import localForage from "localforage";

const TableComponent = props => {

  const [characters, setCharacters] = useState([]);
  const [backupCharacters, setBackupCharacters] = useState([]);
  const [isloading, setIsloading] = useState(true);
  const [movieDetails, setMovieDetails] = useState([]);
  const [nameUp, setNameUp] = useState(true);
  const [genderUp, setGenderUp] = useState(true);
  const [heightUp, setHeightUp] = useState(true);
  const [gender, setGender] = useState('');
  const [heightSum, setHeightSum] = useState(0);
  const [errorMsg, setErrorMsg] = useState(false);
  const [genders, setGenders] = useState([]);
  const [people, setPeople] = useState([]);

  //Function to add the sum of heights of characters
  const sumofHeight = () => {
    const heightSum = _sumEle(characters);
    setHeightSum(heightSum);
    setIsloading(false);
  }
  

  useEffect(() => {
    console.log(new Date());
    if(characters && characters.length > 0) {
      people.push({characters: characters, year: _getYear(movieDetails.release_date)});

      setPeople(people);
      localForage.setItem("starwarspeople", people).catch(err => {
        console.log(err);
      });
      
      console.log('people ', people);
    }

    sortCharacters('nameUp', 'name');
    getGenders(characters);
    setIsloading(false);
    sumofHeight();
  }, [characters]);

  // const firstUpdate = useRef(true);
  // useLayoutEffect(() => {
  //   if (firstUpdate.current) {
  //     firstUpdate.current = false;
  //     return;
  //   }
  //   //your function
  //   console.log(new Date());
  //   if(characters && characters.length > 0) {
  //     people.push({characters: characters, year: _getYear(movieDetails.release_date)});

  //     setPeople(people);
  //     localForage.setItem("starwarspeople", people).catch(err => {
  //       console.log(err);
  //     });
      
  //     console.log('people ', people);
  //   }

  //   sortCharacters('nameUp', 'name');
  //   getGenders(characters);
  //   setIsloading(false);
  //   sumofHeight();
  // }, [characters]);

  useEffect(() => {
    console.log('In the component');
    setMovieDetails(props.movieDetails);
  }, []);

  useEffect(() => {
    checkStorage();
  }, [movieDetails]);

  const getCharacters = async () => {
    let list = [];

    await props.movieDetails.characters.forEach((character) => {
        list.push(axios.get(character));
    })


    axios.all(list)
    .then(axios.spread((...responses) => {
        const characters = responses.map(charc => charc.data);

        setCharacters(characters);
        setBackupCharacters(characters);

    })).catch(error => {
        console.log('Get Characters api error ', error);
        setIsloading(false);
        setErrorMsg(true);
      });
  };

  const getGenders = (characters) => {
    let genders = [];
    characters.forEach(character => {
      if(genders.indexOf(character.gender) === -1) {
        genders.push(character.gender);
      }
    });

    setGenders(genders)
  }

  const sortAscending = (data, element) => {
    if(element === 'height') {
      _sortAscNumbers(data, element);
      setHeightUp(!heightUp);
    }
    else {
      _sortAscLetters(data, element);
      if(element === 'name') {
        setNameUp(!nameUp);
      }
      else if (element === 'gender') {
        setGenderUp(!genderUp)
      }
    }
  }

  const sortDecending = (data, element) => {
    if(element === 'height') {
      _sortDescNumbers(data, element);
      setHeightUp(!heightUp);
    }
    else {
      _sortDescLetters(data, element);
      if(element === 'name') {
        setNameUp(!nameUp);
      }
      else if (element === 'gender') {
        setGenderUp(!genderUp)
      }
    }
  }

  const sortCharacters = (element) => {
    console.log('sort characters data ', characters)
    if(element) {
      sortAscending(characters, element);
    }
    else {
        sortDecending(characters, element)
    }
  }


  //handle Gender select change and fi
  const handleGenderChange = (e) => {

    setIsloading(true);
    const value = e.target.value;
    setGender(value);

    if(value.toUpperCase() === 'ALL') {
      setCharacters(backupCharacters);
      sumofHeight();
    }
    else {
      const filteredCharacters = backupCharacters.filter(character => character.gender.toUpperCase() === value.toUpperCase());
      setCharacters(filteredCharacters);
      sumofHeight();
    }
  }


  //Check LocalStorage for Data
  const checkStorage = () => {
    console.log('store ');
    localForage.getItem("starwarspeople", (err, value) => {
      if (value) {
        console.log('value ', value);
        setPeople(value);
        if(people && people.length > 0) {
          const details = people.filter(p => p.year === _getYear(movieDetails.release_date));
          if(details && details.length > 0) {
            setCharacters(details[0].characters);
            // sortCharacters('nameUp', 'name');
            // getGenders(characters);
            // setIsloading(false);
            // sumofHeight();
          }
          else {
            getCharacters();
          }
        }
        else {
          getCharacters();
        }
      }
      else {
        getCharacters();
      }
    });
  }

  


  return (
    <React.Fragment>
      {isloading ?
      <Loader /> :
      <div className="table-wrapper">
        <div className="select-box">
          <select className="select" onChange={e => handleGenderChange(e)} value={gender}>
            <option>All</option>
            {genders && genders.map((gender,key) => (
              <option value={gender} key={key}>{gender}</option>
            ))}
          </select>
        </div>
        <table className="container-table">
        <thead>
          <tr>
            <th onClick={() => sortCharacters('name')}>
              <h1>Name <i className={`icon ${nameUp ? 'up' : 'down'}`}></i></h1>
            </th>
            <th onClick={() => sortCharacters('gender')}>
              <h1>Gender  <i className={`icon ${genderUp ? 'up' : 'down'}`}></i></h1>
            </th>
            <th onClick={() => sortCharacters('height')}>
              <h1>Height <i className={`icon ${heightUp ? 'up' : 'down'}`}></i></h1>
            </th>
          </tr>
        </thead>
        <tbody>
        {characters && !errorMsg ?
          <React.Fragment>
          {characters.length > 0 ? (
            <React.Fragment>
            {characters.map((character, key) => (
              <tr key={key}>
                <td>{character.name} </td>
                <td>{window.screen.width > 768 ? character.gender : character.gender.charAt(0)}</td>
                <td>{character.height}{isNaN(character.height) ? '' : 'cm'}</td>
              </tr>
            ))}
            <tr>
                <td>{characters.length} Characters</td>
                <td></td>
                <td>{heightSum}cm ({(heightSum * 0.0328084).toFixed(2)}ft/ {(heightSum * 0.393701).toFixed(2)}in)</td>
            </tr>
            </React.Fragment>
          ) : (
            <tr>
              <td colSpan="3">No character in the movie</td>
            </tr>
          )}
          </React.Fragment>
          :
          <tr>
            <td colSpan="3">We apologize for any inconvience but an unexpected error occurred while you were browsing our site. Please click on the reload button to try again</td>
          </tr>
          }
        </tbody>
      </table>
      </div>
        }
    </React.Fragment>
  )
}

export default TableComponent;
