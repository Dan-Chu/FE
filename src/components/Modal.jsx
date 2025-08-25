import React, { useState, useEffect } from "react";
import "./Modal.css";
import styled from "styled-components";
import couponUse from "../assets/images/coupon_use.svg";
import missionSkin from "../assets/images/missionmodal.svg";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { MissionComplete } from "../shared/api/mission";
import {
  CodeMadal,
  Close,
  HeadText,
  TestText,
  InputBox,
  Input,
  Check,
  ModalImg,
} from "./ModalStyle";
import CloseButton from "../assets/icons/close_button.svg?react";
import CardLogo from "../assets/logos/card_logo.svg?react";

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

  // viewport 최상단(body)로 포털 렌더
  const node = (
    <div
      className="dc-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="dc-modal-shell" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );

  // 클라이언트에서만 포털
  return typeof document !== "undefined"
    ? createPortal(node, document.body)
    : node;
};

export default ModalWrapper;

/* ---------------- 일일미션 전용 모달 ---------------- */

// 1) 미션 상세 정보 모달
export const MissionModal = ({ mission, onClose, onSubmit }) => {
  const navigate = useNavigate();

  const toStoreDetail = (id) => {
    navigate(`/storeList/storeDetail/${id}`);
  };
  return (
    <ModalWrapper onClose={onClose}>
      <div className="mission-skin">
        {/* 배경(svg) */}
        <img
          className="mission-bg"
          src={missionSkin}
          alt=""
          draggable="false"
        />

        {/* 내용 오버레이 */}
        <div className="mission-body">
          <ModalImg>
            {mission.image ? (
              <img src={mission.image} alt="" className="mission-image" />
            ) : (
              <CardLogo width="76px" height="76px" opacity="0.5" />
            )}
          </ModalImg>
          <div>
            <div className="mission-title">{mission.title}</div>
            <div className="mission-store">{mission.store}</div>
            <div className="mission-desc">{mission.reward}</div>
          </div>
        </div>

        <div className="mission-cta">
          <button
            type="button"
            className="cta cta-left"
            onClick={() => toStoreDetail(mission.storeId)}
            aria-label="가게 더보기"
          />
          <button
            type="button"
            className="cta cta-right"
            onClick={onSubmit}
            aria-label="인증코드 입력"
          />
        </div>
      </div>
    </ModalWrapper>
  );
};

// 2) CodeInputModal (일일미션)
export const CodeInputModal = ({
  onClose,
  onSubmit,
  hint,
  missionData, // 미션 식별자 (경로 param)
  mode = "mission", // "mission" | "coupon"
}) => {
  const [code, setCode] = useState("");

  const normalize = (s) =>
    String(s ?? "")
      .replace(/\s|-/g, "")
      .toUpperCase();

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    const c = normalize(code);

    // 4자리 제한 유지(필요시 조정)
    if (c.length !== 4) {
      alert("4자리 코드를 입력해주세요.");
      return;
    }

    if (mode == "mission") {
      if (!missionData.id) {
        alert("미션 정보를 찾을 수 없어요. 다시 시도해주세요.");
        return;
      }
      const { ok, status, data } = await MissionComplete({
        missionId: missionData.id,
        authCode: c,
      });
      if (!ok) {
        if (status === 404) alert("해당 미션이 없거나 만료되었습니다.");
        else if (status === 400) alert("올바른 인증코드를 입력해주세요.");
        else alert("미션 완료 처리에 실패했어요.");
        return;
      }
      onSubmit?.(c, data); // 성공 시 부모로 전달
    } else {
      // 쿠폰 모드: 검증은 부모(API)가 한다 → 바로 값 전달
      onSubmit?.(c);
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <CodeMadal className="modal-code" onClick={(e) => e.stopPropagation()}>
        <Close>
          <CloseButton onClick={onClose} />
        </Close>
        <HeadText $size="24px" $weight="500">
          {mode == "mission" ? missionData.storeName : ""}
        </HeadText>
        <HeadText $size="32px" $weight="700">
          {mode == "mission" ? "미션 인증 꾹!" : "단골 도장 꾹!"}
        </HeadText>
        <TestText>
          {mode == "mission" ?  hint  : "대풍족:0125 / 동방손칼국수:0123"}
        </TestText>

        <form onSubmit={handleSubmit}>
          <InputBox>
            <CardLogo width="69px" height="64px" />
            <Input
              className="modal-code-input"
              type="text"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, ""))
              } /* 숫자만 */
              maxLength={4}
              inputMode="numeric"
              placeholder="0000"
              autoFocus
            />
          </InputBox>
          <Check type="submit" onClick={handleSubmit}>
            확인
          </Check>
        </form>
      </CodeMadal>
    </ModalWrapper>
  );
};

/* ---------------- 스탬프 전용 모달 ---------------- */
import StampHero from "../assets/images/stamp_modal.svg";
import AlreadyHero from "../assets/images/already_stamp.svg";

// 1) 스탬프 찍기(가게별 인증번호 입력)
export const StampCodeModal = ({ onClose, onSubmit }) => {
  const [code, setCode] = useState("");

  const submit = () => {
    if (code.length !== 4) {
      alert("4자리 숫자를 입력해주세요!");
      return;
    }
    // 모달은 '코드 전달'만 담당, API 호출은 부모가 수행
    onSubmit(code);
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div className="stamp-modal">
        <img src={StampHero} alt="" className="stamp-hero" />

        {/* 단골 도장 꾹! */}
        <h3 className="stamp-title">단골 도장 꾹!</h3>

        {/* * 테스트용 인증코드 안내 */}
        <p className="stamp-hint">대풍족:0125 / 동방손칼국수:0123</p>

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
          확인
        </button>
      </div>
    </ModalWrapper>
  );
};

// 2) 미수령 카드 존재 알림
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

// 3) 공용: 쿠폰함 성공 모달 (일일미션/스탬프 모두 재사용)
export const CouponSuccessModal = ({ onClose }) => {
  return (
    <ModalWrapper onClose={onClose}>
      <div className="modal-success">
        <h3 className="modal-success-title">
          쿠폰함에 성공적으로
          <br />
          추가되었습니다
        </h3>
        <p className="modal-success-desc">
          *받은 쿠폰은 <span className="nowrap">마이페이지&gt;쿠폰함에서</span>
          <br />
          확인하실 수 있습니다
        </p>
        <button className="btn-close" onClick={onClose}>
          닫기
        </button>
      </div>
    </ModalWrapper>
  );
};

/* ----- 쿠폰 사용 성공적 모달 (가맹점에서 '사용' 버튼 눌렀을 때) ----- */
export const CouponUseModal = ({ onClose }) => {
  return (
    <ModalWrapper onClose={onClose}>
      <UseWrap role="dialog" aria-label="쿠폰 사용 완료">
        <img src={couponUse} alt="" draggable="false" />
        {/* 이미지 하단 '닫기' 영역만 클릭되도록 투명 버튼 오버레이 */}
        <button
          type="button"
          className="btn-close"
          aria-label="닫기"
          onClick={onClose}
        />
      </UseWrap>
    </ModalWrapper>
  );
};

// 모달 스타일
const UseWrap = styled.div`
  position: relative;
  width: min(320px, 90vw);

  img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 16px;
    user-select: none;
    pointer-events: none;
  }

  .btn-close {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;

    /* 이미지의 빨간 '닫기' 바 영역만큼 높이  */
    height: 56px;

    background: transparent;
    border: 0;
    cursor: pointer;
  }
`;
