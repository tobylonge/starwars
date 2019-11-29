import React, { useEffect } from 'react';

const CrawlComponent = props => {
    useEffect(() => {
        console.log('movie details ', props.movieDetails);
    })
    
    return (
            <div className="crawl-container">
                {props.movieDetails &&
                <marquee>{props.movieDetails.opening_crawl}</marquee>
                }
        </div>
    );
}

export default CrawlComponent;