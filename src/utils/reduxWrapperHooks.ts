import { Board } from "./Board";
import { BoardSliceActions } from "./redux/boardSlice";
import { MainSliceActions } from "./redux/mainSlice";
import { useAppDispatch, useAppSelector } from "./redux/store";

export const useGetCompiled = () => {
  const boardValues = useAppSelector((state) => state.board);

  if (!boardValues.base) {
    return;
  }

  return () => {
    const board = new Board(boardValues);
    return board.generateTruthTable();
  };
};

export const useCloseProject = () => {
  const dispatch = useAppDispatch();
  return () => {
    dispatch(MainSliceActions.setBoardOpen(false));
    dispatch(BoardSliceActions.clearData());
    dispatch(MainSliceActions.closeProject());
  };
};

export const useCurrentProject = () => {
  const { currentProjectIndex, availableProjects } = useAppSelector(
    (state) => state.project
  );
  if (currentProjectIndex === undefined) {
    return;
  }

  return availableProjects[currentProjectIndex];
};
