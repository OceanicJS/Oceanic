export default class QueryBuilder extends URLSearchParams {
    override set(name: string, value: unknown): void {
        if (value === undefined) {
            if (this.has(name)) {
                this.delete(name);
            }
        } else {
            super.set(name, String(value));
        }
    }

    setIfPresent(name: string, value: unknown): void {
        if (value !== undefined) {
            this.set(name, value);
        }
    }
}
