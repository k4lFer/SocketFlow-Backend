export class PagedResult<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;

    constructor(items: T[], totalCount: number, pageNumber: number, pageSize: number) {
        this.items = items;
        this.totalCount = totalCount;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }

    get totalPages(): number {
        return this.pageSize > 0 ? Math.ceil(this.totalCount / this.pageSize) : 0;
    }

    get hasNextPage(): boolean {
        return this.pageNumber < this.totalPages;
    }

    get hasPreviousPage(): boolean {
        return this.pageNumber > 1;
    }
}