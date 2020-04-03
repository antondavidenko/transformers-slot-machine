import { ISlotMachineContext } from "./ISlotMachineContext"
import { slotMachineDefinition, SlotMachineEvents, SlotMachineStates } from "./Config"

interface IStateDefinition {
    name: SlotMachineStates;
    action: () =>void;
    transitions: Array<Transition>;
}

type Transition = {
    target: SlotMachineStates;
    event: SlotMachineEvents;
}

export class TransitionsLogicEngine {

    battleState: SlotMachineStates;

    constructor(context: ISlotMachineContext) {
        this.setAction(SlotMachineStates.LOADING_STATE,             context.onLoading.bind(context));
        this.setAction(SlotMachineStates.INIT_STATE,                context.onInit.bind(context));
        this.setAction(SlotMachineStates.IDLE_STATE,                context.onIdle.bind(context));
        this.setAction(SlotMachineStates.SPIN_STARTING_STATE,       context.onSpinStarting.bind(context));
        this.setAction(SlotMachineStates.SPINNING_STATE,            context.onSpinning.bind(context));
        this.setAction(SlotMachineStates.STOPPING_STATE,            context.onStopping.bind(context));
        this.setAction(SlotMachineStates.BASEGAME_OUTCOME_STATE,    context.onBasegameOutcome.bind(context));
        this.setAction(SlotMachineStates.PAYTABLE_STATE,            context.onPaytable.bind(context));
        this.battleState = slotMachineDefinition.startState;
    }

    run() {
        this.getState(this.battleState).action();
    }

    private setAction(stateName: SlotMachineStates, action: () =>void ): void {
        this.getState(stateName).action = action;
    }

    dispatchEvent(event: SlotMachineEvents): void {
        let currentState = this.getState(this.battleState);
        for (let transitionId in currentState.transitions) {
            let transition = currentState.transitions[transitionId];
            if (transition.event == event) {
                this.battleState = transition.target;
                this.getState(this.battleState).action();
            }
        }
    }

    private getState(stateName: SlotMachineStates): IStateDefinition {
        let result = {};
        for (let stateId in slotMachineDefinition.states) {
            if (slotMachineDefinition.states[stateId].name == stateName) {
                result = slotMachineDefinition.states[stateId];
            }
        }
        return <IStateDefinition>result;
    }
}