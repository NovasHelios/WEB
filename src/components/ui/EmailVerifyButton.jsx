import { useState } from "react";
import { createPortal } from "react-dom";
import VerificationCodeModal from "./VerificationCodeModal";

const EmailVerifyButton = ({ email, onError }) => {
  const [showModal, setShowModal] = useState(false);
  const [verified, setVerified] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (verified) return;
          if (!email) {
            onError?.("이메일을 먼저 입력해주세요.");
            return;
          }
          setShowModal(true);
        }}
        // 이메일 입력창과 높이를 맞추고 인증 문구는 기본 본문 크기로 표시합니다.
        style={{ backgroundColor: verified ? "#808080" : "#d6a81b", width: "104px", height: "44px", fontSize: "14px" }}
        className="text-sm font-semibold text-white transition-opacity rounded-md hover:opacity-90"
      >
        인증하기
      </button>
      {showModal && createPortal(
        <VerificationCodeModal
          email={email}
          onClose={() => setShowModal(false)}
          onVerify={() => { setShowModal(false); setVerified(true); }}
          onError={onError}
        />,
        document.body
      )}
    </>
  );
};

export default EmailVerifyButton;
