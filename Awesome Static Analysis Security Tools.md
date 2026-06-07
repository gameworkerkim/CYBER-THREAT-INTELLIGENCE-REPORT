
# Awesome Static Analysis Security (SAST) Tools

A curated list of open-source static application security testing (SAST) tools, categorized by **Generality**, **Popularity**, and **Language Support**.

## Table of Contents

- [By Generality (General vs Language-Specific)](#-by-generality-general-vs-language-specific)
- [By Popularity (GitHub Stars & Community Trends)](#-by-popularity-github-stars--community-trends)
- [By Language (Java, Python, JavaScript, Go, Rust, etc.)](#-by-language-java-python-javascript-go-rust-etc)
- [Additional Resources](#-additional-resources)

---

## By Generality (General vs Language-Specific)

### General-Purpose SAST Tools (Multi-Language)

| Tool | Description | Languages |
|------|-------------|-----------|
| [**Semgrep**](https://github.com/semgrep/semgrep) | Lightweight static analysis with custom YAML rules and fast CI/CD integration; supports 30+ languages. | 30+ (C#, Go, Java, JS, Python, Ruby, Rust, Scala, Terraform, TS, etc.) |
| [**CodeQL**](https://github.com/github/codeql) | Deep semantic analysis with QL query language, built for GitHub Security Lab and vulnerability research. | ~17 (C/C++, C#, Go, Java, JS, Python, Ruby, Swift, etc.) |
| [**SonarQube**](https://github.com/SonarSource/sonarqube) | Comprehensive code quality platform with built-in security rules, quality gates, and technical debt tracking. | 35+ languages |
| [**Opengrep**](https://github.com/opengrep/opengrep) | Semgrep fork under LGPL-2.1, community-driven with 30+ language support. | 30+ (Semgrep-compatible rules) |
| [**Bearer**](https://github.com/Bearer/bearer) | Security & privacy-focused SAST with data-flow analysis for PII/PHI detection. | Go, Java, JS, PHP, Python, Ruby, TS |
| [**Horusec**](https://github.com/ZupIT/horusec) | Orchestrates 20+ SAST tools in one command; great for DevSecOps pipelines. | C#, Go, Java, JS, Kotlin, Python, Ruby, etc. |

### Language-Specific SAST Tools

| Tool | Target Language | Description |
|------|----------------|-------------|
| [**Bandit**](https://github.com/PyCQA/bandit) | Python | Security linter for Python AST, finds common vulnerabilities and hardcoded secrets. |
| [**Brakeman**](https://github.com/presidentbeef/brakeman) | Ruby (Rails) | Deep Rails framework-aware analysis with low false positives. |
| [**gosec**](https://github.com/securego/gosec) | Go | Security inspector for Go source code, scanning AST for vulnerabilities. |
| [**SpotBugs**](https://github.com/spotbugs/spotbugs) | Java | Successor to FindBugs, detects bug patterns in Java bytecode. |
| [**PMD**](https://github.com/pmd/pmd) | Java, JS, Swift, etc. | Extensible multi-language analyzer for common flaws like unused variables and empty catch blocks. |
| [**NodeJsScan**](https://github.com/ajinabraham/nodejsscan) | Node.js | Static security code scanner for Node.js applications. |
| [**Flawfinder**](https://github.com/david-a-wheeler/flawfinder) | C/C++ | Built-in database of dangerous functions (strcpy, gets, printf, etc.). |
| [**cppcheck**](https://github.com/danmar/cppcheck) | C/C++ | Focuses on errors compilers miss, aims for zero false positives. |
| [**Pylint**](https://github.com/PyCQA/pylint) | Python | Extensible static analysis and code quality checker. |
| [**PHPStan**](https://github.com/phpstan/phpstan) | PHP | Finds bugs in PHP code without running it. |
| [**RATS**](https://github.com/redteamsecurity/rats) | C, Perl, PHP, Python | General-purpose security scanner for multiple languages. |

### Infrastructure as Code (IaC) & Secrets Detection

| Tool | Category | Description |
|------|----------|-------------|
| [**Terrascan**](https://github.com/tenable/terrascan) | IaC | Compliance and security violation detection for Terraform, K8s, Docker. |
| [**Checkov**](https://github.com/bridgecrewio/checkov) | IaC | Static analysis for Terraform, CloudFormation, K8s, ARM. |
| [**KICS**](https://github.com/Checkmarx/kics) | IaC | 2,000+ queries for infrastructure code. |
| [**gitleaks**](https://github.com/gitleaks/gitleaks) | Secrets | Hardcoded secrets detection (API keys, passwords, tokens). |
| [**TruffleHog**](https://github.com/trufflesecurity/trufflehog) | Secrets | Deep credential scanning across Git repositories. |

---

## By Popularity (GitHub Stars & Community Trends)

Based on the **"State of Open Source AppSec Tools 2026"** research covering 64 open-source AppSec tools with **608,000+ combined GitHub stars**.

### Top SAST Projects by GitHub Stars

| Rank | Tool | Stars (Approx.) | Category |
|------|------|----------------|----------|
| 1 | [**analysis-tools-dev/static-analysis**](https://github.com/analysis-tools-dev/static-analysis) | ~12.8K | Meta-list (curated directory) |
| 2 | [**semgrep/semgrep**](https://github.com/semgrep/semgrep) | ~9.7K | General-purpose SAST |
| 3 | [**terrascan**](https://github.com/tenable/terrascan) | ~4.4K | IaC security |
| 4 | [**nodejsscan**](https://github.com/ajinabraham/nodejsscan) | ~2.3K | Node.js security |
| 5 | [**bearer/bearer**](https://github.com/Bearer/bearer) | ~1.8K | Privacy-focused SAST |
| 6 | [**CodeQL** (ASTTeam/CodeQL)](https://github.com/ASTTeam/CodeQL) | ~1.3K | Semantic analysis |
| 7 | [**horusec**](https://github.com/ZupIT/horusec) | ~1.1K | SAST orchestrator |

### Popularity Highlights

- **SAST category** includes 16 tools with **~119,881 combined stars**.
- **Secrets detection tools punch above their weight**: Gitleaks and TruffleHog have ~25K stars each.
- **Most-starred AppSec tool overall**: Ghidra (64K stars, mobile reverse engineering).
- **Fastest-growing SAST**: Semgrep is the 2026 default open-source SAST tool.
- **Top recommended free starter stack**: Semgrep CE + Trivy + Grype + Checkov + Gitleaks + ZAP (covers SAST, SCA, IaC, secrets, DAST).

### Industry Trends

- **87% of organizations** use open-source security tools.
- SAST tools produce **40-60% false positives** on default config (drops to 10-20% when tuned).
- **Well-configured OSS tools** can match or exceed poorly configured commercial tools (OWASP Benchmark).
- Go is the most common language for open-source security tools, followed by Python and Java.

---

## By Language (Java, Python, JavaScript, Go, Rust, etc.)

### ☕ Java & JVM Languages

| Tool | Description |
|------|-------------|
| [**SpotBugs**](https://github.com/spotbugs/spotbugs) | Find bugs in Java bytecode (FindBugs successor). |
| [**PMD**](https://github.com/pmd/pmd) | Extensible static analyzer for Java, Apex, Swift, etc.. |
| [**Checkstyle**](https://github.com/checkstyle/checkstyle) | Code style and convention enforcement for Java. |
| [**Error Prone**](https://github.com/google/error-prone) | Google's bug detection for Java (compiler plugin). |
| [**JLint**](https://oss-security.openwall.org/wiki/tools) | Race condition, locking errors, null pointer detection. |

### Python

| Tool | Description |
|------|-------------|
| [**Bandit**](https://github.com/PyCQA/bandit) | Security-focused linter with high effectiveness for Python security flaws. |
| [**Pylint**](https://github.com/PyCQA/pylint) | Extensible code analysis and quality checker. |
| [**Flake8**](https://github.com/PyCQA/flake8) | Wrapper around PyFlakes, pycodestyle, and McCabe. |
| [**Ruff**](https://github.com/astral-sh/ruff) | Extremely fast Python linter (Rust-based). |

### JavaScript / TypeScript

| Tool | Description |
|------|-------------|
| [**ESLint**](https://github.com/eslint/eslint) | Pluggable linting with security plugins (eslint-plugin-security). |
| [**NodeJsScan**](https://github.com/ajinabraham/nodejsscan) | Dedicated Node.js static security scanner. |
| [**TypeScript ESLint**](https://github.com/typescript-eslint/typescript-eslint) | TypeScript-aware linting with security rules. |

### Go

| Tool | Description |
|------|-------------|
| [**gosec**](https://github.com/securego/gosec) | Security inspector for Go source code. |
| [**staticcheck**](https://github.com/dominikh/go-tools) | Advanced Go linter with security-focused checks. |
| [**govulncheck**](https://github.com/golang/vuln) | Vulnerability detection for Go modules. |

### Rust

| Tool | Description |
|------|-------------|
| [**Clippy**](https://github.com/rust-lang/rust-clippy) | Rust's official linter with security lint groups. |
| [**cargo-audit**](https://github.com/RustSec/cargo-audit) | Vulnerability scanner for Rust dependencies. |
| [**cargo-deny**](https://github.com/EmbarkStudios/cargo-deny) | License and security checks for Rust crates. |

### Mobile Security (iOS / Android)

| Tool | Description |
|------|-------------|
| [**MobSF**](https://github.com/MobSF/Mobile-Security-Framework-MobSF) | Mobile App Security Framework (SAST + DAST for Android/iOS). |
| [**mobsfscan**](https://github.com/MobSF/mobsfscan) | SAST module for MobSF, semgrep + libsast powered. |
| [**Qark**](https://github.com/linkedin/qark) | Static analysis for Android app security. |

### Ruby (Rails)

| Tool | Description |
|------|-------------|
| [**Brakeman**](https://github.com/presidentbeef/brakeman) | Deep Rails framework-aware SAST with low false positives. |
| [**RuboCop**](https://github.com/rubocop/rubocop) | Linter with security extension (rubocop-rails, rubocop-performance). |

### C / C++

| Tool | Description |
|------|-------------|
| [**cppcheck**](https://github.com/danmar/cppcheck) | Static analyzer focusing on memory, concurrency, and security. |
| [**Flawfinder**](https://github.com/david-a-wheeler/flawfinder) | Built-in database of dangerous C/C++ functions. |
| [**Clang Static Analyzer**](https://clang-analyzer.llvm.org/) | Built into Clang compiler for C/C++/Obj-C. |
| [**Infer**](https://github.com/facebook/infer) | Facebook's static analyzer for C/C++ and Java. |

### PHP

| Tool | Description |
|------|-------------|
| [**PHPStan**](https://github.com/phpstan/phpstan) | Finds bugs in PHP without running it. |
| [**Psalm**](https://github.com/vimeo/psalm) | Static analysis for PHP with security-focused rules. |

### Infrastructure as Code (IaC)

| Tool | Description |
|------|-------------|
| [**Terrascan**](https://github.com/tenable/terrascan) | IaC compliance and security (Terraform, K8s, Docker). |
| [**Checkov**](https://github.com/bridgecrewio/checkov) | Policy-as-code for cloud infrastructure. |
| [**KICS**](https://github.com/Checkmarx/kics) | 2,000+ IaC queries, multi-cloud support. |
| [**tfsec**](https://github.com/aquasecurity/tfsec) | Terraform-specific security scanner. |

---

## Additional Resources

### Awesome Lists & Directories

| Resource | Description |
|----------|-------------|
| [**analysis-tools-dev/static-analysis**](https://github.com/analysis-tools-dev/static-analysis) | **The go-to Awesome List** — curated list of static analysis (SAST) tools for all programming languages (12.8K+ stars). |
| [**azjezz/awesome-static-analysis**](https://github.com/azjezz/awesome-static-analysis) | Collection of linters and code quality checkers. |
| [**AppSec Santa SAST Tools Comparison**](https://appsecsanta.com/sast-tools) | Comprehensive 2026 guide with 9 free scanners compared. |
| [**OWASP SAST Tools List**](https://owasp.org/www-community/Source_Code_Analysis_Tools) | Community-maintained list of source code analysis tools. |

### Benchmarks & Research

- **OWASP Benchmark** — Most commonly used but lacks diversity due to imbalanced nature.
- **Juliet Test Suite** — More extensive and exhaustive coverage for evaluation.
- **RealVuln Benchmark** — Compares rule-based, general-purpose LLM, and security-specialized scanners on real-world code.
- **SLR on SAST Tools** — SonarQube popular for Java, Checkmarx higher precision with more FPs, Bandit effective for Python.

---

## Quick Selection Guide

| If you need... | Recommended tools |
|----------------|-------------------|
| **Fast CI/CD integration** | Semgrep, Horusec |
| **Deep vulnerability research** | CodeQL (semantic analysis) |
| **Code quality + security** | SonarQube Community Edition |
| **Privacy/PII compliance** | Bearer |
| **Mobile app security** | MobSF, mobsfscan |
| **IaC security** | Terrascan, Checkov, KICS |
| **Secrets scanning** | Gitleaks, TruffleHog |
| **Python-only projects** | Bandit + Pylint + Ruff |
| **Java-only projects** | SpotBugs + PMD + Error Prone |
| **Zero-cost starter stack** | Semgrep CE + Trivy + Gitleaks + Checkov |

---

## Contributing

This list is maintained as a community resource. To add or suggest tools, please refer to the primary Awesome List repository:

**[analysis-tools-dev/static-analysis](https://github.com/analysis-tools-dev/static-analysis)**

---

> **Note on 2026 Trends**: Go is the most common language for open-source AppSec tools. 87% of organizations use open-source security tools. False positive rates remain a key challenge — most SAST tools require tuning to reduce from 40-60% to 10-20%.
