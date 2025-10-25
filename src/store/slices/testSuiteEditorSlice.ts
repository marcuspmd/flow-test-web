import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type EditorMode = 'wizard' | 'yaml' | 'form';

export interface TestSuiteData {
  name?: string;
  description?: string;
  flows?: unknown[];
  // Add more fields as needed based on TestSuite schema
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface TestSuiteEditorState {
  mode: EditorMode;
  currentData: TestSuiteData;
  generatedYAML: string;
  isDirty: boolean;
  validationErrors: ValidationError[];
  previewPanelWidth: number;
  isPreviewCollapsed: boolean;
}

const initialState: TestSuiteEditorState = {
  mode: 'wizard',
  currentData: {},
  generatedYAML: '',
  isDirty: false,
  validationErrors: [],
  previewPanelWidth: 40, // 40% of total width
  isPreviewCollapsed: false,
};

const testSuiteEditorSlice = createSlice({
  name: 'testSuiteEditor',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<EditorMode>) => {
      state.mode = action.payload;
    },

    updateTestSuiteData: (state, action: PayloadAction<Partial<TestSuiteData>>) => {
      state.currentData = {
        ...state.currentData,
        ...action.payload,
      };
      state.isDirty = true;
    },

    setTestSuiteData: (state, action: PayloadAction<TestSuiteData>) => {
      state.currentData = action.payload;
      state.isDirty = true;
    },

    setGeneratedYAML: (state, action: PayloadAction<string>) => {
      state.generatedYAML = action.payload;
    },

    setValidationErrors: (state, action: PayloadAction<ValidationError[]>) => {
      state.validationErrors = action.payload;
    },

    setPreviewPanelWidth: (state, action: PayloadAction<number>) => {
      state.previewPanelWidth = Math.min(70, Math.max(20, action.payload));
    },

    togglePreviewPanel: (state) => {
      state.isPreviewCollapsed = !state.isPreviewCollapsed;
    },

    setPreviewCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isPreviewCollapsed = action.payload;
    },

    resetEditor: (state) => {
      state.currentData = {};
      state.generatedYAML = '';
      state.isDirty = false;
      state.validationErrors = [];
      state.mode = 'wizard';
    },

    markClean: (state) => {
      state.isDirty = false;
    },
  },
});

export const {
  setMode,
  updateTestSuiteData,
  setTestSuiteData,
  setGeneratedYAML,
  setValidationErrors,
  setPreviewPanelWidth,
  togglePreviewPanel,
  setPreviewCollapsed,
  resetEditor,
  markClean,
} = testSuiteEditorSlice.actions;

export default testSuiteEditorSlice.reducer;
