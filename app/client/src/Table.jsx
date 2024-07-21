const Table = ({ data, columns }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <table className="table-auto w-full">
      <thead>
        <tr>
          {columns.id && <th className="px-4 py-2">ID</th>}
          {columns.name && <th className="px-4 py-2">Name</th>}
          {columns.category && <th className="px-4 py-2">Category</th>}
          {columns.subcategory && <th className="px-4 py-2">Subcategory</th>}
          {columns.createdAt && <th className="px-4 py-2">Created At</th>}
          {columns.updatedAt && <th className="px-4 py-2">Updated At</th>}
          {columns.price && <th className="px-4 py-2">Price</th>}
          {columns.sale_price && <th className="px-4 py-2">Sales Price</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            {columns.id && <td className="border px-4 py-2">{item.id}</td>}
            {columns.name && <td className="border px-4 py-2">{item.name}</td>}
            {columns.category && <td className="border px-4 py-2">{item.category}</td>}
            {columns.subcategory && <td className="border px-4 py-2">{item.subcategory}</td>}
            {columns.createdAt && <td className="border px-4 py-2">{formatDate(item.createdAt)}</td>}
            {columns.updatedAt && <td className="border px-4 py-2">{formatDate(item.updatedAt)}</td>}
            {columns.price && <td className="border px-4 py-2">{item.price}</td>}
            {columns.sale_price && <td className="border px-4 py-2">{item.sale_price}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
