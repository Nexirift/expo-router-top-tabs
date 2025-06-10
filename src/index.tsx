import { MaterialTopTabNavigationOptions } from "@react-navigation/material-top-tabs";
import { Navigator, ScreenProps } from "expo-router";
import { useFilterScreenChildren } from "expo-router/build/layouts/withLayoutContext";
import { useContextKey, useRouteNode } from "expo-router/build/Route";
import { useSortedScreens } from "expo-router/build/useScreens";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import {
  CollapsibleTabViewProps,
  createMaterialCollapsibleTopTabNavigator,
  useCollapsibleScene,
} from "react-native-collapsible-tab-view";

/**
 * Custom hook that measures a React Native view's height
 *
 * @returns An object containing the measured height value and an onLayout callback
 */
const useReactNativeViewHeight = () => {
  const [height, setHeight] = useState(0);

  const onLayout = useCallback(
    (event: { nativeEvent: { layout: { height: number } } }) => {
      const { height } = event.nativeEvent.layout;
      setHeight(height);
    },
    []
  );

  return { height, onLayout };
};

// Create a collapsible material top tab navigator
const Nav = createMaterialCollapsibleTopTabNavigator();

/**
 * TopTabs component provides a material design top tab navigator with collapsible header support
 * for Expo Router. This implementation is based on and compatible with the latest Expo Router features,
 * including support for protected screens.
 *
 * @example
 * ```tsx
 * <TopTabs>
 *   <TopTabs.Header>
 *     <MyCustomHeader />
 *   </TopTabs.Header>
 *
 *   <TopTabs.Screen name="tab1" options={{ title: "First Tab" }} />
 *   <TopTabs.Screen name="tab2" options={{ title: "Second Tab" }} />
 * </TopTabs>
 * ```
 *
 * Sources:
 * - https://github.com/expo/expo/blob/a41e01515c290a9f7e95c06369e6786d91eca205/packages/expo-router/src/layouts/withLayoutContext.tsx#L121
 * - https://github.com/EvanBacon/expo-router-top-tabs/blob/559ed9ba92137fe138d0775ed70b1a48e8e5008c/src/index.tsx#L75
 */
export const TopTabs = ({
  children,
  options,
  screenOptions,
  ...props
}: {
  /** Child components (Screen components and Header) */
  children?: React.ReactNode;
  /** Screen options for the top tab navigator */
  screenOptions?: MaterialTopTabNavigationOptions;
  /** Configuration options for the collapsible tab view */
  options?: Partial<CollapsibleTabViewProps<any>>;
}) => {
  const contextKey = useContextKey();

  // Filter and organize children into screens and protected screens
  const { screens, protectedScreens } = useFilterScreenChildren(children, {
    contextKey,
  });

  // Extract header component from children
  const headerChildren = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === Header
  );

  // Set up header height measurement
  const { height, onLayout } = useReactNativeViewHeight();

  // Create a memoized render function for the collapsible header
  const renderHeader = useCallback(() => {
    return (
      <View pointerEvents="box-none" onLayout={onLayout}>
        {headerChildren}
      </View>
    );
  }, [headerChildren, onLayout]);

  // Sort screens considering the routing priorities
  const sorted = useSortedScreens(screens ?? [], protectedScreens);

  // Return null if there are no screens to render
  // This prevents the navigator from throwing errors
  if (!sorted.length) {
    return null;
  }

  return (
    <Nav.Navigator
      {...props}
      id={contextKey}
      screenOptions={screenOptions}
      collapsibleOptions={{
        headerHeight: height,
        renderHeader,
        disableSnap: true, // Disable snap behavior by default
        ...options, // Allow overriding default options
      }}
    >
      {sorted}
    </Nav.Navigator>
  );
};

/**
 * Header component for TopTabs
 * Wrap your custom header content with this component
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Header content
 */
function Header({ children }: { children: React.ReactNode }) {
  return children;
}

// Add Screen component to TopTabs (and force newer props)
TopTabs.Screen = Navigator.Screen as React.FC<ScreenProps>;

// Add Header component to TopTabs
TopTabs.Header = Header;

/**
 * Hook to get scroll-related props for a collapsible scene
 * Use this in your screen components to properly handle scrolling within the tab view
 *
 * @returns Props to be spread onto a scrollable component
 * @example
 * ```tsx
 * function MyTabScreen() {
 *   const props = useScrollProps();
 *   return <Animated.ScrollView {...props}>{content}</Animated.ScrollView>;
 * }
 * ```
 */
export function useScrollProps() {
  const route = useRouteNode();
  return useCollapsibleScene(route!.route);
}
