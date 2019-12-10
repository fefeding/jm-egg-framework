'use strict';export default class Condition {
  public title?: string;
  public categoryId?: number;
  public status?: number;
  public tag?: string;
  public pageIndex: number;
  public pageSize: number;
  public where: any = {};
  public like: any = {};
  public orderByField: string = 'createTime';
  public orderBy: string = 'desc';

  constructor() {
    this.title = undefined;
    this.categoryId = undefined;
    this.status = undefined;
    this.tag = undefined;
    this.pageIndex = 1;
    this.pageSize = 10;
    this.where = {};
    this.like = {};
  }
}