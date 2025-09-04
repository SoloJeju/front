import { useState, useCallback, useRef } from 'react';
import Modal from '../components/common/Modal';
import { verifyReceipt } from '../apis/review';

type ModalStep = 'initial' | 'success' | 'failure' | 'none';
interface UseReceiptModalProps {
  contentId: number | undefined;
  onFinalize: (receiptVerified: boolean) => void;
}

export const useReceiptModal = ({ contentId, onFinalize }: UseReceiptModalProps) => {
  const [modalStep, setModalStep] = useState<ModalStep>('none');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attemptVerification = useCallback(
    async (file: File) => {
      if (!contentId) {
        alert('리뷰를 작성할 장소를 먼저 선택해주세요.');
        return;
      }

      console.log('영수증 인증 API 호출...');
      try {
        const response = await verifyReceipt(contentId, file);
        if (response.isSuccess && response.result === true) {
          console.log('인증 성공');
          setModalStep('success');
        } else {
          console.log('인증 실패');
          setModalStep('failure');
        }
      } catch (error) {
        console.error('영수증 인증 API 오류:', error);
        setModalStep('failure');
      }
    },
    [contentId],
  );

  const closeModal = useCallback(() => {
    setModalStep('none');
  }, []);

  const handleFinalize = useCallback(
    (receiptVerified: boolean) => {
      onFinalize(receiptVerified);
      closeModal();
    }, [onFinalize, closeModal],
  );

  const startReceiptFlow = useCallback(() => {
    setModalStep('initial');
  }, []);
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      attemptVerification(file);
    }
  };
  
  const ModalComponent = (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        style={{ display: 'none' }}
      />
      {(() => {
        switch (modalStep) {
          case 'initial':
            return (
              <Modal
                title="영수증 인증하시겠어요?"
                onClose={closeModal}
                buttons={[
                  { text: '인증하기', onClick: triggerFileInput, variant: 'orange' },
                  { text: '리뷰만 등록하기', onClick: () => handleFinalize(false), variant: 'orange' },
                ]}
              >
                <p className="text-sm text-gray-600">
                  영수증을 인증하면 포인트를 받을 수 있어요!
                  <br/>* 정확한 사진을 첨부해 주세요.
                </p>
              </Modal>
            );
          case 'success':
            return (
              <Modal
                title="영수증 인증 성공!"
                onClose={() => handleFinalize(true)}
                buttons={[{ text: '확인', onClick: () => handleFinalize(true), variant: 'orange' }]}
              >
                <p className="text-sm text-gray-600">포인트가 적립되었습니다.</p>
              </Modal>
            );
          case 'failure':
            return (
              <Modal
                title="영수증 인식에 실패했습니다."
                onClose={closeModal}
                buttons={[
                  { text: '다시 시도하기', onClick: triggerFileInput, variant: 'orange' },
                  { text: '리뷰만 등록하기', onClick: () => handleFinalize(false), variant: 'orange' },
                ]}
              >
                <div className="text-sm text-gray-600 text-left">
                  <p>• 사진이 선명하지 않거나</p>
                  <p>• 다른 장소의 영수증일 수 있어요.</p>
                  <br />
                  <p className="text-xs">
                    궁금한 점이 있다면
                    <br />
                    마이페이지{'>'}1:1 문의하기 또는 solojeju@gmail.com으로 문의주세요.
                  </p>
                </div>
              </Modal>
            );
          default:
            return null;
        }
      })()}
    </>
  );

  return { startReceiptFlow, ModalComponent };
};