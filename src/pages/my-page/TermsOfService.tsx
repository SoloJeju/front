const TermsOfService = () => {
  return (
    <div className="bg-gray-50 font-[Pretendard] text-gray-800">
      <main className="max-w-4xl mx-auto bg-white min-h-screen px-5 py-8 sm:px-8 sm:py-12 shadow-sm">
        {/* 헤더 */}
        <header className="mb-7 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            혼자옵서예 서비스 이용약관
          </h1>
          <p className="mt-3 text-gray-600 leading-relaxed break-keep">
            이 약관은 주식회사 혼자옵서예(이하 &lsquo;회사&rsquo;)가 제공하는
            혼자옵서예 및 관련 제반 서비스(이하 &lsquo;서비스&rsquo;)의 이용과
            관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을
            규정함을 목적으로 합니다.
          </p>

          {/* 공고/시행일 배지 */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-600">
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1">
              <span className="font-medium text-gray-800">공고</span>
              2025년 9월 16일
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1">
              <span className="font-medium text-gray-800">시행</span>
              2025년 9월 16일
            </span>
          </div>
        </header>

        {/* 본문 */}
        <section
          id="article-1"
          className="pt-6 border-t border-gray-200 space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            제1조 (용어의 정의)
          </h2>
          <p className="leading-relaxed break-keep">
            본 약관에서 사용하는 용어의 정의는 다음과 같습니다.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed break-keep">
            <li>
              <strong>&quot;서비스&quot;</strong>라 함은 회사가 제공하는 혼자
              여행객을 위한 동행 찾기 및 여행 정보 공유 플랫폼
              &lsquo;혼자옵서예&rsquo;를 의미합니다.
            </li>
            <li>
              <strong>&quot;회원&quot;</strong>이라 함은 서비스에 접속하여 이
              약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를
              이용하는 고객을 말합니다.
            </li>
            <li>
              <strong>&quot;게시물&quot;</strong>이라 함은 회원이 서비스를
              이용함에 있어 서비스상에 게시한 부호, 문자, 음성, 화상, 동영상
              등의 정보 형태의 글, 사진, 동영상 및 각종 파일과 링크 등을
              의미합니다.
            </li>
            <li>
              <strong>&quot;동행&quot;</strong>이라 함은 서비스 내에서 다른
              회원과 함께 여행하기로 약속하고 일정을 공유하는 활동을 의미합니다.
            </li>
          </ul>
        </section>

        <section
          id="article-2"
          className="pt-6 mt-6 border-t border-gray-200 space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            제2조 (약관의 명시와 개정)
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed break-keep">
            <li>
              회사는 이 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기
              화면에 게시합니다.
            </li>
            <li>
              회사는 &lsquo;약관의 규제에 관한 법률&rsquo;, &lsquo;정보통신망
              이용촉진 및 정보보호 등에 관한 법률&rsquo; 등 관련 법을 위배하지
              않는 범위에서 이 약관을 개정할 수 있습니다.
            </li>
            <li>
              회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여
              현행약관과 함께 제1항의 방식에 따라 그 개정약관의 적용일자 7일
              전부터 적용일자 전일까지 공지합니다.
            </li>
          </ul>
        </section>

        <section
          id="article-3"
          className="pt-6 mt-6 border-t border-gray-200 space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            제3조 (회원가입)
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed break-keep">
            <li>
              회원가입은 이용자가 약관의 내용에 대하여 동의를 한 다음
              회원가입신청을 하고 회사가 이러한 신청에 대하여 승낙함으로써
              체결됩니다.
            </li>
            <li>
              회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나
              사후에 이용계약을 해지할 수 있습니다.
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                <li>가입신청자가 이전에 회원자격을 상실한 적이 있는 경우</li>
                <li>
                  허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은
                  경우
                </li>
                <li>
                  만 14세 미만 아동이 법정대리인의 동의를 얻지 아니한 경우
                </li>
                <li>
                  기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고
                  판단되는 경우
                </li>
              </ul>
            </li>
          </ul>
        </section>

        <section
          id="article-4"
          className="pt-6 mt-6 border-t border-gray-200 space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            제4조 (회원의 의무)
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed break-keep">
            <li>
              회원은 다음 행위를 하여서는 안 됩니다.
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>타인의 정보 도용</li>
                <li>다른 회원의 개인정보를 무단으로 수집, 이용하는 행위</li>
                <li>
                  음란물, 욕설, 비방 등 공서양속에 반하는 게시물을 게시하는 행위
                </li>
                <li>회사 및 제3자의 저작권 등 지적재산권을 침해하는 행위</li>
                <li>회사의 동의 없이 영리를 목적으로 서비스를 사용하는 행위</li>
                <li>서비스 운영을 고의로 방해하는 행위</li>
              </ul>
            </li>
            <li>
              회원은 관계법, 이 약관의 규정, 이용안내 및 서비스와 관련하여
              공지한 주의사항, 회사가 통지하는 사항 등을 준수하여야 하며, 기타
              회사의 업무에 방해되는 행위를 하여서는 안 됩니다.
            </li>
          </ul>
        </section>

        <section
          id="article-5"
          className="pt-6 mt-6 border-t border-gray-200 space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            제5조 (게시물의 저작권 및 관리)
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed break-keep">
            <li>
              회원이 서비스 내에 게시한 게시물의 저작권은 해당 게시물의
              저작자에게 귀속됩니다.
            </li>
            <li>
              회사는 회원이 게시한 게시물을 서비스 운영, 홍보, 개선 등의
              목적으로 사용할 수 있는 비독점적이고 전 세계적인 라이선스를
              부여받습니다.
            </li>
            <li>
              회사는 회원의 게시물이 &lsquo;정보통신망법&rsquo; 및
              &lsquo;저작권법&rsquo; 등 관련법에 위반되는 내용을 포함하는 경우,
              권리자의 요청이 없더라도 해당 게시물에 대해 임시조치, 삭제 등
              필요한 조치를 취할 수 있습니다.
            </li>
          </ul>
        </section>

        <section
          id="article-6"
          className="pt-6 mt-6 border-t border-gray-200 space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            제6조 (면책조항)
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed break-keep">
            <li>
              회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를
              제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
            </li>
            <li>
              회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을
              지지 않습니다.
            </li>
            <li>
              <div className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-[15px] leading-relaxed">
                <strong className="text-amber-900">
                  회사는 회원 간의 동행 과정에서 발생하는 모든 문제(범죄, 분실,
                  상해, 분쟁 등)에 대해 어떠한 법적 책임도 부담하지 않습니다.
                </strong>{' '}
                서비스는 동행자를 연결하는 플랫폼 역할만을 수행하며, 동행 여부
                및 안전에 대한 최종 결정과 책임은 회원 본인에게 있습니다.
              </div>
            </li>
            <li>
              회사는 회원이 서비스와 관련하여 게재한 정보, 자료, 사실의 신뢰도,
              정확성 등의 내용에 관하여는 책임을 지지 않습니다.
            </li>
          </ul>
        </section>

        <section
          id="article-7"
          className="pt-6 mt-6 border-t border-gray-200 space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            제7조 (준거법 및 재판관할)
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed break-keep">
            <li>
              회사와 회원 간에 발생한 분쟁에 대하여는 대한민국법을 준거법으로
              합니다.
            </li>
            <li>
              회사와 회원 간 발생한 분쟁에 관한 소송은 민사소송법 상의
              관할법원에 제소합니다.
            </li>
          </ul>
        </section>

        {/* 푸터 메타 */}
        <footer className="mt-10 pt-6 border-t border-gray-200 text-sm text-gray-500">
          <p>
            <strong>공고일자:</strong> 2025년 9월 16일
          </p>
          <p>
            <strong>시행일자:</strong> 2025년 9월 16일
          </p>
        </footer>
      </main>
    </div>
  );
};

export default TermsOfService;
