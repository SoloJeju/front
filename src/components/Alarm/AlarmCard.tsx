interface AlarmCardProps {
  type: string;
  title: string;
  content: string;
}

const AlarmCard = ({ type, title, content }: AlarmCardProps) => {
  return (
    <div className='px-5 py-4 border border-[#FFCEAA] rounded-xl'>
      <h2 className='font-medium text-[14px] text-black'>{type} 알림</h2>
      <h3 className='font-semibold text-black'>{title}</h3>
      <p className='font-normal text-[#5D5D5D]'>{content}</p>
    </div>
  );
};

export default AlarmCard;
