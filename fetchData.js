// 이 코드는 공공데이터포털(data.go.kr)에서 청약홈 아파트 분양 정보 데이터를 가져오는 코드입니다.

// 1. 발급받은 API 인증키를 여기에 넣으세요.
const API_KEY = "8aaaa2f4d64deaf78ccb7bbdd6c696bd8c443bf376b1d71fe7209e01ee29cf4d"; 

// 2. 데이터를 가져올 페이지 번호와 한 번에 가져올 개수
const page = 1;
const perPage = 10;

// 3. API 요청 주소 조립
const url = `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail?page=${page}&perPage=${perPage}&serviceKey=${API_KEY}`;

// 4. 데이터를 가져오는 함수 (비동기 처리)
async function fetchAptData() {
  console.log("데이터를 가져오는 중입니다...");
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // 가져온 데이터를 화면에 예쁘게 출력
    console.log("\n=== 🏢 청약홈 아파트 분양공고 요약 ===");
    
    if (data.data && data.data.length > 0) {
      data.data.forEach((apt, index) => {
        console.log(`\n[${index + 1}] ${apt.HOUSE_NM} (${apt.HSSPLY_ADRES})`);
        console.log(`   - 모집공고일: ${apt.RCRIT_PBLANC_DE}`);
        console.log(`   - 당첨자발표일: ${apt.PRZWNER_PRESNATN_DE}`);
        console.log(`   - 공급규모: ${apt.TOT_SUPLY_HSHLDCO}세대`);
      });
    } else {
      console.log("조회된 데이터가 없습니다. (또는 API 키가 잘못되었습니다.)");
    }
  } catch (error) {
    console.error("데이터를 가져오는 중 에러가 발생했습니다:", error);
  }
}

// 5. 함수 실행
fetchAptData();
