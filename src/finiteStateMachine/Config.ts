export enum SlotMachineStates {
    LOADING_STATE,
    INIT_STATE,
    IDLE_STATE,
    SPIN_STARTING_STATE,
    SPINNING_STATE,
    STOPPING_STATE,
    BASEGAME_OUTCOME_STATE,
    PAYTABLE_STATE
};

export enum SlotMachineEvents {
    LOADING_COMPLETED_EVENT,
    SPIN_ENABLED_EVENT,
    START_SPIN_EVENT,
    SPIN_STARTED_EVENT,
    STOP_REEL_EVENT,
    PRESENT_SPIN_OUTCOME_EVENT,
    SPIN_OUTCOME_PRESENTED_EVENT,
    SHOW_PAYTABLE,
    HIDE_PAYTABLE
};

export const slotMachineDefinition = {
    startState: SlotMachineStates.LOADING_STATE,
    states: [
        {
            name: SlotMachineStates.LOADING_STATE,
            transitions: [
                { target: SlotMachineStates.INIT_STATE, event: SlotMachineEvents.LOADING_COMPLETED_EVENT }
            ]
        },
        {
            name: SlotMachineStates.INIT_STATE,
            transitions: [
                { target: SlotMachineStates.IDLE_STATE, event: SlotMachineEvents.SPIN_ENABLED_EVENT }
            ]
        },
        {
            name: SlotMachineStates.IDLE_STATE,
            transitions: [
                { target: SlotMachineStates.SPIN_STARTING_STATE, event: SlotMachineEvents.START_SPIN_EVENT },
                { target: SlotMachineStates.PAYTABLE_STATE, event: SlotMachineEvents.SHOW_PAYTABLE }
            ]
        },
        {
            name: SlotMachineStates.SPIN_STARTING_STATE,
            transitions: [
                { target: SlotMachineStates.SPINNING_STATE, event: SlotMachineEvents.SPIN_STARTED_EVENT }
            ]
        },
        {
            name: SlotMachineStates.SPINNING_STATE,
            transitions: [
                { target: SlotMachineStates.STOPPING_STATE, event: SlotMachineEvents.STOP_REEL_EVENT }
            ]
        },
        {
            name: SlotMachineStates.STOPPING_STATE,
            transitions: [
                { target: SlotMachineStates.BASEGAME_OUTCOME_STATE, event: SlotMachineEvents.PRESENT_SPIN_OUTCOME_EVENT }
            ]
        },
        {
            name: SlotMachineStates.BASEGAME_OUTCOME_STATE,
            transitions: [
                { target: SlotMachineStates.IDLE_STATE, event: SlotMachineEvents.SPIN_OUTCOME_PRESENTED_EVENT }
            ]
        },
        {
            name: SlotMachineStates.PAYTABLE_STATE,
            transitions: [
                { target: SlotMachineStates.IDLE_STATE, event: SlotMachineEvents.HIDE_PAYTABLE }
            ]
        }
    ]
};