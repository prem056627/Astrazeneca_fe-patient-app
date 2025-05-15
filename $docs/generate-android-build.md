# Android Keystore Management

This directory contains the keystore configuration for signing the Android app. The keystore is essential for publishing the app to the Google Play Store and ensuring its authenticity.

## Keystore Location

The keystore file (`newmi-key.keystore`) should be placed in this directory.

## Important Security Notice

- **NEVER** share keystore credentials publicly
- Keep a secure backup of the keystore file
- Store credentials in a secure password manager

## Keystore Information

- File Name: `newmi-key.keystore`
- Key Alias: `newmi-key-alias`
- Validity: 10000 days
- Algorithm: RSA
- Key Size: 2048 bits

## First-time Setup

1. add below config to `build.gradle` in this path `app-react-native/android/app` path

```
 release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
```

2. add below config to `gradle.properties` in this path `app-react-native/android` path

```
MYAPP_UPLOAD_STORE_FILE=newmi-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=<pasxword> (default zelthy pasword)
MYAPP_UPLOAD_KEY_PASSWORD=<password> (default zelthy pasword)
```

3. change `app-react-native/android/app/build.gradle` file (add signingConfigs.release instead of signingConfigs.debug in buildTypes)

```
    release {
            signingConfig signingConfigs.release
            shrinkResources (findProperty('android.enableShrinkResourcesInReleaseBuilds')?.toBoolean() ?: false)
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
            crunchPngs (findProperty('android.enablePngCrunchInReleaseBuilds')?.toBoolean() ?: true)
        }
```


Don't forget to update version code and build number in `app-react-native/app.json` file.