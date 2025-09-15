import { useState } from 'react';
import { IoIosCheckmark } from 'react-icons/io';

// UI 확인을 위한 언어 목록 그냥 임의로 넣어놓은 것
const languages = [
  { code: 'ko', name: '한국어' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
];

const LanguageSettings = () => {
  // UI 상에서 선택된 언어를 표시하기 위한 상태 (기본값: 'ko')
  const [selectedLanguage, setSelectedLanguage] = useState('ko');

  return (
    <div className="font-[Pretendard] bg-[#FFFFFD] min-h-screen">
      <div className="w-full max-w-[480px] mx-auto">
        <main>
          <ul className="space-y-2">
            {languages.map((lang) => (
              <li
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className="flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
              >
                <span
                  className={
                    selectedLanguage === lang.code
                      ? 'text-primary font-bold'
                      : 'text-gray-800'
                  }
                >
                  {lang.name}
                </span>
                {selectedLanguage === lang.code && (
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
