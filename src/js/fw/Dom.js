import { Injector } from "/js/fw/Injector.js";

export class Dom {

  static getDependencies() {
    return [Window, Injector];
  }
  constructor(window, injector) {
    this.window = window;
    this.injector = injector;
    this.document = this.window.document;
  }

  newController(element, clazz) {
    element.classList.add(clazz.name);
    const controller = this.injector.getInstance(clazz, [element]);
    element._controller = controller;
    return controller;
  }

  spawn(parent, tagName, /* optional: */ classes, attributes, innerText) {
    const child = this.document.createElement(tagName);
    if (classes) child.classList.add(...classes);
    if (attributes) {
      for (const key of Object.keys(attributes)) {
        child.setAttribute(key, attributes[key]);
      }
    }
    if (innerText !== undefined) {
      child.innerText = innerText;
    }
    parent.appendChild(child);
    return child;
  }

}

Dom.singleton = true;
