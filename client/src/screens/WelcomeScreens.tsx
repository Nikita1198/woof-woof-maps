import {
  Avatar,
  Button,
  ButtonGroup,
  Group,
  PanelHeader,
  PanelHeaderBack,
  PanelHeaderClose,
  Placeholder,
  Separator,
} from "@vkontakte/vkui";
import { Panel } from "@vkontakte/vkui/dist/components/Panel/Panel";
import { View } from "@vkontakte/vkui/dist/components/View/View";
import React from "react";
import { useWebApp } from "@vkruglikov/react-telegram-web-app";
import { YMaps, Map } from "@pbe/react-yandex-maps";

const MainScreens = () => {
  const [activePanel, setActivePanel] = React.useState("panel1");

  const WebApp = useWebApp();

  const mapState = {
    center: [47.2313, 39.7233],
    zoom: 15,
  };

  const openBotLinkAndSendCommand = () => {
    const command = "/starBtroadcasting";
    if (WebApp) {
      WebApp.sendData(command);
      WebApp.close();
    }
  };

  return (
    <View activePanel={activePanel}>
      <Panel id={"panel1"}>
        <Group>
          <Placeholder
            icon={
              <img
                src="..\walk-the-pet.png"
                style={{ maxWidth: 82, maxHeight: 82 }}
              />
            }
            header="Владелец питомца"
            action={
              <Button size="m" onClick={() => setActivePanel("panel3")}>
                Найти выгульщика
              </Button>
            }
          >
            Найдите надежного человека для прогулки с вашим пушистым другом.
          </Placeholder>
          <Separator />
          <Placeholder
            icon={
              <img
                src="..\walker_light.png"
                style={{ maxWidth: 82, maxHeight: 82 }}
              />
            }
            header="Выгульщик"
            action={
              <Button size="m" onClick={() => setActivePanel("panel2")}>
                Начните своё приключение
              </Button>
            }
          >
            Поделитесь вашей любовью к собакам, помогая владельцам в их заботе.
          </Placeholder>
        </Group>
      </Panel>

      <Panel id={"panel2"}>
        <PanelHeader
          delimiter="spacing"
          before={<PanelHeaderBack onClick={() => setActivePanel("panel1")} />}
        ></PanelHeader>
        <Group>
          <Placeholder
            icon={
              <img
                src="..\location.png"
                style={{ maxWidth: 160, maxHeight: 160 }}
              />
            }
            header="Готовы выгуливать?"
            action={
              <ButtonGroup mode="horizontal" gap="m" stretched>
                <Button size="m" onClick={openBotLinkAndSendCommand}>
                  Перейти к боту
                </Button>
                <Button
                  size="m"
                  mode="secondary"
                  onClick={() => setActivePanel("panel3")}
                >
                  К Картам
                </Button>
              </ButtonGroup>
            }
          >
            Нажмите, чтобы перейти к боту и поделиться вашей геопозицией.
          </Placeholder>
        </Group>
      </Panel>

      <Panel id={"panel3"}>
        <PanelHeader
          before={<PanelHeaderClose onClick={() => setActivePanel("panel2")} />}
          after={<Avatar size={36} />}
        >
          Карты
        </PanelHeader>
        <YMaps>
          <div style={{ height: "100vh", width: "100vw" }}>
            <Map state={mapState} width="100%" height="100%" />
          </div>
        </YMaps>
      </Panel>
    </View>
  );
};

export default MainScreens;
