import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import InsightsChart from "../../src/modules/Insights/InsightsChart";
import { LocalStorage } from "../../src/components/common/LocalStorage";


jest.mock("@react-native-community/async-storage", () => ({
    getItem: jest.fn()
}));
