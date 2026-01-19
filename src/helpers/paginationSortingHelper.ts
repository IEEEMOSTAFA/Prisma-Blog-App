import { SortOrder } from "../../generated/prisma/internal/prismaNamespace";

type IOptions = {
    page?: number | string;
    limit?: number | string;
    
    sortOrder ? : string;
    sortBy? : string;
}

type IOptionsResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: SortOrder;
}

const paginationSortingHelper = (options: IOptions): IOptionsResult => {
    const page: number = Number(options.page) || 1;
    const limit: number = Number(options.limit) || 10;
    const skip  = (page - 1) * limit

    const sortBy: string = options.sortBy || "created";

    // convert string to sortOrder
    // const sortOrder : string = options.sortOrder || "desc";
    const sortOrder: SortOrder = options.sortOrder === 'asc'? SortOrder.asc : SortOrder.desc;

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    }
};

export default paginationSortingHelper;