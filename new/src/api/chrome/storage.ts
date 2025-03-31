/// <reference types="chrome"/>

/**
 * Retrieves one or more items from local storage.
 * Wraps chrome.storage.local.get in a Promise.
 *
 * @param keys A single key string, an array of key strings, or an object specifying default values.
 * @returns A Promise that resolves with an object containing the requested key-value pairs.
 */
export function getLocalStorage<T extends { [key: string]: any }>(
  keys: string | string[] | { [key: string]: any } | null
): Promise<T> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(keys, (result) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(result as T);
    });
  });
}

/**
 * Sets multiple items in local storage.
 * Wraps chrome.storage.local.set in a Promise.
 *
 * @param items An object containing one or more key-value pairs to store.
 * @returns A Promise that resolves when the operation completes.
 */
export function setLocalStorage(items: { [key: string]: any }): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(items, () => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve();
    });
  });
}

/**
 * Removes one or more items from local storage.
 * Wraps chrome.storage.local.remove in a Promise.
 *
 * @param keys A single key string or an array of key strings to remove.
 * @returns A Promise that resolves when the operation completes.
 */
export function removeLocalStorage(keys: string | string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(keys, () => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve();
    });
  });
}

/**
 * Clears all items from local storage.
 * Wraps chrome.storage.local.clear in a Promise.
 *
 * @returns A Promise that resolves when the operation completes.
 */
export function clearLocalStorage(): Promise<void> {
    return new Promise((resolve, reject) => {
        chrome.storage.local.clear(() => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
}

// Optional: Add listener wrapper if needed, though direct use might be simpler
// export function addStorageChangeListener(callback: (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => void) {
//   chrome.storage.onChanged.addListener(callback);
// }

// export function removeStorageChangeListener(callback: (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => void) {
//   chrome.storage.onChanged.removeListener(callback);
// }