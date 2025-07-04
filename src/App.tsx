import { useEffect, useState } from 'react';

export default function App() {
  const [data, setData] = useState([]);
  const serviceKey = 'P7wB1TwNM3N51xIsC458IcdAvqQrmSVtjzB8zjWsrxsaSUlL6WUNnk%2FHvaH6Z4xzQdZmVgK%2FlRCV0a7uSAFcQg%3D%3D';
  const baseURL = 'http://apis.data.go.kr/B551011/TarRlteTarService1/areaBasedList1';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}?serviceKey=${serviceKey}&pageNo=1&numOfRows=10&MobileOS=ETC&MobileApp=AppTest&baseYm=202503&areaCd=11&signguCd=11530&_type=json`);
        const result = await response.json();
        console.log(result);

        setData(result.response.body.items.item);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className='bg-primary'>SoloJ</h1>
    </div>
  );
}

// https://apis.data.go.kr/B551011/TarRlteTarService1/areaBasedList1?serviceKey=인증키&pageNo=1&numOfRows=10&MobileOS=ETC&MobileApp=AppTest&baseYm=202503&areaCd=11&signguCd=11530&_type=json
