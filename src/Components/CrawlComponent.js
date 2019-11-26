import React, { Component } from 'react';

class CrawlComponent extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            
        }
    }
    componentDidMount = () => {
        console.log('movie details ', this.props.movieDetails);
    }
    
    render() {
        return (
             <div className="crawl-container">
                 {this.props.movieDetails &&
                    <marquee>{this.props.movieDetails.opening_crawl}</marquee>
                 }
            </div>
        );
    }
}

export default CrawlComponent;