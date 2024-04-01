import { Icon56MessageReadOutline } from "@vkontakte/icons";
import {
  Avatar,
  Button,
  Group,
  PanelHeader,
  PanelHeaderBack,
  Placeholder,
  Separator,
} from "@vkontakte/vkui";
import { Panel } from "@vkontakte/vkui/dist/components/Panel/Panel";
import { View } from "@vkontakte/vkui/dist/components/View/View";
import React from "react";
import { useWebApp } from "@vkruglikov/react-telegram-web-app";

const botUrl = "https://t.me/Woof_WoofBot";

const MainScreens = () => {
  const [activePanel, setActivePanel] = React.useState("panel1");

  const WebApp = useWebApp();
  const openBotLink = () => {
    if (WebApp) {
      WebApp.openLink(botUrl);
    }
  };

  return (
    <View activePanel={activePanel}>
      <Panel id={"panel1"}>
        <Group>
          <Placeholder
            style={{ paddingTop: 25, paddingBottom: 30 }}
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
            style={{ paddingTop: 20 }}
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
              <Button size="m" onClick={openBotLink}>
                Перейти к боту
              </Button>
            }
          >
            Нажмите, чтобы перейти к боту и поделиться вашей геопозицией.
          </Placeholder>
        </Group>
      </Panel>

      <Panel id={"panel3"}>
        <PanelHeader after={<Avatar size={36} />}>Panel 3</PanelHeader>
        <Group>
          <Placeholder
            icon={<Icon56MessageReadOutline />}
            action={
              <Button size="m" mode="tertiary">
                Показать все сообщения
              </Button>
            }
          >
            Нет непрочитанных
            <br />
            сообщений
          </Placeholder>
        </Group>
      </Panel>
    </View>
  );
};

export default MainScreens;
