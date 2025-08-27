import { useState, useEffect, useRef, useCallback } from "react";
import "./TypingBox.css";

const sampleTexts = [
    "The Industrial Revolution marked a pivotal period of profound technological and socioeconomic transformation that began in Great Britain, completely reshaping societies by shifting them from agrarian economies to industrial powerhouses.",
    "Artificial intelligence is rapidly evolving, with large language models demonstrating remarkable capabilities in understanding and generating human-like text, which has profound implications for the future of communication and problem-solving.",
    "Beneath the vast canopy of the ancient, whispering forest, a hidden stream trickled over smooth, moss-covered stones, its gentle melody a secret language known only to the nocturnal creatures and the silent moon.",
    "Exploring the deep ocean reveals a breathtakingly diverse ecosystem of bioluminescent creatures and hydrothermal vents, a mysterious and largely uncharted frontier that continues to challenge our understanding of life on Earth and its incredible adaptability to extreme environments."
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

    const inputRef = useRef(null);
    const cursorRef = useRef(null);
    const wordRefs = useRef([]);
    const blurTimeoutRef = useRef(null);
    const countedLetters = useRef(new Set());
    const countedWords = useRef(new Set());

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
        countedLetters.current.clear();
        countedWords.current.clear();
        wordRefs.current.forEach(wordNode => {
            wordNode?.childNodes.forEach(letterNode => {
                letterNode.classList.remove("correct", "incorrect", "skipped");
            });
        });
    }, []);

    const generateNewText = useCallback(() => {
        let newText;
        do {
            newText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        } while (newText === text);
        setText(newText);
        resetTyping();
    }, [text, resetTyping]);

    useEffect(() => {
        if (!text) return;

        wordRefs.current.forEach((el, i) => el?.classList.toggle("active", i === wordIndex));

        const sourceWords = text.split(" ");
        const typedWords = input.split(" ");
        
        const validateCurrentLetter = () => {
            const currentWordIndex = Math.max(0, typedWords.length - 1);
            const typedWord = typedWords[currentWordIndex] || "";
            setWordIndex(currentWordIndex);
            setLetterIndex(typedWord.length);

            const wordNode = wordRefs.current[currentWordIndex];
            if (!wordNode) return;

            const currentLetterIndex = typedWord.length - 1;
            const letterNode = wordNode.children[currentLetterIndex];
            if (!letterNode) return;

            const sourceChar = sourceWords[currentWordIndex]?.[currentLetterIndex];
            const typedChar = typedWord[currentLetterIndex];

            if (typedChar === sourceChar) {
                letterNode.classList.add("correct");
                letterNode.classList.remove("incorrect", "skipped");
                addLettersUserList(typedChar, "c");
            } else {
                letterNode.classList.add("incorrect");
                letterNode.classList.remove("correct", "skipped");
                addLettersUserList(sourceChar, "w");
            }
        };

        const validateCompletedWord = () => {
            const wordJustTypedIndex = typedWords.length - 2;
            if (wordJustTypedIndex < 0) return;

            const sourceWord = sourceWords[wordJustTypedIndex] || "";
            const typedWord = typedWords[wordJustTypedIndex] || "";
            const wordNode = wordRefs.current[wordJustTypedIndex];
            if (!wordNode) return;

            for (let i = 0; i < sourceWord.length; i++) {
                const letterNode = wordNode.children[i];
                if (!letterNode) continue;

                const typedChar = typedWord[i];
                if (typedChar === undefined) {
                    letterNode.classList.add("skipped");
                    letterNode.classList.remove("correct", "incorrect");
                    addLettersUserList(sourceWord[i], "w");
                } else if (typedChar === sourceWord[i]) {
                    letterNode.classList.add("correct");
                    letterNode.classList.remove("incorrect", "skipped");
                }
            }

            if (typedWord === sourceWord) {
                setLockedIndex(input.length);
                addWordsUserList(sourceWord, "c");
            } else {
                addWordsUserList(sourceWord, "w");
            }

            setWordIndex(wordJustTypedIndex + 1);
            setLetterIndex(0);
        };

        if (input.endsWith(" ")) {
            validateCompletedWord();
        } else if (input.length > 0) {
            validateCurrentLetter();
        } else {
            resetTyping();
        }

    }, [input, text, wordIndex, addLettersUserList, addWordsUserList, resetTyping]);

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
        } else {
            return;
        }

        const containerLeft = cursorNode.parentElement.getBoundingClientRect().left;
        cursorNode.style.top = `${activeWordNode.getBoundingClientRect().top - cursorNode.parentElement.getBoundingClientRect().top}px`;
        cursorNode.style.left = `${newLeft - containerLeft}px`;

    }, [letterIndex, wordIndex, input]);
    
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
    
    useEffect(() => {
        generateNewText();
    }, []);


    const handleChange = (e) => {
        const value = e.target.value;
        if (value.length < lockedIndex) return;
        setInput(value);
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        // focusInput()
        pass 
      } 
      // const typingKeys = /^[a-zA-Z0-9 `~!@#$%^&*()_+\-=[\]{}|;:'",.<>/?\\]$/;

      // if (typingKeys.test(e.key) || e.key === "Backspace" || e.key === "Tab") {
      //     setIsTyping(true);
      // } else {
      //     setIsTyping(false);
      // }
    }
    const handleNewText = () => {
        generateNewText();
        inputRef.current?.focus();
    };

    const focusInput = () => {
        if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
        inputRef.current?.focus();
        cursorRef.current?.classList.remove("hidden");
        setOnFocus(true);
    };
    const directBlur = () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = setTimeout(() => {
            setOnFocus(false);
            cursorRef.current?.classList.add("hidden");
        }, 2000);
    }

    const handleBlur = () => {
        cursorRef.current?.classList.add("hidden");
        // setIsTyping(false)
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
        <div id="middle-zone">

        </div>
        <div id="typing-container" onClick={focusInput}>
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
            />
            <div id="words-container" >
                {!onFocus && (
                    <div className="OnFocusOffWarn">
                        Click here or press any key to focus
                    </div>
                )}
                <div id="t-cursor" className="default" ref={cursorRef}></div>
                <div id="words" className={!onFocus ? "blurred" : ""}>{renderText(text)}</div>
            </div>
            <button id="restart-button" onClick={handleNewText}>
              <svg width="2.5em" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19.146 4.854l-1.489 1.489A8 8 0 1 0 12 20a8.094 8.094 0 0 0 7.371-4.886 1 1 0 1 0-1.842-.779A6.071 6.071 0 0 1 12 18a6 6 0 1 1 4.243-10.243l-1.39 1.39a.5.5 0 0 0 .354.854H19.5A.5.5 0 0 0 20 9.5V5.207a.5.5 0 0 0-.854-.353z"></path> </g></svg>
            </button>
        </div>
        <div id="footer-zone">

        </div>
      </div>
    );
}