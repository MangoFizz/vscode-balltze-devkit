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

function App() {
  let [enumType, setEnumType] = useState("");
  let [stringField, setStringField] = useState("");
  let [flagsFields, setFlagsFields] = useState({
    "Flag 1": false,
    "Flag 2": false,
    "Flag 3": true,
  } as FlagsState);

  return (
    <main>
      <div className="main-container">
        <h1>React Tag Component Gallery</h1>
        <section>
          <EnumField label="Enum type" enumValues={["Option 1", "Option 2"]} value={enumType} setValue={setEnumType}></EnumField>
          <StringField label="String field" value={stringField} setValue={setStringField} />
          <FlagsField label="Flags field" values={flagsFields} setValues={setFlagsFields} />
        </section>
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
