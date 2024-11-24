import { useFrame, Vector3 } from "@react-three/fiber";
import { useContext, useEffect, useRef } from "react";
import { Group } from "three";
import { useShakeCamera } from "../../scenes/useShakeCamera";
import { ButtonBox } from "../stage1/ButtonBox";
import { FloorContext } from "../stage1/FloorContext";
import { useGetPressers } from "../stage1/useGetPressers";

export function PressingButton({ position, pressing, setPressing }: Props) {
  const buttonRef = useRef<Group>(null);
  const size = 1.1;
  const getPressers = useGetPressers(buttonRef, size, size);
  useFrame(() => {
    const currentPressers = getPressers();
    setPressing(currentPressers.length > 0);
  });

  const shakeCamera = useShakeCamera();
  useEffect(() => {
    if (pressing) {
      shakeCamera();
    }
  }, [pressing, shakeCamera]);

  const { visiting } = useContext(FloorContext);

  return (
    <ButtonBox
      boxRef={buttonRef}
      width={size}
      depth={size}
      position={position}
      opacity={visiting ? 1 : 0.6}
      pressed={pressing}
    />
  );
}

interface Props {
  position: Vector3;
  pressing: boolean;
  setPressing: (pressing: boolean) => void;
}
