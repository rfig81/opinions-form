import { Header } from "./components/Header";
import { Opinions } from "./components/Opinions";
import { NewOpinion } from "./components/NewOpinion";
import { OpinionsContextProvider } from "./store/opinions/OpinionsContext";

function App() {
  return (
    <>
      <Header />
      <main>
        <OpinionsContextProvider>
          <NewOpinion />
          <Opinions />
        </OpinionsContextProvider>
      </main>
    </>
  );
}

export default App;
