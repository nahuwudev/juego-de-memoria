import { Board } from './components/Board';
import { useLocalGame } from './engine/useLocalGame';

export function App() {
  const gameEngine = useLocalGame();

  return (
    <div className="app">
      <h1>Memory Game 🧠</h1>
      <Board engine={gameEngine} />
    </div>
  );
}

export default App;