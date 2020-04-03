import { BetLines, PlayerData, Outcome, OutcomeStatus } from "./../../data/PlayerData";
import { SlotDefinition } from "./../../data/ApplicationData";
import { getSymbolByField } from "./../../utils/DataHelper";
import { InjectableClass } from "./../../utils/Injector";

const reducerSum = (accumulator, currentValue) => accumulator + currentValue;

@InjectableClass()
export class ServerApiComponent {

    constructor(private slotDefinition: SlotDefinition) { }

    serverRequest(plyerData: PlayerData): Promise<PlayerData> {
        let reelPicture: string[][] = [];
        for (let i = 0; i < this.slotDefinition.reelPictureSize.length; i++) {
            reelPicture[i] = this.generateOneReelSegment(this.slotDefinition.stripes[i], this.slotDefinition.reelPictureSize[i]);
        }
        let autobotsSum = this.getAutobotsSum(reelPicture);
        let decepticonsSum = this.getDecepticonsSum(reelPicture);
        let outcomeStatus = this.setOutcomeStatus(autobotsSum, decepticonsSum, plyerData.betState.betLines);
        let outcomeBalance = this.getBalance(plyerData, outcomeStatus);
        let outcome: Outcome = {
            reelPicture: reelPicture,
            autobotsPointsSummary: autobotsSum,
            decepticonsPointsSummary: decepticonsSum,
            outcomeStatus: outcomeStatus,
        }
        return new Promise(resolve => {
            resolve({
                balance: outcomeBalance,
                betState: plyerData.betState,
                outcome: outcome
            });
        });
    }

    private generateOneReelSegment(strip: string[], reelLength: number): string[] {
        let reel = [];
        let delta = this.randomIntFromInterval(0, strip.length - 1);
        for (let i = 0; i < reelLength; i++) {
            reel.push(strip[delta]);
            delta = delta + 1 > strip.length - 1 ? 0 : delta + 1;
        }
        return reel
    }

    private getAutobotsSum(reelPicture: string[][]): number {
        return [
            this.getPointsById(reelPicture[0][0]),
            this.getPointsById(reelPicture[0][1]),
            this.getPointsById(reelPicture[0][2]),
            this.getPointsById(reelPicture[1][0]),
            this.getPointsById(reelPicture[1][1])
        ].reduce(reducerSum);
    }

    private getDecepticonsSum(reelPicture: string[][]): number {
        return [
            this.getPointsById(reelPicture[3][0]),
            this.getPointsById(reelPicture[3][1]),
            this.getPointsById(reelPicture[3][2]),
            this.getPointsById(reelPicture[2][0]),
            this.getPointsById(reelPicture[2][1])
        ].reduce(reducerSum);
    }

    private getPointsById(symbolId: string): number {
        return getSymbolByField("id", symbolId, this.slotDefinition).points;
    }

    private setOutcomeStatus(autobotsSum: number, decepticonsSum: number, betLines: BetLines): OutcomeStatus {
        let result: OutcomeStatus;
        if (autobotsSum === decepticonsSum) {
            result = OutcomeStatus.DRAW;
        } else if (betLines === BetLines.AUTOBOTS) {
            result = autobotsSum > decepticonsSum ? OutcomeStatus.WIN : OutcomeStatus.LOSE;
        } else if (betLines === BetLines.DECEPTICONS) {
            result = decepticonsSum > autobotsSum ? OutcomeStatus.WIN : OutcomeStatus.LOSE;
        }
        return result;
    }

    private getBalance(plyerData: PlayerData, outcomeStatus: OutcomeStatus): number {
        let result = plyerData.balance;
        if (outcomeStatus === OutcomeStatus.WIN) {
            result += plyerData.betState.betAmount;
        } else if (outcomeStatus === OutcomeStatus.LOSE) {
            result -= plyerData.betState.betAmount;
        }
        return result;
    }

    private randomIntFromInterval(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

}