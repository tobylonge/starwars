import React, { Component } from "react";
import axios from "axios";
import Loader from "../Utils/Loader";
import {_sumEle, _sortDescLetters, _sortDescNumbers, _sortAscNumbers, _sortAscLetters, _getYear} from '../Utils/helpers';
import localForage from "localforage";

class tableComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      characters: [],
      backupCharacters: [],
      isloading: true,
      movieDetails: [],
      nameUp: true,
      genderUp: true,
      heightUp: true,
      gender: '',
      heightSum: 0,
      isloading: true,
      errorMsg: false,
      genders: [],
      people: []
    };
  }

  getCharacters = async () => {
    let list = [];
    let people = [...this.state.people]; 

    await this.state.movieDetails.characters.forEach((character) => {
        list.push(axios.get(character));
    })


    axios.all(list)
    .then(axios.spread((...responses) => {
        const characters = responses.map(charc => charc.data);
        this.setState({ characters: characters, backupCharacters: characters}, () => {
          //Saving data to localforage
          people.push({characters: this.state.characters, year: _getYear(this.state.movieDetails.release_date)});
          this.setState({people}, () => {
            localForage.setItem("starwarspeople", this.state.people).catch(err => {
              console.log(err);
            });
          })
          
          console.log('people ', people);

          this.sortCharacters('nameUp', 'name');
          this.getGenders(this.state.characters);
          this.setState({isloading: false});
          this.sumofHeight();
        });

    })).catch(error => {
        console.log('Get Characters api error ', error);
        this.setState({errorMsg: true});
      });
  };

  getGenders = (characters) => {
    let genders = [];
    characters.forEach(character => {
      if(genders.indexOf(character.gender) === -1) {
        genders.push(character.gender);
      }
    });

    this.setState({genders})
  }

  sortAscending = (data, term, element) => {
    if(element === 'height') {
      _sortAscNumbers(data, element);
    }
    else {
      _sortAscLetters(data, element);
    }

    this.setState({[term]: !this.state[term]});
  }

  sortDecending = (data, term, element) => {
    if(element === 'height') {
      _sortDescNumbers(data, element);
    }
    else {
      _sortDescLetters(data, element);
    }
    this.setState({[term]: !this.state[term]});
  }

  sortCharacters = (term, element) => {
    console.log('sort characters data ', this.state.characters)
    if(this.state[term]) {
        this.sortAscending(this.state.characters, term, element);
    }
    else {
        this.sortDecending(this.state.characters, term, element)
    }
  }


  // handle Gender select change and fi
  handleGenderChange = (e) => {

    this.setState({isloading: true});
    const value = e.target.value;
    this.setState({gender: value}, () => {
      let characters = [...this.state.backupCharacters];
      if(value.toUpperCase() === 'ALL') {
        this.setState({characters}, () => {
          this.sumofHeight();
        })
      }
      else {
        const filteredCharacters = characters.filter(character => character.gender.toUpperCase() === value.toUpperCase());
        this.setState({characters: filteredCharacters}, () => {
          this.sumofHeight();
        })
      }
    })
  }

  //Function to add the sum of heights of characters
  sumofHeight = () => {
    let characters = [...this.state.characters]
    const heightSum = _sumEle(characters)
    this.setState({heightSum}, () => {
      this.setState({isloading: false});
    })
  }

  //Check LocalStorage for Data
  checkStorage = () => {
    localForage.getItem("starwarspeople", (err, value) => {
      if (value) {
        this.setState({people: value}, () => {
          let people = [...this.state.people];
          if(people && people.length > 0) {
            const details = people.filter(p => p.year === _getYear(this.state.movieDetails.release_date));
            console.log('details ', details);
            if(details && details.length > 0) {
              this.setState({characters: details[0].characters}, () => {
                this.sortCharacters('nameUp', 'name');
                this.getGenders(this.state.characters);
                this.setState({isloading: false});
                this.sumofHeight();
              });

            }
            else {
              this.getCharacters();
            }
          }
          else {
            this.getCharacters();
          }
        })
      }
      else {
        this.getCharacters();
      }
    });
  }

  componentDidMount = () => {
    console.log('In the component');
    this.setState({ movieDetails: this.props.movieDetails }, () => {
      this.checkStorage();
    });
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.movieDetails !== this.props.movieDetails) {
      this.setState({isloading: true});
      this.setState({movieDetails: nextProps.movieDetails}, () => {
        this.checkStorage();
      });
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.state.isloading ?
        <Loader /> :
        <div className="table-wrapper">
          <div className="select-box">
            <select className="select" onChange={e => this.handleGenderChange(e)} value={this.state.gender}>
              <option>All</option>
              {this.state.genders &&
              this.state.genders.map((gender,key) => (
                <option value={gender} key={key}>{gender}</option>
              ))}
            </select>
          </div>
          <table className="container-table">
          <thead>
            <tr>
              <th onClick={() => this.sortCharacters('nameUp', 'name')}>
                <h1>Name <i className={`icon ${this.state.nameUp ? 'up' : 'down'}`}></i></h1>
              </th>
              <th onClick={() => this.sortCharacters('genderUp', 'gender')}>
                <h1>Gender  <i className={`icon ${this.state.genderUp ? 'up' : 'down'}`}></i></h1>
              </th>
              <th onClick={() => this.sortCharacters('heightUp', 'height')}>
                <h1>Height <i className={`icon ${this.state.heightUp ? 'up' : 'down'}`}></i></h1>
              </th>
            </tr>
          </thead>
          <tbody>
          {this.state.characters && !this.state.errorMsg ?
            <React.Fragment>
            {this.state.characters.length > 0 ? (
              <React.Fragment>
              {this.state.characters.map((character, key) => (
                <tr key={key}>
                  <td>{character.name} </td>
                  <td>{window.screen.width > 768 ? character.gender : character.gender.charAt(0)}</td>
                  <td>{character.height}{isNaN(character.height) ? '' : 'cm'}</td>
                </tr>
              ))}
              <tr>
                  <td>{this.state.characters.length} Characters</td>
                  <td></td>
                  <td>{this.state.heightSum}cm ({(this.state.heightSum * 0.0328084).toFixed(2)}ft/ {(this.state.heightSum * 0.393701).toFixed(2)}in)</td>
              </tr>
              </React.Fragment>
            ) : (
              <tr>
                <td colspan="2">No character in the movie</td>
              </tr>
            )}
            </React.Fragment>
            :
            <tr>
              <td colspan="2">We apologize for any inconvience but an unexpected error occurred while you were browsing our site. Please click on the reload button to try again</td>
            </tr>
            }
          </tbody>
        </table>
        </div>
         }
      </React.Fragment>
    );
  }
}

export default tableComponent;
