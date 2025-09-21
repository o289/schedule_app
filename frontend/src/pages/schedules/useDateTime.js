import { useState, useEffect } from "react";


export function useDateTime(schedules) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDates, setSelectedDates] = useState([getNowDateTime().slice(0, 10)]);
    const [events, setEvents] = useState([]);
    
    // --- 日付補助関数 ---
    function getNowDateTime() {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    }

    function getNowPlusOneHour() {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset() + 60);
        return now.toISOString().slice(0, 16);
    }
    
    const handleDateClick = (info) => {
        setSelectedDate(info.dateStr);
    };

    const addDate = () => {
        setSelectedDates([...selectedDates, getNowDateTime().slice(0, 10)]);
    };

    const updateDate = (idx, newDate) => {
        const newDates = [...selectedDates];
        newDates[idx] = newDate;
        setSelectedDates(newDates);
    };

    const removeDate = (idx) => {
        setSelectedDates(selectedDates.filter((_, i) => i !== idx));
    };

    useEffect(() => {
        if (!schedules) {
            setEvents([]);
            return;
        }

        setEvents(
            schedules.map((s) => ({
                id: s.id,
                title: s.title,
                start: s.start_time,
                end: s.end_time,
                categoryColor: s.category?.color || "gray",
            }))
        );
    }, [schedules]);

    return {
        selectedDate,
        selectedDates,
        events,
        handleDateClick,
        addDate,
        updateDate,
        removeDate,
        getNowDateTime,
        getNowPlusOneHour,
    }
}