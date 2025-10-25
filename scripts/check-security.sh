#!/bin/bash

###############################################################################
# Electron Security Checker
# Verifica se todas as configurações de segurança estão corretas
###############################################################################

echo "🔒 Verificando Configurações de Segurança do Electron..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Check function
check() {
  local name="$1"
  local command="$2"
  local expected="$3"

  echo -n "Verificando $name... "

  if eval "$command" | grep -q "$expected"; then
    echo -e "${GREEN}✓ OK${NC}"
    ((PASSED++))
  else
    echo -e "${RED}✗ FALHOU${NC}"
    ((FAILED++))
  fi
}

# Warning function
warn() {
  local message="$1"
  echo -e "${YELLOW}⚠ Warning: $message${NC}"
  ((WARNINGS++))
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Verificando main.ts (Configurações WebPreferences)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

MAIN_FILE="electron/main.ts"

if [ ! -f "$MAIN_FILE" ]; then
  echo -e "${RED}✗ Arquivo $MAIN_FILE não encontrado!${NC}"
  exit 1
fi

check "nodeIntegration: false" "cat $MAIN_FILE" "nodeIntegration: false"
check "contextIsolation: true" "cat $MAIN_FILE" "contextIsolation: true"
check "Preload script configurado" "cat $MAIN_FILE" "preload:"
check "CSP configurada" "cat $MAIN_FILE" "Content-Security-Policy"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. Verificando preload.ts (contextBridge)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

PRELOAD_FILE="electron/preload.ts"

if [ ! -f "$PRELOAD_FILE" ]; then
  echo -e "${RED}✗ Arquivo $PRELOAD_FILE não encontrado!${NC}"
  exit 1
fi

check "contextBridge importado" "cat $PRELOAD_FILE" "contextBridge"
check "exposeInMainWorld usado" "cat $PRELOAD_FILE" "exposeInMainWorld"
check "flowTestAPI exposto" "cat $PRELOAD_FILE" "flowTestAPI"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. Verificando Types (electron.d.ts)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

TYPES_FILE="src/types/electron.d.ts"

if [ ! -f "$TYPES_FILE" ]; then
  warn "Arquivo $TYPES_FILE não encontrado"
else
  check "Window interface estendida" "cat $TYPES_FILE" "interface Window"
  check "flowTestAPI tipado" "cat $TYPES_FILE" "flowTestAPI"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. Verificando CSP Policy"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check "CSP - default-src 'self'" "cat $MAIN_FILE" "default-src 'self'"
check "CSP - Production mode" "cat $MAIN_FILE" "script-src 'self'"

# Check if dev mode has different CSP
if grep -q "isDev" "$MAIN_FILE" && grep -q "unsafe-eval" "$MAIN_FILE"; then
  echo -e "${GREEN}✓ CSP diferenciada para dev/prod detectada${NC}"
  ((PASSED++))
else
  warn "CSP pode não estar diferenciada para dev/prod"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. Verificando Dependências"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "package.json" ]; then
  check "electron instalado" "cat package.json" "\"electron\":"
  check "electron-builder instalado" "cat package.json" "\"electron-builder\":"
else
  echo -e "${RED}✗ package.json não encontrado!${NC}"
  ((FAILED++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. Verificando Scripts NPM"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "package.json" ]; then
  check "Script 'dev' configurado" "cat package.json" "\"dev\":"
  check "Script 'build' configurado" "cat package.json" "\"build\":"
  check "Script 'package' configurado" "cat package.json" "\"package\":"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESUMO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "✅ Verificações Passaram: ${GREEN}$PASSED${NC}"
echo -e "❌ Verificações Falharam: ${RED}$FAILED${NC}"
echo -e "⚠️  Avisos: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}✅ TODAS AS VERIFICAÇÕES DE SEGURANÇA PASSARAM!${NC}"
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  exit 0
else
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${RED}❌ ALGUMAS VERIFICAÇÕES FALHARAM!${NC}"
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo "Por favor, corrija os problemas acima antes de continuar."
  exit 1
fi
