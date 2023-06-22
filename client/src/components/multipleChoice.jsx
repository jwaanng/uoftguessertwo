import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Choice from "./choice";

const API = axios.create({
    baseURL: 'http://localhost:5500'
});

const BUILDING_NAMES = [
    "Bahen",
    "Convocation Hall",
    "Sidney Smith Hall",
    "University College",
    "Gerstein Science Information Centre",
    "Morrison Hall",
    "Mechanical Engineering Building",
    "Robarts Library",
    "Medical Sciences Building",
    "Hart House",
    "Rotman School of Management",
    "Galbraith Building",
    "Bissell Building",
    "Lash Miller Chemical Labs",
    "Robarts Research Institute",
    "Earth Sciences Centre",
    "Edward Johnson Building",
    "McLennan Physical Laboratories",
    "Myhal Centre for Innovation",
    "Mining Building",
    "Wilson Hall",
    "Wetmore Hall"
];


function MultipleChoice({ correct, onClick, guessing }) {
    const [rOptions, setROptions] = useState([]);
    const [rightAns, setRightAns] = useState(false);

    const getRandomAns = async () => {
        const randomIndex = Math.floor(Math.random() * (BUILDING_NAMES.length));
        return BUILDING_NAMES[randomIndex];
    };

    const makeOptions = async () => {
        const rOptions = [correct];
      
        while (rOptions.length < 4) {
          const randomOption = await getRandomAns();
          
          if (rOptions.indexOf(randomOption) === -1) {
            rOptions.push(randomOption);
          }
          console.log(rOptions);
        }
        
        for (let i = rOptions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [rOptions[i], rOptions[j]] = [rOptions[j], rOptions[i]];
        }

        setROptions(rOptions);
      }; 

    
    const handleChoiceClick = (option) => {
      const isCorrect = option === correct;
      setRightAns(isCorrect);
      onClick(isCorrect);
      
    };

    // TODO: figure out how to use the rightAns prop to change state of choice in app.jsx, implement scoring

    useEffect(() => {
        makeOptions();
    }, [guessing, correct]);
  
    return (
        <div className='multiple' >
          {rOptions.map((rOption, index) => (
            <Choice key={index} option={rOption} onClick={() => handleChoiceClick(rOption)} />
          ))}
        </div>
    );
  }

export default MultipleChoice;