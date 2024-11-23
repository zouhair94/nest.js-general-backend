import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';

/**
 * @description added this class in order to use the repository patten
 */
export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  /**
   * Create method to add a new document to the collection
   * @param document - The document to be created
   * @returns - The created document
   */
  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  /**
   * Find method to perform basic queries on the collection
   * @param filter - The filter query object
   * @returns - The filtered documents
   */
  async findOne(
    filterQuery: FilterQuery<TDocument>,
    select: string = null,
  ): Promise<TDocument> {
    const document = await this.model
      .findOne(filterQuery, select)
      .lean<TDocument>(true);

    return document;
  }

  /**
   * Find method to perform basic queries on the collection
   * @param filter - The filter query object
   * @param update - data to update
   * @returns - The filtered documents
   */
  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, { new: true })
      .lean<TDocument>();

    if (!document) {
      this.logger.warn(
        `Document wasn't found with the filterQuery`,
        filterQuery,
      );

      throw new NotFoundException("Document wasn't found");
    }

    return document;
  }

  /**
   * Find method to perform basic queries on the collection
   * @param filter - The filter query object
   * @param offset - offset used for pagination
   * @param limit - used for pagination and data limitation
   * @returns - The filtered documents
   */
  async find(
    filterQuery: FilterQuery<TDocument>,
    offset = null,
    limit = null,
  ): Promise<TDocument[]> {
    // if pagination is needed
    if (offset && limit) {
      return await this.model
        .find(filterQuery)
        .skip(offset)
        .limit(limit)
        .lean<TDocument[]>(true);
    }
    return await this.model.find(filterQuery).lean<TDocument[]>(true);
  }

  /**
   * Find method to perform basic queries on the collection
   * @param filter - The filter query object
   * @returns - The filtered documents
   */
  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    return (await this.model
      .findOneAndDelete(filterQuery)
      .lean(true)) as unknown as TDocument;
  }

  /**
   * Aggregation method to perform complex queries on the collection
   * @param pipeline - The aggregation pipeline to be executed
   * @returns - Result of the aggregation as a promise
   */
  async aggregate(pipline: any[]): Promise<any[]> {
    return await this.model.aggregate(pipline);
  }
}
