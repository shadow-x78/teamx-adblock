# Automatic Updates Architecture

## How Auto-Updates Work

Chrome extensions distributed outside the Chrome Web Store can update automatically using Google's **Autoupdate Protocol** (Omaha update protocol).

```mermaid
sequenceDiagram
    participant UserChrome as User's Chrome Browser
    participant GitHubRaw as GitHub updates.xml
    participant GitHubRelease as GitHub Releases (.crx)

    Note over UserChrome: Background periodic check (every ~5 hours or on browser launch)
    UserChrome->>GitHubRaw: GET https://raw.githubusercontent.com/.../updates.xml
    GitHubRaw-->>UserChrome: 200 OK with latest version info
    alt If newer version available
        UserChrome->>GitHubRelease: GET https://github.com/.../TeamX-AdsBlock.crx
        GitHubRelease-->>UserChrome: Downloads signed .crx
        Note over UserChrome: Silently validates signature & replaces extension in background
        UserChrome->>UserChrome: Extension updated automatically (Zero user action needed!)
    else If version is current
        Note over UserChrome: No action needed
    end
```

---

## 1. Extension ID & Key Consistency

In Chromium browsers, an extension's ID is deterministically computed from the public key matching its private key (`.pem`):

- **Private Key**: `TeamX-AdsBlock.pem` (kept securely, never committed to git)
- **Extension ID**: `cnefeiflkeegmadihlfffchlmnmfedmd`

> [!IMPORTANT]
> To allow automatic updates, every new version of `TeamX-AdsBlock.crx` MUST be signed with the **same** private key (`TeamX-AdsBlock.pem`).

---

## 2. Configuration Files

### In `manifest.json`:
```json
"update_url": "https://raw.githubusercontent.com/shadow-x78/TeamX-AdsBlock/main/updates.xml"
```

### In `updates.xml`:
```xml
<?xml version='1.0' encoding='UTF-8'?>
<gupdate xmlns='http://www.google.com/update2/response' protocol='2.0'>
  <app appid='cnefeiflkeegmadihlfffchlmnmfedmd'>
    <updatecheck codebase='https://github.com/shadow-x78/TeamX-AdsBlock/releases/latest/download/TeamX-AdsBlock.crx' version='1.1' />
  </app>
</gupdate>
```

---

## 3. How to Release an Automatic Update

When you want to deploy an update to all users:

1. Increment the `"version"` field in `manifest.json` (e.g. from `"1.1"` to `"1.2"`).
2. Increment the `version` attribute in `updates.xml` to match (`version='1.2'`).
3. Commit and push your changes to GitHub.
4. Pack the new `.crx` file:
   ```bash
   google-chrome --pack-extension=/path/to/TeamX-AdsBlock --pack-extension-key=/path/to/TeamX-AdsBlock.pem
   ```
5. Create a new GitHub Release with the tag `v1.2` and upload the generated `TeamX-AdsBlock.crx`.

Once published, all users' Chrome browsers will automatically pull the update within hours without requiring any manual clicks or intervention!
