import * as React from "react"
import Svg, { Path } from "react-native-svg"
const CalendarIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      fill="#A3ABB1"
      stroke="#A3ABB1"
      strokeWidth={0.2}
      d="M16.319 2.709h-1.46v-.973a.486.486 0 1 0-.971 0v.973H6.11v-.973a.486.486 0 1 0-.972 0v.973H3.68A2.434 2.434 0 0 0 1.25 5.14v11.18c0 1.34 1.09 2.431 2.431 2.431H16.32c1.34 0 2.431-1.09 2.431-2.43V5.138c-.002-1.34-1.092-2.43-2.431-2.43Zm1.457 13.61c0 .803-.654 1.457-1.457 1.457H3.68a1.46 1.46 0 0 1-1.459-1.457v-8.75h15.554v8.75Zm0-9.722H2.222V5.138a1.46 1.46 0 0 1 1.46-1.459H5.14v.002h8.748v.002h.972V3.68h1.459c.803 0 1.457.653 1.457 1.457v1.46Z"
    />
  </Svg>
)
export default CalendarIcon
