import { useState, useEffect, useRef, useCallback } from "react";
import "./TypingBox.css";

const sampleTexts = [
    "The Industrial Revolution changed societies in Great Britain.",
    "AI is rapidly evolving and impacting communication.",
    "A hidden stream flows quietly under the moonlight.",
    "The deep ocean holds a mysterious, diverse ecosystem."
];

export default function TypingBox() {
    const [text, setText] = useState("");
    const [input, setInput] = useState("");
    const [onFocus, setOnFocus] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [wordIndex, setWordIndex] = useState(0);
    const [letterIndex, setLetterIndex] = useState(0);
    const [lockedIndex, setLockedIndex] = useState(0);
    const [correctLetters, setCorrectLetters] = useState({});
    const [wrongLetters, setWrongLetters] = useState({});
    const [correctWords, setCorrectWords] = useState({});
    const [wrongWords, setWrongWords] = useState({});
    const [correctNoWords, setCorrectNoWords] = useState(0)
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [finished, setFinished] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const inputRef = useRef(null);
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
        setLockedIndex(0);
        setInput("");
        setCorrectNoWords(0);
        setFinished(false);
        setShowResults(false);
        stopTimer();
        resetTimer();
        countedLetters.current.clear();
        countedWords.current.clear();
        wordRefs.current.forEach(wordNode => {
            wordNode?.childNodes.forEach(letterNode => {
                letterNode.classList.remove("correct", "incorrect", "skipped");
            });
        });
    }, [stopTimer, resetTimer]);

    const generateNewText = useCallback(() => {
        let newText;
        do {
            newText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        } while (newText === text);
        setText(newText);
        resetTyping();
    }, [text, resetTyping]);

    useEffect(() => {
        wordRefs.current.forEach((el, i) => {
            el?.classList.toggle("active", i === wordIndex);
        });
    }, [wordIndex]);
    
    useEffect(() => {
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

        sourceWords.forEach((sourceWord, w_idx) => {
            const wordNode = wordRefs.current[w_idx];
            if (!wordNode) return;
            const typedWord = typedWords[w_idx];
            for (let l_idx = 0; l_idx < sourceWord.length; l_idx++) {
                const letterNode = wordNode.children[l_idx];
                if (!letterNode) continue;
                letterNode.classList.remove("correct", "incorrect", "skipped");
                const typedChar = typedWord ? typedWord[l_idx] : undefined;
                if (typedChar === undefined) {
                    if (w_idx < typedWords.length - 1) {
                        letterNode.classList.add("skipped");
                    }
                } else if (typedChar === sourceWords[w_idx][l_idx]) {
                    letterNode.classList.add("correct");
                } else {
                    letterNode.classList.add("incorrect");
                }
            }
        });
        
        const currentWordIndex = Math.max(0, typedWords.length - 1);
        const currentTypedWord = typedWords[currentWordIndex] || "";
        setWordIndex(currentWordIndex);
        setLetterIndex(currentTypedWord.length);

        if (input.endsWith(" ")) {
            const lastWordIndex = typedWords.length - 2;
            if (lastWordIndex < 0) return;

            const sourceWord = sourceWords[lastWordIndex];
            const typedWord = typedWords[lastWordIndex] || "";

            for (let i = 0; i < sourceWord.length; i++) {
                const sourceChar = sourceWord[i];
                const typedChar = typedWord[i];

                if (typedChar === undefined) {
                    // addLettersUserList(sourceChar, 'w');
                } else if (typedChar === sourceChar) {
                    addLettersUserList(sourceChar, 'c'); 
                } else {
                    addLettersUserList(sourceChar, 'w'); 
                }
            }
            if (typedWord === sourceWord) {
                setLockedIndex(input.length);
                addWordsUserList(sourceWord, "c");
            } else {
                addWordsUserList(sourceWord, "w");
            }
        }
        
        if (input.length === 0) {
            resetTyping();
        }
    }, [input, text, resetTyping, addWordsUserList, addLettersUserList]);
    
    useEffect(() => {
        const cursorNode = cursorRef.current;
        const activeWordNode = wordRefs.current[wordIndex];
        if (!cursorNode || !activeWordNode) return;
        const letters = activeWordNode.children;
        const targetLetter = letters[letterIndex];
        let newLeft;
        if (targetLetter) {
            newLeft = targetLetter.getBoundingClientRect().left;
        } else if (letters.length > 0) {
            const lastLetter = letters[letters.length - 1];
            newLeft = lastLetter.getBoundingClientRect().right;
        } else { return; }
        const containerLeft = cursorNode.parentElement.getBoundingClientRect().left;
        cursorNode.style.top = `${activeWordNode.getBoundingClientRect().top - cursorNode.parentElement.getBoundingClientRect().top -6}px`;
        cursorNode.style.left = `${newLeft - containerLeft}px`;
    }, [letterIndex, wordIndex, text]);

    useEffect(() => {
        generateNewText();
    }, []);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTime(prev => prev + 0.1);
            }, 100);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning]);
    
    useEffect(() => {
        if (!finished && input === text && text.length > 0) {
            stopTimer();
            setFinished(true);
            setShowResults(true);
        }
    }, [input, text, finished, stopTimer]);

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('typingStats_temp') || '{}');
        setCorrectLetters(savedData.correctLetters || {});
        setWrongLetters(savedData.wrongLetters || {});
        setCorrectWords(savedData.correctWords || {});
        setWrongWords(savedData.wrongWords || {});
    }, []);

    useEffect(() => {
        const stats = { correctLetters, wrongLetters, correctWords, wrongWords };
        if (Object.keys(stats).some(key => Object.keys(stats[key]).length > 0)) {
             localStorage.setItem('typingStats_temp', JSON.stringify(stats));
        }
    }, [correctLetters, wrongLetters, correctWords, wrongWords]);
    
    const startTimer = () => setIsRunning(true);
    
    const handleChange = (e) => {
        const value = e.target.value;
        const sourceWords = text.split(' ');
        const typedWords = input.split(' ');
        
        if (!finished && typedWords.length === sourceWords.length && value === input + " ") {
            stopTimer();
            setFinished(true);
            setShowResults(true);
            cursorRef.current?.classList.add("hidden");
            setInput(input.trim());
            return;
        }

        if (input.length === 0 && value === " ") return;
        if (input.endsWith(" ") && value === input + " ") return;

        if (!isRunning && value.length > 0 && !finished) startTimer();
        if (value.length < lockedIndex) return;

        const currentWordIndex = input.split(' ').length - 1;
        const currentWord = sourceWords[currentWordIndex];
        const typedCharsInWord = value.split(' ').pop();
        if (currentWord && typedCharsInWord.length > currentWord.length && !value.endsWith(' ')) return;
        
        setInput(value);
    };

    const handleKeyDown = (e) => {
        const typingKeys = /^[a-zA-Z0-9 `~!@#$%^&*()_+\-=[\]{}|;:'",.<>/?\\]$/;
        if (isTyping && e.key === "CapsLock") return
        if (typingKeys.test(e.key) || e.key === "Backspace" || e.key === "Tab") {
            setIsTyping(true);
        } else {
            setIsTyping(false);
        }
    }

    const calculateWPM = () => {
        const minutes = time / 60;
        if (minutes === 0 || input.length === 0) return 0;
        const wpm = (input.length / 5) / minutes;
        return wpm.toFixed(1);
    };

    const calculateAccuracy = () => {
        if (input.length === 0) return 100;
        let errors = 0;
        for (let i = 0; i < input.length; i++) {
            if (input[i] !== text[i]) {
                errors++;
            }
        }
        const accuracy = ((input.length - errors) / input.length) * 100;
        return accuracy > 0 ? accuracy.toFixed(1) : 0;
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
        if (!finished) {
           inputRef.current?.focus();
        }
        cursorRef.current?.classList.remove("hidden");
        setOnFocus(true);
    };

    const handleBlur = () => {
        cursorRef.current?.classList.add("hidden");
        setIsTyping(false)
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
                {renderWordIndex < textToRender.split(' ').length - 1 && <span>&nbsp;</span>}
            </div>
        ));
    };

    return (
        <div id="typing-zone">
            <div id="top-bar"></div>
            <div id="middle-zone"></div>
            <div id="typing-container" onClick={focusInput}>
                <div id="score-preview">
                    {isTyping && !finished && (
                    <span>
                        {correctNoWords}/{text.split(" ").length}
                    </span>)}
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
                    onPaste={(e) => e.preventDefault()}
                    disabled={finished}
                />
                <div id="words-container" >
                    {showResults && (
                        <div className="results-overlay">
                            <div className="results-content">
                            <h2>Results</h2>
                            <p>WPM: {calculateWPM()}</p>
                            <p>Accuracy: {calculateAccuracy()}%</p>
                            <p>Words Correct: {correctNoWords}/{text.split(" ").length}</p>
                            <button onClick={handleRestartText}>Retry</button>
                            <button onClick={handleNewText}>Next Text</button>
                            </div>
                        </div>
                    )}
                    {!onFocus && !finished && (
                        <div className="OnFocusOffWarn">
                            Click here or press any key to focus
                        </div>
                    )}
                    <div id="t-cursor" className="default" ref={cursorRef}></div>
                    <div id="words" className={!onFocus ? "blurred" : ""}>{renderText(text)}</div>
                </div>
                <div id="game-bars">
                    <button id="restart-button" onClick={handleRestartText}>
                      <svg width="2.5em" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19.146 4.854l-1.489 1.489A8 8 0 1 0 12 20a8.094 8.094 0 0 0 7.371-4.886 1 1 0 1 0-1.842-.779A6.071 6.071 0 0 1 12 18a6 6 0 1 1 4.243-10.243l-1.39 1.39a.5.5 0 0 0 .354.854H19.5A.5.5 0 0 0 20 9.5V5.207a.5.5 0 0 0-.854-.353z"></path> </g></svg>
                    </button>
                    <button id="next-button" onClick={handleNewText}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" ><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
            </div>
            <div id="sub-zone">
                <div id="speed-ac">WPM: {calculateWPM()} | ACC: {calculateAccuracy()}%</div>
               
            </div>
        </div>
    );
}