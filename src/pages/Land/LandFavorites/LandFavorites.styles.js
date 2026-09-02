import styled from "styled-components";

export const FavoritesPage = styled.div`
  min-height: 100vh;
  background: #fff;
  color: #232323;
`;

export const FavoritesShell = styled.main`
  width: min(100%, 1500px);
  margin: 0 auto;
  padding: 22px 24px 40px;
  box-sizing: border-box;
`;

export const FavoritesHeader = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 18px;
`;

export const FavoritesTitle = styled.h1`
  margin: 0;
  font-size: clamp(32px, 2.8vw, 48px);
  line-height: 1.1;
  font-weight: 500;
  letter-spacing: -0.05em;
`;

export const FavoritesDescription = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: #6a6a6a;
`;

export const FavoritesToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  margin: 18px 0 14px;
`;

export const FavoritesFilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const FavoritesFilterButton = styled.button`
  height: 30px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? "#9b7400" : "#d9c9af")};
  background: ${({ $active }) => ($active ? "#9b7400" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#5f5a52")};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;

export const FavoritesSort = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  color: #4b4b4b;
  font-size: 15px;
`;

export const FavoritesSortCount = styled.span`
  color: #5e5e5e;
`;

export const FavoritesSortLabel = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  font-size: 15px;
  color: #232323;
  cursor: pointer;
`;

export const FavoritesList = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid #e8e0d3;
`;

export const FavoritesItem = styled.article`
  display: grid;
  grid-template-columns: 312px minmax(0, 1fr) auto;
  gap: 22px;
  padding: 18px 0 20px;
  border-bottom: 1px solid #eee;
  align-items: stretch;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const FavoritesThumbWrap = styled.div`
  position: relative;
  min-height: 228px;
  border-radius: 10px;
  overflow: hidden;
  background:
    linear-gradient(160deg, rgba(245, 233, 190, 0.35), rgba(245, 245, 245, 0.15)),
    linear-gradient(135deg, #89b66e 0%, #5d8f58 40%, #7fcd74 100%);
`;

export const FavoritesThumb = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 25% 28%, rgba(255, 255, 255, 0.75), transparent 18%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0)),
    linear-gradient(0deg, rgba(24, 48, 22, 0.08), rgba(24, 48, 22, 0.08));
`;

export const FavoritesBadge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  height: 40px;
  min-width: 56px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.92);
  color: #9b7400;
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
`;

export const FavoritesHeart = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  color: #8b7f67;
  cursor: pointer;
  padding: 0;
`;

export const FavoritesContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-top: 8px;
`;

export const FavoritesAddress = styled.h2`
  margin: 0;
  font-size: 24px;
  line-height: 1.35;
  font-weight: 500;
  letter-spacing: -0.04em;
  color: #222;
`;

export const FavoritesMetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px 24px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const FavoritesMetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const FavoritesMetaLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #6f6f6f;
`;

export const FavoritesMetaValue = styled.div`
  font-size: 16px;
  line-height: 1.45;
  font-weight: 700;
  color: ${({ $highlight }) => ($highlight ? "#9b7400" : "#2a2a2a")};
`;

export const FavoritesMetaSub = styled.div`
  font-size: 13px;
  color: #727272;
`;

export const FavoritesInfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: auto;
`;

export const FavoritesDate = styled.p`
  margin: 0;
  font-size: 15px;
  color: #6a6a6a;
`;

export const FavoritesButton = styled.button`
  height: 44px;
  min-width: 118px;
  padding: 0 18px;
  border: 1px solid #d8aa1f;
  border-radius: 12px;
  background: #fff;
  color: #9b7400;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
`;

export const FavoritesPagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 26px;
`;

export const FavoritesPageButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid #d9c9af;
  background: ${({ $active }) => ($active ? "#9b7400" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#606060")};
  font-size: 15px;
  cursor: pointer;
`;
