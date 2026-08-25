// 필터 내부 상태를 관리하기 위한 React 훅입니다.
import { useState } from "react";

// 필터 버튼 아이콘으로 사용할 아이콘입니다.
import { ChevronDown, Pencil, X } from "lucide-react";

// 필터 UI 스타일 컴포넌트입니다.
import {
  FilterWrap,
  FilterButton,
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
  RangeLabels,
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

// 서울 지역 선택 예시 목록입니다.
const seoulRegions = [
  "강남구",
  "강동구",
  "강북구",
  "중랑구",
  "강서구",
  "관악구",
  "광진구",
  "은평구",
  "구로구",
  "금천구",
  "노원구",
  "종로구",
  "도봉구",
  "동대문구",
  "동작구",
  "중구",
  "마포구",
  "서대문구",
  "서초구",
  "양천구",
  "성동구",
  "성북구",
  "송파구",
  "용산구",
  "영등포구",
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

// 금액 범위 표시 문구를 생성합니다.
const formatMoneyRangeLabel = (range, defaultMin, defaultMax) => {
  // 최소값이 없으면 기본 최소값을 사용합니다.
  const minValue = range.min ?? defaultMin;

  // 최대값이 없으면 기본 최대값을 사용합니다.
  const maxValue = range.max ?? defaultMax;

  // 두 핸들이 모두 양끝에 있으면 전체로 표시합니다.
  if (minValue === defaultMin && maxValue === defaultMax) {
    return "전체";
  }

  // 하나라도 양끝에서 벗어나면 숫자 범위로 표시합니다.
  return `${formatMoneyLabel(minValue)} ~ ${formatMoneyLabel(maxValue)}`;
};


// 숫자 면적을 필터 표시 문구로 변환합니다.
const formatAreaLabel = (value) => {
  // 값이 없으면 전체로 표시합니다.
  if (value === null || value === undefined) return "전체";

  // 제곱미터 단위로 표시합니다.
  return `${value}㎡`;
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

    // 선택한 범위 값을 변경합니다.
    setDraftFilters((prev) => {
      // 기존 범위 값을 가져옵니다.
      const currentRange = prev[filterKey];

      // 최소값 변경 시 최대값을 넘지 않도록 보정합니다.
      if (side === "min") {
        return {
          ...prev,
          [filterKey]: {
            ...currentRange,
            min:
              currentRange.max !== null
                ? Math.min(numberValue, currentRange.max)
                : numberValue,
          },
        };
      }

      // 최대값 변경 시 최소값보다 작아지지 않도록 보정합니다.
      return {
        ...prev,
        [filterKey]: {
          ...currentRange,
          max:
            currentRange.min !== null
              ? Math.max(numberValue, currentRange.min)
              : numberValue,
        },
      };
    });
  };

  // 직접 입력 숫자와 단위를 원 단위 값으로 변환합니다.
  const convertDirectInputToWon = (value, unit) => {
    // 값이 없으면 조건 없음으로 처리합니다.
    if (value === null || value === "") return null;

    // 입력값을 숫자로 변환합니다.
    const numberValue = Number(value);

    // 숫자가 아니거나 음수이면 조건 없음으로 처리합니다.
    if (Number.isNaN(numberValue) || numberValue < 0) return null;

    // 억 단위 입력이면 원 단위로 변환합니다.
    if (unit === "EOK") return numberValue * 100000000;

    // 만원 단위 입력이면 원 단위로 변환합니다.
    return numberValue * 10000;
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

    // 가격 필터는 만원 단위 입력값을 원 단위로 변환합니다.
    const wonValue =
      directInputConfig?.unit === "원"
        ? convertManToWon(numberValue)
        : numberValue;

    // 변환된 값을 임시 필터에 저장합니다.
    setDraftFilters((prev) => ({
      ...prev,
      [filterKey]: {
        ...prev[filterKey],
        [side]: wonValue,
      },
    }));
  };

  // 직접 입력으로 넣은 값을 슬라이더의 최소/최대 범위 안으로 보정합니다.
  const normalizeDirectInputRange = (range, minValue, maxValue) => {
    // 최소값이 비어 있으면 null로 유지하고, 있으면 슬라이더 범위 안으로 제한합니다.
    const nextMin =
      range.min === null
        ? null
        : Math.min(Math.max(range.min, minValue), maxValue);

    // 최대값이 비어 있으면 null로 유지하고, 있으면 슬라이더 범위 안으로 제한합니다.
    const nextMax =
      range.max === null
        ? null
        : Math.min(Math.max(range.max, minValue), maxValue);

    // 최소값과 최대값이 둘 다 있고 최소값이 더 크면 최대값을 최소값에 맞춥니다.
    if (nextMin !== null && nextMax !== null && nextMin > nextMax) {
      return {
        min: nextMin,
        max: nextMin,
      };
    }

    // 보정된 범위를 반환합니다.
    return {
      min: nextMin,
      max: nextMax,
    };
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

  // 직접 입력창에서 포커스가 빠질 때 필터별 최소값보다 작으면 최소값으로 보정합니다.
  const handleBlurDirectInput = (filterKey, side) => {
    // 현재 직접 입력 대상의 최소 허용값을 가져옵니다.
    const minValue = directInputConfig?.minValue ?? 0;

    // 입력값이 최소값보다 작으면 최소값으로 보정합니다.
    setDraftFilters((prev) => {
      const currentValue = prev[filterKey][side];

      // 값이 비어 있으면 그대로 둡니다.
      if (currentValue === null) return prev;

      return {
        ...prev,
        [filterKey]: {
          ...prev[filterKey],
          [side]: Math.max(currentValue, minValue),
        },
      };
    });
  };

  // 현재 직접 입력 대상에 맞는 설정값을 반환합니다.
  const getDirectInputConfig = () => {
    // 매매가 직접 입력 설정입니다.
    if (directInputTarget === "sale") {
      return {
        title: "매매가",
        filterKey: "salePrice",
        unit: "원",

        // 매매가 직접 입력 최소값입니다.
        minValue: 10000000,
        // 매매가 슬라이더 최대값입니다.
        maxValue: 1000000000,
      };
    }

    // 임대가 직접 입력 설정입니다.
    if (directInputTarget === "rent") {
      return {
        title: "임대가",
        filterKey: "rentPrice",
        unit: "원",

        // 임대가 직접 입력 최소값입니다.
        minValue: 1000000,
        // 임대가 슬라이더 최대값입니다.
        maxValue: 5000000,
      };
    }

    // 토지 넓이 직접 입력 설정입니다.
    if (directInputTarget === "area") {
      return {
        title: "토지 넓이",
        filterKey: "area",
        unit: "㎡",

        // 토지 넓이 직접 입력 최소값입니다.
        minValue: 1,
      };
    }

    // 직접 입력 대상이 없으면 null을 반환합니다.
    return null;
  };

  // 현재 열려 있는 직접 입력 팝업 설정입니다.
  const directInputConfig = getDirectInputConfig();

  return (
    <FilterWrap>
      {/* 거래 유형 필터 버튼입니다. */}
      <FilterButton type="button" onClick={() => handleToggleFilter("type")}>
        거래 유형
        <ChevronDown size={16} strokeWidth={2.4} />
      </FilterButton>

      {/* 지역 선택 필터 버튼입니다. */}
      <FilterButton type="button" onClick={() => handleToggleFilter("region")}>
        지역 선택
        <ChevronDown size={16} strokeWidth={2.4} />
      </FilterButton>

      {/* 금액 필터 버튼입니다. */}
      <FilterButton type="button" onClick={() => handleToggleFilter("price")}>
        금액
        <ChevronDown size={16} strokeWidth={2.4} />
      </FilterButton>

      {/* 토지 크기 필터 버튼입니다. */}
      <FilterButton type="button" onClick={() => handleToggleFilter("area")}>
        토지 크기
        <ChevronDown size={16} strokeWidth={2.4} />
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
            적용
          </ApplyButton>
        </DropdownPanel>
      )}

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
            적용
          </ApplyButton>
        </DropdownPanel>
      )}

      {/* 금액 필터 패널입니다. */}
      {activeFilter === "price" && (
        <DropdownPanel $width="452px">
          <RangeBlock>
            <RangeTitleRow>
              <span>매매가</span>
              <RangeValueText>
                {formatMoneyRangeLabel(
                  // 현재 선택 중인 매매가 범위입니다.
                  draftFilters.salePrice,

                  // 매매가 슬라이더의 기본 최소값입니다.
                  10000000,

                  // 매매가 슬라이더의 기본 최대값입니다.
                  1000000000
                )}
              </RangeValueText>
              <button
                type="button"
                onClick={() => setDirectInputTarget("sale")}
              >
                <Pencil size={16} />
              </button>
            </RangeTitleRow>

            <RangeTrack>
              <RangeInput
                // 최소 매매가 핸들입니다.
                $isMin
                type="range"
                min="10000000"
                max="1000000000"
                step="10000000"
                value={draftFilters.salePrice.min ?? 10000000}
                onChange={(event) =>
                  handleChangeRange("salePrice", "min", event.target.value)
                }
              />

              <RangeInput
                // 최대 매매가 핸들입니다.
                type="range"
                min="10000000"
                max="1000000000"
                step="10000000"
                value={draftFilters.salePrice.max ?? 1000000000}
                onChange={(event) =>
                  handleChangeRange("salePrice", "max", event.target.value)
                }
              />
            </RangeTrack>

            <RangeLabels>
              <span>1000만</span>
              <span>10억</span>
            </RangeLabels>
          </RangeBlock>

          <RangeBlock>
            <RangeTitleRow>
              <span>임대가</span>
              <RangeValueText>
                {formatMoneyRangeLabel(
                  draftFilters.rentPrice,
                  1000000,
                  5000000
                )}
              </RangeValueText>
              <button
                type="button"
                onClick={() => setDirectInputTarget("rent")}
              >
                <Pencil size={16} />
              </button>
            </RangeTitleRow>

            <RangeTrack>
              <RangeInput
                // 최소 임대가 핸들입니다.
                $isMin
                type="range"
                min="1000000"
                max="5000000"
                step="100000"
                value={draftFilters.rentPrice.min ?? 1000000}
                onChange={(event) =>
                  handleChangeRange("rentPrice", "min", event.target.value)
                }
              />

              <RangeInput
                // 최대 임대가 핸들입니다.
                type="range"
                min="1000000"
                max="10000000"
                step="100000"
                value={draftFilters.rentPrice.max ?? 10000000}
                onChange={(event) =>
                  handleChangeRange("rentPrice", "max", event.target.value)
                }
              />
            </RangeTrack>

            <RangeLabels>
              <span>100만</span>
              <span>1000만</span>
            </RangeLabels>
          </RangeBlock>

          <ActionRow>
            <ApplyButton type="button" onClick={handleApply}>
              저장
            </ApplyButton>
            <ApplyButton
              type="button"
              onClick={() => setDirectInputTarget("sale")}
            >
              가격 직접 입력
            </ApplyButton>
          </ActionRow>
        </DropdownPanel>
      )}

      {/* 토지 크기 필터 패널입니다. */}
      {activeFilter === "area" && (
        <DropdownPanel $width="452px">
          <RangeBlock>
            <RangeTitleRow>
              <span>토지 넓이</span>
              <RangeValueText>
                {draftFilters.area.min === null &&
                draftFilters.area.max === null
                  ? "전체"
                  : `${formatAreaLabel(
                      draftFilters.area.min
                    )} ~ ${formatAreaLabel(draftFilters.area.max)}`}
              </RangeValueText>
              <button
                type="button"
                onClick={() => setDirectInputTarget("area")}
              >
                <Pencil size={16} />
              </button>
            </RangeTitleRow>

            <RangeTrack>
              <RangeInput
                type="range"
                min="1"
                max="5000"
                step="100"
                value={draftFilters.area.min ?? 100}
                onChange={(event) =>
                  handleChangeRange("area", "min", event.target.value)
                }
              />
              <RangeInput
                type="range"
                min="1"
                max="5000"
                step="100"
                value={draftFilters.area.max ?? 5000}
                onChange={(event) =>
                  handleChangeRange("area", "max", event.target.value)
                }
              />
            </RangeTrack>

            <RangeLabels>
              <span>~1㎡</span>
              <span>500㎡</span>
              <span>1000㎡</span>
              <span>5000㎡</span>
              <span>최대</span>
            </RangeLabels>
          </RangeBlock>

          <ActionRow>
            <ApplyButton type="button" onClick={handleApply}>
              저장
            </ApplyButton>
            <ApplyButton
              type="button"
              onClick={() => setDirectInputTarget("area")}
            >
              가격 직접 입력
            </ApplyButton>
          </ActionRow>
        </DropdownPanel>
      )}

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
