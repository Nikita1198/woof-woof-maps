import {
  Icon24GraphOutline,
  Icon24StorefrontOutline,
  Icon24UserSquareOutline,
  Icon28UserOutline,
} from "@vkontakte/icons";
import {
  Cell,
  Group,
  PanelHeader,
  PanelHeaderBack,
  ScreenSpinner,
  SplitLayout,
  PanelHeaderContent,
  ButtonGroup,
  FixedLayout,
  Separator,
  Placeholder,
  Button,
  Avatar,
  Accordion,
} from "@vkontakte/vkui";

import TimeAgo from "react-timeago";
import russianStrings from "react-timeago/lib/language-strings/ru";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

import { Panel } from "@vkontakte/vkui/dist/components/Panel/Panel";
import { View } from "@vkontakte/vkui/dist/components/View/View";
import { useEffect, useState } from "react";
import Logo from "../components/Logo";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Telegram: any;
  }
}

const MainScreens = () => {
  const [cards, setCards] = useState([]);
  const [activePanel, setActivePanel] = useState("panel1");
  const [selectedCard, setSelectedCard] = useState(null);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [popout, setPopout] = useState(<ScreenSpinner state="loading" />);
  const [loading, setLoading] = useState(true); // New state for loading

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setActivePanel("panel2");
  };

  const handleOpenLink = (url) => {
    window.open(url, "_blank");
  };

  const clearPopout = () => setPopout(null);

  const setDoneScreenSpinner = () => {
    setPopout(<ScreenSpinner state="loading" />);

    setTimeout(() => {
      setPopout(<ScreenSpinner state="done">Успешно</ScreenSpinner>);

      setTimeout(clearPopout, 1000);

      setCards(cards.filter((x) => x.id !== selectedCard.id));
      setActivePanel("panel1");
    }, 2000);
  };

  const formatter = buildFormatter(russianStrings);

  const fetchTokenFromBot = async (userId) => {
    try {
      const response = await fetch("https://katya-agro.ru/api/api/get_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error("Error fetching token from bot:", error);
      throw new Error("Failed to fetch token from bot");
    }
  };

  // Function to fetch tasks
  const fetchTasks = async (token) => {
    try {
      const response = await fetch("https://katya-agro.ru/api/api/get_tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-tokens": token,
        },
      });
      const data = await response.json();
      if (Array.isArray(data.tasks)) {
        console.log(data);
        setCards(data.tasks);
      } else {
        console.error("Unexpected response format:", data);
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw new Error("Error fetching tasks");
    }
  };

  // Function to set up polling
  const startPolling = (token, interval = 10000) => {
    fetchTasks(token);
    const polling = setInterval(() => fetchTasks(token), interval);
    return () => clearInterval(polling);
  };

  // Получаем ID пользователя из initData Telegram WebApp и JWT токен
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
          const userId = window.Telegram.WebApp.initDataUnsafe.user.id;
          setUserId(userId);
          const token = await fetchTokenFromBot(userId);
          console.log("Received JWT Token:", token);
          setToken(token);
          await fetchTasks(token);
          startPolling(token);
        } else {
          throw new Error("User ID not found");
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setLoading(false);
        clearPopout();
      }
    };

    fetchData();
  }, []);

  return (
    <SplitLayout popout={popout} aria-live="polite" aria-busy={!!popout}>
      <View activePanel={activePanel}>
        <Panel id="panel1">
          <PanelHeader>
            <PanelHeaderContent status={userId ? `MyID: ${userId}` : null}>
              Инциденты
            </PanelHeaderContent>
          </PanelHeader>
          {!loading && (
            <Accordion defaultExpanded={true}>
              <Accordion.Summary>All</Accordion.Summary>
              <Accordion.Content>
                <Group>
                  {token ? (
                    cards.length !== 0 ? (
                      cards.map((card) => (
                        <Cell
                          key={card.id}
                          expandable="auto"
                          before={
                            card.assignee_avatar ? (
                              <Avatar size={28} src={card.assignee_avatar} />
                            ) : (
                              <Icon28UserOutline />
                            )
                          }
                          onClick={() => handleCardClick(card)}
                          after={
                            <TimeAgo
                              date={card.created}
                              formatter={formatter}
                              live={true}
                            />
                          }
                        >
                          {card.summary}
                        </Cell>
                      ))
                    ) : (
                      <Placeholder
                        icon={<Logo />}
                        header="Инциденты отсутствуют"
                      />
                    )
                  ) : (
                    <Placeholder
                      icon={<Logo />}
                      header={
                        '"Не все то золото, что блестит, и не все то зло, что прячется в тени."'
                      }
                    >
                      Афродита вас не знает!
                    </Placeholder>
                  )}
                </Group>
              </Accordion.Content>
            </Accordion>
          )}
        </Panel>
        <Panel id="panel2">
          {selectedCard && (
            <>
              <PanelHeader
                delimiter="spacing"
                before={
                  <PanelHeaderBack
                    onClick={async () => {
                      setActivePanel("panel1");
                      await fetchTasks(token);
                    }}
                  />
                }
              >
                <PanelHeaderContent status={selectedCard.created}>
                  {selectedCard.summary}
                </PanelHeaderContent>
              </PanelHeader>
              <Group>
                <div
                  style={{ padding: "0 10px" }}
                  dangerouslySetInnerHTML={{ __html: selectedCard.description }}
                />
              </Group>
              <FixedLayout filled vertical="bottom">
                <Separator wide />
                <Group style={{ padding: 15, paddingBottom: 20 }}>
                  <ButtonGroup mode="vertical" gap="m" stretched>
                    <ButtonGroup
                      mode="horizontal"
                      gap="m"
                      stretched
                      align="center"
                    >
                      <Button
                        onClick={() => handleOpenLink("https://www.google.com")}
                        size="s"
                        appearance="accent"
                        mode="tertiary"
                        before={<Icon24StorefrontOutline />}
                        stretched
                      >
                        БэкОфис
                      </Button>
                      <Button
                        onClick={() => handleOpenLink("https://www.google.com")}
                        size="s"
                        appearance="accent"
                        mode="tertiary"
                        before={<Icon24UserSquareOutline />}
                        stretched
                      >
                        ЮзерПрофайл
                      </Button>
                      <Button
                        onClick={() => handleOpenLink("https://www.google.com")}
                        size="s"
                        appearance="accent"
                        mode="tertiary"
                        before={<Icon24GraphOutline />}
                        stretched
                      >
                        Графана
                      </Button>
                    </ButtonGroup>
                    <ButtonGroup
                      mode="horizontal"
                      gap="m"
                      stretched
                      align="center"
                    >
                      <Button
                        onClick={setDoneScreenSpinner}
                        size="m"
                        appearance="negative"
                        stretched
                      >
                        БХ
                      </Button>
                      <Button
                        onClick={setDoneScreenSpinner}
                        size="m"
                        appearance="positive"
                        stretched
                      >
                        Нормальный
                      </Button>
                    </ButtonGroup>
                  </ButtonGroup>
                </Group>
              </FixedLayout>
            </>
          )}
        </Panel>
      </View>
    </SplitLayout>
  );
};

export default MainScreens;
