import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const GAME_URL = "https://correo11011correo-netizen.github.io/brick-breaker-pro-web/";

// --- MONITOR DE LOGS NATIVO (RAW) ---
function RawLogsScreen({ logs }) {
  return (
    <SafeAreaView style={styles.logContainer}>
      <Text style={styles.logHeader}>[SYSTEM_RAW_LOGS_MONITOR]</Text>
      <ScrollView style={styles.logScroll}>
        {logs.map((l, i) => (
          <Text key={i} style={styles.logText}>
            <Text style={{color:'#444'}}>[{new Date(l.time).toLocaleTimeString()}]</Text> {l.msg}
          </Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- JUEGO EN WEBVIEW (DUAL MODE) ---
function GameScreen({ onLog }) {
  const webViewRef = useRef(null);
  
  const handleMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    onLog(`[WEBVIEW_MSG]: ${JSON.stringify(data)}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <WebView 
        ref={webViewRef}
        source={{ uri: GAME_URL }}
        onMessage={handleMessage}
        style={{ flex: 1 }}
        backgroundColor="#000"
      />
    </View>
  );
}

export default function App() {
  const [logs, setLogs] = useState([]);
  const addLog = (m) => setLogs(prev => [{ time: Date.now(), msg: m }, ...prev].slice(0, 100));

  useEffect(() => {
    addLog("KERNEL_BOOT: OK");
    addLog("CONNECTING_TO_INFRASTRUCTURE: " + GAME_URL);
  }, []);

  return (
    <NavigationContainer theme={DarkTheme}>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: '#000', borderBottomWidth: 1, borderBottomColor: '#111' },
          headerTintColor: '#0f0',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 10, fontFamily: 'monospace' },
          tabBarStyle: { backgroundColor: '#000', borderTopColor: '#111', height: 60 },
          tabBarActiveTintColor: '#0f0',
          tabBarInactiveTintColor: '#444',
          tabBarLabelStyle: { fontSize: 8, fontWeight: 'bold', marginBottom: 10 },
          tabBarIcon: ({ color, size }) => {
            let iconName = route.name === 'GAME' ? 'game-controller' : 'terminal';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="GAME">
          {() => <GameScreen onLog={addLog} />}
        </Tab.Screen>
        <Tab.Screen name="LOGS">
          {() => <RawLogsScreen logs={logs} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const DarkTheme = {
  dark: true,
  colors: { background: '#000', card: '#000', text: '#0f0', border: '#111', primary: '#0f0' }
};

const styles = StyleSheet.create({
  logContainer: { flex: 1, backgroundColor: '#000', padding: 10 },
  logHeader: { color: '#0f0', fontWeight: 'bold', fontSize: 12, marginBottom: 10, fontFamily: 'monospace' },
  logScroll: { flex: 1 },
  logText: { color: '#aaa', fontSize: 10, fontFamily: 'monospace', marginBottom: 5, borderBottomWidth: 1, borderBottomColor: '#050505' }
});
