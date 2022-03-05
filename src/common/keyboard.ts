export function keyboard(value: string) {
  const key = {
    value,
    isDown: false,
    isUp: true,
    press: () => {},
    release: () => {},
    downHandler: (event: KeyboardEvent) => {
      if (event.key === key.value) {
        if (key.isUp && key.press) {
          key.press();
        }
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
      }
    },
    upHandler: (event: KeyboardEvent) => {
      if (event.key === key.value) {
        if (key.isDown && key.release) {
          key.release();
        }
        key.isDown = false;
        key.isUp = true;
        event.preventDefault();
      }
    },
    unsubscribe: () => {
      window.removeEventListener("keydown", key.downHandler);
      window.removeEventListener("keyup", key.upHandler);
    },
  };

  window.addEventListener("keydown", key.downHandler, false);
  window.addEventListener("keyup", key.upHandler, false);

  return key;
}
