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
        style={{ backgroundColor: "#2C3898", width: "112px", height: "88px" }}
        className="text-white font-semibold rounded-xl hover:opacity-90 transition-opacity text-2xl"
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
