import React, { Component } from 'react';
import moment from "moment";

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

    componentDidMount = () => {
        console.log('data for dropdown ', this.props.data);
        // const sortedData  = this.props.data.sort((a,b) => moment(a.release_date).format('YYYY-MM-DD') - moment(b.release_date).format('YYYY-MM-DD'))

        this.props.data.sort(function (left, right) {
            return moment.utc(left.release_date).diff(moment.utc(right.release_date))
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
                        <li key={key}><a href="#">{starwars.title} ({moment(starwars.release_date).format("YYYY")})</a></li>
                     ))}
                </ul>
            </div>
        );
    }
}

export default DropdownComponent;