import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { bsToAd, adToBs } from '../core/converter';
import {
    NepaliDaysData,
    NepaliMonthsData,
    NP_INITIAL_YEAR,
    NP_MONTHS_DATA
} from '../core/metadata';
import { toNepaliNumeral, toEnglishNumeral } from '../utils/formatter';
import './styles.css';
import { DatePickerResult, LanguageCode, Theme, DateFormat } from '../core/types';

interface Props {
    onChange?: (result: DatePickerResult | null) => void;
    theme?: Theme;
    value?: string;
    format?: DateFormat;
    calLan?: LanguageCode;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

function parseInputValue(input: string, fmt: DateFormat): { year: number; month: number; day: number; isAD: boolean } | null {
    const str = toEnglishNumeral(input.trim());
    const parts = str.split(/[-/]/);
    if (parts.length !== 3) return null;

    let year: number, month: number, day: number;
    switch (fmt) {
        case 'DD-MM-YYYY':
        case 'DD/MM/YYYY':
            day = parseInt(parts[0]);
            month = parseInt(parts[1]);
            year = parseInt(parts[2]);
            break;
        default:
            year = parseInt(parts[0]);
            month = parseInt(parts[1]);
            day = parseInt(parts[2]);
    }

    if ([year, month, day].some(isNaN)) return null;
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;

    return { year, month, day, isAD: year < 2000 };
}

function formatDisplay(year: number, month: number, day: number, fmt: DateFormat, lang: LanguageCode): string {
    const p = (n: number) => String(n).padStart(2, '0');
    const y = lang === 'np' ? toNepaliNumeral(year) : String(year);
    const m = lang === 'np' ? toNepaliNumeral(p(month)) : p(month);
    const d = lang === 'np' ? toNepaliNumeral(p(day)) : p(day);

    switch (fmt) {
        case 'DD-MM-YYYY': return `${d}-${m}-${y}`;
        case 'DD/MM/YYYY': return `${d}/${m}/${y}`;
        case 'YYYY/MM/DD': return `${y}/${m}/${d}`;
        default: return `${y}-${m}-${d}`;
    }
}

export const NepaliDatePicker: React.FC<Props> = ({
    onChange,
    theme,
    value,
    format = 'YYYY-MM-DD',
    calLan = 'en',
    placeholder,
    disabled = false,
    className,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [activeDropdown, setActiveDropdown] = useState<'m' | 'y' | null>(null);
    const pickerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const lastValidRef = useRef('');
    const skipBlurRef = useRef(false);

    const todayBS = useMemo(() => adToBs(new Date()), []);

    const [view, setView] = useState<{ y: number; m: number }>(() => {
        if (value) {
            const parts = value.split('-').map(Number);
            if (!isNaN(parts[0]) && !isNaN(parts[1])) return { y: parts[0], m: parts[1] - 1 };
        }
        return { y: todayBS.year, m: todayBS.month - 1 };
    });

    useEffect(() => {
        if (value) {
            const parts = value.split('-').map(Number);
            if (parts.length >= 3 && parts.every(n => !isNaN(n))) {
                setInputValue(formatDisplay(parts[0], parts[1], parts[2], format, calLan));
                setSelectedDate(value);
                lastValidRef.current = formatDisplay(parts[0], parts[1], parts[2], format, calLan);
            } else if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                setInputValue(value);
            }
        }
    }, []);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setActiveDropdown(null);
                skipBlurRef.current = false;
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const dynamicStyle = {
        '--nck-primary': theme?.primary || '#6366f1',
        '--nck-hover-bg': theme?.hoverBg || '#eef2ff',
        '--nck-radius': theme?.radius || '12px',
        '--nck-font': theme?.fontFamily || "'Inter', system-ui, sans-serif",
        '--nck-shadow': theme?.shadow || '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        '--nck-surface-bg': theme?.surfaceBg || '#ffffff',
        '--nck-bg-input': theme?.inputBg || '#ffffff',
        '--nck-text': theme?.text || '#0f172a',
        '--nck-border': theme?.border || '#e2e8f0',
        '--nck-bg-secondary': '#f8fafc',
        '--nck-text-muted': '#64748b',
        '--nck-text-placeholder': '#94a3b8',
        '--nck-divider': '#f1f5f9',
        '--nck-danger': '#ef4444',
        '--nck-danger-light': '#fef2f2',
        '--nck-radius-sm': '8px',
    } as React.CSSProperties;

    const monthsList = calLan === 'np' ? NepaliMonthsData.map(m => m.np) : NepaliMonthsData.map(m => m.en);
    const daysList = calLan === 'np' ? NepaliDaysData.map(d => d.np) : NepaliDaysData.map(d => d.en);
    const availableYears = useMemo(() => NP_MONTHS_DATA.map((_, i) => NP_INITIAL_YEAR + i), []);

    const monthDays = useMemo(() => {
        const yearData = NP_MONTHS_DATA[view.y - NP_INITIAL_YEAR];
        return yearData ? yearData[0][view.m] : 30;
    }, [view.y, view.m]);

    const startDayOfWeek = useMemo(() => bsToAd(view.y, view.m + 1, 1).getDay(), [view.y, view.m]);

    const commitDate = useCallback((year: number, month: number, day: number) => {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const display = formatDisplay(year, month, day, format, calLan);
        setSelectedDate(dateStr);
        setInputValue(display);
        lastValidRef.current = display;
        setView({ y: year, m: month - 1 });
        try {
            onChange?.({
                bs: dateStr,
                ad: bsToAd(year, month, day),
                nepali: toNepaliNumeral(dateStr),
            });
        } catch { }
    }, [format, calLan, onChange]);

    const commitInput = useCallback(() => {
        const text = inputValue.trim();
        if (!text) return;

        const parsed = parseInputValue(text, format);
        if (!parsed) {
            if (lastValidRef.current) setInputValue(lastValidRef.current);
            return;
        }

        if (parsed.isAD) {
            try {
                const adDate = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day));
                const bs = adToBs(adDate);
                commitDate(bs.year, bs.month, bs.day);
            } catch {
                if (lastValidRef.current) setInputValue(lastValidRef.current);
            }
        } else {
            commitDate(parsed.year, parsed.month, parsed.day);
        }
    }, [inputValue, format, commitDate]);

    const handleSelect = (day: number) => {
        commitDate(view.y, view.m + 1, day);
        setIsOpen(false);
        skipBlurRef.current = true;
    };

    const handleToday = () => {
        commitDate(todayBS.year, todayBS.month, todayBS.day);
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setInputValue('');
        setSelectedDate('');
        lastValidRef.current = '';
        onChange?.(null);
        setIsOpen(false);
        inputRef.current?.focus();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputFocus = () => {
        if (!disabled) setIsOpen(true);
    };

    const handleInputBlur = () => {
        setTimeout(() => {
            if (skipBlurRef.current) {
                skipBlurRef.current = false;
                return;
            }
            if (inputValue.trim()) {
                const parsed = parseInputValue(inputValue, format);
                if (!parsed && lastValidRef.current) {
                    setInputValue(lastValidRef.current);
                } else if (parsed) {
                    commitInput();
                }
            }
        }, 0);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            commitInput();
            setIsOpen(false);
            inputRef.current?.blur();
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            setActiveDropdown(null);
            if (lastValidRef.current) setInputValue(lastValidRef.current);
            inputRef.current?.blur();
        }
    };

    const handlePopoverMouseDown = () => {
        skipBlurRef.current = true;
    };

    const inputPlaceholder = placeholder || (calLan === 'np' ? '२०८२-०९-३०' : 'YYYY-MM-DD');

    return (
        <div
            className={`nck-wrapper${className ? ' ' + className : ''}`}
            style={dynamicStyle}
            ref={pickerRef}
        >
            <div
                className={`nck-input-box${disabled ? ' nck-disabled' : ''}`}
                onClick={() => { if (!disabled) inputRef.current?.focus(); }}
            >
                <input
                    ref={inputRef}
                    className="nck-input"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onKeyDown={handleInputKeyDown}
                    placeholder={inputPlaceholder}
                    disabled={disabled}
                    autoComplete="off"
                    spellCheck={false}
                />
                {inputValue && !disabled && (
                    <button
                        className="nck-clear-btn"
                        onClick={handleClear}
                        tabIndex={-1}
                        aria-label="Clear date"
                        type="button"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                )}
                <div className="nck-icon" onClick={(e) => { e.stopPropagation(); if (!disabled) setIsOpen(v => !v); }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                </div>
            </div>

            {isOpen && (
                <div className="nck-popover" onMouseDown={handlePopoverMouseDown}>
                    <div className="nck-nav-row">
                        <div className="nck-custom-select">
                            <div
                                className="nck-select-trigger"
                                onClick={() => setActiveDropdown(activeDropdown === 'm' ? null : 'm')}
                            >
                                {monthsList[view.m]}
                            </div>
                            {activeDropdown === 'm' && (
                                <div className="nck-select-options">
                                    {monthsList.map((n, i) => (
                                        <div
                                            key={i}
                                            className={`nck-option${view.m === i ? ' selected' : ''}`}
                                            onClick={() => { setView(v => ({ ...v, m: i })); setActiveDropdown(null); }}
                                        >
                                            {n}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="nck-custom-select">
                            <div
                                className="nck-select-trigger"
                                onClick={() => setActiveDropdown(activeDropdown === 'y' ? null : 'y')}
                            >
                                {calLan === 'np' ? toNepaliNumeral(view.y) : view.y}
                            </div>
                            {activeDropdown === 'y' && (
                                <div className="nck-select-options">
                                    {availableYears.map(y => (
                                        <div
                                            key={y}
                                            className={`nck-option${view.y === y ? ' selected' : ''}`}
                                            onClick={() => { setView(v => ({ ...v, y })); setActiveDropdown(null); }}
                                        >
                                            {calLan === 'np' ? toNepaliNumeral(y) : y}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="nck-week-grid">
                        {daysList.map((d, i) => (
                            <div key={i} className="nck-week-day">
                                {calLan === 'np' ? d.substring(0, 3) : d.substring(0, 2)}
                            </div>
                        ))}
                    </div>

                    <div className="nck-date-grid">
                        {[...Array(startDayOfWeek)].map((_, i) => (
                            <div key={`e-${i}`} className="nck-cell empty" />
                        ))}
                        {[...Array(monthDays)].map((_, i) => {
                            const d = i + 1;
                            const ds = `${view.y}-${String(view.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                            const isSel = selectedDate === ds;
                            const isToday = todayBS.year === view.y && todayBS.month === view.m + 1 && todayBS.day === d;
                            return (
                                <div
                                    key={d}
                                    className={`nck-cell${isSel ? ' active' : ''}${isToday ? ' today' : ''}`}
                                    onClick={() => handleSelect(d)}
                                >
                                    {calLan === 'np' ? toNepaliNumeral(d) : d}
                                </div>
                            );
                        })}
                    </div>

                    <div className="nck-footer">
                        <button className="nck-footer-btn nck-btn-today" onClick={handleToday} type="button">
                            {calLan === 'np' ? 'आज' : 'Today'}
                        </button>
                        <button className="nck-footer-btn nck-btn-clear" onClick={handleClear} type="button">
                            {calLan === 'np' ? 'रद्द' : 'Clear'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
