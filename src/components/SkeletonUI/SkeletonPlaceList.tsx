import { memo } from "react";
import SkeletonPlaceCard from "./SkeletonPlaceCard";

const SkeletonPlaceList = () => {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonPlaceCard key={i} />
      ))}
    </div>
  );
};

export default memo(SkeletonPlaceList);
