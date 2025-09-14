import { SyncLoader } from "react-spinners";

interface LoadingSpinnerProps {
  color?: string;
  size?: number;
  margin?: number;
}

export default function LoadingSpinner({
  color = "#F78938",
  size = 12,
  margin = 4,
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen font-[Pretendard]">
      <SyncLoader color={color} size={size} margin={margin} />
    </div>
  );
}
