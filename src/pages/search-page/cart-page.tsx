import { useState, useEffect } from "react"; 
import Header from "../../components/common/Headers/BackHeader";
import PlaceCardList from "../../components/CartPage/PlaceCardList";
import PostNone from "../../assets/post-none.svg";
import Modal from "../../components/common/Modal"; 
import { getCartList, bulkDeleteCart } from "../../apis/cart";
import type { CartItem } from "../../types/cart";

const CartPage = () => {
  const [places, setPlaces] = useState<CartItem[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCartList();
        if (data.isSuccess) {
          setPlaces(data.result.items);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error(error);
        alert("장바구니를 불러오지 못했습니다.");
      }
    };
    fetchCart();
  }, []);

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
    setSelectedItems([]); 
  };

  const handleSelectToggle = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === places.length) {
      setSelectedItems([]); 
    } else {
      setSelectedItems(places.map((place) => place.cartId));
    }
  };

  const handleDelete = async () => {
    try {
      const response = await bulkDeleteCart(selectedItems);
      if (response.isSuccess) {
        setPlaces((prev) =>
          prev.filter((place) => !selectedItems.includes(place.cartId)),
        );
        setSelectedItems([]);
        setIsEditMode(false);
        setIsModalOpen(false);
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error(error);
      alert("삭제 실패");
    }
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
