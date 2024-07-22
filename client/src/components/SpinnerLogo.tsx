import { Div, Group, Panel, Placeholder, Spinner, View } from "@vkontakte/vkui";
import React from "react";
import Logo from "./Logo";

export const SpinnerLogo = () => {
  return (
    <View activePanel="spinner">
      <Panel id="spinner_div">
        <Group>
          <Div style={{ height: "32px" }} />
          <Placeholder icon={<Logo />} action={<Spinner size="large" />} />
        </Group>
      </Panel>
    </View>
  );
};
