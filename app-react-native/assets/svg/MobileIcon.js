import * as React from "react"
import Svg, { Path } from "react-native-svg"
export const MobileIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12.5 19h.01M14 2h-3c-2.357 0-3.536 0-4.268.732C6 3.464 6 4.643 6 7v10c0 2.357 0 3.535.732 4.268C7.464 22 8.643 22 11 22h3c2.357 0 3.535 0 4.268-.732C19 20.535 19 19.357 19 17V7c0-2.357 0-3.536-.732-4.268C17.535 2 16.357 2 14 2Z"
    />
  </Svg>
)
