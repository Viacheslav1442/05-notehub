import css from './SearchBox.module.css'
import type { ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";
export interface SearchBoxProps {
    onSearch: (query: string) => void
}

const SearchBox = ({ onSearch }: SearchBoxProps) => {

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onSearch(event.target.value.trim())
    }
    const debouncedInput = useDebouncedCallback(handleChange, 200)
    return (
        <>
            <input
                className={css.input}
                type="text"
                onChange={debouncedInput}
                placeholder="Search notes"
            />
        </>
    );
};

SearchBox.propTypes = {

};

export default SearchBox;