import * as React from "react"
import Svg, { Path } from "react-native-svg"

const WaveTop = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height={180}  
    fill="none" 
    {...props}
    style={{ position: 'absolute', top: -35, left: 0}}
    viewBox="0 0 540 180"  
  >
    <Path
      fill="#BC1A23"
      d="M0 0h540v180s-26.4-12.366-49.2-5.08c-28.297 8.897-70.2-15.9-100.8-15.9-67.213 0-60.592 21.642-127.8 21-48.976-.478-59.03-21.807-108-21C46.736 159.363 0 180 0 180V0Z"
    />
  </Svg>
)

export default WaveTop;