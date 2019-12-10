'use strict';

import {Entity, BaseEntity, PrimaryColumn, Column} from "typeorm";


/**
 * 激活状态: 1=在用， 2=被禁用，3=已下线
 */
export enum EStatus {
  /**
   * 已激活
   */
  ACTIVED = 1,
  /**
   * 已禁用
   */
  DISABLED = 2,
  /**
   * 已下线
   */
  OFFLINE = 3
}

@Entity('t_session')
export default class Session extends BaseEntity {
  @PrimaryColumn({
    name: 'Fid',
    type: 'varchar',
    comment: '登录态token',
    length: 64,
    nullable: false
  })
  public id?: string = "";

  @Column({
    name: 'Fvalue',
    type: 'varchar',
    length: 512
  })
  public value?: string = "";  

  @Column({
    name: 'Fstatus',
    type: 'int',
    default: EStatus.ACTIVED
  })
  public status?: EStatus = EStatus.ACTIVED; 

  @Column({
    name: 'Flast_date',
    type: 'datetime'
  })
  public lastDate = new Date();  
}