import React, { useLayoutEffect, useState, useRef } from 'react';
import { Word } from './Word.jsx';
import { Caret } from './Caret.jsx';
import { SessionStatus } from '../models/Session.js';

export const TypingArea = ({ passage, session }) => {
  const [caretPos, setCaretPos] = useState({ top: 0, left: 0 });
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    
    // The target is the current character we need to type
    const targetId = `char-${session.currentWordIndex}-${session.currentCharIndex}`;
    const targetEl = document.getElementById(targetId);
    
    if (targetEl) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      
      setCaretPos({
        top: targetRect.top - containerRect.top + 4, // slight vertical offset
        left: targetRect.left - containerRect.left,
      });
    } else if (session.currentCharIndex > 0) {
      // End of word, target the last typed char and append width
      const lastCharId = `char-${session.currentWordIndex}-${session.currentCharIndex - 1}`;
      const lastCharEl = document.getElementById(lastCharId);
      if (lastCharEl) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const targetRect = lastCharEl.getBoundingClientRect();
        setCaretPos({
          top: targetRect.top - containerRect.top + 4,
          left: targetRect.right - containerRect.left,
        });
      }
    }
  }, [session.currentWordIndex, session.currentCharIndex, passage]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full max-w-5xl mx-auto p-4 text-left leading-relaxed flex flex-wrap"
    >
      <Caret 
        top={caretPos.top} 
        left={caretPos.left} 
        isVisible={session.status !== SessionStatus.COMPLETED} 
      />
      {passage.words.map((word, index) => (
        <Word
          key={word.index}
          word={word}
          characterStates={session.characterStates}
          extraChars={session.extraCharacters[word.index]}
          isCurrent={index === session.currentWordIndex}
          currentCharIndex={index === session.currentWordIndex ? session.currentCharIndex : -1}
        />
      ))}
    </div>
  );
};