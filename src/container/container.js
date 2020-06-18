module.exports = () => {
  const dependencies = {};
  const factories = {};

  const inject = (factory) => {
    const argumentList = factory.slice(0, factory.length - 1);
    const args = argumentList.map((dependency) => diContainer.get(dependency));
    const func = factory[factory.length - 1];
    return func.apply(null, args);
  };

  const diContainer = {
    factory(name, factory) {
      factories[name] = factory;
    },

    register(name, dep) {
      dependencies[name] = dep;
    },

    get(name) {
      if (!dependencies[name]) {
        const factory = factories[name];
        dependencies[name] = factory && inject(factory);
        if (!dependencies[name]) {
          throw new Error("Cannot find module: " + name);
        }
      }
      return dependencies[name];
    },
  };

  return diContainer;
};
