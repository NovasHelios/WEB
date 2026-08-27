// 필터 내부 상태를 관리하기 위한 React 훅입니다.
import { useState } from "react";

import { ChevronDown, ChevronUp, Pencil, X } from "lucide-react";

import RegionFilter from "../RegionFilter";

// 필터 UI 스타일 컴포넌트입니다.
import {
  FilterWrap,
  FilterButton,
  FilterItem,
  DropdownPanel,
  DropdownHeader,
  CloseButton,
  SegmentedControl,
  SegmentButton,
  ApplyButton,
  RangeBlock,
  RangeTitleRow,
  RangeValueText,
  RangeTrack,
  RangeInput,
  // 슬라이더 기준 라벨 목록입니다.
  RangeLabelList,
  // 슬라이더 값 위치에 맞춰 배치되는 라벨입니다.
  RangeLabel,
  ActionRow,
  DirectInputBox,
  RegionPath,
  RegionGrid,
  RegionButton,
  // 직접 입력 팝업 스타일 컴포넌트입니다.
  DirectInputBackdrop,
  DirectInputModal,
  DirectInputHeader,
  DirectInputTitle,
  DirectInputFields,
  DirectInputUnit,
  // 직접 입력 숫자 input과 단위 select를 묶는 박스입니다.
  DirectInputGroup,
  // 직접 입력값 아래 읽기용 금액 문구입니다.
  DirectInputHint,
  // 직접 입력 에러 메시지입니다.
  DirectInputError,
} from "./Filter.styled";

// 거래 유형 옵션입니다.
const transactionOptions = [
  { label: "전체", value: "ALL" },
  { label: "매매", value: "SALE" },
  { label: "임대", value: "RENT" },
  { label: "사업희망", value: "BUSINESS_HOPE" },
];

// 숫자 가격을 필터 표시 문구로 변환합니다.
const formatMoneyLabel = (value) => {
  // 값이 없으면 전체로 표시합니다.
  if (value === null || value === undefined) return "전체";

  // 1억 이상이면 억 단위로 표시합니다.
  if (value >= 100000000) return `${value / 100000000}억`;

  // 1천만원 이상이면 천만원 단위로 표시합니다.
  if (value >= 10000000) return `${value / 10000}만`;

  // 기본은 만원 단위로 표시합니다.
  return `${value / 10000}만`;
};

// 드래그 범위 필터별 최소값, 최대값, 이동 단위, 표시 라벨입니다.
const rangeConfig = {
  // 매매가는 최소/최대 끝값을 조건 없음으로 해석하고, 중간 라벨은 실제 값과 맞춥니다.
  salePrice: {
    min: 0,
    max: 4000000000,
    step: 10000000,
    labels: [
      { label: "최소", value: 0 },
      { label: "10억", value: 1000000000 },
      { label: "20억", value: 2000000000 },
      { label: "30억", value: 3000000000 },
      { label: "최대", value: 4000000000 },
    ],
  },

  // 임대가는 5만원 단위로 움직이고, 중간 라벨은 실제 값과 맞춥니다.
  rentPrice: {
    min: 0,
    max: 5000000,
    step: 50000,
    labels: [
      { label: "최소", value: 0 },
      { label: "100만", value: 1000000 },
      { label: "200만", value: 2000000 },
      { label: "300만", value: 3000000 },
      { label: "400만", value: 4000000 },
      { label: "최대", value: 5000000 },
    ],
  },

  // 면적은 최소/최대 끝값을 조건 없음으로 해석합니다.
  area: {
    min: 0,
    max: 500,
    step: 10,
    labels: [
      { label: "최소", value: 0 },
      { label: "100㎡", value: 100 },
      { label: "200㎡", value: 200 },
      { label: "300㎡", value: 300 },
      { label: "400㎡", value: 400 },
      { label: "최대", value: 500 },
    ],
  },
};

// 금액 범위 표시 문구를 생성합니다.
const formatMoneyRangeLabel = (range, defaultMin, defaultMax) => {
  // 최소 핸들의 현재 값을 가져옵니다.
  const minValue = range.min ?? defaultMin;

  // 최대 핸들의 현재 값을 가져옵니다.
  const maxValue = range.max ?? defaultMax;

  // 양쪽 핸들이 모두 끝에 있으면 전체 조건입니다.
  if (minValue === defaultMin && maxValue === defaultMax) {
    return "전체";
  }

  // 왼쪽 핸들이 최소 끝에 있으면 오른쪽 값 이하 조건입니다.
  if (minValue === defaultMin) {
    return `${formatMoneyLabel(maxValue)} 이하`;
  }

  // 오른쪽 핸들이 최대 끝에 있으면 왼쪽 값 이상 조건입니다.
  if (maxValue === defaultMax) {
    return `${formatMoneyLabel(minValue)} 이상`;
  }

  // 양쪽 핸들이 모두 끝이 아니면 범위 조건입니다.
  return `${formatMoneyLabel(minValue)} ~ ${formatMoneyLabel(maxValue)}`;
};

// 면적 범위 표시 문구를 생성합니다.
const formatAreaRangeLabel = (range, defaultMin, defaultMax) => {
  // 최소 핸들의 현재 값을 가져옵니다.
  const minValue = range.min ?? defaultMin;

  // 최대 핸들의 현재 값을 가져옵니다.
  const maxValue = range.max ?? defaultMax;

  // 양쪽 핸들이 모두 끝에 있으면 전체 조건입니다.
  if (minValue === defaultMin && maxValue === defaultMax) {
    return "전체";
  }

  // 왼쪽 핸들이 최소 끝에 있으면 오른쪽 값 이하 조건입니다.
  if (minValue === defaultMin) {
    return `${formatAreaLabel(maxValue)} 이하`;
  }

  // 오른쪽 핸들이 최대 끝에 있으면 왼쪽 값 이상 조건입니다.
  if (maxValue === defaultMax) {
    return `${formatAreaLabel(minValue)} 이상`;
  }

  // 양쪽 핸들이 모두 끝이 아니면 범위 조건입니다.
  return `${formatAreaLabel(minValue)} ~ ${formatAreaLabel(maxValue)}`;
};

// 숫자 면적을 필터 표시 문구로 변환합니다.
const formatAreaLabel = (value) => {
  // 값이 없으면 전체로 표시합니다.
  if (value === null || value === undefined) return "전체";

  // 제곱미터 단위로 표시합니다.
  return `${value}㎡`;
};

const getRangePercent = (value, config) => {
  return ((value - config.min) / (config.max - config.min)) * 100;
};

// 슬라이더 기준 라벨을 실제 값 비율에 맞춰 렌더링합니다.
const renderRangeLabels = (config) => {
  // 전체 범위 길이를 계산합니다.
  const rangeSize = config.max - config.min;

  // 각 라벨을 슬라이더 값 위치에 맞춰 표시합니다.
  return (
    <RangeLabelList>
      {config.labels.map((item) => {
        // 현재 라벨 값이 전체 범위에서 몇 퍼센트 위치인지 계산합니다.
        const position = ((item.value - config.min) / rangeSize) * 100;

        return (
          <RangeLabel key={item.label} $position={position}>
            {item.label}
          </RangeLabel>
        );
      })}
    </RangeLabelList>
  );
};

// 지도 필터 컴포넌트입니다.
function Filter({ filters, onApplyFilters }) {
  // 현재 열려 있는 필터 이름을 저장합니다.
  const [activeFilter, setActiveFilter] = useState(null);

  // 적용 전 임시 필터 값을 저장합니다.
  const [draftFilters, setDraftFilters] = useState(filters);

  // 직접 입력 모드로 열린 필터 이름을 저장합니다.
  const [directInputTarget, setDirectInputTarget] = useState(null);

  // 직접 입력 검증 에러 메시지를 저장합니다.
  const [directInputError, setDirectInputError] = useState("");

  // 필터 버튼 클릭 시 열고 닫는 함수입니다.
  const handleToggleFilter = (filterName) => {
    // 직접 입력창은 닫습니다.
    setDirectInputTarget(null);

    // 같은 필터를 다시 누르면 닫습니다.
    setActiveFilter((prev) => (prev === filterName ? null : filterName));

    // 최신 적용 필터를 임시 값으로 복사합니다.
    setDraftFilters(filters);
  };

  // 임시 필터 값을 실제 필터로 적용합니다.
  const handleApply = () => {
    // 상위 Map 컴포넌트에 필터 적용을 요청합니다.
    onApplyFilters(draftFilters);

    // 적용 후 열린 필터를 닫습니다.
    setActiveFilter(null);

    // 직접 입력창도 닫습니다.
    setDirectInputTarget(null);
  };

  // 거래 유형 임시 값을 변경합니다.
  const handleChangeTransaction = (value) => {
    // 거래 유형 필터 값을 변경합니다.
    setDraftFilters((prev) => ({
      ...prev,
      transactionType: value,
    }));
  };

  // 지역 임시 값을 변경합니다.
  const handleChangeRegion = (region) => {
    // 지역 필터 값을 변경합니다.
    setDraftFilters((prev) => ({
      ...prev,
      region,
    }));
  };

  // 범위 필터 임시 값을 변경합니다.
  const handleChangeRange = (filterKey, side, value) => {
    // range input 문자열을 숫자로 변환합니다.
    const numberValue = Number(value);

    // 현재 필터의 범위 설정을 가져옵니다.
    const config = rangeConfig[filterKey];

    // 범위 설정이 없으면 실행하지 않습니다.
    if (!config) return;

    // 선택한 범위 값을 변경합니다.
    setDraftFilters((prev) => {
      // 기존 범위 값을 가져옵니다.
      const currentRange = prev[filterKey];

      // 현재 최대값이 없으면 필터 기본 최대값을 사용합니다.
      const currentMax = currentRange.max ?? config.max;

      // 현재 최소값이 없으면 필터 기본 최소값을 사용합니다.
      const currentMin = currentRange.min ?? config.min;

      // 최소 핸들은 최대 핸들보다 최소 1 step 앞까지만 이동할 수 있습니다.
      if (side === "min") {
        // 최소값이 넘어갈 수 있는 최대 위치입니다.
        const maxAllowedMin = currentMax - config.step;

        return {
          ...prev,
          [filterKey]: {
            ...currentRange,

            // 최소값은 기본 최소값보다 작아질 수 없고, 최대값과 겹치거나 넘어갈 수 없습니다.
            min: Math.min(Math.max(numberValue, config.min), maxAllowedMin),
          },
        };
      }

      // 최대 핸들은 최소 핸들보다 최소 1 step 뒤까지만 이동할 수 있습니다.
      const minAllowedMax = currentMin + config.step;

      return {
        ...prev,
        [filterKey]: {
          ...currentRange,

          // 최대값은 기본 최대값보다 커질 수 없고, 최소값과 겹치거나 뒤로 갈 수 없습니다.
          max: Math.max(Math.min(numberValue, config.max), minAllowedMax),
        },
      };
    });
  };

  // 만원 단위 입력값을 원 단위 값으로 변환합니다.
  const convertManToWon = (value) => {
    // 값이 없으면 조건 없음으로 처리합니다.
    if (value === null || value === "") return null;

    // 입력값을 숫자로 변환합니다.
    const numberValue = Number(value);

    // 숫자가 아니거나 음수이면 조건 없음으로 처리합니다.
    if (Number.isNaN(numberValue) || numberValue < 0) return null;

    // 만원 단위를 원 단위로 변환합니다.
    return numberValue * 10000;
  };

  // 숫자 입력값을 1,000 형태로 표시합니다.
  const formatNumberInput = (value) => {
    // 값이 없으면 빈 문자열로 표시합니다.
    if (value === null || value === undefined || value === "") return "";

    // 숫자만 남긴 뒤 3자리마다 콤마를 추가합니다.
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 콤마가 포함된 입력값에서 숫자만 추출합니다.
  const parseNumberInput = (value) => {
    // 입력값에서 숫자가 아닌 문자를 제거합니다.
    return value.replace(/[^\d]/g, "");
  };

  // 원 단위 값을 만원 단위 입력값으로 변환합니다.
  const convertWonToMan = (value) => {
    // 값이 없으면 빈 입력값으로 표시합니다.
    if (value === null || value === undefined) return "";

    // 원 단위를 만원 단위로 변환합니다.
    return value / 10000;
  };

  // 직접 입력값 아래에 보여줄 읽기용 금액 문구를 만듭니다.
  const formatDirectMoneyHint = (value) => {
    // 값이 없으면 안내 문구를 숨깁니다.
    if (value === null || value === undefined) return "";

    // 원 단위를 만원 단위로 변환합니다.
    const manValue = Math.floor(value / 10000);

    // 억 단위와 남은 만원 단위를 계산합니다.
    const eokValue = Math.floor(manValue / 10000);
    const remainManValue = manValue % 10000;

    // 1억 이상이고 남은 만원이 있으면 억과 만을 함께 표시합니다.
    if (eokValue > 0 && remainManValue > 0) {
      return `${eokValue}억 ${remainManValue.toLocaleString()}만`;
    }

    // 1억 이상이면 억 단위만 표시합니다.
    if (eokValue > 0) return `${eokValue}억`;

    // 1억 미만이면 만원 단위로 표시합니다.
    return `${manValue.toLocaleString()}만`;
  };

  // 직접 입력 값을 변경합니다.
  const handleChangeDirectInput = (filterKey, side, value) => {
    // 입력을 다시 시작하면 기존 에러 메시지를 숨깁니다.
    setDirectInputError("");

    // 콤마가 포함된 입력값에서 숫자만 추출합니다.
    const onlyNumberValue = parseNumberInput(value);

    // 입력값이 비어 있으면 조건 없음으로 처리합니다.
    if (onlyNumberValue === "") {
      setDraftFilters((prev) => ({
        ...prev,
        [filterKey]: {
          ...prev[filterKey],
          [side]: null,
        },
      }));

      return;
    }

    // 입력값을 숫자로 변환합니다.
    const numberValue = Number(onlyNumberValue);

    // 숫자가 아니거나 음수이면 값을 반영하지 않습니다.
    if (Number.isNaN(numberValue) || numberValue < 0) return;

    // 가격 필터는 만원 단위 입력값을 원 단위로 변환하고, 면적은 입력값을 그대로 사용합니다.
    const rawValue =
      directInputConfig?.unit === "원"
        ? convertManToWon(numberValue)
        : numberValue;

    // 직접 입력 대상의 허용 최소값과 최대값을 가져옵니다.
    const minValue = directInputConfig?.minValue ?? 0;
    const maxValue = directInputConfig?.maxValue ?? Infinity;

    // 허용 범위를 벗어난 값은 저장 전에 잘라냅니다.
    const clampedValue = Math.min(Math.max(rawValue, minValue), maxValue);

    // 변환 및 보정된 값을 임시 필터에 저장합니다.
    setDraftFilters((prev) => ({
      ...prev,
      [filterKey]: {
        ...prev[filterKey],
        [side]: clampedValue,
      },
    }));
  };

  // 직접 입력 팝업의 적용 버튼을 눌렀을 때 필터 패널에만 값을 반영합니다.
  const handleApplyDirectInput = () => {
    // 직접 입력 설정이 없으면 실행하지 않습니다.
    if (!directInputConfig) return;

    // 현재 직접 입력 대상 필터 이름을 가져옵니다.
    const filterKey = directInputConfig.filterKey;

    // 현재 입력된 범위를 가져옵니다.
    const currentRange = draftFilters[filterKey];

    // 최소값이 최대값보다 크면 에러 메시지를 보여주고 적용하지 않습니다.
    if (
      currentRange.min !== null &&
      currentRange.max !== null &&
      currentRange.min > currentRange.max
    ) {
      setDirectInputError("최대 금액보다 작아야 합니다.");
      return;
    }

    // 에러 메시지를 초기화합니다.
    setDirectInputError("");

    // 직접 입력 팝업만 닫고, 실제 백엔드 적용은 저장 버튼에서만 합니다.
    setDirectInputTarget(null);
  };

  // 직접 입력창에서 포커스가 빠질 때 허용 범위 밖의 값을 보정합니다.
  const handleBlurDirectInput = (filterKey, side) => {
    // 현재 직접 입력 대상의 최소/최대 허용값을 가져옵니다.
    const minValue = directInputConfig?.minValue ?? 0;
    const maxValue = directInputConfig?.maxValue ?? Infinity;

    // 입력값이 허용 범위를 벗어나면 보정합니다.
    setDraftFilters((prev) => {
      const currentValue = prev[filterKey][side];

      // 값이 비어 있으면 그대로 둡니다.
      if (currentValue === null) return prev;

      return {
        ...prev,
        [filterKey]: {
          ...prev[filterKey],

          // 최소값보다 작으면 최소값으로, 최대값보다 크면 최대값으로 보정합니다.
          [side]: Math.min(Math.max(currentValue, minValue), maxValue),
        },
      };
    });
  };

  // 직접 입력 대상별 설정값입니다.
  const directInputConfigs = {
    // 매매가 직접 입력 설정입니다.
    sale: {
      title: "매매가",
      filterKey: "salePrice",
      unit: "원",
      minValue: 10000000,
      maxValue: rangeConfig.salePrice.max,
    },

    // 임대가 직접 입력 설정입니다.
    rent: {
      title: "임대가",
      filterKey: "rentPrice",
      unit: "원",
      minValue: 1000000,
      maxValue: rangeConfig.rentPrice.max,
    },

    // 면적 직접 입력 설정입니다.
    area: {
      title: "면적",
      filterKey: "area",
      unit: "㎡",
      minValue: rangeConfig.area.min,
      maxValue: rangeConfig.area.max,
    },
  };

  // 현재 열려 있는 직접 입력 팝업 설정입니다.
  const directInputConfig = directInputTarget
    ? directInputConfigs[directInputTarget]
    : null;

  return (
    <FilterWrap>
      {/* 거래 유형 필터 묶음입니다. */}
      <FilterItem>
        {/* 거래 유형 필터 버튼입니다. */}
        <FilterButton
          type="button"
          $active={activeFilter === "type"}
          onClick={() => handleToggleFilter("type")}
        >
          거래 유형
          {activeFilter === "type" ? (
            <ChevronUp size={16} strokeWidth={2.4} />
          ) : (
            <ChevronDown size={16} strokeWidth={2.4} />
          )}
        </FilterButton>

        {/* 거래 유형 필터 패널입니다. */}
        {activeFilter === "type" && (
          <DropdownPanel $width="500px">
            <DropdownHeader>
              <span>거래 형태</span>
              <CloseButton type="button" onClick={() => setActiveFilter(null)}>
                <X size={18} />
              </CloseButton>
            </DropdownHeader>

            <SegmentedControl>
              {transactionOptions.map((option) => (
                <SegmentButton
                  key={option.value}
                  type="button"
                  $active={draftFilters.transactionType === option.value}
                  onClick={() => handleChangeTransaction(option.value)}
                >
                  {option.label}
                </SegmentButton>
              ))}
            </SegmentedControl>

            <ApplyButton type="button" onClick={handleApply}>
              저장
            </ApplyButton>
          </DropdownPanel>
        )}
      </FilterItem>

      {/* 지역 선택 필터 묶음입니다. */}
      <FilterItem>
        {/* 지역 선택 필터 버튼입니다. */}
        <FilterButton
          type="button"
          $active={activeFilter === "region"}
          onClick={() => handleToggleFilter("region")}
        >
          지역 선택
          {activeFilter === "region" ? (
            <ChevronUp size={16} strokeWidth={2.4} />
          ) : (
            <ChevronDown size={16} strokeWidth={2.4} />
          )}
        </FilterButton>

        {/* 지역 선택 필터 패널입니다. */}
        {activeFilter === "region" && (
          <DropdownPanel $width="452px">
            <RegionPath>
              서울시 <span>›</span> 시·군·구 <span>›</span> 읍·면·동 선택
            </RegionPath>

            <RegionGrid>
              {seoulRegions.map((region) => (
                <RegionButton
                  key={region}
                  type="button"
                  $active={draftFilters.region === region}
                  onClick={() => handleChangeRegion(region)}
                >
                  {region}
                </RegionButton>
              ))}
            </RegionGrid>

            <ApplyButton type="button" onClick={handleApply}>
              저장
            </ApplyButton>
          </DropdownPanel>
        )}
      </FilterItem>

      {/* 금액 필터 묶음입니다. */}
      <FilterItem>
        {/* 금액 필터 버튼입니다. */}
        <FilterButton
          type="button"
          $active={activeFilter === "price"}
          onClick={() => handleToggleFilter("price")}
        >
          금액
          {activeFilter === "price" ? (
            <ChevronUp size={16} strokeWidth={2.4} />
          ) : (
            <ChevronDown size={16} strokeWidth={2.4} />
          )}
        </FilterButton>

        {/* 금액 필터 패널입니다. */}
        {activeFilter === "price" && (
          <DropdownPanel $width="452px">
            {/* 매매가 범위 필터 영역입니다. */}
            <RangeBlock>
              <RangeTitleRow>
                <span>매매가</span>

                {/* 현재 선택 중인 매매가 범위를 표시합니다. */}
                <RangeValueText>
                  {formatMoneyRangeLabel(
                    draftFilters.salePrice,
                    rangeConfig.salePrice.min,
                    rangeConfig.salePrice.max
                  )}
                </RangeValueText>

                {/* 매매가 직접 입력 팝업을 엽니다. */}
                <button
                  type="button"
                  onClick={() => setDirectInputTarget("sale")}
                >
                  <Pencil size={16} />
                </button>
              </RangeTitleRow>

              {/* 매매가 최소/최대 슬라이더입니다. */}
              <RangeTrack
                $minPercent={getRangePercent(
                  draftFilters.salePrice.min ?? rangeConfig.salePrice.min,
                  rangeConfig.salePrice
                )}
                $maxPercent={getRangePercent(
                  draftFilters.salePrice.max ?? rangeConfig.salePrice.max,
                  rangeConfig.salePrice
                )}
              >
                <RangeInput
                  $isMin
                  type="range"
                  min={rangeConfig.salePrice.min}
                  max={rangeConfig.salePrice.max}
                  step={rangeConfig.salePrice.step}
                  value={
                    draftFilters.salePrice.min ?? rangeConfig.salePrice.min
                  }
                  onChange={(event) =>
                    handleChangeRange("salePrice", "min", event.target.value)
                  }
                />

                <RangeInput
                  type="range"
                  min={rangeConfig.salePrice.min}
                  max={rangeConfig.salePrice.max}
                  step={rangeConfig.salePrice.step}
                  value={
                    draftFilters.salePrice.max ?? rangeConfig.salePrice.max
                  }
                  onChange={(event) =>
                    handleChangeRange("salePrice", "max", event.target.value)
                  }
                />
              </RangeTrack>
              {/* 매매가 기준 라벨입니다. */}
              {renderRangeLabels(rangeConfig.salePrice)}
            </RangeBlock>

            {/* 임대가 범위 필터 영역입니다. */}
            <RangeBlock>
              <RangeTitleRow>
                <span>임대가</span>

                {/* 현재 선택 중인 임대가 범위를 표시합니다. */}
                <RangeValueText>
                  {formatMoneyRangeLabel(
                    draftFilters.rentPrice,
                    rangeConfig.rentPrice.min,
                    rangeConfig.rentPrice.max
                  )}
                </RangeValueText>

                {/* 임대가 직접 입력 팝업을 엽니다. */}
                <button
                  type="button"
                  onClick={() => setDirectInputTarget("rent")}
                >
                  <Pencil size={16} />
                </button>
              </RangeTitleRow>

              {/* 임대가 최소/최대 슬라이더입니다. */}
              <RangeTrack
                $minPercent={getRangePercent(
                  draftFilters.rentPrice.min ?? rangeConfig.rentPrice.min,
                  rangeConfig.rentPrice
                )}
                $maxPercent={getRangePercent(
                  draftFilters.rentPrice.max ?? rangeConfig.rentPrice.max,
                  rangeConfig.rentPrice
                )}
              >
                <RangeInput
                  $isMin
                  type="range"
                  min={rangeConfig.rentPrice.min}
                  max={rangeConfig.rentPrice.max}
                  step={rangeConfig.rentPrice.step}
                  value={
                    draftFilters.rentPrice.min ?? rangeConfig.rentPrice.min
                  }
                  onChange={(event) =>
                    handleChangeRange("rentPrice", "min", event.target.value)
                  }
                />

                <RangeInput
                  type="range"
                  min={rangeConfig.rentPrice.min}
                  max={rangeConfig.rentPrice.max}
                  step={rangeConfig.rentPrice.step}
                  value={
                    draftFilters.rentPrice.max ?? rangeConfig.rentPrice.max
                  }
                  onChange={(event) =>
                    handleChangeRange("rentPrice", "max", event.target.value)
                  }
                />
              </RangeTrack>
              {/* 임대가 기준 라벨입니다. */}
              {renderRangeLabels(rangeConfig.rentPrice)}
            </RangeBlock>

            {/* 금액 필터 저장 버튼입니다. */}
            <ActionRow $center>
              <ApplyButton type="button" onClick={handleApply}>
                저장
              </ApplyButton>
            </ActionRow>
          </DropdownPanel>
        )}
      </FilterItem>

      {/* 면적 필터 묶음입니다. */}
      <FilterItem>
        {/* 면적 필터 버튼입니다. */}
        <FilterButton
          type="button"
          $active={activeFilter === "area"}
          onClick={() => handleToggleFilter("area")}
        >
          면적
          {activeFilter === "area" ? (
            <ChevronUp size={16} strokeWidth={2.4} />
          ) : (
            <ChevronDown size={16} strokeWidth={2.4} />
          )}
        </FilterButton>

        <RegionFilter
          defaultValue={draftFilters.region}
          onSave={(selectedRegion) => {
            setDraftFilters((prev) => ({
              ...prev,
              region: selectedRegion,
            }));

            setAppliedFilters((prev) => ({
              ...prev,
              region: selectedRegion,
            }));

            onApply?.({
              ...appliedFilters,
              region: selectedRegion,
            });

            setOpenFilter(null);
          }}
        />
      </FilterItem>

      {/* 직접 입력 버튼을 눌렀을 때 화면을 어둡게 덮는 팝업입니다. */}
      {directInputConfig && (
        <DirectInputBackdrop>
          <DirectInputModal>
            <DirectInputHeader>
              <DirectInputTitle>{directInputConfig.title}</DirectInputTitle>

              <CloseButton
                type="button"
                onClick={() => setDirectInputTarget(null)}
              >
                <X size={18} />
              </CloseButton>
            </DirectInputHeader>

            <DirectInputFields>
              <DirectInputGroup>
                <DirectInputBox
                  type="text"
                  inputMode="numeric"
                  min={directInputConfig.minValue}
                  placeholder="최소"
                  value={
                    directInputConfig.unit === "원"
                      ? formatNumberInput(
                          convertWonToMan(
                            draftFilters[directInputConfig.filterKey].min
                          )
                        )
                      : formatNumberInput(
                          draftFilters[directInputConfig.filterKey].min
                        )
                  }
                  onChange={(event) =>
                    handleChangeDirectInput(
                      directInputConfig.filterKey,
                      "min",
                      event.target.value
                    )
                  }
                  onBlur={() =>
                    handleBlurDirectInput(directInputConfig.filterKey, "min")
                  }
                />

                {/* 가격 직접 입력에서는 만원 단위로 고정 표시합니다. */}
                <DirectInputUnit>
                  {directInputConfig.unit === "원"
                    ? "만"
                    : directInputConfig.unit}
                </DirectInputUnit>

                {/* 가격 직접 입력값을 읽기 좋은 억/만 단위로 표시합니다. */}
                {directInputConfig.unit === "원" && (
                  <DirectInputHint>
                    {formatDirectMoneyHint(
                      draftFilters[directInputConfig.filterKey].min
                    )}
                  </DirectInputHint>
                )}
              </DirectInputGroup>

              <span>~</span>

              <DirectInputGroup>
                <DirectInputBox
                  type="text"
                  inputMode="numeric"
                  min={directInputConfig.minValue}
                  placeholder="최대"
                  value={
                    directInputConfig.unit === "원"
                      ? formatNumberInput(
                          convertWonToMan(
                            draftFilters[directInputConfig.filterKey].max
                          )
                        )
                      : formatNumberInput(
                          draftFilters[directInputConfig.filterKey].max
                        )
                  }
                  onChange={(event) =>
                    handleChangeDirectInput(
                      directInputConfig.filterKey,
                      "max",
                      event.target.value
                    )
                  }
                  onBlur={() =>
                    handleBlurDirectInput(directInputConfig.filterKey, "max")
                  }
                />

                {/* 가격 직접 입력에서는 만원 단위로 고정 표시합니다. */}
                <DirectInputUnit>
                  {directInputConfig.unit === "원"
                    ? "만"
                    : directInputConfig.unit}
                </DirectInputUnit>

                {/* 가격 직접 입력값을 읽기 좋은 억/만 단위로 표시합니다. */}
                {directInputConfig.unit === "원" && (
                  <DirectInputHint>
                    {formatDirectMoneyHint(
                      draftFilters[directInputConfig.filterKey].max
                    )}
                  </DirectInputHint>
                )}
              </DirectInputGroup>
            </DirectInputFields>

            {/* 직접 입력값 검증 에러 메시지입니다. */}
            {directInputError && (
              <DirectInputError>{directInputError}</DirectInputError>
            )}

            <ApplyButton type="button" onClick={handleApplyDirectInput}>
              적용
            </ApplyButton>
          </DirectInputModal>
        </DirectInputBackdrop>
      )}
    </FilterWrap>
  );
}

export default Filter;
