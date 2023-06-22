import { useState, useEffect } from 'react';
import "./scoreDisplay.css";
import logo from '../assets/logo.png';

const ScoreDisplay = ( {score} ) => {

    const [displayScore, setDisplayScore] = useState(0);

    useEffect(()=>{
        setDisplayScore(score)
    }, [score]);
    
    return(
       <div className={`score ${displayScore > 0 ? 'goodScore' : 'badScore'}`}>
         <img id='logoImg' src={logo}></img>
          <div id='scoreNum'>👑 {score} </div>
       </div>
    );
 }

export default ScoreDisplay;