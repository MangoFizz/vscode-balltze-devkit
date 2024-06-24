import "./App.css";
import "./codicon.css";
import TagView from "./components/TagView";
import TagDataExample from "../data/tag-data-example.json"

function App() {
  return (
    <main>
      <div className="main-container">
        <TagView tagEntry={{ class: TagDataExample.result.primaryClass, path: TagDataExample.result.path, handle: TagDataExample.result.handle.value }} tagData={TagDataExample.result.data} />
      </div>
    </main>
  );
}

export default App;
