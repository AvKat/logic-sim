import { Board } from "./Board";
import { useAppSelector } from "./redux/store";

export const useGetCompiled = () => {
  const boardValues = useAppSelector((state) => state.board);
  const base = useAppSelector((state) => state.project.currentProject?.base);

  return () => {
    const board = new Board({
      ...boardValues,
      base,
    });
    return board.generateTruthTable();
  };
};
