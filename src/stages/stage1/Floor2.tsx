import { useCallback, useEffect, useState } from "react";
import { Coin } from "./Coin";
import { Floor } from "./Floor";
import { OnePressButton } from "./OnePressButton";

export function Floor2({ index, setLevel }: Props) {
  const [pressed1, setPressed1] = useState(false);
  const [pressed2, setPressed2] = useState(false);

  useEffect(() => {
    if (pressed1 && pressed2) {
      setLevel(index + 1);
    }
  }, [index, pressed1, pressed2, setLevel]);

  return (
    <Floor index={index} width={10} depth={10}>
      <OnePressButton
        width={1.1}
        depth={1.1}
        position={[0, 0, -3]}
        onPress={useCallback(() => setPressed1(true), [])}
      />

      <Coin position={[3, 0, 0]} />

      <OnePressButton
        width={1.1}
        depth={1.1}
        position={[0, 0, 3]}
        onPress={useCallback(() => setPressed2(true), [])}
      />
    </Floor>
  );
}

interface Props {
  index: number;

  setLevel: (index: number) => void;
}