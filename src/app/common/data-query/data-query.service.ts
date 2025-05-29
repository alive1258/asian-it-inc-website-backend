import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ObjectLiteral, Repository, Brackets } from 'typeorm';

import { PaginationQueryDto } from './dto/data-query.dto';
import { IPagination } from './pagination.interface';

// Define a DTO or interface for the parameter object
interface DataQueryParams<T extends ObjectLiteral> {
  paginationQuery: PaginationQueryDto;
  searchableFields: string[];
  repository: Repository<T>;
  relations?: string[];
  sumFields?: string[];
  selectRelations?: string[];
  select?: string[];
}

@Injectable()
export class DataQueryService {
  constructor(
    /**
     * Inject Request form express
     */
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  public async dataQuery<T extends ObjectLiteral>({
    paginationQuery,
    searchableFields,
    repository,
    select = [],
    relations = [],
    sumFields = [],
    selectRelations = [],
  }: DataQueryParams<T>): Promise<IPagination<T>> {
    // Ensure page and limit are numbers, providing default values if necessary
    const page = Number(paginationQuery.page) || 1;
    const limit = Number(paginationQuery.limit) || 10;
    const { search, filters } = paginationQuery;

    const queryBuilder = repository.createQueryBuilder('entity');

    // Dynamically join relations based on the passed relations array
    relations.forEach((relation) => {
      if (!relation.includes('.')) {
        queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
      }
    });

    // Dynamically join nested relations
    relations.forEach((relation) => {
      if (relation.includes('.')) {
        const relationAlias = relation.replace(/\./g, '_');
        const [alias, column] = relation.split('.');
        queryBuilder.leftJoinAndSelect(`${alias}.${column}`, relationAlias);
      }
    });

    // Apply select only to relational fields while keeping all entity fields
    if (selectRelations.length > 0) {
      queryBuilder.select(['entity', ...selectRelations]);
    }
    if (select && select.length > 0) {
      queryBuilder.select(
        select.map((field) => `entity.${field}`).concat(selectRelations),
      );
    }

    // Apply filters to the query builder

    if (filters && Object.keys(filters).length > 0) {
      for (const [field, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null && value !== '') {
          if (field.includes('.')) {
            const [alias, column] = field.split('.');
            const paramKey = `${alias}_${column}`;
            queryBuilder.andWhere(`${alias}.${column} = :${paramKey}`, {
              [paramKey]: value,
            });
          } else {
            queryBuilder.andWhere(`entity.${field} = :${field}`, {
              [field]: value,
            });
          }
        }
      }
    }

    // Add search logic (OR conditions)
    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          searchableFields.forEach((field) => {
            qb.orWhere(`entity.${field} ILIKE :search`, {
              search: `%${search}%`,
            });
          });
        }),
      );
    }

    // Apply pagination
    queryBuilder.skip((page - 1) * limit).take(limit);

    if (repository.metadata.propertiesMap.created_at) {
      queryBuilder.orderBy({ 'entity.created_at': 'DESC' });
    }

    // Dynamically calculate sum fields
    const sumQueryBuilder = repository.createQueryBuilder('entity');
    // Dynamically join relations based on the passed relations array
    relations.forEach((relation) => {
      if (!relation.includes('.')) {
        sumQueryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
      }
    });

    // Dynamically join nested relations
    relations.forEach((relation) => {
      if (relation.includes('.')) {
        const relationAlias = relation.replace(/\./g, '_');
        const [alias, column] = relation.split('.');
        sumQueryBuilder.leftJoinAndSelect(`${alias}.${column}`, relationAlias);
      }
    });

    // Dynamically calculate sum fields
    if (sumFields.length > 0) {
      // Add SUM for each specified field
      sumQueryBuilder
        .select(
          sumFields.map((field) => `SUM(entity.${field}) AS sum_${field}`),
        )
        .getRawOne(); // Use getRawOne to return a single object with sums

      // Optionally, you can reset other selections or filter further here
    }

    // Apply filters to the sum query builder

    if (filters && Object.keys(filters).length > 0) {
      for (const [field, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null && value !== '') {
          if (field.includes('.')) {
            const [alias, column] = field.split('.');
            const paramKey = `${alias}_${column}`;
            sumQueryBuilder.andWhere(`${alias}.${column} = :${paramKey}`, {
              [paramKey]: value,
            });
          } else {
            sumQueryBuilder.andWhere(`entity.${field} = :${field}`, {
              [field]: value,
            });
          }
        }
      }
    }

    // Add search logic to the sum query builder
    if (search) {
      sumQueryBuilder.andWhere(
        new Brackets((qb) => {
          searchableFields.forEach((field) => {
            qb.orWhere(`entity.${field} ILIKE :search`, {
              search: `%${search}%`,
            });
          });
        }),
      );
    }

    const [results, total] = await queryBuilder.getManyAndCount();
    const sums = await sumQueryBuilder.execute();

    // Pagination meta and links
    const totalPages = Math.ceil(total / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    const previousPage = page > 1 ? page - 1 : null;

    const baseUrl = `${this.request.protocol}://${this.request.headers.host}/`;
    const newUrl = new URL(this.request.url, baseUrl);

    return {
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
      links: {
        first: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=1`,
        last: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${totalPages}`,
        current: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${page}`,
        next: nextPage
          ? `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${nextPage}`
          : '',

        previous: previousPage
          ? `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${previousPage}`
          : '',
      },
      data: results,
      sums: sumFields?.length ? sums : [], // Include dynamic sum results
    };
  }
}
