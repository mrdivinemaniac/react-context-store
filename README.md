# react-hooked-state

This small library demonstrates a way to use React's context API to create a global store using the familiar and convenient hooks API.

## Creating a Store

Just import `createStore` from `react-hooked-state`.

`createStore` takes the initial value of the store as an argument.

After that, you can use `useStore` returned from `createStore` to implement a custom hook with the functionality that you want.

```javascript
// store/user/index.js
import { useCallback } from "react";
import { createStore } from "react-hooked-state";

const initialState = {
  loading: false,
  error: null,
  user: {},
};

const { Provider, useStore } = createStore(initialState);

export const UserStoreProvider = Provider;
export function useUserStore() {
  const {
    data,
    setData, // Replaces data in the whole store
    mergeData, // Merges with existing data in the store like setState in class components
  } = useStore();

  // An Action
  const resetUserData = useCallback(() => {
    setData(initialState);
  }, []);

  // Another Action
  const setUser = useCallback(
    (user) => {
      mergeData({ user });
    },
    [mergeData]
  );

  // An Action which makes an async request
  const loadUserData = useCallback(() => {
    mergeData({ loading: true });
    requestUserFromServer()
      .then((user) => {
        mergeData({ user, loading: false });
      })
      .catch((e) => {
        mergeData({ error: e, loading: false });
      });
  }, [mergeData]);

  const { loading, user, error } = data;

  return {
    user,
    loadingUser: loading,
    userLoadError: error,
    loadUserData,
    setUser,
    resetUserData,
  };
}
```
### Creating Multiple Hooks
You can also create separate hooks for separate operations. The API is totally upto you!

Below is an example of creating a separate hook for just the actions.

```javascript
// store/user/index.js (alternate)
import { useCallback } from "react";
import { createStore } from "react-hooked-state";

const { Provider, useStore } = createStore({
  loading: false,
  error: null,
  user: {},
});

export const UserStoreProvider = Provider;

export function useUserStore() {
  const { data, mergeData } = useStore();
  const { loading, user, error } = data;

  return {
    user,
    loadingUser: loading,
    userLoadError: error,
  };
}

export function useUserActions() {
  const { data, mergeData } = useStore();

  // An Action
  const resetUserData = useCallback(() => {
    setData(initialState);
  }, []);

  // Another Action
  const setUser = useCallback(
    (user) => {
      mergeData({ user });
    },
    [mergeData]
  );

  // An Action which makes an async request
  const loadUserData = useCallback(() => {
    mergeData({ loading: true });
    requestUserFromServer()
      .then((user) => {
        mergeData({ user, loading: false });
      })
      .catch((e) => {
        mergeData({ error: e, loading: false });
      });
  }, [mergeData]);

  return { resetUserData, setUser, loadUserData };
}
```
### Important Information

It is important to wrap the actions in `useCallback` in order to avoid unnecessary re-renders in child components.

## Using a Store

Using the store is simple. Just wrap the `Provider` returned from `createStore` in any component whose descendants you wish to use the store in.

After that, you can directly import and use the hooks that you created for your stores.

If you have multiple stores and providers then you can use `combineProviders` in order to merge all the providers into one.

```jsx
import { combineProviders } from "react-hooked-state";
import { UserStoreProvider } from "./store/user";
import { SomeOtherStoreProvider } from "./store/some-other-store";
import { Profile } from "./components/profile";

const StoreProvider = combineProviders(
  UserStoreProvider,
  SomeOtherStoreProvider
);

export function App() {
  return (
    <StoreProvider>
      <Profile />
    </StoreProvider>
  );
}

// components/Profile.js
import { useUserStore, useUserActions } from "../store/user";

function Profile() {
  const { user, loadingUser, userLoadError } = useUserStore();
  const { loadUserData } = useUserActions();

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  if (loadingUser) return <div>Loading...</div>;
  if (userLoadError)
    return <div> Oops! There was an error loading the user </div>;
  return (
    <ul>
      <li> Name: {user.name} </li>
      <li> Email: {user.email} </li>
    </ul>
  );
}
```

## Additional Notes

The `createStore` method also returns a `Context` object along with `Provider` and `useStore`. You could also directly use `useContext(Context)` instead of `useStore` but that will take away some trivial error checking to see if the context has data in it.

### Example:

```javascript
// store/user/index.js
import { useCallback, useContext } from "react";
import { createStore } from "react-hooked-state";

const initialState = {
  loading: false,
  error: null,
  user: {},
};

const { Provider, useStore, Context } = createStore(initialState);

export const UserStoreProvider = Provider;
export function useUserStore() {
  const contextData = useContext(Context);
  if (!contextData) throw new Error('No value supplied to context');
  const {
    data,
    setData,
    mergeData
  } = contextData;
  ......
}
```
