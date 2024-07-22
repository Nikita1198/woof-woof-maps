import { lazy } from "react";
import { AppRoot, ConfigProvider, AdaptivityProvider } from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import "./App.css";
import { useThemeParams } from "@vkruglikov/react-telegram-web-app";

const WelcomeScreens = lazy(() => import("./screens/WelcomeScreens"));

function App() {
  const [colorScheme] = useThemeParams();

  return (
    <ConfigProvider appearance={colorScheme}>
      <AdaptivityProvider>
        <AppRoot>
          <WelcomeScreens />
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
}

export default App;
