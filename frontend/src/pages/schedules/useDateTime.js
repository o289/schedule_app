import { useState, useEffect } from "react";


export function useDateTime(schedules) {
    const [selectedDate, setSelectedDate] = useState(null);
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

    useEffect(() => {
        if (!schedules) {
            setEvents([]);
            return;
        }

        // 各 schedule の中の dates を展開して FullCalendar 用イベントに変換
        const allEvents = schedules.flatMap((s) =>
            (s.dates || []).map((d) => ({
                id: d.id,
                scheduleId: s.id,
                title: s.title,
                start: d.start_date,
                end: d.end_date,
                categoryColor: s.category?.color || "gray",
            }))
        );

        setEvents(allEvents);
    }, [schedules]);

    return {
        selectedDate,
        setSelectedDate,
        events,
        handleDateClick,
        getNowDateTime,
        getNowPlusOneHour,
    }
}


export function handleDateTime(formData, onChange) {
    const [dates, setDates] = useState(formData.dates && formData.dates.length > 0 ? formData.dates : [{ start_date: "", end_date: "" }]);
    const [tempStart, setTempStart] = useState("");
    const [tempEnd, setTempEnd] = useState("");

    const handleDateChange = (index, field, value) => {
        const newDates = dates.map((date, i) => {
        if (i === index) {
            return { ...date, [field]: value };
        }
        return date;
        });
        setDates(newDates);
        onChange({ target: { name: "dates", value: newDates } });
    };

    const addDate = () => {
        if (!tempStart || !tempEnd) return;
        const newDates = [...dates, { start_date: tempStart, end_date: tempEnd }];
        setDates(newDates);
        onChange({ target: { name: "dates", value: newDates } });
        setTempStart("");
        setTempEnd("");
    };

    const removeDate = (index) => {
        const newDates = dates.filter((_, i) => i !== index);
        setDates(newDates);
        onChange({ target: { name: "dates", value: newDates } });
    };

    return {
        dates,
        setDates,
        tempStart,
        setTempStart,
        tempEnd,
        setTempEnd,
        handleDateChange,
        addDate,
        removeDate
    }
}