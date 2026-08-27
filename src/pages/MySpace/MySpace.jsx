import { ChevronDown, CalendarDays, Heart, MapPinned, MoreVertical, Plus, Shapes, SquarePen, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/layout/box/NavBar";
import {
  SpaceActionButton,
  SpaceActionColumn,
  SpaceBadge,
  SpaceBadgeRow,
  SpaceCard,
  SpaceCardFooter,
  SpaceCardHeader,
  SpaceCardImage,
  SpaceCardMeta,
  SpaceCardMetaItem,
  SpaceCardMetaLabel,
  SpaceCardMetaValue,
  SpaceCardRow,
  SpaceContainer,
  SpaceFilterButton,
  SpaceFilterGroup,
  SpaceHeader,
  SpaceInfoRow,
  SpaceInner,
  SpaceMain,
  SpacePage,
  SpaceSortBar,
  SpaceStatText,
  SpaceTitle,
  SpaceTopAction,
  SpaceTopNote,
  SpaceTopRow,
  SpaceToolbar,
  SpaceWrapper,
} from "./MySpace.styles";

const spaceItems = [
  {
    id: 1,
    title: "경기도 안성시 일죽면 산북리 123",
    type: "전",
    region: "계획관리지역",
    area: "2,023평 (6,689㎡)",
    date: "2024.05.24",
    tradeType: "매매",
    price: "15억원",
    likes: 8,
    accent: ["#cfe9a5", "#7fb96c"],
  },
  {
    id: 2,
    title: "충청남도 서산시 성연면 에더리 456",
    type: "답",
    region: "생산관리지역",
    area: "1,542평 (5,100㎡)",
    date: "2024.05.10",
    tradeType: "매매",
    price: "12억원",
    likes: 5,
    accent: ["#b9e0ff", "#79aedd"],
  },
  {
    id: 3,
    title: "전라북도 정읍시 북면 신평리 789",
    type: "임야",
    region: "보전관리지역",
    area: "3,210평 (10,612㎡)",
    date: "2024.04.28",
    tradeType: "매매",
    price: "18억원",
    likes: 2,
    accent: ["#d9e5cf", "#a2b18b"],
  },
];

function MySpace() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [activeFilter, setActiveFilter] = useState("전체 상태");
  const [activeSort, setActiveSort] = useState("최신 등록순");

  const totalCount = useMemo(() => spaceItems.length, []);

  return (
    <SpaceWrapper>
      {/* 상단 네비게이션 */}
      <div className="relative z-30">
        <NavBar
          onToggleSidebar={() => {}}
          keyword={keyword}
          onChangeKeyword={setKeyword}
          onSearch={() => navigate(`/land?keyword=${encodeURIComponent(keyword)}`)}
          isSuggestionOpen={false}
          regionSuggestions={[]}
        />
      </div>

      {/* 본문 영역 */}
      <SpaceMain>
        <SpacePage>
          <SpaceInner>
            <SpaceHeader>
              <div>
                <SpaceTitle>내 공간</SpaceTitle>
                <SpaceTopNote>내가 등록한 토지 목록과 현황을 확인할 수 있습니다.</SpaceTopNote>
              </div>

              <SpaceTopRow>
                <SpaceStatText>
                  총 <strong>{totalCount}</strong>건의 토지를 등록하셨습니다.
                </SpaceStatText>

                <SpaceTopAction type="button" onClick={() => navigate("/land/register")}>
                  <Plus size={18} strokeWidth={2.6} />
                  토지 등록하기
                </SpaceTopAction>
              </SpaceTopRow>
            </SpaceHeader>

            <SpaceToolbar>
              <SpaceFilterGroup>
                {/* 상태 필터 */}
                {["전체 상태", "등록 완료", "검토 중"].map((label) => (
                  <SpaceFilterButton
                    key={label}
                    type="button"
                    $active={activeFilter === label}
                    onClick={() => setActiveFilter(label)}
                  >
                    {label}
                    <ChevronDown size={16} strokeWidth={2.5} />
                  </SpaceFilterButton>
                ))}
              </SpaceFilterGroup>

              <SpaceSortBar>
                <SpaceStatText>
                  <strong>총 {totalCount}건</strong>
                </SpaceStatText>
                {/* 정렬 선택 */}
                <SpaceFilterButton
                  type="button"
                  $active={false}
                  onClick={() =>
                    setActiveSort((prev) =>
                      prev === "최신 등록순" ? "가격 높은 순" : "최신 등록순"
                    )
                  }
                >
                  {activeSort}
                  <ChevronDown size={16} strokeWidth={2.5} />
                </SpaceFilterButton>
              </SpaceSortBar>
            </SpaceToolbar>

            <SpaceContainer>
              {spaceItems.map((item) => (
                <SpaceCard key={item.id}>
                  <SpaceCardRow>
                    <SpaceCardImage $accent={item.accent}>
                      <span>{item.type}</span>
                    </SpaceCardImage>

                    <div className="flex flex-col flex-1 min-w-0 gap-4">
                      <SpaceCardHeader>
                        <div className="min-w-0">
                          <h3>{item.title}</h3>
                          <SpaceBadgeRow>
                            <SpaceBadge>{item.type}</SpaceBadge>
                            <SpaceBadge>{item.region}</SpaceBadge>
                          </SpaceBadgeRow>
                        </div>

                        <button type="button" aria-label="더보기" className="text-[#6d6a5f]">
                          <MoreVertical size={22} strokeWidth={2.4} />
                        </button>
                      </SpaceCardHeader>

                      <SpaceCardMeta>
                        <SpaceCardMetaItem>
                          <SpaceCardMetaLabel>
                            <Shapes size={14} strokeWidth={2.2} />
                            면적
                          </SpaceCardMetaLabel>
                          <SpaceCardMetaValue>{item.area}</SpaceCardMetaValue>
                        </SpaceCardMetaItem>

                        <SpaceCardMetaItem>
                          <SpaceCardMetaLabel>
                            <CalendarDays size={14} strokeWidth={2.2} />
                            등록일
                          </SpaceCardMetaLabel>
                          <SpaceCardMetaValue>{item.date}</SpaceCardMetaValue>
                        </SpaceCardMetaItem>
                      </SpaceCardMeta>

                      <SpaceInfoRow>
                        <div>
                          <SpaceCardMetaLabel>거래 방식</SpaceCardMetaLabel>
                          <SpaceCardMetaValue>{item.tradeType}</SpaceCardMetaValue>
                        </div>
                        <div>
                          <SpaceCardMetaLabel>희망 가격</SpaceCardMetaLabel>
                          <SpaceCardMetaValue $highlight>{item.price}</SpaceCardMetaValue>
                        </div>
                      </SpaceInfoRow>

                      <SpaceCardFooter>
                        <span className="inline-flex items-center gap-1 text-[#6a6458]">
                          <Heart size={16} strokeWidth={2.2} />
                          {item.likes}
                        </span>
                      </SpaceCardFooter>
                    </div>

                    <SpaceActionColumn>
                      {/* 카드별 액션 버튼 */}
                      <SpaceActionButton type="button">토지 상세 보기</SpaceActionButton>
                      <SpaceActionButton type="button" $secondary>
                        <SquarePen size={15} strokeWidth={2.4} />
                        수정
                      </SpaceActionButton>
                      <SpaceActionButton type="button" $danger>
                        <Trash2 size={15} strokeWidth={2.4} />
                        삭제
                      </SpaceActionButton>
                    </SpaceActionColumn>
                  </SpaceCardRow>
                </SpaceCard>
              ))}
            </SpaceContainer>
          </SpaceInner>
        </SpacePage>
      </SpaceMain>
    </SpaceWrapper>
  );
}

export default MySpace;
