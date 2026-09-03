import styled from "styled-components";

export const StaticMapRoot = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: inherit;
  border-radius: inherit;
  overflow: hidden;
  background: linear-gradient(180deg, #f7f7f7 0%, #ededed 100%);
`;

export const StaticMapCanvas = styled.div`
  position: absolute;
  inset: 0;
`;

export const StaticMapEmpty = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  color: #6f6a5f;
  font-size: 15px;
  font-weight: 600;
  background:
    radial-gradient(circle at 30% 55%, rgba(18, 84, 34, 0.24), transparent 18%),
    radial-gradient(circle at 60% 50%, rgba(47, 122, 52, 0.18), transparent 15%),
    linear-gradient(135deg, #d9e6bb 0%, #c6d6a3 38%, #c8d7b0 100%);
`;
