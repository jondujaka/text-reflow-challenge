import { useEffect } from "react";
import "./App.css";
import Carousel from "./Carousel/Carousel";

function App() {
  useEffect(() => {
    console.log("app");
  }, []);
  return <Carousel />;
}

export default App;
