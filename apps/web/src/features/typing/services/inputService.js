export const InputType = Object.freeze({
  CHAR: 'CHAR',
  BACKSPACE: 'BACKSPACE',
  SPACE: 'SPACE',
  IGNORE: 'IGNORE',
});

export const InputService = {
  classify(key, ctrlKey, metaKey, altKey) {
    if (ctrlKey || metaKey || altKey) {
      return InputType.IGNORE;
    }

    if (key === 'Backspace') {
      return InputType.BACKSPACE;
    }

    if (key === ' ') {
      return InputType.SPACE;
    }

    if (key.length === 1) {
      return InputType.CHAR;
    }

    return InputType.IGNORE;
  }
};