import { useState } from "react";
import { createPortal } from "react-dom";
import VerificationCodeModal from "./VerificationCodeModal";

const EmailVerifyButton = ({ email }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          if (!email) return;
          setShowModal(true);
        }}
        style={{ backgroundColor: "#2C3898", width: "112px", height: "44px" }}
        className="text-2xl font-semibold text-white transition-opacity rounded-xl hover:opacity-90"
      >
        인증하기
      </button>
      {showModal && createPortal(
        <VerificationCodeModal
          email={email}
          onClose={() => setShowModal(false)}
          onVerify={() => setShowModal(false)}
        />,
        document.body
      )}
    </>
  );
};

export default EmailVerifyButton;
