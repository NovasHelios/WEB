import styled from "styled-components";

// 토지 선택 창의 배경과 중앙 배치를 담당합니다.
export const LandModalBackdrop = styled.div`
  position: fixed; inset: 0; z-index: 1200; display: grid; place-items: center;
  padding: 20px; background: rgba(24, 22, 20, 0.58);
`;
export const LandModal = styled.section`
  display: flex; width: min(100%, 960px); max-height: min(90vh, 760px); flex-direction: column;
  overflow: hidden; border-radius: 16px; background: #fff; box-shadow: 0 24px 80px #0003;
`;
export const LandModalHeader = styled.header`
  display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 28px 32px 20px;
`;
export const LandModalTitle = styled.h2`margin: 0; color: #201f1d; font-size: 1.35rem;`;
export const LandModalSubtitle = styled.p`margin: 7px 0 0; color: #888178; font-size: 0.9rem;`;
export const LandModalClose = styled.button`
  display: grid; width: 36px; height: 36px; place-items: center; border: 0; background: transparent; color: #888; cursor: pointer;
  &:disabled { cursor: wait; }
`;
export const LandFilterList = styled.div`
  display: flex; flex-wrap: wrap; gap: 8px; padding: 0 32px 20px; border-bottom: 1px solid #eee9e2;
`;
export const LandFilter = styled.button`
  padding: 8px 14px; border: 1px solid ${({ $active }) => $active ? "#c88f18" : "#e5e2de"}; border-radius: 9px;
  background: ${({ $active }) => $active ? "#fffaf0" : "#fff"}; color: ${({ $active }) => $active ? "#a77500" : "#625e59"}; font: inherit; cursor: pointer;
`;
export const LandModalList = styled.div`
  display: flex; min-height: 160px; flex: 1; flex-direction: column; gap: 12px; overflow: auto; padding: 20px 32px;
`;
export const LandOption = styled.article`
  display: grid; grid-template-columns: 132px minmax(0, 1fr) auto; align-items: center; gap: 18px;
  padding: 14px; border: 1px solid ${({ $selected }) => $selected ? "#c99322" : "#e8e5e1"}; border-radius: 12px;
  background: ${({ $selected }) => $selected ? "#fffcf5" : "#fff"}; cursor: pointer;
  @media (max-width: 640px) { grid-template-columns: 76px minmax(0, 1fr); gap: 12px; }
`;
export const LandThumbnail = styled.div`
  display: grid; width: 132px; height: 92px; place-items: center; overflow: hidden; border-radius: 8px; background: #f5f2ec; color: #9b8f7a;
  img { width: 100%; height: 100%; object-fit: cover; }
  @media (max-width: 640px) { width: 76px; height: 76px; }
`;
export const LandOptionBody = styled.div`min-width: 0;`;
export const LandOptionTitle = styled.h3`margin: 0; overflow: hidden; color: #252321; font-size: 1rem; text-overflow: ellipsis; white-space: nowrap;`;
export const LandOptionMeta = styled.p`margin: 9px 0 0; color: #817b72; font-size: 0.78rem; line-height: 1.5; overflow-wrap: anywhere;`;
export const LandOptionDetails = styled.div`
  display: flex; gap: 12px; margin-top: 10px; font-size: 0.82rem;
  span { color: #a19a90; } strong { color: #ac7900; }
`;
export const LandOptionActions = styled.div`
  display: flex; align-items: center; gap: 10px; color: #aaa;
  @media (max-width: 640px) { grid-column: 2; justify-content: flex-end; }
`;
export const LandChooseButton = styled.button`
  display: inline-flex; min-width: 92px; min-height: 38px; align-items: center; justify-content: center; gap: 5px;
  border: 1px solid ${({ $selected }) => $selected ? "#c99322" : "#dfd8cd"}; border-radius: 7px;
  background: ${({ $selected }) => $selected ? "#c99322" : "#fff"}; color: ${({ $selected }) => $selected ? "#fff" : "#766b5b"}; font: inherit; cursor: pointer;
`;
export const LandModalFooter = styled.footer`
  display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 32px; border-top: 1px solid #eee9e2;
  color: #6d675f; font-size: 0.9rem;
  strong { color: #b17e00; }
  div { display: flex; gap: 10px; }
  button { min-width: 94px; min-height: 42px; padding: 0 16px; border: 1px solid #ddd8d0; border-radius: 8px; background: #fff; color: #514c45; font: inherit; cursor: pointer; }
  @media (max-width: 520px) { padding: 14px 18px; }
`;
export const LandModalError = styled.p`margin: 0 32px 12px; color: #c63c35; font-size: 0.88rem;`;
export const LandModalEmpty = styled.p`margin: auto; padding: 40px 0; color: #817b72; text-align: center;`;
export const LandModalLoading = styled.p`margin: auto; padding: 40px 0; color: #817b72; text-align: center;`;
export const LandModalSubmit = styled.button`
  border-color: #c99322 !important; background: #c99322 !important; color: #fff !important;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
