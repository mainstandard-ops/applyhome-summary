import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface CompetitionData {
  HOUSE_TY: string; // 주택형
  SUPLY_HSHLDCO: string; // 공급세대수
  REQST_CNT: string; // 접수건수
  CMPET_RATE: string; // 경쟁률
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  houseManageNo: string;
  pblancNo: string;
  houseNm: string;
}

export default function CompetitionModal({ isOpen, onClose, houseManageNo, pblancNo, houseNm }: ModalProps) {
  const [data, setData] = useState<CompetitionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const params = new URLSearchParams();
          params.append('houseManageNo', houseManageNo);
          params.append('pblancNo', pblancNo);
          const response = await axios.get(`/api/competition?${params.toString()}`);
          
          if (response.data.error) {
             setError(response.data.error);
          } else if (response.data.data && response.data.data.length > 0) {
            setData(response.data.data);
          } else {
            setError("경쟁률 데이터가 없습니다. (청약 진행 전이거나 아직 데이터가 집계되지 않았을 수 있습니다.)");
          }
        } catch (err: any) {
          setError(err.response?.data?.error || "경쟁률 데이터를 불러오지 못했습니다. API 활용신청 여부를 확인해주세요.");
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [isOpen, houseManageNo, pblancNo]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
        {/* 헤더 */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
          <div>
            <h2 className="text-xl font-extrabold text-blue-900 flex items-center gap-2">
              <span className="text-2xl">📊</span> 청약 경쟁률
            </h2>
            <p className="text-sm font-medium text-gray-500 mt-1">{houseNm}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex justify-center items-center rounded-full bg-white hover:bg-gray-100 border border-gray-200 transition-colors text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            ✕
          </button>
        </div>
        
        {/* 본문 */}
        <div className="p-6 overflow-y-auto bg-white flex-grow custom-scrollbar">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-500 font-medium animate-pulse">데이터를 불러오는 중입니다...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50/50 border border-red-100 p-8 rounded-2xl flex flex-col items-center justify-center text-center py-12">
               <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                 <span className="text-4xl block">⚠️</span>
               </div>
               <p className="text-red-700 font-bold text-lg mb-2">{error}</p>
               <p className="text-sm text-red-500 max-w-md">공공데이터포털(data.go.kr)에서 해당 API(청약접수 경쟁률 조회)의 활용 신청이 필요할 수 있습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">주택형</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">공급세대수</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">접수건수</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">경쟁률</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {data.map((item, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-800 border-r border-gray-50">
                        {item.HOUSE_TY || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-600">
                        {item.SUPLY_HSHLDCO || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-600">
                        {item.REQST_CNT || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        <span className="inline-flex items-center px-3 py-1 rounded-full font-bold bg-blue-50 text-blue-700 group-hover:bg-blue-100 group-hover:text-blue-800 transition-colors">
                          {item.CMPET_RATE || '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* 푸터 */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
           <button 
             onClick={onClose}
             className="px-6 py-2.5 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
           >
             확인
           </button>
        </div>
      </div>
    </div>
  );
}
