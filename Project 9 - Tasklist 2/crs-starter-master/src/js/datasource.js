export class DataSource {
    get store() {
        return this._store;
    }

    set store(newValue) {
        this._store = newValue;
        this.data = newValue.readData();
    }

    /**
     * Dispose memory
     */
    dispose(){
        this.store = null;
    }

    /**
     * Save data
     */
    save() {
        this.store.saveData(this.data);
    }

}