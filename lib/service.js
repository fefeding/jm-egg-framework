/**
 * typeorm基础orm类
 * @github: https://github.com/typeorm/typeorm
 */
const { Service } = require('egg');
const path = require('path');
const EGG_PATH = Symbol.for('egg#eggPath');
const { createConnections, createConnection, 
    Connection,  FindManyOptions, 
    getConnectionManager, FindOneOptions } = require("typeorm");


/**
 * 继承自egg的Service，
 * 对typeorm的更低级的封装
 */
class BaseService extends Service {   

    /**
     * 基础DB服务
     * @param ctx egg  的context
     * @param modelType 当前关联的model
     */
    constructor(ctx, modelType = null, dbName = 'default') {
        super(ctx);
        if(modelType) {
            this.modelType = modelType;
        }
        if(dbName) {
            this.dbName = dbName;
        }
    } 
    
    get [EGG_PATH]() {
        return path.dirname(__dirname);
    }

    /**
     * 当前绑定的基础类型
     */
    modelType = null;

    /**
     * db配置名称
     */
    dbName = 'default';

    /**
     * 默认库
     * 在config.mysql.clients中配置的default库
     */
    async defaultDB() {
        let conn = await this.getConnection(this.dbName);
        return conn;
    }

    /**
     * 通过配置名获取DB连接信息
     * @param name config的mysql.clients中的配置key
     */
    async getConnection(name = 'default') {
        if(name instanceof Connection) return name;
        if(typeof name == 'string') {
            let manager = getConnectionManager();
            // 如果已经存在连接，并且active，直接返回
            if(manager.has(name)) {
                let conn = manager.get(name);
                if(!conn.isConnected) return await conn.connect();
                return conn;
            }

            await createConnections(this.config.mysql.clients);        
            if(manager.has(name)) {
                return manager.get(name);
            }
            else {
                throw Error(`config.mysql.clients 中不存在${name}的配置`);
            }
        }
        else {
            return await createConnection(name);
        }
    }

    /**
     * 获取typeorm 的 Repository
     * https://typeorm.io/#/repository-api
     */
    async getRespository(db = 'default', type = this.modelType) {
        db = await this.getConnection(db);
        let res = db.getRepository(type);
        return res;
    }    
}

/**
 * 继承自BaseService
 * 针对model 一对一的DB orm操作
 */
module.exports = class BaseTypeService extends BaseService {
    
    /**
     * 基础DB服务
     * @param ctx egg  的context
     * @param modelType 当前关联的model
     */
    constructor(ctx, modelType = null, dbName = 'default') {
        super(ctx, modelType, dbName);
    }

    /**
     * 接口文档： https://typeorm.io/#/find-options
     * userRepository.find({ where: { firstName: "Timber", lastName: "Saw" } });
     * or: userRepository.find({
        where: [
            { firstName: "Timber", lastName: "Saw" },
            { firstName: "Stan", lastName: "Lee" }
        ],
        order: {
            name: "ASC",
            id: "DESC"
        },
        skip: 5,
        take: 10
        });
     * userRepository.find({ 
            join: {
                alias: "user",
                leftJoinAndSelect: {
                    profile: "user.profile",
                    photo: "user.photos",
                    video: "user.videos"
                }
            }
        });
        https://typeorm.io/#/find-options
     * @param options {FindManyOptions<T>} 查找参数
     */
    async find(options, db = 'default', type = this.modelType) {
        let res = await this.getRespository(db, type);
        let data = await res.find(options); 
        return data;
    }

    /**
     * 获取第一条符合的model对象
     * @param options {FindOneOptions<T>} 查询条件，例如: {id:1}
     * @param db 数据库
     * @param type model类型
     */
    async get(options, db, type) {
        let res = await this.getRespository(db, type);
        if(typeof options == 'object') {
            return await res.findOne(options);
        }
        else {
            return await res.findOne(options);
        }
    }

    /**
     * 获取当前表所有数据
     * @param db 访问DB，默认为default
     * @param type 当前查询的model类型
     */
    async getAll(db = 'default', type = this.modelType) {
        return await this.find({}, db, type);
    }

    /**
     * 修改或新增
     * @param data model对象
     * @param db 数据库
     */
    async save(data, db = 'default') {
        let res = await this.getRespository(db);
        return res.save(data);
    }

    /**
     * 删除某条记录
     * @param data 需要删除的对象
     * @param db DB
     */
    async remove(data, db = 'default') {
        let res = await this.getRespository(db);
        return res.remove(data);
    }
}