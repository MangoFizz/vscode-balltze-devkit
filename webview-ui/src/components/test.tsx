import { Button, Divider, InputGroup, Text } from "@blueprintjs/core"
import React from "react"

const GetValueComponent = (value: any) => {
  if (value.type === "enum") {
    return (
      <select>
        {value.options.map((v: any) => (
          <option value={v}>{v}</option>
        ))}
      </select>
    )
  } else if (value.type === "struct") {
    return (
      <>
        {value.fields.map((v: any) => (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
            }}
          >
            <InputGroup
              onChange={(e) => {
                //setSearchTerm(e.target.value.toLowerCase())
              }}
              placeholder={v.name}
              large
              fill
              style={{
                width: "100%",
                //backgroundColor: currentTheme === "dark" ? "#1f2329" : undefined,
              }}
            />
            <Text style={{ padding: 10, minWidth: 300 }}>{v.name}</Text>
          </div>
        ))}
      </>
    )
  } else if (value.type === "bitfield") {
    return (
      <form>
        {value.fields.map((v: any) => (
          <div>
            <input
              type="checkbox"
              id={v}
              name={v}
              value={v}
              style={{
                marginRight: 5,
                width: 20,
                height: 20,
              }}
            />
            <label htmlFor={v}>{v}</label>
          </div>
        ))}
      </form>
    )
  } else if (value.type === "struct") {
    return <TagEditor tag={value} />
  }
  return <></>
}

const BitField: React.FC = () => {
  return (
    <form>
      <div>
        <input
          type="checkbox"
          id={"flag"}
          name={"Flag"}
          value={"Flag"}
          style={{
            marginRight: 5,
          }}
        />
        <label htmlFor={"flag"}>{"Flag"}</label>
      </div>
    </form>
  )
}

const KeyValue: React.FC = () => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Text style={{ padding: 10, minWidth: 300 }}>{"Key"}</Text>
      <InputGroup
        placeholder={"Value"}
        large
        fill
        style={{
          width: "100%",
        }}
      />
    </div>
  )
}

const Options: React.FC = () => {
  return (
    <select>
      <option value="biped">Biped</option>
      <option value="vehicle">Vehicle</option>
      <option value="weapon">Weapon</option>
      <option value="equipment">Equipment</option>
      <option value="garbage">Garbage</option>
      <option value="projectile">Projectile</option>
      <option value="scenery">Scenery</option>
      <option value="machine">Machine</option>
      <option value="control">Control</option>
      <option value="light_fixture">Light Fixture</option>
      <option value="sound_scenery">Sound Scenery</option>
      <option value="crate">Crate</option>
    </select>
  )
}

const Block: React.FC = () => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Text style={{ padding: 10 }}>{"Block"}</Text>
      <Options />
      <Button fill>Add</Button>
      <Button fill>Insert</Button>
      <Button fill>Duplicate</Button>
      <Button fill>Shift Up</Button>
      <Button fill>Shift Down</Button>
      <Button fill>Clear</Button>
      <Button fill>Delete</Button>
      <Button fill>Delete All</Button>
    </div>
  )
}

const Reference: React.FC = () => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Text style={{ padding: 10 }}>{"Reference"}</Text>
      <Options />
      <InputGroup
        placeholder={"Path"}
        large
        fill
        style={{
          width: "100%",
        }}
      />
      <Button>Find</Button>
      <Button>Open</Button>
    </div>
  )
}

export const TagEditor: React.FC<{ tag: any }> = ({ tag }) => {
  return (
    <>
      <h1>Primitives</h1>
      <KeyValue />
      <BitField />
      <Options />
      <h1>Composed</h1>
      <Divider />
      <Block />
      <Reference />
    </>
  )
}

export default TagEditor
