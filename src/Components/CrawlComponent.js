import React, {useState, useEffect } from 'react';

const CrawlComponent = props => {

    const [isCrawl, setIsCrawl] = useState(false);
    const [crawlMsg, setCrawlMsg] = useState('');



    useEffect(() => {
        if(props.filmDetails) {
            setIsCrawl(false);
            setCrawlMsg(props.filmDetails.opening_crawl)
        }      
    },[props.filmDetails]);

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