import { useState } from 'react';
import Modal from '../../../components/common/Modal';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (payload: { reason: string; detail?: string }) => void; // 최종 탈퇴 확정
};

const REASONS = [
  '자주 이용하지 않아요',
  '여행 정보가 부족해요',
  '탈퇴 후 재가입 하고싶어요',
  '서비스 이용이 불편해요',
  '기타',
] as const;

export default function DeleteAccountModal({
  open,
  onClose,
  onConfirm,
}: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [reason, setReason] = useState<string>('');
  const [detail, setDetail] = useState<string>('');

  // 안전장치: open이 false이거나 undefined이면 아무것도 렌더링하지 않음
  if (!open || open === undefined) return null;

  const isEtc = reason === '기타';
  const canConfirm = reason && (!isEtc || (isEtc && detail.trim().length > 0));

  // 1단계 → 2단계 이동
  const goNext = () => setStep(2);

  // 최종 확정
  const confirmDelete = () => {
    if (!canConfirm) return;
    onConfirm({ reason, detail: isEtc ? detail.trim() : undefined });
  };

  return step === 1 ? (
    // 정말로 탈퇴하시겠습니까?
    <Modal
      title="정말로 탈퇴하시겠습니까?"
      onClose={onClose}
      buttons={[
        { text: '취소', onClick: onClose, variant: 'gray' },
        { text: '탈퇴하기', onClick: goNext, variant: 'orange' },
      ]}
    >
      <p className="text-sm text-[#737373]">
        탈퇴하시면 계정과 관련된 모든 정보가 삭제됩니다.
      </p>
    </Modal>
  ) : (
    // 탈퇴 사유 선택
    <Modal
      title="탈퇴 사유를 알려주세요"
      onClose={onClose}
      buttons={[
        { text: '취소', onClick: onClose, variant: 'gray' },
        {
          text: '탈퇴하기',
          onClick: confirmDelete,
          variant: 'orange',
        },
      ]}
    >
      <div className="text-sm text-[#737373] mb-4">
        탈퇴 사유를 알려주시면 서비스 개선에 큰 도움이 됩니다.
      </div>

      <div className="flex flex-col gap-3">
        {REASONS.map((r) => (
          <label key={r} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="delete-reason"
              value={r}
              checked={reason === r}
              onChange={(e) => setReason(e.target.value)}
              className="sr-only peer"
            />
            {/* 커스텀 원형 */}
            <span
              className={[
                'inline-block w-4 h-4 rounded-full transition-colors',
                'border-[2px] border-[#F9B269] bg-transparent',
                'peer-checked:bg-[#F9B269] peer-checked:border-transparent',
              ].join(' ')}
              aria-hidden
            />
            <span className="text-[#262626]">{r}</span>
          </label>
        ))}

        {isEtc && (
          <input
            type="text"
            placeholder="사유를 입력해주세요"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F78938]/30"
          />
        )}
      </div>
    </Modal>
  );
}
