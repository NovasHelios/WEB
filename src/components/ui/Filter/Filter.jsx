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
  DirectInputRow,
  DirectInputBox,
  RegionPath,
  RegionGrid,
  RegionButton,
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

  // 직접 입력 값을 변경합니다.
  const handleChangeDirectInput = (filterKey, side, value) => {
    // 빈 값이면 조건 없음으로 처리합니다.
    const nextValue = value === "" ? null : Number(value);

    // 직접 입력 값을 임시 필터에 반영합니다.
    setDraftFilters((prev) => ({
      ...prev,
      [filterKey]: {
        ...prev[filterKey],
        [side]: nextValue,
      },
    }));
  };

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
              <span>~1000만</span>
              <span>5000만</span>
              <span>1억</span>
              <span>5억</span>
              <span>최대</span>
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
                max="5000000"
                step="100000"
                value={draftFilters.rentPrice.max ?? 5000000}
                onChange={(event) =>
                  handleChangeRange("rentPrice", "max", event.target.value)
                }
              />
            </RangeTrack>

            <RangeLabels>
              <span>~100만</span>
              <span>200만</span>
              <span>300만</span>
              <span>400만</span>
              <span>최대</span>
            </RangeLabels>
          </RangeBlock>

          {directInputTarget === "sale" && (
            <DirectInputRow>
              <DirectInputBox
                type="number"
                placeholder="최소"
                value={draftFilters.salePrice.min ?? ""}
                onChange={(event) =>
                  handleChangeDirectInput(
                    "salePrice",
                    "min",
                    event.target.value
                  )
                }
              />
              <span>~</span>
              <DirectInputBox
                type="number"
                placeholder="최대"
                value={draftFilters.salePrice.max ?? ""}
                onChange={(event) =>
                  handleChangeDirectInput(
                    "salePrice",
                    "max",
                    event.target.value
                  )
                }
              />
            </DirectInputRow>
          )}

          {directInputTarget === "rent" && (
            <DirectInputRow>
              <DirectInputBox
                type="number"
                placeholder="최소"
                value={draftFilters.rentPrice.min ?? ""}
                onChange={(event) =>
                  handleChangeDirectInput(
                    "rentPrice",
                    "min",
                    event.target.value
                  )
                }
              />
              <span>~</span>
              <DirectInputBox
                type="number"
                placeholder="최대"
                value={draftFilters.rentPrice.max ?? ""}
                onChange={(event) =>
                  handleChangeDirectInput(
                    "rentPrice",
                    "max",
                    event.target.value
                  )
                }
              />
            </DirectInputRow>
          )}

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
                min="100"
                max="5000"
                step="100"
                value={draftFilters.area.min ?? 100}
                onChange={(event) =>
                  handleChangeRange("area", "min", event.target.value)
                }
              />
              <RangeInput
                type="range"
                min="100"
                max="5000"
                step="100"
                value={draftFilters.area.max ?? 5000}
                onChange={(event) =>
                  handleChangeRange("area", "max", event.target.value)
                }
              />
            </RangeTrack>

            <RangeLabels>
              <span>~100㎡</span>
              <span>500㎡</span>
              <span>1000㎡</span>
              <span>5000㎡</span>
              <span>최대</span>
            </RangeLabels>
          </RangeBlock>

          {directInputTarget === "area" && (
            <DirectInputRow>
              <DirectInputBox
                type="number"
                placeholder="최소"
                value={draftFilters.area.min ?? ""}
                onChange={(event) =>
                  handleChangeDirectInput("area", "min", event.target.value)
                }
              />
              <span>~</span>
              <DirectInputBox
                type="number"
                placeholder="최대"
                value={draftFilters.area.max ?? ""}
                onChange={(event) =>
                  handleChangeDirectInput("area", "max", event.target.value)
                }
              />
            </DirectInputRow>
          )}

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
    </FilterWrap>
  );
}

export default Filter;
