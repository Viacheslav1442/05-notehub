import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import css from "../SearchBox/SearchBox.module.css";

interface SearchBoxProps {
    value: string;
    onSearch: (value: string) => void;
}

export default function SearchBox({ value, onSearch }: SearchBoxProps) {
    const [inputValue, setInputValue] = useState(value);
    const [debouncedValue] = useDebounce(inputValue, 500);

    // Якщо зовнішнє значення змінюється — оновити локальне
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        onSearch(debouncedValue);
    }, [debouncedValue, onSearch]);

    return (
        <input
            className={css.input}
            type="text"
            placeholder="Search notes"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
        />
    );
}
