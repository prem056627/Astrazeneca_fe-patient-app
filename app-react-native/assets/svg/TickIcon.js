import * as React from "react"
import Svg, { Path } from "react-native-svg"
const TickIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={10}
    fill="none"
    {...props}
  >
    <Path
      stroke="#BC1A23"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.563}
      d="m1.625 6.25 2.188 2.188 6.562-6.876"
    />
  </Svg>
)
export default TickIcon
