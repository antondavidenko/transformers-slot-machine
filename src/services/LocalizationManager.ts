export class LocalizationManager {

    constructor(private localization: Map<string, string>) {};

    getByKey(key: string): string {
        return this.localization[key];
    }

}