export class Injector {

  static getDependencies() {
    // Not necessary, I'm just setting a good example.
    return [Window];
  }
  constructor(window) {
    this.window = window;

    // Keyed by class name. Only (singleton) instances enter this map.
    this.instances = {
      Window: this.window,
      Injector: this,
    };

    this.instantiationInProgress = new Set(); // names
  }

  // (extras) is an array of instances to substitute (eg HTMLElement).
  getInstance(clazz, extras) {
    const name = clazz.name;
    if (!name) throw new Error("Invalid class");
    const instance = this._instantiate(clazz, name, extras || []);
    return instance;
  }

  _instantiate(clazz, name, extras) {
    let instance = this.instances[name];
    if (instance) return instance;
    if (this.instantiationInProgress.has(name)) {
      throw new Error(`Circular dependency involving '${name}': ${JSON.stringify(Array.from(this.instantiationInProgress))}`);
    }
    this.instantiationInProgress.add(name);
    try {
      const dependencyClasses = (clazz.getDependencies ? clazz.getDependencies() : null) || [];
      const dependencies = dependencyClasses.map(dcls => {
        const extra = extras.find(e => e instanceof dcls);
        return extra || this._instantiate(dcls, dcls.name, []);
      });
      instance = new clazz(...dependencies);
      if (clazz.singleton) this.instances[name] = instance;
      return instance;
    } catch (e) {
      this.instantiationInProgress.delete(name);
      throw e;
    }
  }

}

// Just setting a good example.
Injector.singleton = true;
