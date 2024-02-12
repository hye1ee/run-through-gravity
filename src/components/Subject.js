class Subject {
    constructor() {
      this.unsubscribeAll();
    }
    subscribe(observer) {
      if (observer != null) this.observers.push(observer);
    }
    unsubscribe(observer) {
      if (observer == null) return;
      this.observers = this.observers.filter((e) => e != observer);
    }
    unsubscribeAll() {
      this.observers = [];
    }
    notifySubscribers(source, ...others) {
      for (let obj of this.observers) {
        if (obj != null) obj.update(source, ...others);
      }
    }
  }
  export { Subject };