import { useEffect, useState } from "react";
import {Layout, Button, RevealBlock} from './components/button';

import {
  getFirestore,
  getDocs,
  query,
  collection,
  where,
  limit,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyAhIXkwtMlSI90yqCM2Tr0loVSZwsiMOLE",
  authDomain: "whichipedia-3ca71.firebaseapp.com",
  projectId: "whichipedia-3ca71",
  storageBucket: "whichipedia-3ca71.appspot.com",
  messagingSenderId: "647912040837",
  appId: "1:647912040837:web:3ff3d430b37f715d547cec",
  measurementId: "G-1N5FBFQG70",
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore();

const WIN_QUIPS = [
  ...Array(10).fill("You're right!"),
  "Excellent!",
  "You're good at this, have you done this before?",
  "This is a real whichipedia party!",
  "I thought it was the other one, to be honest.",
  "Did you cheat and look at wikipedia?",
];

const LOSE_QUIPS = [
  ...Array(10).fill("You're wrong."),
  "I thought it was that one too.",
  "Wikipedia is a fickle beast.",
  "I'll edit that one and make it longer for you.",
  "Wiki editors got a lot of free time, huh?",
];

const PageChoice = (props) => {
  const {
    maxLength,
    percentLonger,
    page,
    guessing,
    selected,
    isCorrectChoice,
    visible,
    onGuess = ()=>{}
  } = props;
  
  // styles based on game state
  let activeStyles = {};
  let transitionsArray = [];
  if(guessing){
    activeStyles = {
      backgroundColor: '#ddd'
    };
  }
  else{
    transitionsArray.push('');
    if(selected){
      if(isCorrectChoice){
        activeStyles = {
          backgroundColor: '#6DE79A'
        };
      }
      else{
        activeStyles = {
          backgroundColor: '#FF4545'
        };
      }
    }
    else{
      activeStyles = {
        backgroundColor: '#ddd'
      };
    }
  }

  // touch feedback
  const [touchStyles, setTouchStyles] = useState({});
  const onMouseDown = (e) => {
    setTouchStyles({
      //transform: 'scale(.95)',
      opacity: .8
    });
    return true;
  }
  const onMouseUp = (e) => {
    setTouchStyles({
      //transform: 'scale(1)',
      opacity: 1
    });
    return true;
  }

  return(
    <div
      style={{
        opacity: (visible) ? 1 : 0,
        transform: `translate(0px, ${visible ? 0 : 50}px)`,
        transition: `opacity 100ms ease, transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
        position: 'relative',
        height: '50%',
        paddingBottom: 20,
      }}
      >
      <div style={{
          position: 'absolute',
          top: 0, right: 0, left: 0, bottom: 20,
          backgroundColor: '#f7f7f7',
          borderRadius: 5,
          border: '2px solid #555',
      }}></div>
      <div 
        style={{
          position: 'absolute',
          /* top: 0, right: 0, left: 0, bottom: 0, */
          top: 2, right: 2, left: 2, bottom: 2, 
          borderRadius: 5,
          paddingBottom: 20,
          cursor: 'pointer',
          overflow: 'hidden'
        }}>
        <div 
          style={{
            display: 'block',
            height: '100%',
            width: (guessing) ? 12 : `${(page.word_count/maxLength*100)}%`,
            transition: `transform 100ms ease, ${(guessing) ? '' : 'width 500ms cubic-bezier(.34,.72,.36,1.38), background-color 500ms ease'}`,
            ...activeStyles,
            ...touchStyles
          }}
          ></div>
        </div>
      
      <a 
        style={{
          position: 'absolute',
          top: 0, right: 0, left: 0, bottom: 0, 
          display: 'flex',
          alignItems: 'center',
          paddingBottom: 20
        }}
        target="_blank"
        rel="noreferrer"
        href={`https://en.wikipedia.org/wiki/${page.title}`}
        onMouseDown={onMouseDown}
        onTouchStart={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onMouseUp}
        onClick={(e)=>{
          if(guessing){
            e.preventDefault();
            onGuess();
          }
        }}
        >
        <div style={{padding: 24, flex: 1}}>
          <div style={{
            visibility: (!guessing && isCorrectChoice) ? 'visible' : 'hidden',
            position: 'relative'
            }}>
              <div className="smallText" style={{
                 position: 'absolute',
                  bottom: 6, left: 0,
                  backgroundColor: 'white',
                  padding: '4px 0',
                  borderRadius: 4,
                  fontWeight: 700,
                  display: 'inline-block',
                }}>
                <span style={{padding: '0 4px'}}>{percentLonger}% longer </span>
              </div>           
          </div>
          <div className="pageTitle">
            {page.display_title}&nbsp;<span className="secondaryText" style={{visibility: (!guessing) ? 'visible' : 'hidden' }}>&rarr;</span>
          </div>
          <div className="secondaryText smallText" style={{
            visibility: (!guessing) ? 'visible' : 'hidden',
            }}>{parseInt(page.word_count).toLocaleString()} words</div>
          
        </div>
      </a>
    </div>
  );
}

function App() {

  const [pageOne, setPageOne] = useState({});
  const [pageTwo, setPageTwo] = useState({});
  const [pageOneVisible, setPageOneVisible] = useState(false);
  const [pageTwoVisible, setPageTwoVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [guessing, setGuessing] = useState(true);
  const [choice, setChoice] = useState();
  const [correctChoice, setCorrectChoice] = useState();
  const [percentLonger, setPercentLonger] = useState();
  const [score, setScore] = useState(0);
  const [losingStreak, setLosingStreak] = useState(0);
  const [total, setTotal] = useState(0);

  let askTime = new Date();

  const getRandomPage = async () => {
    const q = query(
      collection(db, "pages"),
      where("page_random", ">", Math.random()),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    let page;
    querySnapshot.forEach((p) => {
      page = p.data();
    });

    page.display_title = page.title.replaceAll("_", " ");
    return page;
  };

  // max quip length
  //  return "Did you cheat and look at stuff in"
  const getWinQuip = (_percentLonger) => {
    if (total < 2) {
      return WIN_QUIPS[0];
    }
    if (_percentLonger < 5) {
      return "Whew, close one!";
    }
    if (_percentLonger > 60) {
      return "That one was too easy.";
    }  
    if (total === 11) {
      return "This is fun, right?";
    }
    if (total === 21) {
      return "Slow day at the office, huh?";
    }
    if (total === 31) {
      return "We get it, you like whichipedia.";
    }
    if (score === 5) {
      return "You're on a roll!";
    }
    if (score === 10) {
      return "This must be a record.";
    }
    if (score === 20) {
      return "Your mind is one with wikipedia.";
    }
    return WIN_QUIPS[Math.floor(Math.random() * WIN_QUIPS.length)];
  };

  const getLoseQuip = (_percentLonger) => {
    if (total < 4) {
      return LOSE_QUIPS[0];
    }
    if (losingStreak === 3) {
      return "We all have bad days.";
    }
    if (losingStreak === 5) {
      return "You're due for a win!";
    }
    if (losingStreak === 6) {
      return "I believe in you!";
    }
    if (_percentLonger > 70) {
      return "Not even close.";
    }
    return LOSE_QUIPS[Math.floor(Math.random() * LOSE_QUIPS.length)];
  };

  // get 2 new pages, reset game board
  const setPages = () => {
    setPageOneVisible(false);
    setPageTwoVisible(false);
    setTimeout(()=>{
      getRandomPage().then((p) => setPageOne(p));
      getRandomPage().then((p) => setPageTwo(p));
      setGuessing(true);
      setChoice(null);
      setCorrectChoice(null);
      setPercentLonger(null);   
    }, 200);
    logEvent(analytics, "ask");
    askTime = new Date();
  };

  // user makes a choice
  const choose = (choice) => {
    let res;
    setChoice(choice);
    console.log(`${pageOne.display_title}: ${pageOne.word_count}`);
    console.log(`${pageTwo.display_title}: ${pageTwo.word_count}`);
    if (pageOne.word_count === pageTwo.word_count) {
      setMessage(
        "They're actually the same length. This has never happened before."
      );
      setCorrectChoice(choice); // everybody's a winner
      setScore(score+1);
      setLosingStreak(0);
      res = "same";
    } else {
      const _correctChoice = (pageOne.word_count > pageTwo.word_count) ? 0 : 1
      setCorrectChoice(_correctChoice);
      const _percentLonger = Math.ceil((Math.abs(pageOne.word_count - pageTwo.word_count) / Math.min(pageOne.word_count,pageTwo.word_count))*100);
      setPercentLonger(_percentLonger);
      if (choice === _correctChoice) {
        setMessage(getWinQuip(_percentLonger));
        setScore(score+1);
        setLosingStreak(0);
        res = "win";
      } else if (_percentLonger < 4) {
        setMessage("That's close enough, I'll give it to you.");
        setScore(score+1);
        setLosingStreak(0);
        res = "close_enough";
      }
      else {
        setMessage(getLoseQuip(_percentLonger));
        setScore(0);
        setLosingStreak(losingStreak+1);
        res = "lose";
      }
    }
    setTotal(total+1);    
    logEvent(analytics, "answer", {res, time: new Date() - askTime, total, losingStreak, score, percentLonger});
    setGuessing(false);
  };

  // animate entry of choices 
  useEffect(()=>{
    if(pageOne.title && pageTwo.title){
      setTimeout(()=>{
        setPageOneVisible(true);
      }, 900);
      setTimeout(()=>{
        setPageTwoVisible(true);
      }, 1050);
    }
  }, [pageOne, pageTwo]);

  // start first round on page load
  useEffect(() => {
    setPages();
  }, []);

  return (
    <Layout score={score}>
        <div style={{flex: 0}}>
            <div
              className="section"
              style={{
                position: 'relative',
              }}>
              <div className="chunk">
                <h1 className="title" style={{visibility: 'hidden'}}>X<br />X</h1>
              </div>
              <div className="section" style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
                <div style={{display: 'flex', height: '100%', alignItems: 'center'}}>
                  <RevealBlock visible={guessing} delay={guessing ? 100 : 800}>
                      <div className="chunk">
                        <h1 className="title" style={{maxWidth: 500}}>Which Wikipedia page is longer?</h1>
                      </div>
                  </RevealBlock>
                </div>
              </div>
              <div className="section" style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
                <div style={{display: 'flex', height: '100%', alignItems: 'center'}}>
                  
                    <div style={{display: 'flex', height: '100%', width: '100%', alignItems: 'center'}}>
                      <div style={{flex: 1, alignItems: 'center'}}>
                        <RevealBlock visible={!guessing} delay={guessing ? 100 : 800} style={{width: '100%'}}>
                          <div className="chunk">
                            <h1 className={`title ${(message.length > 26) ? 'titleLong' : ''} ${(message.length > 32) ? 'titleSuperLong' : ''}`}>{message}</h1>
                          </div>
                          </RevealBlock>
                      </div>
                      
                      <div style={{flex: 0, alignItems: 'center', paddingLeft: 20}}>
                        <RevealBlock visible={!guessing} delay={guessing ? 100 : 900} style={{width: '100%'}}>
                        <div className="chunk">
                          <Button 
                            className="playAgain"
                            onClick={setPages} 
                            style={{marginTop: 3, marginBottom: 3}}
                            cursor={pageOne.title}
                            >Next &rarr;</Button>
                        </div>
                        </RevealBlock>
                      </div>
                    </div>
                  
                </div>
              </div>            
          </div>
        </div>
      <div className="section" style={{ flex: 1, display: 'flex', flexDirection: 'column', /*borderTop: '1px solid #ddd', paddingTop: 20*/}}>
        <PageChoice 
          page={pageOne}
          onGuess={()=>choose(0)}
          guessing={guessing}
          maxLength={Math.max(pageOne.word_count, pageTwo.word_count)}
          selected={(choice === 0)}
          isCorrectChoice={correctChoice === 0}
          percentLonger={percentLonger}
          visible={pageOneVisible}
          />
        <PageChoice 
          page={pageTwo}
          onGuess={()=>choose(1)}
          guessing={guessing}
          maxLength={Math.max(pageOne.word_count, pageTwo.word_count)}
          selected={(choice === 1)}
          isCorrectChoice={correctChoice === 1}
          percentLonger={percentLonger}
          visible={pageTwoVisible}
          />
      </div>
    </Layout>   
  )
}

export default App;

