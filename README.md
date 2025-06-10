# @nexirift/expo-router-top-tabs

[![npm version](https://img.shields.io/npm/v/@nexirift/expo-router-top-tabs.svg)](https://www.npmjs.com/package/@nexirift/expo-router-top-tabs)
[![license](https://img.shields.io/npm/l/@nexirift/expo-router-top-tabs.svg)](https://github.com/Nexirift/expo-router-top-tabs/blob/main/LICENSE)

A material design top tabs navigator with collapsible header support for [Expo Router v5](https://docs.expo.dev/router/introduction/). This package integrates `react-native-collapsible-tab-view` with Expo Router, providing a seamless way to implement collapsible headers in your tab-based navigation.

*Tested with Expo SDK v53.0.11, Expo Router v5.0.7, and React Native v0.79.3.*

## Features

- ✨ Smooth collapsing header animations
- 🧩 Seamless integration with Expo Router v5
- 📱 Material design top tabs navigation
- 🎮 Full TypeScript support
- 🔄 Compatible with animated scroll components
- 🛡️ Supports protected routes

## Installation

```bash
# Using npm
npm install @nexirift/expo-router-top-tabs react-native-collapsible-tab-view react-native-reanimated

# Using Yarn
yarn add @nexirift/expo-router-top-tabs react-native-collapsible-tab-view react-native-reanimated
```

### Required Configuration

1. **Setup Reanimated** in your `babel.config.js`:

```js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

2. Restart your development server with cache cleared:

```bash
npx expo start --clear
```

## Basic Usage

### Layout Route

Create a layout route file for your tabs (e.g., `app/(tabs)/_layout.tsx`):

```tsx
import { StyleSheet, Text, View } from "react-native";
import { TopTabs } from "@nexirift/expo-router-top-tabs";

export default function TabsLayout() {
  return (
    <TopTabs screenOptions={{ tabBarLabelStyle: { textTransform: 'none' } }}>
      <TopTabs.Header>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Collapsible Header</Text>
        </View>
      </TopTabs.Header>

      <TopTabs.Screen
        name="home"
        options={{
          title: "Home"
        }}
      />
      <TopTabs.Screen
        name="profile"
        options={{
          title: "Profile"
        }}
      />
      <TopTabs.Screen
        name="settings"
        options={{
          title: "Settings"
        }}
      />
    </TopTabs>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 150,
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
```

### Tab Screens

Create your tab screen files (e.g., `app/(tabs)/home.tsx`):

```tsx
import { Animated, StyleSheet, Text } from "react-native";
import { useScrollProps } from "@nexirift/expo-router-top-tabs";

export default function HomeScreen() {
  // Get scroll props for collapsible behavior
  const scrollProps = useScrollProps();

  return (
    <Animated.ScrollView
      {...scrollProps}
      contentContainerStyle={styles.content}
    >
      {[...Array(30)].map((_, i) => (
        <Text key={i} style={styles.item}>Item {i + 1}</Text>
      ))}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  item: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
});
```

## Advanced Configuration

### Customizing the Collapsible Behavior

You can customize the collapsible behavior by passing options to the `TopTabs` component:

```tsx
<TopTabs
  options={{
    disableSnap: false, // Enable snap behavior
    snapThreshold: 0.5, // Snap threshold (0 to 1)
    freezeOnScroll: true, // Whether to prevent unfocused tabs from scrolling
    layoutConfig: { // Configure the layout
      // Configuration options
    },
  }}
>
  {/* ... */}
</TopTabs>
```

### Tab Navigation Options

Customize the appearance and behavior of tabs using `screenOptions`:

```tsx
<TopTabs
  screenOptions={{
    tabBarLabelStyle: {
      fontSize: 14,
      textTransform: 'none',
      fontWeight: 'bold',
    },
    tabBarItemStyle: {
      width: 'auto',
      paddingHorizontal: 15,
    },
    tabBarStyle: {
      backgroundColor: '#ffffff',
      elevation: 0,
      shadowOpacity: 0,
    },
    tabBarIndicatorStyle: {
      backgroundColor: '#007AFF',
      height: 3,
    },
    tabBarActiveTintColor: '#007AFF',
    tabBarInactiveTintColor: '#8E8E93',
  }}
>
  {/* ... */}
</TopTabs>
```

### Protected Routes

TopTabs supports protected routes, consistent with Expo Router's conventions:

```tsx
<TopTabs>
  <TopTabs.Header>{/* ... */}</TopTabs.Header>

  {/* Public routes */}
  <TopTabs.Screen name="home" />
  <TopTabs.Screen name="discover" />

  {/* Protected routes (prefixed with _) */}
  <TopTabs.Screen name="_profile" />
  <TopTabs.Screen name="_settings" />
</TopTabs>
```

### Using with FlatList or Other List Components

For `FlatList` or other list components, wrap them with an `Animated.createAnimatedComponent`:

```tsx
import { Animated, FlatList } from "react-native";
import { useScrollProps } from "@nexirift/expo-router-top-tabs";

// Create an animated version of FlatList
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function MyScreen() {
  const scrollProps = useScrollProps();

  return (
    <AnimatedFlatList
      {...scrollProps}
      data={data}
      renderItem={({ item }) => <Item item={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}
```

## API Reference

### TopTabs

| Prop | Type | Description |
|------|------|-------------|
| `children` | `React.ReactNode` | Child components (TopTabs.Header and TopTabs.Screen) |
| `screenOptions` | `MaterialTopTabNavigationOptions` | Options for configuring the tab bar appearance |
| `options` | `Partial<CollapsibleTabViewProps<any>>` | Options for configuring the collapsible behavior |

### TopTabs.Screen

Same props as [Navigator.Screen](https://reactnavigation.org/docs/material-top-tab-navigator/#options) from React Navigation:

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Name of the route |
| `options` | `MaterialTopTabNavigationOptions` | Options for configuring this specific tab |
| `initialParams` | `object` | Initial params for the route |

### TopTabs.Header

| Prop | Type | Description |
|------|------|-------------|
| `children` | `React.ReactNode` | Content to render in the header |

### useScrollProps

Hook to get the necessary props for scroll components within tabs.

```tsx
const scrollProps = useScrollProps();
```

## Troubleshooting

### Header Not Collapsing

- Make sure you're using `useScrollProps()` with an Animated component.
- Ensure the header has a non-zero height.
- Check that you've properly wrapped your scrollable content with `Animated.ScrollView` or another animated component.

### React Hook Error

If you encounter a React hook error:

1. Make sure you're using `useScrollProps()` only within components rendered by the tab screens.
2. Ensure you've installed all peer dependencies correctly.
3. Try restarting your development server with cache cleared: `npx expo start --clear`.

## License

MIT
