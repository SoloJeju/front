import { useRef, useEffect, useMemo } from "react";

const debounce = <F extends (...args: any[]) => void>(func: F, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export interface ScrollPickerColumnProps<T> {
  values: T[];
  selectedValue: T;
  onSelect: (value: T) => void;
  getStyle: (distance: number) => string;
  isInfinite?: boolean;
  formatValue?: (value: T) => string;
  itemHeight?: number;
}

const ScrollPickerColumn = <T extends string | number>({
  values,
  selectedValue,
  onSelect,
  getStyle,
  isInfinite = false,
  formatValue = (v) => String(v),
  itemHeight = 40,
}: ScrollPickerColumnProps<T>) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInitialScrollDone = useRef(false);
  const LOOP_MULTIPLIER = 50;

  const extendedValues = useMemo(() => {
    if (isInfinite) {
      return Array.from({ length: LOOP_MULTIPLIER }, () => values).flat();
    }
    return values;
  }, [values, isInfinite]);

  const handleScroll = useMemo(
    () => debounce(() => {
      if (!scrollRef.current) return;
      const { scrollTop } = scrollRef.current;
      const centeredIndex = Math.round(scrollTop / itemHeight);
      const newValue = extendedValues[centeredIndex];

      if (newValue !== undefined && newValue !== selectedValue) {
        onSelect(newValue);
      }
    }, 150),
    [extendedValues, selectedValue, onSelect, itemHeight]
  );

  useEffect(() => {
    if (!scrollRef.current) return;
    if (isInfinite) {
      if (!isInitialScrollDone.current) {
        const middleIndex = Math.floor(extendedValues.length / 2);
        const initialIndexInOriginal = values.indexOf(selectedValue);
        const targetIndex = middleIndex - (middleIndex % values.length) + initialIndexInOriginal;
        scrollRef.current.scrollTop = targetIndex * itemHeight;
        isInitialScrollDone.current = true;
      }
    } else {
      const index = values.indexOf(selectedValue);
      if (index !== -1) {
        scrollRef.current.scrollTo({ top: index * itemHeight, behavior: "smooth" });
      }
    }
  }, [isInfinite, extendedValues, selectedValue, values, itemHeight]);
  
  useEffect(() => {
    if (!scrollRef.current || !isInitialScrollDone.current) return;
    if (isInfinite) {
      const { scrollTop } = scrollRef.current;
      const currentIndex = Math.round(scrollTop / itemHeight);
      const currentValue = extendedValues[currentIndex];
      if (currentValue !== selectedValue) {
        const middleRepetition = Math.floor(LOOP_MULTIPLIER / 2);
        const targetIndexInOriginal = values.indexOf(selectedValue);
        const targetIndex = (values.length * middleRepetition) + targetIndexInOriginal;
        scrollRef.current.scrollTo({ top: targetIndex * itemHeight, behavior: 'smooth' });
      }
    }
  }, [selectedValue, values, extendedValues, isInfinite, itemHeight]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => {
        scrollElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  return (
    <div
      ref={scrollRef}
      className="overflow-y-scroll h-40 snap-y scrollbar-hide"
    >
      <div style={{ height: `calc(50% - ${itemHeight / 2}px)` }}></div>
      {extendedValues.map((value, index) => {
        const selectedOriginalIndex = values.indexOf(selectedValue);
        const currentOriginalIndex = index % values.length;
        const distance = Math.abs(selectedOriginalIndex - currentOriginalIndex);
        return (
          <div
            key={isInfinite ? index : String(value)}
            className={`h-10 flex items-center justify-center snap-center transition-all duration-200 ${getStyle(distance)}`}
            style={{ height: `${itemHeight}px` }}
          >
            {formatValue(value)}
          </div>
        );
      })}
      <div style={{ height: `calc(50% - ${itemHeight / 2}px)` }}></div>
    </div>
  );
};

export default ScrollPickerColumn;