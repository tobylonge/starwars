import React, { Component } from "react";
import axios from "axios";

class tableComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      characters: [],
      isloading: true,
      movieDetails: []
    };
  }

  getCharacters = () => {
    let characters = [];
    this.state.movieDetails.characters.forEach((character, i) => {
      axios
        .get(character)
        .then(response => {
          console.log("response ", response);
          characters.push(response.data);
          if (i + 1 === this.state.movieDetails.characters.length) {
            this.setState({ characters }, () => {
              console.log("characters ", this.state.characters);
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    });
  };
  componentDidMount = () => {
    console.log("details ", this.props.movieDetails);
    this.setState({ movieDetails: this.props.movieDetails }, () => {
      this.getCharacters();
    });
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.movieDetails !== this.props.movieDetails) {
      this.setState({movieDetails: nextProps.movieDetails}, () => {
          console.log('nextProps ', this.state.movieDetails);
          this.getCharacters();
      });
    }
  };

  render() {
    {
      console.log("render movie", this.state.characters);
    }
    return (
      <table className="container">
        <thead>
          <tr>
            <th>
              <h1>Name</h1>
            </th>
            <th>
              <h1>Gender</h1>
            </th>
            <th>
              <h1>Height</h1>
            </th>
          </tr>
        </thead>
        <tbody>
          {this.state.characters ? (
            this.state.characters.map(character => (
              <tr>
                <td>{character.name}</td>
                <td>{character.gender}</td>
                <td>{character.height}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td>No character in the movie</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}

export default tableComponent;
