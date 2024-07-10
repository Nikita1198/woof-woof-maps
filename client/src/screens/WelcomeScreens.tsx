import { Icon28UserOutline } from "@vkontakte/icons";
import {
  Cell,
  Group,
  PanelHeader,
  PanelHeaderBack,
  Button,
  SimpleCell,
  List,
  CellButton,
  ScreenSpinner,
  SplitLayout,
  PanelHeaderContent,
} from "@vkontakte/vkui";
import { Panel } from "@vkontakte/vkui/dist/components/Panel/Panel";
import { View } from "@vkontakte/vkui/dist/components/View/View";
import { useEffect, useState } from "react";
//import { useWebApp } from "@vkruglikov/react-telegram-web-app";

// Функция для генерации случайного времени регистрации в пределах 2-15 минут назад
const getRandomRegistrationTime = () => {
  const now = new Date();
  const minutesAgo = Math.floor(Math.random() * 14) + 2; // от 2 до 15 минут
  const randomTime = new Date(now.getTime() - minutesAgo * 60 * 1000);
  return randomTime.toISOString();
};

// Пример данных карточек
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
  {
    id: 7,
    title: "Антифрод 78495163 Ставка 120k",
    description: "Ставка 120k 07-08 10:30",
    details: {
      номер_счета: "78495163",
      статус: "Критический",
      рейтинг: "93",
      что_произошло: "Ставка 120k",
      купон: "1452502700",
      регистрация: getRandomRegistrationTime(),
      расчет: "2024-07-08 11:00:00",
      ставка: "120000",
      выигрыш: "180000",
      коэффициент: "1.5",
    },
  },
  {
    id: 8,
    title: "Антифрод 89574236 Ставка 90k",
    description: "Ставка 90k 07-08 09:45",
    details: {
      номер_счета: "89574236",
      статус: "Обычный",
      рейтинг: "88",
      что_произошло: "Ставка 90k",
      купон: "1452502710",
      регистрация: getRandomRegistrationTime(),
      расчет: "2024-07-08 10:15:00",
      ставка: "90000",
      выигрыш: "135000",
      коэффициент: "1.5",
    },
  },
  {
    id: 9,
    title: "Антифрод 91265347 Ставка 60k",
    description: "Ставка 60k 07-08 08:30",
    details: {
      номер_счета: "91265347",
      статус: "Высокий",
      рейтинг: "90",
      что_произошло: "Ставка 60k",
      купон: "1452502720",
      регистрация: getRandomRegistrationTime(),
      расчет: "2024-07-08 09:00:00",
      ставка: "60000",
      выигрыш: "90000",
      коэффициент: "1.5",
    },
  },
];

const MainScreens = () => {
  const [cards, setCards] = useState(initialCards);
  const [activePanel, setActivePanel] = useState("panel1");
  const [selectedCard, setSelectedCard] = useState(null);
  const [timers, setTimers] = useState({});

  //const WebApp = useWebApp();

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setActivePanel("panel2");
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
          hours: Math.floor((elapsedTime / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((elapsedTime / (1000 * 60)) % 60),
          seconds: Math.floor((elapsedTime / 1000) % 60),
        };
      });
      setTimers(newTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [timers, cards]);

  return (
    <SplitLayout popout={popout} aria-live="polite" aria-busy={!!popout}>
      <View activePanel={activePanel}>
        <Panel id="panel1">
          <PanelHeader>Эксцеденты</PanelHeader>
          <Group>
            {cards.map((card) => (
              <Cell
                key={card.id}
                expandable="auto"
                before={<Icon28UserOutline />}
                onClick={() => handleCardClick(card)}
                after={
                  <div style={{ textAlign: "left" }}>
                    {timers[card.id]
                      ? `${timers[card.id].hours}:${timers[card.id].minutes}:${
                          timers[card.id].seconds
                        }`
                      : "0:0:0"}
                  </div>
                }
              >
                {card.title}
              </Cell>
            ))}
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
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Button size="s" appearance="positive">
                      Нормальный
                    </Button>
                    <Button
                      size="s"
                      appearance="negative"
                      onClick={setDoneScreenSpinner}
                    >
                      Бх
                    </Button>
                  </div>
                }
              >
                <PanelHeaderContent status={selectedCard.description}>
                  {selectedCard.title}
                </PanelHeaderContent>
              </PanelHeader>
              <Group>
                <List>
                  <SimpleCell>Описание: {selectedCard.description}</SimpleCell>
                  <SimpleCell>
                    Номер счета: {selectedCard.details.номер_счета}
                  </SimpleCell>
                  <SimpleCell>Статус: {selectedCard.details.статус}</SimpleCell>
                  <SimpleCell>
                    Рейтинг: {selectedCard.details.рейтинг}
                  </SimpleCell>
                  <SimpleCell>
                    Что произошло: {selectedCard.details.что_произошло}
                  </SimpleCell>
                  <SimpleCell>Купон: {selectedCard.details.купон}</SimpleCell>
                  <SimpleCell>
                    Регистрация: {selectedCard.details.регистрация}
                  </SimpleCell>
                  <SimpleCell>Расчет: {selectedCard.details.расчет}</SimpleCell>
                  <SimpleCell>Ставка: {selectedCard.details.ставка}</SimpleCell>
                  <SimpleCell>
                    Выигрыш: {selectedCard.details.выигрыш}
                  </SimpleCell>
                  <SimpleCell>
                    Коэффициент: {selectedCard.details.коэффициент}
                  </SimpleCell>
                </List>
              </Group>
              <Group>
                <CellButton>Лишить права</CellButton>
              </Group>
            </>
          )}
        </Panel>
      </View>
    </SplitLayout>
  );
};

export default MainScreens;
