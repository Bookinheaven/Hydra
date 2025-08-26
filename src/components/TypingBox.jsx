import { useState, useEffect } from "react";
import "./TypingBox.css"

const sampleTexts = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing fast takes practice and patience.",
    "Monkeytype is fun but this one will be smarter.",
    "The Industrial Revolution marked a pivotal period of profound technological and socioeconomic transformation that began in Great Britain, completely reshaping societies by shifting them from agrarian economies to industrial powerhouses.",
    "Artificial intelligence is rapidly evolving, with large language models demonstrating remarkable capabilities in understanding and generating human-like text, which has profound implications for the future of communication and problem-solving.",
    "Beneath the vast canopy of the ancient, whispering forest, a hidden stream trickled over smooth, moss-covered stones, its gentle melody a secret language known only to the nocturnal creatures and the silent moon.",
    "Exploring the deep ocean reveals a breathtakingly diverse ecosystem of bioluminescent creatures and hydrothermal vents, a mysterious and largely uncharted frontier that continues to challenge our understanding of life on Earth and its incredible adaptability to extreme environments."

];

export default function TypingBox() {
    const [text, setText] = useState("");
    const [input, setInput] = useState("");
    const [index, setIndex] = useState(0);

    useEffect(()=> {
        setText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
    }, [index])

    const handleChange = (e) => {
        setInput(e.target.value);
    }
    function renderText(textToRender) {
        if (!textToRender) return null;
        return textToRender.split(' ').map((word, wordIndex) => (
            <div className="word" key={wordIndex}> 
                {word.split('').map((char, charIndex) => (
                    <span key={`${wordIndex}-${charIndex}`}>
                        {char}
                    </span>
                ))}
            </div>
        ));
    }
    function getTextWithIndex(text, index) {
        return text.split(' ')[index]
    }
    return (
        <div id="typing-container" className="">
            <div id="words-container" className="">
                <input id="wordsInput" className="" 
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
                    placeholder={getTextWithIndex(text, index)}
                ></input>
                <div id="t-cursor" className="default"></div>
                <div id="words">
                    {renderText(text)}
                </div>
            </div>
        </div>
    )

}