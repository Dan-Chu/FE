import React, { useState, useEffect } from "react";
import "./Modal.css";
import { useNavigate } from "react-router-dom";

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
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

/* ---------------- 일일미션 전용 모달 3종 ---------------- */

// 1) 미션 상세 정보 모달
export const MissionModal = ({ mission, onClose, onSubmit }) => {
  const navigate = useNavigate();

  const toStoreDetail = (id) => {
    navigate(`/storeList/storeDetail/${id}`);
  };
  return (
    <ModalWrapper onClose={onClose}>
      <div className="mission-modal">
        <img src={mission.image} alt="" className="mission-image" />
        <div className="mission-title">{mission.title}</div>
        <div className="mission-store">{mission.store}</div>
        <div className="mission-desc">{mission.reward}</div>

        <div className="mission-btn-group">
          <button
            type="button"
            className="mission-btn mission-btn-store"
            onClick={() => toStoreDetail(mission.storeId)}
          >
            가게 더보기
          </button>
          <button
            type="button"
            className="mission-btn mission-btn-code"
            onClick={onSubmit}
          >
            인증코드 입력
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

import { MissionComplete } from "../shared/api/mission";
// 2) 인증코드 입력 모달(일일미션)
export const CodeInputModal = ({
  onClose,
  onSubmit,
  hint = "예시 코드는 0000 입니다",
  authCode,
}) => {
  const [code, setCode] = useState("");

  const handleSubmit = async () => {
    const result = await MissionComplete(code, authCode);
    if (code.length === 4) {
      if (result) onSubmit();
      else alert("올바른 코드를 입력해주세요.");
    } else alert("4자리 숫자를 입력해주세요!");
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div className="modal-code">
        <h3 className="modal-title">인증코드를 입력해주세요</h3>

        {hint && <p className="modal-hint">{hint}</p>}

        <input
          className="modal-code-input"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          maxLength={4}
          inputMode="numeric"
          placeholder="4자리 숫자"
          autoFocus
        />

        <div className="modal-button-group">
          <button className="btn-confirm" onClick={handleSubmit}>
            확인
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

// ✅ 3) 공용: 쿠폰함 성공 모달 (일일미션/스탬프 모두 재사용)
export const CouponSuccessModal = ({ onClose }) => {
  return (
    <ModalWrapper onClose={onClose}>
      <div className="modal-success">
        <h3 className="modal-success-title">
          쿠폰함에 성공적으로 추가되었습니다
        </h3>
        <p className="modal-success-desc">
          *받은 쿠폰은 마이페이지&gt;쿠폰함에서 확인하실 수 있습니다
        </p>
        <button className="btn-close" onClick={onClose}>
          닫기
        </button>
      </div>
    </ModalWrapper>
  );
};

/* ---------------- 스탬프 전용 모달 3종 ---------------- */
import StampHero from "../assets/images/stamp_modal.svg";
import AlreadyHero from "../assets/images/already_stamp.svg";
import { StampPlus, StampReward } from "../shared/api/stamp";

// 1) 스탬프 찍기(가게별 인증번호 입력)
export const StampCodeModal = ({ data, onClose, onSubmit }) => {
  const [code, setCode] = useState("");

  const submit = async () => {
    if (code.length !== 4) return alert("4자리 숫자를 입력해주세요!");
    else {
      const res = await StampPlus(data.authCode);//도장 적립 결과
      if (res) {
        onSubmit(data); // 성공 시 부모 상태 갱신,데이터 전달
      } else return alert("옳은 코드를 입력해주세요");//적립실패시 다시입력(실패 이유:코드 틀림)
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div className="stamp-modal">
        <img src={StampHero} alt="" className="stamp-hero" />

        {/* (가게이름), */}
        {data.storeName ? (
          <div className="stamp-sub">
            {data.storeName}
            <span className="comma">,</span>
          </div>
        ) : null}

        {/* 단골 도장 꾹! */}
        <h3 className="stamp-title">단골 도장 꾹!</h3>

        {/* * 테스트용 인증코드 0000입니다. */}
        <p className="stamp-hint">* 테스트용 인증코드 0000입니다.</p>

        {/* AAAA 스타일의 대형 입력 */}
        <input
          className="stamp-code"
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="0000"
          aria-label="인증코드 4자리"
        />

        <button className="btn-confirm" onClick={submit}>
          "확인"
        </button>
      </div>
    </ModalWrapper>
  );
};

// 2) 보상 수령(완성 안내 + 수령 코드 입력)
export const RewardCodeModal = ({ storeName = "", onClose, onSubmit }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (code.length !== 4) return alert("4자리 숫자를 입력해주세요!");
    try {
      setLoading(true);
      await onSubmit(code);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div className="stamp-modal">
        <img src={StampHero} alt="" className="stamp-hero" />

        {/* (가게이름), */}
        {storeName ? (
          <div className="stamp-sub">
            {storeName}
            <span className="comma">,</span>
          </div>
        ) : null}

        {/* 스탬프 완성! */}
        <h3 className="stamp-title">스탬프 완성!</h3>

        {/* * 테스트용 인증코드 0000입니다. */}
        <p className="stamp-hint">* 테스트용 인증코드 0000입니다.</p>

        {/* AAAA 스타일의 대형 입력 */}
        <input
          className="stamp-code"
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="0000"
          aria-label="수령 인증코드 4자리"
        />

        <button className="btn-confirm" onClick={submit} disabled={loading}>
          {loading ? "수령 중..." : "보상 수령하기"}
        </button>
      </div>
    </ModalWrapper>
  );
};

// 3) 미수령 카드 존재 알림
export const AlreadyExistsModal = ({ storeName = "", onClose }) => {
  return (
    <ModalWrapper onClose={onClose}>
      <div className="stamp-modal stamp-modal--alert">
        <img src={AlreadyHero} alt="" className="stamp-hero" />

        {/* 이미 스탬프 카드가 존재합니다. */}
        <div className="alert-sub">이미 스탬프 카드가 존재합니다.</div>

        {/* 보상을 수령해주세요. (+가게명 문구는 본문에) */}
        <h3 className="alert-title">보상을 수령해주세요.</h3>
        {storeName ? (
          <p className="alert-desc">
            {storeName}의 보상을 먼저 수령해주세요. <br />
            (새로운 스탬프는 보상 수령 후 시작됩니다)
          </p>
        ) : null}

        <button className="btn-confirm" onClick={onClose}>
          확인
        </button>
      </div>
    </ModalWrapper>
  );
};
