import css from "./Pagination.module.css";
import ReactPaginate from "react-paginate";

export interface PaginationProps {
    totalPages: number;
    page: number;
    onChangePage: (page: number) => void;
}

const Pagination = ({ totalPages, page, onChangePage }: PaginationProps) => {
    return (
        <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => onChangePage(selected + 1)}
            forcePage={page - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
        />
    );
};

export default Pagination;