export enum OutcomeStatus {
    WIN,
    LOSE,
    DRAW
};

export type Outcome = {
    reelPicture: string[][];
    autobotsPointsSummary: number;
    decepticonsPointsSummary: number;
    outcomeStatus: OutcomeStatus;
}

export enum BetLines {
    AUTOBOTS,
    DECEPTICONS
};

export type BetState = {
    betLines: BetLines;
    betAmount: number
}

export class PlayerData {
    balance: number;
    betState: BetState;
    outcome: Outcome;
}