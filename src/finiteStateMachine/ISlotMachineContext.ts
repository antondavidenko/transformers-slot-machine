export interface ISlotMachineContext {
    onLoading();
    onInit();
    onIdle();
    onSpinStarting();
    onSpinning();
    onStopping();
    onBasegameOutcome();
    onPaytable();
}