import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AlarmHeader from '../../components/common/Headers/AlarmHeader';
import { 
  loadSafetyCheckData, 
  saveSafetyCheckData, 
  calculateCompletionRate,
  getCategoryProgress,
  loadSafetyStats,
  saveSafetyStats
} from '../../utils/safetyCheckData';

// 전화 아이콘들 import
import icCallRecord from '../../assets/ic_call_record.png';
import icVideoCall from '../../assets/ic_video_call.png';
import icBluetooth from '../../assets/ic_bluetooth.png';
import icSpeaker from '../../assets/ic_speaker.png';
import icMicMute from '../../assets/ic_mic_mute.png';
import icKeypad from '../../assets/ic_keypad.png';
import icCallAnswer from '../../assets/ic_call_answer.png';
import icCallEnd from '../../assets/ic_call_end.png';
// 오디오 파일 경로 - public 폴더의 galaxy.wav 사용
const galaxyRingtone = '/galaxy.wav';

// 전역 오디오 관리자
class AudioManager {
  private static instance: AudioManager;
  private currentAudio: HTMLAudioElement | null = null;

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  playRingtone(): void {
    this.stopRingtone(); // 기존 오디오 정지
    
    try {
      const audio = new Audio(galaxyRingtone);
      audio.volume = 1.0;
      audio.loop = true;
      
      audio.play().then(() => {

        this.currentAudio = audio;
      }).catch((error) => {
        console.log('[ring] 벨소리 재생 실패:', error);
      });
    } catch (error) {
      console.log('[ring] 오디오 생성 에러:', error);
    }
  }

  stopRingtone(): void {
    
    // 현재 오디오 정지
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.src = '';
        this.currentAudio = null;
      } catch (error) {
        console.log('[ring] 현재 오디오 정지 에러:', error);
      }
    }

    // 모든 오디오 요소 정지
    const allAudios = document.querySelectorAll('audio');
    
    allAudios.forEach((audio, index) => {
      try {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0;
        audio.src = '';
        audio.load();
        // DOM에서 제거
        if (audio.parentNode) {
          audio.parentNode.removeChild(audio);
        }
      } catch (error) {
        console.log(`[ring] 오디오 ${index} 정지 에러:`, error);
      }
    });

  }
}

const audioManager = AudioManager.getInstance();

// 타입 정의
interface SafetyCheckItem {
  id: string;
  text: string;
  checked: boolean;
}

interface SafetyCategory {
  id: string;
  name: string;
  icon: string;
  items: SafetyCheckItem[];
}

interface SafetyCheckData {
  date: string;
  categories: SafetyCategory[];
  totalChecked: number;
  totalItems: number;
}

// 가짜 전화 모달 컴포넌트
const FakeCallModal = ({ isOpen, onClose }: { 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isRinging, setIsRinging] = useState(true);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 모달이 열리면 벨소리 상태로 시작
      setIsRinging(true);
      setIsAnswered(false);
      setCallDuration(0);
      setIsVibrating(true);
      
                    // 벨소리 재생
      
                 audioManager.playRingtone();
      
      // 진동 시작
      if (navigator.vibrate) {
        const vibrateInterval = setInterval(() => {
          navigator.vibrate([200, 100, 200, 100, 200]);
        }, 1000);
        
        return () => {
          clearInterval(vibrateInterval);
          navigator.vibrate(0);
        };
      }
         } else {
       setIsVibrating(false);
       if (navigator.vibrate) {
         navigator.vibrate(0);
       }
     }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && isAnswered) {
      // 통화를 받은 후에만 시간 카운터 시작
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, isAnswered]);

           const handleAnswer = () => {
      setIsRinging(false);
      setIsAnswered(true);
      setIsVibrating(false);
      if (navigator.vibrate) {
        navigator.vibrate(0);
      }
      
      audioManager.stopRingtone();
    };

      const handleDecline = () => {
      setIsVibrating(false);
      if (navigator.vibrate) {
        navigator.vibrate(0);
      }
      
      audioManager.stopRingtone();
      onClose();
    };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-600 via-gray-700 to-gray-800 flex flex-col items-center justify-center z-50">
       {/* 상태 표시줄 - 통화 중일 때만 표시 */}
      {!isRinging && (
        <div className="absolute top-0 left-0 right-0 flex items-center px-6 py-2 text-white text-sm">
          <div className="flex-1">
            {/* 빈 공간 */}
          </div>
          <div className="flex justify-center items-center gap-2">
          <img src={icCallAnswer} alt="수락" className="w-4 h-4 brightness-0 invert" />
            <span className="text-lg">{formatTime(callDuration)}</span>
          </div>
          <div className="flex-1 flex justify-end">
            <div className="flex flex-col items-center space-y-0.5">
              <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
              <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
              <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-sm mx-4 text-center">
        {isRinging ? (
          <>
                         {/* 전화벨 울리는 화면 */}
             <div className="mt-20 mb-12">
               {/* 프로필 사진 */}
               <div className={`w-24 h-24 bg-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center ${isVibrating ? 'animate-pulse' : ''}`}>
                 <div className="w-16 h-16 bg-gray-500 rounded-full"></div>
               </div>
               
               {/* 발신자 정보 */}
               <h2 className={`text-3xl font-bold text-white mb-2 ${isVibrating ? 'animate-pulse' : ''}`}>엄마</h2>
               <p className="text-gray-400 text-lg">010-1234-5678</p>
               
         
             </div>
            
                         {/* 전화 버튼들 */}
             <div className="flex justify-center space-x-16">
                               {/* 거절 버튼 */}
                <div className="text-center">
                  <button
                    onClick={handleDecline}
                    className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <img src={icCallEnd} alt="거절" className="w-8 h-8 brightness-0 invert rotate-130" />
                  </button>
                  {/* <p className="text-white text-sm mt-2">거절</p> */}
                </div>
                
                {/* 수락 버튼 */}
                <div className="text-center">
                  <button
                    onClick={handleAnswer}
                    className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg"
                  >
                    <img src={icCallAnswer} alt="수락" className="w-8 h-8 brightness-0 invert" />
                  </button>
                  {/* <p className="text-white text-sm mt-2">수락</p> */}
                </div>
             </div>
          </>
        ) : (
          <>
                         {/* 통화 중 화면 - 이미지 참고 */}
             <div className="mt-5 mb-8">
               {/* 발신자 정보 */}
               <h2 className="text-3xl font-bold text-white mb-2">엄마</h2>
               <p className="text-gray-300 text-lg mb-2">휴대전화 010-1234-5678</p>
              <br></br>
               
               {/* 프로필 사진 */}
               <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center border border-gray-600">
                 <div className="w-16 h-16 bg-gray-500 rounded-full"></div>
               </div>
             </div>
             <br /><br /><br /><br /><br /><br /><br /><br />
                 {/* 통화 제어 버튼들 - 어두운 회색 패널 */}
             <div className="bg-gray-400 bg-opacity-80 rounded-2xl p-6 mb-4 mt-auto">
               <div className="grid grid-cols-3 gap-6 mb-6">
                 {/* 첫 번째 줄 */}
                 <div className="text-center">
                   <div className="w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center">
                     <img src={icCallRecord} alt="녹음" className="w-24 h-6" />
                   </div>
                   <p className="text-gray-700 text-xs">녹음</p>
                 </div>
                 <div className="text-center">
                   <div className="w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center">
                     <img src={icVideoCall} alt="영상통화" className="w-10 h-8" />
                   </div>
                   <p className="text-gray-700 text-xs">영상통화</p>
                 </div>
                 <div className="text-center">
                   <div className="w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center">
                     <img src={icBluetooth} alt="블루투스" className="w-6 h-6" />
                   </div>
                   <p className="text-gray-700 text-xs">블루투스</p>
                 </div>
                 
                 {/* 두 번째 줄 */}
                 <div className="text-center">
                   <div className="w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center">
                     <img src={icSpeaker} alt="스피커" className="w-6 h-6" />
                   </div>
                   <p className="text-gray-700 text-xs">스피커</p>
                 </div>
                 <div className="text-center">
                   <div className="w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center">
                     <img src={icMicMute} alt="내 소리 차단" className="w-6 h-6" />
                   </div>
                   <p className="text-gray-700 text-xs">내 소리 차단</p>
                 </div>
                 <div className="text-center">
                   <div className="w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center">
                     <img src={icKeypad} alt="키패드" className="w-6 h-6" />
                   </div>
                   <p className="text-gray-700 text-xs">키패드</p>
                 </div>
               </div>
               
                               {/* 통화 종료 버튼 */}
                <div className="flex justify-center">
                  <div className="text-center">
                    <button
                      onClick={onClose}
                      className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <img src={icCallEnd} alt="통화 종료" className="w-7 h-7 brightness-0 invert rotate-130" />
                    </button>
                  </div>
                </div>
             </div>
          </>
        )}
      </div>
    </div>
  );
};

const SafetyCheckPage = () => {
  const navigate = useNavigate();
  const [safetyData, setSafetyData] = useState<SafetyCheckData | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showFakeCall, setShowFakeCall] = useState(false);

    useEffect(() => {
    const data = loadSafetyCheckData();
    setSafetyData(data);
    
  }, []);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleItem = (categoryId: string, itemId: string) => {
    if (!safetyData) return;

    const updatedData = {
      ...safetyData,
      categories: safetyData.categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            items: category.items.map(item => {
              if (item.id === itemId) {
                return { ...item, checked: !item.checked };
              }
              return item;
            })
          };
        }
        return category;
      })
    };

    // 총 체크된 개수 계산
    const totalChecked = updatedData.categories.reduce((sum, category) => {
      return sum + category.items.filter(item => item.checked).length;
    }, 0);

    updatedData.totalChecked = totalChecked;
    setSafetyData(updatedData);
    saveSafetyCheckData(updatedData);
  };

  const toggleAllInCategory = (categoryId: string) => {
    if (!safetyData) return;

    const category = safetyData.categories.find(cat => cat.id === categoryId);
    if (!category) return;

    const allChecked = category.items.every(item => item.checked);
    
    const updatedData = {
      ...safetyData,
      categories: safetyData.categories.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            items: cat.items.map(item => ({ ...item, checked: !allChecked }))
          };
        }
        return cat;
      })
    };

    const totalChecked = updatedData.categories.reduce((sum, cat) => {
      return sum + cat.items.filter(item => item.checked).length;
    }, 0);

    updatedData.totalChecked = totalChecked;
    setSafetyData(updatedData);
    saveSafetyCheckData(updatedData);
  };



  const handleSave = () => {
    if (safetyData) {
      const completionRate = calculateCompletionRate(safetyData);
      
      // 통계 업데이트
      const today = new Date().toISOString().split('T')[0];
      const currentStats = loadSafetyStats();
      
      // 월별 데이터 업데이트
      const currentMonth = new Date().toISOString().slice(0, 7);
      const monthData = currentStats.monthlyData[currentMonth] || {};
      monthData[today] = completionRate;
      
      // 연속 기록 업데이트 (간단한 로직)
      const newStreak = completionRate >= 70 ? currentStats.streak + 1 : 0;
      
      const updatedStats = {
        ...currentStats,
        completionRate,
        streak: newStreak,
        monthlyData: {
          ...currentStats.monthlyData,
          [currentMonth]: monthData,
        },
      };
      
      saveSafetyStats(updatedStats);
      
      if (completionRate >= 70) {
        setShowCompletionModal(true);
        setTimeout(() => {
          setShowCompletionModal(false);
          navigate('/safety-check/stats');
        }, 2000);
      } else {
        navigate('/safety-check/stats');
      }
    }
  };

  if (!safetyData) {
    return (
      <div className="min-h-screen bg-white">
        <AlarmHeader title="안전 점검" />
        <div className="pt-16 flex items-center justify-center">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      </div>
    );
  }

  const completionRate = calculateCompletionRate(safetyData);

     return (
           <div className="min-h-screen bg-white">
                             <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[480px] p-3 flex items-center justify-between bg-white z-50">
                 <div className="flex justify-start items-center w-16">
                   <button
                     onClick={() => navigate('/')}
                     className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-800 transition-colors"
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                     </svg>
                   </button>
                 </div>
                 <div className="flex justify-center flex-1">
                   <span className="text-black-2 text-lg font-semibold font-['Pretendard'] leading-relaxed">
                     혼행 체크
                   </span>
                 </div>
                 <div className="flex justify-end items-center gap-2 w-16">
                   <button
                     type="button"
                     className="cursor-pointer w-8 h-8"
                     onClick={() => navigate('/safety-check')}
                   >
                     <img src="/src/assets/shieldCheck.svg" alt="Shield Check" className="w-8 h-8" />
                   </button>
                   <button
                     type="button"
                     className="cursor-pointer w-6 h-6 relative"
                     onClick={() => navigate('/alarm')}
                   >
                     <img src="/src/assets/alarmIcon.svg" alt="알람" />
                   </button>
                 </div>
               </div>
      
      {/* 헤더 영역 */}
      <div className="pt-6 px-4 pb-6">
        {/* 도움말 섹션 */}
                 <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
           <div className="flex items-center justify-between">
             <div className="text-center flex-1 min-w-0">
               <p className="text-xs text-gray-500 mb-1 whitespace-nowrap">현재 도움이 필요하신가요?</p>
                 <p className="text-xs text-gray-600 break-words">
                   가짜 전화 기능을 이용해 혼행에 안심을 더해보세요!
                 </p>

             </div>
                                    <button
                                    onClick={() => {
                
                    setShowFakeCall(true);
                  }}
                 
                 className="ml-3 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1 flex-shrink-0"
               >
                 <span>📞</span>
                 <span className="hidden sm:inline">테스트</span>
                 <span className="sm:hidden">전화</span>
               </button>
           </div>
         </div>
                 <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
                      <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-400 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                         <span className="text-xl sm:text-2xl" style={{ color: '#40E0D0' }}>🛡️</span>
                       </div>
             <div className="min-w-0 flex-1">
               <h1 className="text-lg sm:text-xl font-bold text-gray-900 break-words">
                 오늘의 혼행 안심 체크
               </h1>
               <p className="text-xs sm:text-sm text-gray-600 break-words">안전한 여행을 위한 체크리스트</p>
             </div>
           </div>
          
                                                                                                                                   <div className="flex items-center justify-between gap-3 mb-4">
               <div className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                 완료율: <span className="font-semibold text-orange-600">{completionRate}%</span>
                 <span className="text-gray-400 ml-1">
                   ({safetyData.totalChecked}/{safetyData.totalItems})
                 </span>
               </div>
                               <div className="flex gap-2 flex-wrap">
                                   <button
                     onClick={() => navigate('/safety-check/stats')}
                     className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs sm:text-sm font-medium hover:bg-gray-200 transition-all duration-200 flex items-center gap-1 flex-shrink-0"
                   >
                     <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                     </svg>
                     <span className="whitespace-nowrap">통계</span>
                   </button>
                                   <button
                     onClick={handleSave}
                     className="px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl text-xs sm:text-sm font-medium hover:from-orange-600 hover:to-amber-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-1 flex-shrink-0"
                   >
                     <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                     </svg>
                     <span className="whitespace-nowrap">저장</span>
                   </button>
                {/* <button
                  onClick={toggleAllItems}
                  className="px-3 py-1.5 bg-orange-400 text-white rounded-lg text-xs font-medium hover:bg-orange-500 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    {safetyData.categories.every(category => 
                      category.items.every(item => item.checked)
                    ) ? '전체 해제' : '전체 선택'}
                  </span>
                </button> */}
              </div>
            </div>
          
                     {/* 진행 바 */}
           <div className="relative">
             <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
               <div 
                 className="bg-gradient-to-r from-orange-500 to-amber-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                 style={{ width: `${completionRate}%` }}
               ></div>
             </div>
           </div>
          
          
        </div>
      </div>

      {/* 카테고리 리스트 */}
      <div className="px-4 pb-20">
        {safetyData.categories.map((category) => {
          const progress = getCategoryProgress(category);
          const isExpanded = expandedCategories.has(category.id);
          const progressPercentage = progress.total > 0 ? (progress.checked / progress.total) * 100 : 0;
          
          return (
            <div key={category.id} className="mb-4">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                 {/* 카테고리 헤더 */}
                 <div 
                   className="p-4 sm:p-5 cursor-pointer hover:bg-orange-50 transition-all duration-200"
                   onClick={() => toggleCategory(category.id)}
                 >
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                       <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-200 to-amber-200 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                         <span className="text-xl sm:text-2xl">{category.icon}</span>
                       </div>
                       <div className="flex-1 min-w-0">
                         <h3 className="font-semibold text-gray-900 text-base sm:text-lg break-words">{category.name}</h3>
                         <div className="flex items-center gap-2 sm:gap-3 mt-1">
                           <p className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                             {progress.checked}/{progress.total} 완료
                           </p>
                           <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-2 flex-1">
                             <div 
                               className="bg-gradient-to-r from-orange-500 to-amber-600 h-2 rounded-full transition-all duration-300 shadow-sm"
                               style={{ width: `${progressPercentage}%` }}
                             ></div>
                           </div>
                         </div>
                       </div>
                     </div>
                     <div className="flex items-center gap-2 flex-shrink-0">
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           toggleAllInCategory(category.id);
                         }}
                         className="text-xs px-2 sm:px-3 py-1.5 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-lg hover:from-orange-200 hover:to-amber-200 transition-all duration-200 font-medium border border-orange-200 whitespace-nowrap"
                       >
                         {progress.checked === progress.total ? '전체 해제' : '전체 선택'}
                       </button>
                       <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg flex items-center justify-center shadow-sm">
                         <svg
                           className={`w-3 h-3 sm:w-4 sm:h-4 text-orange-600 transition-transform duration-200 ${
                             isExpanded ? 'rotate-180' : ''
                           }`}
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                         >
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                         </svg>
                       </div>
                     </div>
                   </div>
                 </div>

                                 {/* 체크리스트 아이템들 */}
                 {isExpanded && (
                   <div className="border-t border-orange-100 bg-gradient-to-br from-orange-25 to-amber-25">
                     {category.items.map((item) => (
                       <div
                         key={item.id}
                         className="flex items-start p-3 sm:p-4 hover:bg-white transition-all duration-200 cursor-pointer border-b border-orange-100 last:border-b-0"
                         onClick={() => toggleItem(category.id, item.id)}
                       >
                         <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4 flex-shrink-0 mt-0.5">
                           <input
                             type="checkbox"
                             checked={item.checked}
                             onChange={() => toggleItem(category.id, item.id)}
                             className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 border-2 border-orange-300 rounded-lg focus:ring-orange-500 focus:ring-2 transition-all duration-200"
                           />
                         </div>
                         <span className={`text-xs sm:text-sm leading-relaxed break-words flex-1 ${
                            item.checked 
                              ? 'text-gray-400 line-through' 
                              : 'text-gray-700'
                          }`}>
                           {item.text}
                         </span>
                       </div>
                     ))}
                   </div>
                 )}
              </div>
            </div>
          );
        })}
      </div>

             {/* 완료 축하 모달 */}
       {showCompletionModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-2xl p-8 mx-4 text-center max-w-sm w-full shadow-2xl">
             <div className="text-6xl mb-6 animate-bounce">🎉</div>
             <h2 className="text-2xl font-bold text-gray-900 mb-3">
               오늘도 안전하게!
             </h2>
             <p className="text-gray-600 mb-6">
               안전 점검을 완료하셨습니다.<br />
               안전한 여행 되세요!
             </p>
             <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full mx-auto"></div>
           </div>
         </div>
       )}
       
                        {/* 가짜 전화 모달 */}
         <FakeCallModal 
           isOpen={showFakeCall} 
           onClose={() => {
             setShowFakeCall(false);
             audioManager.stopRingtone();
           }}
         />
     </div>
   );
 };

export default SafetyCheckPage;
