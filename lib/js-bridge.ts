import { useGlobalState } from "@/store";

export const JSBridge = {
  call(methodName: string, params: string) {
    try {
      const win = window as any;
      // iOS - Using `webkit.messageHandlers`
      if (
        win.webkit &&
        win.webkit.messageHandlers &&
        win.webkit.messageHandlers[methodName]
      ) {
        win.webkit.messageHandlers[methodName].postMessage(params);
        useGlobalState.setState({
          jsBridgeStatus: "success",
        });
      }
      // Android - Using `window.tmJSBridge`
      else if (
        win.tmJSBridge &&
        typeof win.tmJSBridge[methodName] === "function"
      ) {
        win.tmJSBridge[methodName](params);
        useGlobalState.setState({
          jsBridgeStatus: "success",
        });
      } else {
        useGlobalState.setState({
          jsBridgeStatus: "error",
        });
      }
    } catch {
      useGlobalState.setState({
        jsBridgeStatus: "error",
      });
    }
  },
};
