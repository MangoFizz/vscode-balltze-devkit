import { BadgeDemo } from "./demos/BadgeDemo";
import { ButtonDemo } from "./demos/ButtonDemo";
import { CheckboxDemo } from "./demos/CheckboxDemo";
import { DataGridDemo } from "./demos/DataGridDemo";
import { DividerDemo } from "./demos/DividerDemo";
import { DropdownDemo } from "./demos/DropdownDemo";
import { LinkDemo } from "./demos/LinkDemo";
import { PanelsDemo } from "./demos/PanelsDemo";
import { ProgressRingDemo } from "./demos/ProgressRingDemo";
import { RadioGroupDemo } from "./demos/RadioGroupDemo";
import { TagDemo } from "./demos/TagDemo";
import { TextAreaDemo } from "./demos/TextAreaDemo";
import { TextFieldDemo } from "./demos/TextFieldDemo";
import { EnumField } from "./components/EnumField";
import "./App.css";
import "./codicon.css";
import { useState } from "react";
import { StringField } from "./components/StringField";
import { FlagsField, FlagsState } from "./components/FlagsField";
import { NumericField } from "./components/NumericField";
import { ColorArgbField } from "./components/ColorArgbField";
import { Rectangle2dField } from "./components/Rectangle2dField";
import { TagDependencyField } from "./components/TagDependencyField";
import TagView from "./components/TagView";
import TagBlock from "./components/TagBlock";

import TagDataExample from "../data/tag-data-example.json"

function App() {
  let [enumType, setEnumType] = useState("");
  let [stringField, setStringField] = useState("");
  let [flagsFields, setFlagsFields] = useState({
    "Flag 1": false,
    "Flag 2": false,
    "Flag 3": true,
  } as FlagsState);
  let [numericField, setNumericField] = useState(0);
  let [colorArgb, setColorArgb] = useState({ a: 1.0, r: 0.0, g: 0.0, b: 0.0 } as { [property: string]: number});
  let [rectangle2D, setRectangle2D] = useState({ t: 0, r: 0, b: 480, l: 640 } as { [property: string]: number});
  let [tagDependency, setTagDependency] = useState({ tagClass: "bitmap", tagPath: "path/to/tag", tagHandle: "3821534636" } as { [key: string]: string });

  return (
    <main>
      <div className="main-container">
        <TagView tagEntry={{ class: TagDataExample.result.primaryClass, path: TagDataExample.result.path, handle: TagDataExample.result.handle.value }} tagData={TagDataExample.result.data} />
        
        
        
        
        
        <h1>React Tag Component Gallery</h1>
        {/* <section>
          <EnumField label="Enum type" enumValues={["Option 1", "Option 2"]} value={enumType} setValue={setEnumType}></EnumField>
          <StringField label="String field" value={stringField} setValue={setStringField} />
          <FlagsField label="Flags field" values={flagsFields} setValues={setFlagsFields} />
          <NumericField label="Numeric field" value={numericField} setValue={setNumericField} />
          <ColorArgbField label="Color ARGB field" value={colorArgb} setValue={setColorArgb} />
          <Rectangle2dField label="Rectangle 2D field" value={rectangle2D} setValue={setRectangle2D} />
          <TagDependencyField label="Tag dependency field" value={tagDependency} setValue={setTagDependency} validClasses={["bitmap", "sound", "model"]} />
          <TagBlock label="Tag block" elems={["elem1", "elem2", "elem3"]} render={(elem: any) => <>
            <EnumField label="Enum type" enumValues={["Option 1", "Option 2"]} value={enumType} setValue={setEnumType}></EnumField>
            <StringField label="String field" value={stringField} setValue={setStringField} />
            <FlagsField label="Flags field" values={flagsFields} setValues={setFlagsFields} />
          </>} />
        </section> */}
      </div>

      <h1>Webview UI Toolkit React Component Gallery</h1>
      <section className="component-row">
        <BadgeDemo></BadgeDemo>
        <ButtonDemo></ButtonDemo>
        <CheckboxDemo></CheckboxDemo>
      </section>
      <section id="data-grid-row">
        <DataGridDemo></DataGridDemo>
      </section>
      <section className="component-row">
        <DividerDemo></DividerDemo>
        <DropdownDemo></DropdownDemo>
        <LinkDemo></LinkDemo>
      </section>
      <section id="panels-row">
        <PanelsDemo></PanelsDemo>
      </section>
      <section className="component-row">
        <ProgressRingDemo></ProgressRingDemo>
        <RadioGroupDemo></RadioGroupDemo>
        <TagDemo></TagDemo>
      </section>
      <section className="component-row">
        <TextAreaDemo></TextAreaDemo>
        <TextFieldDemo></TextFieldDemo>
      </section>
    </main>
  );
}

export default App;
