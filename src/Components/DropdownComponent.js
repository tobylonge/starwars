import React, { useEffect, useState } from 'react';
import {_getYear} from '../Utils/helpers';

const DropdownComponent = props => {

    const [defaultText, setDefaultText] = useState('Choose Starwars movie');
    const [isOpen, setIsOpen] = useState(false);

    const openDropdown = () => {
        setIsOpen(true);
    }

    const viewDetails = movie => {
        //close dropdown Modal
        setIsOpen(false);
        setDefaultText(`${movie.title} (${_getYear(movie.release_date)})`)
        props.viewDetails(movie);
    }

    useEffect(() => {
        props.data.sort(function (left, right) {
            return _getYear(left.release_date) - _getYear(right.release_date)
        });
    },[])
    
    return (
            <div className="dropdown">
                <a className="dropdownButton" onClick={() => openDropdown()}>{defaultText}</a>
                <i className="icon"></i>
                <ul className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
                    <a className="close" onClick={() => setIsOpen(false)}>×</a>
                    {props.data.map((starwars, key) => (
                    <li key={key}><a href="#" onClick={() => viewDetails(starwars)}>{starwars.title} ({_getYear(starwars.release_date)})</a></li>
                    ))}
            </ul>
        </div>
    );
}

export default DropdownComponent;