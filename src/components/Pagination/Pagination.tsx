import ReactPaginate from 'react-paginate';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ totalPages, currentPage, onPageChange }: PaginationProps) => {
    return (
        <ReactPaginate
            pageCount={totalPages}
            forcePage={currentPage - 1}
            onPageChange={({ selected }) => onPageChange(selected + 1)}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            containerClassName="pagination"
            activeClassName="active"
            previousLabel="←"
            nextLabel="→"
        />
    );
};

export default Pagination;