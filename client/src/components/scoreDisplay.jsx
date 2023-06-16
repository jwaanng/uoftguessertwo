import { useState, useEffect } from 'react';
import "./scoreDisplay.css";

const ScoreDisplay = ( {score} ) => {

    const [displayScore, setDisplayScore] = useState(0);

    useEffect(()=>{
        setDisplayScore(score)
    }, [score]);
    
    return(
       <div className={`score ${displayScore > 0 ? 'goodScore' : 'badScore'}`}>
          <span style={{fontSize: 16}}>👑 </span>{displayScore} {displayScore == 1 ? 'point' : 'points'}
       </div>
    );
 }

export default ScoreDisplay;