import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  Fragment,
} from "react";

type StoreApiT<ValueT> = {
  data: ValueT;
  setData: React.Dispatch<React.SetStateAction<ValueT>>;
  mergeData: React.Dispatch<React.SetStateAction<Partial<ValueT>>>;
};

type StoreProviderT = React.FunctionComponent<{ children: React.ReactNode }>;

export function createStore<ValueT>(initialValue: ValueT) {
  const Context = createContext<StoreApiT<ValueT> | undefined>(undefined);

  const Provider: StoreProviderT = ({ children }) => {
    const [data, setData] = useState(initialValue);
    const mergeData = useCallback((objectToMerge) => {
      setData((data) => mergeState(data, objectToMerge));
    }, []);
    const storeApi = useMemo(() => ({ data, setData, mergeData }), [
      data,
      setData,
      mergeData,
    ]);
    return <Context.Provider value={storeApi}>{children}</Context.Provider>;
  };

  function useStore() {
    const storeApi = useContext(Context);
    if (!storeApi) {
      throw new Error(
        "Cannot access the store context. " +
          "Please make sure that you have a provider somewhere in the parent component hierarchy"
      );
    }
    return storeApi;
  }

  return { Context, Provider, useStore };
}

export function combineProviders(...Providers: StoreProviderT[]) {
  const CombinedProvider: React.FunctionComponent<{
    children: React.ReactNode;
  }> = ({ children }) => {
    if (Providers.length === 0) {
      return <Fragment>{children}</Fragment>;
    }
    const FirstProvider = Providers[0];
    let RenderedProviders = <FirstProvider children={children} />;
    for (let i = 1; i < Providers.length; ++i) {
      const CurrentProvider = Providers[i];
      RenderedProviders = <CurrentProvider children={RenderedProviders} />;
    }
    return RenderedProviders;
  };
  return CombinedProvider;
}

function mergeState<ValueT extends Record<string, any>>(
  originalState: ValueT,
  objectOrFuncToMerge:
    | Partial<ValueT>
    | ((currentValue: ValueT) => Partial<ValueT>)
): ValueT {
  const objectToMerge =
    typeof objectOrFuncToMerge === "function"
      ? objectOrFuncToMerge(originalState)
      : objectOrFuncToMerge;
  if (typeof objectToMerge !== "object") {
    throw new Error(
      "Cannot merge a non-object value to the store. Perhaps you wanted to use setData instead?"
    );
  }
  return {
    ...originalState,
    ...objectToMerge,
  };
}
