import { useState, useEffect } from 'react';
import './App.css'
import axios from 'axios';

import ImageBox from "./components/imageBox";
import MultipleChoice from "./components/multipleChoice";
import ScoreKeeper from "./components/scoreDisplay";

const API = axios.create({
  baseURL: 'http://localhost:5500',
});

const WIN_QUIPS = [
  "WOWOWOWWOWOWOWOWOW",
  "NICE",
  "YOU KNOW THIS SCHOOL WELL!",
  "Good Job", 
  "Walking GPS?",
  "Yes"
];

const LOSE_QUIPS = [
  "NAH close i guess?", 
  "RIP",
  "TRY AGAIN :((((",
  "Unfortunately :(",
  "Take some geography classes!",
  "Hmm..."
]

function App() {

  const [currImage, setCurrImage] = useState({});
  const [guessing, setGuessing] = useState(true);
  const [choice, setChoice] = useState();
  const [correctChoice, setCorrectChoice] = useState();
  const [rightAns, setRightAns] = useState();
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");

  const getRandomImage = async () => {
    try {
      const response = await API.get('/images');
      const randomImage = ((response.data)[0]);
      console.log(randomImage.url);
      return randomImage;
    } catch (error) {
      console.error('Error fetching random picture:', error)
    }
  }

  const getWinQuip = () => {
    return WIN_QUIPS[Math.floor(Math.random() * WIN_QUIPS.length)];
  }

  const getLoseQuip = () => {
    return LOSE_QUIPS[Math.floor(Math.random() * LOSE_QUIPS.length)];
  }

  const setImage = async () => {
    try {
      getRandomImage().then((p) => setCurrImage(p));
      // setGuessing(true);
      setChoice(null);
      setCorrectChoice(null);
      // console.log('hi', currImage.code);
      console.log('si', guessing);
    } catch (error) {
      console.error('Error setting image:', error); 
    }
  };

  // const choose = (choice) => {
  //   let res;
  //   setChoice(choice);

  //   const correctChoice = currImage.location;
  //   setCorrectChoice(correctChoice);
    
  //   if(choice = correctChoice){
  //     setMessage(getWinQuip());
  //     setScore(score+1);
  //     res = "win";
  //   } else {
  //     setMessage(getLoseQuip());
  //     setScore(0);
  //     res = "lose";
  //   }
  //   setGuessing(false);
  // };

  const handleAnswer = (isCorrect) => {
    // console.log("app.js", isCorrect);
    if (isCorrect) {
      setScore(score+1);
      setMessage(getWinQuip());
      console.log("app true", score, message);
    } else {
      setScore(0);
      setMessage(getLoseQuip());
      console.log("app false", message);
    }
    setGuessing(!guessing);
    console.log("ha", guessing);
    setImage();
  };
  
  useEffect(() => {
    setImage();
  }, []);
  

  return (
    <div className="App">
      <ScoreKeeper score={score} />
      <hr></hr>
      <h1 id='msg'>{message}</h1>
      {currImage && (
        <ImageBox imageUrl={currImage.url}/>
      )}
      <MultipleChoice correct={currImage.location} onClick={handleAnswer} guessing={guessing}/>

    </div>
  );

}

export default App;

