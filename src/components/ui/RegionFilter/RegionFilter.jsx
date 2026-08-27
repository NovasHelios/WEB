import { useEffect, useMemo, useState } from "react";

import { getRegions } from "../../../api/sgisAPI";
import RegionBreadcrumb from "./RegionBreadcrumb";
import RegionGrid from "./RegionGrid";
import {
  BreadcrumbWrap,
  RegionFilterWrap,
  RegionGridWrap,
  RegionMessage,
  RegionSaveButton,
} from "./RegionFilter.styled";

// 시도, 시군구, 읍면동 선택 상태의 초기값입니다.
const initialSelectedRegion = {
  sido: null,
  sigungu: null,
  emd: null,
};

// SGIS 지역 API를 사용해 단계형 지역 선택 UI를 제공합니다.
const RegionFilter = ({ defaultValue = initialSelectedRegion, onSave }) => {
  const [selectedRegion, setSelectedRegion] = useState(defaultValue);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 현재 선택 상태를 기준으로 다음에 보여줄 지역 조회 코드를 계산합니다.
  const parentCode = useMemo(() => {
    if (!selectedRegion.sido) return null;
    if (!selectedRegion.sigungu) return selectedRegion.sido.code;
    if (!selectedRegion.emd) return selectedRegion.sigungu.code;
    return null;
  }, [selectedRegion]);

  // 현재 단계에서 선택 표시를 할 지역 코드를 계산합니다.
  const selectedCode = useMemo(() => {
    if (!selectedRegion.sido) return null;
    if (!selectedRegion.sigungu) return selectedRegion.sido.code;
    if (!selectedRegion.emd) return selectedRegion.sigungu.code;
    return selectedRegion.emd.code;
  }, [selectedRegion]);

  // 현재 단계에 맞는 지역 목록을 SGIS API에서 가져옵니다.
  useEffect(() => {
    if (selectedRegion.emd) return;

    const fetchRegions = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const nextRegions = await getRegions(parentCode);

        setRegions(nextRegions);
      } catch (error) {
        setRegions([]);
        setErrorMessage(error.message || "지역 목록 조회에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, [parentCode, selectedRegion.emd]);

  // 현재 단계에 따라 선택한 지역을 저장하고 하위 지역 선택값을 초기화합니다.
  const handleSelectRegion = (region) => {
    if (!selectedRegion.sido) {
      setSelectedRegion({
        sido: region,
        sigungu: null,
        emd: null,
      });
      return;
    }

    if (!selectedRegion.sigungu) {
      setSelectedRegion((prev) => ({
        ...prev,
        sigungu: region,
        emd: null,
      }));
      return;
    }

    setSelectedRegion((prev) => ({
      ...prev,
      emd: region,
    }));
  };

  // 시도 단계로 되돌아가며 하위 선택값을 초기화합니다.
  const handleBackToSido = () => {
    setSelectedRegion((prev) => ({
      sido: prev.sido,
      sigungu: null,
      emd: null,
    }));
  };

  // 시군구 단계로 되돌아가며 읍면동 선택값을 초기화합니다.
  const handleBackToSigungu = () => {
    setSelectedRegion((prev) => ({
      ...prev,
      emd: null,
    }));
  };

  // 최종 선택된 지역 정보를 부모 컴포넌트로 전달합니다.
  const handleSave = () => {
    onSave?.(selectedRegion);
  };

  return (
    <RegionFilterWrap>
      <BreadcrumbWrap>
        <RegionBreadcrumb
          selectedRegion={selectedRegion}
          onBackToSido={handleBackToSido}
          onBackToSigungu={handleBackToSigungu}
        />
      </BreadcrumbWrap>

      {loading && <RegionMessage>지역 목록을 불러오는 중입니다.</RegionMessage>}
      {errorMessage && <RegionMessage $error>{errorMessage}</RegionMessage>}

      {!loading && !errorMessage && !selectedRegion.emd && (
        <RegionGridWrap>
          <RegionGrid
            regions={regions}
            selectedCode={selectedCode}
            onSelect={handleSelectRegion}
          />
        </RegionGridWrap>
      )}

      <RegionSaveButton type="button" onClick={handleSave}>
        저장
      </RegionSaveButton>
    </RegionFilterWrap>
  );
};

export default RegionFilter;
