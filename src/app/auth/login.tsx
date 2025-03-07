import React, { createRef, useEffect } from "react";
import { NativeSyntheticEvent, View } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { WebViewMessage } from "react-native-webview/lib/WebViewTypes";
import { useSession } from "../../contexts/authContext";
import { SafeAreaView } from "react-native-safe-area-context";

// Send the cookie information back to the mobile app
const CHECK_COOKIE: string = `
  ReactNativeWebView.postMessage(document.cookie);
  true;
`;

const onNavigationStateChange = (navigationState: WebViewNavigation) => {
  if (webViewRef.current) {
    webViewRef.current.injectJavaScript(CHECK_COOKIE);
  }
};

let webViewRef = createRef<WebView>();

export function Login() {
  const { signIn } = useSession();

  const onMessage = async (event: NativeSyntheticEvent<WebViewMessage>) => {
    const { data } = event.nativeEvent;

    if (data) {
      if (data.startsWith("MT_ID_SESSION")) {
        signIn(data);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{
          uri: "http://172.16.146.58:3000/login",
        }}
        ref={webViewRef}
        onNavigationStateChange={onNavigationStateChange}
        onMessage={onMessage}
        pullToRefreshEnabled
        sharedCookiesEnabled={false}
        cacheEnabled={false}
        bounces={false}
      />
    </SafeAreaView>
  );
}
