import styled from "styled-components";
import bgimg from "../images/HeliosBackground.png";

const BgWrapper = styled.div`
  background-image: url(${({ $bgimg }) => $bgimg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: block;
  overflow-x: hidden;
  z-index: 0;
`;

function Background({ children }) {
  return <BgWrapper $bgimg={bgimg}>{children}</BgWrapper>;
}

export default Background;
