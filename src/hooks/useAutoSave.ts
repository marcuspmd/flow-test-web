/**
 * Auto-save hook for persisting test suite editor state to localStorage
 */

import { useEffect, useRef } from 'react';
import { EditorMode } from '../store/slices/testSuiteEditorSlice';

const AUTO_SAVE_KEY = 'flow-test-editor-autosave';

export interface AutoSaveData {
  mode: EditorMode;
  yamlContent: string;
  timestamp: number;
  testSuiteName?: string;
}

/**
 * Auto-save data to localStorage with debounce
 */
export const useAutoSave = (
  mode: EditorMode,
  yamlContent: string,
  testSuiteName?: string,
  delay = 1000
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      const autoSaveData: AutoSaveData = {
        mode,
        yamlContent,
        timestamp: Date.now(),
        testSuiteName,
      };

      try {
        localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(autoSaveData));
      } catch (error) {
        console.error('Failed to auto-save:', error);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [mode, yamlContent, testSuiteName, delay]);
};

/**
 * Restore auto-saved data from localStorage
 */
export const restoreAutoSave = (): AutoSaveData | null => {
  try {
    const saved = localStorage.getItem(AUTO_SAVE_KEY);
    if (!saved) return null;

    const data: AutoSaveData = JSON.parse(saved);
    
    // Check if data is not too old (e.g., 7 days)
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    if (Date.now() - data.timestamp > maxAge) {
      clearAutoSave();
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to restore auto-save:', error);
    return null;
  }
};

/**
 * Clear auto-saved data
 */
export const clearAutoSave = () => {
  try {
    localStorage.removeItem(AUTO_SAVE_KEY);
  } catch (error) {
    console.error('Failed to clear auto-save:', error);
  }
};

/**
 * Check if there's unsaved data
 */
export const hasAutoSave = (): boolean => {
  try {
    return localStorage.getItem(AUTO_SAVE_KEY) !== null;
  } catch (error) {
    return false;
  }
};
