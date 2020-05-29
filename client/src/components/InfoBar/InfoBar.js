import React from 'react'

import './InfoBar.css'

const InfoBar = ({room})=>(
    <div className="infoBar">
        <div className="leftInnerContainer">
            <div>
                <h3>{room}</h3>
            </div>
           <div className="rightInnerContainer">
           <a href="/">
           &#8855;
           </a>
           </div>
        </div>
    </div>
)

export default InfoBar