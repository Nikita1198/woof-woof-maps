import {
  Icon24Dismiss,
  Icon24Filter,
  Icon24GavelOutline,
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
  Div,
  Banner,
  SubnavigationButton,
  ModalRoot,
  ModalPage,
  ModalPageHeader,
  PanelHeaderClose,
  PanelHeaderButton,
  FormLayoutGroup,
  FormItem,
  Checkbox,
  usePlatform,
  Counter,
  VisuallyHidden,
  Alert,
  Footnote,
} from "@vkontakte/vkui";

import { format } from "date-fns";
import { ru } from "date-fns/locale";

import TimeAgo from "react-timeago";
import russianStrings from "react-timeago/lib/language-strings/ru";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

import { Panel } from "@vkontakte/vkui/dist/components/Panel/Panel";
import { View } from "@vkontakte/vkui/dist/components/View/View";
import { useEffect, useRef, useState } from "react";
import Logo from "../components/Logo";
import { DNA } from "react-loader-spinner";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Telegram: any;
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "dd MMMM yyyy, HH:mm:ss", { locale: ru });
};

const MainScreens = () => {
  const [tasks, setTasks] = useState([]);
  const [activePanel, setActivePanel] = useState("spinner");
  const [selectedTask, setSelectedTask] = useState(null);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [popout, setPopout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [labels, setLabels] = useState([]);
  const pollingRef = useRef(null);

  const platform = usePlatform();

  //Modal dialog
  const [filtersModalOpened, setFiltersModalOpened] = useState(false);
  const [filtersLabels, setFiltersLabels] = useState([]);
  const [filtersCount, setFiltersCount] = useState(0);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setActivePanel("panel2");
  };

  const handleOpenLink = (url) => {
    window.open(url, "_blank");
  };

  const clearPopout = () => setPopout(null);

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(
        "https://katya-agro.ru/api/api/update_task_status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-tokens": token,
          },
          body: JSON.stringify({ task_id: taskId, new_status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task status");
      }

      return response.json();
    } catch (error) {
      console.error("Error updating task status:", error);
      throw error;
    }
  };

  const setDoneScreenSpinner = async (newStatus) => {
    setPopout(<ScreenSpinner state="loading" />);

    try {
      await updateTaskStatus(selectedTask.id, newStatus);

      setPopout(<ScreenSpinner state="done">Успешно</ScreenSpinner>);
      setTimeout(clearPopout, 1000);

      const updatedTasks = { ...tasks };
      selectedTask.labels.forEach((label) => {
        if (updatedTasks[label]) {
          updatedTasks[label] = updatedTasks[label].filter(
            (task) => task.id !== selectedTask.id
          );
          if (updatedTasks[label].length === 0) {
            delete updatedTasks[label];
          }
        }
      });
      if (!selectedTask.labels.length) {
        if (updatedTasks[""]) {
          updatedTasks[""] = updatedTasks[""].filter(
            (task) => task.id !== selectedTask.id
          );
          if (updatedTasks[""].length === 0) {
            delete updatedTasks[""];
          }
        }
      }
      setTasks(updatedTasks);
      setActivePanel("panel1");
    } catch (error) {
      setPopout(<ScreenSpinner state="error">Произошла ошибка</ScreenSpinner>);
      setTimeout(clearPopout, 2000);
    }
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
      if (data.tasks) {
        console.log(data);
        setTasks(data.tasks);

        const uniqueLabels = new Set<string>();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Object.values(data.tasks).forEach((taskGroup: any) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (taskGroup as any[]).forEach((task) =>
            task.labels.forEach((label: string) => {
              if (label === "") {
                label = "Мистика Афродиты";
              }
              uniqueLabels.add(label);
            })
          )
        );

        const filters = Array.from(uniqueLabels).map((label) => ({
          value: label,
          label: label,
        }));
        setLabels(filters);
      } else {
        console.error("Unexpected response format:", data);
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw new Error("Error fetching tasks");
    }
  };

  const startPolling = (token, interval = 10000) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
    fetchTasks(token);
    pollingRef.current = setInterval(() => fetchTasks(token), interval);
  };

  const fetchData = async () => {
    try {
      if (window.Telegram.WebApp.initDataUnsafe.user.id) {
        const userId = window.Telegram.WebApp.initDataUnsafe.user.id;
        setUserId(userId);

        const token = await fetchTokenFromBot(userId);
        setToken(token);
        console.log("Received JWT Token:", token);
        if (!token) return setLoading(false);

        await fetchTasks(token).then(() => {
          setActivePanel("panel1");
        });
        startPolling(token);
      }
    } catch (error) {
      console.error("Initialization error:", error);
      setTimeout(() => setLoading(false), 1000);
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const openModal = () => {
    setFiltersModalOpened(true);
  };

  const closeModal = () => {
    setFiltersModalOpened(false);
  };

  const applyFilters = () => {
    closeModal();
    setFiltersCount(filtersLabels.length);
  };

  const onChangeFilterStyle = (e) => {
    const { value, checked } = e.currentTarget;
    if (checked) {
      setFiltersLabels([...filtersLabels, value]);
    } else {
      setFiltersLabels(filtersLabels.filter((v) => v !== value));
    }
    console.log(filtersLabels);
  };

  const modal = (
    <ModalRoot
      activeModal={filtersModalOpened ? "filters" : null}
      onClose={closeModal}
    >
      <ModalPage
        id={"filters"}
        header={
          <ModalPageHeader
            before={
              platform !== "ios" && <PanelHeaderClose onClick={closeModal} />
            }
            after={
              platform === "ios" && (
                <PanelHeaderButton onClick={closeModal} aria-label="exit">
                  <Icon24Dismiss />
                </PanelHeaderButton>
              )
            }
          >
            Фильтры
          </ModalPageHeader>
        }
      >
        <FormLayoutGroup>
          <FormItem top="Вид инцидента">
            {labels.map(({ value, label }) => {
              return (
                <Checkbox
                  key={value}
                  value={value}
                  checked={filtersLabels.includes(value)}
                  onChange={onChangeFilterStyle}
                >
                  {label}
                </Checkbox>
              );
            })}
          </FormItem>

          <FormItem>
            <Button size="l" stretched onClick={applyFilters}>
              Показать результаты
            </Button>
          </FormItem>
        </FormLayoutGroup>
      </ModalPage>
    </ModalRoot>
  );

  const openAction = () => {
    setPopout(
      <Alert
        actions={[
          {
            title: "Нормальный",
            mode: "default",
            action: () => setDoneScreenSpinner("NORMAL"),
          },
          {
            title: "БХ",
            mode: "destructive",
            action: () => setDoneScreenSpinner("BH"),
          },
          {
            title: "Отмена",
            mode: "cancel",
          },
        ]}
        actionsLayout="vertical"
        renderAction={({ mode, ...restProps }) => {
          return (
            <Button
              mode={mode === "cancel" ? "secondary" : "primary"}
              size="m"
              appearance={
                mode !== "cancel"
                  ? mode == "destructive"
                    ? "negative"
                    : "positive"
                  : "neutral"
              }
              {...restProps}
            />
          );
        }}
        onClose={() => setPopout(null)}
        header="Подтвердите действие"
        text="От вас зависит судьба смертного. Проявите мудрость, подобную Афине. Кто этот грешник?"
      />
    );
  };

  return (
    <SplitLayout
      popout={popout}
      aria-live="polite"
      aria-busy={!!popout}
      modal={modal}
    >
      <View activePanel={activePanel}>
        <Panel id="spinner">
          <Group>
            <Div style={{ height: "32px" }} />
            <Placeholder
              icon={<Logo />}
              action={
                loading && (
                  <DNA
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="dna-loading"
                    wrapperStyle={{}}
                    wrapperClass="dna-wrapper"
                  />
                )
              }
              header={
                loading
                  ? ""
                  : '"Не все то золото, что блестит, и не все то зло, что прячется в тени."'
              }
            >
              {loading ? "" : "Афродита вас не знает!"}
            </Placeholder>
            <Div style={{ position: "absolute", bottom: 10 }}>
              <Footnote>V2.0</Footnote>
              <Footnote caps>by Data Analytics</Footnote>
            </Div>
          </Group>
        </Panel>
        <Panel id="panel1">
          <PanelHeader>
            <PanelHeaderContent status={userId ? `MyID: ${userId}` : null}>
              Инциденты
            </PanelHeaderContent>
          </PanelHeader>
          <Group>
            {Object.keys(tasks).length !== 0 ? (
              Object.keys(tasks).map((label) => (
                <Accordion key={label} defaultExpanded={false}>
                  <Accordion.Summary>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ paddingRight: 10 }}>
                        {label === "" ? "Мистика Афродиты" : label}
                      </span>
                      <Counter size="m" mode="contrast">
                        {tasks[label].length}
                      </Counter>
                    </div>
                  </Accordion.Summary>
                  <Accordion.Content>
                    {tasks[label].map((task) => (
                      <Cell
                        key={task.id}
                        expandable="auto"
                        before={
                          task.assignee_avatar ? (
                            <Avatar size={28} src={task.assignee_avatar} />
                          ) : (
                            <Icon28UserOutline />
                          )
                        }
                        onClick={() => handleTaskClick(task)}
                        after={
                          <TimeAgo
                            date={task.created}
                            formatter={formatter}
                            live={true}
                          />
                        }
                      >
                        {task.summary}
                      </Cell>
                    ))}
                  </Accordion.Content>
                </Accordion>
              ))
            ) : (
              <Placeholder icon={<Logo />} header="Инциденты отсутствуют" />
            )}
          </Group>
          {labels.length > 0 && (
            <FixedLayout filled vertical="bottom">
              <Separator wide />
              <Group style={{ padding: 15, paddingBottom: 20 }}>
                <ButtonGroup mode="vertical" gap="m" stretched>
                  <SubnavigationButton
                    before={<Icon24Filter />}
                    selected={filtersCount > 0}
                    expandable
                    after={
                      filtersCount > 0 && (
                        <Counter size="s">
                          <VisuallyHidden>Применено: </VisuallyHidden>
                          {filtersCount}
                        </Counter>
                      )
                    }
                    onClick={openModal}
                  >
                    Фильтры
                  </SubnavigationButton>
                </ButtonGroup>
              </Group>
            </FixedLayout>
          )}
        </Panel>
        <Panel id="panel2">
          {selectedTask && (
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
                <PanelHeaderContent status={formatDate(selectedTask.created)}>
                  {selectedTask.summary}
                </PanelHeaderContent>
              </PanelHeader>
              <Group>
                {selectedTask.labels.includes("") && (
                  <Div>
                    <Banner
                      before={<Avatar src="../aphrodita_logo.png" />}
                      header="Мистика Афродиты"
                      text="Инцидент остался в тени"
                    />
                  </Div>
                )}
                <div
                  style={{ padding: "0 10px" }}
                  dangerouslySetInnerHTML={{
                    __html: selectedTask.description.replace(/\n/g, "<br>"),
                  }}
                />
              </Group>
              <Group>
                <ButtonGroup mode="horizontal" gap="m" stretched align="center">
                  <Button
                    onClick={() => handleOpenLink(selectedTask.user_profile)}
                    size="s"
                    appearance="accent"
                    mode="tertiary"
                    before={<Icon24UserSquareOutline />}
                    stretched
                    disabled={!selectedTask.user_profile}
                  >
                    ЮзерПрофайл
                  </Button>
                  <Button
                    onClick={() => handleOpenLink(selectedTask.graphana)}
                    size="s"
                    appearance="accent"
                    mode="tertiary"
                    before={<Icon24GraphOutline />}
                    stretched
                    disabled={!selectedTask.graphana}
                  >
                    Графана
                  </Button>
                </ButtonGroup>
              </Group>
              <FixedLayout filled vertical="bottom">
                <Separator wide />
                <Group style={{ padding: 15, paddingBottom: 20 }}>
                  <ButtonGroup mode="vertical" gap="m" stretched>
                    <Button
                      onClick={() => handleOpenLink(selectedTask.back_office)}
                      size="m"
                      appearance="accent"
                      before={<Icon24StorefrontOutline />}
                      stretched
                      disabled={!selectedTask.back_office}
                    >
                      БэкОфис
                    </Button>
                    <Button
                      onClick={openAction}
                      size="m"
                      appearance="accent"
                      mode="secondary"
                      before={<Icon24GavelOutline />}
                      stretched
                    >
                      Дать статус
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
