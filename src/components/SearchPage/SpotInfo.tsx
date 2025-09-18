import { useState } from 'react';
import type { FC, ReactNode } from 'react';
import ClockIcon from '../../assets/clock.svg?react';
import TelIcon from '../../assets/tel.svg?react';
import InfoIcon from '../../assets/info.svg?react';
import MapIcon from '../../assets/mapPin.svg?react';
import WebIcon from '../../assets/web.svg?react';
import WalkIcon from '../../assets/tag.svg?react';
import TagIcon from '../../assets/tag.svg?react';
import ChevronDownIcon from '../../assets/dropdown.svg?react';

interface InfoItemProps {
  icon: ReactNode;
  label: string;
  value: string | number | null;
  isTel?: boolean;
}

interface CourseInfo {
  subname: string;
  subdetailoverview: string;
  subdetailimg?: string;
  subdetailalt?: string;
  [key: string]: any;
}

interface LeportsExtraInfo {
  infoname: string;
  infotext: string;
  [key: string]: any;
}

interface BasicInfo {
  contenttypeid: string | number;
  addr1?: string;
  addr2?: string;
  homepage?: string;
  tel?: string;
  [key: string]: any;
}

interface SpotInfoProps {
  basic: BasicInfo;
  intro: Record<string, any>;
  infoList: (CourseInfo | LeportsExtraInfo)[];
}

const stripHtml = (html: string): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
};

const InfoItem: FC<InfoItemProps> = ({ icon, label, value, isTel = false }) => {
  if (!value || String(value).trim() === '') {
    return null;
  }
  const formattedValue = String(value).replace(/<br\s*\/?>/gi, '\n');
  return (
    <div className="flex items-start gap-2">
      {icon}
      <div className="flex w-full text-[16px] font-normal tracking-[-0.28px] text-[#5D5D5D] font-[Pretendard]">
        <span className="w-24 flex-shrink-0 font-semibold">{label}</span>
        {isTel ? (
          <a href={`tel:${stripHtml(formattedValue)}`} className="text-[#033C81] hover:underline">
            {formattedValue}
          </a>
        ) : (
          <p className="whitespace-pre-wrap">{formattedValue}</p>
        )}
      </div>
    </div>
  );
};

const renderHours = (type: string, intro: Record<string, any>) => {
  switch(type) {
    case "12":
      return (
        <>
          <InfoItem icon={<ClockIcon className="w-4 h-4 mt-0.5" />} label="이용 시간" value={intro.usetime} />
          <InfoItem icon={<InfoIcon className="w-4 h-4 mt-0.5" />} label="쉬는 날" value={intro.restdate} />
        </>
      );
    case "14":
      return (
        <>
          <InfoItem icon={<ClockIcon className="w-4 h-4 mt-0.5" />} label="이용 시간" value={intro.usetimeculture} />
          <InfoItem icon={<InfoIcon className="w-4 h-4 mt-0.5" />} label="쉬는 날" value={intro.restdateculture} />
        </>
      );
    case "15":
      return (
        <>
          <InfoItem icon={<ClockIcon className="w-4 h-4 mt-0.5" />} label="행사 기간" value={intro.eventstartdate && intro.eventenddate ? `${intro.eventstartdate} ~ ${intro.eventenddate}` : null} />
          <InfoItem icon={<ClockIcon className="w-4 h-4 mt-0.5" />} label="공연 시간" value={intro.playtime} />
        </>
      );
    case "25":
      return <>
      <InfoItem icon={<ClockIcon className="w-4 h-4 mt-0.5" />} label="소요 시간" value={intro.taketime} />
      <InfoItem icon={<WalkIcon className="w-4 h-4 mt-0.5" />} label="총 거리" value={intro.distance} />
      </>
    case "28":
      return (
        <>
          <InfoItem icon={<ClockIcon className="w-4 h-4 mt-0.5" />} label="이용 시간" value={intro.usetimeleports} />
          <InfoItem icon={<InfoIcon className="w-4 h-4 mt-0.5" />} label="쉬는 날" value={intro.restdateleports} />
        </>
      );
    case "32":
      return (
        <>
          <InfoItem icon={<ClockIcon className="w-4 h-4 mt-0.5" />} label="체크인" value={intro.checkintime} />
          <InfoItem icon={<ClockIcon className="w-4 h-4 mt-0.5" />} label="체크아웃" value={intro.checkouttime} />
        </>
      );
    case "38":
      return (
        <>
          <InfoItem icon={<ClockIcon className="w-4 h-4 mt-0.5" />} label="영업 시간" value={intro.opentime} />
          <InfoItem icon={<InfoIcon className="w-4 h-4 mt-0.5" />} label="쉬는 날" value={intro.restdateshopping} />
        </>
      );
    case "39":
      return (
        <>
          <InfoItem icon={<ClockIcon className="w-4 h-4 mt-0.5" />} label="영업 시간" value={intro.opentimefood} />
          <InfoItem icon={<InfoIcon className="w-4 h-4 mt-0.5" />} label="쉬는 날" value={intro.restdatefood} />
        </>
      );
    default:
      return null;
  }
};

const renderContact = (type: string, intro: Record<string, any>) => {
  switch(type) {
    case "14":
      return <InfoItem icon={<TelIcon className="w-4 h-4 mt-0.5" />} label="문의" value={intro.infocenterculture} isTel />;
    case "15":
      return <InfoItem icon={<TelIcon className="w-4 h-4 mt-0.5" />} label="주최/문의" value={intro.sponsor1 && intro.sponsor1tel ? `${intro.sponsor1} (${intro.sponsor1tel})` : intro.sponsor1} isTel />;
    case "28":
      return <InfoItem icon={<TelIcon className="w-4 h-4 mt-0.5" />} label="문의" value={intro.infocenterleports} isTel />;
    case "32":
      return <InfoItem icon={<TelIcon className="w-4 h-4 mt-0.5" />} label="예약 문의" value={intro.reservationlodging} isTel />;
    case "38":
      return <InfoItem icon={<TelIcon className="w-4 h-4 mt-0.5" />} label="문의" value={intro.infocentershopping} isTel />;
    case "39":
      return <InfoItem icon={<TelIcon className="w-4 h-4 mt-0.5" />} label="문의" value={intro.infocenterfood} isTel />;
    default:
      return null;
  }
};

const renderEtcInfo = (type: string, intro: Record<string, any>, infoList?: (CourseInfo | LeportsExtraInfo)[]) => {
  switch(type) {
    case "12":
      return <InfoItem icon={<InfoIcon className="w-4 h-4 mt-0.5" />} label="주차" value={intro.parking} />;
    case "14":
      return (
        <>
          <InfoItem icon={<TagIcon className="w-4 h-4 mt-0.5" />} label="이용 요금" value={intro.usefee} />
          <InfoItem icon={<ClockIcon className="w-4 h-4 mt-0.5" />} label="소요 시간" value={intro.spendtime} />
          <InfoItem icon={<InfoIcon className="w-4 h-4 mt-0.5" />} label="주차" value={intro.parkingculture ? `${intro.parkingculture} (${intro.parkingfee || '요금 정보 없음'})` : null} />
          <InfoItem icon={<TagIcon className="w-4 h-4 mt-0.5" />} label="할인 정보" value={intro.discountinfo} />
        </>
      );
    case "15":
      return (
        <>
          <InfoItem icon={<InfoIcon className="w-4 h-4 mt-0.5" />} label="행사 장소" value={intro.eventplace} />
          <InfoItem icon={<InfoIcon className="w-4 h-4 mt-0.5" />} label="이용 요금" value={intro.usetimefestival} />
        </>
      );
    case "25":
      const courseInfoList = infoList as CourseInfo[];
      return (
        <>
          <h3 className="font-[Pretendard] text-base font-bold text-gray-800 mb-3">코스 상세 정보</h3>
          <div className="space-y-6">
            {courseInfoList && courseInfoList.length > 0 ? courseInfoList.map((course, index) => (
              <div key={index} className="flex flex-col gap-2 font-[Pretendard]">
                {course.subdetailimg && <img src={course.subdetailimg} alt={course.subdetailalt || course.subname} className="w-full h-48 object-cover rounded-lg shadow-md" />}
                <div className="pl-2 border-l-2 border-orange-400 mt-2">
                  <p className="font-semibold text-gray-700">{course.subname}</p>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{course.subdetailoverview}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-gray-500">상세 코스 정보가 없습니다.</p>
            )}
          </div>
        </>
      );
    case "28": {
      const leportsInfoList = infoList as LeportsExtraInfo[];
      return (
        <>
          <InfoItem icon={<InfoIcon className="w-4 h-4 mt-0.5" />} label="주차" value={intro.parkingleports} />
          <InfoItem icon={<InfoIcon className="w-4 h-4 mt-0.5" />} label="체험연령" value={intro.expagerangeleports} />
          <InfoItem icon={<InfoIcon className="w-4 h-4 mt-0.5" />} label="예약" value={intro.reservation} />
          {leportsInfoList && leportsInfoList.length > 0 && (
            <div className="mt-3 pt-3 border-t">
              {leportsInfoList.map((item, index) => (
                <InfoItem
                  key={index}
                  icon={<TagIcon className="w-4 h-4 mt-0.5" />}
                  label={item.infoname}
                  value={item.infotext}
                />
              ))}
            </div>
          )}
        </>
      );
    }
    case "32":
      return (
        <>
          <InfoItem icon={<InfoIcon className="w-4 h-4 mt-0.5" />} label="객실 수" value={intro.roomcount} />
          <InfoItem icon={<InfoIcon className="w-4 h-4 mt-0.5" />} label="객실 유형" value={intro.roomtype} />
          <InfoItem icon={<InfoIcon className="w-4 h-4 mt-0.5" />} label="수용 인원" value={intro.accomcountlodging} />
          <InfoItem icon={<InfoIcon className="w-4 h-4 mt-0.5" />} label="주차" value={intro.parkinglodging} />
        </>
      );
    case "38":
      return (
        <>
          <InfoItem icon={<TagIcon className="w-4 h-4 mt-0.5" />} label="판매 품목" value={intro.saleitem} />
          <InfoItem icon={<InfoIcon className="w-4 h-4 mt-0.5" />} label="주차" value={intro.parkingshopping} />
        </>
      );
    case "39":
      return (
        <>
          <InfoItem icon={<InfoIcon className="w-4 h-4 mt-0.5" />} label="대표 메뉴" value={intro.firstmenu} />
          <InfoItem icon={<InfoIcon className="w-4 h-4 mt-0.5" />} label="취급 메뉴" value={intro.treatmenu} />
          <InfoItem icon={<InfoIcon className="w-4 h-4 mt-0.5" />} label="주차" value={intro.parkingfood} />
        </>
      );
    default:
      return null;
  }
};

const SpotInfo: FC<SpotInfoProps> = ({ basic, intro, infoList }) => {
  const { contenttypeid, tel: genericTel } = basic;
  const type = String(contenttypeid);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const etcInfoContent = renderEtcInfo(type, intro, infoList);

  let specificContact: string | null = null;
  switch(type) {
    case "14": specificContact = intro.infocenterculture; break;
    case "15": specificContact = intro.sponsor1tel; break;
    case "28": specificContact = intro.infocenterleports; break;
    case "32": specificContact = intro.reservationlodging; break;
    case "38": specificContact = intro.infocentershopping; break;
    case "39": specificContact = intro.infocenterfood; break;
  }
  
  const showGenericTel = genericTel && stripHtml(genericTel) !== stripHtml(specificContact || '');

  return (
    <div className="flex flex-col gap-3">
      <InfoItem icon={<MapIcon className="w-4 h-4 mt-0.5" />} label="위치" value={basic.addr1 || basic.addr2 || null } />
      
      {renderHours(type, intro)}
      
      {renderContact(type, intro)}
      {showGenericTel && <InfoItem icon={<TelIcon className="w-4 h-4 mt-0.5" />} label="대표 연락처" value={genericTel} isTel />}

      {basic.homepage && (
         <div className="flex items-start gap-2">
            <WebIcon className="w-4 h-4 mt-0.5" />
            <div className="flex w-full text-[14px] font-normal tracking-[-0.28px] text-[#5D5D5D] font-[Pretendard]">
               <span className="w-24 flex-shrink-0 font-semibold">사이트</span>
               <div className="flex flex-col">
                  {basic.homepage.split('\n').map((url, index) =>
                     url.trim() && (
                     <a
                        key={index}
                        href={stripHtml(url.trim())}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#033C81] hover:underline break-all"
                     >
                        {stripHtml(url.trim())}
                     </a>
                     )
                  )}
               </div>
            </div>
         </div>
      )}

      {etcInfoContent && (
        <>
          <div className="w-full flex items-center gap-2 pt-2 font-[Pretendard]">
            <div className="flex-grow h-px bg-gray-200"></div>
            <button
              onClick={() => setIsExpanded(prev => !prev)}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-100/70 text-[13px] font-medium text-[#F78938]"
            >
              <span>{isExpanded ? '간략히' : '정보 더보기'}</span>
              <ChevronDownIcon 
                  className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
              />
            </button>
            <div className="flex-grow h-px bg-gray-200"></div>
          </div>

          {isExpanded && (
              <div className="flex flex-col gap-3">
                  {etcInfoContent}
              </div>
          )}
        </>
      )}
    </div>
  );
};

export default SpotInfo;