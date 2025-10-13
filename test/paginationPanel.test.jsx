import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaginationPanel from '../src/components/UI/PaginationPanel';

const defaultProps = {
	totalItems: 100,
	totalPages: 10,
	pageState: { page: 0, perPage: 10 },
	setPageState: vi.fn(),
};

const renderComponent = (props = {}) => {
	return render(<PaginationPanel {...defaultProps} {...props} />);
};

describe('PaginationPanel', () => {
	describe('Rendering', () => {
		it('renders all basic elements correctly', () => {
			renderComponent();
			expect(screen.getByLabelText("paginationStatus")).toHaveTextContent("Showing 1 to 10 of 100 results")
			expect(screen.getByRole('combobox')).toBeInTheDocument();
			expect(screen.getByLabelText('Pagination')).toBeInTheDocument();
			expect(screen.getByRole('button', { name: '<' })).toBeInTheDocument();
			expect(screen.getByRole('button', { name: '>' })).toBeInTheDocument();
		});

		it('renders correct page numbers based on totalPages', () => {
			renderComponent({ totalPages: 5 });
			const paginationController = screen.getByRole("navigation", { name: "Pagination" })
			expect(within(paginationController).getByText('1')).toBeInTheDocument();
			expect(within(paginationController).getByText('2')).toBeInTheDocument();
			expect(within(paginationController).getByText('4')).toBeInTheDocument();
			expect(within(paginationController).getByText('5')).toBeInTheDocument();
		});

		it('renders dynamic page input when totalPages > 5', () => {
			renderComponent({ totalPages: 6 });
			expect(screen.getByDisplayValue('...')).toBeInTheDocument();

		});

		it("doesnt render dynamic page input when totalPages <= 5", () => {
			renderComponent({ totalPages: 5 });
			expect(screen.queryByDisplayValue('...')).not.toBeInTheDocument();

		})

		it('shows correct selected page state', () => {
			renderComponent({ pageState: { page: 1, perPage: 10 } });

			const page2Button = screen.getByText('2');
			expect(page2Button).toHaveClass('bg-indigo-500');
			expect(page2Button).toHaveClass('text-white');
		});
	});

	describe('User Interactions', () => {
		it('calls setPageState with correct values when page number is clicked', async () => {
			const user = userEvent.setup();
			const setPageState = vi.fn();
			renderComponent({ setPageState });

			await user.click(screen.getByText('2'));

			expect(setPageState).toHaveBeenCalledWith(expect.any(Function));
			const updateFn = setPageState.mock.calls[0][0];
			expect(updateFn({ page: 0, perPage: 10 })).toEqual({ page: 1, perPage: 10 });
		});

		it('handles previous page click correctly', async () => {
			const user = userEvent.setup();
			const setPageState = vi.fn();
			renderComponent({
				pageState: { page: 1, perPage: 10 },
				setPageState
			});

			await user.click(screen.getByRole('button', { name: '<' }));

			expect(setPageState).toHaveBeenCalledWith(expect.any(Function));
			const updateFn = setPageState.mock.calls[0][0];
			expect(updateFn({ page: 1, perPage: 10 })).toEqual({ page: 0, perPage: 10 });
		});

		it('handles next page click correctly', async () => {
			const user = userEvent.setup();
			const setPageState = vi.fn();
			renderComponent({ setPageState });

			await user.click(screen.getByRole('button', { name: '>' }));

			expect(setPageState).toHaveBeenCalledWith(expect.any(Function));
			const updateFn = setPageState.mock.calls[0][0];
			expect(updateFn({ page: 0, perPage: 10 })).toEqual({ page: 1, perPage: 10 });
		});

		it('disables previous button on first page', () => {
			renderComponent({ pageState: { page: 0, perPage: 10 } });

			expect(screen.getByRole('button', { name: '<' }).disabled).toBe(true);
		});

		it('disables next button on last page', () => {
			renderComponent({
				pageState: { page: 9, perPage: 10 },
				totalPages: 10
			});

			expect(screen.getByRole('button', { name: '>' }).disabled).toBe(true);
		});
	});

	describe('Per Page Selection', () => {
		it('renders all per page options', () => {
			renderComponent();

			const select = screen.getByRole('combobox');
			expect(select).toHaveValue('10');

			const options = screen.getAllByRole('option');
			expect(options).toHaveLength(6);
			expect(options.map(opt => opt.textContent)).toEqual(['5', '10', '20', '30', '40', '50']);
		});

		it('calls setPageState with correct values when per page changes', async () => {
			const user = userEvent.setup();
			const setPageState = vi.fn();
			renderComponent({ setPageState });

			await user.selectOptions(screen.getByRole('combobox'), '20');

			expect(setPageState).toHaveBeenCalledWith(expect.any(Function));
			const updateFn = setPageState.mock.calls[0][0];
			const result = updateFn({ page: 0, perPage: 10 });
			expect(result.perPage).toBe(20);
			expect(result.page).toBe(0);
		});
	});

	describe('Dynamic Page Input', () => {
		it('updates page when valid page number is entered', async () => {
			const user = userEvent.setup();
			const setPageState = vi.fn();
			renderComponent({
				totalPages: 10,
				setPageState
			});

			const input = screen.getByDisplayValue('...');
			await user.click(input);
			await user.type(input, '5');
			fireEvent.blur(input);

			expect(setPageState).toHaveBeenCalledWith(expect.any(Function));
			const updateFn = setPageState.mock.calls[0][0];
			expect(updateFn({ page: 0, perPage: 10 })).toEqual({ page: 4, perPage: 10 });
		});

		it('does not update page when invalid page number is entered', async () => {
			const user = userEvent.setup();
			const setPageState = vi.fn();
			renderComponent({
				totalPages: 10,
				setPageState
			});

			const input = screen.getByDisplayValue('...');
			await user.click(input);
			await user.type(input, '15');
			fireEvent.blur(input);

			expect(setPageState).not.toHaveBeenCalled();
		});

		it('resets input value to awaiting user focus when invalid page is entered', async () => {
			const user = userEvent.setup();
			renderComponent({ totalPages: 10, pageState: { page: 5, perPage: 5 } });

			const input = screen.getByDisplayValue('5');
			await user.click(input);
			await user.type(input, '15');
			fireEvent.blur(input);

			expect(input.value === "5").toBe(true);
		});
		it('resets input value to current page when invalid page is entered and currentPage is not from the fixed ones', async () => {
			const user = userEvent.setup();
			renderComponent({ totalPages: 10 });

			const input = screen.getByDisplayValue('...');
			await user.click(input);
			await user.type(input, '15');
			fireEvent.blur(input);

			expect(input.value === "...").toBe(true);
		});

		it('submits form on Enter key', async () => {
			const user = userEvent.setup();
			const setPageState = vi.fn();
			renderComponent({
				totalPages: 10,
				setPageState
			});

			const input = screen.getByDisplayValue('...');
			await user.click(input);
			await user.type(input, '3{enter}');

			expect(setPageState).toHaveBeenCalled();
		});
	});

	describe('Edge Cases', () => {
		it('handles single page correctly', () => {
			renderComponent({
				totalItems: 5,
				totalPages: 1,
				pageState: { page: 0, perPage: 10 }
			});

			expect(screen.getByLabelText("paginationStatus")).toHaveTextContent("Showing 1 to 5 of 5 results");
			const paginationController = screen.getByRole("navigation", { name: "Pagination" })
			expect(within(paginationController).getByText('1')).toBeInTheDocument();
			expect(within(paginationController).queryByText('2')).not.toBeInTheDocument();
		});

		it('adjusts page when perPage change would make current page out of bounds', async () => {
			const user = userEvent.setup();
			const setPageState = vi.fn();
			renderComponent({
				totalItems: 100,
				totalPages: 10,
				pageState: { page: 9, perPage: 10 },
				setPageState
			});
			await user.selectOptions(screen.getByRole('combobox'), '20');

			const updateFn = setPageState.mock.calls[0][0];
			const result = updateFn({ page: 9, perPage: 10 });
			expect(result.page).toBe(4);
			expect(result.perPage).toBe(20);
		});

		it('shows correct results text for last page', () => {
			renderComponent({
				totalItems: 95,
				pageState: { page: 9, perPage: 10 }
			});

			expect(screen.getByLabelText("paginationStatus")).toHaveTextContent("Showing 91 to 95 of 95 results")
		});
	});
});