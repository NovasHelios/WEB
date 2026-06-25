import styled from "styled-components";

export const Panel = styled.aside`
  position: absolute;
  top: 40px;
  left: 100%;
  z-index: 15;
  width: 548px;
  height: calc(100vh - 120px);
  background: #ffffff;
  border: 2px solid #ffab03;
  border-radius: 8px;
  color: #06264a;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.16);
  transform: translateX(24px);
  transition: 
    transform 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.24s ease;
`;

export const PanelBody = styled.div`
  height: calc(100% - 96px);
  overflow-y: auto;
  padding: 28px 30px 24px;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  z-index: 3;
  width: 48px;
  height: 48px;
  border: 0;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.88);
  color: #111827;
  font-size: 34px;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.12);
`;

export const LandImage = styled.img`
  width: 100%;
  height: 274px;
  object-fit: cover;
  border-radius: 3px;
  display: block;
`;

export const ImagePlaceholder = styled.div`
  width: 100%;
  height: 274px;
  border-radius: 3px;
  background: #e5e7eb;
`;

export const StatusBadges = styled.div`
  display: flex;
  gap: 8px;
  margin-top: -48px;
  padding-left: 22px;
  position: relative;
  z-index: 2;
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 13px;
  border-radius: 999px;
  background: ${({ $variant }) =>
    $variant === "sale" ? "#08795f" : "#052a54"};
  color: #ffffff;
  font-size: 13px;
  font-weight: 800;
`;

export const Section = styled.section`
  padding-top: 28px;
`;

export const Label = styled.p`
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 800;
  color: #4b5563;
  letter-spacing: 0.04em;
`;

export const Value = styled.p`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #06264a;
  line-height: 1.35;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  padding-top: 24px;
`;

export const Divider = styled.hr`
  border: 0;
  border-top: 1px solid #d7dde5;
  margin: 28px 0 0;
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 44px;
  row-gap: 24px;
  padding-top: 18px;
`;

export const DetailItem = styled.div`
  ${Label} {
    margin-bottom: 6px;
    font-size: 12px;
    letter-spacing: 0;
  }

  ${Value} {
    font-size: 16px;
    font-weight: 500;
    color: #111827;
    word-break: break-all;
  }
`;

export const Description = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 1.85;
  color: #1f2937;
`;

export const UpdatedAt = styled.p`
  margin: 24px 0 0;
  padding-top: 18px;
  border-top: 1px solid #e5e7eb;
  text-align: right;
  font-size: 13px;
  font-weight: 700;
  color: #6b7280;
`;

export const ActionBar = styled.div`
  height: 96px;
  display: grid;
  grid-template-columns: 1fr 124px;
  gap: 14px;
  padding: 18px 30px 22px;
  background: #ffffff;
  border-top: 1px solid #d7dde5;
  box-shadow: 0 -6px 16px rgba(15, 23, 42, 0.06);

  button {
    height: 54px;
    font-size: 15px;
    font-weight: 800;
    cursor: pointer;
  }
`;

export const ContactButton = styled.button`
  border: 0;
  background: #06264a;
  color: #ffffff;
  box-shadow: 0 4px 8px rgba(6, 38, 74, 0.18);
`;

export const BookmarkButton = styled.button`
  border: 1px solid #06264a;
  background: #ffffff;
  color: #06264a;
`;
