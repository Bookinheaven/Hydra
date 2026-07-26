import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { Word } from './Word.jsx';
import { Caret } from './Caret.jsx';
import { SessionStatus } from '../models/Session.js';

export const TypingArea = ({ passage, session }) => {
  const [caretPos, setCaretPos] = useState({ top: 0, left: 0 });
  const [isFocused, setIsFocused] = useState(true);
  const [scrollOffset, setScrollOffset] = useState(0);
  const containerRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const onBlur = () => setIsFocused(false);
    const onFocus = () => setIsFocused(true);
    const onKeyDown = () => setIsFocused(true);

    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  // Reset scroll when passage changes (new test)
  useEffect(() => {
    setScrollOffset(0);
  }, [passage]);

  useLayoutEffect(() => {
    if (!innerRef.current) return;
    const inner = innerRef.current;
    
    const targetId = `char-${session.currentWordIndex}-${session.currentCharIndex}`;
    const targetEl = document.getElementById(targetId);
    const caretHeight = 28;
    const lineHeight = 48;
    
    if (targetEl) {
      // Use offsetTop/offsetLeft which are relative to the inner div (the offsetParent)
      // This avoids the coordinate mismatch caused by translateY
      const charTop = targetEl.offsetTop;
      const charLeft = targetEl.offsetLeft;
      const charHeight = targetEl.offsetHeight;

      // Scroll: advance lines when the active character is past line 2
      const visibleHeight = lineHeight * 3;
      if (charTop - scrollOffset > visibleHeight - lineHeight) {
        setScrollOffset(charTop - lineHeight);
      } else if (session.currentWordIndex === 0 && session.currentCharIndex === 0) {
        setScrollOffset(0);
      }

      setCaretPos({
        top: charTop + (charHeight - caretHeight) / 2,
        left: charLeft,
      });
    } else if (session.currentCharIndex > 0) {
      // We're past the end of the word (extra chars or end-of-word)
      const lastCharId = `char-${session.currentWordIndex}-${session.currentCharIndex - 1}`;
      const lastCharEl = document.getElementById(lastCharId);
      if (lastCharEl) {
        const charTop = lastCharEl.offsetTop;
        const charHeight = lastCharEl.offsetHeight;
        setCaretPos({
          top: charTop + (charHeight - caretHeight) / 2,
          left: lastCharEl.offsetLeft + lastCharEl.offsetWidth,
        });
      }
    }
  }, [session.currentWordIndex, session.currentCharIndex, passage, scrollOffset]);

  return (
    <div className="relative w-full max-w-[1400px] mx-auto select-none font-mono">
      {/* Focus shield overlay */}
      {!isFocused && session.status !== SessionStatus.COMPLETED && (
        <div 
          onClick={() => setIsFocused(true)}
          className="absolute inset-0 z-30 flex items-center justify-center bg-[var(--bg-color)]/80 backdrop-blur-[3px] cursor-pointer rounded-xl transition-all duration-200"
        >
          <div className="flex items-center gap-3 text-[var(--sub-color)] font-mono text-sm font-semibold opacity-80">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--main-color)]" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <span className="tracking-wider lowercase">click or press any key to focus</span>
          </div>
        </div>
      )}

      {/* Outer clip container — fixed height, hides overflow */}
      <div 
        ref={containerRef} 
        className={`relative w-full overflow-hidden text-left transition-opacity duration-200 ${
          !isFocused ? 'opacity-20 blur-[2px]' : 'opacity-100'
        }`}
        style={{ height: '156px' }}
      >
        {/* Inner content — slides up via translateY. Caret lives here so coordinates match. */}
        <div 
          ref={innerRef}
          className="relative w-full flex flex-wrap content-start"
          style={{ 
            transform: `translateY(-${scrollOffset}px)`,
            transition: 'transform 0.15s ease-out',
          }}
        >
          <Caret 
            top={caretPos.top} 
            left={caretPos.left} 
            isVisible={isFocused && session.status !== SessionStatus.COMPLETED} 
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
      </div>
    </div>
  );
};