import DigitalTwin from "./pages/DigitalTwin";
import { AtlasProvider } from "./AtlasProvider";

export function Atlas() {
  return (
    <AtlasProvider>
      <DigitalTwin />
    </AtlasProvider>
  );
}

export default Atlas;
