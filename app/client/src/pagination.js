const Pagination = ({ itemsPerPage, totalItems, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="flex justify-center my-4">
            <ul className="flex flex-col items-center list-none p-0">
                {pageNumbers.map((number) => (
                    <li key={number} className="mb-2">
                        <a
                            onClick={() => paginate(number)}
                            href="#!"
                            className="block px-6 py-2 border border-gray-300 rounded-lg text-blue-500 hover:bg-gray-200 shadow-lg"
                        >
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Pagination;
