// node_modules/@ionic/core/components/helpers.js
var transitionEndAsync = (el, expectedDuration = 0) => {
  return new Promise((resolve) => {
    transitionEnd(el, expectedDuration, resolve);
  });
};
var transitionEnd = (el, expectedDuration = 0, callback) => {
  let unRegTrans;
  let animationTimeout;
  const opts = { passive: true };
  const ANIMATION_FALLBACK_TIMEOUT = 500;
  const unregister = () => {
    if (unRegTrans) {
      unRegTrans();
    }
  };
  const onTransitionEnd = (ev) => {
    if (ev === void 0 || el === ev.target) {
      unregister();
      callback(ev);
    }
  };
  if (el) {
    el.addEventListener("webkitTransitionEnd", onTransitionEnd, opts);
    el.addEventListener("transitionend", onTransitionEnd, opts);
    animationTimeout = setTimeout(onTransitionEnd, expectedDuration + ANIMATION_FALLBACK_TIMEOUT);
    unRegTrans = () => {
      if (animationTimeout !== void 0) {
        clearTimeout(animationTimeout);
        animationTimeout = void 0;
      }
      el.removeEventListener("webkitTransitionEnd", onTransitionEnd, opts);
      el.removeEventListener("transitionend", onTransitionEnd, opts);
    };
  }
  return unregister;
};
var componentOnReady = (el, callback) => {
  if (el.componentOnReady) {
    el.componentOnReady().then((resolvedEl) => callback(resolvedEl));
  } else {
    raf(() => callback(el));
  }
};
var hasLazyBuild = (stencilEl) => {
  return stencilEl.componentOnReady !== void 0;
};
var inheritAttributes = (el, attributes = []) => {
  const attributeObject = {};
  attributes.forEach((attr) => {
    if (el.hasAttribute(attr)) {
      const value = el.getAttribute(attr);
      if (value !== null) {
        attributeObject[attr] = el.getAttribute(attr);
      }
      el.removeAttribute(attr);
    }
  });
  return attributeObject;
};
var ariaAttributes = [
  "role",
  "aria-activedescendant",
  "aria-atomic",
  "aria-autocomplete",
  "aria-braillelabel",
  "aria-brailleroledescription",
  "aria-busy",
  "aria-checked",
  "aria-colcount",
  "aria-colindex",
  "aria-colindextext",
  "aria-colspan",
  "aria-controls",
  "aria-current",
  "aria-describedby",
  "aria-description",
  "aria-details",
  "aria-disabled",
  "aria-errormessage",
  "aria-expanded",
  "aria-flowto",
  "aria-haspopup",
  "aria-hidden",
  "aria-invalid",
  "aria-keyshortcuts",
  "aria-label",
  "aria-labelledby",
  "aria-level",
  "aria-live",
  "aria-multiline",
  "aria-multiselectable",
  "aria-orientation",
  "aria-owns",
  "aria-placeholder",
  "aria-posinset",
  "aria-pressed",
  "aria-readonly",
  "aria-relevant",
  "aria-required",
  "aria-roledescription",
  "aria-rowcount",
  "aria-rowindex",
  "aria-rowindextext",
  "aria-rowspan",
  "aria-selected",
  "aria-setsize",
  "aria-sort",
  "aria-valuemax",
  "aria-valuemin",
  "aria-valuenow",
  "aria-valuetext"
];
var inheritAriaAttributes = (el, ignoreList) => {
  let attributesToInherit = ariaAttributes;
  if (ignoreList && ignoreList.length > 0) {
    attributesToInherit = attributesToInherit.filter((attr) => !ignoreList.includes(attr));
  }
  return inheritAttributes(el, attributesToInherit);
};
var addEventListener = (el, eventName, callback, opts) => {
  var _a;
  if (typeof window !== "undefined") {
    const win = window;
    const config = (_a = win === null || win === void 0 ? void 0 : win.Ionic) === null || _a === void 0 ? void 0 : _a.config;
    if (config) {
      const ael = config.get("_ael");
      if (ael) {
        return ael(el, eventName, callback, opts);
      } else if (config._ael) {
        return config._ael(el, eventName, callback, opts);
      }
    }
  }
  return el.addEventListener(eventName, callback, opts);
};
var removeEventListener = (el, eventName, callback, opts) => {
  var _a;
  if (typeof window !== "undefined") {
    const win = window;
    const config = (_a = win === null || win === void 0 ? void 0 : win.Ionic) === null || _a === void 0 ? void 0 : _a.config;
    if (config) {
      const rel = config.get("_rel");
      if (rel) {
        return rel(el, eventName, callback, opts);
      } else if (config._rel) {
        return config._rel(el, eventName, callback, opts);
      }
    }
  }
  return el.removeEventListener(eventName, callback, opts);
};
var getElementRoot = (el, fallback = el) => {
  return el.shadowRoot || fallback;
};
var raf = (h) => {
  if (typeof __zone_symbol__requestAnimationFrame === "function") {
    return __zone_symbol__requestAnimationFrame(h);
  }
  if (typeof requestAnimationFrame === "function") {
    return requestAnimationFrame(h);
  }
  return setTimeout(h);
};
var hasShadowDom = (el) => {
  return !!el.shadowRoot && !!el.attachShadow;
};
var findItemLabel = (componentEl) => {
  const itemEl = componentEl.closest("ion-item");
  if (itemEl) {
    return itemEl.querySelector("ion-label");
  }
  return null;
};
var focusVisibleElement = (el) => {
  el.focus();
  if (el.classList.contains("ion-focusable")) {
    const app = el.closest("ion-app");
    if (app) {
      app.setFocus([el]);
    }
  }
};
var getAriaLabel = (componentEl, inputId) => {
  let labelText;
  const labelledBy = componentEl.getAttribute("aria-labelledby");
  const componentId = componentEl.id;
  let labelId = labelledBy !== null && labelledBy.trim() !== "" ? labelledBy : inputId + "-lbl";
  let label = labelledBy !== null && labelledBy.trim() !== "" ? document.getElementById(labelledBy) : findItemLabel(componentEl);
  if (label) {
    if (labelledBy === null) {
      label.id = labelId;
    }
    labelText = label.textContent;
    label.setAttribute("aria-hidden", "true");
  } else if (componentId.trim() !== "") {
    label = document.querySelector(`label[for="${componentId}"]`);
    if (label) {
      if (label.id !== "") {
        labelId = label.id;
      } else {
        label.id = labelId = `${componentId}-lbl`;
      }
      labelText = label.textContent;
    }
  }
  return { label, labelId, labelText };
};
var renderHiddenInput = (always, container, name, value, disabled) => {
  if (always || hasShadowDom(container)) {
    let input = container.querySelector("input.aux-input");
    if (!input) {
      input = container.ownerDocument.createElement("input");
      input.type = "hidden";
      input.classList.add("aux-input");
      container.appendChild(input);
    }
    input.disabled = disabled;
    input.name = name;
    input.value = value || "";
  }
};
var clamp = (min, n, max) => {
  return Math.max(min, Math.min(n, max));
};
var assert = (actual, reason) => {
  if (!actual) {
    const message = "ASSERT: " + reason;
    console.error(message);
    debugger;
    throw new Error(message);
  }
};
var now = (ev) => {
  return ev.timeStamp || Date.now();
};
var pointerCoord = (ev) => {
  if (ev) {
    const changedTouches = ev.changedTouches;
    if (changedTouches && changedTouches.length > 0) {
      const touch = changedTouches[0];
      return { x: touch.clientX, y: touch.clientY };
    }
    if (ev.pageX !== void 0) {
      return { x: ev.pageX, y: ev.pageY };
    }
  }
  return { x: 0, y: 0 };
};
var isEndSide = (side) => {
  const isRTL = document.dir === "rtl";
  switch (side) {
    case "start":
      return isRTL;
    case "end":
      return !isRTL;
    default:
      throw new Error(`"${side}" is not a valid value for [side]. Use "start" or "end" instead.`);
  }
};
var debounceEvent = (event, wait) => {
  const original = event._original || event;
  return {
    _original: event,
    emit: debounce(original.emit.bind(original), wait)
  };
};
var debounce = (func, wait = 0) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(func, wait, ...args);
  };
};
var shallowEqualStringMap = (map1, map2) => {
  map1 !== null && map1 !== void 0 ? map1 : map1 = {};
  map2 !== null && map2 !== void 0 ? map2 : map2 = {};
  if (map1 === map2) {
    return true;
  }
  const keys1 = Object.keys(map1);
  if (keys1.length !== Object.keys(map2).length) {
    return false;
  }
  for (const k1 of keys1) {
    if (!(k1 in map2)) {
      return false;
    }
    if (map1[k1] !== map2[k1]) {
      return false;
    }
  }
  return true;
};

export {
  transitionEndAsync,
  componentOnReady,
  hasLazyBuild,
  inheritAttributes,
  inheritAriaAttributes,
  addEventListener,
  removeEventListener,
  getElementRoot,
  raf,
  hasShadowDom,
  findItemLabel,
  focusVisibleElement,
  getAriaLabel,
  renderHiddenInput,
  clamp,
  assert,
  now,
  pointerCoord,
  isEndSide,
  debounceEvent,
  shallowEqualStringMap
};
/*! Bundled license information:

@ionic/core/components/helpers.js:
  (*!
   * (C) Ionic http://ionicframework.com - MIT License
   *)
*/
//# sourceMappingURL=chunk-REPSWCQI.js.map
