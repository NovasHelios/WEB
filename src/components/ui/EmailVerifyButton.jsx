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
        style={{ backgroundColor: verified ? "#808080" : "#d6a81b", width: "112px", height: "44px" }}
        className="text-2xl font-semibold text-white transition-opacity rounded-xl hover:opacity-90"
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
