import { useState, useEffect } from "react"; 
import Header from "../../components/common/Headers/BackHeader";
import PlaceCardList from "../../components/CartPage/PlaceCardList";
import PostNone from "../../assets/post-none.svg";
import Modal from "../../components/common/Modal"; 
import type { Place } from "../../types/place";

const CartPage = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setPlaces([
      { id: 1, title: '가람돌솥밥',
        location: '제주특별자치도 서귀포시 중문관광로 332',
        tel: '064-738-1299',
        comment: '1인 좌석/테이블이 잘 되어 있었어요!',},
      { id: "abc", title: '가람돌솥밥',
        location: '제주특별자치도 서귀포시 중문관광로 332',
        tel: '064-738-1299',
        comment: '1인 좌석/테이블이 잘 되어 있었어요!', },
      { id: 3, title: '가람돌솥밥',
        location: '제주특별자치도 서귀포시 중문관광로 332',
        tel: '064-738-1299',
        comment: '1인 좌석/테이블이 잘 되어 있었어요!', },
    ]);
  }, []);

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
    setSelectedItems([]); 
  };

  const handleSelectToggle = (id: string | number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === places.length) {
      setSelectedItems([]); 
    } else {
      setSelectedItems(places.map((place) => place.id));
    }
  };

  const handleDelete = () => {
    setPlaces((prev) => prev.filter((place) => !selectedItems.includes(place.id)));
    setSelectedItems([]);
    setIsEditMode(false);
    setIsModalOpen(false);
  };

  return (
    <div className="flex justify-center bg-[#FFFFFD] min-h-screen font-[Pretendard]">
      <div className="w-full max-w-[480px] pb-24">
        <div className="flex justify-between items-center">
          <Header 
            title="내가 담은 장소" 
            rightContent={places.length > 0 && (
              <button
                onClick={toggleEditMode}
                className="text-sm text-[#F78938] font-medium">
                {isEditMode ? "취소" : "편집"}
              </button>
            )} 
          />
        </div>

        {places.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full">
            <img src={PostNone} alt="no-post" className="w-20 h-20" />
            <p className="font-[pretendard] font-medium text-[#B4B4B4]">
              담은 장소가 존재하지 않습니다
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between py-2">
              {isEditMode ? (
                <>
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-[#F78938] cursor-pointer"
                  >
                    전체 선택
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)} 
                    className="text-sm text-red-500 cursor-pointer"
                  >
                    삭제
                  </button>
                </>
              ) : (
                <div className="h-5" />
              )}
            </div>

            <PlaceCardList
              places={places}
              isEditMode={isEditMode}
              selectedItems={selectedItems}
              onSelectToggle={handleSelectToggle}
            />
          </>
        )}
      </div>

      {isModalOpen && (
        <Modal
          title="삭제하시겠습니까?"
          onClose={() => setIsModalOpen(false)}
          buttons={[
            {
              text: "취소",
              onClick: () => setIsModalOpen(false),
              variant: "gray",
            },
            {
              text: "확인",
              onClick: handleDelete,
              variant: "orange",
            },
          ]}>
          선택한 장소가 삭제됩니다.
        </Modal>
      )}
    </div>
  );
};

export default CartPage;
