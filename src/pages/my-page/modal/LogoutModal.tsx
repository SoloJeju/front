import Modal from '../../../components/common/Modal';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
};

export default function LogoutConfirmModal({
  open,
  onClose,
  onConfirm,
  isLoading = false,
}: Props) {
  if (!open) return null;

  return (
    <Modal
      title="로그아웃 하시겠어요?"
      onClose={onClose}
      buttons={[
        { text: '취소', onClick: onClose, variant: 'gray', disabled: isLoading },
        { text: isLoading ? '로그아웃 중...' : '로그아웃', onClick: onConfirm, variant: 'orange', disabled: isLoading },
      ]}
    >
      <p className="text-sm text-[#737373]">현재 계정에서 로그아웃됩니다.</p>
    </Modal>
  );
}
