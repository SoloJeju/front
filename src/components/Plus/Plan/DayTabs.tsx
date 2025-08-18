interface DayTabsProps {
  tabs: string[];
  activeTab: string;
  onTabClick: (tab: string) => void;
}

const DayTabs = ({ tabs, activeTab, onTabClick }: DayTabsProps) => {
  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onTabClick(tab)}
          className={`flex-shrink-0 px-4 py-2 text-sm rounded-full ${
            activeTab === tab
              ? 'bg-[#F78937] text-white font-semibold'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default DayTabs;