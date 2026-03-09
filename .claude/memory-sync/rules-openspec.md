# OpenSpec 開發流程規範

## 強制規則

功能開發**必須**遵守 openspec 流程，除非使用者明確同意跳過。

## 標準流程

```
proposal → design → specs → tasks → apply（實作）→ archive
```

## 目錄結構

```
openspec/
├── config.yaml              ← 專案上下文 + 規則
├── specs/                   ← main specs（最新狀態）
└── changes/
    └── archive/             ← 已封存的變更
```

## 可跳過的情況

- 使用者明確同意跳過
- 極小修改（typo fix、單行 bug fix）
- 純文件 / MD 資料變更
