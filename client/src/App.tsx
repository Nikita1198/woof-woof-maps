import { Suspense, lazy } from "react";
import {
  AppRoot,
  ConfigProvider,
  AdaptivityProvider,
  Spinner,
} from "@vkontakte/vkui";
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
          <Suspense fallback={<Spinner size="large" />}>
            <WelcomeScreens />
          </Suspense>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
}

export default App;
