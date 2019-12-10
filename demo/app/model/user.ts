'use strict';

import {Entity, BaseEntity, PrimaryColumn, Column} from "typeorm";

/**
 * 性别
 */
export enum EGender {
/**
 * 未定义
 */
  INIT = 0,
  /**
   * 男性
   */
  MALE = 1,
  /**
   * 女性
   */
  FEMALE = 2
}

/**
 * 成员启用状态。1表示启用的成员，0表示被禁用
 */
export enum EEnable {
    /**
     * 禁用
     */
    DIABLE = 0,
    /**
     * 启用
     */
    ENABLE = 1
}

/**
 * 激活状态: 1=已激活，2=已禁用，4=未激活。
    已激活代表已激活企业微信或已关注微工作台（原企业号）。未激活代表既未激活企业微信又未关注微工作台（原企业号）。
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
     * 未激活
     */
    INACTIVATED = 4
}

@Entity('t_user')
export default class User extends BaseEntity {
  @PrimaryColumn({
    name: 'Fuserid',
    type: 'varchar',
    comment: '成员UserID。对应管理端的帐号，企业内必须唯一。不区分大小写，长度为1~64个字节',
    length: 64,
    nullable: false
  })
  public userid: string = "";

  @Column({
    name: 'Fname',
    type: 'varchar',
    comment: '成员名称',
    length: 32
  })
  public name: string = "";  

  @Column({
    name: 'Fmobile',
    type: 'varchar',
    comment: '手机号码',
    length: 32
  })
  public mobile: string = "";  

  @Column({
    name: 'Fposition',
    type: 'varchar',
    comment: '职务信息',
    length: 32
  })
  public position: string = "";  

  @Column({
    name: 'Fgender',
    type: 'int',
    comment: '性别。0表示未定义，1表示男性，2表示女性'
  })
  public gender: EGender = EGender.INIT;  

  @Column({
    name: 'Femail',
    type: 'varchar',
    comment: '邮箱',
    length: 32
  })
  public email: string = "";  

  @Column({
    name: 'Favatar',
    type: 'varchar',
    comment: '头像url',
    length: 256
  })
  public avatar: string = "";  

  @Column({
    name: 'Ftelephone',
    type: 'varchar',
    comment: '坐机号码',
    length: 32
  })
  public telephone: string = "";  

  @Column({
    name: 'Fenable',
    type: 'int',
    comment: '成员启用状态。1表示启用的成员，0表示被禁用。注意，服务商调用接口不会返回此字段'
  })
  public enable: EEnable = EEnable.ENABLE;  

  @Column({
    name: 'Fstatus',
    type: 'int',
    comment: '激活状态: 1=已激活，2=已禁用，4=未激活。已激活代表已激活企业微信或已关注微工作台（原企业号）。未激活代表既未激活企业微信又未关注微工作台（原企业号）。'
  })
  public status: EStatus = EStatus.ACTIVED;  

  @Column({
    name: 'Falias',
    type: 'varchar',
    comment: '别名',
    length: 32
  })
  public alias: string = "";  

  @Column({
    name: 'FqrCode',
    type: 'varchar',
    comment: '员工个人二维码，扫描可添加为外部联系人(注意返回的是一个url，可在浏览器上打开该url以展示二维码)；第三方仅通讯录应用可获取',
    length: 256
  })
  public qrCode: string = ""; 

  @Column({
    name: 'Faddress',
    type: 'varchar',
    comment: '地址',
    length: 128
  })
  public address: string = ""; 
}