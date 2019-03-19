
class Container {

  static add(key, content, targetContainer = null, force = true) {
    const container = targetContainer === null ? this.container : targetContainer;
    if (this.has(key, container) && !force) {
      throw new Error(`class:Container; func:add; error:${key}已经存在`);
    }
    container[key] = content;
    return container[key];
  }

  static delete(key, targetContainer = null) {
    const container = targetContainer === null ? this.container : targetContainer;
    if (!this.has(key, container)) throw new Error(`class:Container; func:delete; error:${key}不存在，不能删除`);
    Reflect.deleteProperty(container, key);
  }

  static has(key, targetContainer = null) {
    const container = targetContainer === null ? this.container : targetContainer;
    return container.hasOwnProperty(key);
  }

  static clear(targetContainer = null) {
    let container = targetContainer === null ? this.container : targetContainer;
    container = {};
  }

  static get(key, targetContainer = null) {
    const container = targetContainer === null ? this.container : targetContainer;
    return this.has(key, container) ? container[key] : null;
  }

  static list(targetContainer = null) {
    const container = targetContainer === null ? this.container : targetContainer;
    return container;
  }

}

Container.container = {};

module.exports = Container;

