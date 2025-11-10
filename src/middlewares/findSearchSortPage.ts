// findSearchSortPage Middleware for TypeScript
import { Request, Response, NextFunction } from "express";
import {
  Model,
  Document,
  FilterQuery,
  SortOrder,
  PopulateOptions,
} from "mongoose";

// Arayüz (interface) ile döndürülecek pagination detaylarının yapısını tanımlıyoruz.
interface IPaginationDetails {
  search: object;
  sort: object;
  skip: number;
  limit: number;
  page: number;
  pages:
    | {
        previous: number | false;
        current: number;
        next: number | false;
        total: number;
      }
    | false;
  totalRecords: number;
}

// Mongoose'un populate tipini daha okunabilir hale getirelim.
type Populator = string | PopulateOptions | (string | PopulateOptions)[];

// TypeScript'in Express'in Response nesnesini tanımasını ve
// eklediğimiz yeni metodları bilmesini sağlamak için declaration merging kullanıyoruz.
declare global {
  namespace Express {
    interface Response {
      getModelList: <T extends Document>(
        Model: Model<T>,
        filters?: FilterQuery<T>,
        populate?: Populator
      ) => Promise<T[]>;

      getModelListDetails: <T extends Document>(
        Model: Model<T>,
        filters?: FilterQuery<T>
      ) => Promise<IPaginationDetails>;
    }
  }
}

export const findSearchSortPage = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // SEARCHING: URL?search[key1]=value1&search[key2]=value2
  const search = req.query?.search
    ? (req.query.search as { [key: string]: string })
    : {};

  const searchRegex: FilterQuery<any> = {};
  for (const key in search) {
    searchRegex[key] = { $regex: search[key], $options: "i" };
  }

  // SORTING: URL?sort[key1]=asc&sort[key2]=desc
  const sort: { [key: string]: SortOrder } = req.query?.sort
    ? (req.query.sort as { [key: string]: SortOrder })
    : {};

  // PAGINATION: URL?page=1&limit=10
  let limit = Number(req.query?.limit) || 20;
  limit = limit > 0 ? limit : 20;

  let page = Number(req.query?.page);
  page = page > 0 ? page - 1 : 0;

  let skip = Number(req.query?.skip);
  skip = skip > 0 ? skip : page * limit;

  res.getModelList = async <T extends Document>(
    Model: Model<T>,
    filters: FilterQuery<T> = {},
    populate?: Populator
  ): Promise<T[]> => {
    const filtersAndSearch: FilterQuery<T> = { ...filters, ...searchRegex };

    const query = Model.find(filtersAndSearch);

    
    if (populate) {
      query.populate(populate as any);
    }

    // Sorguyu en son çalıştırıyoruz.
    return await query.exec();
  };

  res.getModelListDetails = async <T extends Document>(
    Model: Model<T>,
    filters: FilterQuery<T> = {}
  ): Promise<IPaginationDetails> => {
    const filtersAndSearch: FilterQuery<T> = { ...filters, ...searchRegex };

    const dataCount = await Model.countDocuments(filtersAndSearch);
    const totalPages = Math.ceil(dataCount / limit);

    const details: IPaginationDetails = {
      search,
      sort,
      skip,
      limit,
      page: page + 1,
      pages: {
        previous: page > 0 ? page : false,
        current: page + 1,
        next: page + 2 <= totalPages ? page + 2 : false,
        total: totalPages,
      },
      totalRecords: dataCount,
    };

    if (details.totalRecords <= limit) {
      details.pages = false;
    }

    return details;
  };

  next();
};
