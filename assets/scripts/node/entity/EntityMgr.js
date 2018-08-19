cc.Class({
    ctor(){
        this.allEntityType = {
            EntityPoint:{class:require("EntityPoint"),layer:"point"},
            EntityFloor:{class:require("EntityFloor"),layer:"floor"},
            EntityBorn:{class:require("EntityBorn"),layer:"born"},
            EntityTarget:{class:require("EntityTarget"),layer:"target"},
            EntityMonster:{class:require("EntityMonster"),layer:"monster"},

            TowerSlowDown:{class:require("TowerSlowDown"),layer:"tower"},
            TowerPistol:{class:require("TowerPistol"),layer:"tower"},
            TowerMachinegun:{class:require("TowerMachinegun"),layer:"tower"},
            TowerLaser:{class:require("TowerLaser"),layer:"laser"},
            TowerGuidemissile:{class:require("TowerGuidemissile"),layer:"tower"},
            TowerFire:{class:require("TowerFire"),layer:"fire"},
            TowerBomb:{class:require("TowerBomb"),layer:"tower"},

            BulletBomb:{class:require("BulletBomb"),layer:"effect"},
            BulletFire:{class:require("BulletFire"),layer:"effect"},
            BulletGuidemissile:{class:require("BulletGuidemissile"),layer:"effect"},
            BulletLaser:{class:require("BulletLaser"),layer:"effect"},
            BulletPistol:{class:require("BulletPistol"),layer:"effect"},
            BulletBombEffect:{class:require("BulletBombEffect"),layer:"effect"},
        };

        var PoolMgr = require("PoolMgr");
        this.poolMgr = new PoolMgr;
        this.poolMgr.setBuildFunc(function(entityType){
            var entityClass = this.allEntityType[entityType].class;
            var entity = new entityClass();
            entity._entity_uuid_ = this._entity_uuid_;
            this._entity_uuid_++;

            entity.entityType = entityType;
            return entity;
        }.bind(this));
        this.poolMgr.setDestroyFunc(function(entityType,entity){
            if(cc.isValid(entity)){
                entity.unInitEntity();
                entity.destroy();
            }
        }.bind(this));

        this.recycleList = undefined;
        this.entityLayerMap = undefined;
        this.aliveEntityMap = undefined;
        this._entity_uuid_ = 1;
    },
    initEntityMgr(layerMap){
        this.entityLayerMap = layerMap;
        this.aliveEntityMap = {};
        this.recycleList = [];
        this._entity_uuid_ = 1;
        this.monsterEntityNum = 0;
    },
    unInitEntityMgr(){
        this.poolMgr.destroy();
        this.recycleList = [];
        this.entityLayerMap = undefined;
        this.aliveEntityMap = {};
        this._entity_uuid_ = 1;
    },
    createEntity(entityType,x,y,...args){
        var entity = this.poolMgr.get(entityType);
        if(this.aliveEntityMap[entity._entity_uuid_]){
            cc.error("EntityMgr:createEntity entity is already active");
            return;
        }else{
            this.aliveEntityMap[entity._entity_uuid_] = entity;
        }

        entity.parent = this.entityLayerMap[this.allEntityType[entityType].layer];
        entity.active = true;
        entity.initEntity(...args);
        entity.x = x;
        entity.y = y;

        return entity;
    },
    createEntityNotInLayer(entityType,...args){
        var entity = this.poolMgr.get(entityType);

        if(this.aliveEntityMap[entity._entity_uuid_]){
            cc.error("EntityMgr:createEntity entity is already active");
            return;
        }else{
            this.aliveEntityMap[entity._entity_uuid_] = entity;
        }

        entity.active = true;
        entity.initEntity(...args);
        return entity;
    },
    clearEntityByType(entityType){
        var useList = this.poolMgr.getUse(entityType);
        for(var key in useList){
            var entity = useList[key];
            if(entity){
                this.clearEntity(entity);
            }
        }
    },
    clearEntity(entity){
        if(!entity.active)return;
        this.recycleList.push(entity);
        entity.unInitEntity();
        entity.removeFromParent();
        entity.active = false;
    },
    logicUpdate(dt){
        this.monsterEntityNum = 0;
        for(var key in this.aliveEntityMap){
            var entity = this.aliveEntityMap[key];
            if(!entity)continue;
            if(entity.logicUpdate&&entity.active){
                entity.logicUpdate(dt);
            }
            if(entity.active && entity.entityType == "EntityMonster"){
                this.monsterEntityNum ++ ;
            }
        }
        for(var i=0;i<this.recycleList.length;i++){
            var entity = this.recycleList[i];
            delete this.aliveEntityMap[entity._entity_uuid_];
            this.poolMgr.push(entity.entityType,entity);
        }
        this.recycleList = [];
    },
    getMonsterNum(){
        return this.monsterEntityNum;
    },
    getNearEntity(entity,targetEntityType){
        var findTarget = undefined;
        var findDis = undefined;
        for(var key in this.aliveEntityMap){
            var target = this.aliveEntityMap[key];
            if(target.isAlive()&&target.entityType == targetEntityType){
                var nowDis = cc.utils.dis2(entity,target);
                if(!findTarget||findDis>nowDis){
                    findTarget = target;
                    findDis = nowDis;
                }
            }
        }
        return findTarget;
    }
});