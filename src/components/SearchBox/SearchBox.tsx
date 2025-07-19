import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import css from "../SearchBox/SearchBox.module.css";


interface SearchBoxProps {
    value: string;
    onSearch: (value: string) => void;
}

export default function SearchBox({ onSearch }: SearchBoxProps) {
    const [inputValue, setInputValue] = useState('');
    const [debouncedValue] = useDebounce(inputValue, 500);

    useEffect(() => {
        onSearch(debouncedValue);
    }, [debouncedValue, onSearch])
    return (
        <input
            className={css.input}
            type="text"
            placeholder="Search notes"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
        />
    );
};