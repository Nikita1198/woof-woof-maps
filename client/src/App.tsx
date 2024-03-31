import { AppRoot, ConfigProvider, AdaptivityProvider } from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import "./App.css";
import { useThemeParams } from "@vkruglikov/react-telegram-web-app";
import MainScreens from "./screens/MainScreens";

function App() {
  const [colorScheme] = useThemeParams();

  return (
    <ConfigProvider appearance={colorScheme}>
      <AdaptivityProvider>
        <AppRoot>
          <MainScreens />
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
}

export default App;
