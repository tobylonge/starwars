import React, { Component } from "react";
import axios from "axios";
import localForage from "localforage";
import logo from "./logo.svg";
import Loader from "./Utils/Loader";
import Dropdown from "./Components/DropdownComponent";
import TableComponent from "./Components/TableComponent";
import CrawlComponent from "./Components/CrawlComponent";

class StarWarsBackGround extends Component {
  constructor(props) {
    super(props);

    this.state = {
      starwars: [],
      isloading: false,
      isDetails: false,
      movieDetails: []
    };
  }

  //get starwars data
  loadData = () => {
    axios
      .get(`https://swapi.co/api/films`)
      .then(response => {
        console.log("response ", response);
        if (response.data.results) {
          this.setState({ starwars: response.data.results }, () => {
            //Save to local storage so it loads faster on future loads
            localForage.setItem("starwars", this.state.starwars).catch(err => {
              console.log(err);
            });
            this.setState({ isloading: false });
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  viewDetails = movie => {
    //close dropdown Modal
    this.setState({ isDetails: true, movieDetails: movie });
    console.log("movie ", movie);
  };

  componentDidMount = () => {
    this.setState({ isloading: true }, () => {
      //check if data already exist it localstorage
      localForage.getItem("starwars", (err, value) => {
        if (value) {
          this.setState({ starwars: value }, () => {
            this.setState({ isloading: false });
          });
        } else {
          //fetch from API
          this.loadData();
        }
      });
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {this.state.isloading ? (
            <Loader />
          ) : (
            <React.Fragment>
              <Dropdown data={this.state.starwars} viewDetails={movie => this.viewDetails(movie)} />
              {!this.state.isDetails ? (
                <img src="logo.svg" className="App-logo" alt="logo" />
              ) : (
                <React.Fragment>
                  <CrawlComponent movieDetails={this.state.movieDetails} />
                  <TableComponent movieDetails={this.state.movieDetails}></TableComponent>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </header>
      </div>
    );
  }
}

export default StarWarsBackGround;
