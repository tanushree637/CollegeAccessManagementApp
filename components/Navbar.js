// components/Navbar.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../utils/colors';

const Navbar = ({ tabs, activeTab, onTabPress }) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.tab, activeTab === tab.label && styles.activeTab]}
          onPress={() => onTabPress(tab.label)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab.label && styles.activeText,
            ]}
          >
            {tab.icon ? `${tab.icon} ` : ''}
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  tab: {
    paddingHorizontal: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    color: colors.text,
  },
  activeText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default Navbar;
