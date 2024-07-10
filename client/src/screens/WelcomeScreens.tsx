import { Icon28UserOutline } from "@vkontakte/icons";
import {
  Cell,
  Group,
  PanelHeader,
  PanelHeaderBack,
  Button,
  SimpleCell,
  ScreenSpinner,
  SplitLayout,
  PanelHeaderContent,
  MiniInfoCell,
  ButtonGroup,
  FixedLayout,
  Separator,
  Spacing,
  Skeleton,
} from "@vkontakte/vkui";
import { Panel } from "@vkontakte/vkui/dist/components/Panel/Panel";
import { View } from "@vkontakte/vkui/dist/components/View/View";
import { useEffect, useState } from "react";
//import { useWebApp } from "@vkruglikov/react-telegram-web-app";

// Function to generate a random registration time within 1-10 minutes ago
const getRandomRegistrationTime = () => {
  const now = new Date();
  const minutesAgo = Math.floor(Math.random() * 9); // from 1 to 10 minutes
  const randomTime = new Date(now.getTime() - minutesAgo * 60 * 1000);
  return randomTime.toISOString();
};

// Sample card data
const initialCards = [
  {
    id: 1,
    title: "Антифрод 17582617 Ставка 100k",
    description: "Ставка 100k 07-08 16:27",
    details: {
      номер_счета: "17582617",
      статус: "Обычный",
      рейтинг: "88",
      что_произошло: "Ставка 100k",
      купон: "1452502645",
      регистрация: getRandomRegistrationTime(),
      расчет: "2024-07-08 16:27:24",
      ставка: "100000",
      выигрыш: "160000",
      коэффициент: "1.6",
    },
  },
  {
    id: 2,
    title: "Антифрод 27593451 Ставка 50k",
    description: "Ставка 50k 07-08 15:00",
    details: {
      номер_счета: "27593451",
      статус: "Высокий",
      рейтинг: "92",
      что_произошло: "Ставка 50k",
      купон: "1452502650",
      регистрация: getRandomRegistrationTime(),
      расчет: "2024-07-08 15:30:00",
      ставка: "50000",
      выигрыш: "75000",
      коэффициент: "1.5",
    },
  },
  {
    id: 3,
    title: "Антифрод 38475192 Ставка 200k",
    description: "Ставка 200k 07-08 14:45",
    details: {
      номер_счета: "38475192",
      статус: "Критический",
      рейтинг: "95",
      что_произошло: "Ставка 200k",
      купон: "1452502660",
      регистрация: getRandomRegistrationTime(),
      расчет: "2024-07-08 15:15:00",
      ставка: "200000",
      выигрыш: "300000",
      коэффициент: "1.5",
    },
  },
  {
    id: 4,
    title: "Антифрод 48726318 Ставка 150k",
    description: "Ставка 150k 07-08 13:30",
    details: {
      номер_счета: "48726318",
      статус: "Обычный",
      рейтинг: "89",
      что_произошло: "Ставка 150k",
      купон: "1452502670",
      регистрация: getRandomRegistrationTime(),
      расчет: "2024-07-08 14:00:00",
      ставка: "150000",
      выигрыш: "225000",
      коэффициент: "1.5",
    },
  },
  {
    id: 5,
    title: "Антифрод 59746321 Ставка 75k",
    description: "Ставка 75k 07-08 12:00",
    details: {
      номер_счета: "59746321",
      статус: "Высокий",
      рейтинг: "91",
      что_произошло: "Ставка 75k",
      купон: "1452502680",
      регистрация: getRandomRegistrationTime(),
      расчет: "2024-07-08 12:30:00",
      ставка: "75000",
      выигрыш: "112500",
      коэффициент: "1.5",
    },
  },
  {
    id: 6,
    title: "Антифрод 67258419 Ставка 30k",
    description: "Ставка 30k 07-08 11:15",
    details: {
      номер_счета: "67258419",
      статус: "Обычный",
      рейтинг: "87",
      что_произошло: "Ставка 30k",
      купон: "1452502690",
      регистрация: getRandomRegistrationTime(),
      расчет: "2024-07-08 11:45:00",
      ставка: "30000",
      выигрыш: "45000",
      коэффициент: "1.5",
    },
  },
];

const MainScreens = () => {
  const [cards, setCards] = useState(initialCards);
  const [activePanel, setActivePanel] = useState("panel1");
  const [selectedCard, setSelectedCard] = useState(null);
  const [timers, setTimers] = useState({});
  const [loading, setLoading] = useState(true);

  //const WebApp = useWebApp();

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setActivePanel("panel2");
  };

  const handleOpenLink = (url) => {
    window.open(url, "_blank");
  };

  ////////////////////////////////
  // Timer update effect
  ////////////////////////////////
  const [popout, setPopout] = useState(null);

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
        const registrationTime = new Date(card.details.регистрация).getTime();
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

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
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
    <SplitLayout popout={popout} aria-live="polite" aria-busy={!!popout}>
      <View activePanel={activePanel}>
        <Panel id="panel1">
          <PanelHeader>Эксцеденты</PanelHeader>
          <Group>
            {loading ? (
              <>
                {cards.map((card) => (
                  <Cell key={card.id} expandable="auto">
                    <Skeleton key={card.id} width="100%" />
                  </Cell>
                ))}
              </>
            ) : (
              cards.map((card) => (
                <Cell
                  key={card.id}
                  expandable="auto"
                  before={
                    <Icon28UserOutline
                    // color={getTimerColor(
                    //   timers[card.id] ? timers[card.id].minutes : 0
                    // )}
                    />
                  }
                  onClick={() => handleCardClick(card)}
                  after={
                    <div
                      style={{
                        textAlign: "left",
                        color: getTimerColor(
                          timers[card.id] ? timers[card.id].minutes : 0
                        ),
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
                  {card.title}
                </Cell>
              ))
            )}
          </Group>
        </Panel>
        <Panel id="panel2">
          {selectedCard && (
            <>
              <PanelHeader
                delimiter="spacing"
                before={
                  <PanelHeaderBack onClick={() => setActivePanel("panel1")} />
                }
                after={
                  timers[selectedCard.id] ? (
                    <div
                      style={{
                        textAlign: "left",
                        marginRight: "10px",
                        color: getTimerColor(
                          parseInt(timers[selectedCard.id].minutes)
                        ),
                      }}
                    >
                      {`${timers[selectedCard.id].hours}:${
                        timers[selectedCard.id].minutes
                      }:${timers[selectedCard.id].seconds}`}
                    </div>
                  ) : null
                }
              >
                <PanelHeaderContent status={selectedCard.description}>
                  {selectedCard.title}
                </PanelHeaderContent>
              </PanelHeader>
              <Group>
                <SimpleCell>
                  Описание: {selectedCard.description}
                  <Spacing size={13} />
                  Номер счета: {selectedCard.details.номер_счета}
                  <Spacing size={13} />
                  Статус: {selectedCard.details.статус}
                  <Spacing size={13} />
                  Рейтинг: {selectedCard.details.рейтинг}
                  <Spacing size={13} />
                  Что произошло: {selectedCard.details.что_произошло}
                  <Spacing size={13} />
                  Купон: {selectedCard.details.купон}
                  <Spacing size={13} />
                  Регистрация: {selectedCard.details.регистрация}
                  <Spacing size={13} />
                  Расчет: {selectedCard.details.расчет}
                  <Spacing size={13} />
                  Ставка: {selectedCard.details.ставка}
                  <Spacing size={13} />
                  Выигрыш: {selectedCard.details.выигрыш}
                  <Spacing size={13} />
                  Коэффициент: {selectedCard.details.коэффициент}
                </SimpleCell>
              </Group>
              <Group style={{ marginBottom: 70 }}>
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
                <Group style={{ padding: 10 }}>
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
