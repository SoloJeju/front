const PrivacyPolicy = () => {
  return (
    <div className="font-[Pretendard] bg-gray-50">
      <main
        aria-labelledby="pp-title"
        className="mx-4 sm:mx-auto max-w-[680px] bg-white
              border border-[#EDEDED] rounded-2xl shadow-sm
              px-5 py-8 md:px-8 md:py-10 text-[#262626]"
      >
        {/* 헤더 */}
        <header className="mb-6 md:mb-8">
          <h1
            id="pp-title"
            className="text-2xl md:text-3xl font-bold tracking-tight"
          >
            혼자옵서예 개인정보 처리방침
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#666666] break-keep">
            주식회사 혼자옵서예(이하 &lsquo;회사&rsquo;)는 이용자의 개인정보를
            소중하게 생각하며, &lsquo;개인정보 보호법&rsquo; 등 관련 법규를
            준수하기 위해 최선을 다하고 있습니다. 회사는 본 개인정보 처리방침을
            통해 이용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고
            있으며, 개인정보 보호를 위해 어떠한 조치가 취해지고 있는지
            알려드립니다.
          </p>

          {/* 공고/시행 일자 배지 */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#666666]">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F5F5] px-2.5 py-1">
              <span className="font-medium text-[#262626]">공고</span>
              2025년 9월 16일
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F5F5F5] px-2.5 py-1">
              <span className="font-medium text-[#262626]">시행</span>
              2025년 9월 16일
            </span>
          </div>
        </header>

        {/* 본문 섹션들 */}
        <section className="pt-6 border-t border-[#EDEDED]" id="article-1">
          <h2 className="text-xl font-semibold mb-4 scroll-mt-24">
            제1조 (수집하는 개인정보의 항목 및 수집 방법)
          </h2>
          <p className="mb-4 leading-relaxed break-keep">
            회사는 회원가입, 원활한 고객상담, 각종 서비스의 제공을 위해 아래와
            같은 최소한의 개인정보를 수집하고 있습니다.
          </p>
          <ul className="list-disc pl-5 space-y-2 leading-relaxed break-keep">
            <li>
              <strong>가. 수집 항목</strong>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  <strong>(필수)</strong> 이메일 주소, 비밀번호, 이름, 닉네임,
                  생년월일, 성별
                </li>
                <li>
                  <strong>(선택)</strong> 프로필 사진, 한 줄 소개, 여행 타입
                </li>
                <li>
                  서비스 이용 과정이나 사업 처리 과정에서 쿠키, IP 주소, 서비스
                  이용 기록, 기기 정보 등이 자동으로 생성되어 수집될 수
                  있습니다.
                </li>
              </ul>
            </li>
            <li>
              <strong>나. 수집 방법</strong>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  회원가입 및 서비스 이용 과정에서 이용자가 개인정보 수집에 대해
                  동의를 하고 직접 정보를 입력하는 경우
                </li>
                <li>생성 정보 수집 툴을 통한 자동 수집</li>
              </ul>
            </li>
          </ul>
        </section>

        <section className="pt-6 mt-6 border-t border-[#EDEDED]" id="article-2">
          <h2 className="text-xl font-semibold mb-4 scroll-mt-24">
            제2조 (개인정보의 수집 및 이용 목적)
          </h2>
          <p className="mb-4 leading-relaxed break-keep">
            회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.
          </p>
          <ul className="list-disc pl-5 space-y-2 leading-relaxed break-keep">
            <li>
              <strong>서비스 제공 및 회원 관리:</strong> 회원제 서비스 이용에
              따른 본인 식별, 가입 의사 확인, 연령 확인, 불량회원의 부정 이용
              방지와 비인가 사용 방지, 분쟁 조정을 위한 기록 보존, 민원처리 등
            </li>
            <li>
              <strong>동행 찾기 및 커뮤니티 기능:</strong> 이용자 간의 원활한
              소통과 동행 매칭을 위해 닉네임, 프로필 사진, 한 줄 소개, 여행 타입
              등 프로필 정보 활용
            </li>
            <li>
              <strong>신규 서비스 개발 및 마케팅 활용:</strong> 신규 서비스 개발
              및 맞춤 서비스 제공, 통계학적 특성에 따른 서비스 제공 및 광고
              게재, 서비스의 유효성 확인, 이벤트 정보 및 참여기회 제공
            </li>
          </ul>
        </section>

        <section className="pt-6 mt-6 border-t border-[#EDEDED]" id="article-3">
          <h2 className="text-xl font-semibold mb-4 scroll-mt-24">
            제3조 (개인정보의 보유 및 이용기간)
          </h2>
          <p className="mb-4 leading-relaxed break-keep">
            회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당
            정보를 지체 없이 파기합니다. 단, 관계 법령의 규정에 의하여 보존할
            필요가 있는 경우 회사는 아래와 같이 관계 법령에서 정한 일정한 기간
            동안 회원정보를 보관합니다.
          </p>
          <ul className="list-disc pl-5 space-y-2 leading-relaxed break-keep">
            <li>
              계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래 등에서의
              소비자보호에 관한 법률)
            </li>
            <li>
              대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래 등에서의
              소비자보호에 관한 법률)
            </li>
            <li>
              소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래 등에서의
              소비자보호에 관한 법률)
            </li>
            <li>로그인 기록: 3개월 (통신비밀보호법)</li>
          </ul>
        </section>

        <section className="pt-6 mt-6 border-t border-[#EDEDED]" id="article-4">
          <h2 className="text-xl font-semibold mb-4 scroll-mt-24">
            제4조 (개인정보의 파기절차 및 방법)
          </h2>
          <p className="mb-4 leading-relaxed break-keep">
            회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당
            정보를 지체 없이 파기합니다. 파기절차 및 방법은 다음과 같습니다.
          </p>
          <ul className="list-disc pl-5 space-y-2 leading-relaxed break-keep">
            <li>
              <strong>파기절차:</strong> 이용자가 회원가입 등을 위해 입력한
              정보는 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의
              서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에
              따라(보유 및 이용기간 참조) 일정 기간 저장된 후 파기됩니다.
            </li>
            <li>
              <strong>파기방법:</strong> 전자적 파일 형태로 저장된 개인정보는
              기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.
            </li>
          </ul>
        </section>

        <section className="pt-6 mt-6 border-t border-[#EDEDED]" id="article-5">
          <h2 className="text-xl font-semibold mb-4 scroll-mt-24">
            제5조 (이용자의 권리 및 행사방법)
          </h2>
          <p className="mb-4 leading-relaxed break-keep">
            이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할
            수 있으며 가입 해지를 요청할 수도 있습니다. 개인정보 조회, 수정을
            위해서는 &lsquo;프로필 수정&rsquo; 기능을, 가입 해지(동의 철회)를
            위해서는 &lsquo;회원 탈퇴&rsquo; 기능을 이용하여 본인 확인 절차를
            거치신 후 직접 열람, 정정 또는 탈퇴가 가능합니다.
          </p>
        </section>

        <section className="pt-6 mt-6 border-t border-[#EDEDED]" id="article-6">
          <h2 className="text-xl font-semibold mb-4 scroll-mt-24">
            제6조 (개인정보 보호책임자)
          </h2>
          <p className="mb-4 leading-relaxed break-keep">
            회사는 고객의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기
            위하여 아래와 같이 관련 부서 및 개인정보 보호책임자를 지정하고
            있습니다.
          </p>
          <ul className="list-disc pl-5 space-y-2 leading-relaxed break-keep">
            <li>개인정보 보호책임자: 혼자옵서예 서비스 담당자</li>
            <li>
              이메일:{' '}
              <a
                href="mailto:soloojeju@gmail.com"
                className="underline underline-offset-2 decoration-[#FFCEAA] hover:opacity-80"
              >
                soloojeju@gmail.com
              </a>
            </li>
          </ul>
        </section>

        <section className="pt-6 mt-6 border-t border-[#EDEDED]" id="article-7">
          <h2 className="text-xl font-semibold mb-4 scroll-mt-24">
            제7조 (개인정보 처리방침 변경)
          </h2>
          <p className="mb-4 leading-relaxed break-keep">
            본 개인정보 처리방침의 내용 추가, 삭제 및 수정이 있을 경우, 개정
            최소 7일 전부터 서비스 내 배너·팝업 또는 이메일 등 적절한 방법으로
            이용자에게 고지하겠습니다. 다만, 이용자 권리에 중대한 변경이
            발생하는 경우에는 법령이 정한 바에 따라 더 명확한 방법으로
            고지하겠습니다.
          </p>
        </section>

        {/* 푸터 메타 */}
        <footer className="mt-8 pt-6 border-t border-[#EDEDED] text-xs text-[#666666]">
          <div className="flex flex-col gap-1">
            <p>
              <strong>공고일자:</strong> 2025년 9월 16일
            </p>
            <p>
              <strong>시행일자:</strong> 2025년 9월 16일
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
