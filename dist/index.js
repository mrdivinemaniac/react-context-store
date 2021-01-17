"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineProviders = exports.createStore = void 0;
var react_1 = __importStar(require("react"));
function createStore(initialValue) {
    var Context = react_1.createContext(undefined);
    var Provider = function (_a) {
        var children = _a.children;
        var _b = react_1.useState(initialValue), data = _b[0], setData = _b[1];
        var mergeData = react_1.useCallback(function (objectToMerge) {
            setData(function (data) { return mergeState(data, objectToMerge); });
        }, []);
        var storeApi = react_1.useMemo(function () { return ({ data: data, setData: setData, mergeData: mergeData }); }, [data, setData, mergeData]);
        return (react_1.default.createElement(Context.Provider, { value: storeApi }, children));
    };
    function useStore() {
        var storeApi = react_1.useContext(Context);
        if (!storeApi) {
            throw new Error('Cannot access the store context. ' +
                'Please make sure that you have a provider somewhere in the parent component hierarchy');
        }
        return storeApi;
    }
    return { Context: Context, Provider: Provider, useStore: useStore };
}
exports.createStore = createStore;
function combineProviders() {
    var Providers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        Providers[_i] = arguments[_i];
    }
    var CombinedProvider = function (_a) {
        var children = _a.children;
        if (Providers.length === 0) {
            return (react_1.default.createElement(react_1.Fragment, null, children));
        }
        var FirstProvider = Providers[0];
        var RenderedProviders = react_1.default.createElement(FirstProvider, { children: children });
        for (var i = 1; i < Providers.length; ++i) {
            var CurrentProvider = Providers[i];
            RenderedProviders = react_1.default.createElement(CurrentProvider, { children: RenderedProviders });
        }
        return RenderedProviders;
    };
    return CombinedProvider;
}
exports.combineProviders = combineProviders;
function mergeState(originalState, objectOrFuncToMerge) {
    var objectToMerge = (typeof objectOrFuncToMerge === 'function')
        ? objectOrFuncToMerge(originalState)
        : objectOrFuncToMerge;
    if (typeof objectToMerge !== 'object') {
        throw new Error('Cannot merge a non-object value to the store. Perhaps you wanted to use setData instead?');
    }
    return __assign(__assign({}, originalState), objectToMerge);
}
