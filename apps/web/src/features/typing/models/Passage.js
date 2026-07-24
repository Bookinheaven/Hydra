export class Passage {
  constructor(text) {
    this.text = text;
    this.words = this._parseWords(text);
    this.totalCharacters = text.length;
    Object.freeze(this);
  }

  _parseWords(text) {
    const rawWords = text.split(' ');
    let charIndexOffset = 0;
    
    return Object.freeze(rawWords.map((word, wordIndex) => {
      const parsedWord = {
        index: wordIndex,
        text: word,
        characters: Object.freeze(word.split('').map((char, charIndex) => Object.freeze({
          index: charIndex,
          globalIndex: charIndexOffset + charIndex,
          expected: char,
        }))),
        hasTrailingSpace: wordIndex < rawWords.length - 1,
        startIndex: charIndexOffset,
        endIndex: charIndexOffset + word.length - 1,
      };
      
      charIndexOffset += word.length + 1;
      return Object.freeze(parsedWord);
    }));
  }
}
