import axios from 'axios';
import { NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "8aaaa2f4d64deaf78ccb7bbdd6c696bd8c443bf376b1d71fe7209e01ee29cf4d";
const BASE_URL = 'https://api.odcloud.kr/api/ApplyhomeInfoCmpetRateSvc/v1/getAPTCmpetRate';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const houseManageNo = searchParams.get('houseManageNo');
  const pblancNo = searchParams.get('pblancNo');

  if (!houseManageNo || !pblancNo) {
    return NextResponse.json(
      { error: '주택관리번호(houseManageNo)와 공고번호(pblancNo)가 필요합니다.' },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        page: 1,
        perPage: 50, // 충분히 여유 있게 가져옴 (타입별)
        cond: {
          HOUSE_MANAGE_NO: houseManageNo,
          PBLANC_NO: pblancNo,
        },
        serviceKey: API_KEY,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Competition API Error:', error);
    return NextResponse.json(
      { error: '데이터를 불러오는 중 오류가 발생했습니다. (API 활용신청 여부를 확인해주세요.)' },
      { status: 500 }
    );
  }
}
