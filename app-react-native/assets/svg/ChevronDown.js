import * as React from "react"
import Svg, { Path } from "react-native-svg"
export const ChevronDown = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={15}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m7 10 5 5 5-5"
    />
  </Svg>
)
