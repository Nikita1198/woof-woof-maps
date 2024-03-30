import "./App.css";
import { YMaps, Map, Button } from "@pbe/react-yandex-maps";

const mapState = {
  center: [55.76, 37.64],
  zoom: 13,
  controls: [],
};

function App() {
  return (
    <YMaps query={{ lang: "en_RU" }}>
      <Map className="fullscreen-map" state={mapState}>
        <Button
          options={{ maxWidth: 128 }}
          className="button-map"
          data={{ content: "Unpress me!" }}
          defaultState={{ selected: true }}
        />
      </Map>
    </YMaps>
  );
}

export default App;
