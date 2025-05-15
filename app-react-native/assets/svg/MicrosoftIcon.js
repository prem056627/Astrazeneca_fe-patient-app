import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const MicrosoftIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        fill="#4CAF50"
        d="M12.75 11.25H24V.75a.75.75 0 0 0-.75-.75h-10.5v11.25Z"
      />
      <Path
        fill="#F44336"
        d="M11.25 11.25V0H.75A.75.75 0 0 0 0 .75v10.5h11.25Z"
      />
      <Path
        fill="#2196F3"
        d="M11.25 12.75H0v10.5a.75.75 0 0 0 .75.75h10.5V12.75Z"
      />
      <Path
        fill="#FFC107"
        d="M12.75 12.75V24h10.5a.75.75 0 0 0 .75-.75v-10.5H12.75Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default MicrosoftIcon
