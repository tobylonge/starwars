import React, { } from 'react';

const CrawlComponent = props => {
    
    return (
            <div className="crawl-container">
                {props.movieDetails &&
                <marquee>{props.movieDetails.opening_crawl}</marquee>
                }
        </div>
    );
}

export default CrawlComponent;