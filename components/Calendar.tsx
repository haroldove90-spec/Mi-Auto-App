import React, { useState, useMemo } from 'react';

interface CalendarProps {
  bookedDates: Set<string>; // Expects 'YYYY-MM-DD'
  onDateChange: (dates: { startDate: string | null; endDate: string | null }) => void;
}

const Calendar: React.FC<CalendarProps> = ({ bookedDates, onDateChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleDateClick = (day: Date) => {
    if (day < today) return; // Can't select past dates
    if (isDateBooked(day)) return; // Can't select booked dates

    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
      onDateChange({ startDate: day.toISOString().split('T')[0], endDate: null });
    } else if (startDate && !endDate) {
      if (day < startDate) {
        setStartDate(day);
        onDateChange({ startDate: day.toISOString().split('T')[0], endDate: null });
      } else {
        // Check if range is valid
        let tempDate = new Date(startDate);
        while (tempDate <= day) {
          if (isDateBooked(tempDate)) {
             setStartDate(day);
             setEndDate(null);
             onDateChange({ startDate: day.toISOString().split('T')[0], endDate: null });
             return;
          }
          tempDate.setDate(tempDate.getDate() + 1);
        }
        setEndDate(day);
        onDateChange({ startDate: startDate.toISOString().split('T')[0], endDate: day.toISOString().split('T')[0] });
      }
    }
  };
  
  const isDateBooked = (date: Date) => {
      return bookedDates.has(date.toISOString().split('T')[0]);
  }

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return { days, month, year };
  }, [currentDate]);

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const renderDay = (day: Date | null, index: number) => {
    if (!day) return <div key={index}></div>;

    const isPast = day < today;
    const isBooked = isDateBooked(day);
    const isDisabled = isPast || isBooked;

    const isStart = startDate && day.getTime() === startDate.getTime();
    const isEnd = endDate && day.getTime() === endDate.getTime();
    
    let inRange = false;
    // Handle hover state to show potential range selection
    if (startDate && !endDate && hoverDate && day > startDate && day <= hoverDate) {
      let tempDate = new Date(startDate);
      let isValidRange = true;
      // Check if any date in the hovered range is booked
      while(tempDate < hoverDate) {
          tempDate.setDate(tempDate.getDate() + 1);
          if (isDateBooked(tempDate)) {
              isValidRange = false;
              break;
          }
      }
      if (isValidRange) {
          inRange = true;
      }
    } else if (startDate && endDate && day > startDate && day < endDate) {
      inRange = true;
    }

    const baseClasses = "w-10 h-10 flex items-center justify-center transition-colors duration-200";
    let dayClasses = "";

    if (isDisabled) {
        dayClasses = "text-gray-300 line-through cursor-not-allowed";
    } else {
        dayClasses = "cursor-pointer";
        if (isStart && isEnd) {
             dayClasses += " bg-primary text-white font-bold rounded-full";
        } else if (isStart) {
            dayClasses += " bg-primary text-white font-bold rounded-l-full";
        } else if (isEnd) {
            dayClasses += " bg-primary text-white font-bold rounded-r-full";
        } else if (inRange) {
            dayClasses += " bg-primary/80 text-white rounded-none";
        } else {
            dayClasses += " text-gray-700 hover:bg-slate-200 rounded-full";
        }
    }

    return (
      <div 
        key={index} 
        className={`${baseClasses} ${dayClasses}`}
        onClick={() => handleDateClick(day)}
        onMouseEnter={() => !isDisabled && setHoverDate(day)}
        onMouseLeave={() => setHoverDate(null)}
      >
        {day.getDate()}
      </div>
    );
  };
  
  return (
    <div className="bg-white p-4 rounded-lg border" onMouseLeave={() => setHoverDate(null)}>
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-100">&lt;</button>
        <span className="font-semibold text-lg text-primary">
          {new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' }).format(currentDate)}
        </span>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-100">&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2">
        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendarData.days.map(renderDay)}
      </div>
    </div>
  );
};

export default Calendar;