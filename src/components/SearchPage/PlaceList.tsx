import PlaceCard from './PlaceCard';
import ExampleImage from '../../assets/exampleImage.png';
import { useNavigate, useLocation } from "react-router-dom";

const mockPlaces = [
  {
    imageUrl: ExampleImage,
    title: '가람돌솥밥',
    location: '제주특별자치도 서귀포시 중문관광로 332',
    tel: '064-738-1299',
    comment: '1인 좌석/테이블이 잘 되어 있었어요!',
  },
  {
    imageUrl: ExampleImage,
    title: '가람돌솥밥',
    location: '제주특별자치도 서귀포시 중문관광로 332',
    tel: '064-738-1299',
    comment: '1인 좌석/테이블이 잘 되어 있었어요!',
  },
  {
    imageUrl: ExampleImage,
    title: '가람돌솥밥',
    location: '제주특별자치도 서귀포시 중문관광로 332',
    tel: '064-738-1299',
    comment: '1인 좌석/테이블이 잘 되어 있었어요!',
  },
  {
    imageUrl: ExampleImage,
    title: '가람돌솥밥',
    location: '제주특별자치도 서귀포시 중문관광로 332',
    tel: '064-738-1299',
    comment: '1인 좌석/테이블이 잘 되어 있었어요!',
  },
  {
    imageUrl: ExampleImage,
    title: '가람돌솥밥',
    location: '제주특별자치도 서귀포시 중문관광로 332',
    tel: '064-738-1299',
    comment: '1인 좌석/테이블이 잘 되어 있었어요!',
  }
];

const PlaceCardList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (place: any) => {
    if (location.state?.from) {
      navigate(location.state.from, {
        state: { selectedPlace: { id: place.id, name: place.title } }, 
      });
    } else {
      navigate(`/search-detail/${place.id}`);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {mockPlaces.map((place, idx) => (
        <div key={idx} onClick={() => handleClick(place)}>
          <PlaceCard {...place} />
        </div>
      ))}
    </div>
  );
};

export default PlaceCardList;
