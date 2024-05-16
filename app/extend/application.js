'use strict';

const CacheKey = Symbol('application_cache');
const SessionKey = Symbol('jv#application#session#cache');
const AppCache = {
    [CacheKey]: {
        [SessionKey]: {}
    },
    get(key) {
        return this[CacheKey][key];
    },
    set(key, value) {
        this[CacheKey][key] = value;
    },
    session: {
        get(id) {
            const sessions = AppCache.get(SessionKey);
            return sessions[id];
        },
        set(id, session) {
            const sessions = AppCache.get(SessionKey);
            sessions[id] = session;
        },
        // 清理过期的
        clear(timeout) {
            try {
                const sessions = AppCache.get(SessionKey);
                // 如果在缓存时间内
                if(sessions) {
                    for(const s in sessions) {
                        const session = sessions[s];
                        if(!session) continue;
                        if(session.cacheTime < Date.now() - timeout) {
                            delete sessions[s];
                        }
                    }
                }
            }
            catch(e) {
                console.error(e);
            }
        }
    }
};
module.exports = {
    jmCache: AppCache
};