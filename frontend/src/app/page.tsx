"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format, parse } from "date-fns";
import CompetitionModal from "./components/CompetitionModal";

// 데이터 타입 정의
interface AptData {
  HOUSE_MANAGE_NO: string; // 주택관리번호
  PBLANC_NO: string; // 공고번호
  HOUSE_NM: string; // 주택명
  HOUSE_SECD_NM: string; // 주택구분명
  HSSPLY_ADRES: string; // 공급위치
  TOT_SUPLY_HSHLDCO: number; // 공급규모
  RCRIT_PBLANC_DE: string; // 모집공고일
  RCEPT_BGNDE: string; // 청약접수시작일
  RCEPT_ENDDE: string; // 청약접수종료일
  PRZWNER_PRESNATN_DE: string; // 당첨자발표일
  CNTRCT_CNCLS_BGNDE: string; // 계약시작일
  CNTRCT_CNCLS_ENDDE: string; // 계약종료일
  HMPG_ADRES: string; // 홈페이지주소
  PBLANC_URL: string; // 모집공고문 URL 고유링크
}

export default function Home() {
  const [aptList, setAptList] = useState<AptData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 내부 모달 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHouseManageNo, setSelectedHouseManageNo] = useState("");
  const [selectedPblancNo, setSelectedPblancNo] = useState("");
  const [selectedHouseNm, setSelectedHouseNm] = useState("");

  // 필터 상태
  const [selectedRegion, setSelectedRegion] = useState<string>("전체");
  const [selectedStatus, setSelectedStatus] = useState<string>("전체");

  const regions = ["전체", "서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
  const statuses = ["전체", "접수예정", "접수중", "접수마감"];

  useEffect(() => {
    const fetchAptData = async () => {
      try {
        setLoading(true);
        // API 요청 시 더 많은 데이터를 가져와서 필터링 테스트
        const response = await axios.get("/api/apt?page=1&perPage=50");
        setAptList(response.data.data || []);
      } catch (err) {
        setError("데이터를 불러오지 못했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAptData();
  }, []);

  // 날짜 포맷 변환 함수
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());
      return format(parsedDate, "M월 d일");
    } catch {
      return dateString;
    }
  };

  // 오늘 날짜 기준으로 상태 확인 함수
  const getStatus = (bgnde: string, endde: string) => {
    if (!bgnde || !endde) return "알수없음";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = parse(bgnde, "yyyy-MM-dd", new Date());
    const endDate = parse(endde, "yyyy-MM-dd", new Date());
    
    if (today < startDate) return "접수예정";
    if (today >= startDate && today <= endDate) return "접수중";
    return "접수마감";
  };

  // 필터링 적용된 목록
  const filteredAptList = aptList.filter((apt) => {
    const matchRegion = selectedRegion === "전체" || apt.HSSPLY_ADRES.startsWith(selectedRegion);
    const matchStatus = selectedStatus === "전체" || getStatus(apt.RCEPT_BGNDE, apt.RCEPT_ENDDE) === selectedStatus;
    return matchRegion && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-800 mb-2 tracking-tight">
            🏢 한눈에 보는 청약홈
          </h1>
          <p className="text-gray-500 text-lg">
            복잡한 아파트 청약 공고, 요약된 정보로 쉽고 빠르게 확인하세요.
          </p>
        </header>

        {/* 필터 영역 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3">📍 지역 필터</h3>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    selectedRegion === region
                      ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3">⏳ 진행 상태</h3>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    selectedStatus === status
                      ? "bg-green-500 text-white shadow-md hover:bg-green-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md shadow-sm">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {filteredAptList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAptList.map((apt) => (
                  <div
                    key={`${apt.HOUSE_MANAGE_NO}-${apt.PBLANC_NO}`}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col h-full"
                  >
                    {/* 카드 헤더: 아파트 이름 및 위치 */}
                    <div className="p-6 border-b border-gray-50 flex-grow">
                      <div className="flex justify-between items-start mb-3">
                        <span className="flex items-center gap-2">
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                            {apt.HOUSE_SECD_NM}
                          </span>
                          <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${
                            getStatus(apt.RCEPT_BGNDE, apt.RCEPT_ENDDE) === '접수중' 
                              ? 'bg-green-100 text-green-700' 
                              : getStatus(apt.RCEPT_BGNDE, apt.RCEPT_ENDDE) === '접수예정'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {getStatus(apt.RCEPT_BGNDE, apt.RCEPT_ENDDE)}
                          </span>
                        </span>
                        <span className="text-gray-400 text-xs font-medium">
                          공고일: {formatDate(apt.RCRIT_PBLANC_DE)}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                        {apt.HOUSE_NM}
                      </h2>
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                        📍 {apt.HSSPLY_ADRES}
                      </p>
                    </div>

                {/* 카드 본문: 핵심 일정 및 정보 */}
                <div className="p-6 bg-gray-50 flex-col gap-3 text-sm">
                  <div className="flex justify-between items-center mb-2 px-1">
                    <span className="text-gray-500 font-medium">공급규모</span>
                    <span className="font-bold text-gray-800">
                      {apt.TOT_SUPLY_HSHLDCO}세대
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2 px-1">
                    <span className="text-gray-500 font-medium">접수기간</span>
                    <span className="font-semibold text-blue-600">
                      {formatDate(apt.RCEPT_BGNDE)} ~{" "}
                      {formatDate(apt.RCEPT_ENDDE)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-gray-500 font-medium">당첨자발표</span>
                    <span className="font-bold text-red-500">
                      {formatDate(apt.PRZWNER_PRESNATN_DE)}
                    </span>
                  </div>
                </div>

                {/* 카드 푸터: 버튼 (가로 4구획 아이콘/텍스트 조합) */}
                <div className="p-4 border-t border-gray-100 bg-white grid grid-cols-4 gap-3 text-sm h-16">
                  <a
                    href={`https://map.naver.com/v5/search/${encodeURIComponent(apt.HSSPLY_ADRES)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center items-center bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors shadow-sm"
                    title="네이버 지도"
                  >
                    <img 
                      src="https://play-lh.googleusercontent.com/URf_NsdR_zz2jAQFWHQf2ArOPdAa7n0Exolkm0h4ydFvmUMxG4puOam19EahHIge16Ojl0_jNRnoH1LRVad_SQ=w128-h128-rw" 
                      alt="네이버 지도" 
                      className="w-8 h-8 rounded-full drop-shadow-sm" 
                    />
                  </a>

                  <a
                    href={`https://hogangnono.com/search?q=${encodeURIComponent(apt.HOUSE_NM)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center items-center bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors shadow-sm"
                    title="호갱노노"
                  >
                    <img 
                      src="https://play-lh.googleusercontent.com/SVBA_QKH_stGx_cEl6vephaNWSkI50jKIWJTgSJ2lMTwlGegxNUPJ1JvMF2by0prSy3avwo4oD0WydHAM0uddQ=w128-h128-rw" 
                      alt="호갱노노" 
                      className="w-8 h-8 rounded-lg drop-shadow-sm" 
                    />
                  </a>

                  {apt.PBLANC_URL ? (
                    <a
                      href={apt.PBLANC_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex justify-center items-center bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors shadow-sm"
                      title="청약홈 모집공고"
                    >
                      <img 
                        src="https://play-lh.googleusercontent.com/pyYprNsdXNvI2gqfAgCEKWVJM55IW0zHUbytV-QuWl1MIL8Nr5nCtKSsXYsnQUbVzw=w128-h128-rw" 
                        alt="청약홈" 
                        className="w-8 h-8 rounded-lg drop-shadow-sm" 
                      />
                    </a>
                  ) : (
                    <button
                      disabled
                      className="flex justify-center items-center bg-gray-50 text-gray-300 font-medium rounded-xl cursor-not-allowed border border-gray-100"
                      title="공고문 없음"
                    >
                      <span className="text-[10px]">공고 없음</span>
                    </button>
                  )}

                  {apt.HMPG_ADRES ? (
                    <a
                      href={apt.HMPG_ADRES.startsWith("http") ? apt.HMPG_ADRES : `https://${apt.HMPG_ADRES}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex justify-center items-center bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 transition-colors shadow-sm text-sm"
                      title="공식 홈페이지"
                    >
                      공홈
                    </a>
                  ) : (
                    <button
                      disabled
                      className="flex justify-center items-center bg-gray-100 text-gray-400 font-bold rounded-xl cursor-not-allowed border border-gray-200 text-sm"
                    >
                      없음
                    </button>
                  )}
                </div>

                {/* 경쟁률 버튼 추가 (임시 보류)
                <div className="px-4 pb-4 bg-white">
                  <button
                    onClick={() => {
                      setSelectedHouseManageNo(apt.HOUSE_MANAGE_NO);
                      setSelectedPblancNo(apt.PBLANC_NO);
                      setSelectedHouseNm(apt.HOUSE_NM);
                      setIsModalOpen(true);
                    }}
                    className="w-full flex justify-center items-center gap-2 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl transition-colors border border-blue-100"
                  >
                    📊 경쟁률 보기
                  </button>
                </div>
                */}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <span className="text-4xl mb-4">🔍</span>
            <p className="text-lg text-gray-500 font-medium tracking-tight">조건에 맞는 청약 정보가 없습니다.</p>
            <p className="text-sm text-gray-400 mt-2">다른 지역이나 상태를 선택해 보세요.</p>
          </div>
        )}
          </>
        )}
      </div>

      {/* <CompetitionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        houseManageNo={selectedHouseManageNo}
        pblancNo={selectedPblancNo}
        houseNm={selectedHouseNm}
      /> */}
    </div>
  );
}
