import React from 'react';
declare type StoreApiT<ValueT> = {
    data: ValueT;
    setData: React.Dispatch<React.SetStateAction<ValueT>>;
    mergeData: React.Dispatch<React.SetStateAction<Partial<ValueT>>>;
};
declare type StoreProviderT = React.FunctionComponent<{
    children: React.ReactNode;
}>;
export declare function createStore<ValueT>(initialValue: ValueT): {
    Context: React.Context<StoreApiT<ValueT> | undefined>;
    Provider: StoreProviderT;
    useStore: () => StoreApiT<ValueT>;
};
export declare function combineProviders(...Providers: StoreProviderT[]): React.FunctionComponent<{
    children: React.ReactNode;
}>;
export {};
