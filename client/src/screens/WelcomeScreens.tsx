import { Icon28UserOutline } from "@vkontakte/icons";
import {
  Cell,
  Group,
  PanelHeader,
  PanelHeaderBack,
  ScreenSpinner,
  SplitLayout,
  PanelHeaderContent,
  MiniInfoCell,
  ButtonGroup,
  FixedLayout,
  Separator,
  Spacing,
  Placeholder,
  SimpleCell,
  Button,
} from "@vkontakte/vkui";
import { Panel } from "@vkontakte/vkui/dist/components/Panel/Panel";
import { View } from "@vkontakte/vkui/dist/components/View/View";
import { useEffect, useState } from "react";

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
  const [timers, setTimers] = useState({});
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [popout, setPopout] = useState(null);
  const [loading, setLoading] = useState(false); // New state for loading

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

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers = { ...timers };
      cards.forEach((card) => {
        const registrationTime = new Date(card.created).getTime();
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - registrationTime;

        newTimers[card.id] = {
          hours: Math.floor((elapsedTime / (1000 * 60 * 60)) % 24)
            .toString()
            .padStart(2, "0"),
          minutes: Math.floor((elapsedTime / (1000 * 60)) % 60)
            .toString()
            .padStart(2, "0"),
          seconds: Math.floor((elapsedTime / 1000) % 60)
            .toString()
            .padStart(2, "0"),
        };
      });
      setTimers(newTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [timers, cards]);

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
      return null;
    }
  };

  // Function to fetch user info
  const fetchUserInfo = async (userId, token) => {
    try {
      const response = await fetch(
        "https://katya-agro.ru/api/api/get_user_info",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-tokens": token,
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );
      const data = await response.json();
      console.log(data); // Используйте данные пользователя по мере необходимости
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  // Function to fetch tasks
  const fetchTasks = async (token) => {
    setLoading(true); // Set loading to true before fetching
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
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Получаем ID пользователя из initData Telegram WebApp и JWT токен
  useEffect(() => {
    const fetchData = async () => {
      if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
        const userId = window.Telegram.WebApp.initDataUnsafe.user.id;
        setUserId(userId);
        const token = await fetchTokenFromBot(userId);
        if (token) {
          console.log("Received JWT Token:", token);
          setToken(token);
          fetchUserInfo(userId, token);
          fetchTasks(token);
        } else {
          console.error("Failed to fetch JWT token from bot");
        }
      }
    };
    fetchData();
  }, []);

  const getTimerColor = (elapsedMinutes) => {
    if (elapsedMinutes < 3) {
      return "green";
    } else if (elapsedMinutes < 6) {
      return "orange";
    } else {
      return "red";
    }
  };

  return (
    <SplitLayout
      popout={popout || (loading && <ScreenSpinner state="loading" />)}
      aria-live="polite"
      aria-busy={!!popout || loading}
    >
      <View activePanel={activePanel}>
        <Panel id="panel1">
          <PanelHeader>
            <PanelHeaderContent status={userId ? `MyID: ${userId}` : null}>
              Инциденты
            </PanelHeaderContent>
          </PanelHeader>
          {!loading && (
            <Group>
              {token ? (
                cards.length !== 0 ? (
                  cards.map((card) => (
                    <Cell
                      key={card.id}
                      expandable="auto"
                      before={<Icon28UserOutline />}
                      onClick={() => handleCardClick(card)}
                      after={
                        <div
                          style={{
                            textAlign: "left",
                            color: getTimerColor(timers[card.id]?.minutes || 0),
                          }}
                        >
                          {timers[card.id]
                            ? `${timers[card.id].hours}:${
                                timers[card.id].minutes
                              }:${timers[card.id].seconds}`
                            : "00:00:00"}
                        </div>
                      }
                    >
                      {card.summary}
                    </Cell>
                  ))
                ) : (
                  <Placeholder
                    icon={
                      <img src="../aphrodita_logo.png" width={170} alt="Logo" />
                    }
                    header="Инциденты отсутствуют"
                  />
                )
              ) : (
                <Placeholder
                  icon={
                    <img src="../aphrodita_logo.png" width={170} alt="Logo" />
                  }
                  header="Афродита вас не знает"
                />
              )}
            </Group>
          )}
        </Panel>
        <Panel id="panel2">
          {selectedCard && (
            <>
              <PanelHeader
                delimiter="spacing"
                before={
                  <PanelHeaderBack onClick={() => setActivePanel("panel1")} />
                }
              >
                <PanelHeaderContent status={selectedCard.description}>
                  {selectedCard.summary}
                </PanelHeaderContent>
              </PanelHeader>
              <Group>
                <SimpleCell>
                  Описание: {selectedCard.description}
                  <Spacing size={13} />
                  Номер счета: {selectedCard.details?.номер_счета}
                  <Spacing size={13} />
                  Статус: {selectedCard.status}
                  <Spacing size={13} />
                  Рейтинг: {selectedCard.details?.рейтинг}
                  <Spacing size={13} />
                  Что произошло: {selectedCard.details?.что_произошло}
                  <Spacing size={13} />
                  Купон: {selectedCard.details?.купон}
                  <Spacing size={13} />
                  Регистрация: {selectedCard.created}
                  <Spacing size={13} />
                  Расчет: {selectedCard.details?.расчет}
                  <Spacing size={13} />
                  Ставка: {selectedCard.details?.ставка}
                  <Spacing size={13} />
                  Выигрыш: {selectedCard.details?.выигрыш}
                  <Spacing size={13} />
                  Коэффициент: {selectedCard.details?.коэффициент}
                </SimpleCell>
              </Group>
              <Group style={{ marginBottom: 100 }}>
                <MiniInfoCell
                  onClick={() => handleOpenLink("https://www.google.com")}
                >
                  ЮзерПрофайл
                </MiniInfoCell>
                <MiniInfoCell
                  onClick={() => handleOpenLink("https://www.google.com")}
                >
                  БэкОфис
                </MiniInfoCell>
                <MiniInfoCell
                  onClick={() => handleOpenLink("https://www.google.com")}
                >
                  Графана
                </MiniInfoCell>
              </Group>
              <FixedLayout filled vertical="bottom">
                <Separator wide />
                <Group style={{ padding: 10, paddingBottom: 20 }}>
                  {timers[selectedCard.id] ? (
                    <div
                      style={{
                        paddingBottom: 10,
                        textAlign: "center",
                        color: getTimerColor(
                          parseInt(timers[selectedCard.id].minutes)
                        ),
                      }}
                    >
                      {`${timers[selectedCard.id].hours}:${
                        timers[selectedCard.id].minutes
                      }:${timers[selectedCard.id].seconds}`}
                    </div>
                  ) : null}
                  <ButtonGroup
                    mode="horizontal"
                    gap="m"
                    stretched
                    align="center"
                  >
                    <Button
                      onClick={setDoneScreenSpinner}
                      size="l"
                      appearance="negative"
                      stretched
                    >
                      БХ
                    </Button>
                    <Button
                      onClick={setDoneScreenSpinner}
                      size="l"
                      appearance="positive"
                      stretched
                    >
                      Нормальный
                    </Button>
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
