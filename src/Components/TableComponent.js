import React, { useState, useEffect } from "react";
import Loader from "../Utils/Loader";
import { _sumEle, _sortArrayLetters, _sortArrayNumbers, _getYear, _convertFeetInch } from "../Utils/helpers";

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
  const [gender, setGender] = useState("");
  const [people, setPeople] = useState([]);
  const [active, setActive] = useState(0);

  //Function to add the sum of heights of characters
  const sumofHeight = () => {
    const heightSum = _sumEle(characters);
    setHeightSum(heightSum);
    setIsloading(false);
  };

  useEffect(() => {
    if (characters && characters.length > 0) {
      const details = people.filter(p => p.year === _getYear(props.filmDetails.release_date));
      if (details && details.length === 0) {
        people.push({ characters: characters, year: _getYear(props.filmDetails.release_date) });

        setPeople(people);
        localStorage.setItem("starwarspeople", JSON.stringify(people));
      }

      // sortAscending(characters, 'name');
      setActive(1);
      setCharacters(_sortArrayLetters(characters, "name", "asc"));
      setNameUp(false);
      getGenders(characters);
      setIsloading(false);
    }
  }, [backupCharacters]);

  useEffect(() => {
    sumofHeight();
  }, [characters]);

  useEffect(() => {
    checkStorage();
    setIsloading(true);
  }, [props.filmDetails]);

  const getCharacters = async () => {
    let lists = [];

    await props.filmDetails.characters.forEach(character => {
      lists.push(character);
    });

    Promise.all(lists.map(list => fetch(list).then(resp => resp.json())))
      .then(data => {
        const characters = data;
        setCharacters(characters);
        setBackupCharacters(characters);
      })
      .catch(error => {
        setIsloading(false);
        setErrorMsg(true);
      });
  };

  const getGenders = characters => {
    let genders = ["All"];
    characters.forEach(character => {
      if (genders.indexOf(character.gender) === -1) {
        genders.push(character.gender);
      }
    });

    setGenders(genders);
  };

  const sortCharacters = element => {
    if (element === "name") {
      setActive(1);
      if (nameUp) {
        setCharacters(_sortArrayLetters(characters, element, "asc"));
      } else {
        setCharacters(_sortArrayLetters(characters, element, "desc"));
      }
      setNameUp(!nameUp);
    } else if (element === "gender") {
      setActive(2);
      if (genderUp) {
        setCharacters(_sortArrayLetters(characters, element, "asc"));
      } else {
        setCharacters(_sortArrayLetters(characters, element, "desc"));
      }
      setGenderUp(!genderUp);
    } else if (element === "height") {
      setActive(3);
      if (heightUp) {
        setCharacters(_sortArrayNumbers(characters, element, "asc"));
      } else {
        setCharacters(_sortArrayNumbers(characters, element, "desc"));
      }
      setHeightUp(!heightUp);
    }
  };

  //handle Gender select change and fi
  const handleGenderChange = e => {
    setIsloading(true);
    const value = e.target.value;
    setGender(value);

    if (value.toUpperCase() === "ALL") {
      setCharacters(backupCharacters);
      // sumofHeight();
    } else {
      const filteredCharacters = backupCharacters.filter(
        character => character.gender.toUpperCase() === value.toUpperCase()
      );
      setCharacters(filteredCharacters);
      // sumofHeight();
    }
  };

  //Check IndexDB for Data
  const checkStorage = () => {
    let value = JSON.parse(localStorage.getItem("starwarspeople"));
    if (value) {
      if (value && value.length > 0) {
        setPeople(value);
        const details = value.filter(p => p.year === _getYear(props.filmDetails.release_date));
        if (details && details.length > 0) {
          setCharacters(details[0].characters);
          setBackupCharacters(details[0].characters);
        } else {
          getCharacters();
        }
      } else {
        getCharacters();
      }
    } else {
      getCharacters();
    }
  };

  return (
    <React.Fragment>
      {isloading ? (
        <Loader />
      ) : (
        <div className="table-wrapper">
          <div className="select-box">
            <select className="select" onChange={e => handleGenderChange(e)} value={gender}>
              {genders &&
                genders.map((g, key) => (
                  <option value={g} key={key}>
                    {g}
                  </option>
                ))}
            </select>
          </div>
          <table className="container-table">
            <thead>
              <tr>
                <th onClick={() => sortCharacters("name")}>
                  <h1 className={active === 1 ? `active ${nameUp ? "up" : "down"}` : ""}>Name</h1>
                </th>
                <th onClick={() => sortCharacters("gender")}>
                  <h1 className={active === 2 ? `active ${genderUp ? "up" : "down"}` : ""}>Gender</h1>
                </th>
                <th onClick={() => sortCharacters("height")}>
                  <h1 className={active === 3 ? `active ${heightUp ? "up" : "down"}` : ""}>Height</h1>
                </th>
              </tr>
            </thead>
            <tbody>
              {characters && !errorMsg ? (
                <React.Fragment>
                  {characters.length > 0 ? (
                    <React.Fragment>
                      {characters.map((character, key) => (
                        <tr key={key}>
                          <td>{character.name} </td>
                          <td>{window.screen.width > 768 ? character.gender : character.gender.charAt(0)}</td>
                          <td>
                            {character.height}
                            {isNaN(character.height) ? "" : "cm"}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td>{characters.length} Characters</td>
                        <td></td>
                        <td>
                          {heightSum}cm ({_convertFeetInch(heightSum)})
                          {/* {heightSum}cm ({(heightSum * 0.0328084).toFixed(2)}ft/{" "}
                          {(heightSum * 0.393701).toFixed(2)}in) */}
                        </td>
                      </tr>
                    </React.Fragment>
                  ) : (
                    <tr>
                      <td colSpan="3">No character in the movie</td>
                    </tr>
                  )}
                </React.Fragment>
              ) : (
                <tr>
                  <td colSpan="3">
                    We apologize for any inconvience but an unexpected error occurred while you were browsing our
                    site. Please click on the reload button to try again
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </React.Fragment>
  );
};

export default TableComponent;
