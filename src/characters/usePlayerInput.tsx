import { useThree } from "@react-three/fiber";
import { RefObject, useCallback, useContext, useEffect, useState } from "react";
import { Mesh, Raycaster, Vector2, Vector3 } from "three";
import { CharacterInput } from "../games/characterInput";
import { CharacterInputType } from "../games/characterInputType";
import { GameContext } from "../games/GameContext";
import { useClick } from "../scenes/useClick";

export function usePlayerInput(id: string, meshRef: RefObject<Mesh>) {
  const [input, setInput] = useState<Omit<CharacterInput, "time">>();

  const { camera, clock } = useThree();

  const { floors: gameFloors, setCharacters } = useContext(GameContext);

  useClick(
    useCallback(
      (event) => {
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new Raycaster();
        raycaster.setFromCamera(new Vector2(x, y), camera);

        const meshes = gameFloors
          .map((floor) => floor.meshRef.current)
          .filter((mesh) => mesh)
          .map((mesh) => mesh!);

        const intersects = raycaster.intersectObjects(
          meshRef.current ? [...meshes, meshRef.current] : meshes,
          true
        );

        if (intersects.length <= 0) {
          return;
        }

        const intersectFloors = intersects.map((intersect) => ({
          intersect,
          floor: gameFloors.find(
            (floor) => floor.meshRef.current === intersect.object
          ),
        }));

        const inputType = intersectFloors[0].floor
          ? CharacterInputType.Move
          : CharacterInputType.Smash;

        const intersectFloor = intersectFloors.find((item) => item.floor);
        if (!intersectFloor) {
          return;
        }

        const floorPosition = new Vector3();
        intersectFloor.floor?.groupRef.current?.getWorldPosition(floorPosition);

        const inputTarget = new Vector3(
          intersectFloor.intersect.point.x,
          floorPosition.y,
          intersectFloor.intersect.point.z
        );

        setInput({ type: inputType, target: inputTarget });
      },
      [camera, gameFloors, meshRef]
    )
  );

  useEffect(() => {
    if (!input) {
      return;
    }

    const time = clock.getElapsedTime();

    setCharacters((characters) =>
      characters.map((character) =>
        character.id === id
          ? {
              ...character,
              inputs: [
                ...character.inputs,
                {
                  time,
                  ...input,
                },
              ],
            }
          : character
      )
    );
  }, [clock, id, input, setCharacters]);

  return input;
}
