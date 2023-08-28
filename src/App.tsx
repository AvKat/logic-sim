import "./App.css";
import { Divider } from "./components/Divider";
import { MenuBar } from "./components/MenuBar";
import { PreviewArea } from "./components/PreviewArea";
import { WorkArea } from "./components/WorkArea";
import { MenuBarHeight } from "./utils/constants";
import ReactModal from "react-modal";
import { NoCurrentProjectScreen } from "./components/NoCurrentProjectScreen";
import { useCurrentProject } from "./utils/reduxWrapperHooks";

ReactModal.setAppElement("#root");

const App = () => {
  const currentProject = useCurrentProject();
  if (currentProject === undefined) {
    return <NoCurrentProjectScreen />;
  }

  return (
    <>
      <MenuBar />
      <Divider type="horizontal" />
      <div
        className="w-screen bg-[#353535] flex m-0"
        style={{
          height: `calc(100vh - ${MenuBarHeight + 2}px)`,
          position: "absolute",
          top: `${MenuBarHeight + 2}px`,
          left: 0,
        }}
      >
        <WorkArea />
        <Divider type="vertical" />
        <PreviewArea />
      </div>
    </>
  );
};

export default App;
