import styled from "styled-components";

export const MapPage = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

export const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export const SideBarArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 10;
`;

export const SearchBox = styled.div`
  position: absolute;
  top: 20px;
  left: 280px;
  z-index: 20;
  background: white;
  padding: 8px;
`;

export const SearchInput = styled.input`
  width: 320px;
  height: 36px;
  padding: 0 10px;
`;

export const SearchButton = styled.button`
  height: 38px;
  margin-left: 8px;
`;
