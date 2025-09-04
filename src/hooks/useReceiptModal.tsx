import { useState, useCallback } from 'react';
import Modal from '../components/common/Modal'; 

type ModalStep = 'initial' | 'success' | 'failure' | 'none';
interface UseReceiptModalProps {
  onFinalize: (receiptVerified: boolean) => void;
}

export const useReceiptModal = ({ onFinalize }: UseReceiptModalProps) => {
  const [modalStep, setModalStep] = useState<ModalStep>('none');

  const attemptVerification = useCallback(() => {
    console.log('영수증 인증 시도...');
    setTimeout(() => {
      if (Math.random() > 0.5) {
        console.log('인증 성공');
        setModalStep('success');
      } else {
        console.log('인증 실패');
        setModalStep('failure');
      }
    }, 1500);
  }, []);

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
  const ModalComponent = (() => {
    switch (modalStep) {
      case 'initial':
        return (
          <Modal
            title="영수증 인증하시겠어요?"
            onClose={closeModal}
            buttons={[
              { text: '인증하기', onClick: attemptVerification, variant: 'orange' },
              { text: '리뷰만 등록하기', onClick: () => handleFinalize(false), variant: 'orange' },
            ]}
          >
            <p className="text-sm text-gray-600">
              영수증을 인증하면 포인트를 받을 수 있어요!<br/>
              * 정확한 사진을 첨부해 주세요.
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
              { text: '다시 시도하기', onClick: attemptVerification, variant: 'orange' },
              { text: '리뷰만 등록하기', onClick: () => handleFinalize(false), variant: 'orange' },
            ]}
          >
            <div className="text-sm text-gray-600 text-left">
              <p>• 사진이 선명하지 않거나</p>
              <p>• 다른 장소의 영수증일 수 있어요.</p>
              <br/>
              <p className="text-xs">궁금한 점이 있다면<br/>마이페이지{'>'}1:1 문의하기 또는 solojeju@gmail.com으로 문의주세요.</p>
            </div>
          </Modal>
        );
      default:
        return null;
    }
  })();

  return { startReceiptFlow, ModalComponent };
};