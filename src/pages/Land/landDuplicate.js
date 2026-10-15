// 로그인한 사용자의 토지 목록으로 중복 등록을 확인하는 공통 API 도구입니다.
import { Api } from "@/contents/apiEndpoints";
import { authFetch } from "@/lib/auth";
import { readApiResponse } from "@/utils/apiResponse";
import { withRequestTimeout } from "@/utils/asyncRequests";

// 주소 안내와 최종 등록 오류에서 동일한 중복 안내 문구를 사용합니다.
export const DUPLICATE_LAND_MESSAGE = "같은 유저가 동일한 토지를 등록할 수 없습니다.";

// 중복 확인에 실패하면 확인되지 않은 주소로 등록을 진행하지 않습니다.
const CHECK_FAILED_MESSAGE = "중복 등록 여부를 확인하지 못했습니다. 잠시 후 다시 검색해주세요.";

// 주소의 시도 축약명과 변경 전 이름을 현재 정식 이름으로 통일합니다.
const SIDO_ALIASES = {
  서울: "서울특별시", 부산: "부산광역시", 대구: "대구광역시",
  인천: "인천광역시", 광주: "광주광역시", 대전: "대전광역시",
  울산: "울산광역시", 세종: "세종특별자치시", 경기: "경기도",
  강원: "강원특별자치도", 강원도: "강원특별자치도",
  충북: "충청북도", 충남: "충청남도", 전북: "전북특별자치도",
  전라북도: "전북특별자치도", 전남: "전라남도",
  경북: "경상북도", 경남: "경상남도", 제주: "제주특별자치도", 제주도: "제주특별자치도",
};

// 동일한 주소의 공백과 시도 표기 차이만 제거하고 지번·산 여부는 유지합니다.
const normalizeAddress = (value) => {
  // 주소가 아닌 응답 필드는 비교에서 제외합니다.
  if (typeof value !== "string" || !value.trim()) return "";

  // 첫 주소 단어의 시도명을 정규화한 뒤 공백 차이를 제거합니다.
  const words = value.trim().split(/\s+/);
  words[0] = SIDO_ALIASES[words[0]] || words[0];
  return words.join("");
};

// 지번 주소와 도로명 주소를 함께 비교해 입력 방식에 따른 중복을 확인합니다.
const getAddressCandidates = (land) => [
  land?.address, land?.confirmedAddress, land?.roadAddress,
  land?.confirmedRoadAddress, land?.addressName, land?.refinedAddress,
].map(normalizeAddress).filter(Boolean);

// 실제 필지 번호가 같거나 정규화된 주소가 같으면 동일한 토지로 판별합니다.
export const isSameRegisteredLand = (registeredLand, candidate) => {
  // 공공 데이터의 불완전한 지역 코드는 제외하고 19자리 PNU만 비교합니다.
  const pnu = String(candidate?.pnu || "").trim();
  if (/^\d{19}$/.test(pnu) && pnu === String(registeredLand?.pnu || "").trim()) return true;

  // 두 토지의 지번·도로명 주소 중 하나라도 같으면 중복으로 처리합니다.
  const addresses = new Set(getAddressCandidates(candidate));
  return getAddressCandidates(registeredLand).some((address) => addresses.has(address));
};

// 사전 확인 오류와 서버의 중복 등록 응답을 같은 안내로 처리합니다.
export const isDuplicateLandError = (error) => {
  // 토지 등록의 충돌 응답과 명시적인 중복 오류를 우선 확인합니다.
  if (error?.code === "DUPLICATE_LAND" || error?.status === 409) return true;

  // 서버가 다른 상태 코드로 중복 사유를 반환하는 경우도 지원합니다.
  return /(?:동일|같은).*(?:토지|주소)|(?:토지|주소).*(?:이미|중복)|이미.*등록|중복.*등록|duplicate|already.*(?:registered|exists)/i
    .test(String(error?.message || ""));
};

// 다른 사용자의 토지는 조회하지 않고 현재 인증 사용자의 목록만 검사합니다.
export const assertLandNotRegistered = async (candidate) => {
  try {
    // 여러 페이지와 응답 본문 처리까지 포함해 기존 15초 요청 제한을 적용합니다.
    await withRequestTimeout(async (signal) => {
      // 페이지 형식 응답이면 마지막 페이지까지 확인해 누락된 중복을 방지합니다.
      for (let page = 0; ; page += 1) {
        // 첫 조회는 기존 내 토지 API 경로를 그대로 사용합니다.
        const url = page === 0 ? Api.MyLands : `${Api.MyLands}?page=${page}`;
        const response = await authFetch(url, { method: "GET", signal });
        const payload = await readApiResponse(response, CHECK_FAILED_MESSAGE);

        // HTTP 성공이어도 API가 실패 상태를 반환했다면 검증을 통과시키지 않습니다.
        if (payload?.status === -1 || payload?.success === false) throw new Error(CHECK_FAILED_MESSAGE);

        // 기존 내 토지 화면이 지원하는 배열·래퍼·페이지 응답을 모두 처리합니다.
        const container = payload?.data ?? payload?.result ?? payload;
        const lands = [container, container?.content, container?.result, payload?.content]
          .find(Array.isArray);
        if (!lands) throw new Error(CHECK_FAILED_MESSAGE);

        // 현재 사용자가 이미 등록한 필지 또는 주소가 있으면 중복 오류를 발생시킵니다.
        if (lands.some((land) => isSameRegisteredLand(land, candidate))) {
          const error = new Error(DUPLICATE_LAND_MESSAGE);
          error.code = "DUPLICATE_LAND";
          throw error;
        }

        // 단일 배열 응답은 목록 전체이므로 추가 페이지를 요청하지 않습니다.
        if (Array.isArray(container)) return;

        // 페이지 번호가 반복되면 중복 확인이 완료됐다고 잘못 판단하지 않습니다.
        const metadata = container?.page ?? container;
        if (Number.isInteger(metadata?.number) && metadata.number !== page) throw new Error(CHECK_FAILED_MESSAGE);

        // 페이지 정보에 다음 페이지가 없다면 중복 검증을 완료합니다.
        const hasNextPage = metadata?.last === false ||
          (Number.isInteger(metadata?.totalPages) && page + 1 < metadata.totalPages);
        if (!hasNextPage) return;

        // 비정상적인 빈 페이지 반복이나 요청 제한 초과는 검증 실패로 처리합니다.
        if (!lands.length || signal.aborted) throw new Error(CHECK_FAILED_MESSAGE);
      }
    });
  } catch (error) {
    // 중복 사유는 그대로 유지하고 조회 실패는 재확인 안내로 통일합니다.
    if (error?.code === "DUPLICATE_LAND") throw error;
    throw new Error(CHECK_FAILED_MESSAGE);
  }
};
