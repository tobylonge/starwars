import React, { Component } from "react";
import axios from "axios";
import Loader from "../Utils/Loader";

class tableComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      characters: [],
      backupCharacters: [],
      isloading: true,
      movieDetails: [],
      sortUp: true,
      gender: '',
      heightSum: 0,
      isloading: true,
      errorMsg: false,
      genders: []
    };
  }

  getCharacters = async () => {
    let list = [];

    await this.state.movieDetails.characters.forEach((character) => {
        list.push(axios.get(character));
    })


    axios.all(list)
    .then(axios.spread((...responses) => {
        this.setState({ characters: responses, backupCharacters: responses}, () => {
          this.sortCharacters();
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
      if(genders.indexOf(character.data.gender) === -1) {
        genders.push(character.data.gender);
      }
    });

    this.setState({genders})
  }

  sortAscending = data => {
    console.log('I am ascending');
    data.sort((a,b) => (a.data.name > b.data.name) ? 1 : ((b.data.name > a.data.name) ? -1 : 0));
    this.setState({sortUp: !this.state.sortUp});
  }

  sortDecending = data => {
    console.log('I got to decending');
    data.sort((a,b) => (a.data.name > b.data.name) ? -1 : ((b.data.name > a.data.name) ? 1 : 0));
    this.setState({sortUp: !this.state.sortUp});
  }

  sortCharacters = () => {
    if(this.state.sortUp) {
        this.sortAscending(this.state.characters);
    }
    else {
        this.sortDecending(this.state.characters)
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
        const filteredCharacters = characters.filter(character => character.data.gender.toUpperCase() === value.toUpperCase());
        this.setState({characters: filteredCharacters}, () => {
          this.sumofHeight();
        })
      }
    })
  }

  //Function to add the sum of heights of characters
  sumofHeight = () => {
    let characters = [...this.state.characters]
    const heightSum = characters.reduce((acc, char) => {
      if(!isNaN(char.data.height)) {
        acc += Number(char.data.height);
      }
      return acc;
    }, 0);
    this.setState({heightSum}, () => {
      this.setState({isloading: false});
    })
  }

  componentDidMount = () => {
    this.setState({ movieDetails: this.props.movieDetails }, () => {
      this.getCharacters();
    });
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.movieDetails !== this.props.movieDetails) {
      this.setState({isloading: true});
      this.setState({movieDetails: nextProps.movieDetails}, () => {
          this.getCharacters();
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
              this.state.genders.map(gender => (
                <option value={gender}>{gender}</option>
              ))}
            </select>
          </div>
          <table className="container-table">
          <thead>
            <tr onClick={this.sortCharacters}>
              <th>
                <h1>Name <i className={`icon ${this.state.sortUp ? 'up' : 'down'}`}></i></h1>
              </th>
              <th>
                <h1>Sex</h1>
              </th>
              <th>
                <h1>Height</h1>
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
                  <td>{character.data.name} </td>
                  <td>{window.screen.width > 768 ? character.data.gender : character.data.gender.charAt(0)}</td>
                  <td>{character.data.height}{isNaN(character.data.height) ? '' : 'cm'}</td>
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
