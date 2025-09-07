import { useState, useEffect, useRef, useCallback } from "react";
import "./TypingBox.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import axios from "axios";

const typingKeys = /^[a-zA-Z0-9 `~!@#$%^&*()_+\-=[\]{}|;:'",.<>/?\\]$/;

export default function TypingBox({ currentMode, setCurrentMode }) {
    const [text, setText] = useState("");
    const [input, setInput] = useState("");
    const [onFocus, setOnFocus] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [isFinished , setIsFinished] = useState(false);

    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const isGeneratingRef = useRef(false);


    const [correctLetters, setCorrectLetters] = useState({});
    const [wrongLetters, setWrongLetters] = useState({});
    const [correctWords, setCorrectWords] = useState({});
    const [wrongWords, setWrongWords] = useState({});
    const [correctNoWords, setCorrectNoWords] = useState(0)

    const [wordIndex, setWordIndex] = useState(0);
    const [letterIndex, setLetterIndex] = useState(0); 
    const [lockedIndex, setLockedIndex] = useState(-1);
   
    const inputRef = useRef(null);
    const wordsRef = useRef(null); 
    const cursorRef = useRef(null);
    const wordRefs = useRef([]);
    const blurTimeoutRef = useRef(null);
    const countedLetters = useRef(new Set());
    const countedWords = useRef(new Set());

    const stopTimer = useCallback(() => setIsRunning(false), []);
    const resetTimer = useCallback(() => setTime(0), []);

    const updateStat = useCallback((setState, key) => {
        setState(prevStats => ({
            ...prevStats,
            [key]: (prevStats[key] || 0) + 1,
        }));
    }, []);

    const addLettersUserList = useCallback((letter, type) => {
        if (!letter || countedLetters.current.has(letter)) return;
        countedLetters.current.add(letter);
        const stateSetter = type === "c" ? setCorrectLetters : setWrongLetters;
        updateStat(stateSetter, letter);
    }, [updateStat]);

    const addWordsUserList = useCallback((word, type) => {
        if (!word || countedWords.current.has(word)) return;
        countedWords.current.add(word);
        const stateSetter = type === "c" ? setCorrectWords : setWrongWords;
        updateStat(stateSetter, word);
    }, [updateStat]);

    const resetTyping = useCallback(() => {
        setWordIndex(0);
        setLetterIndex(0);
        setLockedIndex(-1);
        setInput("");
        setCorrectNoWords(0);
        setIsFinished(false);
        setShowResults(false);
        setIsTyping(false)
        stopTimer();
        resetTimer();
        countedLetters.current.clear();
        countedWords.current.clear();
        wordRefs.current.forEach(wordNode => {
            wordNode?.classList.remove("correct", "active", "error")
            wordNode?.childNodes.forEach(letterNode => {
                letterNode.classList.remove("correct", "incorrect", "skipped");
            });
        });
    }, [stopTimer, resetTimer]);
    
    const generateNewText = async () => {
        if (isGeneratingRef.current) return;
        isGeneratingRef.current = true;

        let saved = JSON.parse(localStorage.getItem("typingStats_temp")) || { wrongLetters: {}, wrongWords: {} };
        let sortedLetters = Object.entries(saved.wrongLetters || {})
        .sort((a, b) => b[1] - a[1]) 
        .map(([letter]) => letter);

        let sortedWords = Object.entries(saved.wrongWords || {})
            .sort((a, b) => b[1] - a[1])
            .map(([word]) => word);

        let topLetters = sortedLetters.slice(0, 10);
        let topWords = sortedWords.slice(0, 10);

            function pickRandomFive(arr) {
            let shuffled = arr.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, Math.min(5, arr.length));
        }

        let letters = pickRandomFive(topLetters);
        let words = pickRandomFive(topWords);

        try {
            // const quoteResponse = await axios.post("http://localhost:5000/quote", {length: 20});
            // setText(quoteResponse.data.text)
            const payload = { letters, words, length: 20 };
            const response = await axios.post("http://localhost:5000/generate", payload);
            const newText = response.data.text;
            setText(newText)
            resetTyping();  
        } catch (error) {
            console.error("Error fetching new text:", error);
        } finally {
            isGeneratingRef.current = false; 
        }
    };
    
    const handleNewText = () => {
        generateNewText();
        inputRef.current?.focus();
    };
    
    const handleRestartText = () => {
        resetTyping();
        inputRef.current?.focus();
    };

    const focusInput = () => {
        if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
        if (!isFinished) {
           inputRef.current?.focus();
        }
        cursorRef.current?.classList.remove("hidden");
        setOnFocus(true);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        if(!onFocus) setOnFocus(true)
        if(!isRunning) setIsRunning(true)
        const inputLetterList = value.split("");
        let valueUpdate = false;

        const words = text.split(" ");
        const sourceWord = words[wordIndex] || " ";
        const lastWordIndex = words.length - 1;
        const currentLetter = inputLetterList.at(-1);
        const activeWord = wordRefs.current[wordIndex];

        if (e.inputType === "deleteContentBackward" && wordIndex < lockedIndex) {
            e.preventDefault?.();
            return;
        }

        if (value.length < input.length) {
            if (letterIndex > 0) {
                const lastNode = activeWord.childNodes[letterIndex - 1];
                if (lastNode?.classList.contains("extra")) {
                    lastNode.remove();
                } else {
                    lastNode?.classList.remove("correct", "incorrect", "skipped");
                }
                setLetterIndex((p) => p - 1);
                valueUpdate = true;
            } 
            else if (wordIndex > 0) {
                if (wordIndex > lockedIndex) {
                    const prevWordRef = wordRefs.current[wordIndex - 1];
                    const lastCorrectIndex = [...prevWordRef.childNodes].findLastIndex(
                        (n) => n.classList.contains("correct") || n.classList.contains("incorrect") || n.classList.contains("extra")
                    );
                    prevWordRef.classList.remove("error", "correct")

                    if (lastCorrectIndex >= 0) {
                        setWordIndex((p) => p - 1);
                        setLetterIndex(lastCorrectIndex + 1);
                        setInput((prev) => prev.trimEnd());
                        return;
                    }
                }
            }
        }

        else if (typingKeys.test(currentLetter) && currentLetter !== " ") {
            if (letterIndex < sourceWord.length) {
                const node = activeWord.childNodes[letterIndex];
                node?.classList.remove("skipped", "incorrect")
                node?.classList.add(
                    currentLetter === node?.innerText ? "correct" : "incorrect"
                );
                (currentLetter === node?.innerText) ? addLettersUserList(node?.innerText, 'c') : addLettersUserList(node?.innerText, 'w'); 
            } else if(wordIndex < words.length - 1){
                const span = document.createElement("span");
                span.innerText = currentLetter;
                span.className = "extra incorrect";
                activeWord.appendChild(span);
            }
            setLetterIndex((p) => p + 1);
            valueUpdate = true;
        }

        else if (currentLetter === " " && inputLetterList.at(-2) !== " ") {
            for (let i = letterIndex; i < sourceWord.length; i++) {
                activeWord.childNodes[i]?.classList.add("skipped");
            }
            const hasMistake = Array.from(activeWord.childNodes).some(
                (n) => ["incorrect", "skipped", "extra"].some(c => n.classList.contains(c))
            );
            activeWord.classList.remove("error", "correct")
            activeWord.classList.add(hasMistake ? "error" : "correct");
            if (!hasMistake) setLockedIndex(wordIndex + 1);
            (!hasMistake) ? addWordsUserList(sourceWord, "c") : addWordsUserList(sourceWord, 'w'); 
            setWordIndex((p) => p + 1);
            setLetterIndex(0);
            valueUpdate = true;
        }

        if (!isFinished && (
            wordIndex > lastWordIndex ||
            (wordIndex === lastWordIndex && letterIndex >= words[lastWordIndex].length - 1)
        )) {
            setIsFinished(true);
        }

        if (valueUpdate && value !== input) setInput(value);
    };

    const handleKeyDown = (e) => {
        if (isTyping && e.key === "CapsLock") return
        if (typingKeys.test(e.key) || e.key === "Backspace" || e.key === "Tab") {
            setIsTyping(true);
        }
    }
    const handleFocus = () => {
        setOnFocus(true);
    }
    const handleBlur = () => {
        cursorRef.current?.classList.add("hidden");
        if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = setTimeout(() => {
            setOnFocus(false);
        }, 500);
    };

    const renderText = (textToRender) => {
        if (!textToRender) return null;
        return textToRender.split(' ').map((word, renderWordIndex) => (
            <div
                className={`word ${renderWordIndex === 0 ? "active" : ""}`}
                key={renderWordIndex}
                ref={el => wordRefs.current[renderWordIndex] = el}
            >
                {word.split('').map((char, charInWordIndex) => (
                    <span key={`${renderWordIndex}-${charInWordIndex}`}>{char}</span>
                ))}
            </div>
        ));
    };

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('typingStats_temp') || '{}');
        setCorrectLetters(savedData.correctLetters || {});
        setCorrectWords(savedData.correctWords || {});
        setWrongLetters(savedData.wrongLetters || {});
        setWrongWords(savedData.wrongWords || {});
        generateNewText()
    }, []);

    useEffect(() => {
        const stats = { correctLetters, wrongLetters, correctWords, wrongWords };
        if (Object.keys(stats).some(key => Object.keys(stats[key]).length > 0)) {
             localStorage.setItem('typingStats_temp', JSON.stringify(stats));
        }
    }, [correctLetters, wrongLetters, correctWords, wrongWords]);

    useEffect(() => {
        const cursorNode = cursorRef.current;
        const activeWordNode = wordRefs.current[wordIndex];

        if (!cursorNode || !activeWordNode) return;

        const letters = activeWordNode.children;
        const targetLetter = letters[letterIndex];
        const parentRect = cursorNode.parentElement.getBoundingClientRect();
        const wordRect = activeWordNode.getBoundingClientRect();

        const newTop = wordRect.top - parentRect.top - 2;
        let newLeft;

        if (targetLetter) {
            newLeft = targetLetter.getBoundingClientRect().left - parentRect.left - 5;
        } else if (letters.length > 0) {
            const lastLetter = letters[letters.length - 1];
            newLeft = lastLetter.getBoundingClientRect().right - parentRect.left;
        } else {
            return;
        }

        cursorNode.style.transform = `translate(${newLeft+2}px, ${newTop}px)`;
    }, [letterIndex, wordIndex, text]);


    useEffect(()=> {
        wordRefs.current.forEach((el, i) => {
            el?.classList.toggle("active", i === wordIndex);
        });
    }, [wordIndex])

    useEffect(()=> {
        if (!text) return;
        const sourceWords = text.split(" ");
        const typedWords = input.split(" ");
        let totalCorrectWords = 0;
        for (let w_idx = 0; w_idx < typedWords.length - 1; w_idx++) {
            if (typedWords[w_idx] === sourceWords[w_idx]) {
                totalCorrectWords++;
            }
        }
        setCorrectNoWords(totalCorrectWords);
    }, [text, input])

    return (
        <div id="typing-zone">
            <div id="top-bar"></div>
            <div id="middle-zone"></div>
            <div id="typing-container" onClick={focusInput}>
                <div id="score-preview">
                    <span style={{opacity: (isTyping && !isFinished) ? 1: 0}}>
                        {correctNoWords}/{text.split(" ").length}
                    </span>
                </div>
                <input
                    id="wordsInput"
                    ref={inputRef}
                    type="text"
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck="false"
                    autoFocus
                    value={input}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onPaste={(e) => e.preventDefault()}
                    disabled={isFinished}
                />
                <div id="words-container">
                    {!onFocus && !isFinished && (
                        <div className="OnFocusOffWarn">
                            Click here or press any key to focus
                        </div>
                    )}
                    <div id="t-cursor" className="default" ref={cursorRef}></div>
                    <div id="words" className={!onFocus ? "blurred" : ""} ref={wordsRef}>{renderText(text)}</div>
                </div>
                <div id="game-bars">
                    <button id="restart-button" onClick={handleRestartText}
                        data-tooltip-id="restart-button-tooltip"
                        data-tooltip-content="Restart"
                    >
                      <svg width="2em" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="currentColor"><g strokeWidth="0"></g><g strokeLinecap="round" strokeLinejoin="round"></g><g> <path d="M19.146 4.854l-1.489 1.489A8 8 0 1 0 12 20a8.094 8.094 0 0 0 7.371-4.886 1 1 0 1 0-1.842-.779A6.071 6.071 0 0 1 12 18a6 6 0 1 1 4.243-10.243l-1.39 1.39a.5.5 0 0 0 .354.854H19.5A.5.5 0 0 0 20 9.5V5.207a.5.5 0 0 0-.854-.353z"></path> </g></svg>
                    </button>
                    <ReactTooltip id="restart-button-tooltip" place="bottom" />
                    <button id="next-button" onClick={handleNewText} style={{display: !isFinished ? "none": "inline"}}
                        data-tooltip-id="next-button-tooltip"
                        data-tooltip-content="Next"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" ><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                    <ReactTooltip id="next-button-tooltip" place="bottom" />
                </div>
            </div>
        </div>
    );
}