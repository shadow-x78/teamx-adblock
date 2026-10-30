# Contributing to TeamX - Ads Block

Thank you for your interest in contributing to **TeamX - Ads Block**!

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/shadow-x78/TeamX-AdsBlock.git
   cd TeamX-AdsBlock
   ```
2. Open Chrome/Chromium and navigate to `chrome://extensions/`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the cloned directory.

## Submitting Pull Requests

1. Fork the repository and create your feature branch:
   ```bash
   git checkout -b feature/my-feature
   ```
2. Test changes directly on `olympustaff.com` to ensure zero regressions and strict domain-matching compliance.
3. Commit your changes using semantic commit messages (`feat: ...`, `fix: ...`, `docs: ...`).
4. Push your branch and open a Pull Request.

## Code Standards
- Keep dependencies at zero.
- Maintain minimal footprint and high execution speed during `document_start`.
- Follow strict Manifest V3 security boundaries.
