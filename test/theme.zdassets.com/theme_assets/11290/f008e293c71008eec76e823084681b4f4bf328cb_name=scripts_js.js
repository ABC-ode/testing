/*!
  * Bootstrap v5.3.2 (https://getbootstrap.com/)
  * Copyright 2011-2023 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.bootstrap = factory());
})(this, (function () { 'use strict';

  /**
   * --------------------------------------------------------------------------
   * Bootstrap dom/data.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * Constants
   */

  const elementMap = new Map();
  const Data = {
    set(element, key, instance) {
      if (!elementMap.has(element)) {
        elementMap.set(element, new Map());
      }
      const instanceMap = elementMap.get(element);

      // make it clear we only want one instance per element
      // can be removed later when multiple key/instances are fine to be used
      if (!instanceMap.has(key) && instanceMap.size !== 0) {
        // eslint-disable-next-line no-console
        console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
        return;
      }
      instanceMap.set(key, instance);
    },
    get(element, key) {
      if (elementMap.has(element)) {
        return elementMap.get(element).get(key) || null;
      }
      return null;
    },
    remove(element, key) {
      if (!elementMap.has(element)) {
        return;
      }
      const instanceMap = elementMap.get(element);
      instanceMap.delete(key);

      // free up element references if there are no instances left for an element
      if (instanceMap.size === 0) {
        elementMap.delete(element);
      }
    }
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  const MAX_UID = 1000000;
  const MILLISECONDS_MULTIPLIER = 1000;
  const TRANSITION_END = 'transitionend';

  /**
   * Properly escape IDs selectors to handle weird IDs
   * @param {string} selector
   * @returns {string}
   */
  const parseSelector = selector => {
    if (selector && window.CSS && window.CSS.escape) {
      // document.querySelector needs escaping to handle IDs (html5+) containing for instance /
      selector = selector.replace(/#([^\s"#']+)/g, (match, id) => `#${CSS.escape(id)}`);
    }
    return selector;
  };

  // Shout-out Angus Croll (https://goo.gl/pxwQGp)
  const toType = object => {
    if (object === null || object === undefined) {
      return `${object}`;
    }
    return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
  };

  /**
   * Public Util API
   */

  const getUID = prefix => {
    do {
      prefix += Math.floor(Math.random() * MAX_UID);
    } while (document.getElementById(prefix));
    return prefix;
  };
  const getTransitionDurationFromElement = element => {
    if (!element) {
      return 0;
    }

    // Get transition-duration of the element
    let {
      transitionDuration,
      transitionDelay
    } = window.getComputedStyle(element);
    const floatTransitionDuration = Number.parseFloat(transitionDuration);
    const floatTransitionDelay = Number.parseFloat(transitionDelay);

    // Return 0 if element or transition duration is not found
    if (!floatTransitionDuration && !floatTransitionDelay) {
      return 0;
    }

    // If multiple durations are defined, take the first
    transitionDuration = transitionDuration.split(',')[0];
    transitionDelay = transitionDelay.split(',')[0];
    return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
  };
  const triggerTransitionEnd = element => {
    element.dispatchEvent(new Event(TRANSITION_END));
  };
  const isElement$1 = object => {
    if (!object || typeof object !== 'object') {
      return false;
    }
    if (typeof object.jquery !== 'undefined') {
      object = object[0];
    }
    return typeof object.nodeType !== 'undefined';
  };
  const getElement = object => {
    // it's a jQuery object or a node element
    if (isElement$1(object)) {
      return object.jquery ? object[0] : object;
    }
    if (typeof object === 'string' && object.length > 0) {
      return document.querySelector(parseSelector(object));
    }
    return null;
  };
  const isVisible = element => {
    if (!isElement$1(element) || element.getClientRects().length === 0) {
      return false;
    }
    const elementIsVisible = getComputedStyle(element).getPropertyValue('visibility') === 'visible';
    // Handle `details` element as its content may falsie appear visible when it is closed
    const closedDetails = element.closest('details:not([open])');
    if (!closedDetails) {
      return elementIsVisible;
    }
    if (closedDetails !== element) {
      const summary = element.closest('summary');
      if (summary && summary.parentNode !== closedDetails) {
        return false;
      }
      if (summary === null) {
        return false;
      }
    }
    return elementIsVisible;
  };
  const isDisabled = element => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return true;
    }
    if (element.classList.contains('disabled')) {
      return true;
    }
    if (typeof element.disabled !== 'undefined') {
      return element.disabled;
    }
    return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
  };
  const findShadowRoot = element => {
    if (!document.documentElement.attachShadow) {
      return null;
    }

    // Can find the shadow root otherwise it'll return the document
    if (typeof element.getRootNode === 'function') {
      const root = element.getRootNode();
      return root instanceof ShadowRoot ? root : null;
    }
    if (element instanceof ShadowRoot) {
      return element;
    }

    // when we don't find a shadow root
    if (!element.parentNode) {
      return null;
    }
    return findShadowRoot(element.parentNode);
  };
  const noop = () => {};

  /**
   * Trick to restart an element's animation
   *
   * @param {HTMLElement} element
   * @return void
   *
   * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
   */
  const reflow = element => {
    element.offsetHeight; // eslint-disable-line no-unused-expressions
  };

  const getjQuery = () => {
    if (window.jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
      return window.jQuery;
    }
    return null;
  };
  const DOMContentLoadedCallbacks = [];
  const onDOMContentLoaded = callback => {
    if (document.readyState === 'loading') {
      // add listener on the first call when the document is in loading state
      if (!DOMContentLoadedCallbacks.length) {
        document.addEventListener('DOMContentLoaded', () => {
          for (const callback of DOMContentLoadedCallbacks) {
            callback();
          }
        });
      }
      DOMContentLoadedCallbacks.push(callback);
    } else {
      callback();
    }
  };
  const isRTL = () => document.documentElement.dir === 'rtl';
  const defineJQueryPlugin = plugin => {
    onDOMContentLoaded(() => {
      const $ = getjQuery();
      /* istanbul ignore if */
      if ($) {
        const name = plugin.NAME;
        const JQUERY_NO_CONFLICT = $.fn[name];
        $.fn[name] = plugin.jQueryInterface;
        $.fn[name].Constructor = plugin;
        $.fn[name].noConflict = () => {
          $.fn[name] = JQUERY_NO_CONFLICT;
          return plugin.jQueryInterface;
        };
      }
    });
  };
  const execute = (possibleCallback, args = [], defaultValue = possibleCallback) => {
    return typeof possibleCallback === 'function' ? possibleCallback(...args) : defaultValue;
  };
  const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
    if (!waitForTransition) {
      execute(callback);
      return;
    }
    const durationPadding = 5;
    const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
    let called = false;
    const handler = ({
      target
    }) => {
      if (target !== transitionElement) {
        return;
      }
      called = true;
      transitionElement.removeEventListener(TRANSITION_END, handler);
      execute(callback);
    };
    transitionElement.addEventListener(TRANSITION_END, handler);
    setTimeout(() => {
      if (!called) {
        triggerTransitionEnd(transitionElement);
      }
    }, emulatedDuration);
  };

  /**
   * Return the previous/next element of a list.
   *
   * @param {array} list    The list of elements
   * @param activeElement   The active element
   * @param shouldGetNext   Choose to get next or previous element
   * @param isCycleAllowed
   * @return {Element|elem} The proper element
   */
  const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
    const listLength = list.length;
    let index = list.indexOf(activeElement);

    // if the element does not exist in the list return an element
    // depending on the direction and if cycle is allowed
    if (index === -1) {
      return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
    }
    index += shouldGetNext ? 1 : -1;
    if (isCycleAllowed) {
      index = (index + listLength) % listLength;
    }
    return list[Math.max(0, Math.min(index, listLength - 1))];
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap dom/event-handler.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
  const stripNameRegex = /\..*/;
  const stripUidRegex = /::\d+$/;
  const eventRegistry = {}; // Events storage
  let uidEvent = 1;
  const customEvents = {
    mouseenter: 'mouseover',
    mouseleave: 'mouseout'
  };
  const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);

  /**
   * Private methods
   */

  function makeEventUid(element, uid) {
    return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
  }
  function getElementEvents(element) {
    const uid = makeEventUid(element);
    element.uidEvent = uid;
    eventRegistry[uid] = eventRegistry[uid] || {};
    return eventRegistry[uid];
  }
  function bootstrapHandler(element, fn) {
    return function handler(event) {
      hydrateObj(event, {
        delegateTarget: element
      });
      if (handler.oneOff) {
        EventHandler.off(element, event.type, fn);
      }
      return fn.apply(element, [event]);
    };
  }
  function bootstrapDelegationHandler(element, selector, fn) {
    return function handler(event) {
      const domElements = element.querySelectorAll(selector);
      for (let {
        target
      } = event; target && target !== this; target = target.parentNode) {
        for (const domElement of domElements) {
          if (domElement !== target) {
            continue;
          }
          hydrateObj(event, {
            delegateTarget: target
          });
          if (handler.oneOff) {
            EventHandler.off(element, event.type, selector, fn);
          }
          return fn.apply(target, [event]);
        }
      }
    };
  }
  function findHandler(events, callable, delegationSelector = null) {
    return Object.values(events).find(event => event.callable === callable && event.delegationSelector === delegationSelector);
  }
  function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
    const isDelegated = typeof handler === 'string';
    // TODO: tooltip passes `false` instead of selector, so we need to check
    const callable = isDelegated ? delegationFunction : handler || delegationFunction;
    let typeEvent = getTypeEvent(originalTypeEvent);
    if (!nativeEvents.has(typeEvent)) {
      typeEvent = originalTypeEvent;
    }
    return [isDelegated, callable, typeEvent];
  }
  function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
    if (typeof originalTypeEvent !== 'string' || !element) {
      return;
    }
    let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);

    // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
    // this prevents the handler from being dispatched the same way as mouseover or mouseout does
    if (originalTypeEvent in customEvents) {
      const wrapFunction = fn => {
        return function (event) {
          if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
            return fn.call(this, event);
          }
        };
      };
      callable = wrapFunction(callable);
    }
    const events = getElementEvents(element);
    const handlers = events[typeEvent] || (events[typeEvent] = {});
    const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);
    if (previousFunction) {
      previousFunction.oneOff = previousFunction.oneOff && oneOff;
      return;
    }
    const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ''));
    const fn = isDelegated ? bootstrapDelegationHandler(element, handler, callable) : bootstrapHandler(element, callable);
    fn.delegationSelector = isDelegated ? handler : null;
    fn.callable = callable;
    fn.oneOff = oneOff;
    fn.uidEvent = uid;
    handlers[uid] = fn;
    element.addEventListener(typeEvent, fn, isDelegated);
  }
  function removeHandler(element, events, typeEvent, handler, delegationSelector) {
    const fn = findHandler(events[typeEvent], handler, delegationSelector);
    if (!fn) {
      return;
    }
    element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
    delete events[typeEvent][fn.uidEvent];
  }
  function removeNamespacedHandlers(element, events, typeEvent, namespace) {
    const storeElementEvent = events[typeEvent] || {};
    for (const [handlerKey, event] of Object.entries(storeElementEvent)) {
      if (handlerKey.includes(namespace)) {
        removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
      }
    }
  }
  function getTypeEvent(event) {
    // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
    event = event.replace(stripNameRegex, '');
    return customEvents[event] || event;
  }
  const EventHandler = {
    on(element, event, handler, delegationFunction) {
      addHandler(element, event, handler, delegationFunction, false);
    },
    one(element, event, handler, delegationFunction) {
      addHandler(element, event, handler, delegationFunction, true);
    },
    off(element, originalTypeEvent, handler, delegationFunction) {
      if (typeof originalTypeEvent !== 'string' || !element) {
        return;
      }
      const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
      const inNamespace = typeEvent !== originalTypeEvent;
      const events = getElementEvents(element);
      const storeElementEvent = events[typeEvent] || {};
      const isNamespace = originalTypeEvent.startsWith('.');
      if (typeof callable !== 'undefined') {
        // Simplest case: handler is passed, remove that listener ONLY.
        if (!Object.keys(storeElementEvent).length) {
          return;
        }
        removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
        return;
      }
      if (isNamespace) {
        for (const elementEvent of Object.keys(events)) {
          removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
        }
      }
      for (const [keyHandlers, event] of Object.entries(storeElementEvent)) {
        const handlerKey = keyHandlers.replace(stripUidRegex, '');
        if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
          removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
        }
      }
    },
    trigger(element, event, args) {
      if (typeof event !== 'string' || !element) {
        return null;
      }
      const $ = getjQuery();
      const typeEvent = getTypeEvent(event);
      const inNamespace = event !== typeEvent;
      let jQueryEvent = null;
      let bubbles = true;
      let nativeDispatch = true;
      let defaultPrevented = false;
      if (inNamespace && $) {
        jQueryEvent = $.Event(event, args);
        $(element).trigger(jQueryEvent);
        bubbles = !jQueryEvent.isPropagationStopped();
        nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
        defaultPrevented = jQueryEvent.isDefaultPrevented();
      }
      const evt = hydrateObj(new Event(event, {
        bubbles,
        cancelable: true
      }), args);
      if (defaultPrevented) {
        evt.preventDefault();
      }
      if (nativeDispatch) {
        element.dispatchEvent(evt);
      }
      if (evt.defaultPrevented && jQueryEvent) {
        jQueryEvent.preventDefault();
      }
      return evt;
    }
  };
  function hydrateObj(obj, meta = {}) {
    for (const [key, value] of Object.entries(meta)) {
      try {
        obj[key] = value;
      } catch (_unused) {
        Object.defineProperty(obj, key, {
          configurable: true,
          get() {
            return value;
          }
        });
      }
    }
    return obj;
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap dom/manipulator.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  function normalizeData(value) {
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
    if (value === Number(value).toString()) {
      return Number(value);
    }
    if (value === '' || value === 'null') {
      return null;
    }
    if (typeof value !== 'string') {
      return value;
    }
    try {
      return JSON.parse(decodeURIComponent(value));
    } catch (_unused) {
      return value;
    }
  }
  function normalizeDataKey(key) {
    return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
  }
  const Manipulator = {
    setDataAttribute(element, key, value) {
      element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
    },
    removeDataAttribute(element, key) {
      element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
    },
    getDataAttributes(element) {
      if (!element) {
        return {};
      }
      const attributes = {};
      const bsKeys = Object.keys(element.dataset).filter(key => key.startsWith('bs') && !key.startsWith('bsConfig'));
      for (const key of bsKeys) {
        let pureKey = key.replace(/^bs/, '');
        pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
        attributes[pureKey] = normalizeData(element.dataset[key]);
      }
      return attributes;
    },
    getDataAttribute(element, key) {
      return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
    }
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/config.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Class definition
   */

  class Config {
    // Getters
    static get Default() {
      return {};
    }
    static get DefaultType() {
      return {};
    }
    static get NAME() {
      throw new Error('You have to implement the static method "NAME", for each component!');
    }
    _getConfig(config) {
      config = this._mergeConfigObj(config);
      config = this._configAfterMerge(config);
      this._typeCheckConfig(config);
      return config;
    }
    _configAfterMerge(config) {
      return config;
    }
    _mergeConfigObj(config, element) {
      const jsonConfig = isElement$1(element) ? Manipulator.getDataAttribute(element, 'config') : {}; // try to parse

      return {
        ...this.constructor.Default,
        ...(typeof jsonConfig === 'object' ? jsonConfig : {}),
        ...(isElement$1(element) ? Manipulator.getDataAttributes(element) : {}),
        ...(typeof config === 'object' ? config : {})
      };
    }
    _typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
      for (const [property, expectedTypes] of Object.entries(configTypes)) {
        const value = config[property];
        const valueType = isElement$1(value) ? 'element' : toType(value);
        if (!new RegExp(expectedTypes).test(valueType)) {
          throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
        }
      }
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap base-component.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const VERSION = '5.3.2';

  /**
   * Class definition
   */

  class BaseComponent extends Config {
    constructor(element, config) {
      super();
      element = getElement(element);
      if (!element) {
        return;
      }
      this._element = element;
      this._config = this._getConfig(config);
      Data.set(this._element, this.constructor.DATA_KEY, this);
    }

    // Public
    dispose() {
      Data.remove(this._element, this.constructor.DATA_KEY);
      EventHandler.off(this._element, this.constructor.EVENT_KEY);
      for (const propertyName of Object.getOwnPropertyNames(this)) {
        this[propertyName] = null;
      }
    }
    _queueCallback(callback, element, isAnimated = true) {
      executeAfterTransition(callback, element, isAnimated);
    }
    _getConfig(config) {
      config = this._mergeConfigObj(config, this._element);
      config = this._configAfterMerge(config);
      this._typeCheckConfig(config);
      return config;
    }

    // Static
    static getInstance(element) {
      return Data.get(getElement(element), this.DATA_KEY);
    }
    static getOrCreateInstance(element, config = {}) {
      return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
    }
    static get VERSION() {
      return VERSION;
    }
    static get DATA_KEY() {
      return `bs.${this.NAME}`;
    }
    static get EVENT_KEY() {
      return `.${this.DATA_KEY}`;
    }
    static eventName(name) {
      return `${name}${this.EVENT_KEY}`;
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap dom/selector-engine.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  const getSelector = element => {
    let selector = element.getAttribute('data-bs-target');
    if (!selector || selector === '#') {
      let hrefAttribute = element.getAttribute('href');

      // The only valid content that could double as a selector are IDs or classes,
      // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
      // `document.querySelector` will rightfully complain it is invalid.
      // See https://github.com/twbs/bootstrap/issues/32273
      if (!hrefAttribute || !hrefAttribute.includes('#') && !hrefAttribute.startsWith('.')) {
        return null;
      }

      // Just in case some CMS puts out a full URL with the anchor appended
      if (hrefAttribute.includes('#') && !hrefAttribute.startsWith('#')) {
        hrefAttribute = `#${hrefAttribute.split('#')[1]}`;
      }
      selector = hrefAttribute && hrefAttribute !== '#' ? parseSelector(hrefAttribute.trim()) : null;
    }
    return selector;
  };
  const SelectorEngine = {
    find(selector, element = document.documentElement) {
      return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
    },
    findOne(selector, element = document.documentElement) {
      return Element.prototype.querySelector.call(element, selector);
    },
    children(element, selector) {
      return [].concat(...element.children).filter(child => child.matches(selector));
    },
    parents(element, selector) {
      const parents = [];
      let ancestor = element.parentNode.closest(selector);
      while (ancestor) {
        parents.push(ancestor);
        ancestor = ancestor.parentNode.closest(selector);
      }
      return parents;
    },
    prev(element, selector) {
      let previous = element.previousElementSibling;
      while (previous) {
        if (previous.matches(selector)) {
          return [previous];
        }
        previous = previous.previousElementSibling;
      }
      return [];
    },
    // TODO: this is now unused; remove later along with prev()
    next(element, selector) {
      let next = element.nextElementSibling;
      while (next) {
        if (next.matches(selector)) {
          return [next];
        }
        next = next.nextElementSibling;
      }
      return [];
    },
    focusableChildren(element) {
      const focusables = ['a', 'button', 'input', 'textarea', 'select', 'details', '[tabindex]', '[contenteditable="true"]'].map(selector => `${selector}:not([tabindex^="-"])`).join(',');
      return this.find(focusables, element).filter(el => !isDisabled(el) && isVisible(el));
    },
    getSelectorFromElement(element) {
      const selector = getSelector(element);
      if (selector) {
        return SelectorEngine.findOne(selector) ? selector : null;
      }
      return null;
    },
    getElementFromSelector(element) {
      const selector = getSelector(element);
      return selector ? SelectorEngine.findOne(selector) : null;
    },
    getMultipleElementsFromSelector(element) {
      const selector = getSelector(element);
      return selector ? SelectorEngine.find(selector) : [];
    }
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/component-functions.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  const enableDismissTrigger = (component, method = 'hide') => {
    const clickEvent = `click.dismiss${component.EVENT_KEY}`;
    const name = component.NAME;
    EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
      if (['A', 'AREA'].includes(this.tagName)) {
        event.preventDefault();
      }
      if (isDisabled(this)) {
        return;
      }
      const target = SelectorEngine.getElementFromSelector(this) || this.closest(`.${name}`);
      const instance = component.getOrCreateInstance(target);

      // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method
      instance[method]();
    });
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap alert.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$f = 'alert';
  const DATA_KEY$a = 'bs.alert';
  const EVENT_KEY$b = `.${DATA_KEY$a}`;
  const EVENT_CLOSE = `close${EVENT_KEY$b}`;
  const EVENT_CLOSED = `closed${EVENT_KEY$b}`;
  const CLASS_NAME_FADE$5 = 'fade';
  const CLASS_NAME_SHOW$8 = 'show';

  /**
   * Class definition
   */

  class Alert extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$f;
    }

    // Public
    close() {
      const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);
      if (closeEvent.defaultPrevented) {
        return;
      }
      this._element.classList.remove(CLASS_NAME_SHOW$8);
      const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$5);
      this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
    }

    // Private
    _destroyElement() {
      this._element.remove();
      EventHandler.trigger(this._element, EVENT_CLOSED);
      this.dispose();
    }

    // Static
    static jQueryInterface(config) {
      return this.each(function () {
        const data = Alert.getOrCreateInstance(this);
        if (typeof config !== 'string') {
          return;
        }
        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config](this);
      });
    }
  }

  /**
   * Data API implementation
   */

  enableDismissTrigger(Alert, 'close');

  /**
   * jQuery
   */

  defineJQueryPlugin(Alert);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap button.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$e = 'button';
  const DATA_KEY$9 = 'bs.button';
  const EVENT_KEY$a = `.${DATA_KEY$9}`;
  const DATA_API_KEY$6 = '.data-api';
  const CLASS_NAME_ACTIVE$3 = 'active';
  const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
  const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$a}${DATA_API_KEY$6}`;

  /**
   * Class definition
   */

  class Button extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$e;
    }

    // Public
    toggle() {
      // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
      this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
    }

    // Static
    static jQueryInterface(config) {
      return this.each(function () {
        const data = Button.getOrCreateInstance(this);
        if (config === 'toggle') {
          data[config]();
        }
      });
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, event => {
    event.preventDefault();
    const button = event.target.closest(SELECTOR_DATA_TOGGLE$5);
    const data = Button.getOrCreateInstance(button);
    data.toggle();
  });

  /**
   * jQuery
   */

  defineJQueryPlugin(Button);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/swipe.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$d = 'swipe';
  const EVENT_KEY$9 = '.bs.swipe';
  const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$9}`;
  const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$9}`;
  const EVENT_TOUCHEND = `touchend${EVENT_KEY$9}`;
  const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$9}`;
  const EVENT_POINTERUP = `pointerup${EVENT_KEY$9}`;
  const POINTER_TYPE_TOUCH = 'touch';
  const POINTER_TYPE_PEN = 'pen';
  const CLASS_NAME_POINTER_EVENT = 'pointer-event';
  const SWIPE_THRESHOLD = 40;
  const Default$c = {
    endCallback: null,
    leftCallback: null,
    rightCallback: null
  };
  const DefaultType$c = {
    endCallback: '(function|null)',
    leftCallback: '(function|null)',
    rightCallback: '(function|null)'
  };

  /**
   * Class definition
   */

  class Swipe extends Config {
    constructor(element, config) {
      super();
      this._element = element;
      if (!element || !Swipe.isSupported()) {
        return;
      }
      this._config = this._getConfig(config);
      this._deltaX = 0;
      this._supportPointerEvents = Boolean(window.PointerEvent);
      this._initEvents();
    }

    // Getters
    static get Default() {
      return Default$c;
    }
    static get DefaultType() {
      return DefaultType$c;
    }
    static get NAME() {
      return NAME$d;
    }

    // Public
    dispose() {
      EventHandler.off(this._element, EVENT_KEY$9);
    }

    // Private
    _start(event) {
      if (!this._supportPointerEvents) {
        this._deltaX = event.touches[0].clientX;
        return;
      }
      if (this._eventIsPointerPenTouch(event)) {
        this._deltaX = event.clientX;
      }
    }
    _end(event) {
      if (this._eventIsPointerPenTouch(event)) {
        this._deltaX = event.clientX - this._deltaX;
      }
      this._handleSwipe();
      execute(this._config.endCallback);
    }
    _move(event) {
      this._deltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this._deltaX;
    }
    _handleSwipe() {
      const absDeltaX = Math.abs(this._deltaX);
      if (absDeltaX <= SWIPE_THRESHOLD) {
        return;
      }
      const direction = absDeltaX / this._deltaX;
      this._deltaX = 0;
      if (!direction) {
        return;
      }
      execute(direction > 0 ? this._config.rightCallback : this._config.leftCallback);
    }
    _initEvents() {
      if (this._supportPointerEvents) {
        EventHandler.on(this._element, EVENT_POINTERDOWN, event => this._start(event));
        EventHandler.on(this._element, EVENT_POINTERUP, event => this._end(event));
        this._element.classList.add(CLASS_NAME_POINTER_EVENT);
      } else {
        EventHandler.on(this._element, EVENT_TOUCHSTART, event => this._start(event));
        EventHandler.on(this._element, EVENT_TOUCHMOVE, event => this._move(event));
        EventHandler.on(this._element, EVENT_TOUCHEND, event => this._end(event));
      }
    }
    _eventIsPointerPenTouch(event) {
      return this._supportPointerEvents && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
    }

    // Static
    static isSupported() {
      return 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap carousel.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$c = 'carousel';
  const DATA_KEY$8 = 'bs.carousel';
  const EVENT_KEY$8 = `.${DATA_KEY$8}`;
  const DATA_API_KEY$5 = '.data-api';
  const ARROW_LEFT_KEY$1 = 'ArrowLeft';
  const ARROW_RIGHT_KEY$1 = 'ArrowRight';
  const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

  const ORDER_NEXT = 'next';
  const ORDER_PREV = 'prev';
  const DIRECTION_LEFT = 'left';
  const DIRECTION_RIGHT = 'right';
  const EVENT_SLIDE = `slide${EVENT_KEY$8}`;
  const EVENT_SLID = `slid${EVENT_KEY$8}`;
  const EVENT_KEYDOWN$1 = `keydown${EVENT_KEY$8}`;
  const EVENT_MOUSEENTER$1 = `mouseenter${EVENT_KEY$8}`;
  const EVENT_MOUSELEAVE$1 = `mouseleave${EVENT_KEY$8}`;
  const EVENT_DRAG_START = `dragstart${EVENT_KEY$8}`;
  const EVENT_LOAD_DATA_API$3 = `load${EVENT_KEY$8}${DATA_API_KEY$5}`;
  const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$8}${DATA_API_KEY$5}`;
  const CLASS_NAME_CAROUSEL = 'carousel';
  const CLASS_NAME_ACTIVE$2 = 'active';
  const CLASS_NAME_SLIDE = 'slide';
  const CLASS_NAME_END = 'carousel-item-end';
  const CLASS_NAME_START = 'carousel-item-start';
  const CLASS_NAME_NEXT = 'carousel-item-next';
  const CLASS_NAME_PREV = 'carousel-item-prev';
  const SELECTOR_ACTIVE = '.active';
  const SELECTOR_ITEM = '.carousel-item';
  const SELECTOR_ACTIVE_ITEM = SELECTOR_ACTIVE + SELECTOR_ITEM;
  const SELECTOR_ITEM_IMG = '.carousel-item img';
  const SELECTOR_INDICATORS = '.carousel-indicators';
  const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
  const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
  const KEY_TO_DIRECTION = {
    [ARROW_LEFT_KEY$1]: DIRECTION_RIGHT,
    [ARROW_RIGHT_KEY$1]: DIRECTION_LEFT
  };
  const Default$b = {
    interval: 5000,
    keyboard: true,
    pause: 'hover',
    ride: false,
    touch: true,
    wrap: true
  };
  const DefaultType$b = {
    interval: '(number|boolean)',
    // TODO:v6 remove boolean support
    keyboard: 'boolean',
    pause: '(string|boolean)',
    ride: '(boolean|string)',
    touch: 'boolean',
    wrap: 'boolean'
  };

  /**
   * Class definition
   */

  class Carousel extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._interval = null;
      this._activeElement = null;
      this._isSliding = false;
      this.touchTimeout = null;
      this._swipeHelper = null;
      this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
      this._addEventListeners();
      if (this._config.ride === CLASS_NAME_CAROUSEL) {
        this.cycle();
      }
    }

    // Getters
    static get Default() {
      return Default$b;
    }
    static get DefaultType() {
      return DefaultType$b;
    }
    static get NAME() {
      return NAME$c;
    }

    // Public
    next() {
      this._slide(ORDER_NEXT);
    }
    nextWhenVisible() {
      // FIXME TODO use `document.visibilityState`
      // Don't call next when the page isn't visible
      // or the carousel or its parent isn't visible
      if (!document.hidden && isVisible(this._element)) {
        this.next();
      }
    }
    prev() {
      this._slide(ORDER_PREV);
    }
    pause() {
      if (this._isSliding) {
        triggerTransitionEnd(this._element);
      }
      this._clearInterval();
    }
    cycle() {
      this._clearInterval();
      this._updateInterval();
      this._interval = setInterval(() => this.nextWhenVisible(), this._config.interval);
    }
    _maybeEnableCycle() {
      if (!this._config.ride) {
        return;
      }
      if (this._isSliding) {
        EventHandler.one(this._element, EVENT_SLID, () => this.cycle());
        return;
      }
      this.cycle();
    }
    to(index) {
      const items = this._getItems();
      if (index > items.length - 1 || index < 0) {
        return;
      }
      if (this._isSliding) {
        EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
        return;
      }
      const activeIndex = this._getItemIndex(this._getActive());
      if (activeIndex === index) {
        return;
      }
      const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;
      this._slide(order, items[index]);
    }
    dispose() {
      if (this._swipeHelper) {
        this._swipeHelper.dispose();
      }
      super.dispose();
    }

    // Private
    _configAfterMerge(config) {
      config.defaultInterval = config.interval;
      return config;
    }
    _addEventListeners() {
      if (this._config.keyboard) {
        EventHandler.on(this._element, EVENT_KEYDOWN$1, event => this._keydown(event));
      }
      if (this._config.pause === 'hover') {
        EventHandler.on(this._element, EVENT_MOUSEENTER$1, () => this.pause());
        EventHandler.on(this._element, EVENT_MOUSELEAVE$1, () => this._maybeEnableCycle());
      }
      if (this._config.touch && Swipe.isSupported()) {
        this._addTouchEventListeners();
      }
    }
    _addTouchEventListeners() {
      for (const img of SelectorEngine.find(SELECTOR_ITEM_IMG, this._element)) {
        EventHandler.on(img, EVENT_DRAG_START, event => event.preventDefault());
      }
      const endCallBack = () => {
        if (this._config.pause !== 'hover') {
          return;
        }

        // If it's a touch-enabled device, mouseenter/leave are fired as
        // part of the mouse compatibility events on first tap - the carousel
        // would stop cycling until user tapped out of it;
        // here, we listen for touchend, explicitly pause the carousel
        // (as if it's the second time we tap on it, mouseenter compat event
        // is NOT fired) and after a timeout (to allow for mouse compatibility
        // events to fire) we explicitly restart cycling

        this.pause();
        if (this.touchTimeout) {
          clearTimeout(this.touchTimeout);
        }
        this.touchTimeout = setTimeout(() => this._maybeEnableCycle(), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
      };
      const swipeConfig = {
        leftCallback: () => this._slide(this._directionToOrder(DIRECTION_LEFT)),
        rightCallback: () => this._slide(this._directionToOrder(DIRECTION_RIGHT)),
        endCallback: endCallBack
      };
      this._swipeHelper = new Swipe(this._element, swipeConfig);
    }
    _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return;
      }
      const direction = KEY_TO_DIRECTION[event.key];
      if (direction) {
        event.preventDefault();
        this._slide(this._directionToOrder(direction));
      }
    }
    _getItemIndex(element) {
      return this._getItems().indexOf(element);
    }
    _setActiveIndicatorElement(index) {
      if (!this._indicatorsElement) {
        return;
      }
      const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE, this._indicatorsElement);
      activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
      activeIndicator.removeAttribute('aria-current');
      const newActiveIndicator = SelectorEngine.findOne(`[data-bs-slide-to="${index}"]`, this._indicatorsElement);
      if (newActiveIndicator) {
        newActiveIndicator.classList.add(CLASS_NAME_ACTIVE$2);
        newActiveIndicator.setAttribute('aria-current', 'true');
      }
    }
    _updateInterval() {
      const element = this._activeElement || this._getActive();
      if (!element) {
        return;
      }
      const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10);
      this._config.interval = elementInterval || this._config.defaultInterval;
    }
    _slide(order, element = null) {
      if (this._isSliding) {
        return;
      }
      const activeElement = this._getActive();
      const isNext = order === ORDER_NEXT;
      const nextElement = element || getNextActiveElement(this._getItems(), activeElement, isNext, this._config.wrap);
      if (nextElement === activeElement) {
        return;
      }
      const nextElementIndex = this._getItemIndex(nextElement);
      const triggerEvent = eventName => {
        return EventHandler.trigger(this._element, eventName, {
          relatedTarget: nextElement,
          direction: this._orderToDirection(order),
          from: this._getItemIndex(activeElement),
          to: nextElementIndex
        });
      };
      const slideEvent = triggerEvent(EVENT_SLIDE);
      if (slideEvent.defaultPrevented) {
        return;
      }
      if (!activeElement || !nextElement) {
        // Some weirdness is happening, so we bail
        // TODO: change tests that use empty divs to avoid this check
        return;
      }
      const isCycling = Boolean(this._interval);
      this.pause();
      this._isSliding = true;
      this._setActiveIndicatorElement(nextElementIndex);
      this._activeElement = nextElement;
      const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
      const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;
      nextElement.classList.add(orderClassName);
      reflow(nextElement);
      activeElement.classList.add(directionalClassName);
      nextElement.classList.add(directionalClassName);
      const completeCallBack = () => {
        nextElement.classList.remove(directionalClassName, orderClassName);
        nextElement.classList.add(CLASS_NAME_ACTIVE$2);
        activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
        this._isSliding = false;
        triggerEvent(EVENT_SLID);
      };
      this._queueCallback(completeCallBack, activeElement, this._isAnimated());
      if (isCycling) {
        this.cycle();
      }
    }
    _isAnimated() {
      return this._element.classList.contains(CLASS_NAME_SLIDE);
    }
    _getActive() {
      return SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
    }
    _getItems() {
      return SelectorEngine.find(SELECTOR_ITEM, this._element);
    }
    _clearInterval() {
      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }
    }
    _directionToOrder(direction) {
      if (isRTL()) {
        return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
      }
      return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
    }
    _orderToDirection(order) {
      if (isRTL()) {
        return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
      }
      return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
    }

    // Static
    static jQueryInterface(config) {
      return this.each(function () {
        const data = Carousel.getOrCreateInstance(this, config);
        if (typeof config === 'number') {
          data.to(config);
          return;
        }
        if (typeof config === 'string') {
          if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config]();
        }
      });
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, function (event) {
    const target = SelectorEngine.getElementFromSelector(this);
    if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
      return;
    }
    event.preventDefault();
    const carousel = Carousel.getOrCreateInstance(target);
    const slideIndex = this.getAttribute('data-bs-slide-to');
    if (slideIndex) {
      carousel.to(slideIndex);
      carousel._maybeEnableCycle();
      return;
    }
    if (Manipulator.getDataAttribute(this, 'slide') === 'next') {
      carousel.next();
      carousel._maybeEnableCycle();
      return;
    }
    carousel.prev();
    carousel._maybeEnableCycle();
  });
  EventHandler.on(window, EVENT_LOAD_DATA_API$3, () => {
    const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);
    for (const carousel of carousels) {
      Carousel.getOrCreateInstance(carousel);
    }
  });

  /**
   * jQuery
   */

  defineJQueryPlugin(Carousel);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap collapse.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$b = 'collapse';
  const DATA_KEY$7 = 'bs.collapse';
  const EVENT_KEY$7 = `.${DATA_KEY$7}`;
  const DATA_API_KEY$4 = '.data-api';
  const EVENT_SHOW$6 = `show${EVENT_KEY$7}`;
  const EVENT_SHOWN$6 = `shown${EVENT_KEY$7}`;
  const EVENT_HIDE$6 = `hide${EVENT_KEY$7}`;
  const EVENT_HIDDEN$6 = `hidden${EVENT_KEY$7}`;
  const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$7}${DATA_API_KEY$4}`;
  const CLASS_NAME_SHOW$7 = 'show';
  const CLASS_NAME_COLLAPSE = 'collapse';
  const CLASS_NAME_COLLAPSING = 'collapsing';
  const CLASS_NAME_COLLAPSED = 'collapsed';
  const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
  const CLASS_NAME_HORIZONTAL = 'collapse-horizontal';
  const WIDTH = 'width';
  const HEIGHT = 'height';
  const SELECTOR_ACTIVES = '.collapse.show, .collapse.collapsing';
  const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
  const Default$a = {
    parent: null,
    toggle: true
  };
  const DefaultType$a = {
    parent: '(null|element)',
    toggle: 'boolean'
  };

  /**
   * Class definition
   */

  class Collapse extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._isTransitioning = false;
      this._triggerArray = [];
      const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);
      for (const elem of toggleList) {
        const selector = SelectorEngine.getSelectorFromElement(elem);
        const filterElement = SelectorEngine.find(selector).filter(foundElement => foundElement === this._element);
        if (selector !== null && filterElement.length) {
          this._triggerArray.push(elem);
        }
      }
      this._initializeChildren();
      if (!this._config.parent) {
        this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
      }
      if (this._config.toggle) {
        this.toggle();
      }
    }

    // Getters
    static get Default() {
      return Default$a;
    }
    static get DefaultType() {
      return DefaultType$a;
    }
    static get NAME() {
      return NAME$b;
    }

    // Public
    toggle() {
      if (this._isShown()) {
        this.hide();
      } else {
        this.show();
      }
    }
    show() {
      if (this._isTransitioning || this._isShown()) {
        return;
      }
      let activeChildren = [];

      // find active children
      if (this._config.parent) {
        activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES).filter(element => element !== this._element).map(element => Collapse.getOrCreateInstance(element, {
          toggle: false
        }));
      }
      if (activeChildren.length && activeChildren[0]._isTransitioning) {
        return;
      }
      const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$6);
      if (startEvent.defaultPrevented) {
        return;
      }
      for (const activeInstance of activeChildren) {
        activeInstance.hide();
      }
      const dimension = this._getDimension();
      this._element.classList.remove(CLASS_NAME_COLLAPSE);
      this._element.classList.add(CLASS_NAME_COLLAPSING);
      this._element.style[dimension] = 0;
      this._addAriaAndCollapsedClass(this._triggerArray, true);
      this._isTransitioning = true;
      const complete = () => {
        this._isTransitioning = false;
        this._element.classList.remove(CLASS_NAME_COLLAPSING);
        this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
        this._element.style[dimension] = '';
        EventHandler.trigger(this._element, EVENT_SHOWN$6);
      };
      const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
      const scrollSize = `scroll${capitalizedDimension}`;
      this._queueCallback(complete, this._element, true);
      this._element.style[dimension] = `${this._element[scrollSize]}px`;
    }
    hide() {
      if (this._isTransitioning || !this._isShown()) {
        return;
      }
      const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$6);
      if (startEvent.defaultPrevented) {
        return;
      }
      const dimension = this._getDimension();
      this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
      reflow(this._element);
      this._element.classList.add(CLASS_NAME_COLLAPSING);
      this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
      for (const trigger of this._triggerArray) {
        const element = SelectorEngine.getElementFromSelector(trigger);
        if (element && !this._isShown(element)) {
          this._addAriaAndCollapsedClass([trigger], false);
        }
      }
      this._isTransitioning = true;
      const complete = () => {
        this._isTransitioning = false;
        this._element.classList.remove(CLASS_NAME_COLLAPSING);
        this._element.classList.add(CLASS_NAME_COLLAPSE);
        EventHandler.trigger(this._element, EVENT_HIDDEN$6);
      };
      this._element.style[dimension] = '';
      this._queueCallback(complete, this._element, true);
    }
    _isShown(element = this._element) {
      return element.classList.contains(CLASS_NAME_SHOW$7);
    }

    // Private
    _configAfterMerge(config) {
      config.toggle = Boolean(config.toggle); // Coerce string values
      config.parent = getElement(config.parent);
      return config;
    }
    _getDimension() {
      return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
    }
    _initializeChildren() {
      if (!this._config.parent) {
        return;
      }
      const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE$4);
      for (const element of children) {
        const selected = SelectorEngine.getElementFromSelector(element);
        if (selected) {
          this._addAriaAndCollapsedClass([element], this._isShown(selected));
        }
      }
    }
    _getFirstLevelChildren(selector) {
      const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
      // remove children if greater depth
      return SelectorEngine.find(selector, this._config.parent).filter(element => !children.includes(element));
    }
    _addAriaAndCollapsedClass(triggerArray, isOpen) {
      if (!triggerArray.length) {
        return;
      }
      for (const element of triggerArray) {
        element.classList.toggle(CLASS_NAME_COLLAPSED, !isOpen);
        element.setAttribute('aria-expanded', isOpen);
      }
    }

    // Static
    static jQueryInterface(config) {
      const _config = {};
      if (typeof config === 'string' && /show|hide/.test(config)) {
        _config.toggle = false;
      }
      return this.each(function () {
        const data = Collapse.getOrCreateInstance(this, _config);
        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config]();
        }
      });
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function (event) {
    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
    if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
      event.preventDefault();
    }
    for (const element of SelectorEngine.getMultipleElementsFromSelector(this)) {
      Collapse.getOrCreateInstance(element, {
        toggle: false
      }).toggle();
    }
  });

  /**
   * jQuery
   */

  defineJQueryPlugin(Collapse);

  var top = 'top';
  var bottom = 'bottom';
  var right = 'right';
  var left = 'left';
  var auto = 'auto';
  var basePlacements = [top, bottom, right, left];
  var start = 'start';
  var end = 'end';
  var clippingParents = 'clippingParents';
  var viewport = 'viewport';
  var popper = 'popper';
  var reference = 'reference';
  var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
    return acc.concat([placement + "-" + start, placement + "-" + end]);
  }, []);
  var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
    return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
  }, []); // modifiers that need to read the DOM

  var beforeRead = 'beforeRead';
  var read = 'read';
  var afterRead = 'afterRead'; // pure-logic modifiers

  var beforeMain = 'beforeMain';
  var main = 'main';
  var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

  var beforeWrite = 'beforeWrite';
  var write = 'write';
  var afterWrite = 'afterWrite';
  var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

  function getNodeName(element) {
    return element ? (element.nodeName || '').toLowerCase() : null;
  }

  function getWindow(node) {
    if (node == null) {
      return window;
    }

    if (node.toString() !== '[object Window]') {
      var ownerDocument = node.ownerDocument;
      return ownerDocument ? ownerDocument.defaultView || window : window;
    }

    return node;
  }

  function isElement(node) {
    var OwnElement = getWindow(node).Element;
    return node instanceof OwnElement || node instanceof Element;
  }

  function isHTMLElement(node) {
    var OwnElement = getWindow(node).HTMLElement;
    return node instanceof OwnElement || node instanceof HTMLElement;
  }

  function isShadowRoot(node) {
    // IE 11 has no ShadowRoot
    if (typeof ShadowRoot === 'undefined') {
      return false;
    }

    var OwnElement = getWindow(node).ShadowRoot;
    return node instanceof OwnElement || node instanceof ShadowRoot;
  }

  // and applies them to the HTMLElements such as popper and arrow

  function applyStyles(_ref) {
    var state = _ref.state;
    Object.keys(state.elements).forEach(function (name) {
      var style = state.styles[name] || {};
      var attributes = state.attributes[name] || {};
      var element = state.elements[name]; // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      } // Flow doesn't support to extend this property, but it's the most
      // effective way to apply styles to an HTMLElement
      // $FlowFixMe[cannot-write]


      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (name) {
        var value = attributes[name];

        if (value === false) {
          element.removeAttribute(name);
        } else {
          element.setAttribute(name, value === true ? '' : value);
        }
      });
    });
  }

  function effect$2(_ref2) {
    var state = _ref2.state;
    var initialStyles = {
      popper: {
        position: state.options.strategy,
        left: '0',
        top: '0',
        margin: '0'
      },
      arrow: {
        position: 'absolute'
      },
      reference: {}
    };
    Object.assign(state.elements.popper.style, initialStyles.popper);
    state.styles = initialStyles;

    if (state.elements.arrow) {
      Object.assign(state.elements.arrow.style, initialStyles.arrow);
    }

    return function () {
      Object.keys(state.elements).forEach(function (name) {
        var element = state.elements[name];
        var attributes = state.attributes[name] || {};
        var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

        var style = styleProperties.reduce(function (style, property) {
          style[property] = '';
          return style;
        }, {}); // arrow is optional + virtual elements

        if (!isHTMLElement(element) || !getNodeName(element)) {
          return;
        }

        Object.assign(element.style, style);
        Object.keys(attributes).forEach(function (attribute) {
          element.removeAttribute(attribute);
        });
      });
    };
  } // eslint-disable-next-line import/no-unused-modules


  const applyStyles$1 = {
    name: 'applyStyles',
    enabled: true,
    phase: 'write',
    fn: applyStyles,
    effect: effect$2,
    requires: ['computeStyles']
  };

  function getBasePlacement(placement) {
    return placement.split('-')[0];
  }

  var max = Math.max;
  var min = Math.min;
  var round = Math.round;

  function getUAString() {
    var uaData = navigator.userAgentData;

    if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
      return uaData.brands.map(function (item) {
        return item.brand + "/" + item.version;
      }).join(' ');
    }

    return navigator.userAgent;
  }

  function isLayoutViewport() {
    return !/^((?!chrome|android).)*safari/i.test(getUAString());
  }

  function getBoundingClientRect(element, includeScale, isFixedStrategy) {
    if (includeScale === void 0) {
      includeScale = false;
    }

    if (isFixedStrategy === void 0) {
      isFixedStrategy = false;
    }

    var clientRect = element.getBoundingClientRect();
    var scaleX = 1;
    var scaleY = 1;

    if (includeScale && isHTMLElement(element)) {
      scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
      scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
    }

    var _ref = isElement(element) ? getWindow(element) : window,
        visualViewport = _ref.visualViewport;

    var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
    var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
    var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
    var width = clientRect.width / scaleX;
    var height = clientRect.height / scaleY;
    return {
      width: width,
      height: height,
      top: y,
      right: x + width,
      bottom: y + height,
      left: x,
      x: x,
      y: y
    };
  }

  // means it doesn't take into account transforms.

  function getLayoutRect(element) {
    var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
    // Fixes https://github.com/popperjs/popper-core/issues/1223

    var width = element.offsetWidth;
    var height = element.offsetHeight;

    if (Math.abs(clientRect.width - width) <= 1) {
      width = clientRect.width;
    }

    if (Math.abs(clientRect.height - height) <= 1) {
      height = clientRect.height;
    }

    return {
      x: element.offsetLeft,
      y: element.offsetTop,
      width: width,
      height: height
    };
  }

  function contains(parent, child) {
    var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

    if (parent.contains(child)) {
      return true;
    } // then fallback to custom implementation with Shadow DOM support
    else if (rootNode && isShadowRoot(rootNode)) {
        var next = child;

        do {
          if (next && parent.isSameNode(next)) {
            return true;
          } // $FlowFixMe[prop-missing]: need a better way to handle this...


          next = next.parentNode || next.host;
        } while (next);
      } // Give up, the result is false


    return false;
  }

  function getComputedStyle$1(element) {
    return getWindow(element).getComputedStyle(element);
  }

  function isTableElement(element) {
    return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
  }

  function getDocumentElement(element) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
    element.document) || window.document).documentElement;
  }

  function getParentNode(element) {
    if (getNodeName(element) === 'html') {
      return element;
    }

    return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
      // $FlowFixMe[incompatible-return]
      // $FlowFixMe[prop-missing]
      element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
      element.parentNode || ( // DOM Element detected
      isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
      // $FlowFixMe[incompatible-call]: HTMLElement is a Node
      getDocumentElement(element) // fallback

    );
  }

  function getTrueOffsetParent(element) {
    if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
    getComputedStyle$1(element).position === 'fixed') {
      return null;
    }

    return element.offsetParent;
  } // `.offsetParent` reports `null` for fixed elements, while absolute elements
  // return the containing block


  function getContainingBlock(element) {
    var isFirefox = /firefox/i.test(getUAString());
    var isIE = /Trident/i.test(getUAString());

    if (isIE && isHTMLElement(element)) {
      // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
      var elementCss = getComputedStyle$1(element);

      if (elementCss.position === 'fixed') {
        return null;
      }
    }

    var currentNode = getParentNode(element);

    if (isShadowRoot(currentNode)) {
      currentNode = currentNode.host;
    }

    while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
      var css = getComputedStyle$1(currentNode); // This is non-exhaustive but covers the most common CSS properties that
      // create a containing block.
      // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

      if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
        return currentNode;
      } else {
        currentNode = currentNode.parentNode;
      }
    }

    return null;
  } // Gets the closest ancestor positioned element. Handles some edge cases,
  // such as table ancestors and cross browser bugs.


  function getOffsetParent(element) {
    var window = getWindow(element);
    var offsetParent = getTrueOffsetParent(element);

    while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
      offsetParent = getTrueOffsetParent(offsetParent);
    }

    if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static')) {
      return window;
    }

    return offsetParent || getContainingBlock(element) || window;
  }

  function getMainAxisFromPlacement(placement) {
    return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
  }

  function within(min$1, value, max$1) {
    return max(min$1, min(value, max$1));
  }
  function withinMaxClamp(min, value, max) {
    var v = within(min, value, max);
    return v > max ? max : v;
  }

  function getFreshSideObject() {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
  }

  function mergePaddingObject(paddingObject) {
    return Object.assign({}, getFreshSideObject(), paddingObject);
  }

  function expandToHashMap(value, keys) {
    return keys.reduce(function (hashMap, key) {
      hashMap[key] = value;
      return hashMap;
    }, {});
  }

  var toPaddingObject = function toPaddingObject(padding, state) {
    padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
      placement: state.placement
    })) : padding;
    return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  };

  function arrow(_ref) {
    var _state$modifiersData$;

    var state = _ref.state,
        name = _ref.name,
        options = _ref.options;
    var arrowElement = state.elements.arrow;
    var popperOffsets = state.modifiersData.popperOffsets;
    var basePlacement = getBasePlacement(state.placement);
    var axis = getMainAxisFromPlacement(basePlacement);
    var isVertical = [left, right].indexOf(basePlacement) >= 0;
    var len = isVertical ? 'height' : 'width';

    if (!arrowElement || !popperOffsets) {
      return;
    }

    var paddingObject = toPaddingObject(options.padding, state);
    var arrowRect = getLayoutRect(arrowElement);
    var minProp = axis === 'y' ? top : left;
    var maxProp = axis === 'y' ? bottom : right;
    var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
    var startDiff = popperOffsets[axis] - state.rects.reference[axis];
    var arrowOffsetParent = getOffsetParent(arrowElement);
    var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
    var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
    // outside of the popper bounds

    var min = paddingObject[minProp];
    var max = clientSize - arrowRect[len] - paddingObject[maxProp];
    var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
    var offset = within(min, center, max); // Prevents breaking syntax highlighting...

    var axisProp = axis;
    state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
  }

  function effect$1(_ref2) {
    var state = _ref2.state,
        options = _ref2.options;
    var _options$element = options.element,
        arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

    if (arrowElement == null) {
      return;
    } // CSS selector


    if (typeof arrowElement === 'string') {
      arrowElement = state.elements.popper.querySelector(arrowElement);

      if (!arrowElement) {
        return;
      }
    }

    if (!contains(state.elements.popper, arrowElement)) {
      return;
    }

    state.elements.arrow = arrowElement;
  } // eslint-disable-next-line import/no-unused-modules


  const arrow$1 = {
    name: 'arrow',
    enabled: true,
    phase: 'main',
    fn: arrow,
    effect: effect$1,
    requires: ['popperOffsets'],
    requiresIfExists: ['preventOverflow']
  };

  function getVariation(placement) {
    return placement.split('-')[1];
  }

  var unsetSides = {
    top: 'auto',
    right: 'auto',
    bottom: 'auto',
    left: 'auto'
  }; // Round the offsets to the nearest suitable subpixel based on the DPR.
  // Zooming can change the DPR, but it seems to report a value that will
  // cleanly divide the values into the appropriate subpixels.

  function roundOffsetsByDPR(_ref, win) {
    var x = _ref.x,
        y = _ref.y;
    var dpr = win.devicePixelRatio || 1;
    return {
      x: round(x * dpr) / dpr || 0,
      y: round(y * dpr) / dpr || 0
    };
  }

  function mapToStyles(_ref2) {
    var _Object$assign2;

    var popper = _ref2.popper,
        popperRect = _ref2.popperRect,
        placement = _ref2.placement,
        variation = _ref2.variation,
        offsets = _ref2.offsets,
        position = _ref2.position,
        gpuAcceleration = _ref2.gpuAcceleration,
        adaptive = _ref2.adaptive,
        roundOffsets = _ref2.roundOffsets,
        isFixed = _ref2.isFixed;
    var _offsets$x = offsets.x,
        x = _offsets$x === void 0 ? 0 : _offsets$x,
        _offsets$y = offsets.y,
        y = _offsets$y === void 0 ? 0 : _offsets$y;

    var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
      x: x,
      y: y
    }) : {
      x: x,
      y: y
    };

    x = _ref3.x;
    y = _ref3.y;
    var hasX = offsets.hasOwnProperty('x');
    var hasY = offsets.hasOwnProperty('y');
    var sideX = left;
    var sideY = top;
    var win = window;

    if (adaptive) {
      var offsetParent = getOffsetParent(popper);
      var heightProp = 'clientHeight';
      var widthProp = 'clientWidth';

      if (offsetParent === getWindow(popper)) {
        offsetParent = getDocumentElement(popper);

        if (getComputedStyle$1(offsetParent).position !== 'static' && position === 'absolute') {
          heightProp = 'scrollHeight';
          widthProp = 'scrollWidth';
        }
      } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


      offsetParent = offsetParent;

      if (placement === top || (placement === left || placement === right) && variation === end) {
        sideY = bottom;
        var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
        offsetParent[heightProp];
        y -= offsetY - popperRect.height;
        y *= gpuAcceleration ? 1 : -1;
      }

      if (placement === left || (placement === top || placement === bottom) && variation === end) {
        sideX = right;
        var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
        offsetParent[widthProp];
        x -= offsetX - popperRect.width;
        x *= gpuAcceleration ? 1 : -1;
      }
    }

    var commonStyles = Object.assign({
      position: position
    }, adaptive && unsetSides);

    var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
      x: x,
      y: y
    }, getWindow(popper)) : {
      x: x,
      y: y
    };

    x = _ref4.x;
    y = _ref4.y;

    if (gpuAcceleration) {
      var _Object$assign;

      return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
    }

    return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
  }

  function computeStyles(_ref5) {
    var state = _ref5.state,
        options = _ref5.options;
    var _options$gpuAccelerat = options.gpuAcceleration,
        gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
        _options$adaptive = options.adaptive,
        adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
        _options$roundOffsets = options.roundOffsets,
        roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
    var commonStyles = {
      placement: getBasePlacement(state.placement),
      variation: getVariation(state.placement),
      popper: state.elements.popper,
      popperRect: state.rects.popper,
      gpuAcceleration: gpuAcceleration,
      isFixed: state.options.strategy === 'fixed'
    };

    if (state.modifiersData.popperOffsets != null) {
      state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.popperOffsets,
        position: state.options.strategy,
        adaptive: adaptive,
        roundOffsets: roundOffsets
      })));
    }

    if (state.modifiersData.arrow != null) {
      state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.arrow,
        position: 'absolute',
        adaptive: false,
        roundOffsets: roundOffsets
      })));
    }

    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      'data-popper-placement': state.placement
    });
  } // eslint-disable-next-line import/no-unused-modules


  const computeStyles$1 = {
    name: 'computeStyles',
    enabled: true,
    phase: 'beforeWrite',
    fn: computeStyles,
    data: {}
  };

  var passive = {
    passive: true
  };

  function effect(_ref) {
    var state = _ref.state,
        instance = _ref.instance,
        options = _ref.options;
    var _options$scroll = options.scroll,
        scroll = _options$scroll === void 0 ? true : _options$scroll,
        _options$resize = options.resize,
        resize = _options$resize === void 0 ? true : _options$resize;
    var window = getWindow(state.elements.popper);
    var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.addEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.addEventListener('resize', instance.update, passive);
    }

    return function () {
      if (scroll) {
        scrollParents.forEach(function (scrollParent) {
          scrollParent.removeEventListener('scroll', instance.update, passive);
        });
      }

      if (resize) {
        window.removeEventListener('resize', instance.update, passive);
      }
    };
  } // eslint-disable-next-line import/no-unused-modules


  const eventListeners = {
    name: 'eventListeners',
    enabled: true,
    phase: 'write',
    fn: function fn() {},
    effect: effect,
    data: {}
  };

  var hash$1 = {
    left: 'right',
    right: 'left',
    bottom: 'top',
    top: 'bottom'
  };
  function getOppositePlacement(placement) {
    return placement.replace(/left|right|bottom|top/g, function (matched) {
      return hash$1[matched];
    });
  }

  var hash = {
    start: 'end',
    end: 'start'
  };
  function getOppositeVariationPlacement(placement) {
    return placement.replace(/start|end/g, function (matched) {
      return hash[matched];
    });
  }

  function getWindowScroll(node) {
    var win = getWindow(node);
    var scrollLeft = win.pageXOffset;
    var scrollTop = win.pageYOffset;
    return {
      scrollLeft: scrollLeft,
      scrollTop: scrollTop
    };
  }

  function getWindowScrollBarX(element) {
    // If <html> has a CSS width greater than the viewport, then this will be
    // incorrect for RTL.
    // Popper 1 is broken in this case and never had a bug report so let's assume
    // it's not an issue. I don't think anyone ever specifies width on <html>
    // anyway.
    // Browsers where the left scrollbar doesn't cause an issue report `0` for
    // this (e.g. Edge 2019, IE11, Safari)
    return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
  }

  function getViewportRect(element, strategy) {
    var win = getWindow(element);
    var html = getDocumentElement(element);
    var visualViewport = win.visualViewport;
    var width = html.clientWidth;
    var height = html.clientHeight;
    var x = 0;
    var y = 0;

    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height;
      var layoutViewport = isLayoutViewport();

      if (layoutViewport || !layoutViewport && strategy === 'fixed') {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }

    return {
      width: width,
      height: height,
      x: x + getWindowScrollBarX(element),
      y: y
    };
  }

  // of the `<html>` and `<body>` rect bounds if horizontally scrollable

  function getDocumentRect(element) {
    var _element$ownerDocumen;

    var html = getDocumentElement(element);
    var winScroll = getWindowScroll(element);
    var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
    var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
    var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
    var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
    var y = -winScroll.scrollTop;

    if (getComputedStyle$1(body || html).direction === 'rtl') {
      x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
    }

    return {
      width: width,
      height: height,
      x: x,
      y: y
    };
  }

  function isScrollParent(element) {
    // Firefox wants us to check `-x` and `-y` variations as well
    var _getComputedStyle = getComputedStyle$1(element),
        overflow = _getComputedStyle.overflow,
        overflowX = _getComputedStyle.overflowX,
        overflowY = _getComputedStyle.overflowY;

    return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
  }

  function getScrollParent(node) {
    if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
      // $FlowFixMe[incompatible-return]: assume body is always available
      return node.ownerDocument.body;
    }

    if (isHTMLElement(node) && isScrollParent(node)) {
      return node;
    }

    return getScrollParent(getParentNode(node));
  }

  /*
  given a DOM element, return the list of all scroll parents, up the list of ancesors
  until we get to the top window object. This list is what we attach scroll listeners
  to, because if any of these parent elements scroll, we'll need to re-calculate the
  reference element's position.
  */

  function listScrollParents(element, list) {
    var _element$ownerDocumen;

    if (list === void 0) {
      list = [];
    }

    var scrollParent = getScrollParent(element);
    var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
    var win = getWindow(scrollParent);
    var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
    var updatedList = list.concat(target);
    return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    updatedList.concat(listScrollParents(getParentNode(target)));
  }

  function rectToClientRect(rect) {
    return Object.assign({}, rect, {
      left: rect.x,
      top: rect.y,
      right: rect.x + rect.width,
      bottom: rect.y + rect.height
    });
  }

  function getInnerBoundingClientRect(element, strategy) {
    var rect = getBoundingClientRect(element, false, strategy === 'fixed');
    rect.top = rect.top + element.clientTop;
    rect.left = rect.left + element.clientLeft;
    rect.bottom = rect.top + element.clientHeight;
    rect.right = rect.left + element.clientWidth;
    rect.width = element.clientWidth;
    rect.height = element.clientHeight;
    rect.x = rect.left;
    rect.y = rect.top;
    return rect;
  }

  function getClientRectFromMixedType(element, clippingParent, strategy) {
    return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
  } // A "clipping parent" is an overflowable container with the characteristic of
  // clipping (or hiding) overflowing elements with a position different from
  // `initial`


  function getClippingParents(element) {
    var clippingParents = listScrollParents(getParentNode(element));
    var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle$1(element).position) >= 0;
    var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

    if (!isElement(clipperElement)) {
      return [];
    } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


    return clippingParents.filter(function (clippingParent) {
      return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
    });
  } // Gets the maximum area that the element is visible in due to any number of
  // clipping parents


  function getClippingRect(element, boundary, rootBoundary, strategy) {
    var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
    var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
    var firstClippingParent = clippingParents[0];
    var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
      var rect = getClientRectFromMixedType(element, clippingParent, strategy);
      accRect.top = max(rect.top, accRect.top);
      accRect.right = min(rect.right, accRect.right);
      accRect.bottom = min(rect.bottom, accRect.bottom);
      accRect.left = max(rect.left, accRect.left);
      return accRect;
    }, getClientRectFromMixedType(element, firstClippingParent, strategy));
    clippingRect.width = clippingRect.right - clippingRect.left;
    clippingRect.height = clippingRect.bottom - clippingRect.top;
    clippingRect.x = clippingRect.left;
    clippingRect.y = clippingRect.top;
    return clippingRect;
  }

  function computeOffsets(_ref) {
    var reference = _ref.reference,
        element = _ref.element,
        placement = _ref.placement;
    var basePlacement = placement ? getBasePlacement(placement) : null;
    var variation = placement ? getVariation(placement) : null;
    var commonX = reference.x + reference.width / 2 - element.width / 2;
    var commonY = reference.y + reference.height / 2 - element.height / 2;
    var offsets;

    switch (basePlacement) {
      case top:
        offsets = {
          x: commonX,
          y: reference.y - element.height
        };
        break;

      case bottom:
        offsets = {
          x: commonX,
          y: reference.y + reference.height
        };
        break;

      case right:
        offsets = {
          x: reference.x + reference.width,
          y: commonY
        };
        break;

      case left:
        offsets = {
          x: reference.x - element.width,
          y: commonY
        };
        break;

      default:
        offsets = {
          x: reference.x,
          y: reference.y
        };
    }

    var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

    if (mainAxis != null) {
      var len = mainAxis === 'y' ? 'height' : 'width';

      switch (variation) {
        case start:
          offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
          break;

        case end:
          offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
          break;
      }
    }

    return offsets;
  }

  function detectOverflow(state, options) {
    if (options === void 0) {
      options = {};
    }

    var _options = options,
        _options$placement = _options.placement,
        placement = _options$placement === void 0 ? state.placement : _options$placement,
        _options$strategy = _options.strategy,
        strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
        _options$boundary = _options.boundary,
        boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
        _options$rootBoundary = _options.rootBoundary,
        rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
        _options$elementConte = _options.elementContext,
        elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
        _options$altBoundary = _options.altBoundary,
        altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
        _options$padding = _options.padding,
        padding = _options$padding === void 0 ? 0 : _options$padding;
    var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
    var altContext = elementContext === popper ? reference : popper;
    var popperRect = state.rects.popper;
    var element = state.elements[altBoundary ? altContext : elementContext];
    var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
    var referenceClientRect = getBoundingClientRect(state.elements.reference);
    var popperOffsets = computeOffsets({
      reference: referenceClientRect,
      element: popperRect,
      strategy: 'absolute',
      placement: placement
    });
    var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
    var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
    // 0 or negative = within the clipping rect

    var overflowOffsets = {
      top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
      bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
      left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
      right: elementClientRect.right - clippingClientRect.right + paddingObject.right
    };
    var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

    if (elementContext === popper && offsetData) {
      var offset = offsetData[placement];
      Object.keys(overflowOffsets).forEach(function (key) {
        var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
        var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
        overflowOffsets[key] += offset[axis] * multiply;
      });
    }

    return overflowOffsets;
  }

  function computeAutoPlacement(state, options) {
    if (options === void 0) {
      options = {};
    }

    var _options = options,
        placement = _options.placement,
        boundary = _options.boundary,
        rootBoundary = _options.rootBoundary,
        padding = _options.padding,
        flipVariations = _options.flipVariations,
        _options$allowedAutoP = _options.allowedAutoPlacements,
        allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
    var variation = getVariation(placement);
    var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
      return getVariation(placement) === variation;
    }) : basePlacements;
    var allowedPlacements = placements$1.filter(function (placement) {
      return allowedAutoPlacements.indexOf(placement) >= 0;
    });

    if (allowedPlacements.length === 0) {
      allowedPlacements = placements$1;
    } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


    var overflows = allowedPlacements.reduce(function (acc, placement) {
      acc[placement] = detectOverflow(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding
      })[getBasePlacement(placement)];
      return acc;
    }, {});
    return Object.keys(overflows).sort(function (a, b) {
      return overflows[a] - overflows[b];
    });
  }

  function getExpandedFallbackPlacements(placement) {
    if (getBasePlacement(placement) === auto) {
      return [];
    }

    var oppositePlacement = getOppositePlacement(placement);
    return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
  }

  function flip(_ref) {
    var state = _ref.state,
        options = _ref.options,
        name = _ref.name;

    if (state.modifiersData[name]._skip) {
      return;
    }

    var _options$mainAxis = options.mainAxis,
        checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
        _options$altAxis = options.altAxis,
        checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
        specifiedFallbackPlacements = options.fallbackPlacements,
        padding = options.padding,
        boundary = options.boundary,
        rootBoundary = options.rootBoundary,
        altBoundary = options.altBoundary,
        _options$flipVariatio = options.flipVariations,
        flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
        allowedAutoPlacements = options.allowedAutoPlacements;
    var preferredPlacement = state.options.placement;
    var basePlacement = getBasePlacement(preferredPlacement);
    var isBasePlacement = basePlacement === preferredPlacement;
    var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
    var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
      return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding,
        flipVariations: flipVariations,
        allowedAutoPlacements: allowedAutoPlacements
      }) : placement);
    }, []);
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var checksMap = new Map();
    var makeFallbackChecks = true;
    var firstFittingPlacement = placements[0];

    for (var i = 0; i < placements.length; i++) {
      var placement = placements[i];

      var _basePlacement = getBasePlacement(placement);

      var isStartVariation = getVariation(placement) === start;
      var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
      var len = isVertical ? 'width' : 'height';
      var overflow = detectOverflow(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        altBoundary: altBoundary,
        padding: padding
      });
      var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

      if (referenceRect[len] > popperRect[len]) {
        mainVariationSide = getOppositePlacement(mainVariationSide);
      }

      var altVariationSide = getOppositePlacement(mainVariationSide);
      var checks = [];

      if (checkMainAxis) {
        checks.push(overflow[_basePlacement] <= 0);
      }

      if (checkAltAxis) {
        checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
      }

      if (checks.every(function (check) {
        return check;
      })) {
        firstFittingPlacement = placement;
        makeFallbackChecks = false;
        break;
      }

      checksMap.set(placement, checks);
    }

    if (makeFallbackChecks) {
      // `2` may be desired in some cases – research later
      var numberOfChecks = flipVariations ? 3 : 1;

      var _loop = function _loop(_i) {
        var fittingPlacement = placements.find(function (placement) {
          var checks = checksMap.get(placement);

          if (checks) {
            return checks.slice(0, _i).every(function (check) {
              return check;
            });
          }
        });

        if (fittingPlacement) {
          firstFittingPlacement = fittingPlacement;
          return "break";
        }
      };

      for (var _i = numberOfChecks; _i > 0; _i--) {
        var _ret = _loop(_i);

        if (_ret === "break") break;
      }
    }

    if (state.placement !== firstFittingPlacement) {
      state.modifiersData[name]._skip = true;
      state.placement = firstFittingPlacement;
      state.reset = true;
    }
  } // eslint-disable-next-line import/no-unused-modules


  const flip$1 = {
    name: 'flip',
    enabled: true,
    phase: 'main',
    fn: flip,
    requiresIfExists: ['offset'],
    data: {
      _skip: false
    }
  };

  function getSideOffsets(overflow, rect, preventedOffsets) {
    if (preventedOffsets === void 0) {
      preventedOffsets = {
        x: 0,
        y: 0
      };
    }

    return {
      top: overflow.top - rect.height - preventedOffsets.y,
      right: overflow.right - rect.width + preventedOffsets.x,
      bottom: overflow.bottom - rect.height + preventedOffsets.y,
      left: overflow.left - rect.width - preventedOffsets.x
    };
  }

  function isAnySideFullyClipped(overflow) {
    return [top, right, bottom, left].some(function (side) {
      return overflow[side] >= 0;
    });
  }

  function hide(_ref) {
    var state = _ref.state,
        name = _ref.name;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var preventedOffsets = state.modifiersData.preventOverflow;
    var referenceOverflow = detectOverflow(state, {
      elementContext: 'reference'
    });
    var popperAltOverflow = detectOverflow(state, {
      altBoundary: true
    });
    var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
    var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
    var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
    var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
    state.modifiersData[name] = {
      referenceClippingOffsets: referenceClippingOffsets,
      popperEscapeOffsets: popperEscapeOffsets,
      isReferenceHidden: isReferenceHidden,
      hasPopperEscaped: hasPopperEscaped
    };
    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      'data-popper-reference-hidden': isReferenceHidden,
      'data-popper-escaped': hasPopperEscaped
    });
  } // eslint-disable-next-line import/no-unused-modules


  const hide$1 = {
    name: 'hide',
    enabled: true,
    phase: 'main',
    requiresIfExists: ['preventOverflow'],
    fn: hide
  };

  function distanceAndSkiddingToXY(placement, rects, offset) {
    var basePlacement = getBasePlacement(placement);
    var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

    var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
      placement: placement
    })) : offset,
        skidding = _ref[0],
        distance = _ref[1];

    skidding = skidding || 0;
    distance = (distance || 0) * invertDistance;
    return [left, right].indexOf(basePlacement) >= 0 ? {
      x: distance,
      y: skidding
    } : {
      x: skidding,
      y: distance
    };
  }

  function offset(_ref2) {
    var state = _ref2.state,
        options = _ref2.options,
        name = _ref2.name;
    var _options$offset = options.offset,
        offset = _options$offset === void 0 ? [0, 0] : _options$offset;
    var data = placements.reduce(function (acc, placement) {
      acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
      return acc;
    }, {});
    var _data$state$placement = data[state.placement],
        x = _data$state$placement.x,
        y = _data$state$placement.y;

    if (state.modifiersData.popperOffsets != null) {
      state.modifiersData.popperOffsets.x += x;
      state.modifiersData.popperOffsets.y += y;
    }

    state.modifiersData[name] = data;
  } // eslint-disable-next-line import/no-unused-modules


  const offset$1 = {
    name: 'offset',
    enabled: true,
    phase: 'main',
    requires: ['popperOffsets'],
    fn: offset
  };

  function popperOffsets(_ref) {
    var state = _ref.state,
        name = _ref.name;
    // Offsets are the actual position the popper needs to have to be
    // properly positioned near its reference element
    // This is the most basic placement, and will be adjusted by
    // the modifiers in the next step
    state.modifiersData[name] = computeOffsets({
      reference: state.rects.reference,
      element: state.rects.popper,
      strategy: 'absolute',
      placement: state.placement
    });
  } // eslint-disable-next-line import/no-unused-modules


  const popperOffsets$1 = {
    name: 'popperOffsets',
    enabled: true,
    phase: 'read',
    fn: popperOffsets,
    data: {}
  };

  function getAltAxis(axis) {
    return axis === 'x' ? 'y' : 'x';
  }

  function preventOverflow(_ref) {
    var state = _ref.state,
        options = _ref.options,
        name = _ref.name;
    var _options$mainAxis = options.mainAxis,
        checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
        _options$altAxis = options.altAxis,
        checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
        boundary = options.boundary,
        rootBoundary = options.rootBoundary,
        altBoundary = options.altBoundary,
        padding = options.padding,
        _options$tether = options.tether,
        tether = _options$tether === void 0 ? true : _options$tether,
        _options$tetherOffset = options.tetherOffset,
        tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
    var overflow = detectOverflow(state, {
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      altBoundary: altBoundary
    });
    var basePlacement = getBasePlacement(state.placement);
    var variation = getVariation(state.placement);
    var isBasePlacement = !variation;
    var mainAxis = getMainAxisFromPlacement(basePlacement);
    var altAxis = getAltAxis(mainAxis);
    var popperOffsets = state.modifiersData.popperOffsets;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
      placement: state.placement
    })) : tetherOffset;
    var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
      mainAxis: tetherOffsetValue,
      altAxis: tetherOffsetValue
    } : Object.assign({
      mainAxis: 0,
      altAxis: 0
    }, tetherOffsetValue);
    var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
    var data = {
      x: 0,
      y: 0
    };

    if (!popperOffsets) {
      return;
    }

    if (checkMainAxis) {
      var _offsetModifierState$;

      var mainSide = mainAxis === 'y' ? top : left;
      var altSide = mainAxis === 'y' ? bottom : right;
      var len = mainAxis === 'y' ? 'height' : 'width';
      var offset = popperOffsets[mainAxis];
      var min$1 = offset + overflow[mainSide];
      var max$1 = offset - overflow[altSide];
      var additive = tether ? -popperRect[len] / 2 : 0;
      var minLen = variation === start ? referenceRect[len] : popperRect[len];
      var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
      // outside the reference bounds

      var arrowElement = state.elements.arrow;
      var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
        width: 0,
        height: 0
      };
      var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
      var arrowPaddingMin = arrowPaddingObject[mainSide];
      var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
      // to include its full size in the calculation. If the reference is small
      // and near the edge of a boundary, the popper can overflow even if the
      // reference is not overflowing as well (e.g. virtual elements with no
      // width or height)

      var arrowLen = within(0, referenceRect[len], arrowRect[len]);
      var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
      var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
      var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
      var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
      var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
      var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
      var tetherMax = offset + maxOffset - offsetModifierValue;
      var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
      popperOffsets[mainAxis] = preventedOffset;
      data[mainAxis] = preventedOffset - offset;
    }

    if (checkAltAxis) {
      var _offsetModifierState$2;

      var _mainSide = mainAxis === 'x' ? top : left;

      var _altSide = mainAxis === 'x' ? bottom : right;

      var _offset = popperOffsets[altAxis];

      var _len = altAxis === 'y' ? 'height' : 'width';

      var _min = _offset + overflow[_mainSide];

      var _max = _offset - overflow[_altSide];

      var isOriginSide = [top, left].indexOf(basePlacement) !== -1;

      var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

      var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

      var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

      var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

      popperOffsets[altAxis] = _preventedOffset;
      data[altAxis] = _preventedOffset - _offset;
    }

    state.modifiersData[name] = data;
  } // eslint-disable-next-line import/no-unused-modules


  const preventOverflow$1 = {
    name: 'preventOverflow',
    enabled: true,
    phase: 'main',
    fn: preventOverflow,
    requiresIfExists: ['offset']
  };

  function getHTMLElementScroll(element) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }

  function getNodeScroll(node) {
    if (node === getWindow(node) || !isHTMLElement(node)) {
      return getWindowScroll(node);
    } else {
      return getHTMLElementScroll(node);
    }
  }

  function isElementScaled(element) {
    var rect = element.getBoundingClientRect();
    var scaleX = round(rect.width) / element.offsetWidth || 1;
    var scaleY = round(rect.height) / element.offsetHeight || 1;
    return scaleX !== 1 || scaleY !== 1;
  } // Returns the composite rect of an element relative to its offsetParent.
  // Composite means it takes into account transforms as well as layout.


  function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
    if (isFixed === void 0) {
      isFixed = false;
    }

    var isOffsetParentAnElement = isHTMLElement(offsetParent);
    var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
    var documentElement = getDocumentElement(offsetParent);
    var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
    var scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    var offsets = {
      x: 0,
      y: 0
    };

    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
      isScrollParent(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }

      if (isHTMLElement(offsetParent)) {
        offsets = getBoundingClientRect(offsetParent, true);
        offsets.x += offsetParent.clientLeft;
        offsets.y += offsetParent.clientTop;
      } else if (documentElement) {
        offsets.x = getWindowScrollBarX(documentElement);
      }
    }

    return {
      x: rect.left + scroll.scrollLeft - offsets.x,
      y: rect.top + scroll.scrollTop - offsets.y,
      width: rect.width,
      height: rect.height
    };
  }

  function order(modifiers) {
    var map = new Map();
    var visited = new Set();
    var result = [];
    modifiers.forEach(function (modifier) {
      map.set(modifier.name, modifier);
    }); // On visiting object, check for its dependencies and visit them recursively

    function sort(modifier) {
      visited.add(modifier.name);
      var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
      requires.forEach(function (dep) {
        if (!visited.has(dep)) {
          var depModifier = map.get(dep);

          if (depModifier) {
            sort(depModifier);
          }
        }
      });
      result.push(modifier);
    }

    modifiers.forEach(function (modifier) {
      if (!visited.has(modifier.name)) {
        // check for visited object
        sort(modifier);
      }
    });
    return result;
  }

  function orderModifiers(modifiers) {
    // order based on dependencies
    var orderedModifiers = order(modifiers); // order based on phase

    return modifierPhases.reduce(function (acc, phase) {
      return acc.concat(orderedModifiers.filter(function (modifier) {
        return modifier.phase === phase;
      }));
    }, []);
  }

  function debounce(fn) {
    var pending;
    return function () {
      if (!pending) {
        pending = new Promise(function (resolve) {
          Promise.resolve().then(function () {
            pending = undefined;
            resolve(fn());
          });
        });
      }

      return pending;
    };
  }

  function mergeByName(modifiers) {
    var merged = modifiers.reduce(function (merged, current) {
      var existing = merged[current.name];
      merged[current.name] = existing ? Object.assign({}, existing, current, {
        options: Object.assign({}, existing.options, current.options),
        data: Object.assign({}, existing.data, current.data)
      }) : current;
      return merged;
    }, {}); // IE11 does not support Object.values

    return Object.keys(merged).map(function (key) {
      return merged[key];
    });
  }

  var DEFAULT_OPTIONS = {
    placement: 'bottom',
    modifiers: [],
    strategy: 'absolute'
  };

  function areValidElements() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return !args.some(function (element) {
      return !(element && typeof element.getBoundingClientRect === 'function');
    });
  }

  function popperGenerator(generatorOptions) {
    if (generatorOptions === void 0) {
      generatorOptions = {};
    }

    var _generatorOptions = generatorOptions,
        _generatorOptions$def = _generatorOptions.defaultModifiers,
        defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
        _generatorOptions$def2 = _generatorOptions.defaultOptions,
        defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
    return function createPopper(reference, popper, options) {
      if (options === void 0) {
        options = defaultOptions;
      }

      var state = {
        placement: 'bottom',
        orderedModifiers: [],
        options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
        modifiersData: {},
        elements: {
          reference: reference,
          popper: popper
        },
        attributes: {},
        styles: {}
      };
      var effectCleanupFns = [];
      var isDestroyed = false;
      var instance = {
        state: state,
        setOptions: function setOptions(setOptionsAction) {
          var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
          cleanupModifierEffects();
          state.options = Object.assign({}, defaultOptions, state.options, options);
          state.scrollParents = {
            reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
            popper: listScrollParents(popper)
          }; // Orders the modifiers based on their dependencies and `phase`
          // properties

          var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

          state.orderedModifiers = orderedModifiers.filter(function (m) {
            return m.enabled;
          });
          runModifierEffects();
          return instance.update();
        },
        // Sync update – it will always be executed, even if not necessary. This
        // is useful for low frequency updates where sync behavior simplifies the
        // logic.
        // For high frequency updates (e.g. `resize` and `scroll` events), always
        // prefer the async Popper#update method
        forceUpdate: function forceUpdate() {
          if (isDestroyed) {
            return;
          }

          var _state$elements = state.elements,
              reference = _state$elements.reference,
              popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
          // anymore

          if (!areValidElements(reference, popper)) {
            return;
          } // Store the reference and popper rects to be read by modifiers


          state.rects = {
            reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
            popper: getLayoutRect(popper)
          }; // Modifiers have the ability to reset the current update cycle. The
          // most common use case for this is the `flip` modifier changing the
          // placement, which then needs to re-run all the modifiers, because the
          // logic was previously ran for the previous placement and is therefore
          // stale/incorrect

          state.reset = false;
          state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
          // is filled with the initial data specified by the modifier. This means
          // it doesn't persist and is fresh on each update.
          // To ensure persistent data, use `${name}#persistent`

          state.orderedModifiers.forEach(function (modifier) {
            return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
          });

          for (var index = 0; index < state.orderedModifiers.length; index++) {
            if (state.reset === true) {
              state.reset = false;
              index = -1;
              continue;
            }

            var _state$orderedModifie = state.orderedModifiers[index],
                fn = _state$orderedModifie.fn,
                _state$orderedModifie2 = _state$orderedModifie.options,
                _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
                name = _state$orderedModifie.name;

            if (typeof fn === 'function') {
              state = fn({
                state: state,
                options: _options,
                name: name,
                instance: instance
              }) || state;
            }
          }
        },
        // Async and optimistically optimized update – it will not be executed if
        // not necessary (debounced to run at most once-per-tick)
        update: debounce(function () {
          return new Promise(function (resolve) {
            instance.forceUpdate();
            resolve(state);
          });
        }),
        destroy: function destroy() {
          cleanupModifierEffects();
          isDestroyed = true;
        }
      };

      if (!areValidElements(reference, popper)) {
        return instance;
      }

      instance.setOptions(options).then(function (state) {
        if (!isDestroyed && options.onFirstUpdate) {
          options.onFirstUpdate(state);
        }
      }); // Modifiers have the ability to execute arbitrary code before the first
      // update cycle runs. They will be executed in the same order as the update
      // cycle. This is useful when a modifier adds some persistent data that
      // other modifiers need to use, but the modifier is run after the dependent
      // one.

      function runModifierEffects() {
        state.orderedModifiers.forEach(function (_ref) {
          var name = _ref.name,
              _ref$options = _ref.options,
              options = _ref$options === void 0 ? {} : _ref$options,
              effect = _ref.effect;

          if (typeof effect === 'function') {
            var cleanupFn = effect({
              state: state,
              name: name,
              instance: instance,
              options: options
            });

            var noopFn = function noopFn() {};

            effectCleanupFns.push(cleanupFn || noopFn);
          }
        });
      }

      function cleanupModifierEffects() {
        effectCleanupFns.forEach(function (fn) {
          return fn();
        });
        effectCleanupFns = [];
      }

      return instance;
    };
  }
  var createPopper$2 = /*#__PURE__*/popperGenerator(); // eslint-disable-next-line import/no-unused-modules

  var defaultModifiers$1 = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1];
  var createPopper$1 = /*#__PURE__*/popperGenerator({
    defaultModifiers: defaultModifiers$1
  }); // eslint-disable-next-line import/no-unused-modules

  var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
  var createPopper = /*#__PURE__*/popperGenerator({
    defaultModifiers: defaultModifiers
  }); // eslint-disable-next-line import/no-unused-modules

  const Popper = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    afterMain,
    afterRead,
    afterWrite,
    applyStyles: applyStyles$1,
    arrow: arrow$1,
    auto,
    basePlacements,
    beforeMain,
    beforeRead,
    beforeWrite,
    bottom,
    clippingParents,
    computeStyles: computeStyles$1,
    createPopper,
    createPopperBase: createPopper$2,
    createPopperLite: createPopper$1,
    detectOverflow,
    end,
    eventListeners,
    flip: flip$1,
    hide: hide$1,
    left,
    main,
    modifierPhases,
    offset: offset$1,
    placements,
    popper,
    popperGenerator,
    popperOffsets: popperOffsets$1,
    preventOverflow: preventOverflow$1,
    read,
    reference,
    right,
    start,
    top,
    variationPlacements,
    viewport,
    write
  }, Symbol.toStringTag, { value: 'Module' }));

  /**
   * --------------------------------------------------------------------------
   * Bootstrap dropdown.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$a = 'dropdown';
  const DATA_KEY$6 = 'bs.dropdown';
  const EVENT_KEY$6 = `.${DATA_KEY$6}`;
  const DATA_API_KEY$3 = '.data-api';
  const ESCAPE_KEY$2 = 'Escape';
  const TAB_KEY$1 = 'Tab';
  const ARROW_UP_KEY$1 = 'ArrowUp';
  const ARROW_DOWN_KEY$1 = 'ArrowDown';
  const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button

  const EVENT_HIDE$5 = `hide${EVENT_KEY$6}`;
  const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$6}`;
  const EVENT_SHOW$5 = `show${EVENT_KEY$6}`;
  const EVENT_SHOWN$5 = `shown${EVENT_KEY$6}`;
  const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
  const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$6}${DATA_API_KEY$3}`;
  const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$6}${DATA_API_KEY$3}`;
  const CLASS_NAME_SHOW$6 = 'show';
  const CLASS_NAME_DROPUP = 'dropup';
  const CLASS_NAME_DROPEND = 'dropend';
  const CLASS_NAME_DROPSTART = 'dropstart';
  const CLASS_NAME_DROPUP_CENTER = 'dropup-center';
  const CLASS_NAME_DROPDOWN_CENTER = 'dropdown-center';
  const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)';
  const SELECTOR_DATA_TOGGLE_SHOWN = `${SELECTOR_DATA_TOGGLE$3}.${CLASS_NAME_SHOW$6}`;
  const SELECTOR_MENU = '.dropdown-menu';
  const SELECTOR_NAVBAR = '.navbar';
  const SELECTOR_NAVBAR_NAV = '.navbar-nav';
  const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
  const PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start';
  const PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end';
  const PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start';
  const PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end';
  const PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start';
  const PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start';
  const PLACEMENT_TOPCENTER = 'top';
  const PLACEMENT_BOTTOMCENTER = 'bottom';
  const Default$9 = {
    autoClose: true,
    boundary: 'clippingParents',
    display: 'dynamic',
    offset: [0, 2],
    popperConfig: null,
    reference: 'toggle'
  };
  const DefaultType$9 = {
    autoClose: '(boolean|string)',
    boundary: '(string|element)',
    display: 'string',
    offset: '(array|string|function)',
    popperConfig: '(null|object|function)',
    reference: '(string|element|object)'
  };

  /**
   * Class definition
   */

  class Dropdown extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._popper = null;
      this._parent = this._element.parentNode; // dropdown wrapper
      // TODO: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.3/forms/input-group/
      this._menu = SelectorEngine.next(this._element, SELECTOR_MENU)[0] || SelectorEngine.prev(this._element, SELECTOR_MENU)[0] || SelectorEngine.findOne(SELECTOR_MENU, this._parent);
      this._inNavbar = this._detectNavbar();
    }

    // Getters
    static get Default() {
      return Default$9;
    }
    static get DefaultType() {
      return DefaultType$9;
    }
    static get NAME() {
      return NAME$a;
    }

    // Public
    toggle() {
      return this._isShown() ? this.hide() : this.show();
    }
    show() {
      if (isDisabled(this._element) || this._isShown()) {
        return;
      }
      const relatedTarget = {
        relatedTarget: this._element
      };
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$5, relatedTarget);
      if (showEvent.defaultPrevented) {
        return;
      }
      this._createPopper();

      // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
      if ('ontouchstart' in document.documentElement && !this._parent.closest(SELECTOR_NAVBAR_NAV)) {
        for (const element of [].concat(...document.body.children)) {
          EventHandler.on(element, 'mouseover', noop);
        }
      }
      this._element.focus();
      this._element.setAttribute('aria-expanded', true);
      this._menu.classList.add(CLASS_NAME_SHOW$6);
      this._element.classList.add(CLASS_NAME_SHOW$6);
      EventHandler.trigger(this._element, EVENT_SHOWN$5, relatedTarget);
    }
    hide() {
      if (isDisabled(this._element) || !this._isShown()) {
        return;
      }
      const relatedTarget = {
        relatedTarget: this._element
      };
      this._completeHide(relatedTarget);
    }
    dispose() {
      if (this._popper) {
        this._popper.destroy();
      }
      super.dispose();
    }
    update() {
      this._inNavbar = this._detectNavbar();
      if (this._popper) {
        this._popper.update();
      }
    }

    // Private
    _completeHide(relatedTarget) {
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$5, relatedTarget);
      if (hideEvent.defaultPrevented) {
        return;
      }

      // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support
      if ('ontouchstart' in document.documentElement) {
        for (const element of [].concat(...document.body.children)) {
          EventHandler.off(element, 'mouseover', noop);
        }
      }
      if (this._popper) {
        this._popper.destroy();
      }
      this._menu.classList.remove(CLASS_NAME_SHOW$6);
      this._element.classList.remove(CLASS_NAME_SHOW$6);
      this._element.setAttribute('aria-expanded', 'false');
      Manipulator.removeDataAttribute(this._menu, 'popper');
      EventHandler.trigger(this._element, EVENT_HIDDEN$5, relatedTarget);
    }
    _getConfig(config) {
      config = super._getConfig(config);
      if (typeof config.reference === 'object' && !isElement$1(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
        // Popper virtual elements require a getBoundingClientRect method
        throw new TypeError(`${NAME$a.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
      }
      return config;
    }
    _createPopper() {
      if (typeof Popper === 'undefined') {
        throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
      }
      let referenceElement = this._element;
      if (this._config.reference === 'parent') {
        referenceElement = this._parent;
      } else if (isElement$1(this._config.reference)) {
        referenceElement = getElement(this._config.reference);
      } else if (typeof this._config.reference === 'object') {
        referenceElement = this._config.reference;
      }
      const popperConfig = this._getPopperConfig();
      this._popper = createPopper(referenceElement, this._menu, popperConfig);
    }
    _isShown() {
      return this._menu.classList.contains(CLASS_NAME_SHOW$6);
    }
    _getPlacement() {
      const parentDropdown = this._parent;
      if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
        return PLACEMENT_RIGHT;
      }
      if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
        return PLACEMENT_LEFT;
      }
      if (parentDropdown.classList.contains(CLASS_NAME_DROPUP_CENTER)) {
        return PLACEMENT_TOPCENTER;
      }
      if (parentDropdown.classList.contains(CLASS_NAME_DROPDOWN_CENTER)) {
        return PLACEMENT_BOTTOMCENTER;
      }

      // We need to trim the value because custom properties can also include spaces
      const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';
      if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
        return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
      }
      return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
    }
    _detectNavbar() {
      return this._element.closest(SELECTOR_NAVBAR) !== null;
    }
    _getOffset() {
      const {
        offset
      } = this._config;
      if (typeof offset === 'string') {
        return offset.split(',').map(value => Number.parseInt(value, 10));
      }
      if (typeof offset === 'function') {
        return popperData => offset(popperData, this._element);
      }
      return offset;
    }
    _getPopperConfig() {
      const defaultBsPopperConfig = {
        placement: this._getPlacement(),
        modifiers: [{
          name: 'preventOverflow',
          options: {
            boundary: this._config.boundary
          }
        }, {
          name: 'offset',
          options: {
            offset: this._getOffset()
          }
        }]
      };

      // Disable Popper if we have a static display or Dropdown is in Navbar
      if (this._inNavbar || this._config.display === 'static') {
        Manipulator.setDataAttribute(this._menu, 'popper', 'static'); // TODO: v6 remove
        defaultBsPopperConfig.modifiers = [{
          name: 'applyStyles',
          enabled: false
        }];
      }
      return {
        ...defaultBsPopperConfig,
        ...execute(this._config.popperConfig, [defaultBsPopperConfig])
      };
    }
    _selectMenuItem({
      key,
      target
    }) {
      const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(element => isVisible(element));
      if (!items.length) {
        return;
      }

      // if target isn't included in items (e.g. when expanding the dropdown)
      // allow cycling to get the last item in case key equals ARROW_UP_KEY
      getNextActiveElement(items, target, key === ARROW_DOWN_KEY$1, !items.includes(target)).focus();
    }

    // Static
    static jQueryInterface(config) {
      return this.each(function () {
        const data = Dropdown.getOrCreateInstance(this, config);
        if (typeof config !== 'string') {
          return;
        }
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      });
    }
    static clearMenus(event) {
      if (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY$1) {
        return;
      }
      const openToggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE_SHOWN);
      for (const toggle of openToggles) {
        const context = Dropdown.getInstance(toggle);
        if (!context || context._config.autoClose === false) {
          continue;
        }
        const composedPath = event.composedPath();
        const isMenuTarget = composedPath.includes(context._menu);
        if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
          continue;
        }

        // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu
        if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName))) {
          continue;
        }
        const relatedTarget = {
          relatedTarget: context._element
        };
        if (event.type === 'click') {
          relatedTarget.clickEvent = event;
        }
        context._completeHide(relatedTarget);
      }
    }
    static dataApiKeydownHandler(event) {
      // If not an UP | DOWN | ESCAPE key => not a dropdown command
      // If input/textarea && if key is other than ESCAPE => not a dropdown command

      const isInput = /input|textarea/i.test(event.target.tagName);
      const isEscapeEvent = event.key === ESCAPE_KEY$2;
      const isUpOrDownEvent = [ARROW_UP_KEY$1, ARROW_DOWN_KEY$1].includes(event.key);
      if (!isUpOrDownEvent && !isEscapeEvent) {
        return;
      }
      if (isInput && !isEscapeEvent) {
        return;
      }
      event.preventDefault();

      // TODO: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.3/forms/input-group/
      const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.next(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.findOne(SELECTOR_DATA_TOGGLE$3, event.delegateTarget.parentNode);
      const instance = Dropdown.getOrCreateInstance(getToggleButton);
      if (isUpOrDownEvent) {
        event.stopPropagation();
        instance.show();
        instance._selectMenuItem(event);
        return;
      }
      if (instance._isShown()) {
        // else is escape and we check if it is shown
        event.stopPropagation();
        instance.hide();
        getToggleButton.focus();
      }
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
  EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
  EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
  EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
  EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
    event.preventDefault();
    Dropdown.getOrCreateInstance(this).toggle();
  });

  /**
   * jQuery
   */

  defineJQueryPlugin(Dropdown);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/backdrop.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$9 = 'backdrop';
  const CLASS_NAME_FADE$4 = 'fade';
  const CLASS_NAME_SHOW$5 = 'show';
  const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$9}`;
  const Default$8 = {
    className: 'modal-backdrop',
    clickCallback: null,
    isAnimated: false,
    isVisible: true,
    // if false, we use the backdrop helper without adding any element to the dom
    rootElement: 'body' // give the choice to place backdrop under different elements
  };

  const DefaultType$8 = {
    className: 'string',
    clickCallback: '(function|null)',
    isAnimated: 'boolean',
    isVisible: 'boolean',
    rootElement: '(element|string)'
  };

  /**
   * Class definition
   */

  class Backdrop extends Config {
    constructor(config) {
      super();
      this._config = this._getConfig(config);
      this._isAppended = false;
      this._element = null;
    }

    // Getters
    static get Default() {
      return Default$8;
    }
    static get DefaultType() {
      return DefaultType$8;
    }
    static get NAME() {
      return NAME$9;
    }

    // Public
    show(callback) {
      if (!this._config.isVisible) {
        execute(callback);
        return;
      }
      this._append();
      const element = this._getElement();
      if (this._config.isAnimated) {
        reflow(element);
      }
      element.classList.add(CLASS_NAME_SHOW$5);
      this._emulateAnimation(() => {
        execute(callback);
      });
    }
    hide(callback) {
      if (!this._config.isVisible) {
        execute(callback);
        return;
      }
      this._getElement().classList.remove(CLASS_NAME_SHOW$5);
      this._emulateAnimation(() => {
        this.dispose();
        execute(callback);
      });
    }
    dispose() {
      if (!this._isAppended) {
        return;
      }
      EventHandler.off(this._element, EVENT_MOUSEDOWN);
      this._element.remove();
      this._isAppended = false;
    }

    // Private
    _getElement() {
      if (!this._element) {
        const backdrop = document.createElement('div');
        backdrop.className = this._config.className;
        if (this._config.isAnimated) {
          backdrop.classList.add(CLASS_NAME_FADE$4);
        }
        this._element = backdrop;
      }
      return this._element;
    }
    _configAfterMerge(config) {
      // use getElement() with the default "body" to get a fresh Element on each instantiation
      config.rootElement = getElement(config.rootElement);
      return config;
    }
    _append() {
      if (this._isAppended) {
        return;
      }
      const element = this._getElement();
      this._config.rootElement.append(element);
      EventHandler.on(element, EVENT_MOUSEDOWN, () => {
        execute(this._config.clickCallback);
      });
      this._isAppended = true;
    }
    _emulateAnimation(callback) {
      executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/focustrap.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$8 = 'focustrap';
  const DATA_KEY$5 = 'bs.focustrap';
  const EVENT_KEY$5 = `.${DATA_KEY$5}`;
  const EVENT_FOCUSIN$2 = `focusin${EVENT_KEY$5}`;
  const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$5}`;
  const TAB_KEY = 'Tab';
  const TAB_NAV_FORWARD = 'forward';
  const TAB_NAV_BACKWARD = 'backward';
  const Default$7 = {
    autofocus: true,
    trapElement: null // The element to trap focus inside of
  };

  const DefaultType$7 = {
    autofocus: 'boolean',
    trapElement: 'element'
  };

  /**
   * Class definition
   */

  class FocusTrap extends Config {
    constructor(config) {
      super();
      this._config = this._getConfig(config);
      this._isActive = false;
      this._lastTabNavDirection = null;
    }

    // Getters
    static get Default() {
      return Default$7;
    }
    static get DefaultType() {
      return DefaultType$7;
    }
    static get NAME() {
      return NAME$8;
    }

    // Public
    activate() {
      if (this._isActive) {
        return;
      }
      if (this._config.autofocus) {
        this._config.trapElement.focus();
      }
      EventHandler.off(document, EVENT_KEY$5); // guard against infinite focus loop
      EventHandler.on(document, EVENT_FOCUSIN$2, event => this._handleFocusin(event));
      EventHandler.on(document, EVENT_KEYDOWN_TAB, event => this._handleKeydown(event));
      this._isActive = true;
    }
    deactivate() {
      if (!this._isActive) {
        return;
      }
      this._isActive = false;
      EventHandler.off(document, EVENT_KEY$5);
    }

    // Private
    _handleFocusin(event) {
      const {
        trapElement
      } = this._config;
      if (event.target === document || event.target === trapElement || trapElement.contains(event.target)) {
        return;
      }
      const elements = SelectorEngine.focusableChildren(trapElement);
      if (elements.length === 0) {
        trapElement.focus();
      } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
        elements[elements.length - 1].focus();
      } else {
        elements[0].focus();
      }
    }
    _handleKeydown(event) {
      if (event.key !== TAB_KEY) {
        return;
      }
      this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/scrollBar.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
  const SELECTOR_STICKY_CONTENT = '.sticky-top';
  const PROPERTY_PADDING = 'padding-right';
  const PROPERTY_MARGIN = 'margin-right';

  /**
   * Class definition
   */

  class ScrollBarHelper {
    constructor() {
      this._element = document.body;
    }

    // Public
    getWidth() {
      // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
      const documentWidth = document.documentElement.clientWidth;
      return Math.abs(window.innerWidth - documentWidth);
    }
    hide() {
      const width = this.getWidth();
      this._disableOverFlow();
      // give padding to element to balance the hidden scrollbar width
      this._setElementAttributes(this._element, PROPERTY_PADDING, calculatedValue => calculatedValue + width);
      // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth
      this._setElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING, calculatedValue => calculatedValue + width);
      this._setElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN, calculatedValue => calculatedValue - width);
    }
    reset() {
      this._resetElementAttributes(this._element, 'overflow');
      this._resetElementAttributes(this._element, PROPERTY_PADDING);
      this._resetElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING);
      this._resetElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN);
    }
    isOverflowing() {
      return this.getWidth() > 0;
    }

    // Private
    _disableOverFlow() {
      this._saveInitialAttribute(this._element, 'overflow');
      this._element.style.overflow = 'hidden';
    }
    _setElementAttributes(selector, styleProperty, callback) {
      const scrollbarWidth = this.getWidth();
      const manipulationCallBack = element => {
        if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
          return;
        }
        this._saveInitialAttribute(element, styleProperty);
        const calculatedValue = window.getComputedStyle(element).getPropertyValue(styleProperty);
        element.style.setProperty(styleProperty, `${callback(Number.parseFloat(calculatedValue))}px`);
      };
      this._applyManipulationCallback(selector, manipulationCallBack);
    }
    _saveInitialAttribute(element, styleProperty) {
      const actualValue = element.style.getPropertyValue(styleProperty);
      if (actualValue) {
        Manipulator.setDataAttribute(element, styleProperty, actualValue);
      }
    }
    _resetElementAttributes(selector, styleProperty) {
      const manipulationCallBack = element => {
        const value = Manipulator.getDataAttribute(element, styleProperty);
        // We only want to remove the property if the value is `null`; the value can also be zero
        if (value === null) {
          element.style.removeProperty(styleProperty);
          return;
        }
        Manipulator.removeDataAttribute(element, styleProperty);
        element.style.setProperty(styleProperty, value);
      };
      this._applyManipulationCallback(selector, manipulationCallBack);
    }
    _applyManipulationCallback(selector, callBack) {
      if (isElement$1(selector)) {
        callBack(selector);
        return;
      }
      for (const sel of SelectorEngine.find(selector, this._element)) {
        callBack(sel);
      }
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap modal.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$7 = 'modal';
  const DATA_KEY$4 = 'bs.modal';
  const EVENT_KEY$4 = `.${DATA_KEY$4}`;
  const DATA_API_KEY$2 = '.data-api';
  const ESCAPE_KEY$1 = 'Escape';
  const EVENT_HIDE$4 = `hide${EVENT_KEY$4}`;
  const EVENT_HIDE_PREVENTED$1 = `hidePrevented${EVENT_KEY$4}`;
  const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$4}`;
  const EVENT_SHOW$4 = `show${EVENT_KEY$4}`;
  const EVENT_SHOWN$4 = `shown${EVENT_KEY$4}`;
  const EVENT_RESIZE$1 = `resize${EVENT_KEY$4}`;
  const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY$4}`;
  const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$4}`;
  const EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$4}`;
  const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$4}${DATA_API_KEY$2}`;
  const CLASS_NAME_OPEN = 'modal-open';
  const CLASS_NAME_FADE$3 = 'fade';
  const CLASS_NAME_SHOW$4 = 'show';
  const CLASS_NAME_STATIC = 'modal-static';
  const OPEN_SELECTOR$1 = '.modal.show';
  const SELECTOR_DIALOG = '.modal-dialog';
  const SELECTOR_MODAL_BODY = '.modal-body';
  const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
  const Default$6 = {
    backdrop: true,
    focus: true,
    keyboard: true
  };
  const DefaultType$6 = {
    backdrop: '(boolean|string)',
    focus: 'boolean',
    keyboard: 'boolean'
  };

  /**
   * Class definition
   */

  class Modal extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
      this._backdrop = this._initializeBackDrop();
      this._focustrap = this._initializeFocusTrap();
      this._isShown = false;
      this._isTransitioning = false;
      this._scrollBar = new ScrollBarHelper();
      this._addEventListeners();
    }

    // Getters
    static get Default() {
      return Default$6;
    }
    static get DefaultType() {
      return DefaultType$6;
    }
    static get NAME() {
      return NAME$7;
    }

    // Public
    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    }
    show(relatedTarget) {
      if (this._isShown || this._isTransitioning) {
        return;
      }
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, {
        relatedTarget
      });
      if (showEvent.defaultPrevented) {
        return;
      }
      this._isShown = true;
      this._isTransitioning = true;
      this._scrollBar.hide();
      document.body.classList.add(CLASS_NAME_OPEN);
      this._adjustDialog();
      this._backdrop.show(() => this._showElement(relatedTarget));
    }
    hide() {
      if (!this._isShown || this._isTransitioning) {
        return;
      }
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4);
      if (hideEvent.defaultPrevented) {
        return;
      }
      this._isShown = false;
      this._isTransitioning = true;
      this._focustrap.deactivate();
      this._element.classList.remove(CLASS_NAME_SHOW$4);
      this._queueCallback(() => this._hideModal(), this._element, this._isAnimated());
    }
    dispose() {
      EventHandler.off(window, EVENT_KEY$4);
      EventHandler.off(this._dialog, EVENT_KEY$4);
      this._backdrop.dispose();
      this._focustrap.deactivate();
      super.dispose();
    }
    handleUpdate() {
      this._adjustDialog();
    }

    // Private
    _initializeBackDrop() {
      return new Backdrop({
        isVisible: Boolean(this._config.backdrop),
        // 'static' option will be translated to true, and booleans will keep their value,
        isAnimated: this._isAnimated()
      });
    }
    _initializeFocusTrap() {
      return new FocusTrap({
        trapElement: this._element
      });
    }
    _showElement(relatedTarget) {
      // try to append dynamic modal
      if (!document.body.contains(this._element)) {
        document.body.append(this._element);
      }
      this._element.style.display = 'block';
      this._element.removeAttribute('aria-hidden');
      this._element.setAttribute('aria-modal', true);
      this._element.setAttribute('role', 'dialog');
      this._element.scrollTop = 0;
      const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);
      if (modalBody) {
        modalBody.scrollTop = 0;
      }
      reflow(this._element);
      this._element.classList.add(CLASS_NAME_SHOW$4);
      const transitionComplete = () => {
        if (this._config.focus) {
          this._focustrap.activate();
        }
        this._isTransitioning = false;
        EventHandler.trigger(this._element, EVENT_SHOWN$4, {
          relatedTarget
        });
      };
      this._queueCallback(transitionComplete, this._dialog, this._isAnimated());
    }
    _addEventListeners() {
      EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, event => {
        if (event.key !== ESCAPE_KEY$1) {
          return;
        }
        if (this._config.keyboard) {
          this.hide();
          return;
        }
        this._triggerBackdropTransition();
      });
      EventHandler.on(window, EVENT_RESIZE$1, () => {
        if (this._isShown && !this._isTransitioning) {
          this._adjustDialog();
        }
      });
      EventHandler.on(this._element, EVENT_MOUSEDOWN_DISMISS, event => {
        // a bad trick to segregate clicks that may start inside dialog but end outside, and avoid listen to scrollbar clicks
        EventHandler.one(this._element, EVENT_CLICK_DISMISS, event2 => {
          if (this._element !== event.target || this._element !== event2.target) {
            return;
          }
          if (this._config.backdrop === 'static') {
            this._triggerBackdropTransition();
            return;
          }
          if (this._config.backdrop) {
            this.hide();
          }
        });
      });
    }
    _hideModal() {
      this._element.style.display = 'none';
      this._element.setAttribute('aria-hidden', true);
      this._element.removeAttribute('aria-modal');
      this._element.removeAttribute('role');
      this._isTransitioning = false;
      this._backdrop.hide(() => {
        document.body.classList.remove(CLASS_NAME_OPEN);
        this._resetAdjustments();
        this._scrollBar.reset();
        EventHandler.trigger(this._element, EVENT_HIDDEN$4);
      });
    }
    _isAnimated() {
      return this._element.classList.contains(CLASS_NAME_FADE$3);
    }
    _triggerBackdropTransition() {
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED$1);
      if (hideEvent.defaultPrevented) {
        return;
      }
      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
      const initialOverflowY = this._element.style.overflowY;
      // return if the following background transition hasn't yet completed
      if (initialOverflowY === 'hidden' || this._element.classList.contains(CLASS_NAME_STATIC)) {
        return;
      }
      if (!isModalOverflowing) {
        this._element.style.overflowY = 'hidden';
      }
      this._element.classList.add(CLASS_NAME_STATIC);
      this._queueCallback(() => {
        this._element.classList.remove(CLASS_NAME_STATIC);
        this._queueCallback(() => {
          this._element.style.overflowY = initialOverflowY;
        }, this._dialog);
      }, this._dialog);
      this._element.focus();
    }

    /**
     * The following methods are used to handle overflowing modals
     */

    _adjustDialog() {
      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
      const scrollbarWidth = this._scrollBar.getWidth();
      const isBodyOverflowing = scrollbarWidth > 0;
      if (isBodyOverflowing && !isModalOverflowing) {
        const property = isRTL() ? 'paddingLeft' : 'paddingRight';
        this._element.style[property] = `${scrollbarWidth}px`;
      }
      if (!isBodyOverflowing && isModalOverflowing) {
        const property = isRTL() ? 'paddingRight' : 'paddingLeft';
        this._element.style[property] = `${scrollbarWidth}px`;
      }
    }
    _resetAdjustments() {
      this._element.style.paddingLeft = '';
      this._element.style.paddingRight = '';
    }

    // Static
    static jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        const data = Modal.getOrCreateInstance(this, config);
        if (typeof config !== 'string') {
          return;
        }
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config](relatedTarget);
      });
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function (event) {
    const target = SelectorEngine.getElementFromSelector(this);
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }
    EventHandler.one(target, EVENT_SHOW$4, showEvent => {
      if (showEvent.defaultPrevented) {
        // only register focus restorer if modal will actually get shown
        return;
      }
      EventHandler.one(target, EVENT_HIDDEN$4, () => {
        if (isVisible(this)) {
          this.focus();
        }
      });
    });

    // avoid conflict when clicking modal toggler while another one is open
    const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR$1);
    if (alreadyOpen) {
      Modal.getInstance(alreadyOpen).hide();
    }
    const data = Modal.getOrCreateInstance(target);
    data.toggle(this);
  });
  enableDismissTrigger(Modal);

  /**
   * jQuery
   */

  defineJQueryPlugin(Modal);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap offcanvas.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$6 = 'offcanvas';
  const DATA_KEY$3 = 'bs.offcanvas';
  const EVENT_KEY$3 = `.${DATA_KEY$3}`;
  const DATA_API_KEY$1 = '.data-api';
  const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$3}${DATA_API_KEY$1}`;
  const ESCAPE_KEY = 'Escape';
  const CLASS_NAME_SHOW$3 = 'show';
  const CLASS_NAME_SHOWING$1 = 'showing';
  const CLASS_NAME_HIDING = 'hiding';
  const CLASS_NAME_BACKDROP = 'offcanvas-backdrop';
  const OPEN_SELECTOR = '.offcanvas.show';
  const EVENT_SHOW$3 = `show${EVENT_KEY$3}`;
  const EVENT_SHOWN$3 = `shown${EVENT_KEY$3}`;
  const EVENT_HIDE$3 = `hide${EVENT_KEY$3}`;
  const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$3}`;
  const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$3}`;
  const EVENT_RESIZE = `resize${EVENT_KEY$3}`;
  const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$3}${DATA_API_KEY$1}`;
  const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$3}`;
  const SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
  const Default$5 = {
    backdrop: true,
    keyboard: true,
    scroll: false
  };
  const DefaultType$5 = {
    backdrop: '(boolean|string)',
    keyboard: 'boolean',
    scroll: 'boolean'
  };

  /**
   * Class definition
   */

  class Offcanvas extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._isShown = false;
      this._backdrop = this._initializeBackDrop();
      this._focustrap = this._initializeFocusTrap();
      this._addEventListeners();
    }

    // Getters
    static get Default() {
      return Default$5;
    }
    static get DefaultType() {
      return DefaultType$5;
    }
    static get NAME() {
      return NAME$6;
    }

    // Public
    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    }
    show(relatedTarget) {
      if (this._isShown) {
        return;
      }
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
        relatedTarget
      });
      if (showEvent.defaultPrevented) {
        return;
      }
      this._isShown = true;
      this._backdrop.show();
      if (!this._config.scroll) {
        new ScrollBarHelper().hide();
      }
      this._element.setAttribute('aria-modal', true);
      this._element.setAttribute('role', 'dialog');
      this._element.classList.add(CLASS_NAME_SHOWING$1);
      const completeCallBack = () => {
        if (!this._config.scroll || this._config.backdrop) {
          this._focustrap.activate();
        }
        this._element.classList.add(CLASS_NAME_SHOW$3);
        this._element.classList.remove(CLASS_NAME_SHOWING$1);
        EventHandler.trigger(this._element, EVENT_SHOWN$3, {
          relatedTarget
        });
      };
      this._queueCallback(completeCallBack, this._element, true);
    }
    hide() {
      if (!this._isShown) {
        return;
      }
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);
      if (hideEvent.defaultPrevented) {
        return;
      }
      this._focustrap.deactivate();
      this._element.blur();
      this._isShown = false;
      this._element.classList.add(CLASS_NAME_HIDING);
      this._backdrop.hide();
      const completeCallback = () => {
        this._element.classList.remove(CLASS_NAME_SHOW$3, CLASS_NAME_HIDING);
        this._element.removeAttribute('aria-modal');
        this._element.removeAttribute('role');
        if (!this._config.scroll) {
          new ScrollBarHelper().reset();
        }
        EventHandler.trigger(this._element, EVENT_HIDDEN$3);
      };
      this._queueCallback(completeCallback, this._element, true);
    }
    dispose() {
      this._backdrop.dispose();
      this._focustrap.deactivate();
      super.dispose();
    }

    // Private
    _initializeBackDrop() {
      const clickCallback = () => {
        if (this._config.backdrop === 'static') {
          EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
          return;
        }
        this.hide();
      };

      // 'static' option will be translated to true, and booleans will keep their value
      const isVisible = Boolean(this._config.backdrop);
      return new Backdrop({
        className: CLASS_NAME_BACKDROP,
        isVisible,
        isAnimated: true,
        rootElement: this._element.parentNode,
        clickCallback: isVisible ? clickCallback : null
      });
    }
    _initializeFocusTrap() {
      return new FocusTrap({
        trapElement: this._element
      });
    }
    _addEventListeners() {
      EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
        if (event.key !== ESCAPE_KEY) {
          return;
        }
        if (this._config.keyboard) {
          this.hide();
          return;
        }
        EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
      });
    }

    // Static
    static jQueryInterface(config) {
      return this.each(function () {
        const data = Offcanvas.getOrCreateInstance(this, config);
        if (typeof config !== 'string') {
          return;
        }
        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config](this);
      });
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function (event) {
    const target = SelectorEngine.getElementFromSelector(this);
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }
    if (isDisabled(this)) {
      return;
    }
    EventHandler.one(target, EVENT_HIDDEN$3, () => {
      // focus on trigger when it is closed
      if (isVisible(this)) {
        this.focus();
      }
    });

    // avoid conflict when clicking a toggler of an offcanvas, while another is open
    const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);
    if (alreadyOpen && alreadyOpen !== target) {
      Offcanvas.getInstance(alreadyOpen).hide();
    }
    const data = Offcanvas.getOrCreateInstance(target);
    data.toggle(this);
  });
  EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
    for (const selector of SelectorEngine.find(OPEN_SELECTOR)) {
      Offcanvas.getOrCreateInstance(selector).show();
    }
  });
  EventHandler.on(window, EVENT_RESIZE, () => {
    for (const element of SelectorEngine.find('[aria-modal][class*=show][class*=offcanvas-]')) {
      if (getComputedStyle(element).position !== 'fixed') {
        Offcanvas.getOrCreateInstance(element).hide();
      }
    }
  });
  enableDismissTrigger(Offcanvas);

  /**
   * jQuery
   */

  defineJQueryPlugin(Offcanvas);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/sanitizer.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  // js-docs-start allow-list
  const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
  const DefaultAllowlist = {
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: []
  };
  // js-docs-end allow-list

  const uriAttributes = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);

  /**
   * A pattern that recognizes URLs that are safe wrt. XSS in URL navigation
   * contexts.
   *
   * Shout-out to Angular https://github.com/angular/angular/blob/15.2.8/packages/core/src/sanitization/url_sanitizer.ts#L38
   */
  // eslint-disable-next-line unicorn/better-regex
  const SAFE_URL_PATTERN = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:/?#]*(?:[/?#]|$))/i;
  const allowedAttribute = (attribute, allowedAttributeList) => {
    const attributeName = attribute.nodeName.toLowerCase();
    if (allowedAttributeList.includes(attributeName)) {
      if (uriAttributes.has(attributeName)) {
        return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue));
      }
      return true;
    }

    // Check if a regular expression validates the attribute.
    return allowedAttributeList.filter(attributeRegex => attributeRegex instanceof RegExp).some(regex => regex.test(attributeName));
  };
  function sanitizeHtml(unsafeHtml, allowList, sanitizeFunction) {
    if (!unsafeHtml.length) {
      return unsafeHtml;
    }
    if (sanitizeFunction && typeof sanitizeFunction === 'function') {
      return sanitizeFunction(unsafeHtml);
    }
    const domParser = new window.DOMParser();
    const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
    const elements = [].concat(...createdDocument.body.querySelectorAll('*'));
    for (const element of elements) {
      const elementName = element.nodeName.toLowerCase();
      if (!Object.keys(allowList).includes(elementName)) {
        element.remove();
        continue;
      }
      const attributeList = [].concat(...element.attributes);
      const allowedAttributes = [].concat(allowList['*'] || [], allowList[elementName] || []);
      for (const attribute of attributeList) {
        if (!allowedAttribute(attribute, allowedAttributes)) {
          element.removeAttribute(attribute.nodeName);
        }
      }
    }
    return createdDocument.body.innerHTML;
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/template-factory.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$5 = 'TemplateFactory';
  const Default$4 = {
    allowList: DefaultAllowlist,
    content: {},
    // { selector : text ,  selector2 : text2 , }
    extraClass: '',
    html: false,
    sanitize: true,
    sanitizeFn: null,
    template: '<div></div>'
  };
  const DefaultType$4 = {
    allowList: 'object',
    content: 'object',
    extraClass: '(string|function)',
    html: 'boolean',
    sanitize: 'boolean',
    sanitizeFn: '(null|function)',
    template: 'string'
  };
  const DefaultContentType = {
    entry: '(string|element|function|null)',
    selector: '(string|element)'
  };

  /**
   * Class definition
   */

  class TemplateFactory extends Config {
    constructor(config) {
      super();
      this._config = this._getConfig(config);
    }

    // Getters
    static get Default() {
      return Default$4;
    }
    static get DefaultType() {
      return DefaultType$4;
    }
    static get NAME() {
      return NAME$5;
    }

    // Public
    getContent() {
      return Object.values(this._config.content).map(config => this._resolvePossibleFunction(config)).filter(Boolean);
    }
    hasContent() {
      return this.getContent().length > 0;
    }
    changeContent(content) {
      this._checkContent(content);
      this._config.content = {
        ...this._config.content,
        ...content
      };
      return this;
    }
    toHtml() {
      const templateWrapper = document.createElement('div');
      templateWrapper.innerHTML = this._maybeSanitize(this._config.template);
      for (const [selector, text] of Object.entries(this._config.content)) {
        this._setContent(templateWrapper, text, selector);
      }
      const template = templateWrapper.children[0];
      const extraClass = this._resolvePossibleFunction(this._config.extraClass);
      if (extraClass) {
        template.classList.add(...extraClass.split(' '));
      }
      return template;
    }

    // Private
    _typeCheckConfig(config) {
      super._typeCheckConfig(config);
      this._checkContent(config.content);
    }
    _checkContent(arg) {
      for (const [selector, content] of Object.entries(arg)) {
        super._typeCheckConfig({
          selector,
          entry: content
        }, DefaultContentType);
      }
    }
    _setContent(template, content, selector) {
      const templateElement = SelectorEngine.findOne(selector, template);
      if (!templateElement) {
        return;
      }
      content = this._resolvePossibleFunction(content);
      if (!content) {
        templateElement.remove();
        return;
      }
      if (isElement$1(content)) {
        this._putElementInTemplate(getElement(content), templateElement);
        return;
      }
      if (this._config.html) {
        templateElement.innerHTML = this._maybeSanitize(content);
        return;
      }
      templateElement.textContent = content;
    }
    _maybeSanitize(arg) {
      return this._config.sanitize ? sanitizeHtml(arg, this._config.allowList, this._config.sanitizeFn) : arg;
    }
    _resolvePossibleFunction(arg) {
      return execute(arg, [this]);
    }
    _putElementInTemplate(element, templateElement) {
      if (this._config.html) {
        templateElement.innerHTML = '';
        templateElement.append(element);
        return;
      }
      templateElement.textContent = element.textContent;
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap tooltip.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$4 = 'tooltip';
  const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn']);
  const CLASS_NAME_FADE$2 = 'fade';
  const CLASS_NAME_MODAL = 'modal';
  const CLASS_NAME_SHOW$2 = 'show';
  const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
  const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
  const EVENT_MODAL_HIDE = 'hide.bs.modal';
  const TRIGGER_HOVER = 'hover';
  const TRIGGER_FOCUS = 'focus';
  const TRIGGER_CLICK = 'click';
  const TRIGGER_MANUAL = 'manual';
  const EVENT_HIDE$2 = 'hide';
  const EVENT_HIDDEN$2 = 'hidden';
  const EVENT_SHOW$2 = 'show';
  const EVENT_SHOWN$2 = 'shown';
  const EVENT_INSERTED = 'inserted';
  const EVENT_CLICK$1 = 'click';
  const EVENT_FOCUSIN$1 = 'focusin';
  const EVENT_FOCUSOUT$1 = 'focusout';
  const EVENT_MOUSEENTER = 'mouseenter';
  const EVENT_MOUSELEAVE = 'mouseleave';
  const AttachmentMap = {
    AUTO: 'auto',
    TOP: 'top',
    RIGHT: isRTL() ? 'left' : 'right',
    BOTTOM: 'bottom',
    LEFT: isRTL() ? 'right' : 'left'
  };
  const Default$3 = {
    allowList: DefaultAllowlist,
    animation: true,
    boundary: 'clippingParents',
    container: false,
    customClass: '',
    delay: 0,
    fallbackPlacements: ['top', 'right', 'bottom', 'left'],
    html: false,
    offset: [0, 6],
    placement: 'top',
    popperConfig: null,
    sanitize: true,
    sanitizeFn: null,
    selector: false,
    template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div>' + '</div>',
    title: '',
    trigger: 'hover focus'
  };
  const DefaultType$3 = {
    allowList: 'object',
    animation: 'boolean',
    boundary: '(string|element)',
    container: '(string|element|boolean)',
    customClass: '(string|function)',
    delay: '(number|object)',
    fallbackPlacements: 'array',
    html: 'boolean',
    offset: '(array|string|function)',
    placement: '(string|function)',
    popperConfig: '(null|object|function)',
    sanitize: 'boolean',
    sanitizeFn: '(null|function)',
    selector: '(string|boolean)',
    template: 'string',
    title: '(string|element|function)',
    trigger: 'string'
  };

  /**
   * Class definition
   */

  class Tooltip extends BaseComponent {
    constructor(element, config) {
      if (typeof Popper === 'undefined') {
        throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org)');
      }
      super(element, config);

      // Private
      this._isEnabled = true;
      this._timeout = 0;
      this._isHovered = null;
      this._activeTrigger = {};
      this._popper = null;
      this._templateFactory = null;
      this._newContent = null;

      // Protected
      this.tip = null;
      this._setListeners();
      if (!this._config.selector) {
        this._fixTitle();
      }
    }

    // Getters
    static get Default() {
      return Default$3;
    }
    static get DefaultType() {
      return DefaultType$3;
    }
    static get NAME() {
      return NAME$4;
    }

    // Public
    enable() {
      this._isEnabled = true;
    }
    disable() {
      this._isEnabled = false;
    }
    toggleEnabled() {
      this._isEnabled = !this._isEnabled;
    }
    toggle() {
      if (!this._isEnabled) {
        return;
      }
      this._activeTrigger.click = !this._activeTrigger.click;
      if (this._isShown()) {
        this._leave();
        return;
      }
      this._enter();
    }
    dispose() {
      clearTimeout(this._timeout);
      EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
      if (this._element.getAttribute('data-bs-original-title')) {
        this._element.setAttribute('title', this._element.getAttribute('data-bs-original-title'));
      }
      this._disposePopper();
      super.dispose();
    }
    show() {
      if (this._element.style.display === 'none') {
        throw new Error('Please use show on visible elements');
      }
      if (!(this._isWithContent() && this._isEnabled)) {
        return;
      }
      const showEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOW$2));
      const shadowRoot = findShadowRoot(this._element);
      const isInTheDom = (shadowRoot || this._element.ownerDocument.documentElement).contains(this._element);
      if (showEvent.defaultPrevented || !isInTheDom) {
        return;
      }

      // TODO: v6 remove this or make it optional
      this._disposePopper();
      const tip = this._getTipElement();
      this._element.setAttribute('aria-describedby', tip.getAttribute('id'));
      const {
        container
      } = this._config;
      if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
        container.append(tip);
        EventHandler.trigger(this._element, this.constructor.eventName(EVENT_INSERTED));
      }
      this._popper = this._createPopper(tip);
      tip.classList.add(CLASS_NAME_SHOW$2);

      // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
      if ('ontouchstart' in document.documentElement) {
        for (const element of [].concat(...document.body.children)) {
          EventHandler.on(element, 'mouseover', noop);
        }
      }
      const complete = () => {
        EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOWN$2));
        if (this._isHovered === false) {
          this._leave();
        }
        this._isHovered = false;
      };
      this._queueCallback(complete, this.tip, this._isAnimated());
    }
    hide() {
      if (!this._isShown()) {
        return;
      }
      const hideEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDE$2));
      if (hideEvent.defaultPrevented) {
        return;
      }
      const tip = this._getTipElement();
      tip.classList.remove(CLASS_NAME_SHOW$2);

      // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support
      if ('ontouchstart' in document.documentElement) {
        for (const element of [].concat(...document.body.children)) {
          EventHandler.off(element, 'mouseover', noop);
        }
      }
      this._activeTrigger[TRIGGER_CLICK] = false;
      this._activeTrigger[TRIGGER_FOCUS] = false;
      this._activeTrigger[TRIGGER_HOVER] = false;
      this._isHovered = null; // it is a trick to support manual triggering

      const complete = () => {
        if (this._isWithActiveTrigger()) {
          return;
        }
        if (!this._isHovered) {
          this._disposePopper();
        }
        this._element.removeAttribute('aria-describedby');
        EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDDEN$2));
      };
      this._queueCallback(complete, this.tip, this._isAnimated());
    }
    update() {
      if (this._popper) {
        this._popper.update();
      }
    }

    // Protected
    _isWithContent() {
      return Boolean(this._getTitle());
    }
    _getTipElement() {
      if (!this.tip) {
        this.tip = this._createTipElement(this._newContent || this._getContentForTemplate());
      }
      return this.tip;
    }
    _createTipElement(content) {
      const tip = this._getTemplateFactory(content).toHtml();

      // TODO: remove this check in v6
      if (!tip) {
        return null;
      }
      tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2);
      // TODO: v6 the following can be achieved with CSS only
      tip.classList.add(`bs-${this.constructor.NAME}-auto`);
      const tipId = getUID(this.constructor.NAME).toString();
      tip.setAttribute('id', tipId);
      if (this._isAnimated()) {
        tip.classList.add(CLASS_NAME_FADE$2);
      }
      return tip;
    }
    setContent(content) {
      this._newContent = content;
      if (this._isShown()) {
        this._disposePopper();
        this.show();
      }
    }
    _getTemplateFactory(content) {
      if (this._templateFactory) {
        this._templateFactory.changeContent(content);
      } else {
        this._templateFactory = new TemplateFactory({
          ...this._config,
          // the `content` var has to be after `this._config`
          // to override config.content in case of popover
          content,
          extraClass: this._resolvePossibleFunction(this._config.customClass)
        });
      }
      return this._templateFactory;
    }
    _getContentForTemplate() {
      return {
        [SELECTOR_TOOLTIP_INNER]: this._getTitle()
      };
    }
    _getTitle() {
      return this._resolvePossibleFunction(this._config.title) || this._element.getAttribute('data-bs-original-title');
    }

    // Private
    _initializeOnDelegatedTarget(event) {
      return this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
    }
    _isAnimated() {
      return this._config.animation || this.tip && this.tip.classList.contains(CLASS_NAME_FADE$2);
    }
    _isShown() {
      return this.tip && this.tip.classList.contains(CLASS_NAME_SHOW$2);
    }
    _createPopper(tip) {
      const placement = execute(this._config.placement, [this, tip, this._element]);
      const attachment = AttachmentMap[placement.toUpperCase()];
      return createPopper(this._element, tip, this._getPopperConfig(attachment));
    }
    _getOffset() {
      const {
        offset
      } = this._config;
      if (typeof offset === 'string') {
        return offset.split(',').map(value => Number.parseInt(value, 10));
      }
      if (typeof offset === 'function') {
        return popperData => offset(popperData, this._element);
      }
      return offset;
    }
    _resolvePossibleFunction(arg) {
      return execute(arg, [this._element]);
    }
    _getPopperConfig(attachment) {
      const defaultBsPopperConfig = {
        placement: attachment,
        modifiers: [{
          name: 'flip',
          options: {
            fallbackPlacements: this._config.fallbackPlacements
          }
        }, {
          name: 'offset',
          options: {
            offset: this._getOffset()
          }
        }, {
          name: 'preventOverflow',
          options: {
            boundary: this._config.boundary
          }
        }, {
          name: 'arrow',
          options: {
            element: `.${this.constructor.NAME}-arrow`
          }
        }, {
          name: 'preSetPlacement',
          enabled: true,
          phase: 'beforeMain',
          fn: data => {
            // Pre-set Popper's placement attribute in order to read the arrow sizes properly.
            // Otherwise, Popper mixes up the width and height dimensions since the initial arrow style is for top placement
            this._getTipElement().setAttribute('data-popper-placement', data.state.placement);
          }
        }]
      };
      return {
        ...defaultBsPopperConfig,
        ...execute(this._config.popperConfig, [defaultBsPopperConfig])
      };
    }
    _setListeners() {
      const triggers = this._config.trigger.split(' ');
      for (const trigger of triggers) {
        if (trigger === 'click') {
          EventHandler.on(this._element, this.constructor.eventName(EVENT_CLICK$1), this._config.selector, event => {
            const context = this._initializeOnDelegatedTarget(event);
            context.toggle();
          });
        } else if (trigger !== TRIGGER_MANUAL) {
          const eventIn = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSEENTER) : this.constructor.eventName(EVENT_FOCUSIN$1);
          const eventOut = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSELEAVE) : this.constructor.eventName(EVENT_FOCUSOUT$1);
          EventHandler.on(this._element, eventIn, this._config.selector, event => {
            const context = this._initializeOnDelegatedTarget(event);
            context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
            context._enter();
          });
          EventHandler.on(this._element, eventOut, this._config.selector, event => {
            const context = this._initializeOnDelegatedTarget(event);
            context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
            context._leave();
          });
        }
      }
      this._hideModalHandler = () => {
        if (this._element) {
          this.hide();
        }
      };
      EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
    }
    _fixTitle() {
      const title = this._element.getAttribute('title');
      if (!title) {
        return;
      }
      if (!this._element.getAttribute('aria-label') && !this._element.textContent.trim()) {
        this._element.setAttribute('aria-label', title);
      }
      this._element.setAttribute('data-bs-original-title', title); // DO NOT USE IT. Is only for backwards compatibility
      this._element.removeAttribute('title');
    }
    _enter() {
      if (this._isShown() || this._isHovered) {
        this._isHovered = true;
        return;
      }
      this._isHovered = true;
      this._setTimeout(() => {
        if (this._isHovered) {
          this.show();
        }
      }, this._config.delay.show);
    }
    _leave() {
      if (this._isWithActiveTrigger()) {
        return;
      }
      this._isHovered = false;
      this._setTimeout(() => {
        if (!this._isHovered) {
          this.hide();
        }
      }, this._config.delay.hide);
    }
    _setTimeout(handler, timeout) {
      clearTimeout(this._timeout);
      this._timeout = setTimeout(handler, timeout);
    }
    _isWithActiveTrigger() {
      return Object.values(this._activeTrigger).includes(true);
    }
    _getConfig(config) {
      const dataAttributes = Manipulator.getDataAttributes(this._element);
      for (const dataAttribute of Object.keys(dataAttributes)) {
        if (DISALLOWED_ATTRIBUTES.has(dataAttribute)) {
          delete dataAttributes[dataAttribute];
        }
      }
      config = {
        ...dataAttributes,
        ...(typeof config === 'object' && config ? config : {})
      };
      config = this._mergeConfigObj(config);
      config = this._configAfterMerge(config);
      this._typeCheckConfig(config);
      return config;
    }
    _configAfterMerge(config) {
      config.container = config.container === false ? document.body : getElement(config.container);
      if (typeof config.delay === 'number') {
        config.delay = {
          show: config.delay,
          hide: config.delay
        };
      }
      if (typeof config.title === 'number') {
        config.title = config.title.toString();
      }
      if (typeof config.content === 'number') {
        config.content = config.content.toString();
      }
      return config;
    }
    _getDelegateConfig() {
      const config = {};
      for (const [key, value] of Object.entries(this._config)) {
        if (this.constructor.Default[key] !== value) {
          config[key] = value;
        }
      }
      config.selector = false;
      config.trigger = 'manual';

      // In the future can be replaced with:
      // const keysWithDifferentValues = Object.entries(this._config).filter(entry => this.constructor.Default[entry[0]] !== this._config[entry[0]])
      // `Object.fromEntries(keysWithDifferentValues)`
      return config;
    }
    _disposePopper() {
      if (this._popper) {
        this._popper.destroy();
        this._popper = null;
      }
      if (this.tip) {
        this.tip.remove();
        this.tip = null;
      }
    }

    // Static
    static jQueryInterface(config) {
      return this.each(function () {
        const data = Tooltip.getOrCreateInstance(this, config);
        if (typeof config !== 'string') {
          return;
        }
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      });
    }
  }

  /**
   * jQuery
   */

  defineJQueryPlugin(Tooltip);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap popover.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$3 = 'popover';
  const SELECTOR_TITLE = '.popover-header';
  const SELECTOR_CONTENT = '.popover-body';
  const Default$2 = {
    ...Tooltip.Default,
    content: '',
    offset: [0, 8],
    placement: 'right',
    template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div>' + '</div>',
    trigger: 'click'
  };
  const DefaultType$2 = {
    ...Tooltip.DefaultType,
    content: '(null|string|element|function)'
  };

  /**
   * Class definition
   */

  class Popover extends Tooltip {
    // Getters
    static get Default() {
      return Default$2;
    }
    static get DefaultType() {
      return DefaultType$2;
    }
    static get NAME() {
      return NAME$3;
    }

    // Overrides
    _isWithContent() {
      return this._getTitle() || this._getContent();
    }

    // Private
    _getContentForTemplate() {
      return {
        [SELECTOR_TITLE]: this._getTitle(),
        [SELECTOR_CONTENT]: this._getContent()
      };
    }
    _getContent() {
      return this._resolvePossibleFunction(this._config.content);
    }

    // Static
    static jQueryInterface(config) {
      return this.each(function () {
        const data = Popover.getOrCreateInstance(this, config);
        if (typeof config !== 'string') {
          return;
        }
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      });
    }
  }

  /**
   * jQuery
   */

  defineJQueryPlugin(Popover);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap scrollspy.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$2 = 'scrollspy';
  const DATA_KEY$2 = 'bs.scrollspy';
  const EVENT_KEY$2 = `.${DATA_KEY$2}`;
  const DATA_API_KEY = '.data-api';
  const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
  const EVENT_CLICK = `click${EVENT_KEY$2}`;
  const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$2}${DATA_API_KEY}`;
  const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
  const CLASS_NAME_ACTIVE$1 = 'active';
  const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
  const SELECTOR_TARGET_LINKS = '[href]';
  const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
  const SELECTOR_NAV_LINKS = '.nav-link';
  const SELECTOR_NAV_ITEMS = '.nav-item';
  const SELECTOR_LIST_ITEMS = '.list-group-item';
  const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_NAV_ITEMS} > ${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`;
  const SELECTOR_DROPDOWN = '.dropdown';
  const SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';
  const Default$1 = {
    offset: null,
    // TODO: v6 @deprecated, keep it for backwards compatibility reasons
    rootMargin: '0px 0px -25%',
    smoothScroll: false,
    target: null,
    threshold: [0.1, 0.5, 1]
  };
  const DefaultType$1 = {
    offset: '(number|null)',
    // TODO v6 @deprecated, keep it for backwards compatibility reasons
    rootMargin: 'string',
    smoothScroll: 'boolean',
    target: 'element',
    threshold: 'array'
  };

  /**
   * Class definition
   */

  class ScrollSpy extends BaseComponent {
    constructor(element, config) {
      super(element, config);

      // this._element is the observablesContainer and config.target the menu links wrapper
      this._targetLinks = new Map();
      this._observableSections = new Map();
      this._rootElement = getComputedStyle(this._element).overflowY === 'visible' ? null : this._element;
      this._activeTarget = null;
      this._observer = null;
      this._previousScrollData = {
        visibleEntryTop: 0,
        parentScrollTop: 0
      };
      this.refresh(); // initialize
    }

    // Getters
    static get Default() {
      return Default$1;
    }
    static get DefaultType() {
      return DefaultType$1;
    }
    static get NAME() {
      return NAME$2;
    }

    // Public
    refresh() {
      this._initializeTargetsAndObservables();
      this._maybeEnableSmoothScroll();
      if (this._observer) {
        this._observer.disconnect();
      } else {
        this._observer = this._getNewObserver();
      }
      for (const section of this._observableSections.values()) {
        this._observer.observe(section);
      }
    }
    dispose() {
      this._observer.disconnect();
      super.dispose();
    }

    // Private
    _configAfterMerge(config) {
      // TODO: on v6 target should be given explicitly & remove the {target: 'ss-target'} case
      config.target = getElement(config.target) || document.body;

      // TODO: v6 Only for backwards compatibility reasons. Use rootMargin only
      config.rootMargin = config.offset ? `${config.offset}px 0px -30%` : config.rootMargin;
      if (typeof config.threshold === 'string') {
        config.threshold = config.threshold.split(',').map(value => Number.parseFloat(value));
      }
      return config;
    }
    _maybeEnableSmoothScroll() {
      if (!this._config.smoothScroll) {
        return;
      }

      // unregister any previous listeners
      EventHandler.off(this._config.target, EVENT_CLICK);
      EventHandler.on(this._config.target, EVENT_CLICK, SELECTOR_TARGET_LINKS, event => {
        const observableSection = this._observableSections.get(event.target.hash);
        if (observableSection) {
          event.preventDefault();
          const root = this._rootElement || window;
          const height = observableSection.offsetTop - this._element.offsetTop;
          if (root.scrollTo) {
            root.scrollTo({
              top: height,
              behavior: 'smooth'
            });
            return;
          }

          // Chrome 60 doesn't support `scrollTo`
          root.scrollTop = height;
        }
      });
    }
    _getNewObserver() {
      const options = {
        root: this._rootElement,
        threshold: this._config.threshold,
        rootMargin: this._config.rootMargin
      };
      return new IntersectionObserver(entries => this._observerCallback(entries), options);
    }

    // The logic of selection
    _observerCallback(entries) {
      const targetElement = entry => this._targetLinks.get(`#${entry.target.id}`);
      const activate = entry => {
        this._previousScrollData.visibleEntryTop = entry.target.offsetTop;
        this._process(targetElement(entry));
      };
      const parentScrollTop = (this._rootElement || document.documentElement).scrollTop;
      const userScrollsDown = parentScrollTop >= this._previousScrollData.parentScrollTop;
      this._previousScrollData.parentScrollTop = parentScrollTop;
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          this._activeTarget = null;
          this._clearActiveClass(targetElement(entry));
          continue;
        }
        const entryIsLowerThanPrevious = entry.target.offsetTop >= this._previousScrollData.visibleEntryTop;
        // if we are scrolling down, pick the bigger offsetTop
        if (userScrollsDown && entryIsLowerThanPrevious) {
          activate(entry);
          // if parent isn't scrolled, let's keep the first visible item, breaking the iteration
          if (!parentScrollTop) {
            return;
          }
          continue;
        }

        // if we are scrolling up, pick the smallest offsetTop
        if (!userScrollsDown && !entryIsLowerThanPrevious) {
          activate(entry);
        }
      }
    }
    _initializeTargetsAndObservables() {
      this._targetLinks = new Map();
      this._observableSections = new Map();
      const targetLinks = SelectorEngine.find(SELECTOR_TARGET_LINKS, this._config.target);
      for (const anchor of targetLinks) {
        // ensure that the anchor has an id and is not disabled
        if (!anchor.hash || isDisabled(anchor)) {
          continue;
        }
        const observableSection = SelectorEngine.findOne(decodeURI(anchor.hash), this._element);

        // ensure that the observableSection exists & is visible
        if (isVisible(observableSection)) {
          this._targetLinks.set(decodeURI(anchor.hash), anchor);
          this._observableSections.set(anchor.hash, observableSection);
        }
      }
    }
    _process(target) {
      if (this._activeTarget === target) {
        return;
      }
      this._clearActiveClass(this._config.target);
      this._activeTarget = target;
      target.classList.add(CLASS_NAME_ACTIVE$1);
      this._activateParents(target);
      EventHandler.trigger(this._element, EVENT_ACTIVATE, {
        relatedTarget: target
      });
    }
    _activateParents(target) {
      // Activate dropdown parents
      if (target.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
        SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, target.closest(SELECTOR_DROPDOWN)).classList.add(CLASS_NAME_ACTIVE$1);
        return;
      }
      for (const listGroup of SelectorEngine.parents(target, SELECTOR_NAV_LIST_GROUP)) {
        // Set triggered links parents as active
        // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
        for (const item of SelectorEngine.prev(listGroup, SELECTOR_LINK_ITEMS)) {
          item.classList.add(CLASS_NAME_ACTIVE$1);
        }
      }
    }
    _clearActiveClass(parent) {
      parent.classList.remove(CLASS_NAME_ACTIVE$1);
      const activeNodes = SelectorEngine.find(`${SELECTOR_TARGET_LINKS}.${CLASS_NAME_ACTIVE$1}`, parent);
      for (const node of activeNodes) {
        node.classList.remove(CLASS_NAME_ACTIVE$1);
      }
    }

    // Static
    static jQueryInterface(config) {
      return this.each(function () {
        const data = ScrollSpy.getOrCreateInstance(this, config);
        if (typeof config !== 'string') {
          return;
        }
        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      });
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => {
    for (const spy of SelectorEngine.find(SELECTOR_DATA_SPY)) {
      ScrollSpy.getOrCreateInstance(spy);
    }
  });

  /**
   * jQuery
   */

  defineJQueryPlugin(ScrollSpy);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap tab.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$1 = 'tab';
  const DATA_KEY$1 = 'bs.tab';
  const EVENT_KEY$1 = `.${DATA_KEY$1}`;
  const EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
  const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
  const EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
  const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
  const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}`;
  const EVENT_KEYDOWN = `keydown${EVENT_KEY$1}`;
  const EVENT_LOAD_DATA_API = `load${EVENT_KEY$1}`;
  const ARROW_LEFT_KEY = 'ArrowLeft';
  const ARROW_RIGHT_KEY = 'ArrowRight';
  const ARROW_UP_KEY = 'ArrowUp';
  const ARROW_DOWN_KEY = 'ArrowDown';
  const HOME_KEY = 'Home';
  const END_KEY = 'End';
  const CLASS_NAME_ACTIVE = 'active';
  const CLASS_NAME_FADE$1 = 'fade';
  const CLASS_NAME_SHOW$1 = 'show';
  const CLASS_DROPDOWN = 'dropdown';
  const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
  const SELECTOR_DROPDOWN_MENU = '.dropdown-menu';
  const NOT_SELECTOR_DROPDOWN_TOGGLE = `:not(${SELECTOR_DROPDOWN_TOGGLE})`;
  const SELECTOR_TAB_PANEL = '.list-group, .nav, [role="tablist"]';
  const SELECTOR_OUTER = '.nav-item, .list-group-item';
  const SELECTOR_INNER = `.nav-link${NOT_SELECTOR_DROPDOWN_TOGGLE}, .list-group-item${NOT_SELECTOR_DROPDOWN_TOGGLE}, [role="tab"]${NOT_SELECTOR_DROPDOWN_TOGGLE}`;
  const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]'; // TODO: could only be `tab` in v6
  const SELECTOR_INNER_ELEM = `${SELECTOR_INNER}, ${SELECTOR_DATA_TOGGLE}`;
  const SELECTOR_DATA_TOGGLE_ACTIVE = `.${CLASS_NAME_ACTIVE}[data-bs-toggle="tab"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="pill"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="list"]`;

  /**
   * Class definition
   */

  class Tab extends BaseComponent {
    constructor(element) {
      super(element);
      this._parent = this._element.closest(SELECTOR_TAB_PANEL);
      if (!this._parent) {
        return;
        // TODO: should throw exception in v6
        // throw new TypeError(`${element.outerHTML} has not a valid parent ${SELECTOR_INNER_ELEM}`)
      }

      // Set up initial aria attributes
      this._setInitialAttributes(this._parent, this._getChildren());
      EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
    }

    // Getters
    static get NAME() {
      return NAME$1;
    }

    // Public
    show() {
      // Shows this elem and deactivate the active sibling if exists
      const innerElem = this._element;
      if (this._elemIsActive(innerElem)) {
        return;
      }

      // Search for active tab on same parent to deactivate it
      const active = this._getActiveElem();
      const hideEvent = active ? EventHandler.trigger(active, EVENT_HIDE$1, {
        relatedTarget: innerElem
      }) : null;
      const showEvent = EventHandler.trigger(innerElem, EVENT_SHOW$1, {
        relatedTarget: active
      });
      if (showEvent.defaultPrevented || hideEvent && hideEvent.defaultPrevented) {
        return;
      }
      this._deactivate(active, innerElem);
      this._activate(innerElem, active);
    }

    // Private
    _activate(element, relatedElem) {
      if (!element) {
        return;
      }
      element.classList.add(CLASS_NAME_ACTIVE);
      this._activate(SelectorEngine.getElementFromSelector(element)); // Search and activate/show the proper section

      const complete = () => {
        if (element.getAttribute('role') !== 'tab') {
          element.classList.add(CLASS_NAME_SHOW$1);
          return;
        }
        element.removeAttribute('tabindex');
        element.setAttribute('aria-selected', true);
        this._toggleDropDown(element, true);
        EventHandler.trigger(element, EVENT_SHOWN$1, {
          relatedTarget: relatedElem
        });
      };
      this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
    }
    _deactivate(element, relatedElem) {
      if (!element) {
        return;
      }
      element.classList.remove(CLASS_NAME_ACTIVE);
      element.blur();
      this._deactivate(SelectorEngine.getElementFromSelector(element)); // Search and deactivate the shown section too

      const complete = () => {
        if (element.getAttribute('role') !== 'tab') {
          element.classList.remove(CLASS_NAME_SHOW$1);
          return;
        }
        element.setAttribute('aria-selected', false);
        element.setAttribute('tabindex', '-1');
        this._toggleDropDown(element, false);
        EventHandler.trigger(element, EVENT_HIDDEN$1, {
          relatedTarget: relatedElem
        });
      };
      this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
    }
    _keydown(event) {
      if (![ARROW_LEFT_KEY, ARROW_RIGHT_KEY, ARROW_UP_KEY, ARROW_DOWN_KEY, HOME_KEY, END_KEY].includes(event.key)) {
        return;
      }
      event.stopPropagation(); // stopPropagation/preventDefault both added to support up/down keys without scrolling the page
      event.preventDefault();
      const children = this._getChildren().filter(element => !isDisabled(element));
      let nextActiveElement;
      if ([HOME_KEY, END_KEY].includes(event.key)) {
        nextActiveElement = children[event.key === HOME_KEY ? 0 : children.length - 1];
      } else {
        const isNext = [ARROW_RIGHT_KEY, ARROW_DOWN_KEY].includes(event.key);
        nextActiveElement = getNextActiveElement(children, event.target, isNext, true);
      }
      if (nextActiveElement) {
        nextActiveElement.focus({
          preventScroll: true
        });
        Tab.getOrCreateInstance(nextActiveElement).show();
      }
    }
    _getChildren() {
      // collection of inner elements
      return SelectorEngine.find(SELECTOR_INNER_ELEM, this._parent);
    }
    _getActiveElem() {
      return this._getChildren().find(child => this._elemIsActive(child)) || null;
    }
    _setInitialAttributes(parent, children) {
      this._setAttributeIfNotExists(parent, 'role', 'tablist');
      for (const child of children) {
        this._setInitialAttributesOnChild(child);
      }
    }
    _setInitialAttributesOnChild(child) {
      child = this._getInnerElement(child);
      const isActive = this._elemIsActive(child);
      const outerElem = this._getOuterElement(child);
      child.setAttribute('aria-selected', isActive);
      if (outerElem !== child) {
        this._setAttributeIfNotExists(outerElem, 'role', 'presentation');
      }
      if (!isActive) {
        child.setAttribute('tabindex', '-1');
      }
      this._setAttributeIfNotExists(child, 'role', 'tab');

      // set attributes to the related panel too
      this._setInitialAttributesOnTargetPanel(child);
    }
    _setInitialAttributesOnTargetPanel(child) {
      const target = SelectorEngine.getElementFromSelector(child);
      if (!target) {
        return;
      }
      this._setAttributeIfNotExists(target, 'role', 'tabpanel');
      if (child.id) {
        this._setAttributeIfNotExists(target, 'aria-labelledby', `${child.id}`);
      }
    }
    _toggleDropDown(element, open) {
      const outerElem = this._getOuterElement(element);
      if (!outerElem.classList.contains(CLASS_DROPDOWN)) {
        return;
      }
      const toggle = (selector, className) => {
        const element = SelectorEngine.findOne(selector, outerElem);
        if (element) {
          element.classList.toggle(className, open);
        }
      };
      toggle(SELECTOR_DROPDOWN_TOGGLE, CLASS_NAME_ACTIVE);
      toggle(SELECTOR_DROPDOWN_MENU, CLASS_NAME_SHOW$1);
      outerElem.setAttribute('aria-expanded', open);
    }
    _setAttributeIfNotExists(element, attribute, value) {
      if (!element.hasAttribute(attribute)) {
        element.setAttribute(attribute, value);
      }
    }
    _elemIsActive(elem) {
      return elem.classList.contains(CLASS_NAME_ACTIVE);
    }

    // Try to get the inner element (usually the .nav-link)
    _getInnerElement(elem) {
      return elem.matches(SELECTOR_INNER_ELEM) ? elem : SelectorEngine.findOne(SELECTOR_INNER_ELEM, elem);
    }

    // Try to get the outer element (usually the .nav-item)
    _getOuterElement(elem) {
      return elem.closest(SELECTOR_OUTER) || elem;
    }

    // Static
    static jQueryInterface(config) {
      return this.each(function () {
        const data = Tab.getOrCreateInstance(this);
        if (typeof config !== 'string') {
          return;
        }
        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      });
    }
  }

  /**
   * Data API implementation
   */

  EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }
    if (isDisabled(this)) {
      return;
    }
    Tab.getOrCreateInstance(this).show();
  });

  /**
   * Initialize on focus
   */
  EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
    for (const element of SelectorEngine.find(SELECTOR_DATA_TOGGLE_ACTIVE)) {
      Tab.getOrCreateInstance(element);
    }
  });
  /**
   * jQuery
   */

  defineJQueryPlugin(Tab);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap toast.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME = 'toast';
  const DATA_KEY = 'bs.toast';
  const EVENT_KEY = `.${DATA_KEY}`;
  const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
  const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
  const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
  const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
  const EVENT_HIDE = `hide${EVENT_KEY}`;
  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
  const EVENT_SHOW = `show${EVENT_KEY}`;
  const EVENT_SHOWN = `shown${EVENT_KEY}`;
  const CLASS_NAME_FADE = 'fade';
  const CLASS_NAME_HIDE = 'hide'; // @deprecated - kept here only for backwards compatibility
  const CLASS_NAME_SHOW = 'show';
  const CLASS_NAME_SHOWING = 'showing';
  const DefaultType = {
    animation: 'boolean',
    autohide: 'boolean',
    delay: 'number'
  };
  const Default = {
    animation: true,
    autohide: true,
    delay: 5000
  };

  /**
   * Class definition
   */

  class Toast extends BaseComponent {
    constructor(element, config) {
      super(element, config);
      this._timeout = null;
      this._hasMouseInteraction = false;
      this._hasKeyboardInteraction = false;
      this._setListeners();
    }

    // Getters
    static get Default() {
      return Default;
    }
    static get DefaultType() {
      return DefaultType;
    }
    static get NAME() {
      return NAME;
    }

    // Public
    show() {
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);
      if (showEvent.defaultPrevented) {
        return;
      }
      this._clearTimeout();
      if (this._config.animation) {
        this._element.classList.add(CLASS_NAME_FADE);
      }
      const complete = () => {
        this._element.classList.remove(CLASS_NAME_SHOWING);
        EventHandler.trigger(this._element, EVENT_SHOWN);
        this._maybeScheduleHide();
      };
      this._element.classList.remove(CLASS_NAME_HIDE); // @deprecated
      reflow(this._element);
      this._element.classList.add(CLASS_NAME_SHOW, CLASS_NAME_SHOWING);
      this._queueCallback(complete, this._element, this._config.animation);
    }
    hide() {
      if (!this.isShown()) {
        return;
      }
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);
      if (hideEvent.defaultPrevented) {
        return;
      }
      const complete = () => {
        this._element.classList.add(CLASS_NAME_HIDE); // @deprecated
        this._element.classList.remove(CLASS_NAME_SHOWING, CLASS_NAME_SHOW);
        EventHandler.trigger(this._element, EVENT_HIDDEN);
      };
      this._element.classList.add(CLASS_NAME_SHOWING);
      this._queueCallback(complete, this._element, this._config.animation);
    }
    dispose() {
      this._clearTimeout();
      if (this.isShown()) {
        this._element.classList.remove(CLASS_NAME_SHOW);
      }
      super.dispose();
    }
    isShown() {
      return this._element.classList.contains(CLASS_NAME_SHOW);
    }

    // Private

    _maybeScheduleHide() {
      if (!this._config.autohide) {
        return;
      }
      if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
        return;
      }
      this._timeout = setTimeout(() => {
        this.hide();
      }, this._config.delay);
    }
    _onInteraction(event, isInteracting) {
      switch (event.type) {
        case 'mouseover':
        case 'mouseout':
          {
            this._hasMouseInteraction = isInteracting;
            break;
          }
        case 'focusin':
        case 'focusout':
          {
            this._hasKeyboardInteraction = isInteracting;
            break;
          }
      }
      if (isInteracting) {
        this._clearTimeout();
        return;
      }
      const nextElement = event.relatedTarget;
      if (this._element === nextElement || this._element.contains(nextElement)) {
        return;
      }
      this._maybeScheduleHide();
    }
    _setListeners() {
      EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true));
      EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false));
      EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true));
      EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false));
    }
    _clearTimeout() {
      clearTimeout(this._timeout);
      this._timeout = null;
    }

    // Static
    static jQueryInterface(config) {
      return this.each(function () {
        const data = Toast.getOrCreateInstance(this, config);
        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config](this);
        }
      });
    }
  }

  /**
   * Data API implementation
   */

  enableDismissTrigger(Toast);

  /**
   * jQuery
   */

  defineJQueryPlugin(Toast);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap index.umd.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  const index_umd = {
    Alert,
    Button,
    Carousel,
    Collapse,
    Dropdown,
    Modal,
    Offcanvas,
    Popover,
    ScrollSpy,
    Tab,
    Toast,
    Tooltip
  };

  return index_umd;

}));
//# sourceMappingURL=bootstrap.bundle.js.map

const upworkConfig = {
	'env': 'prod',
	'url': 'https://www.upwork.com',
	'api': {
		'baseURL': 'https://www.upwork.com/api',
		'graphQL': 'https://api.upwork.com/graphql',
		'oca': 'https://www.upwork.com/oca/zendesk/v1'
	},
	'oauth': {
		'clientID': '1d0e4295ebeefec2441f1f85a109d54d',
		'clientSecret': '66ac853a22b1f42e',
		'redirectURL': 'https://support.upwork.com/hc/en-us'
	},
	'cookies': {
		'prefix': 'upwork-help-',
		'current_organization_uid': 'current_organization_uid'
	}
}

const communityURL = 'https://community.upwork.com'

const zdBrands = {
	'main': {
		'url': 'https://support.upwork.com',
		'api': 'https://upwork.zendesk.com/api/v2',
		'hc': {
			'url': 'https://support.upwork.com/hc/en-us',
			'api': 'https://upwork.zendesk.com/api/v2/help_center/en-us'
		},
		'chatbot': {
			'script': 'https://assets.static-upwork.com/helpcenter/agatha/integration.js',
			'key': 'd9c57239-cc77-4faa-bf00-29b0b72fd8cd'
		}
	}
}

const supportTreatments = {
    'community': {
        'name': 'community',
        'title': 'Community',
        'icon': 'community',
        'description': 'Connect, share and learn with Upwork Community'
    },
    'academy': {
        'name': 'academy',
        'title': 'Academy',
        'icon': 'education',
        'description': 'Courses and tools for helping you succeed on Upwork'
    },
    'email': {
        'name': 'email',
        'title': 'Create a ticket',
        'icon': 'mail',
        'description': 'Drop us a line. We\'re here to help!'
	},
    'enterprise-email': {
        'name': 'enterprise-email',
        'title': 'Email',
        'icon': 'mail',
        'description': 'Email us anytime'
	},
	'visitor-chat': {
		'name': 'visitor-chat',
		'title': 'Chat with Upwork',
		'icon': 'message-question',
		'description': 'Get immediate support by starting a chat'
	},
    'chat': {
        'name': 'chat',
        'title': 'Chat with Upwork',
        'icon': 'message-chat',
        'description': 'Get immediate support by starting a chat'
    },
    'phone': {
        'name': 'phone',
        'title': 'Call us',
        'icon': 'call',
        'description': 'Reach out to us via phone for personalized support'
    },
    'enterprise-phone': {
        'name': 'enterprise-phone',
        'title': 'Call us',
        'icon': 'call',
        'description': 'Your Enterprise Support team will help you!'
    }
}

const defaultForm = {
	'form': 3964,
	'fields': {
		'reason': 20007516403091
	},
	'dropdowns': [
		{
			'key': 20007516403091,
			'options': [
				{
					'key': 'tag_cat_billing',
					'value': 'Billing'
				},
				{
					'key': 'tag_cat_connects',
					'value': 'Connects'
				},
				{
					'key': 'tag_cat_disputes',
					'value': 'Disputes'
				},
				{
					'key': 'tag_cat_earnings',
					'value': 'Earnings'
				},
				{
					'key': 'tag_cat_fees',
					'value': 'Fees'
				},
				{
					'key': 'tag_cat_get_paid',
					'value': 'Get Paid'
				},
				{
					'key': 'tag_cat_identity_verification',
					'value': 'Identity Verification'
				},
				{
					'key': 'tag_cat_job_posts',
					'value': 'Job Posts'
				},
				{
					'key': 'tag_cat_login_issues',
					'value': 'Login issues'
				},
				{
					'key': 'tag_cat_members_permissions',
					'value': 'Members & Permissions'
				},
				{
					'key': 'tag_cat_memberships',
					'value': 'Memberships'
				},
				{
					'key': 'tag_cat_notifications',
					'value': 'Notifications'
				},
				{
					'key': 'tag_cat_onboarding',
					'value': 'Onboarding'
				},
				{
					'key': 'tag_cat_payments',
					'value': 'Payments'
				},
				{
					'key': 'tag_cat_profile',
					'value': 'Profile'
				},
				{
					'key': 'tag_cat_project_catalog',
					'value': 'Project Catalog'
				},
				{
					'key': 'tag_cat_request_for_api',
					'value': 'Request For API'
				},
				{
					'key': 'tag_cat_search_discovery',
					'value': 'Search & Discovery'
				},
				{
					'key': 'tag_cat_system_issues',
					'value': 'System Issues'
				},
				{
					'key': 'tag_cat_teams',
					'value': 'Teams'
				},
				{
					'key': 'tag_cat_transaction_history',
					'value': 'Transaction History'
				},
				{
					'key': 'tag_cat_transaction_reporting',
					'value': 'Transaction Reporting'
				},
				{
					'key': 'tag_cat_work_quality',
					'value': 'Work Quality'
				},
				{
					'key': 'tag_cat_workroom',
					'value': 'Workroom'
				},
				{
					'key': 'tag_cat_other',
					'value': 'Other'
				}
			]
		}
	]
}

const anyHireForm = {
	'form': 4417268207763,
	'fields': {
		'email': 4417282635667,
		'freelancers': 4417282684307,
		'category': 4418945323923
	},
	'dropdowns': [
		{
			'key': 4418945323923,
			'options': [
				{
					'key': 'anyhire_accounting_consulting_accounting',
					'value': 'Accounting & Consulting - Accounting'
				},
				{
					'key': 'anyhire_accounting_consulting_bookkeeping',
					'value': 'Accounting & Consulting - Bookkeeping'
				},
				{
					'key': 'anyhire_accounting_consulting_business_analysis',
					'value': 'Accounting & Consulting - Business Analysis'
				},
				{
					'key': 'anyhire_accounting_consulting_financial_analysis_modeling',
					'value': 'Accounting & Consulting - Financial Analysis & Modeling'
				},
				{
					'key': 'anyhire_accounting_consulting_financial_management_cfo',
					'value': 'Accounting & Consulting - Financial Management/CFO'
				},
				{
					'key': 'anyhire_accounting_consulting_hr_administration',
					'value': 'Accounting & Consulting - HR Administration'
				},
				{
					'key': 'anyhire_accounting_consulting_instructional_design',
					'value': 'Accounting & Consulting - Instructional Design'
				},
				{
					'key': 'anyhire_accounting_consulting_lifestyle_coaching',
					'value': 'Accounting & Consulting - Lifestyle Coaching'
				},
				{
					'key': 'anyhire_accounting_consulting_management_consulting',
					'value': 'Accounting & Consulting - Management Consulting'
				},
				{
					'key': 'anyhire_accounting_consulting_recruiting',
					'value': 'Accounting & Consulting - Recruiting'
				},
				{
					'key': 'anyhire_accounting_consulting_tax_preparation',
					'value': 'Accounting & Consulting - Tax Preparation'
				},
				{
					'key': 'anyhire_accounting_consulting_training_development',
					'value': 'Accounting & Consulting - Training & Development'
				},
				{
					'key': 'anyhire_admin_support_data_entry',
					'value': 'Admin Support - Data Entry'
				},
				{
					'key': 'anyhire_admin_support_online_research',
					'value': 'Admin Support - Online Research'
				},
				{
					'key': 'anyhire_admin_support_order_processing',
					'value': 'Admin Support - Order Processing'
				},
				{
					'key': 'anyhire_admin_support_project_management',
					'value': 'Admin Support - Project Management'
				},
				{
					'key': 'anyhire_admin_support_transcription',
					'value': 'Admin Support - Transcription'
				},
				{
					'key': 'anyhire_admin_support_virtual_administrative_assistance',
					'value': 'Admin Support - Virtual/Administrative Assistance'
				},
				{
					'key': 'anyhire_customer_service_customer_service',
					'value': 'Customer Service - Customer Service'
				},
				{
					'key': 'anyhire_customer_service_tech_support',
					'value': 'Customer Service - Tech Support'
				},
				{
					'key': 'anyhire_data_science_analytics_a_b_testing',
					'value': 'Data Science & Analytics - A/B Testing'
				},
				{
					'key': 'anyhire_data_science_analytics_data_analytics',
					'value': 'Data Science & Analytics - Data Analytics'
				},
				{
					'key': 'anyhire_data_science_analytics_data_engineering',
					'value': 'Data Science & Analytics - Data Engineering'
				},
				{
					'key': 'anyhire_data_science_analytics_data_extraction',
					'value': 'Data Science & Analytics - Data Extraction'
				},
				{
					'key': 'anyhire_data_science_analytics_data_mining',
					'value': 'Data Science & Analytics - Data Mining'
				},
				{
					'key': 'anyhire_data_science_analytics_data_processing',
					'value': 'Data Science & Analytics - Data Processing'
				},
				{
					'key': 'anyhire_data_science_analytics_data_visualization',
					'value': 'Data Science & Analytics - Data Visualization'
				},
				{
					'key': 'anyhire_data_science_analytics_deep_learning',
					'value': 'Data Science & Analytics - Deep Learning'
				},
				{
					'key': 'anyhire_data_science_analytics_experimentation_testing',
					'value': 'Data Science & Analytics - Experimentation & Testing'
				},
				{
					'key': 'anyhire_data_science_analytics_knowledge_representation',
					'value': 'Data Science & Analytics - Knowledge Representation'
				},
				{
					'key': 'anyhire_data_science_analytics_machine_learning',
					'value': 'Data Science & Analytics - Machine Learning'
				},
				{
					'key': 'anyhire_design_creative_2d_animation',
					'value': 'Design & Creative - 2D Animation'
				},
				{
					'key': 'anyhire_design_creative_3d_animation',
					'value': 'Design & Creative - 3D Animation'
				},
				{
					'key': 'anyhire_design_creative_ar_vr_design',
					'value': 'Design & Creative - AR/VR Design'
				},
				{
					'key': 'anyhire_design_creative_acting',
					'value': 'Design & Creative - Acting'
				},
				{
					'key': 'anyhire_design_creative_art_direction',
					'value': 'Design & Creative - Art Direction'
				},
				{
					'key': 'anyhire_design_creative_audio_editing',
					'value': 'Design & Creative - Audio Editing'
				},
				{
					'key': 'anyhire_design_creative_audio_production',
					'value': 'Design & Creative - Audio Production'
				},
				{
					'key': 'anyhire_design_creative_brand_identity_design',
					'value': 'Design & Creative - Brand Identity Design'
				},
				{
					'key': 'anyhire_design_creative_caricatures_portraits',
					'value': 'Design & Creative - Caricatures & Portraits'
				},
				{
					'key': 'anyhire_design_creative_cartoons_comics',
					'value': 'Design & Creative - Cartoons & Comics'
				},
				{
					'key': 'anyhire_design_creative_creative_direction',
					'value': 'Design & Creative - Creative Direction'
				},
				{
					'key': 'anyhire_design_creative_editorial_design',
					'value': 'Design & Creative - Editorial Design'
				},
				{
					'key': 'anyhire_design_creative_fashion_design',
					'value': 'Design & Creative - Fashion Design'
				},
				{
					'key': 'anyhire_design_creative_fine_art',
					'value': 'Design & Creative - Fine Art'
				},
				{
					'key': 'anyhire_design_creative_game_art',
					'value': 'Design & Creative - Game Art'
				},
				{
					'key': 'anyhire_design_creative_graphic_design',
					'value': 'Design & Creative - Graphic Design'
				},
				{
					'key': 'anyhire_design_creative_illustration',
					'value': 'Design & Creative - Illustration'
				},
				{
					'key': 'anyhire_design_creative_image_editing',
					'value': 'Design & Creative - Image Editing'
				},
				{
					'key': 'anyhire_design_creative_jewelry_design',
					'value': 'Design & Creative - Jewelry Design'
				},
				{
					'key': 'anyhire_design_creative_local_photography',
					'value': 'Design & Creative - Local Photography'
				},
				{
					'key': 'anyhire_design_creative_logo_design',
					'value': 'Design & Creative - Logo Design'
				},
				{
					'key': 'anyhire_design_creative_motion_graphics',
					'value': 'Design & Creative - Motion Graphics'
				},
				{
					'key': 'anyhire_design_creative_music_composition',
					'value': 'Design & Creative - Music Composition'
				},
				{
					'key': 'anyhire_design_creative_music_production',
					'value': 'Design & Creative - Music Production'
				},
				{
					'key': 'anyhire_design_creative_musician',
					'value': 'Design & Creative - Musician'
				},
				{
					'key': 'anyhire_design_creative_packaging_design',
					'value': 'Design & Creative - Packaging Design'
				},
				{
					'key': 'anyhire_design_creative_pattern_design',
					'value': 'Design & Creative - Pattern Design'
				},
				{
					'key': 'anyhire_design_creative_presentation_design',
					'value': 'Design & Creative - Presentation Design'
				},
				{
					'key': 'anyhire_design_creative_product_industrial_design',
					'value': 'Design & Creative - Product & Industrial Design'
				},
				{
					'key': 'anyhire_design_creative_product_photography',
					'value': 'Design & Creative - Product Photography'
				},
				{
					'key': 'anyhire_design_creative_singing',
					'value': 'Design & Creative - Singing'
				},
				{
					'key': 'anyhire_design_creative_video_editing',
					'value': 'Design & Creative - Video Editing'
				},
				{
					'key': 'anyhire_design_creative_video_production',
					'value': 'Design & Creative - Video Production'
				},
				{
					'key': 'anyhire_design_creative_videography',
					'value': 'Design & Creative - Videography'
				},
				{
					'key': 'anyhire_design_creative_visual_effects',
					'value': 'Design & Creative - Visual Effects'
				},
				{
					'key': 'anyhire_design_creative_voice_talent',
					'value': 'Design & Creative - Voice Talent'
				},
				{
					'key': 'anyhire_engineering_architecture_3d_modeling_rendering',
					'value': 'Engineering & Architecture - 3D Modeling & Rendering'
				},
				{
					'key': 'anyhire_engineering_architecture_architecture',
					'value': 'Engineering & Architecture - Architecture'
				},
				{
					'key': 'anyhire_engineering_architecture_biology',
					'value': 'Engineering & Architecture - Biology'
				},
				{
					'key': 'anyhire_engineering_architecture_building_information_modeling',
					'value': 'Engineering & Architecture - Building Information Modeling'
				},
				{
					'key': 'anyhire_engineering_architecture_cad',
					'value': 'Engineering & Architecture - CAD'
				},
				{
					'key': 'anyhire_engineering_architecture_chemical_process_engineering',
					'value': 'Engineering & Architecture - Chemical & Process Engineering'
				},
				{
					'key': 'anyhire_engineering_architecture_chemistry',
					'value': 'Engineering & Architecture - Chemistry'
				},
				{
					'key': 'anyhire_engineering_architecture_civil_engineering',
					'value': 'Engineering & Architecture - Civil Engineering'
				},
				{
					'key': 'anyhire_engineering_architecture_electrical_engineering',
					'value': 'Engineering & Architecture - Electrical Engineering'
				},
				{
					'key': 'anyhire_engineering_architecture_electronic_engineering',
					'value': 'Engineering & Architecture - Electronic Engineering'
				},
				{
					'key': 'anyhire_engineering_architecture_energy_engineering',
					'value': 'Engineering & Architecture - Energy Engineering'
				},
				{
					'key': 'anyhire_engineering_architecture_interior_design',
					'value': 'Engineering & Architecture - Interior Design'
				},
				{
					'key': 'anyhire_engineering_architecture_landscape_architecture',
					'value': 'Engineering & Architecture - Landscape Architecture'
				},
				{
					'key': 'anyhire_engineering_architecture_logistics_supply_chain_management',
					'value': 'Engineering & Architecture - Logistics & Supply Chain Management'
				},
				{
					'key': 'anyhire_engineering_architecture_mathematics',
					'value': 'Engineering & Architecture - Mathematics'
				},
				{
					'key': 'anyhire_engineering_architecture_mechanical_engineering',
					'value': 'Engineering & Architecture - Mechanical Engineering'
				},
				{
					'key': 'anyhire_engineering_architecture_physics',
					'value': 'Engineering & Architecture - Physics'
				},
				{
					'key': 'anyhire_engineering_architecture_stem_tutoring',
					'value': 'Engineering & Architecture - STEM Tutoring'
				},
				{
					'key': 'anyhire_engineering_architecture_sourcing_procurement',
					'value': 'Engineering & Architecture - Sourcing & Procurement'
				},
				{
					'key': 'anyhire_engineering_architecture_structural_engineering',
					'value': 'Engineering & Architecture - Structural Engineering'
				},
				{
					'key': 'anyhire_engineering_architecture_trade_show_design',
					'value': 'Engineering & Architecture - Trade Show Design'
				},
				{
					'key': 'anyhire_it_networking_business_applications_development',
					'value': 'IT & Networking - Business Applications Development'
				},
				{
					'key': 'anyhire_it_networking_cloud_engineering',
					'value': 'IT & Networking - Cloud Engineering'
				},
				{
					'key': 'anyhire_it_networking_database_administration',
					'value': 'IT & Networking - Database Administration'
				},
				{
					'key': 'anyhire_it_networking_devops_engineering',
					'value': 'IT & Networking - Devops Engineering'
				},
				{
					'key': 'anyhire_it_networking_it_compliance',
					'value': 'IT & Networking - IT Compliance'
				},
				{
					'key': 'anyhire_it_networking_it_support',
					'value': 'IT & Networking - IT Support'
				},
				{
					'key': 'anyhire_it_networking_information_security',
					'value': 'IT & Networking - Information Security'
				},
				{
					'key': 'anyhire_it_networking_network_administration',
					'value': 'IT & Networking - Network Administration'
				},
				{
					'key': 'anyhire_it_networking_network_security',
					'value': 'IT & Networking - Network Security'
				},
				{
					'key': 'anyhire_it_networking_solutions_architecture',
					'value': 'IT & Networking - Solutions Architecture'
				},
				{
					'key': 'anyhire_it_networking_systems_administration',
					'value': 'IT & Networking - Systems Administration'
				},
				{
					'key': 'anyhire_it_networking_systems_engineering',
					'value': 'IT & Networking - Systems Engineering'
				},
				{
					'key': 'anyhire_legal_business_corporate_law',
					'value': 'Legal - Business & Corporate Law'
				},
				{
					'key': 'anyhire_legal_general_counsel',
					'value': 'Legal - General Counsel'
				},
				{
					'key': 'anyhire_legal_immigration_law',
					'value': 'Legal - Immigration Law'
				},
				{
					'key': 'anyhire_legal_intellectual_property_law',
					'value': 'Legal - Intellectual Property Law'
				},
				{
					'key': 'anyhire_legal_international_law',
					'value': 'Legal - International Law'
				},
				{
					'key': 'anyhire_legal_labor_employment_law',
					'value': 'Legal - Labor & Employment Law'
				},
				{
					'key': 'anyhire_legal_paralegal',
					'value': 'Legal - Paralegal'
				},
				{
					'key': 'anyhire_legal_regulatory_law',
					'value': 'Legal - Regulatory Law'
				},
				{
					'key': 'anyhire_legal_securities_finance_law',
					'value': 'Legal - Securities & Finance Law'
				},
				{
					'key': 'anyhire_legal_tax_law',
					'value': 'Legal - Tax Law'
				},
				{
					'key': 'anyhire_sales_marketing_brand_strategy',
					'value': 'Sales & Marketing - Brand Strategy'
				},
				{
					'key': 'anyhire_sales_marketing_campaign_management',
					'value': 'Sales & Marketing - Campaign Management'
				},
				{
					'key': 'anyhire_sales_marketing_community_management',
					'value': 'Sales & Marketing - Community Management'
				},
				{
					'key': 'anyhire_sales_marketing_content_strategy',
					'value': 'Sales & Marketing - Content Strategy'
				},
				{
					'key': 'anyhire_sales_marketing_digital_marketing',
					'value': 'Sales & Marketing - Digital Marketing'
				},
				{
					'key': 'anyhire_sales_marketing_email_marketing',
					'value': 'Sales & Marketing - Email Marketing'
				},
				{
					'key': 'anyhire_sales_marketing_lead_generation',
					'value': 'Sales & Marketing - Lead Generation'
				},
				{
					'key': 'anyhire_sales_marketing_market_research',
					'value': 'Sales & Marketing - Market Research'
				},
				{
					'key': 'anyhire_sales_marketing_marketing_automation',
					'value': 'Sales & Marketing - Marketing Automation'
				},
				{
					'key': 'anyhire_sales_marketing_marketing_strategy',
					'value': 'Sales & Marketing - Marketing Strategy'
				},
				{
					'key': 'anyhire_sales_marketing_public_relations',
					'value': 'Sales & Marketing - Public Relations'
				},
				{
					'key': 'anyhire_sales_marketing_sales_business_development',
					'value': 'Sales & Marketing - Sales & Business Development'
				},
				{
					'key': 'anyhire_sales_marketing_search_engine_marketing',
					'value': 'Sales & Marketing - Search Engine Marketing'
				},
				{
					'key': 'anyhire_sales_marketing_search_engine_optimization',
					'value': 'Sales & Marketing - Search Engine Optimization'
				},
				{
					'key': 'anyhire_sales_marketing_social_media_marketing',
					'value': 'Sales & Marketing - Social Media Marketing'
				},
				{
					'key': 'anyhire_sales_marketing_telemarketing',
					'value': 'Sales & Marketing - Telemarketing'
				},
				{
					'key': 'anyhire_translation_language_localization',
					'value': 'Translation - Language Localization'
				},
				{
					'key': 'anyhire_translation_language_tutoring',
					'value': 'Translation - Language Tutoring'
				},
				{
					'key': 'anyhire_translation_legal_translation',
					'value': 'Translation - Legal Translation'
				},
				{
					'key': 'anyhire_translation_medical_translation',
					'value': 'Translation - Medical Translation'
				},
				{
					'key': 'anyhire_translation_technical_translation',
					'value': 'Translation - Technical Translation'
				},
				{
					'key': 'anyhire_translation_translation',
					'value': 'Translation - Translation'
				},
				{
					'key': 'anyhire_dev_ar_vr_development',
					'value': 'Web, Mobile, & Software Dev - AR/VR Development'
				},
				{
					'key': 'anyhire_dev_automation_testing',
					'value': 'Web, Mobile, & Software Dev - Automation Testing'
				},
				{
					'key': 'anyhire_dev_back_end_development',
					'value': 'Web, Mobile, & Software Dev - Back End Development'
				},
				{
					'key': 'anyhire_dev_cms_development',
					'value': 'Web, Mobile, & Software Dev - CMS Development'
				},
				{
					'key': 'anyhire_dev_coding_tutoring',
					'value': 'Web, Mobile, & Software Dev - Coding Tutoring'
				},
				{
					'key': 'anyhire_dev_database_development',
					'value': 'Web, Mobile, & Software Dev - Database Development'
				},
				{
					'key': 'anyhire_dev_desktop_software_development',
					'value': 'Web, Mobile, & Software Dev - Desktop Software Development'
				},
				{
					'key': 'anyhire_dev_ecommerce_development',
					'value': 'Web, Mobile, & Software Dev - Ecommerce Development'
				},
				{
					'key': 'anyhire_dev_emerging_tech',
					'value': 'Web, Mobile, & Software Dev - Emerging Tech'
				},
				{
					'key': 'anyhire_dev_firmware_development',
					'value': 'Web, Mobile, & Software Dev - Firmware Development'
				},
				{
					'key': 'anyhire_dev_front_end_development',
					'value': 'Web, Mobile, & Software Dev - Front End Development'
				},
				{
					'key': 'anyhire_dev_full_stack_development',
					'value': 'Web, Mobile, & Software Dev - Full Stack Development'
				},
				{
					'key': 'anyhire_dev_game_development',
					'value': 'Web, Mobile, & Software Dev - Game Development'
				},
				{
					'key': 'anyhire_dev_manual_testing',
					'value': 'Web, Mobile, & Software Dev - Manual Testing'
				},
				{
					'key': 'anyhire_dev_mobile_app_development',
					'value': 'Web, Mobile, & Software Dev - Mobile App Development'
				},
				{
					'key': 'anyhire_dev_mobile_design',
					'value': 'Web, Mobile, & Software Dev - Mobile Design'
				},
				{
					'key': 'anyhire_dev_mobile_game_development',
					'value': 'Web, Mobile, & Software Dev - Mobile Game Development'
				},
				{
					'key': 'anyhire_dev_product_management',
					'value': 'Web, Mobile, & Software Dev - Product Management'
				},
				{
					'key': 'anyhire_dev_prototyping',
					'value': 'Web, Mobile, & Software Dev - Prototyping'
				},
				{
					'key': 'anyhire_dev_scripting_automation',
					'value': 'Web, Mobile, & Software Dev - Scripting & Automation'
				},
				{
					'key': 'anyhire_dev_scrum_master',
					'value': 'Web, Mobile, & Software Dev - Scrum Master'
				},
				{
					'key': 'anyhire_dev_ux_ui_design',
					'value': 'Web, Mobile, & Software Dev - UX/UI Design'
				},
				{
					'key': 'anyhire_dev_user_research',
					'value': 'Web, Mobile, & Software Dev - User Research'
				},
				{
					'key': 'anyhire_dev_web_design',
					'value': 'Web, Mobile, & Software Dev - Web Design'
				},
				{
					'key': 'anyhire_writing_business_writing',
					'value': 'Writing - Business Writing'
				},
				{
					'key': 'anyhire_writing_career_coaching',
					'value': 'Writing - Career Coaching'
				},
				{
					'key': 'anyhire_writing_content_writing',
					'value': 'Writing - Content Writing'
				},
				{
					'key': 'anyhire_writing_copywriting',
					'value': 'Writing - Copywriting'
				},
				{
					'key': 'anyhire_writing_creative_writing',
					'value': 'Writing - Creative Writing'
				},
				{
					'key': 'anyhire_writing_editing_proofreading',
					'value': 'Writing - Editing & Proofreading'
				},
				{
					'key': 'anyhire_writing_ghostwriting',
					'value': 'Writing - Ghostwriting'
				},
				{
					'key': 'anyhire_writing_grant_writing',
					'value': 'Writing - Grant Writing'
				},
				{
					'key': 'anyhire_writing_scriptwriting',
					'value': 'Writing - Scriptwriting'
				},
				{
					'key': 'anyhire_writing_technical_writing',
					'value': 'Writing - Technical Writing'
				},
				{
					'key': 'anyhire_writing_writing_tutoring',
					'value': 'Writing - Writing Tutoring'
				}
			]
		}
	]
}

const appealForm = {
	'form': 5183853486483,
	'article': 5313574196627,
	'fields': {
		'country': 12706735727763
	}
}

const byocForm = {
	'form': 14837372713107,
	'fields': {
		'signup': 14837459626131,
		'haveClient': 14837481433491
	}
}

const circumventionForm = {
	'form': 360002699453,
	'fields': {
		'name': 360033682713,
		'email': 360035489513,
		'reportingCause': 360033682753
	}
}

const directContractForm = {
	'form': 360002736194,
	'articles': [
		360025040794,
		360025200853
	],
	'fields': {
		'url': 360031559393
	}
}

const enterpriseForm = {
	'form': 13167354088723,
	'fields': {
		'company': 13167049570963,
		'phone': 14224667005203,
		'reason': 13166966566035,
		'source': 19756165770003
	},
	'dropdowns': [
		{
			'key': 13166966566035,
			'options': [
				{
					'key': 'tag_enterprise_support_contract_updates',
					'value': 'Contract Updates'
				},
				{
					'key': 'tag_enterprise_support_joining_a_team',
					'value': 'Get Added to a Team'
				},
				{
					'key': 'tag_enterprise_support_help_posting_a_job_shortlisting_hiring',
					'value': 'Help posting a job, shortlisting, hiring'
				},
				{
					'key': 'tag_enterprise_support_enterprise_billing_invoicing',
					'value': 'Payments and Invoicing'
				},
				{
					'key': 'tag_enterprise_support_po_setting',
					'value': 'PO Setting'
				},
				{
					'key': 'tag_enterprise_support_reporting',
					'value': 'Reporting'
				},
				{
					'key': 'tag_enterprise_support_talent_cloud_update',
					'value': 'Talent Cloud Update'
				},
				{
					'key': 'tag_enterprise_support_talent',
					'value': 'Talent Onboarding Help'
				},
				{
					'key': 'tag_enterprise_support_unable_to_post_hire_or_pay',
					'value': 'Unable to post or hire'
				},
				{
					'key': 'tag_enterprise_support_unable_to_register_or_login',
					'value': 'Unable to register or login'
				},
				{
					'key': 'tag_enterprise_support_user_permissions',
					'value': 'User Permissions or Member Settings'
				},
				{
					'key': 'tag_enterprise_support_work_quality',
					'value': 'Work Quality / Contract Issues'
				},
				{
					'key': 'tag_enterprise_support_system_issue_or_bug',
					'value': 'System Issue or Bug'
				},
				{
					'key': 'tag_enterprise_support_migration',
					'value': 'Migration'
				},
				{
					'key': 'tag_enterprise_support_product_feedback_and_or_features',
					'value': 'Product Feedback and/or Features'
				},
				{
					'key': 'tag_enterprise_support_reporting_visibility',
					'value': 'Reporting / Visibility'
				},
				{
					'key': 'tag_enterprise_support_other',
					'value': 'Other'
				}
			]
		},
		{
			'key': 19756165770003,
			'options': [
				{
					'key': 'upwork_help',
					'value': 'Upwork Help'
				},
				{
					'key': 'enterprise_home',
					'value': 'Enterprise Home'
				}
			]
		}
	]
}

const feedbackRemovalForm = {
	'form': 9337355640851,
	'fields': {
		'impacted': 9337455080467,
		'howImpacted': 9372892730515,
		'contractID': 9337513238419
	},
	'radios': [
		{
			'key': 9337455080467,
			'options': [
				{
					'key': 'crisis_impacted_yes',
					'value': 'Yes'
				},
				{
					'key': 'crisis_impacted_no',
					'value': 'No'
				}
			]
		}
	]
}

const gssoForm = {
	'form': 360002199633,
	'fields': {
		'contactEmail': 360030943094,
		'phoneNumber': 360012395874,
		'street': 360030943134,
		'city': 360030943393,
		'state': 17992823848723,
		'zipCode': 360030943413,
		'dateJoining': 360012354173,
		'country': 360012396374,
		'creditCard': 360012360973,
		'dateTransaction': 360014307313,
		'datePaypal': 360014225334
	}
}

const selfAuthForm = {
	'form': 360000464433,
	'fields': {
		'contactEmail': 360030943094,
		'phoneNumber': 360012395874,
		'street': 360030943134,
		'city': 360030943393,
		'state': 17992823848723,
		'zipCode': 360030943413,
		'dateJoining': 360012354173,
		'country': 360012396374,
		'creditCard': 360012360973,
		'dateTransaction': 360014307313,
		'datePaypal': 360014225334,
		'tempPassword': 1500005980981,
		'userFeedback': 1500005981001,
		'otherFeedback': 1500005981041,
		'addtionalQuestions': 1500005981021,
		'source': 1500006034002
	},
	'radios': [
		{
			'key': 1500005980981,
			'options': [
				{
					'key': 'temp_password_yes',
					'value': 'Yes'
				},
				{
					'key': 'temp_password_no',
					'value': 'No'
				}
			]
		}
	],
	'dropdowns': [
		{
			'key': 1500005981001,
			'options': [
				{
					'key': 'help_improve_new_mobile_device',
					'value': 'I\'m using a new mobile device and my authenticator app doesn\'t work anymore'
				},
				{
					'key': 'help_improve_new_number',
					'value': 'I have a new phone number and text message verification doesn\'t work anymore'
				},
				{
					'key': 'help_improve_never_received_code',
					'value': 'I never received the code'
				},
				{
					'key': 'help_improve_no_mobile_device',
					'value': 'I no longer have a mobile device'
				},
				{
					'key': 'help_improve_no_access_email',
					'value': 'I don\'t have access to the email address the code was sent to'
				},
				{
					'key': 'help_improve_other',
					'value': 'Other'
				}
			]
		}
	]
}

const videoVoiceForm = {
	'form': 360004290473,
	'fields': {
		'date': 360045762493,
		'time': 360045762513,
		'device': 360045762593,
		'troubleshooting': 360045784114
	}
}

const disputeMetaFields = [
	{
		'id': 81479788,
		'key': 'contract-id',
		'title': 'Contract ID'
	},
	{
		'id': 81088407,
		'key': 'dispute-date',
		'title': 'Dispute date'
	},
	{
		'id': 81479908,
		'key': 'amount-escrow',
		'title': 'Amount in escrow'
	}
]

const commonSearches = [
	{
		'scope': 'freelancer',
		'keywords': 'connects, work diary, get paid'
	},
	{
		'scope': 'agency',
		'keywords': 'connects, work diary, get paid'
	},
	{
		'scope': 'client',
		'keywords': 'payment, refund, fees'
	},
	{
		'scope': 'enterprise',
		'keywords': 'invoice, feedback, fees'
	},
	{
		'scope': 'agent',
		'keywords': 'connects, work diary, get paid'
	}
]

const kbLinks = {
	'articles': {
		'privateProfile': 211060298,
		'financialHold': 360011239853,
		'videoVoice': 360050212774
	}
}

const kbMatrics = [
	{
		'scope': 'freelancer',
		'tiles': [
			{
				'id': 360001189113,
				'type': 'categories',
				'icon': 'icon-category-get-started',
				'title': 'Get Started',
				'description': 'How It Works, Getting Started, Fees & Protection'
			},
			{
				'id': 360001189093,
				'type': 'categories',
				'icon': 'icon-category-profile',
				'title': 'Build Your Profile',
				'description': 'Settings, Programs, Stats'
			},
			{
				'id': 360001181034,
				'type': 'categories',
				'icon': 'icon-category-projects',
				'title': 'Find a Project',
				'description': 'Search, Send Proposals, Interview, Accept Offers'
			},
			{
				'id': 360001189073,
				'type': 'categories',
				'icon': 'icon-category-start-working',
				'title': 'Start Working',
				'description': 'Messages, Work Diary, Contracts, Feedback'
			},
			{
				'id': 360001181014,
				'type': 'categories',
				'icon': 'icon-category-credit-card',
				'title': 'Get Paid',
				'description': 'Get Paid, Payment Options, Reports, Earnings, Taxes'
			},
			{
				'id': 360001189053,
				'type': 'categories',
				'icon': 'icon-category-payment-issues',
				'title': 'Payment Issues',
				'description': 'Timing, Issues, Refunds'
			},
			{
				'id': 360001180994,
				'type': 'categories',
				'icon': 'icon-category-account',
				'title': 'Account',
				'description': 'Account Settings, Service Options, Identity Verification'
			},
			{
				'id': 360001180954,
				'type': 'categories',
				'icon': 'icon-category-apps',
				'title': 'Apps',
				'description': 'Mobile App, Desktop App, Time Tracker'
			},
			{
				'id': 360001189033,
				'type': 'categories',
				'icon': 'icon-category-trust-safety',
				'title': 'Trust & Safety',
				'description': 'Terms of Service, Online Safety, Personal Data'
			},
			{
				'id': 115002435568,
				'type': 'categories',
				'icon': 'icon-category-api',
				'title': 'Upwork API',
				'description': 'Development Resources'
			},
			{
				'id': 360004530933,
				'type': 'categories',
				'icon': 'icon-category-catalog',
				'title': 'Project Catalog',
				'description': 'Pre-packaged projects'
			}
		]
	},
	{
		'scope': 'agency',
		'tiles': [
			{
				'id': 360001189113,
				'type': 'categories',
				'icon': 'icon-category-get-started',
				'title': 'Get Started',
				'description': 'How It Works, Getting Started, Fees & Protection'
			},
			{
				'id': 360001189173,
				'type': 'categories',
				'icon': 'icon-category-agency',
				'title': 'Build Your Agency',
				'description': 'Agency Settings, Edit Profile, Agency Programs, Stats'
			},
			{
				'id': 360001181034,
				'type': 'categories',
				'icon': 'icon-category-projects',
				'title': 'Find a Project',
				'description': 'Search, Send Proposals, Interview, Accept Offers'
			},
			{
				'id': 360001189073,
				'type': 'categories',
				'icon': 'icon-category-start-working',
				'title': 'Start Working',
				'description': 'Messages, Work Diary, Contracts, Feedback'
			},
			{
				'id': 360001181014,
				'type': 'categories',
				'icon': 'icon-category-credit-card',
				'title': 'Get Paid',
				'description': 'Get Paid, Payment Options, Reports, Earnings, Taxes'
			},
			{
				'id': 360001189053,
				'type': 'categories',
				'icon': 'icon-category-payment-issues',
				'title': 'Payment Issues',
				'description': 'Timing, Issues, Refunds'
			},
			{
				'id': 360001180994,
				'type': 'categories',
				'icon': 'icon-category-account',
				'title': 'Account',
				'description': 'Account Settings, Service Options, Identity Verification'
			},
			{
				'id': 360001180954,
				'type': 'categories',
				'icon': 'icon-category-apps',
				'title': 'Apps',
				'description': 'Mobile App, Desktop App, Time Tracker'
			},
			{
				'id': 360001189033,
				'type': 'categories',
				'icon': 'icon-category-trust-safety',
				'title': 'Trust & Safety',
				'description': 'Terms of Service, Online Safety, Personal Data'
			},
			{
				'id': 115002435568,
				'type': 'categories',
				'icon': 'icon-category-api',
				'title': 'Upwork API',
				'description': 'Development Resources'
			},
			{
				'id': 360004530933,
				'type': 'categories',
				'icon': 'icon-category-catalog',
				'title': 'Project Catalog',
				'description': 'Pre-packaged projects'
			}
		]
	},
	{
		'scope': 'client',
		'tiles': [
			{
				'id': 360001184194,
				'type': 'categories',
				'icon': 'icon-category-get-started',
				'title': 'Get Started',
				'description': 'How It Works, Getting Started, Fees & Protection'
			},
			{
				'id': 360001184214,
				'type': 'categories',
				'icon': 'icon-category-find-freelancer',
				'title': 'Find a Freelancer',
				'description': 'Post a Job, Find Talent'
			},
			{
				'id': 360001184234,
				'type': 'categories',
				'icon': 'icon-category-start-working',
				'title': 'Make a Hire',
				'description': 'Evaluate Proposals, Interview Freelancers, Send an Offer'
			},
			{
				'id': 360001191213,
				'type': 'categories',
				'icon': 'icon-category-projects',
				'title': 'Manage Your Project',
				'description': ' Contracts, Feedback'
			},
			{
				'id': 360001191233,
				'type': 'categories',
				'icon': 'icon-category-credit-card',
				'title': 'Pay for Work',
				'description': 'Billing, Make Payments, Reports, Invoices, Disputes'
			},
			{
				'id': 360001191293,
				'type': 'categories',
				'icon': 'icon-category-membership',
				'title': 'Service Options',
				'description': 'Basic, Pro, Enterprise'
			},
			{
				'id': 360001191313,
				'type': 'categories',
				'icon': 'icon-category-account',
				'title': 'Account',
				'description': 'Account Settings, Manage Teams, Team Permissions'
			},
			{
				'id': 360001180954,
				'type': 'categories',
				'icon': 'icon-category-apps',
				'title': 'Apps',
				'description': 'Mobile App, Desktop App, Time Tracker'
			},
			{
				'id': 360001189033,
				'type': 'categories',
				'icon': 'icon-category-trust-safety',
				'title': 'Trust & Safety',
				'description': 'Terms of Service, Online Safety, Personal Data'
			},
			{
				'id': 115002435568,
				'type': 'categories',
				'icon': 'icon-category-api',
				'title': 'Upwork API',
				'description': 'Development Resources'
			},
			{
				'id': 360004530933,
				'type': 'categories',
				'icon': 'icon-category-catalog',
				'title': 'Project Catalog',
				'description': 'Pre-packaged projects'
			}
		]
	},
	{
		'scope': 'enterprise',
		'tiles': [
			{
				'id': 17870954115475,
				'type': 'categories',
				'icon': 'icon-category-get-started',
				'title': 'Getting Started',
				'description': 'Learn about Enterprise and set up your account'
			},
			{
				'id': 17871049573779,
				'type': 'categories',
				'icon': 'icon-category-find-freelancer',
				'title': 'Connect with Talent',
				'description': 'Source talent on Upwork or from your own network'
			},
			{
				'id': 17871165267987,
				'type': 'categories',
				'icon': 'icon-category-enterprise-services',
				'title': 'Hiring and Onboarding',
				'description': 'Post jobs, send offers, review proposals, and hire'
			},
			{
				'id': 17871234924307,
				'type': 'categories',
				'icon': 'icon-category-start-working',
				'title': 'Working with Talent',
				'description': 'Review talent\’s work and manage contracts'
			},
			{
				'id': 17871210774419,
				'type': 'categories',
				'icon': 'icon-category-credit-card',
				'title': 'Managing Financials',
				'description': 'Learn about billing, fees, purchase orders, reports, and taxes'
			},
			{
				'id': 17871351046547,
				'type': 'categories',
				'icon': 'icon-category-apps',
				'title': 'Apps and Integrations',
				'description': 'Use apps and integrations for a seamless experience on Upwork'
			},
			{
				'id': 17871335319187,
				'type': 'categories',
				'icon': 'icon-category-trust-safety',
				'title': 'Trust & Safety',
				'description': 'See Terms of Service, online safety tips and best practices'
			},
			{
				'id': 17871353237779,
				'type': 'categories',
				'icon': 'icon-category-api',
				'title': 'Upwork API',
				'description': 'Development Resources'
			}
		]
	},
	{
		'scope': 'agent',
		'tiles': [
			{
				'id': 201367127,
				'type': 'categories',
				'icon': 'icon-category-client',
				'title': 'Client',
				'description': 'Client-specific concerns'
			},
			{
				'id': 201362788,
				'type': 'categories',
				'icon': 'icon-category-freelancer',
				'title': 'Freelancer',
				'description': 'Freelancer-specific concerns'
			},
			{
				'id': 360001114814,
				'type': 'categories',
				'icon': 'icon-category-technical-support',
				'title': 'Technical Issues',
				'description': 'Tech issues, when to escalate, T&S FAQ\'s'
			},
			{
				'id': 360001114874,
				'type': 'categories',
				'icon': 'icon-category-connection',
				'title': 'Other Depts',
				'description': 'Other departments\' cases, POCs in charge, escalations'
			},
			{
				'id': 201362688,
				'type': 'categories',
				'icon': 'icon-category-policies',
				'title': 'Policies & Processes',
				'description': 'CS attendance policy, TL-only processes, Legal issues, etc.'
			},
			{
				'id': 201362738,
				'type': 'categories',
				'icon': 'icon-category-hire',
				'title': 'New Hire',
				'description': 'Training videos, agent resources, general product info, ticket handling.'
			},
			{
				'id': 360004530933,
				'type': 'categories',
				'icon': 'icon-category-catalog',
				'title': 'Project Catalog',
				'description': 'Pre-packaged projects'
			}
		]
	}
]

const instantHelp = [
	{
		'scope': 'freelancer',
		'options': [
			{
				'icon': 'icon-helps-private-profile',
				'title': 'Reset Profile Visibility',
				'description': 'Change your profile to public',
				'link': 'https://support.upwork.com/hc/en-us?request=t_private_profile'
			},
			{
				'icon': 'icon-helps-earnings',
				'title': 'Certificate of Earnings',
				'description': 'Your last twelve months earnings',
				'link': 'https://www.upwork.com/ab/payments/reports/certificate-of-earnings.pdf'
			},
			{
				'icon': 'icon-helps-password-reset',
				'title': 'Reset Password',
				'description': 'Change your account password',
				'link': 'https://www.upwork.com/ab/account-security/reset-password'
			},
			{
				'icon': 'icon-helps-stats',
				'title': 'My Stats',
				'description': 'View your job success and other stats',
				'link': 'https://www.upwork.com/my-stats'
			}
		]
	},
	{
		'scope': 'agency',
		'options': [
			{
				'icon': 'icon-helps-earnings',
				'title': 'Certificate of Earnings',
				'description': 'Your last twelve months earnings',
				'link': 'https://www.upwork.com/ab/payments/reports/certificate-of-earnings.pdf'
			},
			{
				'icon': 'icon-helps-password-reset',
				'title': 'Reset Password',
				'description': 'Change your account password',
				'link': 'https://www.upwork.com/ab/account-security/reset-password'
			},
			{
				'icon': 'icon-helps-close-account',
				'title': 'Close Account',
				'description': 'Permanently close your account',
				'link': 'https://www.upwork.com/freelancers/settings/close-account'
			},
			{
				'icon': 'icon-helps-stats',
				'title': 'My Stats',
				'description': 'View your job success and other stats',
				'link': 'https://www.upwork.com/my-stats'
			}
		]
	},
	{
		'scope': 'client',
		'options': [
			{
				'icon': 'icon-helps-payment-circle',
				'title': 'Update Billing',
				'description': 'Change or update your billing methods',
				'link': 'https://www.upwork.com/ab/payments/deposit-methods'
			},
			{
				'icon': 'icon-helps-contracts',
				'title': 'Manage Contracts',
				'description': 'Update or manage active contracts',
				'link': 'https://www.upwork.com/contracts'
			},
			{
				'icon': 'icon-helps-close-account',
				'title': 'Close Account',
				'description': 'Permanently close your account',
				'link': 'https://www.upwork.com/ab/client-info/close-account-modal'
			},
			{
				'icon': 'icon-helps-password-reset',
				'title': 'Reset Password',
				'description': 'Change your account password',
				'link': 'https://www.upwork.com/ab/account-security/reset-password'
			}
		]
	},
	{
		'scope': 'enterprise',
		'options': [
			{
				'icon': 'icon-helps-payment-circle',
				'title': 'Update Billing',
				'description': 'Change or update your billing methods',
				'link': 'https://www.upwork.com/ab/payments/deposit-methods'
			},
			{
				'icon': 'icon-helps-contracts',
				'title': 'Manage Contracts',
				'description': 'Update or manage active contracts',
				'link': 'https://www.upwork.com/contracts'
			},
			{
				'icon': 'icon-helps-close-account',
				'title': 'Close Account',
				'description': 'Permanently close your account',
				'link': 'https://www.upwork.com/ab/client-info/close-account-modal'
			},
			{
				'icon': 'icon-helps-password-reset',
				'title': 'Reset Password',
				'description': 'Change your account password',
				'link': 'https://www.upwork.com/ab/account-security/reset-password'
			}
		]
	},
	{
		'scope': 'agent',
		'options': [
			{
				'icon': 'icon-helps-directory',
				'title': 'Help Documentation',
				'description': 'Learn more about Upwork Help',
				'link': 'https://support.upwork.com/hc/en-us/articles/360022202234'
			},
			{
				'icon': 'icon-helps-zendesk',
				'title': 'Zendesk Dashboard',
				'description': 'Launch the Zendesk agent dashboard',
				'link': 'https://upwork.zendesk.com/agent/dashboard'
			},
			{
				'icon': 'icon-helps-zopim',
				'title': 'Zopim Dashboard',
				'description': 'Launch the Zopim agent dashboard',
				'link': 'https://upwork.zendesk.com/chat/start'
			},
			{
				'icon': 'icon-helps-problem-tickets',
				'title': 'Problem Tickets',
				'description': 'View open problem tickets',
				'link': 'https://upwk.xyz/2zuSMMx'
			}
		]
	}
]

const recommendedTopics = [
	{
		'scope': 'freelancer',
		'links': [
			{
				'title': 'Staying Safe on Upwork',
				'description': 'Online safety best practices',
				'link': 'articles/211067668'
			},
			{
				'title': 'Edit Account Information',
				'description': 'Update your account info',
				'link': 'articles/211067528'
			},
			{
				'title': 'Profile Changed to "Private"',
				'description': 'Change your profile back to public',
				'link': 'articles/115003975967'
			},
			{
				'title': 'Profile Application Declined',
				'description': 'How admission to Upwork works',
				'link': 'articles/214180797'
			},
			{
				'title': 'Use Connects',
				'description': 'Using and purchasing Connects',
				'link': 'articles/211062898'
			},
			{
				'title': 'Manage How You Get Paid',
				'description': 'Getting paid through Upwork',
				'link': 'articles/211060918'
			},
			{
				'title': 'Profile Tips and Best Practices',
				'description': 'Tips for crafting a great profile',
				'link': 'articles/211063208'
			},
			{
				'title': 'Membership Plans',
				'description': 'Learn about Upwork memberships',
				'link': 'articles/211062888'
			},
			{
				'title': 'Weekly Billing Cycle',
				'description': 'How billing periods work',
				'link': 'articles/211063698'
			},
			{
				'title': 'Install the Desktop App',
				'description': 'Using the Upwork time tracker',
				'link': 'articles/211064088'
			}
		]
	},
	{
		'scope': 'agency',
		'links': [
			{
				'title': 'Staying Safe on Upwork',
				'description': 'Online safety best practices',
				'link': 'articles/211067668'
			},
			{
				'title': 'Create an Agency',
				'description': 'How to build an agency',
				'link': 'articles/211067598'
			},
			{
				'title': 'Profile Changed to "Private"',
				'description': 'Change your profile back to public',
				'link': 'articles/115003975967'
			},
			{
				'title': 'Agency Plus',
				'description': 'Managing your agency membership',
				'link': 'articles/211062958'
			},
			{
				'title': 'Agency Profile',
				'description': 'Tips for creating an amazing profile',
				'link': 'articles/360009646433'
			},
			{
				'title': 'Manage Agency Roster',
				'description': 'Managing your team on Upwork',
				'link': 'articles/360009524094'
			},
			{
				'title': 'Manage How You Get Paid',
				'description': 'Getting paid through Upwork',
				'link': 'articles/211060918'
			},
			{
				'title': 'Membership Plans',
				'description': 'Learn about Upwork memberships',
				'link': 'articles/211062888'
			},
			{
				'title': 'Weekly Billing Cycle',
				'description': 'How billing periods work',
				'link': 'articles/211063698'
			},
			{
				'title': 'Install the Desktop App',
				'description': 'Using the Upwork time tracker',
				'link': 'articles/211064088'
			}
		]
	},
	{
		'scope': 'client',
		'links': [
			{
				'title': 'Staying Safe on Upwork',
				'description': 'Online safety best practices',
				'link': 'articles/211067668'
			},
			{
				'title': 'Enable or Disable Manual Time',
				'description': 'Allowing manual time on contracts',
				'link': 'articles/211062308'
			},
			{
				'title': 'Client Payment Processing Fees',
				'description': 'How processing fees work',
				'link': 'articles/218375638'
			},
			{
				'title': 'Service Options',
				'description': 'Learn about Upwork memberships',
				'link': 'categories/360001191293'
			},
			{
				'title': 'Use Messages',
				'description': 'Communicating through Upwork',
				'link': 'articles/211067768'
			},
			{
				'title': 'Be a Client and a Freelancer',
				'description': 'Utilizing multiple account types',
				'link': 'articles/211067558'
			},
			{
				'title': 'Billing Methods',
				'description': 'Setting up a billing method',
				'link': 'articles/211067988'
			},
			{
				'title': 'Request a Refund',
				'description': 'How to request a refund',
				'link': 'articles/211062088'
			},
			{
				'title': 'Upwork Payment Protection',
				'description': 'How your payments are protected',
				'link': 'articles/211062568'
			},
			{
				'title': 'Viewing the Work Diary',
				'description': 'Record of your freelancer\'s activity',
				'link': 'articles/211062278'
			}
		]
	},
	{
		'scope': 'enterprise',
		'links': [
			{
				'title': 'Staying Safe on Upwork',
				'description': 'Online safety best practices',
				'link': 'articles/211067668'
			},
			{
				'title': 'Enterprise Onboarding',
				'description': 'Onboarding your new hire',
				'link': 'articles/226686528'
			},
			{
				'title': 'Compliance Services',
				'description': 'Enrolling in compliance services',
				'link': 'articles/226526647'
			},
			{
				'title': 'Talent Sourcing',
				'description': 'Utilizing your Upwork sourcing team',
				'link': 'articles/360001650667'
			},
			{
				'title': 'Use Messages',
				'description': 'Communicating through Upwork',
				'link': 'articles/211067768'
			},
			{
				'title': 'Hiring with Upwork Payroll',
				'description': 'Paying employees through payroll',
				'link': 'articles/211062518'
			},
			{
				'title': 'Enterprise Billing',
				'description': 'Setting up a billing method',
				'link': 'articles/226529107'
			},
			{
				'title': 'Request a Refund',
				'description': 'How to request a refund',
				'link': 'articles/211062088'
			},
			{
				'title': 'Upwork Payment Protection',
				'description': 'How your payments are protected',
				'link': 'articles/211062568'
			},
			{
				'title': 'Request an API Key',
				'description': 'Integrate with the Upwork API',
				'link': 'articles/115015857647'
			}
		]
	},
	{
		'scope': 'agent',
		'links': [
			{
				'title': 'Staying Safe on Upwork',
				'description': 'Online safety best practices',
				'link': 'articles/211067668'
			},
			{
				'title': 'Job Success Score',
				'description': 'Measure of a FL\'s or Agency\'s client satisfaction',
				'link': 'articles/360010413033'
			},
			{
				'title': 'Identity Verification',
				'description': 'Routine requests to verify identities',
				'link': 'articles/360010246813'
			},
			{
				'title': 'Freelancer MQ Suspensions',
				'description': 'MQ-specific actions, zero tolerance, time wasters, unsuccessful FLs',
				'link': 'articles/360010871934'
			},
			{
				'title': 'Mediation & Disputes',
				'description': 'When to send to Mediation Support',
				'link': 'articles/360010489494'
			},
			{
				'title': 'MQ Escalation Directory',
				'description': 'Guide on MQ\'s process paths',
				'link': 'articles/360010802953'
			},
			{
				'title': 'Client Membership Plans',
				'description': 'Client Plans: Basic, Plus, and Business',
				'link': 'articles/360017925953'
			},
			{
				'title': 'Withdrawal Issues',
				'description': 'Withdrawal issues, tracers, and recalls',
				'link': 'articles/360010182473'
			},
			{
				'title': 'Edit or Remove Feedback',
				'description': 'Feedback FAQs and process map',
				'link': 'articles/360010525033'
			},
			{
				'title': 'Tech Support Best Practices',
				'description': 'Tech Support troubleshooting and bug escalation',
				'link': 'articles/360010367733'
			}
		]
	}
]

const kbRedirects = {
	'categories': [
		{
			'source': 201362678,
			'destination': null
		},
		{
			'source': 201362698,
			'destination': null
		},
		{
			'source': 201362778,
			'destination': null
		},
		{
			'source': 201362718,
			'destination': null
		},
		{
			'source': 201362758,
			'destination': null
		},
		{
			'source': 201362728,
			'destination': null
		},
		{
			'source': 201362708,
			'destination': null
		},
		{
			'source': 201362668,
			'destination': null
		},
		{
			'source': 201362768,
			'destination': null
		},
		{
			'source': 203575248,
			'destination': null
		},
		{
			'source': 203575268,
			'destination': null
		}
	],
	'sections': [
		{
			'source': 204336927,
			'destination': null
		},
		{
			'source': 202260468,
			'destination': null
		},
		{
			'source': 202260348,
			'destination': null
		},
		{
			'source': 203840107,
			'destination': null
		},
		{
			'source': 202260488,
			'destination': null
		},
		{
			'source': 115001777987,
			'destination': null
		},
		{
			'source': 207086647,
			'destination': null
		},
		{
			'source': 207073748,
			'destination': null
		},
		{
			'source': 202260588,
			'destination': null
		},
		{
			'source': 207073768,
			'destination': null
		},
		{
			'source': 207086667,
			'destination': null
		},
		{
			'source': 202260558,
			'destination': null
		},
		{
			'source': 202261168,
			'destination': null
		},
		{
			'source': 202261208,
			'destination': null
		},
		{
			'source': 202261198,
			'destination': null
		},
		{
			'source': 202261218,
			'destination': null
		},
		{
			'source': 202260668,
			'destination': null
		},
		{
			'source': 202260708,
			'destination': null
		},
		{
			'source': 206357807,
			'destination': 'sections/360002707693'
		},
		{
			'source': 115000474907,
			'destination': null
		},
		{
			'source': 202260728,
			'destination': null
		},
		{
			'source': 202260678,
			'destination': null
		},
		{
			'source': 202261028,
			'destination': null
		},
		{
			'source': 202261038,
			'destination': null
		},
		{
			'source': 202260548,
			'destination': null
		},
		{
			'source': 202260618,
			'destination': null
		},
		{
			'source': 202261048,
			'destination': null
		},
		{
			'source': 204142167,
			'destination': null
		},
		{
			'source': 202260758,
			'destination': null
		},
		{
			'source': 202260768,
			'destination': null
		},
		{
			'source': 202260628,
			'destination': null
		},
		{
			'source': 202260648,
			'destination': null
		},
		{
			'source': 202260658,
			'destination': null
		},
		{
			'source': 202260448,
			'destination': null
		},
		{
			'source': 202260438,
			'destination': null
		},
		{
			'source': 202260428,
			'destination': null
		},
		{
			'source': 202260418,
			'destination': null
		},
		{
			'source': 202261148,
			'destination': null
		},
		{
			'source': 202261108,
			'destination': null
		},
		{
			'source': 207086787,
			'destination': null
		},
		{
			'source': 360000304688,
			'destination': null
		},
		{
			'source': 360000304668,
			'destination': null
		},
		{
			'source': 360000264527,
			'destination': null
		},
		{
			'source': 205955227,
			'destination': null
		},
		{
			'source': 205569927,
			'destination': null
		},
		{
			'source': 205567388,
			'destination': 'articles/218373797'
		}
	],
	'articles': [
		{
			'source': 18259040056851,
			'destination': 'articles/17978069236627'
		},
		{
			'source': 211067618,
			'destination': 'articles/1500007568141'
		},
		{
			'source': 211062108,
			'destination': 'articles/211062568'
		},
		{
			'source': 360000525448,
			'destination': 'articles/360025295713'
		},
		{
			'source': 211067878,
			'destination': null
		},
		{
			'source': 360021891994,
			'destination': null
		},
		{
			'source': 115006099287,
			'destination': 'articles/360049702614'
		},
		{
			'source': 360001662588,
			'destination': 'articles/360009491414'
		},
		{
			'source': 115006097327,
			'destination': 'articles/211068358'
		},
		{
			'source': 211062948,
			'destination': 'articles/211062958'
		},
		{
			'source': 61866380,
			'destination': 'articles/211062958'
		},
		{
			'source': 211062928,
			'destination': 'articles/211062958'
		},
		{
			'source': 360001650607,
			'destination': 'articles/211062518'
		},
		{
			'source': 211068008,
			'destination': 'articles/211068038'
		},
		{
			'source': 115001499067,
			'destination': 'articles/360011640014'
		},
		{
			'source': 115001497187,
			'destination': 'articles/360011640014'
		},
		{
			'source': 115001497847,
			'destination': 'articles/360011640014'
		},
		{
			'source': 115001497247,
			'destination': 'articles/360011640014'
		},
		{
			'source': 115001546028,
			'destination': 'articles/360011640014'
		},
		{
			'source': 115001497307,
			'destination': 'articles/360011640014'
		},
		{
			'source': 115001544448,
			'destination': 'articles/360011640014'
		},
		{
			'source': 115001497447,
			'destination': 'articles/360011640014'
		},
		{
			'source': 115001546048,
			'destination': 'articles/360011640014'
		},
		{
			'source': 115001544388,
			'destination': 'articles/360011640014'
		},
		{
			'source': 115001544168,
			'destination': 'articles/360011640014'
		},
		{
			'source': 115001544768,
			'destination': 'articles/360011640014'
		},
		{
			'source': 235005488,
			'destination': 'articles/360011640014'
		},
		{
			'source': 211063858,
			'destination': 'articles/360011640014'
		},
		{
			'source': 115001544068,
			'destination': 'articles/360011640014'
		},
		{
			'source': 360001681567,
			'destination': 'articles/211068198'
		},
		{
			'source': 360009435054,
			'destination': 'articles/211068198'
		},
		{
			'source': 226684828,
			'destination': 'articles/211063668'
		},
		{
			'source': 360001411448,
			'destination': 'articles/211068218'
		},
		{
			'source': 360001416887,
			'destination': 'articles/360000980507'
		},
		{
			'source': 360001411148,
			'destination': 'articles/360000980507'
		},
		{
			'source': 360001416847,
			'destination': 'articles/360000980407'
		},
		{
			'source': 3600016807,
			'destination': 'articles/360000980507'
		},
		{
			'source': 360001411128,
			'destination': 'articles/360000990268'
		},
		{
			'source': 360001662908,
			'destination': 'articles/211068188'
		},
		{
			'source': 360001411508,
			'destination': 'articles/211062378'
		},
		{
			'source': 360001663068,
			'destination': 'articles/211062218'
		},
		{
			'source': 360001681607,
			'destination': 'articles/211063618'
		},
		{
			'source': 360001650647,
			'destination': 'articles/211063418'
		},
		{
			'source': 360001416767,
			'destination': 'articles/211062248'
		},
		{
			'source': 226685308,
			'destination': 'articles/211063408'
		},
		{
			'source': 360001663028,
			'destination': 'articles/211063588'
		},
		{
			'source': 360001662968,
			'destination': 'articles/211063608'
		},
		{
			'source': 360001237148,
			'destination': 'articles/211067588'
		},
		{
			'source': 226486827,
			'destination': 'articles/218373797'
		},
		{
			'source': 214754938,
			'destination': 'articles/211064058'
		},
		{
			'source': 215465597,
			'destination': 'articles/211064058'
		},
		{
			'source': 214754758,
			'destination': 'articles/211064058'
		},
		{
			'source': 215469327,
			'destination': 'articles/211064058'
		},
		{
			'source': 226342267,
			'destination': 'articles/211064058'
		},
		{
			'source': 215469277,
			'destination': 'articles/211064058'
		},
		{
			'source': 211063738,
			'destination': 'articles/211060918'
		},
		{
			'source': 211063728,
			'destination': 'articles/211060918'
		},
		{
			'source': 115013151187,
			'destination': 'articles/211067708'
		},
		{
			'source': 211063148,
			'destination': 'articles/360016252373'
		},
		{
			'source': 115003289088,
			'destination': 'articles/360016252373'
		},
		{
			'source': 211063158,
			'destination': 'articles/360016252373'
		},
		{
			'source': 211060358,
			'destination': 'articles/360016252373'
		},
		{
			'source': 215650488,
			'destination': 'articles/360016252373'
		},
		{
			'source': 211060228,
			'destination': 'articles/360016252373'
		},
		{
			'source': 211060248,
			'destination': 'articles/360016252373'
		},
		{
			'source': 216293377,
			'destination': 'articles/360016252373'
		},
		{
			'source': 211060408,
			'destination': 'articles/360016252373'
		},
		{
			'source': 211063218,
			'destination': 'articles/360016144974'
		},
		{
			'source': 211063178,
			'destination': 'articles/360016144974'
		},
		{
			'source': 211060568,
			'destination': 'articles/360016144974'
		},
		{
			'source': 211060238,
			'destination': 'articles/360016144974'
		},
		{
			'source': 360000990348,
			'destination': 'articles/360000980507'
		},
		{
			'source': 360000980467,
			'destination': 'articles/360000980507'
		},
		{
			'source': 360000990248,
			'destination': 'articles/360000980507'
		}
	]
}

const kbMirrors = {
	'categories': [
		{
			'mirror': 360001184254,
			'items': [
				{
					'id': 360002713933,
					'title': ' Account Settings'
				}
			]
		},
		{
			'mirror': 360001191333,
			'items': [
				{
					'id': 360002713853,
					'title': 'Disputes'
				},
				{
					'id': 360002679754,
					'title': 'Reports &amp; Invoices'
				}
			]
		}
	],
	'sections': [
		{
			'mirror': 360002784473,
			'items': [
				{
					'id': 211067938,
					'title': 'Pay for Hourly Contracts'
				},
				{
					'id': 360000990428,
					'title': 'Fixed-Price Job Offer Deposits'
				},
				{
					'id': 115015915467,
					'title': 'Split Balance Between Billing Methods'
				},
				{
					'id': 115006419987,
					'title': 'Pay Past-Due Balance'
				},
				{
					'id': 211062518,
					'title': 'Hiring with Upwork Payroll'
				},
				{
					'id': 211067918,
					'title': 'Tax Requirements'
				},
				{
					'id': 360024257434,
					'title': 'International Hiring with Upwork Payroll'
				}
			]
		},
		{
			'mirror': 360002670234,
			'items': [
				{
					'id': 211068348,
					'title': 'Contract Paused'
				},
				{
					'id': 211068428,
					'title': 'End Your Contract'
				},
				{
					'id': 115006647007,
					'title': 'Propose Another Contract'
				}
			]
		},
		{
			'mirror': 360002679874,
			'items': [
				{
					'id': 211063338,
					'title': 'Enable Teams'
				},
				{
					'id': 211063368,
					'title': 'Add or Remove Team Members'
				},
				{
					'id': 115000394427,
					'title': 'Team Permissions'
				},
				{
					'id': 115000413308,
					'title': 'Groups Contracts Within Teams'
				},
				{
					'id': 115000413988,
					'title': 'Hide a Team'
				},
				{
					'id': 115000414068,
					'title': 'Move Someone to a Different Team'
				}
			]
		},
		{
			'mirror': 360002707073,
			'items': [
				{
					'id': 211062548,
					'title': 'Supported Browsers'
				},
				{
					'id': 360008783494,
					'title': 'Get Help with Support Bot'
				}
			]
		},
		{
			'mirror': 360002707093,
			'items': [
				{
					'id': 360009495714,
					'title': 'Upwork Community'
				}
			]
		},
		{
			'mirror': 360002707133,
			'items': [
				{
					'id': 211062518,
					'title': 'Hiring with Upwork Payroll'
				},
				{
					'id': 211062988,
					'title': 'Minimum Hourly Rates'
				}
			]
		},
		{
			'mirror': 360002707313,
			'items': [
				{
					'id': 211063418,
					'title': 'Hourly vs. Fixed-Price Projects'
				}
			]
		},
		{
			'mirror': 360002707753,
			'items': [
				{
					'id': 360012069193,
					'title': 'Change Password or Security Question and Answer'
				},
				{
					'id': 211067518,
					'title': 'Forgot Password or Security Question'
				},
				{
					'id': 211067588,
					'title': 'Close My Account'
				},
				{
					'id': 211067708,
					'title': 'Manage Notifications'
				},
				{
					'id': 360009491414,
					'title': 'Two-Step Security Verification'
				}
			]
		},
		{
			'mirror': 360002713553,
			'items': [
				{
					'id': 211067758,
					'title': 'Troubleshoot Messages'
				},
				{
					'id': 211067768,
					'title': 'Use Messages'
				},
				{
					'id': 217698348,
					'title': 'Video and Voice Calls'
				},
				{
					'id': 115006778507,
					'title': 'Supported Attachment File Types'
				}
			]
		},
		{
			'mirror': 360002707413,
			'items': [
				{
					'id': 211068368,
					'title': 'Submit Deliverables'
				}
			]
		},
		{
			'mirror': 360002677654,
			'items': [
				{
					'id': 115001457268,
					'title': 'Use Screenshots'
				}
			]
		},
		{
			'mirror': 360002679834,
			'items': [
				{
					'id': 360001681627,
					'title': 'Get Added to an Enterprise Account'
				}
			]
		}
	]
}

jQuery(function () {
	if (isUserAnonymous()) {
		$.ajax(upworkConfig.url + '/ab/account-security/is-authenticated', {
			type: 'GET',
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			statusCode: {
				200: function () {
					deleteCookie(upworkConfig.cookies.prefix + 'user-tab')
					if ( ! detectPageTemplates('articles')) {
						window.location.href = zdBrands.main.url + '/login?return_to=' + encodeURI(window.location)
					}
				},
				401: function () {
					deleteCookie(upworkConfig.cookies.prefix + 'oauth2-access-token')
					deleteCookie(upworkConfig.cookies.prefix + 'oauth2-refresh-token')
					deleteCookie(upworkConfig.cookies.prefix + 'oauth2-refresh-token-expires')
				}
			}
		})
	} else {
		oAuthSetup()
	}
})

/* Get url parts in array. */
function getUrlPartsArray () {
	return window.location.pathname.split('/')
}

/* Detect page templates. */
function detectPageTemplates (template) {
	let urlPartsArray = getUrlPartsArray()

	switch (template) {
		case 'request-new':
			if (urlPartsArray[3] === 'requests' && urlPartsArray[4] === 'new') {
				return true
			}
			break
		case 'requests-list':
			if (urlPartsArray[3] === 'requests' && urlPartsArray[4] === undefined) {
				return true
			} else if (urlPartsArray[3] === 'requests' && urlPartsArray[4] === 'ccd') {
				return true
			}
			break
		case 'request-single':
			if (urlPartsArray[3] === 'requests' && urlPartsArray[4] !== undefined && urlPartsArray[4] !== 'new') {
				return true
			}
			break
		case 'home':
			if (urlPartsArray[1] === 'hc') {
				if (urlPartsArray[3] === undefined || urlPartsArray[3] === '') {
					return true
				}
			}
			break
		case 'categories':
			if (urlPartsArray[3] === 'categories') {
				return true
			}
			break
		case 'sections':
			if (urlPartsArray[3] === 'sections') {
				return true
			}
			break
		case 'articles':
			if (urlPartsArray[3] === 'articles') {
				return true
			}
			break
		case 'search':
			if (urlPartsArray[3] === 'search') {
				return true
			}
			break
	}
}

/* Set cookie for day(s). */
function setCookieForDays (name, value, days) {
	let expires = ''
	if (days) {
		let date = new Date()
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
		expires = '; expires=' + date.toGMTString()
	}

	document.cookie = name + '=' + value + expires + '; path=/'
}

/* Set cookie for hours(s). */
function setCookieForHours (name, value, hours) {
	let expires = ''
	if (hours) {
		let date = new Date()
		date.setTime(date.getTime() + (hours * 60 * 60 * 1000))
		expires = '; expires=' + date.toGMTString()
	}

	document.cookie = name + '=' + value + expires + '; path=/'
}

/* Set cookie for min(s). */
function setCookieForMins (name, value, mins) {
	let expires = ''
	if (mins) {
		let date = new Date()
		date.setTime(date.getTime() + (mins * 60 * 1000))
		expires = '; expires=' + date.toGMTString()
	}

	document.cookie = name + '=' + value + expires + '; path=/'
}

/* Get cookie value. */
function getCookie (name) {
	name = name + '='
	let cookies = document.cookie.split(';')

	for (let i in cookies) {
		let cookie = cookies[i]
		if (cookie.charAt(0) === ' ') {
			cookie = cookie.substring(1, cookie.length)
		}
		if (cookie.indexOf(name) === 0) {
			return cookie.substring(name.length, cookie.length)
		}
	}

	return null
}

/* Delete a cookie. */
function deleteCookie (name) {
	let expires = '; expires=' + 'Thu, 01 Jan 1970 00:00:01 GMT' + '; path=/'
	document.cookie = name + '=' + expires
}

/* Delete all cookies. */
function deleteAllCookies () {

	// Get an array of cookies
	let getCookies = document.cookie.split(';')

	for (let i in getCookies) {
		let cookie = getCookies[i].trim().split('=')

		let cookieName = cookie[0]

		if (cookieName.indexOf(upworkConfig.cookies.prefix) !== -1) {
			deleteCookie(cookieName)
		}
	}
}

/* Is cookie allowed. */
function isCookieAllowed () {
	let receiveCookies = function (event) {
		try {
			let response = JSON.parse(event.data)
			if (response.thirdParty === 'blocked') {
				if (getCookie(upworkConfig.cookies.prefix + 'cookies-consent') !== 'yes') {
					$('#alert-cookies-consent').show()
					$('#loader-overlay').remove()
				}
			}
		} catch (error) {
			console.log(error)
		}
	}
	window.addEventListener('message', receiveCookies, false)
}

/* Set query parameter. */
function setQueryParam (uri, name, value) {
	let regex = new RegExp('([?&])' + name + '=.*?(&|$)', 'i')
	let separator = uri.indexOf('?') !== -1 ? '&' : '?'
	if (uri.match(regex)) {
		return uri.replace(regex, '$1' + name + '=' + value + '$2')
	} else {
		return uri + separator + name + '=' + value
	}
}

/* Get query parameter. */
function getQueryParam (name) {
	name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]')
	let regexSring = '[\\?&]' + name + '=([^&#]*)'
	let regex = new RegExp(regexSring)
	let rerponse = regex.exec(window.location.search)
	if (rerponse === null) {
		return ''
	} else {
		return decodeURIComponent(rerponse[1].replace(/\+/g, ' '))
	}
}

/* Load the script. */
function loadScript (uri, scope, options = false, callback = null) {
	let head = document.getElementsByTagName('head')[0]
	let style = document.createElement('link')
	let script = document.createElement('script')

	if (scope === 'styles') {
		style.rel = 'stylesheet'
		style.type = 'text/css'
		style.href = uri
		style.media = 'all'
		style.setAttribute('id', options.id)
		head.appendChild(style)
	} else if (scope === 'scripts') {
		script.src = uri
		script.type = 'text/javascript'
		script.setAttribute('id', options.id)

		if (callback !== null) {
			script.onload = function () {
				callback()
			}
		}

		head.appendChild(script)
	} else if (scope === 'chatbot') {
		script.src = uri
		script.type = 'text/javascript'
		script.setAttribute('id', options.id)
		script.setAttribute('data-key', options.key)
		script.setAttribute('data-track-events', options.track)

		if (callback !== null) {
			script.onload = function () {
				callback()
			}
		}

		head.appendChild(script)
	}
}

/* Check, if debugging is enabled? */
function isDebugging () {
	if (getQueryParam('debug')) {
		setCookieForHours(upworkConfig.cookies.prefix + 'debug', true, 1)
		return true
	} else {
		if (getCookie(upworkConfig.cookies.prefix + 'debug')) {
			return true
		} else {
			return false
		}
	}
}


/* Get the url parts in array. */
let urlPartsArray = getUrlPartsArray()

jQuery(function () {
	if (getQueryParam('debug') === 'enterprise') {
		setCookieForHours(upworkConfig.cookies.prefix + 'user-enterprise-debug', true, 1)
		setCookieForHours(upworkConfig.cookies.prefix + 'user-enterprise-org', 123456789, 1)
		setCookieForHours(upworkConfig.cookies.prefix + 'user-enterprise-company-name', 'Test Company', 1)
	}
})

/* Process the suspensions for later use. */
function processSuspensions (name) {
	setCookieForDays(upworkConfig.cookies.prefix + 'legacy-suspension', true, 1)

	if (name === 379) {
		setCookieForDays(upworkConfig.cookies.prefix + 'suspensions-nonadmission', true, 1)
	}

	if (name === 359) {
		setCookieForDays(upworkConfig.cookies.prefix + 'suspensions-excessive-disputes', true, 1)
	}

	if (name === 358) {
		setCookieForDays(upworkConfig.cookies.prefix + 'suspensions-excessive-disputes', true, 1)
	}

	if (name === 357) {
		setCookieForDays(upworkConfig.cookies.prefix + 'suspensions-excessive-disputes', true, 1)
	}

	if (name === 65) {
		setCookieForDays(upworkConfig.cookies.prefix + 'suspensions-excessive-disputes', true, 1)
	}

	if (name === 110) {
		setCookieForDays(upworkConfig.cookies.prefix + 'suspensions-finance-failed-charge', true, 1)
	}

	let signalCodes = [
		110, 111, 115, 117, 118, 156, 172, 208, 211, 213, 214, 216, 217, 218, 221, 224, 303, 310, 312,
		319, 321, 323, 324, 352, 353, 354, 355, 356, 363, 364, 365, 366, 367, 368, 369, 370, 371, 373,
		374, 375, 38, 4, 413, 448, 465, 466, 478, 483, 486, 487, 5, 50, 528, 533, 539, 543, 545, 95
	]

	if (signalCodes.includes(name)) {
		setCookieForDays(upworkConfig.cookies.prefix + 'legacy-suspension', false, 1)
	}
}

/* Check, if the user suspened. */
function isUserSuspened () {
	if (
		(getCookie(upworkConfig.cookies.prefix + 'idbc-suspension') === 'true') ||
		(getCookie(upworkConfig.cookies.prefix + 'legacy-suspension') === 'true')
	) {
		return true
	} else {
		return false
	}
}

/* Check if the user is verified. */
function isUserVerified (user) {
	if (
		user.talentProfile.verifications.idVerified === true ||
		user.talentProfile.verifications.webcamVerified === true ||
		user.talentProfile.verifications.livenessVerified === true
	) {
		return true
	} else {
		return false
	}
}

/* Reset the suspensions. */
function resetSuspensions () {
	setCookieForDays(upworkConfig.cookies.prefix + 'suspensions-nonadmission', false, 1)
	setCookieForDays(upworkConfig.cookies.prefix + 'suspensions-excessive-disputes', false, 1)
	setCookieForDays(upworkConfig.cookies.prefix + 'suspensions-finance-failed-charge', false, 1)
}

/* Get Upwork Academy Info. */
function getUpworkAcademyInfo (user) {
	let academyAPIUrl = 'https://community.upwork.com/api/2.0/search?q=SELECT%20*%20FROM%20users%20WHERE%20login%20=%20%27' + user + '%27'
	$.ajax(academyAPIUrl, {
		type: 'GET',
		crossDomain: true,
		contentType: 'application/json',
		success: function (result) {
			if (result.success === 'success') {
				if (result.data.items > 0) {
					let courses = []

					for (i in result.data.items) {
						if (result.data.items[i].c_lp_11 === undefined) {
							courses.push('c_lp_11')
						}

						if (result.data.items[i].c_lp_12 === undefined) {
							courses.push('c_lp_12')
						}
					}

					if (courses.length > 0) {
						setCookieForDays(upworkConfig.cookies.prefix + 'freelancer-learning-path', courses.join(','), 1)
					} else {
						setCookieForDays(upworkConfig.cookies.prefix + 'freelancer-learning-path', 'PASSED', 1)
					}
				} else {
					setCookieForDays(upworkConfig.cookies.prefix + 'freelancer-learning-path', 'c_lp_11,c_lp_12', 1)
				}
			} else {
				setCookieForDays(upworkConfig.cookies.prefix + 'freelancer-learning-path', 'API FAILED', 1)
			}
		}
	})
}

/* Set the phone eligibility. */
function setPhoneEligibility (context) {
	if (isUserSuspened()) {
		setCookieForDays(upworkConfig.cookies.prefix + context + '-eligibility-phone', false, 1)
	} else {
		setCookieForDays(upworkConfig.cookies.prefix + context + '-eligibility-phone', true, 1)
	}
}

/* Set the chat eligibility. */
function setChatEligibility (context) {
	if (isUserSuspened()) {
		setCookieForDays(upworkConfig.cookies.prefix + context + '-eligibility-chat', false, 1)
	} else {
		setCookieForDays(upworkConfig.cookies.prefix + context + '-eligibility-chat', true, 1)
	}
}

/* Set the email eligibility. */
function setEmailEligibility (context) {
	setCookieForDays(upworkConfig.cookies.prefix + context + '-eligibility-email', true, 1)
}

/* Reset the eligibility. */
function resetEligibility () {
	resetEligibilityByContext('freelancer')
	resetEligibilityByContext('agency')
	resetEligibilityByContext('client')
}

/* Reset the eligibility by context. */
function resetEligibilityByContext (context) {
	setCookieForDays(upworkConfig.cookies.prefix + context + '-eligibility-phone', false, 1)
	setCookieForDays(upworkConfig.cookies.prefix + context + '-eligibility-chat', false, 1)
	if (context === 'freelancer') {
		setCookieForDays(upworkConfig.cookies.prefix + context + '-eligibility-email', false, 1)
	} else {
		setCookieForDays(upworkConfig.cookies.prefix + context + '-eligibility-email', true, 1)
	}
}

/* Set the chat route. */
function setChatRoute (context, value) {
	setCookieForDays(upworkConfig.cookies.prefix + context + '-chat-route', value, 1)
}

/* Reset the chat route. */
function resetChatRoute () {
	resetChatRouteByContext('freelancer')
	resetChatRouteByContext('agency')
	resetChatRouteByContext('client')
}

/* Reset the chat route by context. */
function resetChatRouteByContext (context) {
	setCookieForDays(upworkConfig.cookies.prefix + context + '-chat-route', '', 1)
}

/* Get the active contracts with LB CLs. */
function getContractsWithLBCL (data) {
	let count = 0
	for (let i in data) {
		if (data[i].node.company.segmentationInformation.segmentDetails.segmentName === 'LB') {
			count++
		}
	}
	return count
}

/* Get the user contexts. */
function getUserContexts () {
	let graphQuery = '{' +
		'user {' +
			'id' + '\n' +
			'nid' + '\n' +
			'email' + '\n' +
			'permissions(' +
				'filter: {' +
					'resourceType_eq: ORGANIZATION' + '\n' +
					'actions_any: ["get_live_agent_support"]' + '\n' +
					'limit: 5' +
				'}' +
			') {' +
				'edges {' +
					'node {' +
						'action' + '\n' +
						'access' +
					'}' +
				'}' +
			'}' +
			'talentProfile {' +
				'personalData {' +
					'firstName' + '\n' +
					'lastName' + '\n' +
					'location {' + '\n' +
						'country' +
					'}' +
				'}' +
			'}' +
		'}' +
		'companySelector {' +
			'items {' +
				'organizationId' + '\n' +
				'title' + '\n' +
				'typeTitle' +
			'}' +
		'}' +
		'organization {' +
			'flag {' +
				'agency' + '\n' +
				'client' + '\n' +
				'individual' +
			'}' +
			'subscriptionPlan {' +
				'name' +
			'}' +
		'}' +
	'}'

	$.ajax(upworkConfig.api.graphQL, {
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json',
		crossDomain: true,
		headers: {
			'Authorization': 'Bearer ' + getAccessToken(),
			'X-Upwork-API-TenantId': getCookie(upworkConfig.cookies.current_organization_uid)
		},
		data: JSON.stringify({
			query: graphQuery
		}),
		statusCode: {
			403: function () {
				if (getCookie('reset-cookies') === null) {
					setCookieForMins('reset-cookies', true, 5)
					deleteAllCookies()
					window.location = window.location.href
				} else {
					if (getCookie('reset-cookies') !== 'true') {
						setCookieForMins('reset-cookies', true, 5)
						deleteAllCookies()
						window.location = window.location.href
					}
				}
			}
		},
		success: function (result) {
			for (i in result.data.user.permissions.edges) {
				if (
					result.data.user.permissions.edges[i].node.action === 'get_live_agent_support' &&
					result.data.user.permissions.edges[i].node.access !== 'ACCESS_GRANTED'
				) {
					setCookieForDays(upworkConfig.cookies.prefix + 'idbc-suspension', true, 1)
				} else {
					setCookieForDays(upworkConfig.cookies.prefix + 'idbc-suspension', false, 1)
				}
			}

			if (result.data.organization.subscriptionPlan.name.indexOf('Enterprise') !== -1 ) {
				setCookieForDays(upworkConfig.cookies.prefix + 'current-user-context', 'enterprise', 1)
			} else {
				if (result.data.organization.flag.agency === true) {
					setCookieForDays(upworkConfig.cookies.prefix + 'current-user-context', 'agency', 1)
				} else if (result.data.organization.flag.client === true) {
					setCookieForDays(upworkConfig.cookies.prefix + 'current-user-context', 'client', 1)
				} else if (result.data.organization.flag.individual === true) {
					setCookieForDays(upworkConfig.cookies.prefix + 'current-user-context', 'freelancer', 1)
				}
			}

			let userInfo = {
				'username': result.data.user.nid,
				'useremail': result.data.user.email,
				'firstname': result.data.user.talentProfile.personalData.firstName,
				'lastname': result.data.user.talentProfile.personalData.lastName,
				'country': result.data.user.talentProfile.personalData.location.country
			}
			setCookieForDays(upworkConfig.cookies.prefix + 'user-info', JSON.stringify(userInfo), 1)

			let userID = result.data.user.id
			let organizationID
			let organizationType
			let hasUserContexts = []
			let countContexts = 0

			setCookieForDays(upworkConfig.cookies.prefix + 'user', userID, 1)
			resetSuspensions()
			resetEligibility()
			resetChatRoute()

			if (JSON.parse(getCookie(upworkConfig.cookies.prefix + 'has-user-contexts')) !== null) {
				hasUserContexts = JSON.parse(getCookie(upworkConfig.cookies.prefix + 'has-user-contexts'))
			} else {
				hasUserContexts = {
					'freelancer': false,
					'agency': false,
					'client': false,
					'enterprise': false
				}
			}

			for (let i in result.data.companySelector.items) {
				organizationID = result.data.companySelector.items[i].organizationId
				organizationType = result.data.companySelector.items[i].typeTitle

				if (organizationType === 'Freelancer') {
					hasUserContexts.freelancer = true
					setCookieForDays(upworkConfig.cookies.prefix + 'user-freelancer-org', organizationID, 1)
				} else if (organizationType === 'Agency') {
					hasUserContexts.agency = true
					setCookieForDays(upworkConfig.cookies.prefix + 'user-agency-org', organizationID, 1)
				} else if (organizationType === 'Client') {
					hasUserContexts.client = true
					setCookieForDays(upworkConfig.cookies.prefix + 'user-client-org', organizationID, 1)
				} else if (organizationType.indexOf('Enterprise') !== -1) {
					hasUserContexts.enterprise = true
					setCookieForDays(upworkConfig.cookies.prefix + 'user-enterprise-org', organizationID, 1)
					setCookieForDays(upworkConfig.cookies.prefix + 'user-enterprise-company-name', result.data.companySelector.items[i].title, 1)
				} else if (getCookie(upworkConfig.cookies.prefix + 'user-enterprise-debug') === 'true') {
					hasUserContexts.enterprise = true
				}
			}

			setCookieForDays(upworkConfig.cookies.prefix + 'has-user-contexts', JSON.stringify(hasUserContexts), 1)

			for (let i in result.data.companySelector.items) {
				organizationID = result.data.companySelector.items[i].organizationId
				organizationType = result.data.companySelector.items[i].typeTitle

				if (organizationType === 'Freelancer') {
					getFLUserInfo(userID)
				} else if (organizationType === 'Agency') {
					getAGUserInfo(organizationID)
				} else if (organizationType === 'Client') {
					getCLUserInfo(organizationID)
				} else if (organizationType.indexOf('Enterprise') !== -1) {
					getENTUserInfo(organizationID)
				}

				countContexts++
			}

			setCookieForMins(upworkConfig.cookies.prefix + 'contexts-checks', countContexts, 2)

			clickPopularTopicNavTabDefault()
		}
	})
}

/* Get the freelancer user info. */
function getFLUserInfo (userID) {
	let graphQuery = '{' +
		'user {' +
			'freelancerProfile {' +
				'aggregates {' +
					'totalEarnings {' +
						'displayValue' +
					'}' +
				'}' +
			'}' +
			'talentProfile {' +
				'vetted' + '\n' +
				'verifications {' +
					'idVerified' + '\n' +
					'webcamVerified' + '\n' +
					'livenessVerified' +
				'}' +
				'profileAggregates {' +
					'topRatedPlusStatus' + '\n' +
					'topRatedStatus' + '\n' +
					'profileStats {' +
						'totalCharge360' +
					'}' +
				'}' +
				'profileStatsExt {' +
					'totalCharge90 {' +
						'displayValue' +
					'}' +
				'}' +
			'}' +
			'offer(' +
				'pagination: { after: "0", first: 50 }' +
				'offerForFreelancerFilter: { ' +
					'commonFilter: {' +
						'states_any: [Active, Pending]' +
					'}' +
				'}' +
				'sortAttribute: {' +
					'field: "Team",' +
					'sortOrder: ASC' +
				'}' +
			') {' +
				'totalCount' + '\n' +
				'edges {' +
					'node {' +
						'company {' +
							'segmentationInformation {' +
								'segmentDetails {' +
									'segmentName' +
								'}' +
							'}' +
						'}' +
					'}' +
				'}' +
			'}' +
		'}' +
		'activeSuspensionsForUser(userId: ' + userID + ') {' +
			'shortCode' +
		'}' +
	'}'

	$.ajax(upworkConfig.api.graphQL, {
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json',
		crossDomain: true,
		headers: {
			'Authorization': 'Bearer ' + getAccessToken()
		},
		data: JSON.stringify({
			query: graphQuery
		}),
		success: function (result) {
			setChatRoute('freelancer', 'LI_Freelancer_Support_CX410')
			setCookieForDays(upworkConfig.cookies.prefix + 'freelancer-verified', false, 1)
			setCookieForDays(upworkConfig.cookies.prefix + 'freelancer-has-earnings', false, 1)
			setCookieForDays(upworkConfig.cookies.prefix + 'freelancer-has-active-contact', false, 1)

			for (i in result.data.activeSuspensionsForUser) {
				processSuspensions(result.data.activeSuspensionsForUser[i].shortCode)
			}

			if (result.data.user.freelancerProfile.aggregates.totalEarnings.displayValue > 0) {
				setEmailEligibility('freelancer')

				setChatRoute('freelancer', 'Freelancer_Support_CX410')

				setCookieForDays(upworkConfig.cookies.prefix + 'freelancer-has-earnings', true, 1)
			}

			if (isUserVerified(result.data.user)) {
				setEmailEligibility('freelancer')

				setChatRoute('freelancer', 'Freelancer_Support_CX410')

				setCookieForDays(upworkConfig.cookies.prefix + 'freelancer-verified', true, 1)
			}

			if (result.data.user.offer.totalCount > 0) {
				setEmailEligibility('freelancer')

				setChatRoute('freelancer', 'Freelancer_Support_CX410')

				setCookieForDays(upworkConfig.cookies.prefix + 'freelancer-has-active-contact', true, 1)
			}

			if (result.data.user.talentProfile.profileAggregates.profileStats.totalCharge360 !== null) {
				if (result.data.user.talentProfile.profileAggregates.profileStats.totalCharge360.displayValue > 0) {
					setEmailEligibility('freelancer')

					setChatRoute('freelancer', 'Freelancer_Support_CX410')
				}
			}

			if (getContractsWithLBCL(result.data.user.offer.edges) > 0) {
				setPhoneEligibility('freelancer')
				setChatEligibility('freelancer')
				setEmailEligibility('freelancer')

				setChatRoute('freelancer', 'Freelancer_Support_CX410')
			}

			if (result.data.user.talentProfile.vetted === true) {
				setPhoneEligibility('freelancer')
				setChatEligibility('freelancer')
				setEmailEligibility('freelancer')

				setChatRoute('freelancer', 'HV_Freelancer_Support_CX410')
			} else if (result.data.user.talentProfile.profileAggregates.topRatedPlusStatus === 'top_rated_plus') {
				setPhoneEligibility('freelancer')
				setChatEligibility('freelancer')
				setEmailEligibility('freelancer')

				setChatRoute('freelancer', 'HV_Freelancer_Support_CX410')
			} else if (result.data.user.talentProfile.profileAggregates.topRatedStatus === 'top_rated') {
				setPhoneEligibility('freelancer')
				setChatEligibility('freelancer')
				setEmailEligibility('freelancer')

				setChatRoute('freelancer', 'HV_Freelancer_Support_CX410')
			} else if (result.data.user.talentProfile.profileAggregates.topRatedStatus === 'hipo') {
				setEmailEligibility('freelancer')

				setChatRoute('freelancer', 'Freelancer_Support_CX410')
			}

			if (result.data.user.talentProfile.profileStatsExt.totalCharge90 !== null) {
				if (result.data.user.talentProfile.profileStatsExt.totalCharge90.displayValue > 3000) {
					setChatEligibility('freelancer')
					setEmailEligibility('freelancer')

					setChatRoute('freelancer', 'HV_Freelancer_Support_CX410')
				}
			}

			let getUserInfo = JSON.parse(getCookie(upworkConfig.cookies.prefix + 'user-info'))
			if (getCookie(upworkConfig.cookies.prefix + 'freelancer-chat-route') === 'LI_Freelancer_Support_CX410') {
				getUpworkAcademyInfo(getUserInfo.username)
			} else {
				setCookieForDays(upworkConfig.cookies.prefix + 'freelancer-learning-path', 'NOTAPPLICABLE', 1)
			}

			let contextsChecks = getCookie(upworkConfig.cookies.prefix + 'contexts-checks')
			if (contextsChecks > 1) {
				contextsChecks--
				setCookieForMins(upworkConfig.cookies.prefix + 'contexts-checks', contextsChecks, 2)
			} else {
				setupChatbotUserMeta()
			}
		}
	})
}

/* Get the agency user info. */
function getAGUserInfo (organizationID) {
	let graphQuery = '{' +
		'activeSuspensionsForOrganization(organizationId: ' + organizationID + ') {' +
			'shortCode' +
		'}' +
		'organization {' +
			'agencyProfile(id: "' + organizationID + '") {' +
				'earningAggregates {' +
					'totalCharge90 {' +
						'displayValue' +
					'}' +
				'}' +
			'}' +
			'company {' +
				'agencyDetails {' +
					'vetted' + '\n' +
					'topRatedPlusStatus' + '\n' +
					'topRatedStatus' + '\n' +
				'}' +
			'}' +
			'agencyOffers(' +
				'pagination: { after: "0", first: 50 }' +
				'offerByRootCompanyFilter: {' +
					'commonFilter: {' +
						'states_any: [Active, Pending]' +
					'}' +
				'},' +
				'sortAttribute: {' +
					'field: "Team",' +
					'sortOrder: ASC' +
				'}' +
			') {' +
				'totalCount' + '\n' +
				'edges {' +
					'node {' +
						'company {' +
							'segmentationInformation {' +
								'segmentDetails {' +
									'segmentName' +
								'}' +
							'}' +
						'}' +
					'}' +
				'}' +
			'}' +
		'}' +
	'}'

	$.ajax(upworkConfig.api.graphQL, {
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json',
		crossDomain: true,
		headers: {
			'Authorization': 'Bearer ' + getAccessToken(),
			'X-Upwork-API-TenantId': organizationID
		},
		data: JSON.stringify({
			query: graphQuery
		}),
		success: function (result) {
			setChatRoute('agency', 'Freelancer_Support_CX410')

			for (i in result.data.activeSuspensionsForOrganization) {
				processSuspensions(result.data.activeSuspensionsForOrganization[i].shortCode)
			}

			if (result.data.organization.company.agencyDetails !== null) {
				if (result.data.organization.company.agencyDetails.vetted === true) {
					setPhoneEligibility('agency')
					setChatEligibility('agency')
					setEmailEligibility('agency')

					setChatRoute('agency', 'HV_Freelancer_Support_CX410')
				} else if (result.data.organization.company.agencyDetails.topRatedPlusStatus === 'top_rated_plus') {
					setPhoneEligibility('agency')
					setChatEligibility('agency')
					setEmailEligibility('agency')

					setChatRoute('agency', 'HV_Freelancer_Support_CX410')
				} else if (result.data.organization.company.agencyDetails.topRatedStatus === 'top_rated') {
					setPhoneEligibility('agency')
					setChatEligibility('agency')
					setEmailEligibility('agency')

					setChatRoute('agency', 'HV_Freelancer_Support_CX410')
				} else if (result.data.organization.company.agencyDetails.topRatedStatus === 'hipo') {
					setEmailEligibility('agency')
				}
			}

			if (getContractsWithLBCL(result.data.organization.agencyOffers.totalCount) > 0) {
				setPhoneEligibility('agency')
				setChatEligibility('agency')
				setEmailEligibility('agency')
			}

			if (result.data.organization.agencyProfile !== null) {
				if (result.data.organization.agencyProfile.earningAggregates.totalCharge90 !== null) {
					if (result.data.organization.agencyProfile.earningAggregates.totalCharge90.displayValue > 3000) {
						setChatEligibility('agency')
						setEmailEligibility('agency')

						setChatRoute('agency', 'HV_Freelancer_Support_CX410')
					}
				}

				if (result.data.organization.agencyProfile.earningAggregates.totalCharge90 !== null) {
					if (result.data.organization.agencyProfile.earningAggregates.totalCharge90.displayValue > 3000) {
						setEmailEligibility('agency')
					}
				}
			}

			if (result.data.organization.agencyOffers.totalCount > 0) {
				setEmailEligibility('agency')
			}

			let contextsChecks = getCookie(upworkConfig.cookies.prefix + 'contexts-checks')
			if (contextsChecks > 1) {
				contextsChecks--
				setCookieForMins(upworkConfig.cookies.prefix + 'contexts-checks', contextsChecks, 2)
			} else {
				setupChatbotUserMeta()
			}
		}
	})
}

/* Get the client user info. */
function getCLUserInfo (organizationID) {
	setPhoneEligibility('client')
	setChatEligibility('client')
	setEmailEligibility('client')

	let graphQuery = '{' +
		'activeSuspensionsForOrganization(organizationId: ' + organizationID + ') {' +
			'shortCode' +
		'}' +
		'organization {' +
			'subscriptionPlan {' +
				'name' +
			'}' +
			'segmentationInformation {' +
				'segmentDetails {' +
					'segmentName' +
				'}' +
			'}' +
			'clientOffers(' +
				'pagination: { after: "0", first: 50 }' +
				'sortAttribute: {' +
					'field: "Team",' +
					'sortOrder: ASC' +
				'}' +
			') {' +
				'totalCount' +
			'}' +
		'}' +
	'}'

	$.ajax(upworkConfig.api.graphQL, {
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json',
		crossDomain: true,
		headers: {
			'Authorization': 'Bearer ' + getAccessToken(),
			'X-Upwork-API-TenantId': organizationID
		},
		data: JSON.stringify({
			query: graphQuery
		}),
		success: function (result) {
			for (i in result.data.activeSuspensionsForOrganization) {
				processSuspensions(result.data.activeSuspensionsForOrganization[i].shortCode)
			}

			if (result.data.organization.segmentationInformation.segmentDetails.segmentName === 'LB') {
				setChatRoute('client', 'Premium_Support_CX410')
			} else if (result.data.organization.segmentationInformation.segmentDetails.segmentName === 'MM') {
				setChatRoute('client', 'Premium_Support_CX410')
			} else if (result.data.organization.segmentationInformation.segmentDetails.segmentName === 'SB') {
				setChatRoute('client', 'Premium_Support_CX410')
			} else {
				setChatRoute('client', 'Client_Support_CX410')
			}

			let contextsChecks = getCookie(upworkConfig.cookies.prefix + 'contexts-checks')
			if (contextsChecks > 1) {
				contextsChecks--
				setCookieForMins(upworkConfig.cookies.prefix + 'contexts-checks', contextsChecks, 2)
			} else {
				setupChatbotUserMeta()
			}
		}
	})
}

/* Get the enterprise client user info. */
function getENTUserInfo (organizationID) {
	setPhoneEligibility('client')
	setChatEligibility('client')
	setEmailEligibility('client')

	let graphQuery = '{' +
		'activeSuspensionsForOrganization(organizationId: ' + organizationID + ') {' +
			'shortCode' +
		'}' +
		'organization {' +
			'subscriptionPlan {' +
				'name' +
			'}' +
			'segmentationInformation {' +
				'segmentDetails {' +
					'segmentName' +
				'}' +
			'}' +
			'clientOffers(' +
				'pagination: { after: "0", first: 50 }' +
				'sortAttribute: {' +
					'field: "Team",' +
					'sortOrder: ASC' +
				'}' +
			') {' +
				'totalCount' +
			'}' +
		'}' +
	'}'

	$.ajax(upworkConfig.api.graphQL, {
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json',
		crossDomain: true,
		headers: {
			'Authorization': 'Bearer ' + getAccessToken(),
			'X-Upwork-API-TenantId': organizationID
		},
		data: JSON.stringify({
			query: graphQuery
		}),
		success: function (result) {
			for (i in result.data.activeSuspensionsForOrganization) {
				processSuspensions(result.data.activeSuspensionsForOrganization[i].shortCode)
			}

			if (result.data.organization.subscriptionPlan.name.indexOf('Enterprise') !== -1 ) {
				let enterpriseSubscriptionPlans = [
					'Enterprise Business',
					'Enterprise Standard',
					'Enterprise Compliance',
					'Enterprise WPP'
				]

				if (enterpriseSubscriptionPlans.includes(result.data.organization.subscriptionPlan.name)) {
					if (! isUserInternal()) {
						enterpriseLandingPage()
					}
				}

				setChatRoute('client', 'Premium_Support_CX410')
			} else {
				setChatRoute('client', 'Client_Support_CX410')
			}

			let contextsChecks = getCookie(upworkConfig.cookies.prefix + 'contexts-checks')
			if (contextsChecks > 1) {
				contextsChecks--
				setCookieForMins(upworkConfig.cookies.prefix + 'contexts-checks', contextsChecks, 2)
			} else {
				setupChatbotUserMeta()
			}
		}
	})
}

jQuery(function () {
	if (hasAccessToken() && getCookie(upworkConfig.cookies.current_organization_uid) !== null) {
		getUserContexts()

		setTimeout(function () {
			if (window.upworkHelp === undefined) {
				fallbackChatbotUserMeta()
			}
		}, 3000)
	}

	if (!isUserAnonymous()) {
		if (isUserInternal()) {
			dataLayer.push({ 'ZDUserRole': 'agent' })
		} else {
			dataLayer.push({ 'ZDUserRole': 'end_user' })
		}
		let userTypeTag = HelpCenter.user.tags
		dataLayer.push({ 'UserTypeTag': userTypeTag.join(', ') })

		$('.link-support-requests').attr('href', zdBrands.main.hc.url + '/requests')
	}
})

const awsBucket = {
	'baseURL': 'https://assets.static-upwork.com/helpcenter/air2.75'
}

var oAuthConfig = {
	'authorizePath': '/ab/account-security/oauth2/authorize',
	'tokenPath': '/v3/oauth2/token'
}

/* Check, if has valid access token. */
function hasAccessToken () {
	if (getCookie(upworkConfig.cookies.prefix + 'oauth2-access-token') !== null) {
		return true
	} else {
		return false
	}
}

/* Check, if has valid refresh token. */
function hasRefreshToken () {
	if (getCookie(upworkConfig.cookies.prefix + 'oauth2-refresh-token') !== null) {
		return true
	} else {
		return false
	}
}

/* Get access token. */
function getAccessToken () {
	if (getCookie(upworkConfig.cookies.prefix + 'oauth2-access-token') !== null) {
		return getCookie(upworkConfig.cookies.prefix + 'oauth2-access-token')
	} else {
		return false
	}
}

/* Get authorization code. */
function getAuthorizationCode () {
	var paramArray = {
		'response_type': 'code',
		'client_id': upworkConfig.oauth.clientID,
		'redirect_uri': encodeURI(upworkConfig.oauth.redirectURL)
	}

	var params = '?'
	params += 'response_type=' + paramArray.response_type + '&'
	params += 'client_id=' + paramArray.client_id + '&'
	params += 'redirect_uri=' + paramArray.redirect_uri

	sessionStorage.upworkAuthReturnURL = window.location

	window.location = upworkConfig.url + oAuthConfig.authorizePath + params
}

/* Get access token by auth code. */
function getAccessTokenByCode () {
	var apiParams = {
		'grant_type': 'authorization_code',
		'code': getQueryParam('code'),
		'client_id': upworkConfig.oauth.clientID,
		'client_secret': upworkConfig.oauth.clientSecret,
		'redirect_uri': encodeURI(upworkConfig.oauth.redirectURL)
	}

	$.ajax(upworkConfig.api.baseURL + oAuthConfig.tokenPath, {
		type: 'POST',
		data: apiParams,
		dataType: 'json',
		contentType: 'application/x-www-form-urlencoded',
		crossDomain: true,
		success: function (data) {
			setCookieForDays(upworkConfig.cookies.prefix + 'oauth2-access-token', data.access_token, 1)
			setCookieForDays(upworkConfig.cookies.prefix + 'oauth2-refresh-token', data.refresh_token, 14)
			setCookieForDays(upworkConfig.cookies.prefix + 'oauth2-refresh-token-expires', data.expires_in, 14)
			if (sessionStorage.upworkAuthReturnURL) {
				window.location = sessionStorage.upworkAuthReturnURL
				sessionStorage.removeItem('upworkAuthReturnURL')
			} else {
				window.location.reload()
			}
		}
	})
}

/* Get access token by refresh token. */
function getAccessTokenByToken () {
	var apiParams = {
		'grant_type': 'refresh_token',
		'refresh_token': getCookie(upworkConfig.cookies.prefix + 'oauth2-refresh-token'),
		'client_id': upworkConfig.oauth.clientID,
		'client_secret': upworkConfig.oauth.clientSecret
	}

	$.ajax(upworkConfig.api.baseURL + oAuthConfig.tokenPath, {
		type: 'POST',
		data: apiParams,
		dataType: 'json',
		contentType: 'application/x-www-form-urlencoded',
		crossDomain: true,
		success: function (data) {
			setCookieForDays(upworkConfig.cookies.prefix + 'oauth2-access-token', data.access_token, 1)
			setCookieForDays(upworkConfig.cookies.prefix + 'oauth2-refresh-token', data.refresh_token, 14)
			setCookieForDays(upworkConfig.cookies.prefix + 'oauth2-refresh-token-expires', data.expires_in, 14)
			if (sessionStorage.upworkAuthReturnURL) {
				window.location = sessionStorage.upworkAuthReturnURL
				sessionStorage.removeItem('upworkAuthReturnURL')
			} else {
				window.location.reload()
			}
		}
	})
}

/* Setup oauth2 functionalities. */
function oAuthSetup () {
	if (hasAccessToken() === false) {
		if (hasRefreshToken() === false) {
			if (getQueryParam('code')) {
				getAccessTokenByCode()
			} else {
				getAuthorizationCode()
			}
		} else {
			getAccessTokenByToken()
		}
	}
}

jQuery(function () {
	if (isUserAnonymous()) {
		$('.link-log-in').attr('data-target', '/hc/en-us/signin?return_to=' + encodeURI(window.location))

		deleteAllCookies()
	} else {
		$('#mobileUserNavDropdown').text(HelpCenter.user.name)

		$('.link-log-out').attr('href', '/access/logout?return_to=' + encodeURI(window.location))

		if (hasAccessToken()) {
			$.ajax(upworkConfig.api.baseURL + '/auth/v1/info.json', {
				type: 'GET',
				dataType: 'json',
				contentType: 'application/json',
				crossDomain: true,
				headers: {
					'Authorization': 'Bearer ' + getAccessToken()
				},
				success: function (data) {
					dataLayer.push({
						'event': 'profile_id',
						'UpworkUID': data.info.profile_url
					})
				}
			})
		}
	}


	$('.link-log-in').click(function () {
		window.location = $(this).attr('data-target')
	})
})

/* Check, if user tag exists. */
function isUserTagExists (tag) {
	if ($.isArray(tag)) {
		let flag = false
		for (let i in tag) {
			for (let j in HelpCenter.user.tags) {
				if (tag[i] === HelpCenter.user.tags[j]) {
					flag = true
				}
			}
		}
		if (flag === true) {
			return true
		} else {
			return false
		}
	} else {
		return $.inArray(tag, HelpCenter.user.tags) !== -1
	}
}

/* Check, if user belongs to specific group. */
function isUserGroup (group) {
	return HelpCenter.user.groups.some((userGroup) => userGroup.name === group)
}

/* Check, if user anonymous. */
function isUserAnonymous () {
	return HelpCenter.user.role === 'anonymous'
}

/* Check, if user Upwork Corp. */
function isUserUpworkCorp () {
	let getUserInfo = JSON.parse(getCookie(upworkConfig.cookies.prefix + 'user-info'))

	if (getUserInfo !== null) {
		if (/@upwork.com\s*$/.test(getUserInfo.useremail)) {
			return true
		} else if (/@cloud.upwork.com\s*$/.test(getUserInfo.useremail)) {
			return true
		} else {
			return false
		}
	} else {
		return false
	}
}

/* Check, if user agent. */
function isUserAgent () {
	let internalRoles = ['agent', 'manager']

	return internalRoles.includes(HelpCenter.user.role)
}

/* Check, if user internal. */
function isUserInternal () {
	if (isUserUpworkCorp() || isUserAgent()) {
		return true
	} else {
		return false
	}
}

/* Check, if user CL. */
function isUserClient () {
	if (getCurrentUserContext() === 'client') {
		return true
	} else {
		if (isUserTagExists('tag_primary_client')) {
			return true
		} else {
			return false
		}
	}
}

/* Check, if user agency. */
function isUserAgency () {
	if (getCurrentUserContext() === 'agency') {
		return true
	} else {
		if (isUserTagExists('tag_primary_agency')) {
			return true
		} else {
			return false
		}
	}
}

/* Check, if user FL. */
function isUserFreelancer () {
	if (getCurrentUserContext() === 'freelancer') {
		return true
	} else {
		if (isUserTagExists('tag_primary_freelancer')) {
			return true
		} else {
			return false
		}
	}
}

/* Check, if user enterprise CL / FL. */
function isUserEnterprise () {
	if (getCurrentUserContext() === 'enterprise') {
		return true
	} else {
		if (
			isUserTagExists('tag_cl_vsbplus') ||
			isUserTagExists('tag_cl_small_business') ||
			isUserTagExists('tag_cl_mid_market') ||
			isUserTagExists('tag_cl_large_business')
		) {
			return true
		} else {
			return false
		}
	}
}

/* Get, the primary user type. */
function getPrimaryUserType () {
	if (isUserEnterprise()) {
		return 'EN'
	} else if (isUserClient()) {
		return 'CL'
	} else if (isUserAgency()) {
		return 'AG'
	} else if (isUserFreelancer()) {
		return 'FL'
	} else {
		return 'FL'
	}
}

/* Get current user context. */
function isUserSyncDone () {
	if (getCookie(upworkConfig.cookies.prefix + 'user-sync')) {
		return true
	} else {
		return false
	}
}

/* Get current user context. */
function getCurrentUserContext () {
	return getCookie(upworkConfig.cookies.prefix + 'current-user-context')
}

/* Check, is limited admission. */
function isLimitedAdmission () {
	if (getCookie(upworkConfig.cookies.prefix + 'suspensions-nonadmission') === 'true') {
		return true
	} else {
		return false
	}
}

/* Check, is unsuccessful FL. */
function isUnsuccessfulFL () {
	if (getCookie(upworkConfig.cookies.prefix + 'suspensions-excessive-disputes') === 'true') {
		return true
	} else {
		return false
	}
}

/* Check, is financial hold. */
function isFinancialHold () {
	if (getCookie(upworkConfig.cookies.prefix + 'suspensions-finance-failed-charge') === 'true') {
		return true
	} else {
		return false
	}
}

/* Get the phone eligibility. */
function getPhoneEligibility (context) {
	return getCookie(upworkConfig.cookies.prefix + context + '-eligibility-email')
}

/* Get the chat eligibility. */
function getChatEligibility (context) {
	return getCookie(upworkConfig.cookies.prefix + context + '-eligibility-chat')
}

/* Get the email eligibility. */
function getEmailEligibility (context) {
	return getCookie(upworkConfig.cookies.prefix + context + '-eligibility-email')
}

/* Get the chat route. */
function getChatRoute (context) {
	return getCookie(upworkConfig.cookies.prefix + context + '-chat-route')
}

/* Format date - MDY */
function formatDateMDY (date) {
	let dateString = new Date(date)
	const month = dateString.getUTCMonth() + 1
	const day = dateString.getUTCDate()
	const year = dateString.getUTCFullYear()

	return date !== undefined ? `${month}-${day}-${year}` : 'N/A'
}

/* Format date - YMD in PST */
function formatDateYMDPST (date) {
	let dateString = new Date(date)

	const year = dateString.toLocaleString('en-US', {
		timeZone: 'America/Los_Angeles',
		year: 'numeric'
	})

	const month = dateString.toLocaleString('en-US', {
		timeZone: 'America/Los_Angeles',
		month: '2-digit'
	})

	const day = dateString.toLocaleString('en-US', {
		timeZone: 'America/Los_Angeles',
		day: '2-digit'
	})

	return date !== undefined ? `${year}-${month}-${day}` : 'N/A'
}

/* Format date time. */
function formatDateTime (date) {
	let dateString = new Date(date)
	let todayString = new Date()

	let returnDateString = ''

	let weekdayArray = []
	weekdayArray[0] = 'Sunday'
	weekdayArray[1] = 'Monday'
	weekdayArray[2] = 'Tuesday'
	weekdayArray[3] = 'Wednesday'
	weekdayArray[4] = 'Thursday'
	weekdayArray[5] = 'Friday'
	weekdayArray[6] = 'Saturday'

	let monthArray = []
	monthArray[0] = 'January'
	monthArray[1] = 'February'
	monthArray[2] = 'March'
	monthArray[3] = 'April'
	monthArray[4] = 'May'
	monthArray[5] = 'June'
	monthArray[6] = 'July'
	monthArray[7] = 'August'
	monthArray[8] = 'September'
	monthArray[9] = 'October'
	monthArray[10] = 'November'
	monthArray[11] = 'December'

	let days = dateString.getDate()
	let todayDay = todayString.getDate()

	let timeDifference = todayString - dateString
	let diffDays = parseInt(timeDifference / (1000*60*60*24))

	let hoursString = dateString.getHours()

	let minutesString = dateString.getMinutes()
	if (minutesString < 10) {
		minutesString = '0' + minutesString
	}

	if (days === todayDay) {
		returnDateString = 'Today at ' + hoursString + ':' + minutesString
	} else {
		if (diffDays <= 7) {
			let weekdays = weekdayArray[dateString.getDay()]
			returnDateString = weekdays + ' at ' + hoursString + ':' + minutesString
		} else if (diffDays > 7) {
			let monthsString = monthArray[dateString.getMonth()]
			returnDateString = monthsString + ' ' + dateString.getDate() + ', ' + dateString.getFullYear() + ' ' + hoursString + ':' + minutesString
		}
	}

	return returnDateString
}

/* Apply throttle rules for chatbot. */
function applyThrottles () {
	if (isUserAnonymous()) {
		if (
			detectPageTemplates('home') ||
			detectPageTemplates('categories') ||
			detectPageTemplates('sections') ||
			detectPageTemplates('articles') ||
			detectPageTemplates('search')
		) {
			$('.support-bot-widget').removeClass('support-bot-widget-default')
		} else if (detectPageTemplates('request-new')) {
			if (getQueryParam('ticket_form_id')) {
				if (parseInt(getQueryParam('ticket_form_id')) === defaultForm.form) {
					$('.support-bot-widget-default').remove()
				} else {
					$('.support-bot-widget').removeClass('support-bot-widget-default')
				}
			}
		} else {
			$('.support-bot-widget-default').remove()
		}
	} else {
		if (
			getCookie(upworkConfig.cookies.prefix + 'user-enterprise-org') !== null ||
			isUserTagExists('tag_suspended_accounting_company_suspended_auto') ||
			isUserTagExists('tag_suspended_excessive_disputes_mq')
		) {
			$('.support-bot-widget-default').remove()
		} else {
			if (
				detectPageTemplates('home') ||
				detectPageTemplates('categories') ||
				detectPageTemplates('sections') ||
				detectPageTemplates('articles') ||
				detectPageTemplates('search')
			) {
				$('.support-bot-widget').removeClass('support-bot-widget-default')
			} else if (detectPageTemplates('request-new')) {
				if (getQueryParam('ticket_form_id')) {
					if (parseInt(getQueryParam('ticket_form_id')) === defaultForm.form) {
						$('.support-bot-widget-default').remove()
					} else {
						$('.support-bot-widget').removeClass('support-bot-widget-default')
					}
				} else {
					$('.support-bot-widget').removeClass('support-bot-widget-default')
				}
			} else {
				$('.support-bot-widget-default').remove()
			}
		}
	}
	
	// Hide chatbox button by default
	$("#support-bot-widget").hide();
}

/* Update webinar link. */
function updateWebinarLink () {
	if (getCookie(upworkConfig.cookies.prefix + 'user-tab')) {
		if (
			getCookie(upworkConfig.cookies.prefix + 'user-tab') === 'freelancer' ||
			getCookie(upworkConfig.cookies.prefix + 'user-tab') === 'agency' ||
			getCookie(upworkConfig.cookies.prefix + 'user-tab') === 'agent'
		) {
			$('.nav-link-webinars').attr('href', 'https://www.upwork.com/community/events')
		} else if (
			getCookie(upworkConfig.cookies.prefix + 'user-tab') === 'client' ||
			getCookie(upworkConfig.cookies.prefix + 'user-tab') === 'enterprise'
		) {
			$('.nav-link-webinars').attr('href', 'https://www.upwork.com/webinars')
		}
	}
}

jQuery(function () {
	updateWebinarLink()
})

/* Verify URL nonce. */
function verifyURLNonce () {
	if (getQueryParam('nonce')) {
		let toDayNow = new Date()

		if (toDayNow.getTime() >= getQueryParam('nonce')) {
			window.location.href = zdBrands.main.hc.url
		}
	} else {
		window.location.href = zdBrands.main.hc.url
	}
}

jQuery(function () {
	if (
		detectPageTemplates('sections') ||
		detectPageTemplates('articles')
	) {
		$('.breadcrumbs li').last().remove()
	}
})

/* Add the responsive alert message. */
function addResponsiveAlert () {
	if ($('#alert-settings').text() !== '') {
		let alertSettings = JSON.parse($('#alert-settings').text())
		let currentTime = new Date().getTime()

		let responsiveAlertMessage,
			responsiveAlertIcon,
			responsiveAlertCountry,
			responsiveAlertUserType,
			responsiveAlertStart,
			responsiveAlertEnd

		let responsiveAlertFlag = true

		if (alertSettings.responsive.length > 0) {
			if (getCookie(upworkConfig.cookies.prefix + 'user-info')) {
				let userInfo = JSON.parse(getCookie(upworkConfig.cookies.prefix + 'user-info'))
				let userContexts = JSON.parse(getCookie(upworkConfig.cookies.prefix + 'has-user-contexts'))
				let userCountry = userInfo.country.toLowerCase()

				for (let i in alertSettings.responsive) {
					responsiveAlertFlag = true
					responsiveAlertMessage = alertSettings.responsive[i].message.trim()
					responsiveAlertIcon = alertSettings.responsive[i].icon.trim()
					responsiveAlertCountry = alertSettings.responsive[i].country.trim().toLowerCase()
					responsiveAlertUserType = alertSettings.responsive[i].usertype.trim().toLowerCase()
					responsiveAlertStart = alertSettings.responsive[i].start.trim() !== '' ? new Date(alertSealertSettings.responsive[i].start.trim()) : new Date().getTime()
					responsiveAlertEnd = alertSettings.responsive[i].end.trim() !== '' ? (new Date(alertSettings.global.end.trim()).getTime() + (24 * 60 * 60 * 1000)) : new Date('12/31/2050').getTime()

					if (responsiveAlertMessage === '') {
						responsiveAlertFlag = responsiveAlertFlag && false
					}

					if (!(currentTime >= responsiveAlertStart && currentTime < responsiveAlertEnd)) {
						responsiveAlertFlag = responsiveAlertFlag && false
					}

					if (responsiveAlertCountry !== 'all' && responsiveAlertCountry !== '') {

						if (responsiveAlertCountry !== userCountry) {
							responsiveAlertFlag = responsiveAlertFlag && false
						}
					}

					if (responsiveAlertUserType !== 'all') {
						if (userContexts[responsiveAlertUserType] === false) {
							responsiveAlertFlag = responsiveAlertFlag && false
						}
					}


					if (responsiveAlertFlag) {
						$('#section-alert .row > div').append(addAlert('responsive_alert', responsiveAlertMessage, responsiveAlertIcon))
					}
				}
			}
		}
	}
}

/* Setup the responsive alert message. */
function setupResponsiveAlert () {
	if (isUserSyncDone()) {
		addResponsiveAlert()
	} else {
		setTimeout(function () {
			setupResponsiveAlert()
		}, 1000)
	}
}

/* Add the alert message. */
function addAlert (identifier, message, scope) {
	switch (scope) {
		case 'info':
			var alertScope = 'alert-info'
			break
		case 'success':
			var alertScope = 'alert-success'
			break
		case 'danger':
			var alertScope = 'alert-danger'
			break
		case 'warning':
			var alertScope = 'alert-warning'
			break
	}
	dataLayer.push({
		'event': 'alert_displayed',
		'alert_name': identifier
	})

	var output = []
	output.push('<div class="alert ' + alertScope + '" role="alert">')
		output.push('<div class="alert-icon"><span></span></div>')
		output.push('<div class="alert-message">')
		output.push(message)
		output.push('</div>')
		output.push('<button class="close" type="button" data-bs-dismiss="alert" aria-label="Close">')
			output.push('<span class="icon-svg-close " aria-hidden="true"></span>')
		output.push('</button>')
	output.push('</div>')

	$('#section-alert').show()

	return output.join('')
}

/* Setup the global alert message. */
function setupGlobalAlert () {
	if ($('#alert-settings').text() !== '') {
		let alertSettings = JSON.parse($('#alert-settings').text())

		let globalAlertMessage = alertSettings.global.message.trim()
		let globalAlertIcon = alertSettings.global.icon.trim()
		let currentTime = new Date().getTime()
		let globalAlertStart = alertSettings.global.start.trim() !== '' ? new Date(alertSettings.global.start.trim()).getTime() : new Date().getTime()
		let globalAlertEnd = alertSettings.global.end.trim() !== '' ? (new Date(alertSettings.global.end.trim()).getTime() + (24 * 60 * 60 * 1000)) : new Date('12/31/2050').getTime()

		if (globalAlertMessage !== '') {
			if (currentTime >= globalAlertStart && currentTime < globalAlertEnd) {
				$('#section-alert .row > div').append(addAlert('generic_alert', globalAlertMessage, globalAlertIcon))
			}
		}
	}
}

/* Setup the debug alert message. */
function setupDebugAlert () {
	if ($('#alert-settings').text() !== '') {
		let alertSettings = JSON.parse($('#alert-settings').text())
		let responsiveAlertMessage,
			responsiveAlertCountry,
			responsiveAlertIcon

		for (let i in alertSettings.responsive) {
			responsiveAlertMessage = alertSettings.responsive[i].message.trim().toLowerCase()
			responsiveAlertCountry = alertSettings.responsive[i].country.trim().toLowerCase()
			responsiveAlertIcon = alertSettings.responsive[i].icon.trim().toLowerCase()
			if (isDebugging()) {
				if (responsiveAlertCountry === 'debug') {
					$('#section-alert .row > div').append(addAlert('responsive_alert', responsiveAlertMessage, responsiveAlertIcon))
				}
			}
		}
	}
}

jQuery(function () {
	if (
		detectPageTemplates('home') ||
		detectPageTemplates('categories') ||
		detectPageTemplates('sections') ||
		detectPageTemplates('articles') ||
		detectPageTemplates('search') ||
		detectPageTemplates('request-new')
	) {
		setupGlobalAlert()
		setupResponsiveAlert()
		setupDebugAlert()
	}

	$('#btn-consent-close').on('click', function () {
		setCookieForDays(upworkConfig.cookies.prefix + 'cookies-consent', 'yes', 7)
		$('#alert-cookies-consent').remove()
	})
})

/* Marge the JSON object. */
function margeJSON(target, source) {
	const isObject = obj => obj && typeof obj === 'object'

	for (const key in source) {
		if (isObject(source[key])) {
			target[key] = margeJSON(target[key] || {}, source[key])
		} else {
			target[key] = source[key]
		}
	}

	return target
}


/* Show the form. */
function showForm (params = {}) {
	$('#page-header').show()
	$('.request-page-container').show()

	$('#request_issue_type_select').parents().eq(0).hide()

	const defaultValues = {
		title: '',
		upload: false,
		subject: {
			visible: false,
			value: ''
		},
		description: {
			visible: false,
			value: ''
		},
		anonymous: {
			access: true
		}
	}

	const mergedJson = margeJSON(defaultValues, params)

	if (mergedJson.anonymous.access === false) {
		if (isUserAnonymous()) {
			window.location.href = '/login?return_to=' + encodeURI(window.location.href)
		}
	}

	if (mergedJson.title === '') {
		$('#form-title').text('Submit a Request')
	} else {
		$('#form-title').text(mergedJson.title)
	}

	if (mergedJson.upload === false) {
		$('#upload-dropzone').parents().eq(0).hide()
	}

	if (mergedJson.subject.visible === false) {
		$('#request_subject').parents().eq(0).hide()
	}

	if (mergedJson.subject.value !== '') {
		$('#request_subject').val(mergedJson.subject.value)
	}

	if (mergedJson.description.visible === false) {
		$('#request_description').parents().eq(0).hide()
	}

	if (mergedJson.description.value !== '') {
		$('#request_description').val(mergedJson.description.value)
	}

	$('.request-form footer input[type="submit"]').hide()

}

/* Custom Dropdown control handler. */
function customDropdownHandler (field, value, text) {
	$('#' + field + '-dropdown .btn-dropdown').text(text)
	$('#' + field + '-hidden').val(value)
}

/* Get the field value. */
function getFieldValue (key) {
	return $('#request_custom_fields_' + key).val()
}

/* Populate the radio button. */
function addRadio (radio) {
	$('.request_custom_fields_' + radio.key + ' .nesty-input').hide()
	let output = []
	output.push('<div class="radio">')
		 for (let i in radio.options) {
			output.push('<div class="radio-option">')
				output.push('<div class="radio-option-icon-wrapper">')
					output.push('<span class="radio-option-icon" data-field="' + radio.key + '" data-key="' + radio.options[i].key + '">&nbsp;</span>')
				output.push('</div>')
				output.push('<div class="radio-option-text">')
					output.push(radio.options[i].value)
				output.push('</div>')
			output.push('</div>')
		}
	output.push('</div>')
	$(output.join('')).insertAfter('.request_custom_fields_' + radio.key + ' .nesty-input')
}

/* Populate the dropdown. */
function addDropdown (dropdown) {
	$('.request_custom_fields_' + dropdown.key + ' .nesty-input').hide()
	let output = []
	output.push('<button class="btn btn-block btn-dropdown dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Select</button>')
	output.push('<ul class="dropdown-menu" aria-labelledby="country_dropdown_' + dropdown.key + '" aria-expanded="false">')
		for (let i in dropdown.options) {
			output.push('<li class="dropdown-item dropdown-link item-' + dropdown.options[i].key + '" data-field="' + dropdown.key + '" data-key="' + dropdown.options[i].key + '">')
				output.push(dropdown.options[i].value)
			output.push('</li>')
		}
	output.push('</ul>')
	$(output.join('')).insertAfter('.request_custom_fields_' + dropdown.key + ' .nesty-input')
	$('.request_custom_fields_' + dropdown.key).addClass('dropdown')
}

/* Get the dropdown selection. */
function getDropdownSelection (key) {
	let value = $('.request_custom_fields_' + key + ' .btn-dropdown').text()
	return value
}

/* Check the dropdown selection. */
function checkDropdownSelection (key) {
	if (getDropdownSelection(key) === 'Select') {
		return false
	} else {
		return true
	}
}

/* Populate the country dropdown. */
function addCountryDropdown (key) {
	$('#request_custom_fields_' + key ).hide()
	let countries = ["Afghanistan","Åland Islands","Albania","Algeria","American Samoa","Andorra","Angola","Anguilla","Antarctica","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Bouvet Island","Brazil","British Indian Ocean Territory","Brunei Darussalam","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Christmas Island","Cocos (Keeling) Islands","Colombia","Comoros","Congo","Congo, The Democratic Republic of The","Cook Islands","Costa Rica","Cote D'ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands (Malvinas)","Faroe Islands","Fiji","Finland","France","French Guiana","French Polynesia","French Southern Territories","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guadeloupe","Guam","Guatemala","Guernsey","Guinea","Guinea-bissau","Guyana","Haiti","Heard Island and Mcdonald Islands","Holy See (Vatican City State)","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran, Islamic Republic of","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Korea, Democratic People's Republic of","Korea, Republic of","Kuwait","Kyrgyzstan","Lao People's Democratic Republic","Latvia","Lebanon","Lesotho","Liberia","Libyan Arab Jamahiriya","Liechtenstein","Lithuania","Luxembourg","Macao","Macedonia, The Former Yugoslav Republic of","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Martinique","Mauritania","Mauritius","Mayotte","Mexico","Micronesia, Federated States of","Moldova, Republic of","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Niue","Norfolk Island","Northern Mariana Islands","Norway","Oman","Pakistan","Palau","Palestinian Territory, Occupied","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Pitcairn","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russian Federation","Rwanda","Saint Helena","Saint Kitts and Nevis","Saint Lucia","Saint Pierre and Miquelon","Saint Vincent and The Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Georgia and The South Sandwich Islands","Spain","Sri Lanka","Sudan","Suriname","Svalbard and Jan Mayen","Swaziland","Sweden","Switzerland","Syrian Arab Republic","Taiwan, Province of China","Tajikistan","Tanzania, United Republic of","Thailand","Timor-leste","Togo","Tokelau","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","United States Minor Outlying Islands","Uruguay","Uzbekistan","Vanuatu","Venezuela","Viet Nam","Virgin Islands, British","Virgin Islands, U.S.","Wallis and Futuna","Western Sahara","Yemen","Zambia","Zimbabwe"]

	let countryOptions = []
	countryOptions.push('<button id="country_dropdown_' + key + '" class="btn btn-dropdown dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Select</button>')
	countryOptions.push('<ul class="dropdown-menu" aria-labelledby="country_dropdown_' + key + '" aria-expanded="false">')
	for (let i in countries) {
		countryOptions.push('<li class="dropdown-item dropdown-link" data-field="' + key + '" data-key="' + countries[i] + '">')
			countryOptions.push(countries[i])
		countryOptions.push('</li>')
	}
	countryOptions.push('</ul">')

	$(countryOptions.join('')).insertAfter('#request_custom_fields_' + key)
	$('.request_custom_fields_' + key).addClass('dropdown')
}

/* Populate the address field. */
function addAddressField (start, street, city, state, zipCode) {
	$('.request_custom_fields_' + street).hide()
	$('.request_custom_fields_' + city).hide()
	$('.request_custom_fields_' + state).hide()
	$('.request_custom_fields_' + zipCode).hide()

	let addressField = []
	addressField.push('<div class="form-field required address">')
		addressField.push('<label id="request_custom_fields_address_label" for="request_custom_fields_address">')
			addressField.push('What address do you have on file with us?')
		addressField.push('</label>')
		addressField.push('<input type="text" id="request_custom_fields_address_street" class="request_custom_fields_address_street" aria-required="true" placeholder="Street">')
		addressField.push('<input type="text" id="request_custom_fields_address_city" class="request_custom_fields_address_city" aria-required="true" placeholder="City">')
		addressField.push('<input type="text" id="request_custom_fields_address_state" class="request_custom_fields_address_state" aria-required="true" placeholder="State">')
		addressField.push('<input type="text" id="request_custom_fields_address_zip" class="request_custom_fields_address_zip" aria-required="true" placeholder="ZIP">')
	addressField.push('</div>')

	$('.request_custom_fields_' + start).after(addressField.join(''))
}

jQuery(function () {
	$('#new_request').on('click', '.radio-option', function () {
		let radioField = $(this).find('.radio-option-icon').attr('data-field')
		let radioValue = $(this).find('.radio-option-icon').attr('data-key')
		$('#request_custom_fields_' + radioField).val(radioValue)
		$(this).parents().eq(1).find('.radio-option-icon').removeClass('active')
		$(this).find('.radio-option-icon').addClass('active')
	})

	$('#new_request').on('click', '.dropdown-link', function () {
		let dropdownField = $(this).attr('data-field')
		let dropdownValue = $(this).attr('data-key')
		$(this).parents().eq(1).find('.btn-dropdown').text($(this).text())
		$('#request_custom_fields_' + dropdownField).val(dropdownValue)
	})
})

/* add confirmation modal primary button. */
function addConfirmationModalBtn (btnClass, text) {
	sessionStorage.btnClass = btnClass
	$('#confirmation-modal .modal-footer .btn-action').addClass(btnClass)
	$('#confirmation-modal .modal-footer .btn-action').html(text)
}

/* Reset confirmation modal. */
function resetConfirmationModal () {
	$('#confirmation-modal .modal-title').text('Confirmation')
	$('#confirmation-modal .modal-body').html('<p class="confirmation-message"></p>')

	$('#confirmation-modal .modal-footer .btn-close').removeClass('btn-primary')
	$('#confirmation-modal .modal-footer .btn-close').addClass('btn-link')

	$('#confirmation-modal .modal-footer .btn-action').removeClass('btn-primary')

	if (sessionStorage.btnClass) {
		var primaryBtnClass = sessionStorage.btnClass
		$('#confirmation-modal .modal-footer .btn-action').removeClass(primaryBtnClass)
		$('#confirmation-modal .modal-footer .btn-action').text('Ok')
	}

	$('#confirmation-modal .modal-footer .btn-primary').show()
}

jQuery(function () {

	/* Handle the accordion click. */
	$('.accordion-item-title').click(function (event) {
		event.preventDefault()
		let $title = $(this)
		if ($title.parents().eq(1).hasClass('accordion-collapse-all')) {
			$title.parents().eq(1).find('.accordion-item-content').slideUp()
			if (!$title.hasClass('accordion-item-title-active')) {
				$title.parents().eq(1).find('.accordion-item-title').removeClass('accordion-item-title-active')
				$title.addClass('accordion-item-title-active')
				$title.siblings().slideToggle()
			} else {
				$title.parents().eq(1).find('.accordion-item-title').removeClass('accordion-item-title-active')
			}
		} else {
			$title.toggleClass('accordion-item-title-active')
			$title.siblings().slideToggle()
		}
	})

	/* Handle the load more click for the accordion. */
	if ($('.accordion-item').length > 2) {
		$('<span class="load-more-faq">Show more questions</span>').insertAfter('.accordion.accordion-faq')
	}

	$('.accordion-faq').each(function (key, value) {
		$(this).find('.accordion-item').each(function (index, element) {
			if (index >= 2) {
				$(element).addClass('accordion-item-faq')
			}
		})
	})

	$('.load-more-faq').click(function () {
		$(this).prev().find('.accordion-item-faq').each(function (index, element) {
			if (index <= 1) {
				$(this).removeClass('accordion-item-faq')
			}
		})

		if ($(this).prev().find('.accordion-item-faq').length === 0) {
			$(this).remove()
		}
	})

	$('.article-body .nav-tabs a').click(function (event) {
		event.preventDefault()
		$(this).parents().eq(1).find('li').removeClass('active')
		$(this).parents().eq(0).addClass('active')
		$($(this).attr('href')).parent().find('.tab-pane').hide()
		$($(this).attr('href')).slideToggle()
	})
})


jQuery(function () {
	$('.pagination .pagination-first a').html('First')
	$('.pagination .pagination-prev a').html('Previous')
	$('.pagination .pagination-next a').html('Next')
	$('.pagination .pagination-last a').html('Last')
})

jQuery(function () {
	$('.breadcrumbs li a[href="/hc/en-us"]').html('<span class="icon-svg-home"></span>')
})

/* Handle the popular nav tab click. */
function clickPopularTopicNavTab (scope) {
	$('.tab-pane').hide()
	$('#popular-topics-nav-tabs .nav-tabs .nav-item .nav-link').removeClass('active')
	$('#popular-topics-nav-tab-' + scope).addClass('active')
	$('#popular-topics-tab-pane-' + scope).show()
	getInstantHelps(scope)
	getRecommendedTopics(scope)
	getCommonSearches(scope)
	updateWebinarLink()
}

/* Handle the popular nav tab click default. */
function clickPopularTopicNavTabDefault () {
	if (isUserAnonymous()) {
		clickPopularTopicNavTab('freelancer')
	} else {
		if (isUserAgent()) {
			clickPopularTopicNavTab('agent')
		} else {
			if (getCookie(upworkConfig.cookies.prefix + 'user-enterprise-org') !== null) {
				enterpriseLandingPage()
			} else {
				if (getCookie(upworkConfig.cookies.prefix + 'user-tab') !== null) {
					clickPopularTopicNavTab(getCookie(upworkConfig.cookies.prefix + 'user-tab'))
				} else {
					if (isUserClient()) {
						setCookieForDays(upworkConfig.cookies.prefix + 'user-tab', 'client', 1)
						clickPopularTopicNavTab('client')
					} else if (isUserAgency()) {
						setCookieForDays(upworkConfig.cookies.prefix + 'user-tab', 'agency', 1)
						clickPopularTopicNavTab('agency')
					} else if (isUserFreelancer()) {
						setCookieForDays(upworkConfig.cookies.prefix + 'user-tab', 'freelancer', 1)
						clickPopularTopicNavTab('freelancer')
					}
				}
			}
		}
	}
}

/* Get instant Help options. */
function getInstantHelps (scope) {
	let output = []
	for (let i in instantHelp) {
		if (instantHelp[i].scope === scope) {
			for (let j in instantHelp[i].options) {
				output.push('<div class="instant-helps-list-item">')
					output.push('<a href="' + instantHelp[i].options[j].link + '">')
						output.push('<div class="icon-container">')
							output.push('<span class="' + instantHelp[i].options[j].icon + '"></span>')
						output.push('</div>')
						output.push('<div class="text-container">')
							output.push('<h4>' + instantHelp[i].options[j].title + '</h4>')
							output.push('<p>' + instantHelp[i].options[j].description + '</p>')
						output.push('</div>')
					output.push('</a>')
				output.push('</div>')
			}
		} else {
			continue
		}
	}
	$('#section-instant-helps .instant-helps-list-container').html(output.join(''))
}

/* Get Recommended Topics. */
function getRecommendedTopics (scope) {
	let output = []
	for (let i in recommendedTopics) {
		if (recommendedTopics[i].scope === scope) {

			for (let j in recommendedTopics[i].links) {
				output.push('<div class="recommended-topics-item">')
					output.push('<div class="recommended-topics-item-container">')
						output.push('<a href="' + recommendedTopics[i].links[j].link + '">')
							output.push('<h4>' + recommendedTopics[i].links[j].title + '</h4>')
						output.push('</a>')
						output.push('<p>' + recommendedTopics[i].links[j].description + '</p>')
					output.push('</div>')
				output.push('</div>')
			}
		} else {
			continue
		}
	}
	$('#section-recommended-topics .recommended-topics-list').html(output.join(''))
}

/* Get Common Searche Phareses. */
function getCommonSearches (scope) {
	for (i in commonSearches) {
		if (commonSearches[i].scope === scope) {
			let keyWords = commonSearches[i].keywords.split(',')
			let output = []
			for (let i in keyWords) {
				output.push('<li><a data-query="' + keyWords[i].trim() + '" href="' + zdBrands.main.hc.url + '/search?utf8=✓&query=' + keyWords[i].trim() + '">' + keyWords[i].trim() + '</a></li>')
			}
			$('#common-search-container ul').html(output.join(''))
		}
	}
}

jQuery(function () {
	if (detectPageTemplates('home')) {
		let output = []

		if (isUserInternal()) {
			let outputTab = []
			outputTab.push('<li class="nav-item" role="presentation">')
				outputTab.push('<button id="popular-topics-nav-tab-enterprise" class="nav-link" data-bs-toggle="tab" data-bs-target="#popular-topics-tab-pane-enterprise" type="button" role="tab" aria-controls="popular-topics-tab-pane-enterprise" aria-selected="false">')
					outputTab.push('Enterprise')
				outputTab.push('</button>')
			outputTab.push('</li>')

			enterpriseHomeContactSection()

			if (isUserAgent()) {
				outputTab.push('<li class="nav-item" role="presentation">')
					outputTab.push('<button id="popular-topics-nav-tab-agent" class="nav-link" data-bs-toggle="tab" data-bs-target="#popular-topics-tab-pane-agent" type="button" role="tab" aria-controls="popular-topics-tab-pane-agent" aria-selected="false">')
						outputTab.push('Agent')
					outputTab.push('</button>')
				outputTab.push('</li>')
			}
			$('#popular-topics-nav-tabs .nav-tabs').append(outputTab.join(''))
		}


		for (i in kbMatrics) {
			if (kbMatrics[i].scope === 'agent') {
				output.push('<div id="popular-topics-tab-pane-' + kbMatrics[i].scope + '" class="tab-pane tab-pane-internal" role="tabpanel" aria-labelledby="popular-topics-nav-tab-' + kbMatrics[i].scope + '">')
			} else {
				output.push('<div id="popular-topics-tab-pane-' + kbMatrics[i].scope + '" class="tab-pane" role="tabpanel" aria-labelledby="popular-topics-nav-tab-' + kbMatrics[i].scope + '">')
			}

				output.push('<div class="tab-pane-container">')

				for (j in kbMatrics[i].tiles) {
					output.push('<div class="popular-topics-category">')
						output.push('<a href="' + zdBrands.main.hc.url + '/' + kbMatrics[i].tiles[j].type + '/' + kbMatrics[i].tiles[j].id + '">')
							output.push('<div class="icon-container"><span class="' + kbMatrics[i].tiles[j].icon + '"></span></div>')
							output.push('<div class="text-container">')
								output.push('<h4>' + kbMatrics[i].tiles[j].title + '</h4>')
								output.push('<p>' + kbMatrics[i].tiles[j].description + '</p>')
							output.push('</div>')
						output.push('</a>')
					output.push('</div>')
				}

				output.push('</div>')

			output.push('</div>')
		}
		$('#popular-topics-tab-content .tab-content').html(output.join(''))

		$('#popular-topics-nav-tabs .nav-tabs .nav-item .nav-link').click(function () {
			let getTheScope = $(this).attr('id').replace('popular-topics-nav-tab-', '')
			setCookieForHours(upworkConfig.cookies.prefix + 'user-tab', getTheScope, 1)

			$('.tab-pane').hide()
			$('#popular-topics-nav-tabs .nav-tabs .nav-item .nav-link').removeClass('active')
			$('#popular-topics-nav-tab-' + getTheScope).addClass('active')
			$('#popular-topics-tab-pane-' + getTheScope).show()

			getInstantHelps(getTheScope)
			getRecommendedTopics(getTheScope)
			getCommonSearches(getTheScope)
			updateWebinarLink()
		})

		clickPopularTopicNavTabDefault()

		/* Direct link - nav tabs. */
		if (getQueryParam('tab')) {
			if (getQueryParam('tab') === 'enterprise') {
				clickPopularTopicNavTab('enterprise')
				window.scrollTo(0, ($('#section-popular-topics').offset().top - 120))
			}

			if (getQueryParam('tab') === 'agency') {
				clickPopularTopicNavTab('agency')
				window.scrollTo(0, ($('#section-popular-topics').offset().top - 120))
			}
		}

		/* Fixed nav tabs. */
		$(window).scroll(function () {
			let sectionHerotop = parseInt($('#section-hero').offset().top)
			let sectionHeroHeight = parseInt($('#section-hero').outerHeight())
			let navHeadingHeight = parseInt($('#popular-topics-nav-tabs h2').outerHeight())
			let fixedTopicStart = sectionHerotop + sectionHeroHeight + navHeadingHeight

			if ($(window).scrollTop() > fixedTopicStart) {
				$('#popular-topics-nav-tabs').addClass('fixed-topics')
			} else {
				$('#popular-topics-nav-tabs').removeClass('fixed-topics')
			}
		})
	}
})

/* Generate pagination links. */
function generatePagination (count, current) {
	let delta = 2
	let left = current - delta
	let right = current + delta
	let range = []

	if (left > count - 5) {
		left = count - 4
	}

	if (right < 5) {
		right = 5
	}

	for (let i = 1; i <= count; i++) {
		if (i >= left && i <= right) {
			range.push(i)
		}
	}

	if (range[0] !== 1) {
		range.unshift('first', 'previous')
	}

	if (range[4] !== count  && count !== current) {
		range.push('next', 'last')
	}

	return range
}

/* Load search Pagination. */
function loadSearchPagination (count, current, next) {
	let output = []
	let getPagination = generatePagination(count, current)
	for (let i in getPagination) {
		if (getPagination[i] === 'first') {
			var getNewURL = setQueryParam(next, 'page', 1)
			output.push('<li class="pagination-first"><a href="' + getNewURL + '">First</a></li>')
		} else if (getPagination[i] === 'previous') {
			var getNewURL = setQueryParam(next, 'page', current - 1)
			output.push('<li class="pagination-prev">')
				output.push('<a href="' + getNewURL + '">')
					output.push('Previous')
				output.push('</a>')
			output.push('</li>')
		} else if (getPagination[i] === 'next') {
			var getNewURL = setQueryParam(next, 'page', current + 1)
			output.push('<li class="pagination-next">')
				output.push('<a href="' + getNewURL + '">')
					output.push('Next')
				output.push('</a>')
			output.push('</li>')
		} else if (getPagination[i] === 'last') {
			var getNewURL = setQueryParam(next, 'page', count)
			output.push('<li class="pagination-last"><a href="' + getNewURL + '">Last</a></li>')
		} else if (getPagination[i] === current) {
			output.push('<li class="pagination-current"><span>' + getPagination[i] + '</span></li>')
		} else {
			let getNewURL = setQueryParam(next, 'page', getPagination[i])
			output.push('<li><a href="' + getNewURL + '">' + getPagination[i] + '</a></li>')
		}
	}
	$('.pagination ul').html(output.join(''))
}

/* Load search results. */
function loadSearchResults (scope) {
	let filter = ''
	if (scope.search('filter-') === -1) {
		switch (scope) {
			case 'freelancer':
				filter = 'filter-fl'
				break
			case 'agency':
				filter = 'filter-ag'
				break
			case 'client':
				filter = 'filter-cl'
				break
			case 'enterprise':
				filter = 'filter-hc-enterprise'
				break
			case 'api':
				filter = 'filter-api'
				break
			case 'agent':
				filter = 'filter-int'
				break
		}
	} else {
		switch (scope) {
			case 'filter-fl':
				scope = 'freelancer'
				filter = 'filter-fl'
				break
			case 'filter-ag':
				scope = 'agency'
				filter = 'filter-ag'
				break
			case 'filter-cl':
				scope = 'client'
				filter = 'filter-cl'
				break
			case 'filter-hc-enterprise':
				scope = 'enterprise'
				filter = 'filter-hc-enterprise'
				break
			case 'filter-api':
				scope = 'api'
				filter = 'filter-api'
				break
			case 'filter-int':
				scope = 'agent'
				filter = 'filter-int'
				break
			case 'filter-all':
				scope = 'agent'
				filter = 'filter-fl,filter-ag,filter-cl,filter-en,filter-api,filter-int'
				break
		}
	}

	$('#search-topics-nav-tabs .nav-tabs .nav-item .nav-link').removeClass('active')
	$('#search-topics-nav-tab-' + scope).addClass('active')

	let location = window.location.href
	let queryString = location.replace(zdBrands.main.hc.url + '/search?', '')
	let apiURL = zdBrands.main.hc.api + '/articles/search.json?' + queryString
	apiURL = apiURL.replace('en-us/', '')
	apiURL = apiURL.replace('&utf8=%E2%9C%93', '')
	apiURL = setQueryParam(apiURL, 'per_page', 10)
	apiURL = setQueryParam(apiURL, 'label_names', filter)

	var searchQueryString = getQueryParam('query').replace(/[^\w\s]/gi, '');
	if (decodeURIComponent(searchQueryString) === '') {
		apiURL = setQueryParam(apiURL, 'query', '\'\'')
	}

	setCookieForHours(upworkConfig.cookies.prefix + 'user-tab', scope, 6)
	getCommonSearches(scope)

	if (getQueryParam('query') !== null) {
		$('#common-search-container > ul > li > a').each(function (index, element) {
			if ($(this).attr('data-query') === getQueryParam('query')) {
				$(this).addClass('active')
			}
		})
	}

	$.ajax(apiURL, {
		type: 'GET',
		dataType: 'json',
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		success: function (data) {
			let resultText = data.count + ' results for "' + decodeURIComponent(searchQueryString) + '"'
			$('#search-result-heading h2').text(resultText)

			if (isUserInternal() && scope === 'agent') {
				let searchlocation = window.location.href.split('?')[0]
				let queryValue = getQueryParam('query')
				let queryString = setQueryParam(searchlocation, 'query', queryValue)
				queryString = setQueryParam(queryString, 'utf8', '✓')
				queryString = setQueryParam(queryString, 'per_page', 10)
				queryString = setQueryParam(queryString, 'label_names', 'filter-all')
			}

			let output = []
			for (i in data.results) {
				output.push('<div class="article-list-item api">')
					output.push('<h4><a href="' + data.results[i].html_url + '">' + data.results[i].title + '</a></h4>')
					output.push('<p>' + data.results[i].snippet + '</p>')
					output.push('<a href="' + data.results[i].html_url + '">')
						output.push('Continue reading')
					output.push('</a>')
				output.push('</div>')
			}

			if (data.page_count > 1) {
				let searchPage = ''
				if (data.next_page === undefined) {
					searchPage = data.previous_page.replace(zdBrands.main.hc.api.replace('en-us', '') + 'articles/search.json', zdBrands.main.hc.url + '/search')
				} else {
					searchPage = data.next_page.replace(zdBrands.main.hc.api.replace('en-us', '') + 'articles/search.json', zdBrands.main.hc.url + '/search')
				}

				let pageCount = data.page_count
				loadSearchPagination(pageCount, data.page, searchPage)
			} else {
				$('.pagination').remove()
			}

			$('#section-search-results .article-list').html(output.join(''))
			$('#section-search-results').css('visibility', 'visible')
		}
	})
}

jQuery(function () {
	if (isUserInternal()) {
		let outputTab = []
		outputTab.push('<li class="nav-item" role="presentation">')
			outputTab.push('<button id="search-topics-nav-tab-enterprise" class="nav-link" data-bs-toggle="tab" data-bs-target="#search-topics-tab-pane-enterprise" type="button" role="tab" aria-controls="search-topics-tab-pane-enterprise" aria-selected="false">')
				outputTab.push('An Enterprise client profile')
			outputTab.push('</button>')
		outputTab.push('</li>')

		if (isUserAgent()) {
			outputTab.push('<li class="nav-item" role="presentation">')
				outputTab.push('<button id="search-topics-nav-tab-agent" class="nav-link" data-bs-toggle="tab" data-bs-target="#search-topics-tab-pane-agent" type="button" role="tab" aria-controls="search-topics-tab-pane-agent" aria-selected="false">')
					outputTab.push('An Upwork Agent')
				outputTab.push('</button>')
			outputTab.push('</li>')
		}
		$('#search-topics-nav-tabs .nav-tabs-container .nav-tabs').append(outputTab.join(''))
	}

	if (detectPageTemplates('search')) {
		$('#search-topics-nav-tabs .nav-tabs .nav-item .nav-link').click(function () {
			let getTheScope = $(this).attr('data-bs-target').replace('#search-topics-tab-pane-', '')
			setCookieForHours(upworkConfig.cookies.prefix + 'user-tab', getTheScope, 6)
			updateWebinarLink()

			let searchlocation = window.location.href.split('?')[0]
			let queryValue = getQueryParam('query')
			let queryString = setQueryParam(searchlocation, 'query', queryValue)
			queryString = setQueryParam(queryString, 'utf8', '✓')
			queryString = setQueryParam(queryString, 'per_page', 10)
			queryString = setQueryParam(queryString, 'label_names', getTheScope)
			window.location = queryString
		})

		if (getCookie(upworkConfig.cookies.prefix + 'user-enterprise-org') !== null) {
			if (! isUserInternal()) {
				enterpriseSearchPage()
			}
		}

		if (getQueryParam('label_names')) {
			loadSearchResults(getQueryParam('label_names'))
		} else {
			if (getCookie(upworkConfig.cookies.prefix + 'user-tab')) {
				loadSearchResults(getCookie(upworkConfig.cookies.prefix + 'user-tab'))
			} else {
				if (isUserAnonymous()) {
					loadSearchResults('freelancer')
				} else {
					if (isUserAgent()) {
						loadSearchResults('agent')
					} else {
						if (getCookie(upworkConfig.cookies.prefix + 'user-enterprise-org') !== null) {
							loadSearchResults('hc-enterprise')
						} else {
							if (isUserEnterprise()) {
								loadSearchResults('enterprise')
							} else if (isUserClient()) {
								loadSearchResults('client')
							} else if (isUserAgency()) {
								loadSearchResults('agency')
							} else {
								loadSearchResults('freelancer')
							}
						}
					}
				}
			}
		}

		/* Fixed nav tabs. */
		$(window).scroll(function () {
			let sectionHerotop = parseInt($('#section-hero').offset().top)
			let sectionHeroHeight = parseInt($('#section-hero').outerHeight())
			let fixedTopicStart = sectionHerotop + sectionHeroHeight

			if ($(window).scrollTop() > fixedTopicStart) {
				$('#search-topics-nav-tabs').addClass('fixed-topics')
			} else {
				$('#search-topics-nav-tabs').removeClass('fixed-topics')
			}
		})
	}
})

if (detectPageTemplates('categories')) {
	var categoryURL = urlPartsArray[4].split('-')
	var categoryID = categoryURL[0]
}

/* Get the categories by user context. */
function getCategoriesByContext () {
	let userContext = getCookie(upworkConfig.cookies.prefix + 'user-tab')
	let output = []

	if (userContext === null) {
		userContext = 'freelancer'
	}

	for (let i in kbMatrics) {
		if (kbMatrics[i].scope === userContext){
			for (j in kbMatrics[i].tiles) {
				output.push('<li class="nav-item">')
				output.push('<a class="nav-link" href="' + zdBrands.main.hc.url + '/categories/' + kbMatrics[i].tiles[j].id + '">')
				output.push(kbMatrics[i].tiles[j].title)
				output.push('</a>')
				output.push('</li>')
			}
		}
	}

	$('#category-sidebar ul').html(output.join(''))
}

/* Add mirrored articles to the section on category pages. */
function addMirroredArticles () {
	$.each($('#category-list-container .category-list .article-list'), function (index, element) {
		let sectionID = $(this).attr('data-section')
		for (let i in kbMirrors.sections) {
			if (sectionID === kbMirrors.sections[i].mirror) {
				for (let j in kbMirrors.sections[i].items) {
					let output = []
					output.push('<div class="article-list-item article-item-mirrored">')
						output.push('<a href="' + zdBrands.main.hc.url + '/articles/' + kbMirrors.sections[i].items[j].id + '">')
							output.push(kbMirrors.sections[i].items[j].title)
						output.push('</a>')
					output.push('</div>')
					$('#article-list-' + sectionID).append(output.join(''))
				}
			}
		}
	})
}

/* Add more articles to the section on category pages. */
function addMoreArticles (sectionID) {
	$.ajax(zdBrands.main.hc.api + '/sections/' + sectionID + '/articles.json', {
		type: 'GET',
		dataType: 'json',
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		success: function (data) {
			let output = []
			$('#article-list-' + sectionID).find('.article-list-item').not('.article-item-mirrored').remove()
			for (i in data.articles) {
				output.push('<div class="article-list-item">')
					output.push('<a href="' + data.articles[i].html_url + '">')
						output.push(data.articles[i].title)
					output.push('</a>')
				output.push('</div>')
			}
			$('#article-list-' + sectionID).prepend(output.join(''))
		}
	})
}

/* Add mirrored sections on category pages. */
function addMirroredSections (id, title) {
	let output = []
	output.push('<div class="section-list">')
		output.push('<div class="row">')
			output.push('<div class="col-12">')
				output.push('<h3>')
					output.push('<a href="/hc/en-us/sections/' + id + '">' + title + '</a>')
				output.push('</h3>')
			output.push('</div>')
		output.push('</div>')
		output.push('<div class="row">')
			output.push('<div id="article-list-' + id + '" class="article-list article-list-mirrored">')
			output.push('</div>')
		output.push('</div>')
	output.push('</div>')
	$('#category-list').append(output.join(''))
}

jQuery(function () {
	if (detectPageTemplates('categories')) {
		addMirroredArticles()
		getCategoriesByContext()
	}
})

if (detectPageTemplates('sections')) {
	var sectionURL = urlPartsArray[4].split('-')
	var sectionID = sectionURL[0]
}

/* Get mirrored articles on section pages. */
function getMirroredArticles (id) {
	$.ajax(zdBrands.main.hc.api + '/articles/' + id + '.json', {
		type: 'GET',
		dataType: 'json',
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		success: function (data) {
			let output = []

				output.push('<div class="row">')
					output.push('<div class="col-12">')
						output.push('<div class="article-list-item">')
							output.push('<h4>')
								output.push('<a href="/hc/en-us/articles/' + data.article.id + '" class="title">')
								output.push(data.article.title)
								output.push('</a>')
							output.push('</h4>')
							output.push('<p class="excerpt">')
								output.push(formatBodyText(data.article.body, 200))
							output.push('</p>')
							output.push('<a href="/hc/en-us/articles/' + data.article.id + '">Continue reading</a>')
						output.push('</div>')
					output.push('</div>')
				output.push('</div>')

			$('.article-list').append(output.join(''))
		}
	})
}

/* Format article body text. */
function formatBodyText (text, limit) {
	let regEx = /(<([^>]+)>)/ig
	let returnString = text.replace(regEx, '')
	returnString = returnString.substr(0, returnString.lastIndexOf(' ', limit)) + ' ...'

	return returnString
}

jQuery(function () {
	if (detectPageTemplates('sections')) {
		getCategoriesByContext()
	}
})

if (detectPageTemplates('articles')) {
	var articleURL = urlPartsArray[4].split('-')
	var articleID = parseInt(articleURL[0])
}

jQuery(function () {
	if (detectPageTemplates('articles')) {
		if (articleID === appealForm.article) {
			let toDayNow = new Date()
			let queryString = setQueryParam($('#article-appeal-btn').attr('href'), 'nonce', (toDayNow.getTime() + (5 * 60 * 1000)))
			$('#article-appeal-btn').attr({
				'href': queryString
			})
		}

		/* Push event to dataLayer on article votes. */
		$('.article-vote-up').click(function () {
			dataLayer.push({ 'event': 'upvote' })
		})
		$('.article-vote-down').click(function () {
			dataLayer.push({ 'event': 'downvote' })
		})

		/* Article meta visibilities. */
		if (!isUserInternal()) {
			$('#article-vote-container').show()
		} else {
			$('#article-vote-container').remove()
		}
	}
})

jQuery(function () {
	if (detectPageTemplates('requests-list')) {

		/*  Filter request(s) by status. */
		$('body').on('click', '#request-status-dropdown .dropdown-menu > li > a', function () {
			let searchlocation = window.location.href.split('?')[0]
			let queryValue = ($('#request-query-text').val() === undefined) ? '' : $('#request-query-text').val()
			let statusValue = $(this).attr('data-value')
			let queryString = setQueryParam(searchlocation, 'query', queryValue)
			queryString = setQueryParam(queryString, 'status', statusValue)
			window.location = queryString
		})

		if (getQueryParam('status')) {
			switch(getQueryParam('status')) {
				case '':
					customDropdownHandler('request-status', '', 'Any')
					break
				case 'open':
					customDropdownHandler('request-status', 'open', 'Open')
					break
				case 'answered':
					customDropdownHandler('request-status', 'answered', 'Awaiting')
					break
				case 'solved':
					customDropdownHandler('request-status', 'solved', 'Solved')
					break
			}
		}

		if (getQueryParam('query')) {
			$('#request-query-text').val(getQueryParam('query'))
		}
	}
})

if (detectPageTemplates('request-single')) {
	var requestID = urlPartsArray[4]
}


jQuery(function () {
	if (detectPageTemplates('request-single')) {
		/* Toggle request page sidebar. */
		$('body').on('click', '.request-sidebar h4', function () {
			if ($(this).find('span').hasClass('air-icon-arrow-expand')) {
				$('.request-details').show()
				$('#dispute-details-sidebar').show()
				$('#request-attachments-sidebar').show()
				$(this).find('span').removeClass('air-icon-arrow-expand')
				$(this).find('span').addClass('air-icon-arrow-collapse')
			} else {
				$('.request-details').hide()
				$('#dispute-details-sidebar').hide()
				$('#request-attachments-sidebar').hide()
				$(this).find('span').removeClass('air-icon-arrow-collapse')
				$(this).find('span').addClass('air-icon-arrow-expand')
			}
		})
	}

	if (
		detectPageTemplates('request-single') ||
		detectPageTemplates('requests-list')
	) {
		$('.request-status-answered').text('Awaiting')
	}
})

/* Get Upwork status via API. */
function getStatusAPI () {
	$.ajax('https://api.status.io/1.0/status/55a1f951d0ef560d6e00006e', {
		type: 'GET',
		contentType: 'application/json',
		crossDomain: true,
		success: function (data) {
			setCookieForMins(upworkConfig.cookies.prefix + 'status-widget', JSON.stringify(data.result), 2)
			showStatusBar()
		}
	})
}

/* Show status bar. */
function showStatusBar () {
	const getStatus = JSON.parse(getCookie(upworkConfig.cookies.prefix + 'status-widget'))

	if (getStatus.status_overall.status_code === 200) {
		let alertMessage = 'Upwork has a Planned Maintenance. Please <a href="https://status.upwork.com" target="_blank">click here</a> to know more details.'
		addStatusAlert(alertMessage, 'warning')
		if (getStatus.maintenance.active.length > 0) {
			setCookieForMins(upworkConfig.cookies.prefix + 'status-widget-visibility', 'true', 2)
		} else {
			setCookieForMins(upworkConfig.cookies.prefix + 'status-widget-visibility', 'false', 2)
		}
	} else if (getStatus.status_overall.status_code === 300) {
		let alertMessage = 'Some areas of Upwork aren\'t running as fast as we expect. Please <a href="https://status.upwork.com" target="_blank">click here</a> to know more details.'
		addStatusAlert(alertMessage, 'warning')
		if (getStatus.incidents.length > 0) {
			setCookieForMins(upworkConfig.cookies.prefix + 'status-widget-visibility', 'true', 2)
		} else {
			setCookieForMins(upworkConfig.cookies.prefix + 'status-widget-visibility', 'false', 2)
		}
	} else if (getStatus.status_overall.status_code === 400) {
		let alertMessage = 'Some areas of Upwork are temporarily unavailable. Please <a href="https://status.upwork.com" target="_blank">click here</a> to know more details.'
		addStatusAlert(alertMessage, 'warning')
		if (getStatus.incidents.length > 0) {
			setCookieForMins(upworkConfig.cookies.prefix + 'status-widget-visibility', 'true', 2)
		} else {
			setCookieForMins(upworkConfig.cookies.prefix + 'status-widget-visibility', 'false', 2)
		}
	} else if (getStatus.status_overall.status_code === 500) {
		let alertMessage = 'Upwork has an Active Incident. Please <a href="https://status.upwork.com" target="_blank">click here</a> to know more details.'
		addStatusAlert(alertMessage, 'danger')
		if (getStatus.incidents.length > 0) {
			setCookieForMins(upworkConfig.cookies.prefix + 'status-widget-visibility', 'true', 2)
		} else {
			setCookieForMins(upworkConfig.cookies.prefix + 'status-widget-visibility', 'false', 2)
		}
	} else if (getStatus.status_overall.status_code === 100) {
		if (getStatus.maintenance.upcoming.length > 0) {
			let plannedDate = new Date(getStatus.maintenance.upcoming[0].datetime_planned_start)
			let plannedDateTime = new Date(plannedDate.getTime() + ((plannedDate.getTimezoneOffset() / 60) * 3600 * 1000))
			let plannedDateUTC = plannedDateTime.toDateString() + ' ' + plannedDateTime.toLocaleTimeString() + ' UTC'
			let alertMessage = 'Upwork has a Planned Maintenance on ' + plannedDateUTC + '. Please <a href="https://status.upwork.com" target="_blank">click here</a> to know more details.'
			addStatusAlert(alertMessage, 'success')
			setCookieForMins(upworkConfig.cookies.prefix + 'status-widget-visibility', 'true', 2)
		} else {
			setCookieForMins(upworkConfig.cookies.prefix + 'status-widget-visibility', 'false', 2)
		}
	}
}

/* Add status alert. */
function addStatusAlert (message, scope) {
	if (
		detectPageTemplates('home') ||
		detectPageTemplates('categories') ||
		detectPageTemplates('sections') ||
		detectPageTemplates('articles') ||
		detectPageTemplates('search') ||
		detectPageTemplates('request-new')
	) {
		$('#section-alert .row > div').append(addAlert('status_alert', message, scope))
	}
}

jQuery(function () {
	if (getCookie(upworkConfig.cookies.prefix + 'status-widget')) {
		showStatusBar()
	} else {
		getStatusAPI()
	}
})

/* Show the suspended user alert. */
function showSuspendedUserAlert (identifier, message) {
	if (
		detectPageTemplates('home') ||
		detectPageTemplates('categories') ||
		detectPageTemplates('sections') ||
		detectPageTemplates('articles') ||
		detectPageTemplates('search') ||
		detectPageTemplates('request-new')
	) {
		$('#section-alert .row > div').append(addAlert(identifier, message, 'danger'))
	}
}

/* Add the suspended user alert. */
function addSuspendedUserAlert () {
	if (isUserSyncDone()) {
		if (isUnsuccessfulFL()) {
			showSuspendedUserAlert('excessive_disputes', 'It looks like your Upwork account is suspended. To get all the details, look for the email we sent you at the time your account was suspended. The email subject line should read: “Your Upwork account has been suspended.')
		} else if (isFinancialHold()) {
			showSuspendedUserAlert('client_accounting_auto', 'Financial transactions on your account have been limited due to a failed charge. To resume your account, please update your payment method and pay any outstanding balance. <a href="' + zdBrands.main.hc.url + '/articles/' + kbLinks.articles.financialHold + '">Read more</a>')
		}
	} else {
		setTimeout(function () {
			addSuspendedUserAlert()
		}, 1000)
	}
}

jQuery(function () {
	addSuspendedUserAlert()
})

/* Submit GSSO form request. */
function submitGSSOForm () {
	let requestBody = []
	if (isUserAnonymous()) {
		requestBody.push('Here is the information to update Email and Enable Sign In with Password.' + '\n')
		requestBody.push('Email: ' + $('#request_anonymous_requester_email').val() + '\n')
	} else {
		requestBody.push('Here is the information to update Email and Enable Sign In with Password.' + '\n')
		requestBody.push('Email: ' + HelpCenter.user.email + '\n')
	}

	$('#request_custom_fields_' + gssoForm.fields.street).val($('#request_custom_fields_address_street').val())
	$('#request_custom_fields_' + gssoForm.fields.city).val($('#request_custom_fields_address_city').val())
	$('#request_custom_fields_' + gssoForm.fields.state).val($('#request_custom_fields_address_state').val())
	$('#request_custom_fields_' + gssoForm.fields.zipCode).val($('#request_custom_fields_address_zip').val())

	dataLayer.push({
		'event': 'customEvent',
		'eventCategory': 'Help Center',
		'eventAction': 'Ticket created',
		'eventLabel': 'GSSO Form Submitted',
		'metricId': '4',
		'metricValue': '1'
	})

	requestBody.push('Contact Email: ' + getFieldValue(gssoForm.fields.contactEmail) + '\n')
	requestBody.push('Phone Number: ' + getFieldValue(gssoForm.fields.phoneNumber) + '\n')

	requestBody.push('Street: ' + $('#request_custom_fields_address_street').val() + '\n')
	requestBody.push('City: ' + $('#request_custom_fields_address_city').val() + '\n')
	requestBody.push('State: ' + $('#request_custom_fields_address_state').val() + '\n')
	requestBody.push('Zip Code: ' + $('#request_custom_fields_address_zip').val() + '\n')

	requestBody.push('Joining Date: ' + getFieldValue(gssoForm.fields.dateJoining) + '\n')
	requestBody.push('Country: ' + getDropdownSelection(gssoForm.fields.country) + '\n')
	requestBody.push('First 6-digits of Credit Card: ' + getFieldValue(gssoForm.fields.creditCard) + '\n')
	requestBody.push('Transaction Date: ' + getFieldValue(gssoForm.fields.dateTransaction) + '\n')
	requestBody.push('Date PayPal Added: ' + getFieldValue(gssoForm.fields.datePaypal) + '\n')

	$('#request_description').val(requestBody.join(''))

	if ($('#request_anonymous_requester_email').val() !== '') {
		if (
			getFieldValue(gssoForm.fields.contactEmail) !== '' &&
			getFieldValue(gssoForm.fields.phoneNumber) !== '' &&
			$('#request_custom_fields_address_street').val() !== '' &&
			$('#request_custom_fields_address_city').val() !== '' &&
			$('#request_custom_fields_address_state').val() !== '' &&
			$('#request_custom_fields_address_zip').val() !== '' &&
			getFieldValue(gssoForm.fields.dateJoining) !== '' &&
			checkDropdownSelection(gssoForm.fields.country) &&
			getFieldValue(gssoForm.fields.creditCard) !== '' &&
			getFieldValue(gssoForm.fields.dateTransaction) !== '' &&
			getFieldValue(gssoForm.fields.datePaypal) !== ''
		) {
			$('.request-form footer input[type="submit"]').click()
		} else {
			$('#warning-modal .warning-message').text('Please complete all required * fields to ensure we will be able to process your request.')
			$('#warning-modal').modal('show')
		}
	} else {
		$('#warning-modal .warning-message').text('Please complete all required * fields to ensure we will be able to process your request.')
		$('#warning-modal').modal('show')
	}
}

jQuery(function () {
	if (
		detectPageTemplates('request-new') &&
		getQueryParam('ticket_form_id') &&
		parseInt(getQueryParam('ticket_form_id')) === gssoForm.form
	) {
		$('#form-description').text('If you have enabled \'Sign in with Google\' and have lost access to your Google account, please complete the form below in it\'s entirely to reset your email and enable sign-in with a password.')
		$('#form-description').after('<p class="form-description">We\'ll need you to verify you\'re the account owner in order to update your email address and disable \'Sign in with Google\'. The email you list as your \'Alternative Contact Email\' will be set as the new primary email on your account.</p>')

		showForm({
			title: 'Update Email and Enable Sign In with Password',
			subject: {
				value: 'Request for upwork login due to GSSO failed'
			}
		})

		$('.request-form .form-field').each(function (index, element) {
			$(this).find('label').text($(this).find('p').text())
			$(this).find('p').remove()
		})

		if (isUserAnonymous()) {
			$('.request_anonymous_requester_email label').text('What\'s the email address connected to your Upwork account?')
		}

		$('.request_custom_fields_' + gssoForm.fields.contactEmail).append('<p class="hint">To enable sign in with password we\'ll need to update your email address and disable \'Sign in with Google\'. Please provide us with the new email address you\'d like to use for this purpose.<p>')

		addCountryDropdown(gssoForm.fields.country)
		addAddressField(gssoForm.fields.phoneNumber, gssoForm.fields.street, gssoForm.fields.city, gssoForm.fields.state, gssoForm.fields.zipCode)

		$('.request-form footer').prepend('<p class="footer-hint">Before submitting your request, please ensure that the above information is accurate and complete. Any missing or incorrect information may impede our ability to verify your account.</p>')
		$('.request-form footer input[type="submit"]').after('<a class="btn btn-primary" href="javascript:submitGSSOForm()">Submit</a>')

	}
})

/* Submit BYOC form request. */
function submitBYOCForm () {
	if (
		getFieldValue(byocForm.fields.email) !== '' &&
		getFieldValue(byocForm.fields.signup) !== '' &&
		getFieldValue(byocForm.fields.haveClient) !== ''
	) {
		$('.request-form footer input[type="submit"]').click()
	} else {
		$('#warning-modal .warning-message').text('Please complete all required * fields to ensure we will be able to process your request.')
		$('#warning-modal').modal('show')
	}
}

jQuery(function () {
	if (detectPageTemplates('request-new')) {
		if (getQueryParam('ticket_form_id') && parseInt(getQueryParam('ticket_form_id')) === byocForm.form) {

			$('#form-description').text('Enjoy a 0% service fee when you bring new clients to Upwork when you sign up for Freelancer Plus between May 26, 2023 to June 30, 2023. This offer is valid until September 30, 2023.')

			showForm({
				title: 'Bring Your Own Client - Freelancer Plus promotion',
				subject: {
					value: 'Bring Your Own Client - Freelancer Plus promotion'
				},
				description: {
					value: 'Bring Your Own Client - Freelancer Plus promotion'
				},
				anonymous: {
					access: false
				}
			})

			$('.request-form footer').prepend('<p class="footer-hint">Thanks in advance for providing this information! We\'re happy to help and we\'ll be in touch with your client link in 2 business days.</p>')
			$('.request-form footer input[type="submit"]').after('<a class="btn btn-primary" href="javascript:submitBYOCForm()">Submit</a>')
		}
	}
})

/* Submit any hire form request. */
function submitAnyHireForm () {
	if (
		getFieldValue(anyHireForm.fields.email) !== '' &&
		getFieldValue(anyHireForm.fields.freelancers) !== '' &&
		checkDropdownSelection(anyHireForm.fields.category)
	) {
		if (isUserAnonymous()) {
			$('#request_anonymous_requester_email').val($('#request_custom_fields_' + anyHireForm.fields.email).val())
		}
		$('.request-form footer input[type="submit"]').click()
	} else {
		$('#warning-modal .warning-message').text('Please complete all required * fields to ensure we will be able to process your request.')
		$('#warning-modal').modal('show')
	}
}

jQuery(function () {
	if (detectPageTemplates('request-new')) {
		if (getQueryParam('ticket_form_id') && parseInt(getQueryParam('ticket_form_id')) === anyHireForm.form) {

			if (isUserAnonymous()) {
				$('.request_anonymous_requester_email').hide()
			}

			$('#form-description').text('Fill in the form below to have your Bring Your Own Talent contracts transitioned to Any Hire. You will not be charged until you review the contract(s) on Any Hire (including pricing) and send them to your talent for acceptance. There is no fee to transfer your contract/s.')

			showForm({
				title: 'Import existing \'Bring Your Own Talent\' contracts to Any Hire',
				subject: {
					value: 'Import existing \'Bring Your Own Talent\' contracts to Any Hire'
				},
				description: {
					value: 'Import existing \'Bring Your Own Talent\' contracts to Any Hire'
				}
			})

			for (let i in anyHireForm.dropdowns) {
				addDropdown(anyHireForm.dropdowns[i])
			}

			$('.request-form footer').prepend('<p class="footer-hint">*Note: Requests will be processed within 1 business day</p>')
			$('.request-form footer input[type="submit"]').after('<a class="btn btn-primary" href="javascript:submitAnyHireForm()">Submit</a>')
		}
	}
})

jQuery(function () {
	window.usabilla_live("hide")

	if (
		detectPageTemplates('articles') ||
		detectPageTemplates('request-new')
	) {
		$('#btn-feedback').remove()
	}

	$('#btn-feedback').on('click', function () {
		window.usabilla_live('click')
	})

	$('.article-vote-down').on('click', function () {
		if ($(this).attr('aria-selected') === 'false') {
			window.usabilla_live('click')
		}
	})
})

/* Submit Self Auth form request. */
function submitselfAuthForm () {
	let requestBody = []
	if (isUserAnonymous()) {
		requestBody.push('Here is the information to recover my password.' + '\n')
		requestBody.push('Email: ' + $('#request_anonymous_requester_email').val() + '\n')
	} else {
		requestBody.push('Here is the information to recover my password.' + '\n')
		requestBody.push('Email: ' + HelpCenter.user.email + '\n')
	}

	$('#request_custom_fields_' + selfAuthForm.fields.street).val($('#request_custom_fields_address_street').val())
	$('#request_custom_fields_' + selfAuthForm.fields.city).val($('#request_custom_fields_address_city').val())
	$('#request_custom_fields_' + selfAuthForm.fields.state).val($('#request_custom_fields_address_state').val())
	$('#request_custom_fields_' + selfAuthForm.fields.zipCode).val($('#request_custom_fields_address_zip').val())

	dataLayer.push({
		'event': 'customEvent',
		'eventCategory': 'Help Center',
		'eventAction': 'Ticket created',
		'eventLabel': 'Self Auth Form Submitted',
		'metricId': '4',
		'metricValue': '1'
	})

	requestBody.push('Contact Email: ' + getFieldValue(selfAuthForm.fields.contactEmail) + '\n')
	requestBody.push('Phone Number: ' + getFieldValue(selfAuthForm.fields.phoneNumber) + '\n')

	requestBody.push('Street: ' + $('#request_custom_fields_address_street').val() + '\n')
	requestBody.push('City: ' + $('#request_custom_fields_address_city').val() + '\n')
	requestBody.push('State: ' + $('#request_custom_fields_address_state').val() + '\n')
	requestBody.push('Zip Code: ' + $('#request_custom_fields_address_zip').val() + '\n')

	requestBody.push('Joining Date: ' + getFieldValue(selfAuthForm.fields.dateJoining) + '\n')
	requestBody.push('Country: ' + getDropdownSelection(selfAuthForm.fields.country) + '\n')
	requestBody.push('First 6-digits of Credit Card: ' + getFieldValue(selfAuthForm.fields.creditCard) + '\n')
	requestBody.push('Transaction Date: ' + getFieldValue(selfAuthForm.fields.dateTransaction) + '\n')
	requestBody.push('Date PayPal Added: ' + getFieldValue(selfAuthForm.fields.datePaypal) + '\n')

	let tempPassword = $('.request_custom_fields_' + selfAuthForm.fields.tempPassword + ' .radio-option-helper.active').parent().text().trim()
	if (tempPassword !== '') {
		requestBody.push('Temp Password: ' + tempPassword + '\n')
	}

	if (checkDropdownSelection(selfAuthForm.fields.userFeedback)) {
		requestBody.push('User Feedback: ' + getDropdownSelection(selfAuthForm.fields.userFeedback) + '\n')

		if (
			getDropdownSelection(selfAuthForm.fields.userFeedback) === 'Other' &&
			getFieldValue(selfAuthForm.fields.otherFeedback) !== ''
		) {
			requestBody.push('Other Feedback: ' +  getFieldValue(selfAuthForm.fields.otherFeedback) + '\n')
		}
	}

	if (getFieldValue(selfAuthForm.fields.addtionalQuestions) !== '') {
		requestBody.push('\r\n')
		requestBody.push('Addtional Questions:' + '\r\n')
		requestBody.push('====================' + '\r\n')
		requestBody.push(getFieldValue(selfAuthForm.fields.addtionalQuestions) + '\n')
	}

	$('#request_description').val(requestBody.join(''))

	if ($('#request_anonymous_requester_email').val() !== '') {
		if (
			getFieldValue(selfAuthForm.fields.contactEmail) !== '' &&
			getFieldValue(selfAuthForm.fields.phoneNumber) !== '' &&
			$('#request_custom_fields_address_street').val() !== '' &&
			$('#request_custom_fields_address_city').val() !== '' &&
			$('#request_custom_fields_address_state').val() !== '' &&
			$('#request_custom_fields_address_zip').val() !== '' &&
			getFieldValue(selfAuthForm.fields.dateJoining) !== '' &&
			checkDropdownSelection(selfAuthForm.fields.country) &&
			getFieldValue(selfAuthForm.fields.creditCard) !== '' &&
			getFieldValue(selfAuthForm.fields.dateTransaction) !== '' &&
			getFieldValue(selfAuthForm.fields.datePaypal) !== ''
		) {
			$('.request-form footer input[type="submit"]').click()
		} else {
			$('#warning-modal .warning-message').text('Please complete all required * fields to ensure we will be able to process your request.')
			$('#warning-modal').modal('show')
		}
	} else {
		$('#warning-modal .warning-message').text('Please complete all required * fields to ensure we will be able to process your request.')
		$('#warning-modal').modal('show')
	}
}

jQuery(function () {
	if (
		detectPageTemplates('request-new') &&
		getQueryParam('ticket_form_id') &&
		parseInt(getQueryParam('ticket_form_id')) === selfAuthForm.form
	) {
		let formTitle = ''
		let requestSubject = ''

		if (getQueryParam('self_help') && getQueryParam('self_help') === 'security_question_reset') {
			verifyURLNonce()
			formTitle = 'Security Question Reset'
			requestSubject = 'We see you need help resetting your security question'
			$('#request_custom_fields_' + selfAuthForm.fields.source).val('security_question_reset')
		} else if (getQueryParam('self_help') && getQueryParam('self_help') === 'account_login') {
			verifyURLNonce()
			formTitle = 'Two-step Verification Reset'
			requestSubject = 'We see you need help logging in to your account'
			$('#request_custom_fields_' + selfAuthForm.fields.source).val('account_login')
		} else if (getQueryParam('self_help') && getQueryParam('self_help') === 'access_settings') {
			verifyURLNonce()
			formTitle = 'Two-step Verification Reset'
			requestSubject = 'We see you need help accessing your settings'
			$('#request_custom_fields_' + selfAuthForm.fields.source).val('access_settings')
		} else if (getQueryParam('self_help') && getQueryParam('self_help') === 'update_password') {
			verifyURLNonce()
			formTitle = 'Password Reset'
			requestSubject = 'We see you need help updating your password'
			$('.request_custom_fields_' + selfAuthForm.fields.tempPassword).hide()
			$('#request_custom_fields_' + selfAuthForm.fields.source).val('update_password')
		} else if (getQueryParam('self_help') && getQueryParam('self_help') === 'trouble_code') {
			verifyURLNonce()
			formTitle = 'Two-step Verification Reset'
			requestSubject = 'We see you had trouble with the code we sent to you by text message'
			$('#request_custom_fields_' + selfAuthForm.fields.source).val('trouble_code')
		} else {
			formTitle = 'Reset your Security Information'
			requestSubject = 'Reset your Security Information'
			$('#request_custom_fields_' + selfAuthForm.fields.source).val('security_question_reset')
		}

		$('#form-description').text('Security is critically important at Upwork and we\'re happy to help you regain access to all areas of your Upwork account. In order to do so, we\'ll need you to answer a few questions')

		$('.request_custom_fields_' + selfAuthForm.fields.source).hide()

		showForm({
			title: formTitle,
			subject: {
				value: requestSubject
			}
		})

		$('.request-form .form-field').each(function (index, element) {
			$(this).find('label').text($(this).find('p').text())
			$(this).find('p').remove()
		})

		if (isUserAnonymous()) {
			$('#navbar-menu-desktop').remove()
			$('.link-log-in').remove()
			$('.navbar-toggler').remove()
			$('#page-header').remove()

			$('.request_anonymous_requester_email label').text('What\'s the email address connected to your Upwork account?')
		} else {
			$('#navbar-menu-desktop').remove()
			$('.navbar-toggler').remove()
			$('#page-header').remove()
			$('.navbar-user-desktopr').remove()

			$('#request_custom_fields_'+ selfAuthForm.fields.contactEmail + '_label').text('If you no longer have access to the email address connected to your account, what email address should we contact you at?')
		}

		for (i in selfAuthForm.radios) {
			addRadio(selfAuthForm.radios[i])
		}

		for (i in selfAuthForm.dropdowns) {
			addDropdown(selfAuthForm.dropdowns[i])
		}

		addCountryDropdown(selfAuthForm.fields.country)

		addAddressField(selfAuthForm.fields.phoneNumber, selfAuthForm.fields.street, selfAuthForm.fields.city, selfAuthForm.fields.state, selfAuthForm.fields.zipCode)

		$('.request-form footer input[type="submit"]').after('<a class="btn btn-primary" href="javascript:submitselfAuthForm()">Submit</a>')
	}
})

jQuery(function () {
	if (getQueryParam('action') && getQueryParam('action') === 'bug-report') {
		if (isUserAnonymous()) {
			window.location.href = '/login?return_to=' + encodeURIComponent(window.location.href)
		} else {
			if (isUserInternal()) {
				resetConfirmationModal()
				addConfirmationModalBtn('btn-bug-message', 'Send')
				$('#confirmation-modal .modal-title').text('Report a bug')

				let output = []
				output.push('<p>This form is used to submit minor bugs and errors to the Upwork Help team. If you have discovered a major bug, please escalate to Technical Support and contact the Help team directly on Dash: Asif Iqbal, Diego San Miguel, Joe Wang</p>')
				output.push('<p>Use Ctrl+Alt+A or Ctrl+Alt+S to take a screenshot using the desktop app and attach an image link.</p>')

				output.push('<div class="form-group">')
					output.push('<label for="request-description">Please describe the issue</label>')
					output.push('<textarea id="request-description" class="form-control" name="request-description"></textarea>')
				output.push('</div>')
				$('#confirmation-modal .modal-body').html(output.join(''))

				$('#confirmation-modal .modal-footer .btn-link').hide()
				$('#confirmation-modal').modal('show')

				$('.btn-bug-message').click(function () {
					let requesterEmail = HelpCenter.user.email
					let requestSubject = 'HC bug from ' + HelpCenter.user.name
					let requestBody = $('#request-description').val()
					let requestTags = [ 'hc_bug' ]
					let customFields = [
						{
							id: defaultForm.fields.reason,
							value: 'tag_cat_system_issues'
						}
					]
					let messageTitle = 'Report a bug'
					let errorMessage = '<p>Our apologies. Something went wrong.</p><p>Your message was not submitted.</p>'
					let successMessage = '<p>Thanks for your message! If we have any questions, we will reach out via Dash.</p>'
					submitRequest(requesterEmail, requestSubject, requestBody, requestTags, customFields, messageTitle, errorMessage, successMessage)
					$('#confirmation-modal').modal('hide')
				})
			}
		}
	}
})

/* Submit appeal form request. */
function submitAppealForm () {
	if (isUserAnonymous()) {
		if (
			$('#request_anonymous_requester_email').val() !== '' &&
			$('#request_description').val() !== '' &&
			getFieldValue(appealForm.fields.country) !== ''
		) {
			$('.request-form footer input[type="submit"]').click()
		} else {
			$('#warning-modal .warning-message').text('Please complete all required * fields to ensure we will be able to process your request.')
			$('#warning-modal').modal('show')
		}
	} else {
		if (
			$('#request_description').val() !== '' &&
			getFieldValue(appealForm.fields.country) !== ''
		) {
			$('.request-form footer input[type="submit"]').click()
		} else {
			$('#warning-modal .warning-message').text('Please complete all required * fields to ensure we will be able to process your request.')
			$('#warning-modal').modal('show')
		}
	}
}

jQuery(function () {
	if (detectPageTemplates('request-new')) {
		if (getQueryParam('ticket_form_id') && parseInt(getQueryParam('ticket_form_id')) === appealForm.form) {

			verifyURLNonce()

			$('#form-description').html('We understand the importance of maintaining access to your account. We will carefully review your appeal request and reply back within 48 hours. Please note that some reviews may take longer than estimated and submitting multiple requests will delay our time to review and respond. Duplicate requests may also appear as \‘solved\’ as they are merged into the original ticket. If you\’ve already contacted us, you can see and update your ticket <a href="' + zdBrands.main.hc.url + '/requests">here</a>. Thank you!')

			showForm({
				title: 'Submit Suspension Appeal',
				subject: {
					value: 'Suspension Appeal Form Submission'
				},
				description: {
					visible: true
				}
			})

			$('.request-form footer input[type="submit"]').after('<a class="btn btn-primary" href="javascript:submitAppealForm()">Submit</a>')
		}
	}
})

/* Submit enterprise form request. */
function submitEnterpriseForm () {
	if (! isUserAnonymous()) {
		if (
			$('#request_description').val() !== '' &&
			getFieldValue(enterpriseForm.fields.company) !== '' &&
			checkDropdownSelection(enterpriseForm.fields.reason)
		) {
			$('.request-form footer input[type="submit"]').click()
		} else {
			$('#warning-modal .warning-message').text('Please complete all required * fields to ensure we will be able to process your request.')
			$('#warning-modal').modal('show')
		}
	}
}

jQuery(function () {
	if (detectPageTemplates('request-new')) {
		if (getQueryParam('ticket_form_id') && parseInt(getQueryParam('ticket_form_id')) === enterpriseForm.form) {
			if (
				getCookie(upworkConfig.cookies.prefix + 'user-enterprise-org') !== null ||
				isUserInternal()
			) {
				sessionStorage.upworkEnterpriseSupport = true

				$('.request_custom_fields_' + enterpriseForm.fields.company).hide()
				if (getCookie(upworkConfig.cookies.prefix + 'user-enterprise-company-name') !== null) {
					$('#request_custom_fields_' + enterpriseForm.fields.company).val(getCookie(upworkConfig.cookies.prefix + 'user-enterprise-company-name'))
				}

				showForm({
					title: 'Contact our Support Team',
					subject: {
						value: 'Enterprise Support Request'
					},
					description: {
						visible: true
					},
					anonymous: {
						access: false
					}
				})

				$('#form-description').html('Our agents are dedicated to assisting you promptly!  Create your request and describe your issue in detail.  Our agents will review your case and will be in touch with you within the next 2 hours.')
				$('#form-description').after('<p class="form-description">Alternatively,  feel free to call our toll-free number <a href="tel:+18557298551">+1 (855) 729-8551</a> for immediate assistance.</p>')

				if (! isUserAnonymous()) {
					let getUserInfo = JSON.parse(getCookie(upworkConfig.cookies.prefix + 'user-info'))

					let output = []
					output.push('<div class="form-field string">')
						output.push('<label>Email</label>')
						output.push('<input type="text" value="' + getUserInfo.useremail + '" readonly aria-required="false">')
					output.push('</div>')
					$('.request_custom_fields_' + enterpriseForm.fields.phone).before(output.join(''))
				}

				for (let i in enterpriseForm.dropdowns) {
					addDropdown(enterpriseForm.dropdowns[i])
				}

				if (getQueryParam('flow')) {
					let getFlowOption = $('.request_custom_fields_' + enterpriseForm.fields.reason + ' .dropdown-menu .option-' + getQueryParam('flow')).text()
					$('#request_custom_fields_' + enterpriseForm.fields.reason).val(getQueryParam('flow'))
					$('.request_custom_fields_' + enterpriseForm.fields.reason + ' .btn-dropdown').text(getFlowOption)
				}


				let getSourceValue = ''
				let getSourceKey = ''
				if (getQueryParam('src')) {
					if (getQueryParam('src') === 'hc') {
						getSourceValue = 'Upwork Help'
						getSourceTag = 'upwork_help'
					} else {
						getSourceValue = 'Enterprise Home'
						getSourceKey = 'enterprise_home'
					}
				} else {
					getSourceValue = 'Enterprise Home'
					getSourceKey = 'enterprise_home'
				}

				$('.request_custom_fields_' + enterpriseForm.fields.source).hide()
				$('#request_custom_fields_' + enterpriseForm.fields.source).val(getSourceKey)
				$('.request_custom_fields_' + enterpriseForm.fields.source + ' .btn-dropdown').text(getSourceValue)

				$('#request_description_label').text('Tell us more about your inquiry')
				$('#request_description_hint').hide()

				$('.request-form footer').css('margin-bottom', '50px')
				$('.request-form footer .btn-primary').after('<a style="display: block" href="/hc/en-us">Go to Help Home</a>').css('margin-bottom', '30px')

				$('.request-form footer input[type="submit"]').after('<a class="btn btn-primary" href="javascript:submitEnterpriseForm()">Submit</a>')
			} else {
				window.location.href = zdBrands.main.hc.url
			}
		}
	}

	if (detectPageTemplates('home')) {
		if (
			getQueryParam('action') &&
			getQueryParam('action') === 'enterprise-form-submit'
		) {
			resetConfirmationModal()
			$('#confirmation-modal .modal-title').text('Enterprise Support')

			let output = []
			output.push('<div class="confirmation-modal-enterprise-support">')
				output.push('<h2 class="heading-vistior text-center text-primary">Thank you!</h2>')
				output.push('<div class="text-center">')
					output.push('<p>Your request number is #' + getQueryParam('id') + '</p>')
					output.push('<p>Please allow us at least <strong>2 hours</strong> for one of our agents to reach out to you.</p>')
					output.push('<p>You can visit <strong>My Requests</strong> or reply to our email notification to update your request.</p>')
				output.push('</div>')
			output.push('</div>')
			$('#confirmation-modal .modal-body').html(output.join(''))

			if ($(window).width() > 767) {
				$('#confirmation-modal .modal-dialog').css('margin', '5% auto')
			}

			output = []
			output.push('<a class="btn btn-primary" style="margin-left:20px" href="/hc/en-us">Go to Help Home</a>')
			output.push('<a class="btn btn-primary" href="/hc/en-us/requests">Visit My Requests</a>')
			$('#confirmation-modal .modal-footer').html(output.join(''))

			$('#confirmation-modal').modal('show')
		}
	}

	if (detectPageTemplates('request-single')) {
		if (sessionStorage.upworkEnterpriseSupport === 'true') {
			setTimeout(function () {
				if ($('strong').filter(function () { return $(this).text() === 'Your request was successfully submitted.' }).length === 1) {

					sessionStorage.upworkEnterpriseSupport = false

					$('strong').filter(function () { return $(this).text() === 'Your request was successfully submitted.' }).parents().eq(2).remove()

					let queryString = setQueryParam(zdBrands.main.hc.url, 'action', 'enterprise-form-submit')
					queryString = setQueryParam(queryString, 'id', requestID)
					window.location.href = queryString
				}
			}, 100)
		}
	}
})

/* Submit default form request. */
function submitDefaultForm () {
	if (! isUserAnonymous()) {
		if (
			$('#request_subject').val() !== '' &&
			$('#request_description').val() !== '' &&
			checkDropdownSelection(defaultForm.fields.reason)
		) {
			$('.request-form footer input[type="submit"]').click()
		} else {
			$('#warning-modal .warning-message').text('Please complete all required * fields to ensure we will be able to process your request.')
			$('#warning-modal').modal('show')
		}
	}
}

/* Handle the click event for the User Context nav tab. */
function clickUserContextNavTab (scope) {
	$('.tab-pane').hide()
	$('#user-contexts-tabs .nav-tabs .nav-item .nav-link').removeClass('active')
	$('#user-contexts-nav-tab-' + scope).addClass('active')
	$('#user-contexts-tab-pane-' + scope).show()
	getCommonSearches(scope)
}

/* Set the default tab for the User Context nav tab. */
function setDefaultUserContextNavTab () {
	if (isUserAnonymous()) {
		$('#user-contexts-tab-content .tab-pane').show()
		getCommonSearches('freelancer')
	} else {
		if ($('#user-contexts-tab-content .tab-pane').length === 1) {
			$('#user-contexts-tab-content .tab-pane').show()
		} else {
			if (getCookie(upworkConfig.cookies.prefix + 'user-enterprise-org') === null) {
				if (getCookie(upworkConfig.cookies.prefix + 'user-tab') !== null) {
					clickUserContextNavTab(getCookie(upworkConfig.cookies.prefix + 'user-tab'))
				} else {
					if (isUserClient()) {
						setCookieForDays(upworkConfig.cookies.prefix + 'user-tab', 'client', 1)
						clickUserContextNavTab('client')
					} else if (isUserAgency()) {
						setCookieForDays(upworkConfig.cookies.prefix + 'user-tab', 'agency', 1)
						clickUserContextNavTab('agency')
					} else if (isUserFreelancer()) {
						setCookieForDays(upworkConfig.cookies.prefix + 'user-tab', 'freelancer', 1)
						clickUserContextNavTab('freelancer')
					}
				}
			}
		}
	}
}

/* Hide the default form. */
function hideDefaultForm () {
	$('#page-header').hide()
	$('#section-alert').hide()
	$('.request-page-container').hide()
}

/* Set the contact page hero. */
function setContactPageHero () {
	let output = []
	output.push('<div class="container">')
		output.push('<section id="section-hero" class="section-hero">')
			output.push('<div class="section-hero-wrapper">')
				output.push('<p class="sub-heading">Help Center</p>')
				output.push('<h1 class="heading-brand">')
					output.push('Find solutions fast.')
				output.push('</h1>')
				output.push('<p class="sub-heading">Search hundreds of articles on Upwork Help</p>')
				output.push('<div class="search-box">')
					output.push('<form role="search" class="search" data-search="" data-instant="true" autocomplete="off" action="/hc/en-us/search" accept-charset="UTF-8" method="get">')
						output.push('<input type="search" name="query" id="query" placeholder="Search Articles" autocomplete="off" aria-label="Search" aria-autocomplete="both" aria-expanded="false" role="combobox">')
						output.push('<input type="submit" name="commit" value="Search">')
					output.push('</form>')
				output.push('</div>')

				output.push('<div id="common-search-container" class="common-search-container">')
					output.push('<div class="title">Popular:</div>')
					output.push('<ul>')
						output.push('<li>')
							output.push('<a>Connects</a>')
						output.push('</li>')
						output.push('<li>')
							output.push('<a>Suspended</a>')
						output.push('</li>')
						output.push('<li>')
							output.push('<a>payment</a>')
						output.push('</li>')
					output.push('</ul>')
				output.push('</div>')
			output.push('</div>')

			output.push('<div class="hero-banner-wrapper">')
				output.push('<img class="hero-banner" src="https://assets.static-upwork.com/helpcenter/air3/hero.svg" alt=""/>')
			output.push('</div>')
		output.push('</section>')
	output.push('</div>')

	$('main').prepend(output.join(''))
}

/* Get the contact page context. */
function getContactPageContexts () {
	let output = []
	let navHeading = ''
	let navSubHeading = ''
	let navTabButtons = []
	let navTabContents = []

	if (isUserAnonymous()) {
		navHeading = 'How can we help?'
		navSubHeading = 'For personalized service and full visibility of the contact options available for your account, please <a class="link-log-in">log in</a>.'

		navTabContents.push('<div id="user-contexts-tab-pane-visitor" class="tab-pane" role="tabpanel" aria-labelledby="user-contexts-nav-tab-visitor">')
			navTabContents.push('<div class="tab-pane-container">')
				navTabContents.push(addSupportOption('community', 3))
				navTabContents.push(addSupportOption('academy', 3))
				navTabContents.push(addSupportOption('visitor-chat', 3))
			navTabContents.push('</div>')
		navTabContents.push('</div>')
	} else {
		let getUserContexts = JSON.parse(getCookie(upworkConfig.cookies.prefix + 'has-user-contexts'))
		let contextLoop = Object.keys(getUserContexts)

		let actualContextLoop = []
		for (let i in contextLoop) {
			if (getUserContexts[contextLoop[i]]) {
				actualContextLoop.push(contextLoop[i])
			}
		}

		if (getCookie(upworkConfig.cookies.prefix + 'user-enterprise-org') !== null) {
			navHeading = 'How would you like to contact support?'
		} else {
			if (actualContextLoop.length === 1) {
				navHeading = 'How can we help?'

				if (getCookie(upworkConfig.cookies.prefix + 'freelancer-chat-route') === 'LI_Freelancer_Support_CX410') {
					navSubHeading = 'To elevate your support experience and outcomes on Upwork, consider completing our <a href="https://community.upwork.com/t5/New-to-Upwork-Getting-Started/tkb-p/NewtoUpwork101-2">introductory learning path</a>'
				}
			} else {
				navHeading = 'Select the profile presenting the issue'

				for (let i in actualContextLoop) {
					navTabButtons.push('<li class="nav-item" role="presentation">')
						navTabButtons.push('<button id="user-contexts-nav-tab-' + actualContextLoop[i] + '" class="nav-link" data-bs-toggle="tab" data-bs-target="#user-contexts-tab-pane-' + actualContextLoop[i] + '" type="button" role="tab" aria-controls="user-contexts-tab-pane-' + actualContextLoop[i] + '" aria-selected="false">')
							navTabButtons.push(actualContextLoop[i].charAt(0).toUpperCase() + actualContextLoop[i].slice(1))
						navTabButtons.push('</button>')
					navTabButtons.push('</li>')
				}
			}
		}

		if (getCookie(upworkConfig.cookies.prefix + 'user-enterprise-org') !== null) {
			navTabContents.push('<div id="user-contexts-tab-pane-enterprise" class="tab-pane" role="tabpanel" aria-labelledby="user-contexts-nav-tab-enterprise">')
				navTabContents.push('<div class="tab-pane-container">')
				navTabContents.push(addSupportOption('enterprise-email', 2))
				navTabContents.push(addSupportOption('enterprise-phone', 2))
				navTabContents.push('</div>')
			navTabContents.push('</div>')
		} else {
			for (let i in actualContextLoop) {
				navTabContents.push('<div id="user-contexts-tab-pane-' + actualContextLoop[i] + '" class="tab-pane" role="tabpanel" aria-labelledby="user-contexts-nav-tab-' + actualContextLoop[i] + '">')
					navTabContents.push('<div class="tab-pane-container">')

					if (actualContextLoop[i] === 'client' || actualContextLoop[i] === 'enterprise') {
						if (
							isUserTagExists("tag_enterprise") ||
							isUserTagExists("tag_t1_high_spenders") ||
							isUserTagExists("tag_t2_medium_spenders") ||
							isUserTagExists("tag_t3_low_spenders")
						) {
							navTabContents.push(addSupportOption('phone', 2))
							navTabContents.push(addSupportOption('chat', 2))
							navTabContents.push(addSupportOption('community', 2))
							navTabContents.push(addSupportOption('academy', 2))
						} else {
							navTabContents.push(addSupportOption('chat', 3))
							navTabContents.push(addSupportOption('community', 3))
							navTabContents.push(addSupportOption('academy', 3))
						}
					} else {
						navTabContents.push(addSupportOption('community', 3))
						navTabContents.push(addSupportOption('academy', 3))
						navTabContents.push(addSupportOption('chat', 3))
					}

					navTabContents.push('</div>')
				navTabContents.push('</div>')
			}
		}
	}

	output.push('<section id="section-user-contexts" class="section-user-contexts">')

		output.push('<div id="user-contexts-nav-tabs" class="user-contexts-nav-tabs">')
			output.push('<div class="container">')
				output.push('<div class="row">')

					output.push('<h2>')
						output.push(navHeading)
					output.push('</h2>')

					if (navSubHeading !== '') {
						output.push('<p class="sub-heading">')
							output.push(navSubHeading)
						output.push('</p>')
					}

					output.push('<div class="nav-tabs-container">')
						output.push('<ul class="nav nav-tabs" role="tablist">')
							output.push(navTabButtons.join(''))
						output.push('</ul>')
					output.push('</div>')
				output.push('</div>')
			output.push('</div>')
		output.push('</div>')

		output.push('<div id="user-contexts-tab-content" class="user-contexts-tab-content">')
			output.push('<div class="container">')
				output.push('<div class="row">')
					output.push('<div class="tab-content">')
						output.push(navTabContents.join(''))
					output.push('</div>')
				output.push('</div>')
			output.push('</div>')
		output.push('</div>')

		output.push('<div class="container">')
			output.push('<div class="row">')
				output.push('<h5 class="text-center">')
				output.push('<a href="' + zdBrands.main.hc.url + '/requests">View My Requests</a>')
				output.push('</h5>')
			output.push('</div>')
		output.push('</div>')

	output.push('</section>')

	$('.request-page-container').after(output.join(''))
}

/* Add support option. */
function addSupportOption (option, column = 4) {
	let output = []
	output.push('<div class="user-contexts-category user-contexts-category-' + column + ' ' + supportTreatments[option].name + '">')
		output.push('<a href="javascript:void(0)">')
			output.push('<div class="icon-container">')
				output.push('<span class="icon-svg-' + supportTreatments[option].icon + '"></span>')
			output.push('</div>')
			output.push('<div class="text-container">')
				output.push('<h3>' + supportTreatments[option].title + '</h3>')
				output.push('<p>' + supportTreatments[option].description + '</p>')
			output.push('</div>')
		output.push('</a>')
	output.push('</div>')

	return output.join('')
}

/* Show the call us modal for phone support. */
function showCallUsModal () {
	resetConfirmationModal()
	$('#confirmation-modal .modal-title').text('Phone Support')

	let phoneNumber = "(866) 676-3375";

	if (isUserTagExists("tag_enterprise") || getCookie(upworkConfig.cookies.prefix + 'user-enterprise-org') !== null) {
		phoneNumber = "(855) 917-3076";
	} else if (isUserTagExists("tag_t1_high_spenders")) {
		phoneNumber = "(866) 640-0544";
	}

	let output = []
	output.push('<div class="contact-flow-call-us-widget">')
	output.push('<h2 class="heading-brand text-center">Call us on the phone!</h2>')
	output.push('<p class="text-center">')
	output.push('You can reach our agents <strong>Monday to Friday,</strong> from 12 am to 11:59 pm (PST) at')
	output.push('</p>')
	output.push('<h4 class="heading-brand text-center">+1 ' + phoneNumber + '</h4>')
	output.push('</div>')
	$('#confirmation-modal .modal-body').html(output.join(''))

	$('#confirmation-modal').modal('show')
	$('.modal-footer').remove()
}

jQuery(function () {
	if (detectPageTemplates('request-new')) {
		if (getQueryParam('ticket_form_id')) {
			if (parseInt(getQueryParam('ticket_form_id')) === defaultForm.form) {
				hideDefaultForm()

				setContactPageHero()
				getContactPageContexts()

				setTimeout(function () {
					setDefaultUserContextNavTab()
				}, 1500)
			}
		} else {
			window.location = zdBrands.main.hc.url + '/requests/new?ticket_form_id=' + defaultForm.form
		}
	}

	$('main').on('click', '#user-contexts-nav-tabs .nav-tabs .nav-item .nav-link', function () {
		let getTheScope = $(this).attr('data-bs-target').replace('#user-contexts-tab-pane-', '')
		setCookieForHours(upworkConfig.cookies.prefix + 'user-tab', getTheScope, 1)
		clickUserContextNavTab(getTheScope)
	})

	$('main').on('click', '.user-contexts-category.visitor-chat', function () {
		openChatbot()
	})

	$('main').on('click', '.user-contexts-category.email', function () {
		if (window.event.ctrlKey) {

			showForm({
				subject: {
					visible: true
				},
				descriptiion: {
					visible: true
				}
			})

			$('.section-hero').hide()
			$('#section-user-contexts').hide()
			$('#user-contexts-tab-content').hide()

			for (let i in defaultForm.dropdowns) {
				addDropdown(defaultForm.dropdowns[i])
			}

			$('.request-form footer input[type="submit"]').after('<a class="btn btn-primary" href="javascript:submitDefaultForm()">Submit</a>')
		} else {
			openChatbot()
		}
	})

	$('main').on('click', '.user-contexts-category.enterprise-email', function () {
		window.location = zdBrands.main.hc.url + '/requests/new?ticket_form_id=' + enterpriseForm.form + '&src=hc'
	})

	$('main').on('click', '.user-contexts-category.chat', function () {
		openChatbot()
	})

	$('main').on('click', '.user-contexts-category.phone', function () {
		showCallUsModal()
	})

	$('main').on('click', '.user-contexts-category.enterprise-phone', function () {
		showCallUsModal()
	})

	$('main').on('click', '.user-contexts-category.community', function () {
		window.location = communityURL
	})

	$('main').on('click', '.user-contexts-category.academy', function () {
		window.location = communityURL + '/t5/Academy/ct-p/Academy'
	})
})

/* Submit circumvention form request. */
function submitCircumventionForm () {
	if (
		getFieldValue(circumventionForm.fields.name) !== '' &&
		getFieldValue(circumventionForm.fields.email) !== '' &&
		$('#request_custom_fields_' + circumventionForm.fields.reportingCause + ' ul li').length > 0 &&
		$('#request_description').val() !== ''
	) {
		if (isUserAnonymous()) {
			$('#request_anonymous_requester_email').val($('#request_custom_fields_' + circumventionForm.fields.email).val())
		}
		$('.request-form footer input[type="submit"]').click()
	} else {
		$('#warning-modal .warning-message').text('Please complete all required * fields to ensure we will be able to process your request.')
		$('#warning-modal').modal('show')
	}
}

jQuery(function () {
	if (detectPageTemplates('request-new')) {
		if (getQueryParam('ticket_form_id') && parseInt(getQueryParam('ticket_form_id')) === circumventionForm.form) {

			if (! isUserAnonymous()) {
				$('#request_custom_fields_' + circumventionForm.fields.name).val(HelpCenter.user.name)
				$('#request_custom_fields_' + circumventionForm.fields.email).val(HelpCenter.user.email)
			} else {
				$('.request_anonymous_requester_email').hide()
			}

			$('#form-description').text('If a client or freelancer suggest that you accept or pay outside of Upwork or if you have received unsolicited contact from an Upwork user outside of the platform, please complete the form below. Our staff will investigate and take appropriate action.')

			showForm({
				title: 'Report User for Circumvention',
				subject: {
					value: 'Report User for Circumvention'
				},
				description: {
					visible: true
				}
			})

			$('.request_description label').text('Details')
			$('#request_description_hint').text('Provide any details related to this report, which can include the user\'s name who is attempting to circumvent or contact you, when, and how you were contacted')

			$('.request-form footer input[type="submit"]').after('<a class="btn btn-primary" href="javascript:submitCircumventionForm()">Submit</a>')
		}
	}
})

/* Submit direct contract form request. */
function submitDirectContractForm () {
	if ($('#request_description').val() !== '') {
		if (getQueryParam('src')) {
			if (directContractForm.articles.indexOf(parseInt(getQueryParam('src'))) !== -1) {
				$('#request_custom_fields_' + directContractForm.fields.url).val(zdBrands.main.hc.url + '/articles/' + getQueryParam('src'))
			}
		}
		$('.request-form footer input[type="submit"]').click()
	} else {
		$('#warning-modal .warning-message').text('Please complete all required * fields to ensure we will be able to process your request.')
		$('#warning-modal').modal('show')
	}
}

jQuery(function () {
	if (detectPageTemplates('request-new')) {
		if (getQueryParam('ticket_form_id') && parseInt(getQueryParam('ticket_form_id')) === directContractForm.form) {

			$('#form-description').text('Your question about Direct Contracts will be passed to an agent on the Direct Contracts team who will personally respond as soon as possible.')

			showForm({
				title: 'Direct Contracts Request',
				subject: {
					value: 'Direct Contracts Request'
				},
				description: {
					visible: true
				}
			})


			$('#request_description_hint').text('Please enter the details of your request. A member of our Direct Contracts team will respond as soon as possible.')

			$('#request_custom_fields_' + directContractForm.fields.url).parents().eq(0).hide()
			if (getQueryParam('src')) {
				if (directContractForm.articles.indexOf(parseInt(getQueryParam('src'))) !== -1) {
					$('#request_custom_fields_' + directContractForm.fields.url).val(zdBrands.main.hc.url + '/articles/' + getQueryParam('src'))
				} else {
					window.location = zdBrands.main.hc.url
				}
			} else {
				window.location = zdBrands.main.hc.url
			}

			$('.request-form footer input[type="submit"]').after('<a class="btn btn-primary" href="javascript:submitDirectContractForm()">Submit</a>')
		}
	}
})

/* Submit feedback removal form request. */
function submitFeedbackRemovalForm () {
	let answerImpacted = $('.request_custom_fields_' + feedbackRemovalForm.fields.impacted + ' .radio-option-helper.active').parent().text().trim()
	if (
		answerImpacted === 'Yes' &&
		getFieldValue(feedbackRemovalForm.fields.howImpacted) !== '' &&
		getFieldValue(feedbackRemovalForm.fields.contractID) !== ''
	) {
		$('.request-form footer input[type="submit"]').click()
	} else {
		$('#warning-modal .warning-message').text('Please complete all required * fields to ensure we will be able to process your request.')
		$('#warning-modal').modal('show')
	}
}

jQuery(function () {
	if (detectPageTemplates('request-new')) {
		if (getQueryParam('ticket_form_id') && parseInt(getQueryParam('ticket_form_id')) === feedbackRemovalForm.form) {

			$('#form-description').text('If you were impacted by a recent global event and, as a result, received negative feedback, let us know through the form below.')
			$('#form-description').after('<p class="form-description">Be sure to provide as many details as possible. We’ll determine whether the feedback can be removed and email you back.</p><p class="header-hint">Please give us at least 48 hours––we want to make sure we have time to carefully review your request.</p>')

			showForm({
				title: 'Feedback Removal Request',
				subject: {
					value: 'Feedback Removal Request'
				},
				description: {
					visible: true
				},
				anonymous: {
					access: false
				}
			})

			for (let i in feedbackRemovalForm.radios) {
				addRadio(feedbackRemovalForm.radios[i])
			}

			$('#request_custom_fields_' + feedbackRemovalForm.fields.contractID + '_hint').html('Find your contract ID <a href="https://www.upwork.com/d/contracts" target="_blank">here</a>.')

			$('#request_description_label').text('What feedback would you like us to review and potentially remove?')
			$('#request_description_hint').text('You can copy and paste the feedback that you\’d like to remove.')

			$('.request-form footer input[type="submit"]').after('<a class="btn btn-primary" href="javascript:submitFeedbackRemovalForm()">Submit</a>')
		}
	}
})

/* Submit Video/Voice Call Assistance form request. */
function submitVideoVoiceForm () {
	if (
		getFieldValue(videoVoiceForm.fields.date) !== '' &&
		getFieldValue(videoVoiceForm.fields.time) !== '' &&
		getFieldValue(videoVoiceForm.fields.device) !== '' &&
		$('#request_description').val() !== '' &&
		getFieldValue(videoVoiceForm.fields.troubleshooting) !== ''
	) {
		$('.request-form footer input[type="submit"]').click()
	} else {
		$('#warning-modal .warning-message').text('Please complete all required * fields to ensure we will be able to process your request.')
		$('#warning-modal').modal('show')
	}
}

jQuery(function () {
	if (detectPageTemplates('request-new')) {
		if (getQueryParam('ticket_form_id') && parseInt(getQueryParam('ticket_form_id')) === videoVoiceForm.form) {

			$('#form-description').html('Thank you for contacting Upwork Support about your video or voice call experience. To better help us address your issue, please provide the following details. Be sure to also check out <a href="' + zdBrands.main.hc.url + '/articles/' + kbLinks.articles.videoVoice + '" taget="_blank">Pro Tips for Upwork Calls</a> for information about common issues and resolutions.')

			showForm({
				title: 	'Video/Voice Call Assistance Request',
				subject: {
					value: 'Video/Voice Call Assistance Request'
				},
				description: {
					visible: true
				},
				anonymous: {
					access: false
				}
			})

			$('#request_description_label').text('Details of the issue you faced')
			$('#request_description_hint').text('')

			$('.request-form footer input[type="submit"]').after('<a class="btn btn-primary" href="javascript:submitVideoVoiceForm()">Submit</a>')
		}
	}
})

jQuery(function () {
	if (getQueryParam('request') && getQueryParam('request') === 't_private_profile') {
		if (isUserAnonymous()) {
			window.location.href = '/login?return_to=' + encodeURI(window.location.href)
		} else {
			if (getCookie(upworkConfig.cookies.prefix + 'current-user-context') === 'freelancer') {
				if (! isUserSuspened()) {
					let requesterEmail = HelpCenter.user.email
					let requestSubject = 'Your request to set your Upwork profile to public'
					let requestBody = []
					requestBody.push(HelpCenter.user.name + ' requests profile be changed from private to public.\n\n')
					requestBody.push('Important note: Don\’t respond to these emails, it will delay changing your profile visibility further.')

					let requestTags = [getQueryParam('request')]
					let customFields = [
						{
							id: defaultForm.fields.reason,
							value: 'tag_cat_profile'
						}
					]
					let messageTitle = 'Upwork Customer Support'
					let errorMessage = '<p>Our apologies. Something went wrong.</p><p>Your ticket was not submitted.</p>'
					let successMessage = []
					successMessage.push('<p>We received your request and we\’re working on it! We sent you an email to confirm and will email you again when your profile is public, which might take up to 4 hours.</p>')
					successMessage.push('<p><strong>Important note: </strong>Don\’t respond to these emails, it will delay changing your profile visibility further. If you made this request by accident, you can always <a href="' + zdBrands.main.hc.url + '/articles/' + kbLinks.articles.privateProfile + '">switch your profile back to private </a>manually.</p>')
					successMessage.push('<p>Thanks for using Upwork!</p>')

					submitRequest(requesterEmail, requestSubject, requestBody.join(''), requestTags, customFields, messageTitle, errorMessage, successMessage.join(''), window.location.origin + window.location.pathname)
				} else {
					window.location.href = zdBrands.main.hc.url
				}
			} else {
				window.location.href = zdBrands.main.hc.url
			}
		}
	}
})

jQuery(function () {
	if (detectPageTemplates('request-new')) {
		if (getQueryParam('ticket_form_id') && getQueryParam('ticket_form_id') === 'proprietary-rights-infringement-reporting') {

			$('#form-title').text('Proprietary Rights Infringement Reporting Procedures')
			$('title').text('Proprietary Rights Infringement Reporting Procedures')
			$('#page-header').remove()
			$('#form-description').remove()

			$('.request-page-container').show()

			let output = []
			output.push('<ul class="list-bullet">')
				output.push('<li>')
					output.push('<a href="https://pact.ly/_iu17n">')
						output.push('I am filing a Copyright Infringement Claim with Upwork')
					output.push('</a>')
				output.push('</li>')
				output.push('<li>')
					output.push('<a href="https://pact.ly/eAUOLg">')
						output.push('I am filing a Counter-Notice to a Copyright Infringement Claim with Upwork')
					output.push('</a>')
				output.push('</li>')
				output.push('<li>')
					output.push('<a href="https://pact.ly/Owo4pO">')
						output.push('I am filing a Trademark or Other Intellectual Property Right Infringement Notice')
					output.push('</a>')
				output.push('</li>')
			output.push('</ul>')
			$('#new_request').after(output.join('')).remove()

		}
	}
})

jQuery(function () {
	if (
		detectPageTemplates('requests-list')
	) {
		let getSubject = ''
		$('.table-cell-subject').each(function (index, element) {
			getSubject = $(element).children('a').text().trim()
			if (getSubject.includes('Dispute Case#') === true) {
				$(element).children('a').after('<span class="label badge clay">Dispute</span>')
			}
		})
	}
})

/* Populate the agents. */
function populateAgents () {
	let convoUsers = {}
	$('.comment-author-name').each(function (index, element) {
		if ($(this).attr('data-internal') === 'true') {
			convoUsers[$(this).attr('data-id')] = {
				id: $(this).attr('data-id'),
				name: $(this).text().trim()
			}
		}
	})
	sessionStorage.convoUsers = JSON.stringify(convoUsers)
}

/* Populate the participants. */
function populateParticipants(requester, collaborators, assignee) {
	$('#participant-list').html('')
	$('#participant-list').append('<li>' + requester + '</li>')
	$('#participant-list').append(collaborators)
	$('#participant-list').append('<li>' + assignee + '</li>')
}

/* Get the side conversations. */
function getSideConversations (ticketID) {
	$('#loader-overlay').show()

	$.ajax(zdBrands.main.api + '/tickets/' + ticketID + '/side_conversations', {
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json',
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		success: function (data) {
			if (data.side_conversations.length > 0) {
				let output = []
				let outputTab = []
				let outputTabLink = []

				output.push('<div id="dispute-details-sidebar" class="dispute-details-sidebar details-sidebar">')
					output.push('<dl id="dispute-details-created" class="dispute-details dispute-details-created">')
						output.push('<dt>Created</dt>')
						output.push('<dd><time></time></dd>')
					output.push('</dl>')

					output.push('<dl id="dispute-details-updated" class="dispute-details dispute-details-updated">')
						output.push('<dt>Last activity</dt>')
						output.push('<dd><time></time></dd>')
					output.push('</dl>')

					output.push('<dl id="dispute-details-participants" class="dispute-details dispute-details-participants">')
						output.push('<dt>Participants</dt>')
						output.push('<dd>')
							output.push('<ul id="participant-list" class="participant-list">')
							output.push('</ul>')
						output.push('</dd>')
					output.push('</dl>')
				output.push('</div>')
				$('#request-sidebar').append(output.join(''))

				outputTab.push('<div class="tab-content">')
					outputTab.push('<div id="convo-tab-pane-main" class="tab-pane convo-tab-pane" role="tabpanel" aria-labelledby="convo-nav-tab-main">')
						outputTab.push($('.comments-container').parents().eq(0).html())
					outputTab.push('</div>')

					for (let i in data.side_conversations) {
						const sideConvo = data.side_conversations[i]
						outputTab.push('<div id="convo-tab-pane-' + sideConvo.id + '" class="tab-pane convo-tab-pane" role="tabpanel" aria-labelledby="convo-nav-tab-' + sideConvo.id + '">')
						outputTab.push('</div>')
					}
				outputTab.push('</div>')

				outputTabLink.push('<div class="nav-tabs-container">')
					outputTabLink.push('<ul class="nav nav-tabs nav-tabs-dispute" role="tablist">')
						outputTabLink.push('<li class="nav-item" role="presentation">')
							outputTabLink.push('<button id="convo-nav-tab-main" class="nav-link" data-bs-toggle="tab" data-bs-target="#convo-tab-pane-main" type="button" role="tab" aria-controls="convo-nav-tab-pane-main" aria-selected="true">Main</button>')
						outputTabLink.push('</li>')
						for (let i in data.side_conversations) {
							const sideConvo = data.side_conversations[i]
							outputTabLink.push('<li class="nav-item">')
								outputTabLink.push('<button id="convo-nav-tab-' + sideConvo.id + '" class="nav-link" data-bs-toggle="tab" data-bs-target="#convo-tab-pane-' + sideConvo.id + '" type="button" role="tab" aria-controls="convo-nav-tab-pane-' + sideConvo.id + '" aria-selected="false">' + sideConvo.subject + '</button>')
							outputTabLink.push('</li>')
						}
					outputTabLink.push('</ul>')
				outputTabLink.push('</div>')


				$('.comments-container').before(outputTabLink.join(''))
				$('.comments-container').remove()
				$('.comment-form').remove()
				$('.nav-tabs-container').after(outputTab.join(''))

				$('#hc-wysiwyg').remove()
				$('.comment-attachments').remove()
                $('#request_comment_body').css({
                    'display': 'block',
                    'visibility': 'visible'
                })

				populateParticipants(
					$('#request-details-requester dd').text(),
					$('#request-details-collaborators dd').children('#request-collaborators').html(),
					$('#request-details-assignee dd').text()
				)

				$('#dispute-details-created dd time').text(formatDateMDY($('#request-details-created dd time').text()))
				$('#dispute-details-updated dd time').text(formatDateMDY($('#request-details-updated dd time').text()))

				$('#request-details-created').hide().addClass('request-details-hidden')
				$('#request-details-updated').hide().addClass('request-details-hidden')
				$('#request-details-requester').hide().addClass('request-details-hidden')
				$('#request-details-collaborators').hide().addClass('request-details-hidden')

				getDisputeMetaData()

			} else {
				$('#loader-overlay').hide()
			}
		}
	})
}

/* Get the dispute meta data. */
function getDisputeMetaData () {
	const ticketID = urlPartsArray[4]

	$.ajax(zdBrands.main.api + '/requests/' + ticketID, {
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json',
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		success: function (data) {
			let output = []

			for (let i in data.request.custom_fields) {
				for (let j in disputeMetaFields) {
					if (data.request.custom_fields[i].id === disputeMetaFields[j].id) {
						output.push('<dl id="request-details-' + disputeMetaFields[j].key + '" class="request-details request-details-' + disputeMetaFields[j].key + '">')
							if (disputeMetaFields[j].key === 'dispute-date') {
								if (data.request.custom_fields[i].value !== '') {
									output.push('<dt>' + disputeMetaFields[j].title + '</dt>')
									output.push('<dd>' + formatDateMDY(data.request.custom_fields[i].value) + '</dd>')
								}
							} else if (disputeMetaFields[j].key === 'amount-escrow') {
								if (data.request.custom_fields[i].value !== '') {
									output.push('<dt>' + disputeMetaFields[j].title + '</dt>')
									output.push('<dd>US$ ' + data.request.custom_fields[i].value + '</dd>')
								}
							} else if (disputeMetaFields[j].key === 'contract-id') {
								if (data.request.custom_fields[i].value !== '') {
									output.push('<dt>' + disputeMetaFields[j].title + '</dt>')
									output.push('<dd>' + data.request.custom_fields[i].value + '</dd>')
								}
							}
						output.push('</dl>')
					}
				}
			}

			$('#dispute-details-sidebar').append(output.join(''))
			$('#loader-overlay').hide()

			$('.tab-pane').attr('style', '')
			$('#convo-nav-tab-main').click()

			setTimeout(function () {
				$('.tab-pane').attr('style', '')
				$('#convo-nav-tab-main').click()
			}, 3000)
		}
	})
}

/* Get the side conversation messages. */
function getSideConversationMessages (convoID) {
	const ticketID = urlPartsArray[4]

	$.ajax(zdBrands.main.api + '/tickets/' + ticketID + '/side_conversations/' + convoID + '?include=events', {
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json',
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		success: function (data) {
			let output = []

            output.push('<div class="dispute-participant-list d-none">')
                const convoUsers = JSON.parse(sessionStorage.convoUsers)

                for (let i in data.side_conversation.participants) {
                    output.push('<div class="participant">')
						if (
							/@odesk.com\s*$/.test(data.side_conversation.participants[i].email) ||
							/@upwork.com\s*$/.test(data.side_conversation.participants[i].email) ||
							/@cloud.upwork.com\s*$/.test(data.side_conversation.participants[i].email)
						) {
                            if (convoUsers[data.side_conversation.participants[i].user_id]) {
                                output.push(convoUsers[data.side_conversation.participants[i].user_id].name)
                            } else {
                                output.push('Upwork')
                            }
                        } else {
                            output.push(data.side_conversation.participants[i].name)
                        }
                    output.push('</div>')
                }
            output.push('</div>')

            output.push('<div class="dispute-subject d-none">')
                output.push(data.side_conversation.subject)
            output.push('</div>')
            output.push('<div class="dispute-created d-none">')
                output.push(data.side_conversation.created_at)
            output.push('</div>')
            output.push('<div class="dispute-updated d-none">')
                output.push(data.side_conversation.updated_at)
            output.push('</div>')

            for (let i in data.events) {
                output.push('<div class="comments-container">')
                	output.push(formatSideConvoMessages(data.events[i]))
				output.push('</div>')
            }

            if ($('#request-details-status span').text().trim() !== 'Solved') {
				output.push('<div class="comment-form">')
					output.push('<div class="row">')
						output.push('<div class="col-12">')
							output.push('<div class="comment-textarea">')
								output.push('<textarea id="convo-reply-' + convoID + '" placeholder="" aria-required="true" aria-label="Add your reply"></textarea>')
							output.push('</div>')
						output.push('</div>')
					output.push('</div>')

					output.push('<div class="row">')
						output.push('<div class="col-6">')
						output.push('</div>')
						output.push('<div class="col-6">')
							output.push('<div class="comment-form-controls">')
								output.push('<input class="btn btn-convo-submit" type="submit" data-convo-id="' + convoID + '" value="Submit">')
							output.push('</div>')
						output.push('</div>')
					output.push('</div>')
				output.push('</div>')
            }

            $('#convo-tab-pane-' + convoID).append(output.join(''))

            $('#participant-list').html('')
            for (let i in data.side_conversation.participants) {
				if (
					/@odesk.com\s*$/.test(data.side_conversation.participants[i].email) ||
					/@upwork.com\s*$/.test(data.side_conversation.participants[i].email) ||
					/@cloud.upwork.com\s*$/.test(data.side_conversation.participants[i].email)
				) {
					if (convoUsers[data.side_conversation.participants[i].user_id]) {
                        $('#participant-list').append('<li>' + convoUsers[data.side_conversation.participants[i].user_id].name + '</li>')
                    } else {
                        $('#participant-list').append('<li>Upwork</li>')
                    }
				} else {
                    $('#participant-list').append('<li>' + data.side_conversation.participants[i].name + '</li>')
				}
            }

            $('#dispute-details-created dd time').text(formatDateMDY(data.side_conversation.created_at))
            $('#dispute-details-updated dd time').text(formatDateMDY(data.side_conversation.updated_at))

			$('#loader-overlay').hide()
		}
	})
}

/* Format side conversation messages. */
function formatSideConvoMessages (convo) {
	let output = []
	const convoUsers = JSON.parse(sessionStorage.convoUsers)

	if (convo.message !== null) {
		output.push('<div class="comment">')
			output.push('<div class="comment-avatar">')
				if (
					/@odesk.com\s*$/.test(convo.actor.email) ||
					/@upwork.com\s*$/.test(convo.actor.email) ||
					/@cloud.upwork.com\s*$/.test(convo.actor.email)
				) {
					output.push('<div class="icon-svg-logo-circle"></div>')
				} else {
					output.push('<div class="icon-svg-avatar"></div>')
				}
			output.push('</div>')
			output.push('<div class="comment-wrapper">')
				output.push('<div class="comment-author-name">')
					if (
						/@odesk.com\s*$/.test(convo.actor.email) ||
						/@upwork.com\s*$/.test(convo.actor.email) ||
						/@cloud.upwork.com\s*$/.test(convo.actor.email)
					) {
						if (convoUsers[convo.actor.user_id]) {
							output.push(convoUsers[convo.actor.user_id].name)
						} else {
							output.push('Upwork')
						}
					} else {
						output.push(convo.actor.name)
					}
				output.push('</div>')
				output.push('<div class="comment-date">')
					output.push('<small>' + formatDateTime(convo.created_at) + '</small>')
				output.push('</div>')
				output.push('<div class="comment-body">')
					output.push(convo.message.html_body)
				output.push('</div>')
			output.push('</div>')
		output.push('</div>')

		if (convo.message.attachments.length > 0) {
			output.push('<ul class="attachment-list">')
				for (let i in convo.message.attachments) {

					output.push('<li class="attachment-item">')
						output.push('<a href="' + convo.message.attachments[i].content_url + '" target="_blank">')
							output.push('<span class="air-icon-attach"></span>')
							output.push(convo.message.attachments[i].file_name)
						output.push('</a>')
						output.push('<div class="attachment-meta">')
							output.push('<small>(')

							let fileSize = convo.message.attachments[i].size / 1024
							if (fileSize <= 1024) {
								output.push(fileSize.toFixed(2) + ' KB')
							} else {
								fileSize = fileSize / 1024
								output.push(fileSize.toFixed(2) + ' MB')
							}

							output.push(')</small>')
						output.push('</div>')
					output.push('</li>')

				}
			output.push('</ul>')
		}
	}

	return output.join('')
}

/* Submit side conversation reply messages. */
function submitSideConvoReply (convoID, subject, message) {
	const ticketID = urlPartsArray[4]
	const postData = '{"message":{"subject":"' + subject + '","body":"' + message + '"}}'

	$.ajax(zdBrands.main.api + '/tickets/' + ticketID + '/side_conversations/' + convoID + '/reply', {
		type: 'POST',
		dataType: 'json',
		data: postData,
		contentType: 'application/json',
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		success: function (data) {
			$('#convo-tab-pane-' + data.side_conversation.id).find('.comment').last().after(formatSideConvoMessages(data.event))
			$('#convo-tab-pane-' + data.side_conversation.id).find('textarea').val('')
		}
	})
}

jQuery(function () {
	if (detectPageTemplates('request-single')) {
		const ticketID = urlPartsArray[4]

		populateAgents()

		getSideConversations(ticketID)

		$('main').on('click', '.nav-tabs-dispute .nav-item .nav-link', function () {
			let convoID = $(this).attr('id')

			convoID = convoID.replace('convo-nav-tab-','')

			if (convoID === 'main') {
				populateParticipants(
					$('#request-details-requester dd').text(),
					$('#request-details-collaborators dd').children('#request-collaborators').html(),
					$('#request-details-assignee dd').text()
				)

				$('#dispute-details-created dd time').text(formatDateMDY($('#request-details-created dd time').text()))
				$('#dispute-details-updated dd time').text(formatDateMDY($('#request-details-updated dd time').text()))
			} else {
				if ($('#convo-tab-pane-' + convoID + ' .comment').length < 1) {
					$('#loader-overlay').show()
					getSideConversationMessages(convoID)
				} else {
					$('#participant-list').html('')
					$('#convo-tab-pane-' + convoID + ' .dispute-participant-list .participant').each(function (index, value) {
						$('#participant-list').append('<li>' + $(this).text() + '</li>')
					})

					$('#dispute-details-created dd time').text(formatDateMDY($('#convo-tab-pane-' + convoID + ' .dispute-created').text()))
					$('#dispute-details-updated dd time').text(formatDateMDY($('#convo-tab-pane-' + convoID + ' .dispute-updated').text()))
				}
			}
		})

		$('main').on('click', '.btn-convo-submit', function () {
			let subject = $(this).parents().eq(7).find('.dispute-subject').html()
			let message = $(this).parents().eq(3).find('textarea').val()

			submitSideConvoReply($(this).attr('data-convo-id'), subject, message)
		})
	}
})

jQuery(function () {
	if (getQueryParam('action')) {
		if (
			getQueryParam('action') === 'get-in-touch'
		) {
			if (isUserAnonymous()) {
				window.location.href = '/login?return_to=' + encodeURIComponent(window.location.href)
			}
		}
	}
})

/* Open Chatbot widget. */
function openChatbot () {
	if (getCookie(upworkConfig.cookies.prefix + 'status-widget-visibility') === 'true') {
		statusWidget('btn-next-bot', 'Contact support')
		Forethought('widget', 'hide')
	} else {
		initChatbot()
	}
}

/* Initialize Chatbot widget. */
function initChatbot () {
	Forethought('widget', 'show')
	Forethought('widget', 'open')
}

/* Initialize delayed Chatbot widget. */
function initDelayedChatbot () {
	setTimeout(function () {
		initChatbot()
	}, 3000)
}

/* Setup fallback Chatbot meta for logged in users. */
function fallbackChatbotUserMeta () {
	let chatbotMeta = {
		'logged': true,
		'email': HelpCenter.user.email,
		'name': HelpCenter.user.name,
		'accesstoken': getAccessToken(),
		'customhandoff': 'launchpad'
	}

	window.upworkHelp = {
		'chatbot': {
			'meta': chatbotMeta
		}
	}

	/* Verify user authenticity. */
	verifyUserAuthenticity()

	/* Setup the chatbot. */
	setupChatbot()
}

/* Verify user authenticity. */
function verifyUserAuthenticity () {
	$.ajax(zdBrands.main.api + '/users/me.json', {
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json',
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		success: function (data) {
			if (getCookie(upworkConfig.cookies.prefix + 'user-info') !== null) {
				let getUserInfo = JSON.parse(getCookie(upworkConfig.cookies.prefix + 'user-info'))
				if (data.user.email !== getUserInfo.useremail) {
					if (getCookie('reset-cookies') === null) {
						setCookieForMins('reset-cookies', true, 5)
						deleteAllCookies()
						window.location = window.location.href
					} else {
						if (getCookie('reset-cookies') !== 'true') {
							setCookieForMins('reset-cookies', true, 5)
							deleteAllCookies()
							window.location = window.location.href
						}
					}
				}
			}
		}
	})
}

/* Setup Chatbot meta for logged in users. */
function setupChatbotUserMeta () {
	setCookieForMins(upworkConfig.cookies.prefix + 'user-sync', true, 10)

	let getUserInfo = JSON.parse(getCookie(upworkConfig.cookies.prefix + 'user-info'))
	let getUserContexts = JSON.parse(getCookie(upworkConfig.cookies.prefix + 'has-user-contexts'))

	let chatbotMeta = {
		'logged': true,
		'email': HelpCenter.user.email,
		'name': HelpCenter.user.name,
		'firstname': getUserInfo.firstname,
		'lastname': getUserInfo.lastname,
		'country': getUserInfo.country,
		'accesstoken': getAccessToken(),
		'hasfreelancer': getUserContexts.freelancer,
		'hasagency': getUserContexts.agency,
		'hasclient': getUserContexts.client,

		/* new */
		'chatroutefreelancer': getCookie(upworkConfig.cookies.prefix + 'freelancer-chat-route') !== null ? getCookie(upworkConfig.cookies.prefix + 'freelancer-chat-route') : 'Freelancer_Support_CX410',
		'chatrouteagency': getCookie(upworkConfig.cookies.prefix + 'agency-chat-route') !== null ? getCookie(upworkConfig.cookies.prefix + 'agency-chat-route') : 'Freelancer_Support_CX410',
		'chatrouteclient': getCookie(upworkConfig.cookies.prefix + 'client-chat-route') !== null ? getCookie(upworkConfig.cookies.prefix + 'client-chat-route') : 'Freelancer_Support_CX410',

		'eligiblephonefreelancer': getCookie(upworkConfig.cookies.prefix + 'freelancer-eligibility-phone'),
		'eligiblechatfreelancer': getCookie(upworkConfig.cookies.prefix + 'freelancer-eligibility-chat'),
		'eligibleticketfreelancer': getCookie(upworkConfig.cookies.prefix + 'freelancer-eligibility-email'),

		'eligiblephoneagency': getCookie(upworkConfig.cookies.prefix + 'agency-eligibility-phone'),
		'eligiblechatagency': getCookie(upworkConfig.cookies.prefix + 'agency-eligibility-chat'),
		'eligibleticketagency': getCookie(upworkConfig.cookies.prefix + 'agency-eligibility-email'),

		'eligiblephoneclient': getCookie(upworkConfig.cookies.prefix + 'client-eligibility-phone'),
		'eligiblechatclient': getCookie(upworkConfig.cookies.prefix + 'client-eligibility-chat'),
		'eligibleticketclient': getCookie(upworkConfig.cookies.prefix + 'client-eligibility-email'),

		'freelancerverified': getCookie(upworkConfig.cookies.prefix + 'freelancer-verified'),
		'freelancerhasearnings': getCookie(upworkConfig.cookies.prefix + 'freelancer-has-earnings'),
		'freelancerhasactivecontact': getCookie(upworkConfig.cookies.prefix + 'freelancer-has-active-contact'),
		'freelancerlearningpath': getCookie(upworkConfig.cookies.prefix + 'freelancer-learning-path'),

		'usertags': HelpCenter.user.tags.join(','),
		/* new */

		/* will be deprecated */
		'usertype': getPrimaryUserType(),
		/* will be deprecated */

		'limitedadmission': getCookie(upworkConfig.cookies.prefix + 'suspensions-nonadmission'),
		'unsuccessfulfl': getCookie(upworkConfig.cookies.prefix + 'suspensions-excessive-disputes'),
		'financialhold': getCookie(upworkConfig.cookies.prefix + 'suspensions-finance-failed-charge'),
		'idbcsuspension': getCookie(upworkConfig.cookies.prefix + 'idbc-suspension'),
		'tdate': formatDateYMDPST(new Date())
	}

	/* will be deprecated */
	if (getPrimaryUserType() === 'CL') {
		chatbotMeta.eligibility = getCookie(upworkConfig.cookies.prefix + 'client-eligibility-email')
		chatbotMeta.eligiblephone = getCookie(upworkConfig.cookies.prefix + 'client-eligibility-phone')
		chatbotMeta.eligiblechat = getCookie(upworkConfig.cookies.prefix + 'client-eligibility-chat')
		chatbotMeta.eligibleticket = getCookie(upworkConfig.cookies.prefix + 'client-eligibility-email')
		chatbotMeta.chatroute = getCookie(upworkConfig.cookies.prefix + 'client-chat-route')
	} else if (getPrimaryUserType() === 'AG') {
		chatbotMeta.eligibility = getCookie(upworkConfig.cookies.prefix + 'agency-eligibility-email')
		chatbotMeta.eligiblephone = getCookie(upworkConfig.cookies.prefix + 'agency-eligibility-phone')
		chatbotMeta.eligiblechat = getCookie(upworkConfig.cookies.prefix + 'agency-eligibility-chat')
		chatbotMeta.eligibleticket = getCookie(upworkConfig.cookies.prefix + 'agency-eligibility-email')
		chatbotMeta.chatroute = getCookie(upworkConfig.cookies.prefix + 'agency-chat-route')
	} else if (getPrimaryUserType() === 'FL') {
		chatbotMeta.eligibility = getCookie(upworkConfig.cookies.prefix + 'freelancer-eligibility-email')
		chatbotMeta.eligiblephone = getCookie(upworkConfig.cookies.prefix + 'freelancer-eligibility-phone')
		chatbotMeta.eligiblechat = getCookie(upworkConfig.cookies.prefix + 'freelancer-eligibility-chat')
		chatbotMeta.eligibleticket = getCookie(upworkConfig.cookies.prefix + 'freelancer-eligibility-email')
		chatbotMeta.chatroute = getCookie(upworkConfig.cookies.prefix + 'freelancer-chat-route')
	}
	/* will be deprecated */

	window.upworkHelp = {
		'chatbot': {
			'meta': chatbotMeta
		}
	}

	window.usabilla_live('data',
		{
			'custom': {
				'user_uid': getCookie(upworkConfig.cookies.prefix + 'user'),
				'org_uid': getCookie(upworkConfig.cookies.current_organization_uid)
			}
		}
	)

	/* Verify user authenticity. */
	verifyUserAuthenticity()

	/* Setup custom handoff for chatbot. */
	customHandoff()

	/* Setup the chatbot. */
	setupChatbot()
}

/* Setup custom handoff for chatbot. */
function customHandoff () {
	let chatbotMeta = {}
	chatbotMeta = window.upworkHelp.chatbot.meta

	/**
	 * Custom Handoff Logic goes here.
	*/

	window.upworkHelp.chatbot.meta = chatbotMeta
}

/* Setup metadata for chatbot. */
function setupChatbotMeta () {
	if (isUserAnonymous()) {
		let chatbotMeta = {}

		window.upworkHelp = {
			'chatbot': {
				'meta': chatbotMeta
			}
		}

		/* Setup the chatbot. */
		setupChatbot()
	}
}

/* Setup the chatbot. */
function setupChatbot () {
	/* Add the contact support page link. */
	addContactSupportLink()

	let chatbotOptions = {
		id: 'upwork-chatbot',
		key: zdBrands.main.chatbot.key,
		track: false
	}
	loadScript(zdBrands.main.chatbot.script, 'chatbot', chatbotOptions, function () {
		setTimeout(function () {
			applyThrottles()
		}, 1500)
		setTimeout(function () {
			applyThrottles()
		}, 5000)
	})
}

jQuery(function () {

	/* Setup metadata for chatbot. */
	setupChatbotMeta()

	/* Initialize Chatbot. */
	$('body').on('click', '.btn-support-bot, .btn-link-chatbot', function () {
		openChatbot()
	})

	/* Initialize Chatbot widget from status widget. */
	$('#confirmation-modal').on('click', '.btn-next-bot', function () {
		$('#confirmation-modal').modal('hide')
		initChatbot()
	})
})

/* Submit user request. */
function submitRequest (requesterEmail, requestSubject, requestBody, requestTags, customFields, messageTitle, errorMessage, successMessage, returnURL = '') {
	$.ajax(zdBrands.main.api + '/users/me.json', {
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json',
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		success: function (data) {
			let requestData = {
				'request': {
					'requester': {
						'email': requesterEmail
					},
					'subject': requestSubject,
					'comment': {
						'body': requestBody
					},
					'tags': requestTags,
					'custom_fields': customFields
				}
			}
			$.ajax(zdBrands.main.api + '/requests.json', {
				type: 'POST',
				data: JSON.stringify(requestData),
				dataType: 'json',
				contentType: 'application/json',
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				headers: {
					'X-CSRF-Token': data.user.authenticity_token
				},
				error: function (data) {
					$('#confirmation-modal .modal-title').text(messageTitle)
					$('#confirmation-modal .modal-body').html(errorMessage)
					if (returnURL !== '') {
						$('#confirmation-modal .modal-footer .btn-action').replaceWith('<a href="' + returnURL + '" class="btn btn-primary">Close</a>')
						$('#confirmation-modal .modal-footer .btn-link').hide()
					}
					$('#confirmation-modal').modal('show')
				},
				success: function (data) {
					$('#confirmation-modal .modal-title').text(messageTitle)
					$('#confirmation-modal .modal-body').html(successMessage)
					if (returnURL !== '') {
						$('#confirmation-modal .modal-footer .btn-action').replaceWith('<a href="' + returnURL + '" class="btn btn-primary">Close</a>')
						$('#confirmation-modal .modal-footer .btn-link').hide()
					}
					$('#confirmation-modal').modal('show')
				}
			})
		}
	})
}

jQuery(function () {
	/* Add text to file uploader. */
	$('#upload-dropzone span').html('Add file')
})

/* Status widget. */
function statusWidget (btnClass, btnText) {
	let getStatus = JSON.parse(getCookie(upworkConfig.cookies.prefix + 'status-widget'))
	let incident
	if (getStatus.incidents.length > 0) {
		incident = getStatus.incidents[0]
	} else {
		incident = getStatus.maintenance.active[0]
	}

	let incidentDate = new Date(incident.datetime_open)
	let getIncidentDate = new Date(incidentDate.getTime() + ((incidentDate.getTimezoneOffset() / 60) * 3600 * 1000))

	let statusText = ''
	let selectItem = incident.messages.length - 1
	switch (incident.messages[selectItem].status) {
		case 200:
			contextuals = 'info'
			statusText = 'Maintenance'
			break
		case 300:
			contextuals = 'warning'
			statusText = 'Degraded Performance'
			break
		case 400:
			contextuals = 'warning'
			statusText = 'Partial Service Disruption'
			break
		case 500:
			contextuals = 'danger'
			statusText = 'Service Disruption'
			break
	}

	let affectedContainers = ''
	for (let i in incident.containers_affected) {
		affectedContainers += incident.containers_affected[i].name + ', '
	}
	affectedContainers = affectedContainers.slice(0, -2)

	let affectedComponents = ''
	for (let i in incident.components_affected) {
		affectedComponents += incident.components_affected[i].name + ', '
	}
	affectedComponents = affectedComponents.slice(0, -2)

	let incidentMessages = ''
	for (let i in incident.messages) {
		let messageDate = new Date(incident.messages[i].datetime)
		let getMessageDate = new Date(messageDate.getTime() + ((messageDate.getTimezoneOffset() / 60) * 3600 * 1000))

		let messagesStatus = ''
		switch (incident.messages[i].state) {
			case 100:
				messagesStatus = '<strong>[Investigating]</strong> '
				break
			case 200:
				messagesStatus = '<strong>[Identified]</strong> '
				break
			case 300:
				messagesStatus = '<strong>[Monitoring]</strong> '
				break
			case 400:
				messagesStatus = '<strong>[Resolved]</strong> '
				break
		}

		incidentMessages += '<div class="row">'
		incidentMessages += '<div class="col-12">'
		incidentMessages += '<h4>' + getMessageDate.toDateString() + ' ' + getMessageDate.toLocaleTimeString() + ' UTC</h4>'
		incidentMessages += '</div>'
		incidentMessages += '<div class="col-12">'
		incidentMessages += '<p>' + messagesStatus + incident.messages[i].details + '</p>'
		incidentMessages += '</div>'
		incidentMessages += '</div>'
	}

	resetConfirmationModal()
	addConfirmationModalBtn(btnClass, btnText)
	$('#confirmation-modal .modal-title').text('Upwork Status')

	let output = []
	output.push('<div class="status-widget-header ' + contextuals + '">')
		output.push('<h2>' + incident.name + '</h2>')
		output.push('<small>' + getIncidentDate.toDateString() + ' ' + getIncidentDate.toLocaleTimeString() + ' UTC' + '</small>')
	output.push('</div>')
	output.push('<dl class="incident-meta">')
		output.push('<dt>Incident Status</dt>')
		output.push('<dd>' + statusText + '</dd>')
	output.push('</dl>')
	output.push('<dl class="incident-meta">')
		output.push('<dt>Components</dt>')
		output.push('<dd>' + affectedComponents + '</dd>')
	output.push('</dl>')
	output.push('<dl class="incident-meta">')
		output.push('<dt>Locations</dt>')
		output.push('<dd>' + affectedContainers + '</dd>')
	output.push('</dl>')
	output.push('<div class="incident-messages">')
		output.push(incidentMessages)
	output.push('</div>')
	$('#confirmation-modal .modal-body').html(output.join(''))
	$('#confirmation-modal').modal('show')
}

/* Generate help navigator. */
function generateHelpNavigator () {
	let output = []
	let itemCount = 0

	if ($('#article-body h3').length > 0 || $('.accordion-navigator').length > 0) {
		if ($('#article-body h3').length > 0) {
			$('#article-body h3').each(function (index, element) {
				$(element).attr('id', 'article-topic-' + itemCount)
				output.push('<li class="nav-item">')
					output.push('<a href="#article-topic-' + itemCount + '" class="nav-link">')
						output.push($(element).text())
					output.push('</a>')
				output.push('</li>')
				itemCount++
			})
		}

		if ($('.accordion-navigator').length > 0) {
			$('.accordion-navigator').each(function (index, element) {
				$(element).attr('id', 'article-topic-' + itemCount)
				output.push('<li class="nav-item">')
					output.push('<a href="#article-topic-' + itemCount + '" class="nav-link">')
						output.push('FAQ')
					output.push('</a>')
				output.push('</li>')
				itemCount++
			})
		}
		$('#article-topic-sidebar ul').html(output.join(''))
	} else {
		$('#article-topic-sidebar').remove()
	}
}

/* Adjust the sidebar position. */
function adjustSidebarPosition () {
	let scrollTop = parseInt($(document).scrollTop())
	let navbarHeight = parseInt($('#navbar').outerHeight())
	let pageHeaderHeight = parseInt($('#page-header').outerHeight())
	let sidebarHeight = parseInt($('#article-sidebar').outerHeight())
	let articleHeight = parseInt($('#article-body').outerHeight())

	if (scrollTop >= (navbarHeight + pageHeaderHeight)) {
		$('#article-sidebar').addClass('fixed')
		if (scrollTop >= (navbarHeight + pageHeaderHeight + articleHeight - sidebarHeight)) {
			$('#article-sidebar').css('top', (navbarHeight + pageHeaderHeight + articleHeight - scrollTop - sidebarHeight + 64 + 15))
		}
	} else {
		$('#article-sidebar').removeClass('fixed')
	}
}

jQuery(function () {
	if (detectPageTemplates('articles')) {
		generateHelpNavigator()

		if ($('#article-topic-sidebar ul li').length === 0) {
			$('#article-topic-sidebar').remove()
		} else {
			var scrollSpy = new bootstrap.ScrollSpy('#article-body', {
				target: '#article-topic-sidebar'
			})
		}

		if ($('#section-article-sidebar ul li').length < 2) {
			$('#section-article-sidebar').remove()
		}

		if ($('#recent-article-sidebar ul li').length === 0) {
			$('#recent-article-sidebar').remove()
		}

		$(document).on('click', '#article-topic-sidebar ul > li > a', function () {
			let targetTop = $($(this).attr('href')).offset().top - 150
			$('html').animate({ 'scrollTop': targetTop }, 300)
		})

		$(document).scroll(function () {
			adjustSidebarPosition()
		})

		$('#article-sidebar .sidebar h3').click(function () {
			if ($(this).text() === 'Recently viewed articles') {
				if ($(this).parents().eq(1).hasClass('open')) {
					$(this).parents().eq(1).removeClass('open')
				} else {
					$('#article-sidebar .sidebar').removeClass('open')
					$(this).parents().eq(1).addClass('open')
				}
			} else {
				if ($(this).parents().eq(0).hasClass('open')) {
					$(this).parents().eq(0).removeClass('open')
				} else {
					$('#article-sidebar .sidebar').removeClass('open')
					$(this).parents().eq(0).addClass('open')
				}
			}

			adjustSidebarPosition()
		})
	}
})

/* The enterprise contact section. */
function enterpriseContactSection () {
	output = []

	output.push('<section id="section-banner-enterprise" class="section-banner-enterprise">')

		if (detectPageTemplates('home')) {
			output.push('<div class="container">')
		}
			output.push('<div class="row">')
				output.push('<div class="col-12 col-lg-6">')
					output.push('<div class="banner banner-support banner-margin-mobile">')
						output.push('<div class="text-container">')
							output.push('<h5>Email Us</h5>')
							output.push('<h3>Email Us, we will reach out to you for help.</h3>')
							output.push('<a class="btn btn-default" href="' + zdBrands.main.hc.url + '/requests/new?ticket_form_id=' + enterpriseForm.form + '&src=hc">Email Us</a>')
						output.push('</div>')
						output.push('<div class="image-container">')
							output.push('<img src="https://assets.static-upwork.com/helpcenter/air3/icons/banners/customer-service-female.svg" alt="Get Support">')
						output.push('</div>')
					output.push('</div>')
				output.push('</div>')
				output.push('<div class="col-12 col-lg-6">')
					output.push('<div class="banner banner-blue banner-support">')
						output.push('<div class="text-container">')
							output.push('<h5>Call Us</h5>')
							output.push('<h3>Call our Customer Support agents instantly.</h3>')
							output.push('<button class="btn btn-primary btn-call-us" onclick="showENTCallUsModal()">Call Us</button>')
						output.push('</div>')
						output.push('<div class="image-container">')
							output.push('<img src="https://assets.static-upwork.com/helpcenter/air3/icons/banners/customer-service-female.svg" alt="Get Support">')
						output.push('</div>')
					output.push('</div>')
				output.push('</div>')
			output.push('</div>')

		if (detectPageTemplates('home')) {
			output.push('</div>')
		}

	output.push('</section>')

	return output.join('')
}

/* The enterprise home contact section. */
function enterpriseHomeContactSection () {
	$('#popular-topics-nav-tabs').after(enterpriseContactSection())
}

/* Setup the enterprise landing page. */
function enterpriseLandingPage () {
	if (detectPageTemplates('home')) {
		$('#popular-topics-nav-tabs h2').text(' Where are you experiencing a problem?')

		let output = []
		output.push('<li class="nav-item" role="presentation">')
			output.push('<button id="popular-topics-nav-tab-enterprise" class="nav-link" data-bs-toggle="tab" data-bs-target="#popular-topics-tab-pane-enterprise" type="button" role="tab" aria-controls="popular-topics-tab-pane-enterprise" aria-selected="false">')
				output.push('An Enterprise client profile')
			output.push('</button>')
		output.push('</li>')
		output.push('<li class="nav-item" role="presentation">')
			output.push('<button id="popular-topics-nav-tab-freelancer" class="nav-link" data-bs-toggle="tab" data-bs-target="#popular-topics-tab-pane-freelancer" type="button" role="tab" aria-controls="popular-topics-tab-pane-freelancer" aria-selected="false">')
				output.push('A freelancer profile')
			output.push('</button>')
		output.push('</li>')
		$('#popular-topics-nav-tabs .nav-tabs-container .nav-tabs').html(output.join(''))

		$('#section-banner-enterprise').remove()

		enterpriseHomeContactSection()

		$('#popular-topics-nav-tabs .nav-item .nav-link').click(function () {
			let getTheScope = $(this).attr('id').replace('popular-topics-nav-tab-', '')
			setCookieForHours(upworkConfig.cookies.prefix + 'user-tab', getTheScope, 1)

			$('.tab-pane').hide()
			$('#popular-topics-nav-tabs .nav-tabs .nav-item .nav-link').removeClass('active')
			$('#popular-topics-nav-tab-' + getTheScope).addClass('active')
			$('#popular-topics-tab-pane-' + getTheScope).show()

			getInstantHelps(getTheScope)
			getRecommendedTopics(getTheScope)
			getCommonSearches(getTheScope)
			updateWebinarLink()
		})

		clickPopularTopicNavTab('enterprise')
	}
}

/* Setup the enterprise search page. */
function enterpriseSearchPage() {
	if (detectPageTemplates('search')) {
		let output = []
		output.push('<li class="nav-item" role="presentation">')
			output.push('<button id="search-topics-nav-tab-enterprise" class="nav-link" data-bs-toggle="tab" data-bs-target="#search-topics-tab-pane-enterprise" type="button" role="tab" aria-controls="search-topics-tab-pane-enterprise" aria-selected="false">')
				output.push('An Enterprise client profile')
			output.push('</button>')
		output.push('</li>')
		output.push('<li class="nav-item" role="presentation">')
			output.push('<button id="search-topics-nav-tab-freelancer" class="nav-link" data-bs-toggle="tab" data-bs-target="#search-topics-tab-pane-freelancer" type="button" role="tab" aria-controls="search-topics-tab-pane-freelancer" aria-selected="false">')
				output.push('A freelancer profile')
			output.push('</button>')
		output.push('</li>')
		$('#search-topics-nav-tabs .nav-tabs-container .nav-tabs').html(output.join(''))

		$('#search-topics-nav-tabs .nav-item .nav-link').click(function () {
			let getTheScope = $(this).attr('id').replace('search-topics-nav-tab-', '')
			setCookieForHours(upworkConfig.cookies.prefix + 'user-tab', getTheScope, 1)

			loadSearchResults(getTheScope)
		})
	}
}

/* Show the call us modal for enterprise support. */
function showENTCallUsModal () {
	resetConfirmationModal()
	$('#confirmation-modal .modal-title').text('Enterprise support')

	let output = []
	output.push('<div class="contact-flow-call-us-widget">')
		output.push('<h4 class="heading-brand text-center">Call us on the phone!</h4>')
		output.push('<p class="text-center">')
			output.push('You can reach our agents <strong>Monday to Friday,</strong> from 12 am to 11:59 pm (PST) at')
		output.push('</p>')
		output.push('<h4 class="heading-brand text-center">+1 (855) 917-3076</h4>')
	output.push('</div>')
	$('#confirmation-modal .modal-body').html(output.join(''))

	$('#confirmation-modal').modal('show')
	$('#confirmation-modal .modal-footer').remove()
}

/* Add the contact support page link. */
function addContactSupportLink () {
	if ($('#navbar-menu-desktop .nav .nav-item:last-child .nav-link').html() !== 'Contact Support') {
		$('#navbar-menu-desktop .nav .nav-item:last-child').after('<li class="nav-item"><a class="nav-link" href="' + zdBrands.main.hc.url + '/requests/new?ticket_form_id=' + defaultForm.form + '">Contact Support</a></li>')
	}

	if ($('.nav-item-contact .nav-link').text().trim() !== 'Contact Support') {
		$('#mobileNavbarDropdown').parents().eq(0).after('<li class="nav-item nav-item-contact"><a class="nav-link" href="' + zdBrands.main.hc.url + '/requests/new?ticket_form_id=' + defaultForm.form + '">Contact Support</a></li>')
	}
}

/* The enterprise contact section. */
function nonEnterpriseContactSection () {
	output = []

	output.push('<section id="section-banner-contact" class="section-banner-contact">')
		output.push('<div class="banner banner-blue banner-contact">')
			output.push('<div class="text-container">')
				output.push('<h5>Upwork Help</h5>')
				output.push('<h3>Do you need additional help?</h3>')
				output.push('<a href="' + zdBrands.main.hc.url + '/requests/new?ticket_form_id=' + defaultForm.form + '" target="_blank" class="btn">Contact Support</a>')
			output.push('</div>')
			output.push('<div class="image-container">')
				output.push('<img src="https://assets.static-upwork.com/helpcenter/air3/icons/banners/customer-service-female.svg" alt="Contact Support">')
			output.push('</div>')
		output.push('</div>')
    output.push('</section>')

	return output.join('')
}
