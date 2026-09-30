import styled from "styled-components";

export const BusinessProfilePage = styled.div`
  min-height: 100vh;
  background: var(--color-page-bg);
  color: #24211d;
`;

export const BusinessProfileMain = styled.main`
  width: min(100%, 1500px);
  margin: 0 auto;
  padding: 96px 24px 56px;
  box-sizing: border-box;
`;

export const BusinessProfileHeader = styled.header`
  padding-bottom: 16px;
  border-bottom: 1px solid #e7dfd1;
`;

export const BusinessProfileTitle = styled.h1`
  margin: 0;
  font-size: var(--font-2xl);
  line-height: var(--line-tight);
  font-weight: var(--font-bold);
  letter-spacing: -0.04em;
`;

export const BusinessProfileDescription = styled.p`
  margin: 8px 0 0;
  color: #5f574c;
  font-size: var(--font-md);
  font-weight: var(--font-regular);
`;

export const BusinessProfileSection = styled.section`
  margin-top: 12px;
  padding: 20px 24px 22px;
  border: 1px solid #e7dfd1;
  border-radius: 8px;
  background: var(--color-surface);
  box-shadow: 0 6px 18px rgba(73, 54, 20, 0.04);

  @media (max-width: 760px) {
    padding: 18px 16px;
  }
`;

export const BusinessProfileSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee7db;
`;

export const BusinessProfileSectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: var(--font-xl);
  font-weight: var(--font-medium);

  span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: #fbf2d9;
    color: #9a7400;
    font-size: var(--font-sm);
    font-weight: var(--font-bold);
  }
`;

export const BusinessProfileHint = styled.span`
  color: #777067;
  font-size: var(--font-xs);
`;

export const BusinessBasicGrid = styled.div`
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 24px;
  padding-top: 16px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const BusinessImageBox = styled.div`
  width: 100%;
  min-width: 0;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px dashed #d8c7a9;
  border-radius: 8px;
  background: #fcfaf6;
  color: #8c8376;
  box-sizing: border-box;
`;

export const BusinessImageButton = styled.button`
  width: 128px;
  height: 128px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 2px solid #e7b92d;
  border-radius: 12px;
  background: #fffdf8;
  color: #876600;
  font-size: var(--font-sm);
  cursor: pointer;
`;

export const BusinessImagePreview = styled.img`
  width: 128px;
  height: 128px;
  border: 2px solid #e7b92d;
  border-radius: 12px;
  object-fit: cover;
`;

export const BusinessImageCaption = styled.p`
  margin: 0;
  text-align: center;
  color: #81786c;
  font-size: var(--font-xs);
  line-height: 1.5;
`;

export const BusinessImageActions = styled.div`
  display: flex;
  gap: 12px;

  button {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
    border: 0;
    background: transparent;
    color: #8b6700;
    font-size: var(--font-xs);
    cursor: pointer;
  }

  button:last-child {
    color: #c94a42;
  }
`;

export const BusinessFieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 20px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const BusinessField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #3d372f;
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
`;

export const BusinessFieldInput = styled.input`
  min-width: 0;
  width: 100%;
  height: 46px;
  padding: 0 14px;
  border: 1px solid #ded5c8;
  border-radius: 4px;
  background: #fffdfb;
  color: #2c2925;
  font-size: var(--font-md);
  outline: none;
  box-sizing: border-box;
`;

export const BusinessFieldTextarea = styled.textarea`
  min-width: 0;
  width: 100%;
  min-height: 126px;
  padding: 14px;
  border: 1px solid #ded5c8;
  border-radius: 4px;
  background: #fffdfb;
  color: #2c2925;
  font-size: var(--font-md);
  line-height: 1.6;
  resize: vertical;
  outline: none;
  box-sizing: border-box;
`;

export const BusinessTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 8px;
`;

export const BusinessTag = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 32px;
  padding: 0 12px;
  border: 1px solid ${({ $add }) => ($add ? "#9a7400" : "#ded9d1")};
  border-radius: 999px;
  background: ${({ $add }) => ($add ? "#fffdf8" : "#f1efed")};
  color: ${({ $add }) => ($add ? "#876600" : "#524c44")};
  font-size: var(--font-xs);
  white-space: nowrap;
  cursor: pointer;
`;

export const BusinessIntroduction = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 16px;
`;

export const BusinessBottomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const BusinessOptionPanel = styled.div`
  padding-top: 16px;
`;

export const BusinessOptionLabel = styled.p`
  margin: 0 0 10px;
  color: #5b544a;
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
`;

export const BusinessPillRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const BusinessPill = styled.button`
  height: 32px;
  padding: 0 14px;
  border: 0;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? "#946f00" : "#eeecea")};
  color: ${({ $active }) => ($active ? "#fff" : "#6e6860")};
  font-size: var(--font-xs);
  cursor: pointer;
`;

export const BusinessSettingCard = styled.div`
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #e9e1d6;
  border-radius: 8px;
  background: #fffdfb;
`;

export const BusinessSettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid #eee7db;

  &:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }

  > div:last-child {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  strong {
    font-size: var(--font-md);
    font-weight: var(--font-medium);
  }

  span {
    color: #81786c;
    font-size: var(--font-xs);
  }
`;

export const BusinessTimeInput = styled.input`
  width: 148px;
  height: 42px;
  padding: 0 10px;
  border: 1px solid #ded5c8;
  border-radius: 6px;
  background: #fffdfb;
  color: #2c2925;
  font-size: var(--font-md);
  box-sizing: border-box;

  &:focus {
    border-color: #d6a81b;
    outline: 2px solid rgba(214, 168, 27, 0.16);
  }

  @media (max-width: 520px) {
    width: 132px;
  }
`;

export const BusinessSwitch = styled.span`
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 999px;
  padding: 0;
  border: 0;
  background: ${({ $active }) => ($active ? "#936e00" : "#c9c2b8")};
  cursor: pointer;
  transition: background 160ms ease;

  &::after {
    content: "";
    position: absolute;
    top: 3px;
    right: ${({ $active }) => ($active ? "3px" : "23px")};
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
  }
`;

export const BusinessProfileActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
`;

export const BusinessSaveMessage = styled.span`
  color: #806000;
  font-size: var(--font-sm);
`;

export const BusinessSaveButton = styled.button`
  min-width: 112px;
  height: 42px;
  padding: 0 18px;
  border: 1px solid #b88b00;
  border-radius: 6px;
  background: #d6a81b;
  color: #fff;
  font-size: var(--font-sm);
  font-weight: var(--font-bold);
  cursor: pointer;
`;

export const BusinessCertificate = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #e9e1d6;
  border-radius: 6px;
  background: #fffdfb;

  @media (max-width: 620px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const BusinessCertificateStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  strong {
    display: block;
    font-size: var(--font-sm);
  }

  span {
    display: block;
    margin-top: 4px;
    color: #81786c;
    font-size: var(--font-xs);
  }
`;

export const BusinessCertificateIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #efebe3;
  color: #896600;
`;

export const BusinessSmallButton = styled.button`
  height: 34px;
  padding: 0 12px;
  border: 1px solid #e1d8c9;
  border-radius: 4px;
  background: #fff;
  color: #6f6045;
  font-size: var(--font-xs);
  cursor: pointer;
`;

export const BusinessCredentialList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 18px;
`;

export const BusinessCredential = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid #e9e1d6;
  border-radius: 4px;
  background: #fffdfb;
  color: #50483f;
  font-size: var(--font-sm);
`;
