import React, { Component } from 'react';
import {_getYear} from '../Utils/helpers';

class DropdownComponent extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            defaultText : 'Choose Starwars movie'
        }
    }

    openDropdown = () => {
        this.setState({isOpen: true});
    }

    viewDetails = movie => {
        //close dropdown Modal
        console.log('date ', _getYear(movie.release_date));
        this.setState({isOpen: false, defaultText: `${movie.title} (${_getYear(movie.release_date)})`});
        this.props.viewDetails(movie);
    }

    componentDidMount = () => {

        this.props.data.sort(function (left, right) {
            return _getYear(left.release_date) - _getYear(right.release_date)
        });

        // console.log('sort ', sortedData)
    }
    
    render() {
        return (
             <div className="dropdown">
                 <a className="dropdownButton" onClick={this.openDropdown}>{this.state.defaultText}</a>
                 <i className="icon"></i>
                 <ul className={`dropdown-menu ${this.state.isOpen ? 'open' : ''}`}>
                     <a className="close" onClick={() => this.setState({isOpen: false})}>×</a>
                     {this.props.data.map((starwars, key) => (
                        <li key={key}><a href="#" onClick={() => this.viewDetails(starwars)}>{starwars.title} ({_getYear(starwars.release_date)})</a></li>
                     ))}
                </ul>
            </div>
        );
    }
}

export default DropdownComponent;