import AtlasLayout from "../layouts/AtlasLayout";
import AtlasCanvas from "../components/scene/AtlasCanvas";
import TopBar from "../components/hud/TopBar";
import LeftPanel from "../components/hud/LeftPanel";
import RightInspector from "../components/hud/RightInspector";
import BottomConsole from "../components/hud/BottomConsole";
import { SearchCommandPalette } from "../components/hud/SearchCommandPalette";

export default function DigitalTwin() {
  return (
    <>
      <SearchCommandPalette />
      <AtlasLayout
        hud={<TopBar />}
        leftPanel={<LeftPanel />}
        rightPanel={<RightInspector />}
        bottomPanel={<BottomConsole />}
      >
        <AtlasCanvas />
      </AtlasLayout>
    </>
  );
}