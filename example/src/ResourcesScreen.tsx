import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { sdk } from './honeycomb';

export default function ResourcesScreen() {
  const attributes = sdk.getResourceAttributes();
  const renderValue = (value: any | undefined) => {
    if (Array.isArray(value)) {
      return `[${value.join(', ')}]`;
    }
    return String(value);
  };

  const renderResourceItem = (key: string, value: any) => (
    <View key={key} style={styles.resourceItem}>
      <Text style={styles.resourceKey}>{key}:</Text>
      <Text style={styles.resourceValue}>{renderValue(value)}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {Object.keys(attributes).length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No resource attributes found</Text>
          <Text style={styles.emptySubtext}>
            Make sure the Honeycomb SDK is configured properly
          </Text>
        </View>
      ) : (
        <View style={styles.resourceList}>
          {Object.entries(attributes)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => renderResourceItem(key, value))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  resourceList: {
    padding: 4,
  },
  resourceItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  resourceKey: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
  },
  resourceValue: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
