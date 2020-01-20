import Vue from 'vue';
import Component, { createDecorator } from 'vue-class-component';
import Vuex from 'vuex';
import service from '@/client';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

/** vue-property-decorator verson 8.2.2 MIT LICENSE copyright 2019 kaorun343 */
/** @see {@link https://github.com/vuejs/vue-class-component/blob/master/src/reflect.ts} */
var reflectMetadataIsSupported = typeof Reflect !== 'undefined' && typeof Reflect.getMetadata !== 'undefined';
function applyMetadata(options, target, key) {
    if (reflectMetadataIsSupported) {
        if (!Array.isArray(options) &&
            typeof options !== 'function' &&
            typeof options.type === 'undefined') {
            options.type = Reflect.getMetadata('design:type', target, key);
        }
    }
}
/**
 * decorator of a prop
 * @param  options the options for the prop
 * @return PropertyDecorator | void
 */
function Prop(options) {
    if (options === void 0) { options = {}; }
    return function (target, key) {
        applyMetadata(options, target, key);
        createDecorator(function (componentOptions, k) {
            (componentOptions.props || (componentOptions.props = {}))[k] = options;
        })(target, key);
    };
}

var ListBanners = /** @class */ (function (_super) {
    __extends(ListBanners, _super);
    function ListBanners() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Prop()
    ], ListBanners.prototype, "banner");
    ListBanners = __decorate([
        Component({
            components: {}
        })
    ], ListBanners);
    return ListBanners;
}(Vue));

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = ListBanners;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "item-banner" }, [
    _c("div", { staticClass: "item-banner__container" }, [
      _c(
        "div",
        { staticClass: "item-banner__img-wrapper" },
        [
          _c("IMG", {
            staticClass: "item-banner__img",
            attrs: { src: _vm.banner.bannerImageUrl }
          })
        ],
        1
      ),
      _c("div", { staticClass: "item-banner__info" }, [
        _vm.banner.bannerDate
          ? _c(
              "div",
              {
                staticClass:
                  "item-banner__info-item item-banner__info-item_banner-date"
              },
              [
                _c("div", { staticClass: "item-banner__title" }, [
                  _vm._v("Banner Date: "),
                  _c("span", { staticClass: "item-banner__text" }, [
                    _vm._v(_vm._s(_vm.banner.bannerDate))
                  ])
                ])
              ]
            )
          : _vm._e(),
        _vm.banner.createdAt
          ? _c(
              "div",
              {
                staticClass:
                  "item-banner__info-item item-banner__info-item_created-at"
              },
              [
                _c("div", { staticClass: "item-banner__title" }, [
                  _vm._v("Created At: "),
                  _c("span", { staticClass: "item-banner__text" }, [
                    _vm._v(_vm._s(_vm.banner.createdAt))
                  ])
                ])
              ]
            )
          : _vm._e()
      ])
    ])
  ])
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-d7ef2942_0", { source: ".item-banner__container[data-v-d7ef2942] {\n  display: flex;\n  justify-content: center;\n  flex-wrap: wrap;\n  width: 100%;\n  height: 100%;\n}\n.item-banner__img-wrapper[data-v-d7ef2942] {\n  position: relative;\n  width: 80%;\n  height: 80%;\n  overflow: hidden;\n  margin-bottom: 50px;\n}\n.item-banner__img[data-v-d7ef2942] {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  max-width: 100%;\n  max-height: 100%;\n}\n.item-banner__info-item[data-v-d7ef2942] {\n  display: flex;\n}\n.item-banner__title[data-v-d7ef2942] {\n  font-weight: 700;\n}\n.item-banner__text[data-v-d7ef2942] {\n  font-weight: 300;\n}\n", map: {"version":3,"sources":["/Users/kaisa/prj/banners-service/src/components/ItemBanner.vue","ItemBanner.vue"],"names":[],"mappings":"AAiCA;EACA,aAAA;EACA,uBAAA;EACA,eAAA;EACA,WAAA;EACA,YAAA;AChCA;ADkCA;EACA,kBAAA;EACA,UAAA;EACA,WAAA;EACA,gBAAA;EACA,mBAAA;AChCA;ADkCA;EACA,kBAAA;EACA,QAAA;EACA,SAAA;EACA,gCAAA;EACA,eAAA;EACA,gBAAA;AChCA;ADkCA;EACA,aAAA;AChCA;ADkCA;EACA,gBAAA;AChCA;ADkCA;EACA,gBAAA;AChCA","file":"ItemBanner.vue","sourcesContent":["<template lang=\"pug\">\n  include ../tools/bemto.pug\n\n  +b.item-banner\n    +e.container\n      +e.img-wrapper\n        IMG.item-banner__img(:src=\"banner.bannerImageUrl\")\n      +e.info\n        +e.info-item._banner-date(v-if=\"banner.bannerDate\")\n          +e.title Banner Date:&nbsp;<span class=\"item-banner__text\">{{ banner.bannerDate }}</span>\n        +e.info-item._created-at(v-if=\"banner.createdAt\")\n          +e.title Created At:&nbsp;<span class=\"item-banner__text\">{{ banner.createdAt }}</span>\n</template>\n\n<script lang=\"ts\">\nimport { Vue, Component, Prop } from '../../node_modules/vue-property-decorator/lib/vue-property-decorator'\nimport { Banner } from '../models'\n\n@Component({\n  components: {\n  }\n})\n\nexport default class ListBanners extends Vue {\n  @Prop() banner!: Object\n}\n</script>\n\n<style lang=\"stylus\" scoped>\n@import '../styles/tools'\n\n.item-banner\n\n  &__container\n    display flex\n    justify-content center\n    flex-wrap wrap\n    width 100%\n    height 100%\n\n  &__img-wrapper\n    position relative\n    width 80%\n    height 80%\n    overflow hidden\n    margin-bottom 50px\n\n  &__img\n    position absolute\n    top 50%\n    left 50%\n    transform translate(-50%, -50%)\n    max-width 100%\n    max-height 100%\n\n  &__info-item\n    display flex\n\n  &__title\n    font-weight 700\n\n  &__text\n    font-weight 300\n</style>\n",".item-banner__container {\n  display: flex;\n  justify-content: center;\n  flex-wrap: wrap;\n  width: 100%;\n  height: 100%;\n}\n.item-banner__img-wrapper {\n  position: relative;\n  width: 80%;\n  height: 80%;\n  overflow: hidden;\n  margin-bottom: 50px;\n}\n.item-banner__img {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  max-width: 100%;\n  max-height: 100%;\n}\n.item-banner__info-item {\n  display: flex;\n}\n.item-banner__title {\n  font-weight: 700;\n}\n.item-banner__text {\n  font-weight: 300;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = "data-v-d7ef2942";
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

Vue.use(Vuex);
var Store = new Vuex.Store({
    state: {
        list: []
    },
    getters: {
        listSortedAndCleared: function (state) {
            // const cleared = state.list && state.list.filter(banner => banner.isActive)
            return state.list && state.list.sort(function (a, b) {
                var keyA = a.sort;
                var keyB = a.sort;
                if (keyA > keyB)
                    return 1;
                else if (keyA < keyB)
                    return -1;
                else
                    return 0;
            });
        }
    },
    mutations: {
        saveList: function (state, payload) { return state.list = payload; }
    },
    actions: {
        getList: function (_a) {
            var commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    return [2 /*return*/, new Promise(function (resolve) {
                            service.get(service.defaults.baseURL + '/banners-list')
                                .then(function (res) {
                                while (!Array.isArray(res))
                                    res = res.data;
                                commit('saveList', res);
                                resolve();
                            });
                        })];
                });
            });
        }
    }
});

var ListBanners$1 = /** @class */ (function (_super) {
    __extends(ListBanners, _super);
    function ListBanners() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ListBanners.prototype, "list", {
        // @Getter('listSortedAndCleared') list! : Banner[]
        get: function () { return Store.getters.listSortedAndCleared; },
        enumerable: true,
        configurable: true
    });
    ListBanners = __decorate([
        Component({
            components: {
                ItemBanner: __vue_component__
            }
        })
    ], ListBanners);
    return ListBanners;
}(Vue));

/* script */
const __vue_script__$1 = ListBanners$1;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "list-banners" }, [
    _vm.list && _vm.list.length
      ? _c(
          "div",
          { staticClass: "list-banners__container" },
          _vm._l(_vm.list, function(item) {
            return _c("ItemBanner", {
              key: item.id,
              staticClass: "list-banners__item",
              attrs: { banner: item }
            })
          }),
          1
        )
      : _vm._e()
  ])
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-69b7211e_0", { source: ".list-banners__container[data-v-69b7211e] {\n  display: flex;\n  justify-content: space-between;\n  flex-wrap: wrap;\n}\n.list-banners__item[data-v-69b7211e] {\n  position: relative;\n  height: 500px;\n  max-height: 100vh;\n  padding: 50px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  border: 1px solid rgba(0,0,0,0.125);\n  border-radius: 0.25rem;\n  margin-bottom: 25px;\n}\n@media (max-width: 599px) {\n.list-banners__item[data-v-69b7211e] {\n    width: calc((((100% - 66px) / 4) * 4) + 66px);\n}\n}\n@media (min-width: 600px) and (max-width: 999px) {\n.list-banners__item[data-v-69b7211e] {\n    width: calc((((100% - 66px) / 4) * 4) + 66px);\n}\n}\n@media (min-width: 1000px) and (max-width: 1439px) {\n.list-banners__item[data-v-69b7211e] {\n    width: calc((((100% - 110px) / 6) * 3) + 44px);\n}\n}\n@media (min-width: 1440px) and (max-width: 1919px) {\n.list-banners__item[data-v-69b7211e] {\n    width: calc((((100% - 154px) / 8) * 2) + 22px);\n}\n}\n@media (min-width: 1920px) {\n.list-banners__item[data-v-69b7211e] {\n    width: calc((((100% - 242px) / 12) * 3) + 44px);\n}\n}\n", map: {"version":3,"sources":["/Users/kaisa/prj/banners-service/src/components/ListBanners.vue","ListBanners.vue"],"names":[],"mappings":"AAgCA;EACA,aAAA;EACA,8BAAA;EACA,eAAA;AC/BA;ADiCA;EAEA,kBAAA;EACA,aAAA;EACA,iBAAA;EACA,aAAA;EACA,aAAA;EACA,sBAAA;EACA,mBAAA;EACA,mCAAA;EACA,sBAAA;EACA,mBAAA;AChCA;AACA;AACE;IACE,6CAA6C;AAC/C;AACF;AACA;AACE;IACE,6CAA6C;AAC/C;AACF;AACA;AACE;IACE,8CAA8C;AAChD;AACF;ADEA;AAAA;ICCI,8CAA8C;AAChD;AACF;ADCA;AAAA;ICEI,+CAA+C;AACjD;AACF","file":"ListBanners.vue","sourcesContent":["<template lang=\"pug\">\n  include ../tools/bemto.pug\n\n  +b.list-banners\n    +e.container(v-if=\"list && list.length\")\n      ItemBanner(v-for=\"item in list\" :key=\"item.id\" :banner=\"item\" class=\"list-banners__item\")\n</template>\n\n<script lang=\"ts\">\nimport { Vue, Component } from '../../node_modules/vue-property-decorator/lib/vue-property-decorator'\nimport { Banner } from '../models'\nimport { State, Getter, Action, Mutation, namespace } from '../../node_modules/vuex-class/lib/index'\nimport ItemBanner from './ItemBanner.vue'\nimport Store from '../services/store'\n\n@Component({\n  components: {\n    ItemBanner\n  }\n})\n\nexport default class ListBanners extends Vue {\n  // @Getter('listSortedAndCleared') list! : Banner[]\n  get list() { return Store.getters.listSortedAndCleared }\n}\n</script>\n\n<style lang=\"stylus\" scoped>\n@import '../styles/tools'\n\n.list-banners\n\n  &__container\n    display flex\n    justify-content space-between\n    flex-wrap wrap\n\n  &__item\n    grid-size(4, 4, 3, 2, 3)\n    position relative\n    height 500px\n    max-height 100vh\n    padding 50px\n    display flex\n    flex-direction column\n    align-items center\n    border 1px solid rgba(0,0,0,.125)\n    border-radius .25rem\n    margin-bottom 25px\n</style>\n",".list-banners__container {\n  display: flex;\n  justify-content: space-between;\n  flex-wrap: wrap;\n}\n.list-banners__item {\n  position: relative;\n  height: 500px;\n  max-height: 100vh;\n  padding: 50px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  border: 1px solid rgba(0,0,0,0.125);\n  border-radius: 0.25rem;\n  margin-bottom: 25px;\n}\n@media (max-width: 599px) {\n  .list-banners__item {\n    width: calc((((100% - 66px) / 4) * 4) + 66px);\n  }\n}\n@media (min-width: 600px) and (max-width: 999px) {\n  .list-banners__item {\n    width: calc((((100% - 66px) / 4) * 4) + 66px);\n  }\n}\n@media (min-width: 1000px) and (max-width: 1439px) {\n  .list-banners__item {\n    width: calc((((100% - 110px) / 6) * 3) + 44px);\n  }\n}\n@media (min-width: 1440px) and (max-width: 1919px) {\n  .list-banners__item {\n    width: calc((((100% - 154px) / 8) * 2) + 22px);\n  }\n}\n@media (min-width: 1920px) {\n  .list-banners__item {\n    width: calc((((100% - 242px) / 12) * 3) + 44px);\n  }\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = "data-v-69b7211e";
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$1 = normalizeComponent(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    false,
    createInjector,
    undefined,
    undefined
  );

var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // @Action('getList') getList: any
    App.prototype.created = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // await this.getList()
                    return [4 /*yield*/, Store.dispatch('getList')];
                    case 1:
                        // await this.getList()
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    App = __decorate([
        Component({
            components: {
                ListBanners: __vue_component__$1
            }
        })
    ], App);
    return App;
}(Vue));

/* script */
const __vue_script__$2 = App;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "app" }, [
    _c(
      "div",
      { staticClass: "app__container container" },
      [_c("ListBanners", { staticClass: "app__list" })],
      1
    )
  ])
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = function (inject) {
    if (!inject) return
    inject("data-v-e72069e2_0", { source: "html[data-v-e72069e2],\nbody[data-v-e72069e2],\ndiv[data-v-e72069e2],\nspan[data-v-e72069e2],\napplet[data-v-e72069e2],\nobject[data-v-e72069e2],\niframe[data-v-e72069e2],\nh1[data-v-e72069e2],\nh2[data-v-e72069e2],\nh3[data-v-e72069e2],\nh4[data-v-e72069e2],\nh5[data-v-e72069e2],\nh6[data-v-e72069e2],\np[data-v-e72069e2],\nblockquote[data-v-e72069e2],\npre[data-v-e72069e2],\na[data-v-e72069e2],\nabbr[data-v-e72069e2],\nacronym[data-v-e72069e2],\naddress[data-v-e72069e2],\nbig[data-v-e72069e2],\ncite[data-v-e72069e2],\ncode[data-v-e72069e2],\ndel[data-v-e72069e2],\ndfn[data-v-e72069e2],\nem[data-v-e72069e2],\nimg[data-v-e72069e2],\nins[data-v-e72069e2],\nkbd[data-v-e72069e2],\nq[data-v-e72069e2],\ns[data-v-e72069e2],\nsamp[data-v-e72069e2],\nsmall[data-v-e72069e2],\nstrike[data-v-e72069e2],\nstrong[data-v-e72069e2],\nsub[data-v-e72069e2],\nsup[data-v-e72069e2],\ntt[data-v-e72069e2],\nvar[data-v-e72069e2],\nb[data-v-e72069e2],\nu[data-v-e72069e2],\ni[data-v-e72069e2],\ncenter[data-v-e72069e2],\ndl[data-v-e72069e2],\ndt[data-v-e72069e2],\ndd[data-v-e72069e2],\nol[data-v-e72069e2],\nul[data-v-e72069e2],\nli[data-v-e72069e2],\nfieldset[data-v-e72069e2],\nform[data-v-e72069e2],\nlabel[data-v-e72069e2],\nlegend[data-v-e72069e2],\ntable[data-v-e72069e2],\ncaption[data-v-e72069e2],\ntbody[data-v-e72069e2],\ntfoot[data-v-e72069e2],\nthead[data-v-e72069e2],\ntr[data-v-e72069e2],\nth[data-v-e72069e2],\ntd[data-v-e72069e2],\narticle[data-v-e72069e2],\naside[data-v-e72069e2],\ncanvas[data-v-e72069e2],\ndetails[data-v-e72069e2],\nembed[data-v-e72069e2],\nfigure[data-v-e72069e2],\nfigcaption[data-v-e72069e2],\nfooter[data-v-e72069e2],\nheader[data-v-e72069e2],\nhgroup[data-v-e72069e2],\nmenu[data-v-e72069e2],\nnav[data-v-e72069e2],\noutput[data-v-e72069e2],\nruby[data-v-e72069e2],\nsection[data-v-e72069e2],\nsummary[data-v-e72069e2],\ntime[data-v-e72069e2],\nmark[data-v-e72069e2],\naudio[data-v-e72069e2],\nvideo[data-v-e72069e2] {\n  margin: 0;\n  padding: 0;\n}\nborder 0[data-v-e72069e2] {\n  font-size: 100%;\n  font: inherit;\n  vertical-align: baseline;\n}\narticle[data-v-e72069e2],\naside[data-v-e72069e2],\ndetails[data-v-e72069e2],\nfigcaption[data-v-e72069e2],\nfigure[data-v-e72069e2],\nfooter[data-v-e72069e2],\nheader[data-v-e72069e2],\nhgroup[data-v-e72069e2],\nmenu[data-v-e72069e2],\nnav[data-v-e72069e2],\nsection[data-v-e72069e2] {\n  display: block;\n}\nbody[data-v-e72069e2] {\n  line-height: 1;\n}\nol[data-v-e72069e2],\nul[data-v-e72069e2] {\n  list-style: none;\n}\nblockquote[data-v-e72069e2],\nq[data-v-e72069e2] {\n  quotes: none;\n}\nblockquote[data-v-e72069e2]:before,\nblockquote[data-v-e72069e2]:after,\nq[data-v-e72069e2]:before,\nq[data-v-e72069e2]:after {\n  content: '';\n  content: none;\n}\ntable[data-v-e72069e2] {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n*[data-v-e72069e2] {\n  box-sizing: border-box;\n  -webkit-appearance: none;\n}\nimg[data-v-e72069e2],\nsvg[data-v-e72069e2],\niframe[data-v-e72069e2],\nobject[data-v-e72069e2] {\n  max-width: 100%;\n  max-height: 100%;\n}\ni[data-v-e72069e2],\ncite[data-v-e72069e2],\nem[data-v-e72069e2],\nvar[data-v-e72069e2],\naddress[data-v-e72069e2] {\n  font-style: normal;\n}\n[data-v-e72069e2]:focus {\n  outline: none;\n}\n[data-v-e72069e2]::-moz-focus-inner {\n  border: 0;\n}\ninput[data-v-e72069e2],\ntextarea[data-v-e72069e2] {\n  padding: 0;\n  border: none;\n}\n[v-cloak][data-v-e72069e2] {\n  display: none !important;\n}\nhtml[data-v-e72069e2],\nbody[data-v-e72069e2] {\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  color: #000;\n  -webkit-tap-highlight-color: rgba(232,117,12,0.25);\n}\n[data-v-e72069e2]::selection {\n  background-color: #e8750c;\n  color: #fff;\n}\na[data-v-e72069e2] {\n  padding: 5px;\n  margin: -5px;\n  color: inherit;\n  text-decoration: none;\n  transition: transform , opacity 333ms cubic-bezier(0.26, 0.86, 0.44, 0.985);\n}\nhtml.desktop a[data-v-e72069e2]:hover {\n  opacity: 0.75;\n}\n#__nuxt[data-v-e72069e2],\n#__layout[data-v-e72069e2],\n.app[data-v-e72069e2] {\n  height: 100%;\n}\n.page[data-v-e72069e2] {\n  transition: transform , opacity 333ms cubic-bezier(0.26, 0.86, 0.44, 0.985);\n  transition-duration: 666ms;\n}\n.page.v-enter[data-v-e72069e2],\n.page.v-leave-to[data-v-e72069e2] {\n  opacity: 0;\n}\n.container[data-v-e72069e2] {\n  float: none;\n  width: 100%;\n  margin: 0 auto;\n  max-width: 100%;\n  max-width: none;\n}\n@media (max-width: 599px) {\n.container[data-v-e72069e2] {\n    padding-right: 20px;\n}\n}\n@media (min-width: 600px) and (max-width: 999px) {\n.container[data-v-e72069e2] {\n    padding-right: 50px;\n}\n}\n@media (min-width: 1000px) and (max-width: 1439px) {\n.container[data-v-e72069e2] {\n    padding-right: 60px;\n}\n}\n@media (min-width: 1440px) and (max-width: 1919px) {\n.container[data-v-e72069e2] {\n    padding-right: 60px;\n}\n}\n@media (min-width: 1920px) {\n.container[data-v-e72069e2] {\n    padding-right: 60px;\n}\n}\n@media (max-width: 599px) {\n.container[data-v-e72069e2] {\n    padding-left: 20px;\n}\n}\n@media (min-width: 600px) and (max-width: 999px) {\n.container[data-v-e72069e2] {\n    padding-left: 50px;\n}\n}\n@media (min-width: 1000px) and (max-width: 1439px) {\n.container[data-v-e72069e2] {\n    padding-left: 60px;\n}\n}\n@media (min-width: 1440px) and (max-width: 1919px) {\n.container[data-v-e72069e2] {\n    padding-left: 60px;\n}\n}\n@media (min-width: 1920px) {\n.container[data-v-e72069e2] {\n    padding-left: 60px;\n}\n}\n.container.is-fluid[data-v-e72069e2] {\n  max-width: 100%;\n}\n.is-hidden[data-v-e72069e2] {\n  display: none;\n}\n@-moz-keyframes blink-data-v-e72069e2 {\n0%, 100% {\n    opacity: 1;\n}\n50% {\n    opacity: 0;\n}\n}\n@-webkit-keyframes blink-data-v-e72069e2 {\n0%, 100% {\n    opacity: 1;\n}\n50% {\n    opacity: 0;\n}\n}\n@-o-keyframes blink-data-v-e72069e2 {\n0%, 100% {\n    opacity: 1;\n}\n50% {\n    opacity: 0;\n}\n}\n@keyframes blink-data-v-e72069e2 {\n0%, 100% {\n    opacity: 1;\n}\n50% {\n    opacity: 0;\n}\n}\n@-moz-keyframes fadeIn-data-v-e72069e2 {\n0% {\n    opacity: 0;\n}\n100% {\n    opacity: 1;\n}\n}\n@-webkit-keyframes fadeIn-data-v-e72069e2 {\n0% {\n    opacity: 0;\n}\n100% {\n    opacity: 1;\n}\n}\n@-o-keyframes fadeIn-data-v-e72069e2 {\n0% {\n    opacity: 0;\n}\n100% {\n    opacity: 1;\n}\n}\n@keyframes fadeIn-data-v-e72069e2 {\n0% {\n    opacity: 0;\n}\n100% {\n    opacity: 1;\n}\n}\n@-moz-keyframes fadeOut-data-v-e72069e2 {\n0% {\n    opacity: 1;\n}\n100% {\n    opacity: 0;\n}\n}\n@-webkit-keyframes fadeOut-data-v-e72069e2 {\n0% {\n    opacity: 1;\n}\n100% {\n    opacity: 0;\n}\n}\n@-o-keyframes fadeOut-data-v-e72069e2 {\n0% {\n    opacity: 1;\n}\n100% {\n    opacity: 0;\n}\n}\n@keyframes fadeOut-data-v-e72069e2 {\n0% {\n    opacity: 1;\n}\n100% {\n    opacity: 0;\n}\n}\n.app__container[data-v-e72069e2] {\n  padding-top: 10px;\n  padding-top: 20px;\n  padding-bottom: 10px;\n  padding-bottom: 20px;\n}\n@media (min-width: 599px) and (max-width: 999px) {\n.app__container[data-v-e72069e2] {\n    padding-top: calc(10 * 1px + (20 - 10) * (100vw - 600 * 1px) / (1000 - 600) );\n}\n}\n@media (max-width: 599px) {\n.app__container[data-v-e72069e2] {\n    padding-top: 10px;\n}\n}\n@media (min-width: 1000px) {\n.app__container[data-v-e72069e2] {\n    padding-top: 20px;\n}\n}\n@media (min-width: 1440px) and (max-width: 1919px) {\n.app__container[data-v-e72069e2] {\n    padding-top: calc(20 * 1px + (30 - 20) * (100vw - 1441 * 1px) / (1920 - 1441) );\n}\n}\n@media (min-width: 1920px) {\n.app__container[data-v-e72069e2] {\n    padding-top: 30px;\n}\n}\n@media (min-width: 599px) and (max-width: 999px) {\n.app__container[data-v-e72069e2] {\n    padding-bottom: calc(10 * 1px + (20 - 10) * (100vw - 600 * 1px) / (1000 - 600) );\n}\n}\n@media (max-width: 599px) {\n.app__container[data-v-e72069e2] {\n    padding-bottom: 10px;\n}\n}\n@media (min-width: 1000px) {\n.app__container[data-v-e72069e2] {\n    padding-bottom: 20px;\n}\n}\n@media (min-width: 1440px) and (max-width: 1919px) {\n.app__container[data-v-e72069e2] {\n    padding-bottom: calc(20 * 1px + (30 - 20) * (100vw - 1441 * 1px) / (1920 - 1441) );\n}\n}\n@media (min-width: 1920px) {\n.app__container[data-v-e72069e2] {\n    padding-bottom: 30px;\n}\n}\n.app__list[data-v-e72069e2] {\n  width: 100%;\n}\n", map: {"version":3,"sources":["App.vue","/Users/kaisa/prj/banners-service/src/App.vue"],"names":[],"mappings":"AAAA;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;EAiFE,SAAS;EACT,UAAU;AACZ;AACA;EACE,eAAe;EACf,aAAa;EACb,wBAAwB;AAC1B;AACA;;;;;;;;;;;EAWE,cAAc;AAChB;AACA;EACE,cAAc;AAChB;ACxEA;;EACA,gBAAA;AD2EA;ACzEA;;ED4EE,YAAY;AACd;AC1EA;;;;EAEA,WAAA;EACA,aAAA;AD8EA;AC5EA;EACA,yBAAA;ED8EE,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,wBAAwB;AAC1B;AACA;;;;EAIE,eAAe;EACf,gBAAgB;AAClB;AACA;;;;;EAKE,kBAAkB;AACpB;AACA;EACE,aAAa;AACf;AACA;EACE,SAAS;AACX;AACA;;EAEE,UAAU;EACV,YAAY;AACd;AACA;EACE,wBAAwB;AAC1B;AACA;;EAEE,mCAAmC;EACnC,kCAAkC;EAClC,WAAW;EACX,kDAAkD;AACpD;AACA;EACE,yBAAyB;EACzB,WAAW;AACb;AACA;EACE,YAAY;EACZ,YAAY;EACZ,cAAc;EACd,qBAAqB;EACrB,2EAA2E;AAC7E;AACA;EACE,aAAa;AACf;AACA;;;EAGE,YAAY;AACd;AACA;EACE,2EAA2E;ECtJ7E,0BAAA;ADwJA;AACA;;EAEE,UAAU;AACZ;ACvJA;EDyJE,WAAW;EACX,WAAW;EACX,cAAc;EACd,eAAe;EC1JjB,eAAA;AD4JA;AACA;AACE;IACE,mBAAmB;AACrB;AACF;AACA;AACE;IACE,mBAAmB;AACrB;AACF;AACA;AACE;IACE,mBAAmB;AACrB;AACF;AClLA;AAAA;IDqLI,mBAAmB;AACrB;AACF;ACnLA;AAAA;IDsLI,mBAAmB;AACrB;AACF;AACA;AACE;IACE,kBAAkB;AACpB;AACF;AACA;AACE;IACE,kBAAkB;AACpB;AACF;AACA;AACE;IACE,kBAAkB;AACpB;AACF;AC3MA;AAAA;ID8MI,kBAAkB;AACpB;AACF;AC5MA;AAAA;ID+MI,kBAAkB;AACpB;AACF;AACA;EACE,eAAe;AACjB;AACA;EC/MA,aAAA;ADiNA;AACA;AACE;IACE,UAAU;AACZ;AACA;IACE,UAAU;AACZ;AACF;AACA;AACE;IACE,UAAU;AACZ;AACA;IACE,UAAU;AACZ;AACF;AACA;AACE;IACE,UAAU;AACZ;AACA;IACE,UAAU;AACZ;AACF;AACA;AACE;IACE,UAAU;AACZ;AACA;IACE,UAAU;AACZ;AACF;AACA;AACE;IACE,UAAU;AACZ;AACA;IACE,UAAU;AACZ;AACF;AACA;AACE;IACE,UAAU;AACZ;AACA;IACE,UAAU;AACZ;AACF;AACA;AACE;IACE,UAAU;AACZ;AACA;IACE,UAAU;AACZ;AACF;AACA;AACE;IACE,UAAU;AACZ;AACA;IACE,UAAU;AACZ;AACF;AACA;AACE;IACE,UAAU;AACZ;AACA;IACE,UAAU;AACZ;AACF;AACA;AACE;IACE,UAAU;AACZ;AACA;IACE,UAAU;AACZ;AACF;AACA;AACE;IACE,UAAU;AACZ;AACA;IACE,UAAU;AACZ;AACF;AACA;AACE;IACE,UAAU;AACZ;AACA;IACE,UAAU;AACZ;AACF;ACvTA;EDyTE,iBAAiB;EACjB,iBAAiB;EACjB,oBAAoB;EACpB,oBAAoB;AACtB;AACA;AACE;IACE,6EAA6E;AAC/E;AACF;AACA;AACE;IACE,iBAAiB;AACnB;AACF;AACA;AACE;IACE,iBAAiB;AACnB;AACF;AACA;AACE;IACE,+EAA+E;AACjF;AACF;AACA;AACE;IACE,iBAAiB;AACnB;AACF;AACA;AACE;IACE,gFAAgF;AAClF;AACF;AACA;AACE;IACE,oBAAoB;AACtB;AACF;AACA;AACE;IACE,oBAAoB;AACtB;AACF;AACA;AACE;IACE,kFAAkF;AACpF;AACF;AACA;AACE;IACE,oBAAoB;AACtB;AACF;ACzWA;EACA,WAAA;AD2WA","file":"App.vue","sourcesContent":["html,\nbody,\ndiv,\nspan,\napplet,\nobject,\niframe,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\np,\nblockquote,\npre,\na,\nabbr,\nacronym,\naddress,\nbig,\ncite,\ncode,\ndel,\ndfn,\nem,\nimg,\nins,\nkbd,\nq,\ns,\nsamp,\nsmall,\nstrike,\nstrong,\nsub,\nsup,\ntt,\nvar,\nb,\nu,\ni,\ncenter,\ndl,\ndt,\ndd,\nol,\nul,\nli,\nfieldset,\nform,\nlabel,\nlegend,\ntable,\ncaption,\ntbody,\ntfoot,\nthead,\ntr,\nth,\ntd,\narticle,\naside,\ncanvas,\ndetails,\nembed,\nfigure,\nfigcaption,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\noutput,\nruby,\nsection,\nsummary,\ntime,\nmark,\naudio,\nvideo {\n  margin: 0;\n  padding: 0;\n}\nborder 0 {\n  font-size: 100%;\n  font: inherit;\n  vertical-align: baseline;\n}\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\nsection {\n  display: block;\n}\nbody {\n  line-height: 1;\n}\nol,\nul {\n  list-style: none;\n}\nblockquote,\nq {\n  quotes: none;\n}\nblockquote:before,\nblockquote:after,\nq:before,\nq:after {\n  content: '';\n  content: none;\n}\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n* {\n  box-sizing: border-box;\n  -webkit-appearance: none;\n}\nimg,\nsvg,\niframe,\nobject {\n  max-width: 100%;\n  max-height: 100%;\n}\ni,\ncite,\nem,\nvar,\naddress {\n  font-style: normal;\n}\n:focus {\n  outline: none;\n}\n::-moz-focus-inner {\n  border: 0;\n}\ninput,\ntextarea {\n  padding: 0;\n  border: none;\n}\n[v-cloak] {\n  display: none !important;\n}\nhtml,\nbody {\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  color: #000;\n  -webkit-tap-highlight-color: rgba(232,117,12,0.25);\n}\n::selection {\n  background-color: #e8750c;\n  color: #fff;\n}\na {\n  padding: 5px;\n  margin: -5px;\n  color: inherit;\n  text-decoration: none;\n  transition: transform , opacity 333ms cubic-bezier(0.26, 0.86, 0.44, 0.985);\n}\nhtml.desktop a:hover {\n  opacity: 0.75;\n}\n#__nuxt,\n#__layout,\n.app {\n  height: 100%;\n}\n.page {\n  transition: transform , opacity 333ms cubic-bezier(0.26, 0.86, 0.44, 0.985);\n  transition-duration: 666ms;\n}\n.page.v-enter,\n.page.v-leave-to {\n  opacity: 0;\n}\n.container {\n  float: none;\n  width: 100%;\n  margin: 0 auto;\n  max-width: 100%;\n  max-width: none;\n}\n@media (max-width: 599px) {\n  .container {\n    padding-right: 20px;\n  }\n}\n@media (min-width: 600px) and (max-width: 999px) {\n  .container {\n    padding-right: 50px;\n  }\n}\n@media (min-width: 1000px) and (max-width: 1439px) {\n  .container {\n    padding-right: 60px;\n  }\n}\n@media (min-width: 1440px) and (max-width: 1919px) {\n  .container {\n    padding-right: 60px;\n  }\n}\n@media (min-width: 1920px) {\n  .container {\n    padding-right: 60px;\n  }\n}\n@media (max-width: 599px) {\n  .container {\n    padding-left: 20px;\n  }\n}\n@media (min-width: 600px) and (max-width: 999px) {\n  .container {\n    padding-left: 50px;\n  }\n}\n@media (min-width: 1000px) and (max-width: 1439px) {\n  .container {\n    padding-left: 60px;\n  }\n}\n@media (min-width: 1440px) and (max-width: 1919px) {\n  .container {\n    padding-left: 60px;\n  }\n}\n@media (min-width: 1920px) {\n  .container {\n    padding-left: 60px;\n  }\n}\n.container.is-fluid {\n  max-width: 100%;\n}\n.is-hidden {\n  display: none;\n}\n@-moz-keyframes blink {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0;\n  }\n}\n@-webkit-keyframes blink {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0;\n  }\n}\n@-o-keyframes blink {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0;\n  }\n}\n@keyframes blink {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0;\n  }\n}\n@-moz-keyframes fadeIn {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@-webkit-keyframes fadeIn {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@-o-keyframes fadeIn {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@keyframes fadeIn {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@-moz-keyframes fadeOut {\n  0% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n  }\n}\n@-webkit-keyframes fadeOut {\n  0% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n  }\n}\n@-o-keyframes fadeOut {\n  0% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n  }\n}\n@keyframes fadeOut {\n  0% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n  }\n}\n.app__container {\n  padding-top: 10px;\n  padding-top: 20px;\n  padding-bottom: 10px;\n  padding-bottom: 20px;\n}\n@media (min-width: 599px) and (max-width: 999px) {\n  .app__container {\n    padding-top: calc(10 * 1px + (20 - 10) * (100vw - 600 * 1px) / (1000 - 600) );\n  }\n}\n@media (max-width: 599px) {\n  .app__container {\n    padding-top: 10px;\n  }\n}\n@media (min-width: 1000px) {\n  .app__container {\n    padding-top: 20px;\n  }\n}\n@media (min-width: 1440px) and (max-width: 1919px) {\n  .app__container {\n    padding-top: calc(20 * 1px + (30 - 20) * (100vw - 1441 * 1px) / (1920 - 1441) );\n  }\n}\n@media (min-width: 1920px) {\n  .app__container {\n    padding-top: 30px;\n  }\n}\n@media (min-width: 599px) and (max-width: 999px) {\n  .app__container {\n    padding-bottom: calc(10 * 1px + (20 - 10) * (100vw - 600 * 1px) / (1000 - 600) );\n  }\n}\n@media (max-width: 599px) {\n  .app__container {\n    padding-bottom: 10px;\n  }\n}\n@media (min-width: 1000px) {\n  .app__container {\n    padding-bottom: 20px;\n  }\n}\n@media (min-width: 1440px) and (max-width: 1919px) {\n  .app__container {\n    padding-bottom: calc(20 * 1px + (30 - 20) * (100vw - 1441 * 1px) / (1920 - 1441) );\n  }\n}\n@media (min-width: 1920px) {\n  .app__container {\n    padding-bottom: 30px;\n  }\n}\n.app__list {\n  width: 100%;\n}\n","<template lang=\"pug\">\n  include ./tools/bemto.pug\n\n  +b.app\n    +e.container.container\n      //- <router-view></router-view>\n      ListBanners(class=\"app__list\")\n</template>\n\n<script lang=\"ts\">\nimport { Vue, Component } from '../node_modules/vue-property-decorator/lib/vue-property-decorator'\nimport { State, Getter, Action, Mutation, namespace } from '../node_modules/vuex-class/lib/index'\nimport ListBanners from './components/ListBanners.vue'\nimport Store from './services/store'\n\n@Component({\n  components: {\n    ListBanners\n  }\n})\n\nexport default class App extends Vue {\n  // @Action('getList') getList: any\n\n  async created() {\n    // await this.getList()\n    await Store.dispatch('getList')\n  }\n}\n</script>\n\n<style lang=\"stylus\" scoped>\n@import './styles/app'\n@import './styles/tools'\n\n.app\n\n  &__container\n    width-between-property 'padding-top' 600 10 1000 20 true true\n    width-between-property 'padding-top' 1441 20 1920 30 false true\n    width-between-property 'padding-bottom' 600 10 1000 20 true true\n    width-between-property 'padding-bottom' 1441 20 1920 30 false true\n\n  &__list\n    width 100%\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$2 = "data-v-e72069e2";
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$2 = normalizeComponent(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    false,
    createInjector,
    undefined,
    undefined
  );

export default __vue_component__$2;
