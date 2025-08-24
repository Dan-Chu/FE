import styled from "styled-components";
import ToYou from "../../assets/icons/splash_to_you.svg?react";
import DanchuService from "../../assets/icons/splash_danchu_service.svg?react";
import TextDanchu from "../../assets/logos/text_danchu.svg?react";
import BigLogo from "../../assets/logos/big_logo.svg?react";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";

export default function Splash() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000); // 2초 후 사라짐
    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [navigate]);

  return (
    <AnimatePresence>
      {isVisible && (
        <Motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={() => navigate("/login1")}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-50"
        >
          <Page>
            <Box>
              <ToYou />
              <DanchuService />
              <TextDanchu />
            </Box>
            <div
              style={{ width: "221px", height: "204px", paddingLeft: "70px" }}
            >
              <BigLogo />
            </div>
          </Page>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fffcf8;
  height: 100dvh;
  padding-left: 44px;
  padding-top: 148px;
`;
const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-bottom: 188px;
`;
