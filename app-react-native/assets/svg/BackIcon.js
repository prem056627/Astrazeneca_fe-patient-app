import * as React from "react"
import Svg, { Path } from "react-native-svg"
const BackIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="#121826"
      d="M15.531 18.97a.75.75 0 1 1-1.061 1.061l-7.5-7.5a.749.749 0 0 1 0-1.061l7.5-7.5a.75.75 0 1 1 1.061 1.061l-6.97 6.97 6.97 6.969Z"
    />
  </Svg>
)
export default BackIcon
