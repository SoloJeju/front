import { useState } from 'react';
import { IoIosCheckmark } from 'react-icons/io';

// ✅ 1. 각 언어의 활성화 상태를 관리하기 위해 enabled 속성을 추가합니다.
const languages = [
  { code: 'ko', name: '한국어', enabled: true },
  { code: 'en', name: 'English', enabled: false },
  { code: 'ja', name: '日本語', enabled: false },
  { code: 'zh', name: '中文', enabled: false },
];

const LanguageSettings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('ko');

  return (
    <div className="font-[Pretendard] bg-[#FFFFFD] min-h-screen">
      <div className="w-full max-w-[480px] mx-auto p-4">
        {' '}
        {/* ✅ 가독성을 위해 좌우 패딩 추가 */}
        <main>
          <ul className="space-y-2">
            {languages.map((lang) => (
              <li
                key={lang.code}
                // ✅ 2. 활성화된 언어만 클릭 가능하도록 수정합니다.
                onClick={() => lang.enabled && setSelectedLanguage(lang.code)}
                className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                  // ✅ 3. 비활성화 상태에 따른 스타일을 추가합니다.
                  lang.enabled
                    ? 'cursor-pointer hover:bg-gray-50'
                    : 'cursor-not-allowed bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={
                      selectedLanguage === lang.code && lang.enabled
                        ? 'text-primary font-bold'
                        : 'text-gray-800'
                    }
                  >
                    {lang.name}
                  </span>
                  {/* ✅ 4. 비활성화된 언어에 '준비 중' 텍스트를 표시합니다. */}
                  {!lang.enabled && (
                    <span className="text-xs text-gray-500 font-medium bg-gray-200 px-2 py-1 rounded-full">
                      준비 중
                    </span>
                  )}
                </div>
                {selectedLanguage === lang.code && lang.enabled && (
                  <IoIosCheckmark size={24} className="text-primary" />
                )}
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
};

export default LanguageSettings;
