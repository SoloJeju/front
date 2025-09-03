import { useNavigate } from 'react-router-dom';
import PlaceCard from './PlaceCard';
import ExampleImage from '../../assets/exampleImage.png';

const mockPlaces = [
  {
    id: 1,
    imageUrl: ExampleImage,
    title: '가람돌솥밥',
    location: '제주특별자치도 서귀포시 중문관광로 332',
    tel: '064-738-1299',
    comment: '1인 좌석/테이블이 잘 되어 있었어요!',
  },
  {
    id: 2,
    imageUrl: ExampleImage,
    title: '가람돌솥밥',
    location: '제주특별자치도 서귀포시 중문관광로 332',
    tel: '064-738-1299',
    comment: '1인 좌석/테이블이 잘 되어 있었어요!',
  },
  {
    id: 3,
    imageUrl: ExampleImage,
    title: '가람돌솥밥',
    location: '제주특별자치도 서귀포시 중문관광로 332',
    tel: '064-738-1299',
    comment: '1인 좌석/테이블이 잘 되어 있었어요!',
  },
  {
    id: 4,
    imageUrl: ExampleImage,
    title: '가람돌솥밥',
    location: '제주특별자치도 서귀포시 중문관광로 332',
    tel: '064-738-1299',
    comment: '1인 좌석/테이블이 잘 되어 있었어요!',
  },
  {
    id: 5,
    imageUrl: ExampleImage,
    title: '가람돌솥밥',
    location: '제주특별자치도 서귀포시 중문관광로 332',
    tel: '064-738-1299',
    comment: '1인 좌석/테이블이 잘 되어 있었어요!',
  }
];

const PlaceCardList = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2">
      {mockPlaces.map((place, idx) => (
        <div
          key={idx}
          onClick={() => navigate(`/search-detail/${place.id}`)}
          className="cursor-pointer"
        >
          <PlaceCard {...place} />
        </div>
      ))}
    </div>
  );
};

export default PlaceCardList;
