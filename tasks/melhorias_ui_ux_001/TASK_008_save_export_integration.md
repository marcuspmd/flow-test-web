# 📋 TASK_008: Integrar Salvamento e Exportação de Test Suites

## 🎯 Objetivo
Implementar funcionalidades para salvar test suite criada (via Electron IPC), exportar YAML para arquivo, e adicionar test suite à collection existente.

## 🏷️ Metadados
| Campo | Valor |
|-------|-------|
| **ID** | TASK_008 |
| **Branch** | feature/TASK_008-save-export-integration |
| **Status** | 🔴 To Do |
| **Prioridade** | P1 (Alta) |
| **Estimativa** | 3 horas |
| **Sprint** | Sprint 2 |
| **Tags** | `electron-ipc`, `file-system`, `export`, `save` |

## 🔗 Relacionamentos
- **Bloqueada por:** TASK_003, TASK_007
- **Relacionada com:** TASK_001 (collections view precisa atualizar)

## 📊 Critérios de Aceite
- [ ] Botão "Save" salva YAML em diretório escolhido pelo usuário
- [ ] Botão "Export YAML" baixa arquivo .yaml
- [ ] Botão "Add to Collection" adiciona à collection selecionada
- [ ] Validação antes de salvar (schema compliance)
- [ ] Feedback visual (loading, success, error states)
- [ ] Integração com Electron IPC (write-file)
- [ ] Atualizar sidebar Collections view após adicionar

## 🚀 Plano de Execução

### IMPLEMENTAÇÃO

#### Passo 1: Implementar Save via Electron IPC
**Tempo Estimado:** 1h

- [ ] **1.1** Criar handler no processo main do Electron

  ```typescript
  // electron/main.ts
  ipcMain.handle('save-test-suite', async (event, { content, suggestedName }) => {
    const { filePath } = await dialog.showSaveDialog({
      title: 'Save Test Suite',
      defaultPath: `${suggestedName}.yaml`,
      filters: [
        { name: 'YAML Files', extensions: ['yaml', 'yml'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    if (!filePath) return { canceled: true };

    try {
      await fs.writeFile(filePath, content, 'utf-8');
      return { success: true, filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
  ```

- [ ] **1.2** Expor no preload script

  ```typescript
  // electron/preload.ts
  contextBridge.exposeInMainWorld('electron', {
    saveTestSuite: (content: string, suggestedName: string) =>
      ipcRenderer.invoke('save-test-suite', { content, suggestedName }),
  });
  ```

- [ ] **1.3** Criar service no renderer

  ```typescript
  // src/services/testSuiteFile.service.ts
  export const saveTestSuite = async (
    yamlContent: string,
    suggestedName: string
  ): Promise<SaveResult> => {
    if (!window.electron?.saveTestSuite) {
      throw new Error('Electron API not available');
    }

    return await window.electron.saveTestSuite(yamlContent, suggestedName);
  };
  ```

#### Passo 2: Implementar Export YAML (Download)
**Tempo Estimado:** 0.5h

- [ ] **2.1** Criar função de download no browser

  ```tsx
  // src/utils/fileDownload.ts
  export const downloadYAML = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.yaml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  ```

- [ ] **2.2** Integrar no componente NewTestSuitePage

  ```tsx
  const handleExport = () => {
    const yamlContent = selectGeneratedYAML(state);
    const filename = selectTestSuiteName(state) || 'test-suite';
    downloadYAML(yamlContent, filename);
  };
  ```

#### Passo 3: Implementar "Add to Collection"
**Tempo Estimado:** 1h

- [ ] **3.1** Criar modal de seleção de collection

  ```tsx
  // src/components/organisms/AddToCollectionModal.tsx
  const AddToCollectionModal = ({ yamlContent, onClose, onSuccess }) => {
    const collections = useSelector(selectCollections);
    const [selectedCollection, setSelectedCollection] = useState(null);

    const handleAdd = async () => {
      await addTestSuiteToCollection(selectedCollection.id, yamlContent);
      dispatch(refreshCollections());
      onSuccess();
      onClose();
    };

    return (
      <Modal>
        <ModalHeader>Add to Collection</ModalHeader>
        <ModalBody>
          <Select
            options={collections}
            value={selectedCollection}
            onChange={setSelectedCollection}
            placeholder="Select a collection..."
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleAdd} disabled={!selectedCollection}>
            Add
          </Button>
        </ModalFooter>
      </Modal>
    );
  };
  ```

- [ ] **3.2** Implementar lógica de adição à collection

  **Ações:**
  - Salvar arquivo YAML no diretório da collection
  - Atualizar metadata da collection (collections.json)
  - Notificar sidebar para refresh

#### Passo 4: Validação e Feedback
**Tempo Estimado:** 0.5h

- [ ] **4.1** Validar YAML antes de salvar

  ```tsx
  const handleSave = async () => {
    const yamlContent = selectGeneratedYAML(state);

    // Validar schema
    const validation = validateTestSuiteYAML(yamlContent);
    if (!validation.valid) {
      showError(`Invalid YAML: ${validation.errors.join(', ')}`);
      return;
    }

    // Salvar
    setLoading(true);
    try {
      const result = await saveTestSuite(yamlContent, testSuiteName);
      if (result.success) {
        showSuccess('Test Suite saved successfully!');
        setIsDirty(false);
      }
    } catch (error) {
      showError(`Failed to save: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  ```

- [ ] **4.2** Implementar estados visuais

  **Estados:**
  - Loading (botão com spinner)
  - Success (toast notification + checkmark)
  - Error (toast com mensagem de erro)

## 📝 Notas de Implementação

### Decisões Tomadas
- **Decisão 1:** Save usa dialog nativo do Electron (melhor UX)
- **Decisão 2:** Export download direto no browser (backup se Electron falhar)
- **Decisão 3:** Add to Collection requer seleção manual (evitar adições acidentais)

### Electron IPC Channels
- `save-test-suite` - Salvar arquivo YAML
- `read-file` - Ler arquivo (já existe)
- `write-file` - Escrever arquivo (já existe)

## 🎯 Definition of Done
- [ ] Save via Electron funcionando
- [ ] Export download funcionando
- [ ] Add to Collection implementado
- [ ] Validação antes de salvar
- [ ] Estados visuais (loading, success, error)
- [ ] Collections view atualiza após adicionar
- [ ] Type-check sem erros
- [ ] Testes de integração passando
