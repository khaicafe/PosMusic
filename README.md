# NeoCafe_khaitm
update dashboard
"build": {
    "extraResources": [
      "config.ini"
    ],
    "publish": [
      {
        "provider": "github",
        "owner": "khaicafe",
        "repo": "PosMusic-Autoupdate"
      }
    ],
    "win": {
      "icon": "./icon.ico",
      "signingHashAlgorithms": [
        "sha256"
      ],
      "publisherName": "NeoCafe",
      "signAndEditExecutable": true,
      "signDlls": true,
      "verifyUpdateCodeSignature": true,
      "certificateFile": "ca.pfx",
      "certificatePassword": "1"
    }
  },