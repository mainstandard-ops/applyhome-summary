import axios from 'axios';
import { NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "8aaaa2f4d64deaf78ccb7bbdd6c696bd8c443bf376b1d71fe7209e01ee29cf4d";
const BASE_URL = 'https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const perPage = searchParams.get('perPage') || '10';

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        page,
        perPage,
        serviceKey: API_KEY,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: '데이터를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
