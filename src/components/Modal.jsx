import React, { useState, useEffect } from "react";
import "./Modal.css";

/* 공통 래퍼 */
const ModalWrapper = ({ children, onClose }) => {
  // ESC 로 닫기 + 배경 스크롤 락
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

/* ---------------- 일일미션 전용 모달 3종 ---------------- */

// 1. 미션 상세 정보 모달
export const MissionModal = ({ mission, onClose, onSubmit }) => {
  return (
    <ModalWrapper onClose={onClose}>
      <div className="mission-modal">
        <img src={mission.image} alt="mission" className="modal-image" />
        <div className="modal-title">{mission.title}</div>
        <div className="modal-store">{mission.store}</div>
        <div className="modal-reward">{mission.reward}</div>

        <div className="modal-button-group">
          <button className="modal-button btn-store" onClick={() => alert("가게 더보기")}>
            가게 더보기
          </button>
          <button className="modal-button btn-code" onClick={onSubmit}>
            인증코드 입력
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

// 2. 인증코드 입력 모달
export const CodeInputModal = ({ onClose, onSubmit }) => {
  const [code, setCode] = useState("");

  const handleSubmit = () => {
    if (code.length === 4) {
      onSubmit(code);
    } else {
      alert("4자리 숫자를 입력해주세요!");
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div className="modal-code">
        <h3 className="modal-title">인증코드를 입력해주세요</h3>
        <input
          className="modal-code-input"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} // 숫자만
          maxLength={4}
          placeholder="4자리 숫자"
        />
        <div className="modal-button-group">
          <button className="modal-button btn-red" onClick={handleSubmit}>
            확인
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};


// 3. 쿠폰함 성공 모달
export const CouponSuccessModal = ({ onClose }) => {
  return (
    <ModalWrapper onClose={onClose}>
      <div className="modal-success">
        <h3 className="modal-success-title">쿠폰함에 성공적으로 추가되었습니다</h3>
        <p className="modal-success-desc">
          *받은 쿠폰은 마이페이지&gt;쿠폰함에서 확인하실 수 있습니다
        </p>
        <button className="btn-close" onClick={onClose}>닫기</button>
      </div>
    </ModalWrapper>
  );
};


/* ---------------- 스탬프 전용 모달 3종 ---------------- */

// 1. 스탬프 찍기(가게별 인증번호 입력)
export const StampCodeModal = ({ storeName, onClose, onSubmit }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (code.length !== 4) return alert("4자리 숫자를 입력해주세요!");
    try {
      setLoading(true);
      await onSubmit(code); // 성공 시 부모가 상태(+1) 갱신 후 모달 닫기
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div className="modal-code">
        <h3 className="modal-title">{storeName} 스탬프 인증</h3>
        <p className="modal-desc">매장 제공 4자리 코드를 입력하세요.</p>
        <input
          className="modal-code-input"
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="예: 1234"
        />
        <div className="modal-button-group">
          <button className="modal-button btn-red" onClick={submit} disabled={loading}>
            {loading ? "확인 중..." : "확인"}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

// 2. 보상 수령(완성 안내 + 수령 코드 입력)
export const RewardCodeModal = ({ storeName, onClose, onSubmit }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (code.length !== 4) return alert("4자리 숫자를 입력해주세요!");
    try {
      setLoading(true);
      await onSubmit(code); // 성공 시 cyclesCompleted+1, stamps=0 등 처리
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div className="modal-reward">
        <h3 className="modal-title">{storeName} 스탬프 완성!</h3>
        <p className="modal-desc">보상 수령 인증번호를 입력하세요.</p>
        <input
          className="modal-code-input"
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="예: 9876"
        />
        <div className="modal-button-group">
          <button className="modal-button btn-red" onClick={submit} disabled={loading}>
            {loading ? "수령 중..." : "보상 수령하기"}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

// 3. 미수령 카드 존재 알림
export const AlreadyExistsModal = ({ storeName, onClose }) => {
  return (
    <ModalWrapper onClose={onClose}>
      <div className="modal-alert">
        <h3 className="modal-title">이미 스탬프 카드가 있어요</h3>
        <p className="modal-desc">
          {storeName}의 보상을 먼저 수령해주세요. (새로운 스탬프는 보상 수령 후 시작됩니다)
        </p>
        <div className="modal-button-group">
          <button className="modal-button btn-red" onClick={onClose}>확인</button>
        </div>
      </div>
    </ModalWrapper>
  );
};

/* ---------------- 쿠폰 사용 모달 ---------------- */
export const CouponUseModal = ({ coupon, onClose, onUse }) => {
  if (!coupon) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="coupon-modal" onClick={(e) => e.stopPropagation()}>
        <div className="coupon-title">
          <div className="store">{coupon.store}</div>
          <div className="name">{coupon.title}</div>
        </div>

        <img className="coupon-image" src={coupon.image} alt="" />

        <div className="modal-button-group">
          <button className="modal-button btn-red" onClick={onUse}>사용하기</button>
        </div>
      </div>
    </div>
  );
};
