import React, {useState, useEffect } from 'react';

const CrawlComponent = props => {

    const [isCrawl, setIsCrawl] = useState(false);
    const [crawlMsg, setCrawlMsg] = useState('');



    useEffect(() => {
        if(props.movieDetails) {
            setIsCrawl(false);
            setCrawlMsg(props.movieDetails.opening_crawl)
        }      
    },[props.movieDetails]);

    useEffect(() => {
        setIsCrawl(true)
    }, [crawlMsg]);

    
    return (
            <div className="crawl-container">
                {crawlMsg && isCrawl &&
                <marquee>{crawlMsg}</marquee>
                }
        </div>
    );
}

export default CrawlComponent;