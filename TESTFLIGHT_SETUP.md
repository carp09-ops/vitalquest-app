# VitalQuest TestFlight Setup (iPad-first)

The repository is already configured to build iOS on Expo Application Services (EAS) and submit the result to TestFlight whenever a commit reaches `main`.

No local Mac, Codespace, tunnel, or Expo Go session is required after the one-time Expo/Apple account setup below.

## What is already configured

- Expo SDK 57 / React Native native project
- iPad support enabled
- iOS bundle identifier: `com.vitalquestapp.mobile`
- EAS production build profile
- Remote iOS build-number management with automatic incrementing
- EAS Workflow at `.eas/workflows/submit-ios.yml`
- Workflow trigger: every push to `main`
- Workflow action: build iOS production binary, then submit it to TestFlight

## One-time browser/account setup

### 1. Create or sign in to an Expo account

Open https://expo.dev/ on the iPad and sign in.

### 2. Create the EAS project

Create a project named `vitalquest-app` in Expo. The project slug must match `vitalquest-app`.

EAS will assign the project a Project ID. Once created, link this repository to that EAS project.

### 3. Connect GitHub to Expo

In Expo:

1. Open Account Settings.
2. Under Connections, connect GitHub.
3. Install/authorize the Expo GitHub App if prompted.
4. Open the VitalQuest EAS project.
5. Open Project settings → GitHub.
6. Connect `carp09-ops/vitalquest-app`.
7. Leave the base directory as `/`.

### 4. Confirm Apple Developer membership

TestFlight requires an active paid Apple Developer Program membership.

### 5. Configure iOS signing and App Store Connect credentials

The production build needs:

- an Apple distribution certificate
- an App Store distribution provisioning profile
- App Store Connect credentials/API key for TestFlight submission

Prefer Expo-managed credentials. Expo can reuse these for every later cloud build.

If credentials already exist, they can be managed from the EAS project under Project settings → Configuration → Credentials.

For a brand-new Apple setup, an authorized Apple Developer user must create/configure the signing credentials once. After they are stored with EAS, future production builds are non-interactive.

### 6. Connect/create the App Store Connect app

The App Store Connect record must use the same iOS bundle identifier:

`com.vitalquestapp.mobile`

App name: `VitalQuest`

Once the App Store Connect app and credentials are linked to EAS, the TestFlight workflow can submit automatically.

## Day-to-day workflow after setup

1. Changes are committed to `main` in GitHub.
2. EAS sees the push.
3. `VitalQuest TestFlight` starts automatically.
4. EAS creates a production iOS build.
5. The build number is incremented automatically.
6. The finished build is submitted to TestFlight.
7. Apple processes the build.
8. Open TestFlight on the iPad and install/update VitalQuest.

## Important

The workflow file is intentionally committed now, but it will not successfully produce a TestFlight build until the EAS project, GitHub connection, Apple signing credentials, and App Store Connect connection have been completed.

After the first successful build, normal app development can happen entirely through GitHub + EAS + TestFlight from the iPad.
