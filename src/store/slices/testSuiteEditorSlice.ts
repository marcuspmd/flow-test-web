import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TestSuiteWizardData } from '../../components/organisms/TestSuiteWizard/types';
import { TestSuiteFormData, wizardToYAML, yamlToWizard, formToYAML, yamlToForm, wizardToForm, formToWizard } from '../../utils/testSuiteConverters';

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
  wizardData: TestSuiteWizardData;
  formData: TestSuiteFormData;
  generatedYAML: string;
  isDirty: boolean;
  lastSaved: number | null;
  validationErrors: ValidationError[];
  previewPanelWidth: number;
  isPreviewCollapsed: boolean;
}

const initialState: TestSuiteEditorState = {
  mode: 'wizard',
  currentData: {},
  wizardData: {},
  formData: {},
  generatedYAML: '',
  isDirty: false,
  lastSaved: null,
  validationErrors: [],
  previewPanelWidth: 40, // 40% of total width
  isPreviewCollapsed: false,
};

const testSuiteEditorSlice = createSlice({
  name: 'testSuiteEditor',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<EditorMode>) => {
      const newMode = action.payload;
      const oldMode = state.mode;

      // Convert data when switching modes
      try {
        if (oldMode === 'wizard' && newMode === 'yaml') {
          state.generatedYAML = wizardToYAML(state.wizardData);
        } else if (oldMode === 'wizard' && newMode === 'form') {
          state.formData = wizardToForm(state.wizardData);
          state.generatedYAML = wizardToYAML(state.wizardData);
        } else if (oldMode === 'yaml' && newMode === 'wizard') {
          state.wizardData = yamlToWizard(state.generatedYAML);
        } else if (oldMode === 'yaml' && newMode === 'form') {
          state.formData = yamlToForm(state.generatedYAML);
        } else if (oldMode === 'form' && newMode === 'wizard') {
          state.wizardData = formToWizard(state.formData);
          state.generatedYAML = formToYAML(state.formData);
        } else if (oldMode === 'form' && newMode === 'yaml') {
          state.generatedYAML = formToYAML(state.formData);
        }
      } catch (error) {
        console.error('Failed to convert between modes:', error);
      }

      state.mode = newMode;
    },

    updateTestSuiteData: (state, action: PayloadAction<Partial<TestSuiteData>>) => {
      state.currentData = {
        ...state.currentData,
        ...action.payload,
      };
      state.isDirty = true;
    },

    updateWizardData: (state, action: PayloadAction<Partial<TestSuiteWizardData>>) => {
      state.wizardData = {
        ...state.wizardData,
        ...action.payload,
      };
      try {
        state.generatedYAML = wizardToYAML(state.wizardData);
      } catch (error) {
        console.error('Failed to generate YAML from wizard data:', error);
      }
      state.isDirty = true;
    },

    setWizardData: (state, action: PayloadAction<TestSuiteWizardData>) => {
      state.wizardData = action.payload;
      try {
        state.generatedYAML = wizardToYAML(action.payload);
      } catch (error) {
        console.error('Failed to generate YAML from wizard data:', error);
      }
      state.isDirty = true;
    },

    updateFormData: (state, action: PayloadAction<Partial<TestSuiteFormData>>) => {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };
      try {
        state.generatedYAML = formToYAML(state.formData);
      } catch (error) {
        console.error('Failed to generate YAML from form data:', error);
      }
      state.isDirty = true;
    },

    setFormData: (state, action: PayloadAction<TestSuiteFormData>) => {
      state.formData = action.payload;
      try {
        state.generatedYAML = formToYAML(action.payload);
      } catch (error) {
        console.error('Failed to generate YAML from form data:', error);
      }
      state.isDirty = true;
    },

    updateYAMLContent: (state, action: PayloadAction<string>) => {
      state.generatedYAML = action.payload;
      try {
        // Try to sync with other modes
        state.wizardData = yamlToWizard(action.payload);
        state.formData = yamlToForm(action.payload);
      } catch (error) {
        // Invalid YAML - don't update other modes
        console.error('Invalid YAML, not syncing with other modes:', error);
      }
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
      state.wizardData = {};
      state.formData = {};
      state.generatedYAML = '';
      state.isDirty = false;
      state.lastSaved = null;
      state.validationErrors = [];
      state.mode = 'wizard';
    },

    markClean: (state) => {
      state.isDirty = false;
      state.lastSaved = Date.now();
    },

    restoreFromAutoSave: (state, action: PayloadAction<{ mode: EditorMode; yamlContent: string }>) => {
      state.mode = action.payload.mode;
      state.generatedYAML = action.payload.yamlContent;
      try {
        state.wizardData = yamlToWizard(action.payload.yamlContent);
        state.formData = yamlToForm(action.payload.yamlContent);
      } catch (error) {
        console.error('Failed to restore from auto-save:', error);
      }
      state.isDirty = true;
    },
  },
});

export const {
  setMode,
  updateTestSuiteData,
  updateWizardData,
  setWizardData,
  updateFormData,
  setFormData,
  updateYAMLContent,
  setTestSuiteData,
  setGeneratedYAML,
  setValidationErrors,
  setPreviewPanelWidth,
  togglePreviewPanel,
  setPreviewCollapsed,
  resetEditor,
  markClean,
  restoreFromAutoSave,
} = testSuiteEditorSlice.actions;

export default testSuiteEditorSlice.reducer;
