import { ReactNode, useCallback, useState } from "react";
import { GiPointing } from "react-icons/gi";

interface Props {
  selected?: boolean;
  children: ReactNode;
}

export function Selectable({ selected = false, children }: Props) {
  const [active, setActive] = useState(false);
  const handleMouseEnter = useCallback(() => setActive(true), []);
  const handleMouseLeave = useCallback(() => setActive(false), []);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: "relative", opacity: active || selected ? 1 : 0.4 }}
    >
      {active && !selected && (
        <GiPointing
          fontSize={24}
          className="pointing-at-selection"
          style={{
            transform: "scaleX(-1)",
          }}
        />
      )}
      {children}
    </div>
  );
}
