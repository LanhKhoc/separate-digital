window.addEventListener('load', () => {
  const pattern =  /^[0-9]*$/;
  const KEYCODE = {
    ARROW_LEFT: 37,
    ARROW_RIGHT: 39,
    BACKSPACE: 8,
    CTRL: 17,
    CMD: 91,
    V: 86
  };
  const TOTAL_INPUT = 4;
  const $input = Array.from(document.getElementsByClassName('js-input'));
  const keyTracker = {};

  const _focusPrevInput = (index, _) => {
    return index - 1 >= 0 && $input[index-1].focus();
  }

  const _focusNextInput = (index, _) => {
    return index + 1 < TOTAL_INPUT && $input[index+1].focus();
  }

  const _fillInputThenFocusNext = (index, val) => {
    if (pattern.test(val)) {
      $input[index].value = val;
      _focusNextInput(index);
    }
  }

  _deleteInput = (index, _) => {
    $input[index].value === '' && _focusPrevInput(index);
    $input[index].value = '';
  }

  const _handleKeyControl = (keyCode) => {
    const switchCase = {
      [KEYCODE.ARROW_LEFT]: _focusPrevInput,
      [KEYCODE.ARROW_RIGHT]: _focusNextInput,
      [KEYCODE.BACKSPACE]: _deleteInput
    };

    return switchCase[keyCode] || _fillInputThenFocusNext;
  }

  const handleKeyDown = (index) => (e) => {
    const isPaste = (keyTracker[KEYCODE.CTRL] || keyTracker[KEYCODE.CMD]) && e.keyCode === KEYCODE.V;
    !isPaste && e.preventDefault();

    keyTracker[e.keyCode] = true;
    const val = +e.key;
    _handleKeyControl(e.which)(index, val);
  }

  const handleKeyUp = (_) => (e) => {
    e.preventDefault();
    keyTracker[e.keyCode] = false;
  }

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedText = e.clipboardData.getData('Text').trim() || window.clipboardData.trim();
    if (pattern.test(pastedText)) {
      pastedText.split("").slice(0, 4).forEach((digit, index) => $input[index].value = +digit)
      const lastIndexInputFocus = pastedText.split("").slice(0, 4).length - 1;
      $input[lastIndexInputFocus].focus();
    }
  }

  // NOTE: Run!!!
  $input.forEach(($ele, idx) => {
    $ele.addEventListener('keydown', handleKeyDown(idx));
    $ele.addEventListener('keyup', handleKeyUp(idx));
    $ele.addEventListener('paste', handlePaste);
  })
});