import { useState, useEffect, useRef } from "react";
import "./TypingBox.css"

const sampleTexts = [
    "The Industrial Revolution marked a pivotal period of profound technological and socioeconomic transformation that began in Great Britain, completely reshaping societies by shifting them from agrarian economies to industrial powerhouses.",
    "Artificial intelligence is rapidly evolving, with large language models demonstrating remarkable capabilities in understanding and generating human-like text, which has profound implications for the future of communication and problem-solving.",
    "Beneath the vast canopy of the ancient, whispering forest, a hidden stream trickled over smooth, moss-covered stones, its gentle melody a secret language known only to the nocturnal creatures and the silent moon.",
    "Exploring the deep ocean reveals a breathtakingly diverse ecosystem of bioluminescent creatures and hydrothermal vents, a mysterious and largely uncharted frontier that continues to challenge our understanding of life on Earth and its incredible adaptability to extreme environments."
];

export default function TypingBox() {
    const [text, setText] = useState("");
    const [input, setInput] = useState("");
    const [onFocus, setOnFocus] = useState(true)
    const [textTrigger, setTextTrigger] = useState(0);
    const inputRef = useRef(null);
    const blurTimeoutRef = useRef(null);
    const cursorRef = useRef(null)
    const charRefs = useRef([]);
    const wordRefs = useRef([]);
    
    const [letterIndex, setLetterIndex] = useState(0);
    const [wordIndex, setWordIndex] = useState(0);
    const [lockedIndex, setLockedIndex] = useState(0);

    
    const [correctWords, setCorrectWords] = useState({})
    const [wrongWords, setWrongWords] = useState({})
    const [correctletters, setCorrectletters] = useState({})
    const [wrongletters, setWrongletters] = useState({})

    useEffect(()=> {
        let newText;
        do {
            newText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        } while (newText === text); 
        setText(newText)
    }, [textTrigger])

    const handleChange = (e) => {
      const value = e.target.value;
      if (value.length < lockedIndex) {
          return; 
      }
      setInput(value);
    }
    useEffect(()=> {
      if(wordRefs.current && wordRefs.current[wordIndex]){
        wordRefs.current[wordIndex].classList.add("active")
        setLetterIndex(0)
        if(wordIndex > 0) {
          wordRefs.current[wordIndex - 1].classList.remove("active")
        }
      }
    }, [wordIndex])

    useEffect(() => {
      if (!text || !wordRefs.current || wordRefs.current.length === 0) return;

      const sourceWords = text.split(' ');
      const typedWords = input.split(' ');
      
      if (input === '') {
          setWordIndex(0);
          setLetterIndex(0);
          const firstLetterNode = wordRefs.current[0]?.childNodes[0];
          if (firstLetterNode) {
              firstLetterNode.classList.remove("correct", "incorrect");
          }
          return;
      }

      if (input.endsWith(' ')) {
          const wordJustTypedIndex = typedWords.length - 2;
          if (wordJustTypedIndex < 0) return;

          const sourceWord = sourceWords[wordJustTypedIndex];
          const typedWord = typedWords[wordJustTypedIndex];

          for (let i = 0; i < sourceWord.length; i++) {
              const letterNode = wordRefs.current[wordJustTypedIndex]?.childNodes[i];
              if (!letterNode) continue;

              const typedCharForWord = typedWord ? typedWord[i] : undefined;

              if (typedCharForWord === sourceWord[i]) {
                  letterNode.classList.add("correct");
                  letterNode.classList.remove("incorrect");
              } else {
                  letterNode.classList.add("incorrect");
                  letterNode.classList.remove("correct");
              }
          }

          if (sourceWord === typedWord) {
              setLockedIndex(input.length);
          }
          
          setWordIndex(wordJustTypedIndex + 1);
          setLetterIndex(0);
          return;
      }

      let currentWordIndex = typedWords.length - 1;
      let currentLetterIndex = typedWords[currentWordIndex].length - 1;

      setWordIndex(currentWordIndex);
      setLetterIndex(currentLetterIndex + 1);
      
      const sourceChar = sourceWords[currentWordIndex]?.[currentLetterIndex];
      const typedChar = typedWords[currentWordIndex]?.[currentLetterIndex];

      const nextLetterNode = wordRefs.current[currentWordIndex]?.childNodes[currentLetterIndex + 1];
      if (nextLetterNode) {
          nextLetterNode.classList.remove("correct", "incorrect");
      }

      if (typedChar !== undefined) {
          const letterNode = wordRefs.current[currentWordIndex]?.childNodes[currentLetterIndex];
          if (!letterNode) return;

          if (typedChar === sourceChar) {
              letterNode.classList.add("correct");
              letterNode.classList.remove("incorrect");
          } else {
              letterNode.classList.add("incorrect");
              letterNode.classList.remove("correct");
          }
          
      }
  }, [input, text]);


    function renderText(textToRender) {
        if (!textToRender) return null;
        // let charIndex = 0;
        wordRefs.current = [];
        return textToRender.split(' ').map((word, renderWordIndex) => (
            <div
                className= {renderWordIndex == 0 ? "word active" : "word"}
                key={renderWordIndex}
                ref={el => wordRefs.current[renderWordIndex] = el}
            >
                {word.split('').map((char, charInWordIndex) => {
                    // const currentCharIndex = charIndex++;
                    return (
                        <span
                            key={`${renderWordIndex}-${charInWordIndex}`}
                            // ref={el => charRefs.current[currentCharIndex] = el}
                        >
                            {char}
                        </span>
                    );
                })}
                {renderWordIndex < textToRender.split(' ').length - 1 && (
                    <span 
                    // ref={el => charRefs.current[charIndex++] = el}
                    >
                        &nbsp;
                    </span>
                )}
            </div>
        ));
    }

    function getTextWithIndex(text, index) {
        return text.split(' ')[index]
    }
    // useEffect(() => {
    //     if (cursorRef.current && charRefs.current.length > 0) {
    //         const firstCharNode = charRefs.current[0];
    //         const rect = firstCharNode.getBoundingClientRect();
    //         const containerRect = cursorRef.current.parentElement.getBoundingClientRect();

    //         cursorRef.current.style.top = `${rect.top - containerRect.top}px`;
    //         cursorRef.current.style.left = `${rect.left - containerRect.left}px`;
    //     }
    // }, [text]);
    useEffect(() => {
      const cursorNode = cursorRef.current;
      if (!cursorNode) return;

      const activeWordNode = wordRefs.current.find(
        (word) => word && word.classList.contains("active")
      );
      if (!activeWordNode) return;

      const letters = activeWordNode.querySelectorAll("span");
      const currentLetter = letters[letterIndex];

      let targetNode;

      if (currentLetter) {
        targetNode = currentLetter;
      }
      else if (letters.length > 0) {
        targetNode = letters[letters.length - 1];
      }

      if (targetNode) {
        const rect = targetNode.getBoundingClientRect();
        const containerRect = cursorNode.parentElement.getBoundingClientRect();

        const newLeft =
          !currentLetter
            ? rect.right - containerRect.left 
            : rect.left - containerRect.left; 

        cursorNode.style.top = `${rect.top - containerRect.top}px`;
        cursorNode.style.left = `${newLeft}px`;
      }
    }, [letterIndex, wordIndex, input]);


    const focusInput = () => {
        inputRef.current.focus();
         if (blurTimeoutRef.current) {
            clearTimeout(blurTimeoutRef.current);
        }
        cursorRef.current.classList.remove("hidden")
        console.log("Input is focused!")
        setOnFocus(true)
    };

    const handleBlur = () => {
        blurTimeoutRef.current = setTimeout(()=> {
            setOnFocus(false);
            // cursorRef.current.classList.add("hidden") 
            console.log('Input is blurred!');
        }, 8000)
    };
    function newText(){
        charRefs.current = [];
        setInput("");
        setTextTrigger(prev => prev + 1);

        if (cursorRef.current) {
            cursorRef.current.style.left = "0.2em";
        }
    }
    return (
        <div id="typing-container" className="" onClick={focusInput}>
            <input id="wordsInput" className="" 
                    ref={inputRef}
                    type="text" 
                    autoComplete="off" 
                    autoCapitalize="off" 
                    autoCorrect="off" 
                    spellCheck="false" 
                    list="autocompleteOff"
                    data-gramm="false"
                    data-gramm_editor="false"
                    data-enable-grammarly="false"
                    autoFocus
                    value={input}
                    // placeholder={getTextWithIndex(text, index)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                ></input>
            <div id="words-container" className="">
                {/* {!onFocus &&
                    (
                        <div className="OnFocusOffWarn">
                            <p>Click here or press any key to focus</p>
                        </div>
                    )
                } */}
                <div id="t-cursor" className="default" ref={cursorRef}></div>
                <div id="words">
                    {renderText(text)}
                </div>
            </div>
            <button id="temp" onClick={newText}>

            </button>
        </div>
    )

}