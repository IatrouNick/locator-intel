# 🔍 Locator Intel

[![Built with Playwright](https://img.shields.io/badge/Playwright-%E2%9C%94-green)](https://playwright.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-%E2%9C%94-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Locator Intel** is a smart CLI tool that helps QA engineers, testers, and developers automatically identify **stable locators** on any webpage — such as `data-testid`, `aria-label`, or `id`. It also **takes a screenshot** and visually outlines the matched elements.

## ✨ Features

- ✅ Automatically analyzes and scores DOM elements
- 🏷 Suggests the most robust locators (ID, `data-testid`, ARIA, etc.)
- 📸 Highlights them in a screenshot with red borders and labels
- 💥 Filters out brittle locators like `nth-child` or deeply nested CSS
- 💻 CLI tool built with Playwright and TypeScript

---

## 🚀 How to Use

### 📦 1. Install dependencies

```bash
npm install
