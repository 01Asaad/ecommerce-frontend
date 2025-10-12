import React, { useRef } from 'react';
function PaginationPanel({ totalItems, totalPages, pageState, setPageState }) {

	const dynamicPageRef = useRef()
	const startPages = totalPages > 3 ? [1, 2] : [1]
	const endPages = totalPages > 2 ? totalPages === 5 ? [totalPages - 2, totalPages - 1, totalPages] : [totalPages - 1, totalPages] : totalPages === 1 ? [] : [totalPages]
	const isInputPageShown = totalPages > 5
	const selectedClasses = " focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 bg-indigo-500 text-white"
	const unselectedClasses = "inset-ring inset-ring-gray-500 dark:inset-ring-gray-700 hover:bg-gray-200 dark:hover:bg-white/5 focus:outline-offset-0 text-gray-400 dark:text-gray-200"
	const isDynamicPageSelected = !startPages.includes(pageState.page + 1) && !endPages.includes(pageState.page + 1)
	const dynamicPageInputValue = isDynamicPageSelected ? (pageState.page + 1) : "..."

	const handlePerPageChange = (event) => {
		const newTotalPages = Math.ceil(totalItems/event.target.value)
		setPageState((prev) => { return { ...prev, perPage: event.target.value, page : prev.page>(newTotalPages-1) ? newTotalPages-1 : prev.page} })
	};
	const handlePageChange = (event) => {
		setPageState((prev) => { return { ...prev, page: parseInt(dynamicPageRef.current.value) - 1 } })
	};
	const handleNextPageClick = (event) => {
		if (pageState.page === totalPages - 1) { return }

		setPageState((prev) => { return { ...prev, page: prev.page + 1 } })
	};
	const handlePrevPageClick = (event) => {
		if (pageState.page === 0) { return }
		setPageState((prev) => { return { ...prev, page: prev.page - 1 } })
	};
	const selectPageHandle = pageIndex => {
		setPageState((prev) => { return { ...prev, page: pageIndex } })
	}
	const dynamicPageBlurHandler = e => {
		dynamicPageRef.current.value = dynamicPageInputValue
	}

	return (
		<div className="flex items-center justify-between border-t border-black/60 dark:border-white/10 px-4 py-3 sm:px-6">
			<div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
				<div>
					<p className="text-sm text-gray-700 dark:text-gray-300">
						Showing <span className="font-medium">{pageState.page * pageState.perPage + 1}</span> to <span className="font-medium">{Math.min(totalItems, pageState.page * pageState.perPage + pageState.perPage)}</span> of{' '}
						<span className="font-medium">{totalItems}</span> results
					</p>
				</div>
				<div className='space-x-2'>
					<nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md">
						<select className="rounded-md mx-2 px-1.5 py-2 text-bold text-gray-500 dark:text-gray-400 inset-ring inset-ring-gray-500 dark:inset-ring-gray-700 disabled:opacity-50 dark:bg-gray-950" value={pageState.perPage} onChange={handlePerPageChange}>
							<option value={20}>20</option>
							<option value={30}>30</option>
							<option value={40}>40</option>
							<option value={50}>50</option>
						</select>
						<button
							className="relative inline-flex items-center rounded-l-md px-2 py-2 text-bold text-gray-500 dark:text-gray-400 inset-ring inset-ring-gray-500 dark:inset-ring-gray-700 enabled:hover:bg-gray-200 enabled:dark:hover:bg-white/5 focus:z-20 focus:outline-offset-0"
							onClick={handlePrevPageClick}
							disabled={pageState.page === 0} >
							<span aria-hidden="true" className="size-5">{"<"}</span>
						</button>
						{startPages.map((pageNum) => {

							return (
								<button
									aria-current="page"
									key={pageNum}
									className={"inline-flex items-center px-4 py-2 text-sm font-semibold " + (pageNum === pageState.page + 1 ? selectedClasses : unselectedClasses)}
									onClick={() => { selectPageHandle(pageNum - 1) }} >
									{pageNum}
								</button>
							)
						})}
						{isInputPageShown &&
							<form onSubmit={handlePageChange}>
								<input
									ref={dynamicPageRef}
									className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 inset-ring inset-ring-gray-500 dark:inset-ring-gray-700 focus:outline-offset-0 w-12 text-center ${isDynamicPageSelected ? "bg-indigo-500" : ""}`}
									defaultValue={dynamicPageInputValue}
									onBlur={dynamicPageBlurHandler}
									name='dynamicPage' >
								</input>
							</form>
						}
						{endPages.map((pageNum) => {
							return (<button
								aria-current="page"
								key={pageNum}
								onClick={() => { selectPageHandle(pageNum - 1) }}
								className={"inline-flex items-center px-4 py-2 text-sm font-semibold " + (pageNum === pageState.page + 1 ? selectedClasses : unselectedClasses)} >
								{pageNum}
							</button>)
						})}
						<button
							className="relative inline-flex items-center rounded-r-md px-2 py-2 text-bold text-gray-500 dark:text-gray-400 inset-ring inset-ring-gray-500 dark:inset-ring-gray-700 enabled:hover:bg-gray-200 enabled:dark:hover:bg-white/5 focus:z-20 focus:outline-offset-0"
							onClick={handleNextPageClick}
							disabled={pageState.page === totalPages - 1} >
							<span aria-hidden="true" className="size-5" >{">"}</span>
						</button>
					</nav>
				</div>
			</div>
		</div>
	);
}

export default PaginationPanel;
