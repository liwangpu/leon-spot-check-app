import { Injectable } from '@angular/core';
import { LoggerSvr } from '../loggerSvr';

interface NodeType {
    AlarmSet: string
}

enum CompareTypeEnum {
    /// 超上限报警
    UpperLimit = 0,
    /// 超下限报警
    LowerLimit = 1,
    /// 区域（窗）内报警
    InsideWindow = 2,
    /// 区域（窗）外报警
    OutsideWindow = 3
};

/**
 * 测量值报警服务类
 * 提供观察量/数值量报警判断等相关
 */
@Injectable()
export class AlarmSvr {

    constructor(private logger: LoggerSvr) {

    }


    /**
     * 检查观察量报警等级
     * @param node 节点
     * @param strObsId 
     */
    public checkObsAlarm(node: NodeType, strObsId: string): number {
        let iLevel = 0;
        let arrObsId: Array<string> = strObsId ? strObsId.split(',') : [];
        let alarmSet = node.AlarmSet ? JSON.parse(node.AlarmSet) : {};
        try {
            if (alarmSet && alarmSet.RULES && alarmSet.RULES.RULE && alarmSet.RULES.RULE.RTYPE == "0" && alarmSet.RULES.RULE.OBS && alarmSet.RULES.RULE.OBS.length) {
                let obsSet = alarmSet.RULES.RULE.OBS;
                for (let idx = 0; idx < arrObsId.length; idx++) {
                    for (let sidx = 0; sidx < obsSet.length; sidx++) {
                        if (parseInt(obsSet[sidx].__text) == parseInt(arrObsId[idx])) {
                            let tmpLevel = obsSet[sidx]._LEVEL;
                            if (tmpLevel > iLevel)
                                iLevel = tmpLevel;
                        }
                    }
                }
            }
        } catch (e) {
            this.logger.log('Obs alarm check faild:', e, true);
        }
        return iLevel;
    }

    /**
     * 检测数值量报警等级
     * @param node 节点
     * @param dValue 
     */
    public checkNumericAlarm(node: NodeType, dValue: number): number {
        let iLevel = 0;
        let alarmSet = node.AlarmSet ? JSON.parse(node.AlarmSet) : {};
        try {
            if (alarmSet && alarmSet.RULES && alarmSet.RULES.RULE && alarmSet.RULES.RULE.RTYPE == "1" && alarmSet.RULES.RULE.INDC == "17" && alarmSet.RULES.RULE.LEVEL && alarmSet.RULES.RULE.LEVEL.length) {
                let iCType = parseInt(alarmSet.RULES.RULE.CTYPE);
                let levels = alarmSet.RULES.RULE.LEVEL;
                for (let idx = 0; idx < levels.length; idx++) {
                    let curLevel = levels[idx];
                    let level = parseInt(curLevel.LV);
                    let min = parseFloat(curLevel.MIN);
                    let max = parseFloat(curLevel.MAX);
                    if (iCType == CompareTypeEnum.UpperLimit) {
                        if (dValue >= max && iLevel < level)
                            iLevel = level;
                    } else if (iCType == CompareTypeEnum.LowerLimit) {
                        if (dValue <= min && iLevel < level)
                            iLevel = level;
                    } else if (iCType == CompareTypeEnum.InsideWindow) {
                        if (dValue >= min && dValue <= max && iLevel < level)
                            iLevel = level;
                    } else if (iCType == CompareTypeEnum.OutsideWindow) {
                        if ((dValue <= min || dValue >= max) && iLevel < level)
                            iLevel = level;
                    }
                }
            }
        } catch (e) {
            this.logger.log('Numeric alarm check faild :', e, true);
        }
        return iLevel;
    }

}
