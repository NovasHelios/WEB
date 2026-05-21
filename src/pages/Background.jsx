import styled from "styled-components";
import bgimg from "../images/HeliosBackground.png";

function Background() {
    const Background = styled.div`
        background-image: url(${bgimg});
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

    return (
        <Background />
    )
}

export default Background;