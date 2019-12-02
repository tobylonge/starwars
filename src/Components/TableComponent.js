import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Utils/Loader";
import {_sumEle, _sortDescLetters, _sortDescNumbers, _sortAscNumbers, _sortAscLetters, _getYear} from '../Utils/helpers';
import localForage from "localforage";

const TableComponent = props => {

  const [characters, setCharacters] = useState([]);
  const [backupCharacters, setBackupCharacters] = useState([]);
  const [isloading, setIsloading] = useState(true);
  const [nameUp, setNameUp] = useState(true);
  const [genderUp, setGenderUp] = useState(true);
  const [heightUp, setHeightUp] = useState(true);
  const [heightSum, setHeightSum] = useState(0);
  const [errorMsg, setErrorMsg] = useState(false);
  const [genders, setGenders] = useState([]);
  const [gender, setGender] = useState('');
  const [people, setPeople] = useState([]);

  //Function to add the sum of heights of characters
  const sumofHeight = () => {
    const heightSum = _sumEle(characters);
    setHeightSum(heightSum);
    setIsloading(false);
  }
  

  useEffect(() => {
    if(characters && characters.length > 0) {
      const details = people.filter(p => p.year === _getYear(props.movieDetails.release_date));
      if(details && details.length === 0) {
        people.push({characters: characters, year: _getYear(props.movieDetails.release_date)});

        setPeople(people);
        localForage.setItem("starwarspeople", people).catch(err => {
          console.log(err);
        });
    }
      

      sortAscending(characters, 'name');
      getGenders(characters);
      setIsloading(false);
    
    }
  }, [backupCharacters]);

  useEffect(() => {
    sumofHeight();
  }, [characters])


  useEffect(() => {
    checkStorage();
    setIsloading(true);
  }, [props.movieDetails]);




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
        setIsloading(false);
        setErrorMsg(true);
      });
  };

  const getGenders = (characters) => {
    let genders = ['All'];
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
    if(element === 'name') {
      if(nameUp) {
        sortAscending(characters, element);
      }
      else {
        sortDecending(characters, element)
      }
    }
    else if(element === 'gender') {
      if(genderUp) {
        sortAscending(characters, element);
      }
      else {
        sortDecending(characters, element)
      }
    }
    else if(element === 'height') {
      if(heightUp) {
        sortAscending(characters, element);
      }
      else {
        sortDecending(characters, element)
      }
    }
  }


  //handle Gender select change and fi
  const handleGenderChange = (e) => {
    setIsloading(true);
    const value = e.target.value;
    setGender(value);

    if(value.toUpperCase() === 'ALL') {
      setCharacters(backupCharacters);
      // sumofHeight();
    }
    else {
      const filteredCharacters = backupCharacters.filter(character => character.gender.toUpperCase() === value.toUpperCase());
      setCharacters(filteredCharacters);
      // sumofHeight();
    }
  }


  //Check IndexDB for Data
  const checkStorage = () => {
    localForage.getItem("starwarspeople", (err, value) => {
      if (value) {
        if(value && value.length > 0) {
          setPeople(value);
          const details = value.filter(p => p.year === _getYear(props.movieDetails.release_date));
          if(details && details.length > 0) {
            setCharacters(details[0].characters);
            setBackupCharacters(details[0].characters);
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
            {genders && genders.map((g,key) => (
              <option value={g} key={key}>{g}</option>
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
