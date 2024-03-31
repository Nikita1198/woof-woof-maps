import { Icon56MessageReadOutline } from "@vkontakte/icons";
import {
  Avatar,
  Button,
  Group,
  Image,
  PanelHeader,
  Placeholder,
  Separator,
} from "@vkontakte/vkui";
import { Panel } from "@vkontakte/vkui/dist/components/Panel/Panel";
import { View } from "@vkontakte/vkui/dist/components/View/View";
import React from "react";

const MainScreens = () => {
  const [activePanel, setActivePanel] = React.useState("main");

  return (
    <View activePanel={activePanel}>
      <Panel id={"main"}>
        <Group>
          <Placeholder
            icon={
              <Image
                src="..\public\walk-the-pet.png"
                style={{ minWidth: 80, minHeight: 80, border: 0 }}
              />
            }
            header="Владелец питомца"
          >
            Найдите надежного человека для прогулки с вашим пушистым другом.
          </Placeholder>
          <Separator />
          <Placeholder
            icon={
              <Image
                src="..\public\walker_light.png"
                style={{ minWidth: 80, minHeight: 80, border: 0 }}
              />
            }
            header="Выгульщик"
            action={<Button size="m">Начните своё приключение</Button>}
          >
            Поделитесь вашей любовью к собакам, помогая владельцам в их заботе.
          </Placeholder>
        </Group>
      </Panel>

      <Panel id={"main2"}>
        <PanelHeader after={<Avatar size={36} />}>Panel 2</PanelHeader>
        <Group>
          <Placeholder>Доступ запрещён</Placeholder>
          <Separator />
          <Placeholder
            header="Находите друзей"
            action={<Button size="m">Найти друзей</Button>}
          >
            Здесь будут отображаться люди, которых вы добавите в друзья
          </Placeholder>
        </Group>
      </Panel>

      <Panel id={"main3"}>
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
