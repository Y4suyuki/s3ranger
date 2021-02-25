import React from "react";
import { Box, Text } from "ink";
import Item from "./Item"


const NavigationList: React.FC<{lst: string[], isFocused: boolean, selected: number}> = ({ lst, isFocused, selected }) => {

  const borderColor = isFocused ? "green" : "white"

  return <Box borderStyle="round" borderColor={borderColor} flexDirection="column">
    {lst.length > 0 ? lst.map((e, i) => <Item selected={selected === i} key={i}>{e}</Item>) : <Text color="red">Empty</Text> }
  </Box>
}

export default NavigationList;
