import { Clock } from "lucide-react";
import { Popover } from "radix-ui";
import { useEffect, useRef } from "react";
import styled from "styled-components";

// 상담 시간 입력값이 24시간 형식인지 공통으로 확인합니다.
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

// 입력 시간이 시작·종료 시간의 배타적 범위 안에 있는지 확인합니다.
const isTimeInRange = (time, minExclusive, maxExclusive) => (
  TIME_PATTERN.test(time)
  && (!TIME_PATTERN.test(minExclusive || "") || time > minExclusive)
  && (!TIME_PATTERN.test(maxExclusive || "") || time < maxExclusive)
);

// 기본 시간 팝업 대신 사이트 색상을 사용하는 입력창과 선택창입니다.
const InputGroup = styled.div`
  display: flex; align-items: center; width: 9rem; min-width: 0;
  border: 1px solid #ded5c8; border-radius: 0.75rem; background: #fffdfb;
  &:focus-within { border-color: #b58a15; box-shadow: 0 0 0 3px #d6a81b20; }
  input { width: 100%; min-width: 0; border: 0; outline: 0; background: transparent;
    padding: 0.75rem; color: #2c2925; font: inherit; font-variant-numeric: tabular-nums; }
  button { display: grid; place-items: center; padding: 0.6rem; margin-right: 0.25rem;
    border: 0; border-radius: 0.5rem; background: transparent; color: #936e00; cursor: pointer; }
  button:hover { background: #f6edcf; }
  button:focus-visible { outline: 2px solid #936e00; }
  &:has(:disabled) { opacity: 0.55; }
`;

const Picker = styled(Popover.Content)`
  z-index: 100; width: min(17rem, calc(100vw - 2rem)); box-sizing: border-box;
  padding: 1rem; border: 1px solid #e5dac2; border-radius: 1rem;
  background: #fffdf8; color: #3d372f; box-shadow: 0 10px 30px #53421c24;
  h4 { margin: 0 0 0.5rem; font-size: 0.95rem; }
  p { margin: 0 0 0.75rem; color: #81786c; font-size: 0.75rem; }
  .columns { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .label { text-align: center; font-size: 0.8rem; margin-bottom: 0.4rem; }
  .options { height: 12rem; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; scrollbar-color: #d8c99f transparent; }
  button { font: inherit; cursor: pointer; border: 0; }
  .option { display: block; width: 100%; padding: 0.5rem; border-radius: 0.5rem; background: transparent; color: #645b4a; }
  .option:hover { background: #f6efdd; }
  .option[aria-pressed="true"] { background: #f3e5b8; color: #7b5b00; font-weight: 700; }
  /* 선택할 수 없는 시간은 흐리게 표시하고 클릭을 막습니다. */
  .option:disabled { opacity: 0.35; cursor: not-allowed; }
  .option:disabled:hover { background: transparent; }
  button:focus-visible { outline: 2px solid #ad8410; outline-offset: -2px; }
  .done { width: 100%; margin-top: 0.75rem; padding: 0.6rem; border-radius: 0.6rem; background: #936e00; color: white; }
`;

export default function BusinessTimePicker({
  value,
  onChange,
  label,
  disabled,
  minExclusive,
  maxExclusive,
}) {
  // 현재 입력값의 형식과 선택 가능한 시간 범위를 함께 확인합니다.
  const valid = TIME_PATTERN.test(value);
  const rangeValid = isTimeInRange(value, minExclusive, maxExclusive);
  const [hour, minute] = valid ? value.split(":") : ["09", "00"];
  // 직접 입력이 잘못되었을 때 복원할 마지막 정상 시간을 보관합니다.
  const lastValidValueRef = useRef(rangeValid ? value : "");

  useEffect(() => {
    // 정상 범위에 있는 값만 복원 기준값으로 갱신합니다.
    if (rangeValid) lastValidValueRef.current = value;
  }, [rangeValid, value]);

  // 시 또는 분을 선택했을 때 범위 안에서 적용 가능한 최종 시간을 찾습니다.
  const getSelectableTime = (name, part) => {
    if (name === "분") {
      const candidate = `${hour}:${part}`;
      return isTimeInRange(candidate, minExclusive, maxExclusive) ? candidate : "";
    }

    // 현재 분이 제한에 걸리면 같은 시각대에서 선택 가능한 첫 분을 사용합니다.
    const minuteCandidates = [minute, ...Array.from({ length: 60 }, (_, index) => String(index).padStart(2, "0"))];
    return minuteCandidates
      .map((candidateMinute) => `${part}:${candidateMinute}`)
      .find((candidate) => isTimeInRange(candidate, minExclusive, maxExclusive)) || "";
  };

  // 직접 입력한 값이 잘못된 경우 입력을 마칠 때 직전 정상값으로 복구합니다.
  const handleInputBlur = () => {
    if (!rangeValid && lastValidValueRef.current) onChange(lastValidValueRef.current);
  };

  return <Popover.Root>
    <InputGroup>
      <input aria-label={label} value={value} placeholder="09:00" maxLength={5}
        disabled={disabled} aria-invalid={!rangeValid} title="종료 시간은 시작 시간보다 늦어야 합니다."
        onChange={(event) => onChange(event.target.value)} onBlur={handleInputBlur} />
      <Popover.Trigger asChild>
        <button type="button" disabled={disabled} aria-label={`${label} 선택`}><Clock size={18} /></button>
      </Popover.Trigger>
    </InputGroup>
    <Popover.Portal>
      <Picker sideOffset={8} collisionPadding={16} aria-label={`${label} 선택`}>
        <h4>{label}</h4><p>24시간 기준 · 직접 입력도 가능해요</p>
        <div className="columns">
          {[{ name: "시", count: 24, selected: hour }, { name: "분", count: 60, selected: minute }].map(({ name, count, selected }) => (
            <div key={name}>
              <div className="label">{name}</div>
              <div className="options" role="group" aria-label={name}>
                {Array.from({ length: count }, (_, index) => {
                  const part = String(index).padStart(2, "0");
                  // 현재 시간 범위에서 선택 가능한 시·분 조합을 계산합니다.
                  const selectableTime = getSelectableTime(name, part);
                  return <button className="option" type="button" key={part} disabled={disabled || !selectableTime}
                    // 선택한 시간이 목록 안에서 보이도록 해당 열만 스크롤합니다.
                    ref={(node) => {
                      if (node && selected === part) node.parentElement.scrollTop = node.offsetTop - node.parentElement.offsetTop - 64;
                    }}
                    aria-label={`${part}${name}`} aria-pressed={selected === part}
                    onClick={() => onChange(selectableTime)}>{part}</button>;
                })}
              </div>
            </div>
          ))}
        </div>
        <Popover.Close asChild><button type="button" className="done">확인</button></Popover.Close>
      </Picker>
    </Popover.Portal>
  </Popover.Root>;
}
