import styled from "styled-components";
import bgimg from "../images/HeliosBackground.png";

const BgWrapper = styled.div`
  background-image: url(${({ $bgimg }) => $bgimg});
  background-size: cover;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function Background({ children }) {
  return <BgWrapper $bgimg={bgimg}>{children}</BgWrapper>;
}

export default Background;
