import React, { useState, useMemo, useEffect, useRef } from 'react';
import { bsToAd, adToBs } from '../core/converter';
import {
    NepaliDaysData,
    NepaliMonthsData,
    NP_INITIAL_YEAR,
    NP_MONTHS_DATA
} from '../core/metadata';
import { toNepaliNumeral } from '../utils/formatter';
import './styles.css';
import { DatePickerResult, LanguageCode, Theme } from '../core/types';

interface Props {
    onChange?: (result: DatePickerResult | null) => void;
    theme?: Theme;
    value?: string;
    dateLan?: LanguageCode;
    monthLan?: LanguageCode;
    dayLan?: LanguageCode;
    yearLan?: LanguageCode;
}

export const NepaliDatePicker: React.FC<Props> = ({
    onChange,
    theme,
    value,
    dateLan = 'en',
    monthLan = 'en',
    dayLan = 'en',
    yearLan = 'en',
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<string>(value || "");
    const [activeDropdown, setActiveDropdown] = useState<'m' | 'y' | null>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    const todayBS = useMemo(() => adToBs(new Date()), []);

    const [view, setView] = useState<{ y: number; m: number }>(() => {
        if (value && value.includes('-')) {
            const [y, m] = value.split('-').map(Number);
            return { y, m: m - 1 };
        }
        return { y: todayBS.year, m: todayBS.month - 1 };
    });

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setActiveDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const dynamicStyle = {
        '--nck-primary': theme?.primary || '#2563eb',
        '--nck-primary-light': theme?.primaryLight || '#eff6ff',
        '--nck-radius': theme?.radius || '12px',
        '--nck-font': theme?.fontFamily || "'Inter', system-ui, sans-serif",
        '--nck-shadow': theme?.shadow || '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        '--nck-bg-input': theme?.inputBg || '#ffffff',
    } as React.CSSProperties;

    const monthsList = monthLan === 'np' ? NepaliMonthsData.map(m => m.np) : NepaliMonthsData.map(m => m.en);
    const daysList = dayLan === 'np' ? NepaliDaysData.map(d => d.np) : NepaliDaysData.map(d => d.en);
    const availableYears = useMemo(() => NP_MONTHS_DATA.map((_, i) => NP_INITIAL_YEAR + i), []);

    const monthDays = useMemo(() => {
        const yearData = NP_MONTHS_DATA[view.y - NP_INITIAL_YEAR];
        return yearData ? yearData[0][view.m] : 30;
    }, [view.y, view.m]);

    const startDayOfWeek = useMemo(() => bsToAd(view.y, view.m + 1, 1).getDay(), [view.y, view.m]);

    const handleSelect = (day: number) => {
        const dateStr = `${view.y}-${String(view.m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        updateSelection(dateStr, view.y, view.m + 1, day);
        setIsOpen(false);
    };

    const handleToday = () => {
        const dateStr = `${todayBS.year}-${String(todayBS.month).padStart(2, '0')}-${String(todayBS.day).padStart(2, '0')}`;
        setView({ y: todayBS.year, m: todayBS.month - 1 });
        updateSelection(dateStr, todayBS.year, todayBS.month, todayBS.day);
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedDate("");
        onChange?.(null);
        setIsOpen(false);
    };

    const updateSelection = (dateStr: string, y: number, m: number, d: number) => {
        setSelectedDate(dateStr);
        onChange?.({
            bs: dateStr,
            ad: bsToAd(y, m, d),
            nepali: toNepaliNumeral(dateStr)
        });
    };

    return (
        <div className="nck-wrapper" style={dynamicStyle} ref={pickerRef}>
            <div className="nck-input-box" onClick={() => setIsOpen(!isOpen)}>
                <input
                    className="nck-input"
                    readOnly
                    value={dateLan === 'np' ? toNepaliNumeral(selectedDate) : selectedDate}
                    placeholder={dateLan === 'np' ? "२०८२-०९-३०" : "YYYY-MM-DD"}
                />
                <div className="nck-input-actions">
                    <div className="nck-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="nck-popover">
                    <div className="nck-nav-row">
                        {/* Custom Month Dropdown */}
                        <div className="nck-custom-select">
                            <div className="nck-select-trigger" onClick={() => setActiveDropdown(activeDropdown === 'm' ? null : 'm')}>
                                {monthsList[view.m]}
                            </div>
                            {activeDropdown === 'm' && (
                                <div className="nck-select-options">
                                    {monthsList.map((n, i) => (
                                        <div key={i} className={`nck-option ${view.m === i ? 'selected' : ''}`}
                                            onClick={() => { setView({ ...view, m: i }); setActiveDropdown(null); }}>
                                            {n}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Custom Year Dropdown */}
                        <div className="nck-custom-select">
                            <div className="nck-select-trigger" onClick={() => setActiveDropdown(activeDropdown === 'y' ? null : 'y')}>
                                {yearLan === 'np' ? toNepaliNumeral(view.y) : view.y}
                            </div>
                            {activeDropdown === 'y' && (
                                <div className="nck-select-options">
                                    {availableYears.map(y => (
                                        <div key={y} className={`nck-option ${view.y === y ? 'selected' : ''}`}
                                            onClick={() => { setView({ ...view, y: y }); setActiveDropdown(null); }}>
                                            {yearLan === 'np' ? toNepaliNumeral(y) : y}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="nck-week-grid">
                        {daysList.map((d, i) => <div key={i} className="nck-week-day">{dayLan === 'np' ? d.substring(0, 3) : d.substring(0, 2)}</div>)}
                    </div>

                    <div className="nck-date-grid">
                        {[...Array(startDayOfWeek)].map((_, i) => <div key={i} className="nck-cell empty"></div>)}
                        {[...Array(monthDays)].map((_, i) => {
                            const d = i + 1;
                            const isSelected = selectedDate === `${view.y}-${String(view.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                            const isToday = todayBS.year === view.y && todayBS.month === (view.m + 1) && todayBS.day === d;
                            return (
                                <div key={d} className={`nck-cell ${isSelected ? 'active' : ''} ${isToday ? 'today' : ''}`} onClick={() => handleSelect(d)}>
                                    {dateLan === 'np' ? toNepaliNumeral(d) : d}
                                </div>
                            );
                        })}
                    </div>

                    <div className="nck-footer">
                        <button className="nck-footer-btn nck-btn-today" onClick={handleToday}>
                            {dateLan === 'np' ? 'आज' : 'Today'}
                        </button>
                        <button className="nck-footer-btn nck-btn-clear" onClick={handleClear}>
                            {dateLan === 'np' ? 'रद्द' : 'Clear'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
