import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice"; 
import { encryptTransform } from 'redux-persist-transform-encrypt' 

import { persistReducer, persistStore ,FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER} from "redux-persist";

import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
    user: userSlice,
})

const persistConfige = {
    key: 'u-m',
    storage,
    version: 1,
    whitelist: ['user'],
    transforms: [
        encryptTransform({
            secretKey: 'my-crm-secret',
            onError: function (error) {
                // handle the encryption error
                console.log(error);

            },

        }),

    ],
}

const persistedReducer = persistReducer(persistConfige, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
              },
        }),
});

export const persistor = persistStore(store)
