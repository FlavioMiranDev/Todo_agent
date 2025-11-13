import "./App.scss";
import { BrowserRouter } from "react-router-dom";
import { AppRoute } from "./routes/app.route";
import { MessageProvider } from "./contexts/message.provider";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <MessageProvider>
          <AppRoute />
        </MessageProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
