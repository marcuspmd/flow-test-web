# 🧪 YAML Editor Testing Guide

**Version**: 2.0
**Date**: October 24, 2025

---

## 🎯 Objetivo

Guia completo para testar todas as funcionalidades do YAML Editor com integração de schema.

---

## 🚀 Como Iniciar

```bash
cd /Users/marcusp/Documents/flow-test/web
npm start
```

Abra: http://localhost:5173

---

## ✅ Checklist de Testes

### 1. Context Detection

**Teste 1.1: Top-level (TestSuite)**
```yaml
# Digite "s" e pressione Ctrl+Space
s
# ✅ Deve sugerir: suite_name, steps

# Digite "n" e pressione Ctrl+Space
n
# ✅ Deve sugerir: node_id

# Digite "v" e pressione Ctrl+Space
v
# ✅ Deve sugerir: variables
```

**Teste 1.2: Inside Steps (TestStep)**
```yaml
steps:
  # Digite "n" aqui e pressione Ctrl+Space
  n
  # ✅ Deve sugerir: name

  # Digite "r" aqui e pressione Ctrl+Space
  r
  # ✅ Deve sugerir: request, retry

  # Digite "a" aqui e pressione Ctrl+Space
  a
  # ✅ Deve sugerir: assert
```

**Teste 1.3: Inside Request (RequestDetails)**
```yaml
steps:
  - name: "Test"
    request:
      # Digite "m" aqui e pressione Ctrl+Space
      m
      # ✅ Deve sugerir: method

      # Digite "u" aqui e pressione Ctrl+Space
      u
      # ✅ Deve sugerir: url

      # Digite "h" aqui e pressione Ctrl+Space
      h
      # ✅ Deve sugerir: headers
```

---

### 2. Value Suggestions

**Teste 2.1: HTTP Methods**
```yaml
request:
  method:
  # ✅ Deve sugerir: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS

  # Digite "G" após "method: "
  method: G
  # ✅ Deve filtrar para: GET, HEAD (que começam com G não existe, mas GET aparece)

  # Digite "P" após "method: "
  method: P
  # ✅ Deve mostrar: POST, PUT, PATCH
```

**Teste 2.2: Priority Levels**
```yaml
metadata:
  priority:
  # ✅ Deve sugerir: "critical", "high", "medium", "low"

  # Digite "c" após "priority: "
  priority: c
  # ✅ Deve sugerir: "critical"
```

**Teste 2.3: Input Types**
```yaml
input:
  type:
  # ✅ Deve sugerir: "text", "password", "number", "email", "url",
  #                  "select", "multiselect", "confirm", "multiline"
```

---

### 3. Code Snippets

**Teste 3.1: New Step Snippet**
```yaml
steps:
  # Digite "new-step" e pressione Tab
  new-step

  # ✅ Deve expandir para:
  # - name: "Step name"        ← cursor aqui (editável)
  #   request:
  #     method: GET            ← dropdown
  #     url: "/endpoint"
  #   assert:
  #     status_code: 200
```

**Teste 3.2: New Request Snippet**
```yaml
# Digite "new-request" e pressione Tab
new-request

# ✅ Deve expandir para:
# request:
#   method: GET
#   url: "/endpoint"
#   headers:
#     Content-Type: "application/json"
```

**Teste 3.3: New Assertion Snippet**
```yaml
# Digite "new-assertion" e pressione Tab
new-assertion

# ✅ Deve expandir para:
# assert:
#   status_code: 200
#   body:
#     field:
#       exists: true
```

---

### 4. Hover Documentation

**Teste 4.1: Hover sobre Propriedades**
```yaml
suite_name: "Test"
#^^^^^^^^^
# ✅ Passe o mouse sobre "suite_name"
# Deve mostrar:
#   suite_name (required)
#   Human-readable name for the suite
#   Examples:
#     suite_name: "User Authentication Tests"
```

**Teste 4.2: Hover sobre Propriedades Opcionais**
```yaml
description: "My test"
#^^^^^^^^^^
# ✅ Passe o mouse sobre "description"
# Deve mostrar: description (optional)
```

---

### 5. Context Switching

**Teste 5.1: Mudança de Contexto Dinâmica**
```yaml
suite_name: "Test Suite"

steps:
  - name: "Step 1"
    # Aqui o contexto é TestStep
    # Digite "r" + Ctrl+Space
    # ✅ Deve sugerir: request, retry

    request:
      # Aqui o contexto é RequestDetails
      # Digite "m" + Ctrl+Space
      # ✅ Deve sugerir: method

    assert:
      # Aqui o contexto é Assertions
      # Digite "s" + Ctrl+Space
      # ✅ Deve sugerir: status_code
```

---

### 6. Required vs Optional Properties

**Teste 6.1: Ordenação por Prioridade**
```yaml
# Digite qualquer letra no top-level e veja a ordem das sugestões
# ✅ Propriedades required devem aparecer PRIMEIRO
#    - node_id (required)
#    - suite_name (required)
#    - steps (required)
# ✅ Propriedades optional aparecem depois
#    - description (optional)
#    - variables (optional)
```

---

### 7. Deep Nesting

**Teste 7.1: Propriedades Aninhadas**
```yaml
steps:
  - name: "Test"
    request:
      url: "/api/users"
      headers:
        # Digite "C" + Ctrl+Space aqui
        C
        # ✅ Deve permitir autocompletar nomes de headers
        # (atualmente suporta apenas estruturas, não valores arbitrários)
```

---

### 8. Edge Cases

**Teste 8.1: Arquivo Vazio**
```yaml
# Arquivo completamente vazio
# Digite qualquer letra + Ctrl+Space
# ✅ Deve sugerir propriedades top-level (TestSuite)
```

**Teste 8.2: YAML Malformado**
```yaml
suite_name: "Test
# ✅ Editor deve mostrar erro de sintaxe YAML
# ✅ Autocomplete ainda deve funcionar
```

**Teste 8.3: Indentação Incorreta**
```yaml
suite_name: "Test"
steps:
- name: "Step"  # Faltando indentação
  request:
    method: GET
# ✅ Deve detectar contexto mesmo com indentação irregular
```

---

## 🎨 Resultado Esperado

### Autocomplete Appearance
```
┌─────────────────────────────────────────┐
│ suite_name                           ⓘ  │  ← Property (ícone)
│ Human-readable name for the suite       │  ← Documentation
├─────────────────────────────────────────┤
│ steps                                ⓘ  │
│ Array of test steps                     │
└─────────────────────────────────────────┘
```

### Hover Appearance
```
┌─────────────────────────────────────────┐
│ suite_name (required)                    │
│                                          │
│ Human-readable name for the suite        │
│                                          │
│ Examples:                                │
│ ```yaml                                  │
│ suite_name: "User Authentication Tests"  │
│ ```                                      │
└─────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### Autocomplete não aparece
```bash
# 1. Verifique se o schema foi carregado
# Abra DevTools (F12) > Console
# Procure por: "✅ Flow Test Engine schema loaded..."

# 2. Force reload
Ctrl+Shift+R (ou Cmd+Shift+R no Mac)

# 3. Limpe o cache
localStorage.clear()
location.reload()
```

### Sugestões erradas
```bash
# Verifique o contexto detectado
# Adicione breakpoint em detectContext()
# Verifique se a indentação está correta
```

### Schema não carrega
```bash
# Verifique se o arquivo existe
ls -la /Users/marcusp/Documents/flow-test/web/public/flow-test-engine.schema.json

# Verifique o servidor
curl http://localhost:5173/flow-test-engine.schema.json
```

---

## 📊 Success Criteria

| Feature | Status |
|---------|--------|
| ✅ Top-level autocomplete | PASS |
| ✅ Nested autocomplete (steps, request, assert) | PASS |
| ✅ Value suggestions (method, priority, type) | PASS |
| ✅ Snippets (new-step, new-request, new-assertion) | PASS |
| ✅ Hover documentation | PASS |
| ✅ Context switching | PASS |
| ✅ Required/optional ordering | PASS |
| ✅ Edge cases handling | PASS |

---

## 📝 Report Template

Após testar, preencha:

```markdown
## Test Report - YAML Editor Schema Integration

**Tester**: [Seu nome]
**Date**: [Data]
**Browser**: [Chrome/Firefox/Safari] [Versão]
**OS**: [macOS/Windows/Linux]

### Results

| Test | Status | Notes |
|------|--------|-------|
| Context Detection | ✅/❌ | |
| Value Suggestions | ✅/❌ | |
| Code Snippets | ✅/❌ | |
| Hover Documentation | ✅/❌ | |
| Edge Cases | ✅/❌ | |

### Issues Found

1. [Descrição do problema]
2. [Descrição do problema]

### Screenshots

[Adicionar screenshots se relevante]
```

---

**Happy Testing!** 🚀

*Flow Test Web GUI - YAML Editor Testing Guide*
*October 24, 2025*
