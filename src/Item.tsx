import React from "react";
import { Text } from "ink";

const Item: React.FC<{selected: boolean, children: React.ReactNode}> = ({ selected, children }) => {
  const style = selected ? {color: "blue", inversed: true} : {};
  return <Text {...style}>
    {children}
  </Text>
}

export default Item;
