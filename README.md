# IT Meeting Minutes Generator — Firebase Version

A GitHub Pages-ready website for generating structured IT meeting minutes and saving/loading records from Firebase Realtime Database.

## Files

```text
index.html
styles.css
app.js
sample-data.js
firebase-config.js
README.md
EDITING-NOTES.txt
```

## What this version can do

- Save meeting records directly to Firebase Realtime Database.
- Load the latest saved meeting automatically.
- View and load previous meeting records from Firebase.
- Generate clean Minutes of Meeting from the form.
- Copy, print, download HTML, download Word, and download JSON backup.
- Save temporary browser draft using localStorage.
- Run directly on GitHub Pages.

## Firebase Realtime Database structure

The app saves data like this:

```text
meetingRecords/
  <recordId>/
    title
    date
    preparedBy
    attendance
    objective
    tasks
    createdAt
    updatedAt

metadata/
  latestId
```

## Firebase setup

Your Firebase configuration is already placed in:

```text
firebase-config.js
```

It includes:

```text
Project ID: it-minutes
Realtime Database URL: https://it-minutes-default-rtdb.asia-southeast1.firebasedatabase.app/
```

## Recommended Firebase security rules

Recommended if you want only signed-in Firebase users to access the records:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

Then enable Firebase Authentication:

```text
Firebase Console → Authentication → Sign-in method → Email/Password → Enable
```

Create your user account in:

```text
Authentication → Users → Add user
```

Use that email and password in the website sign-in form.

## Quick testing rules

Only use this temporarily for testing because anyone with the website can read/write your database:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

## GitHub Pages setup

Upload all files directly to your repository root:

```text
index.html
styles.css
app.js
sample-data.js
firebase-config.js
README.md
EDITING-NOTES.txt
```

Then use:

```text
Settings → Pages → Deploy from a branch → main → /root
```

## Important GitHub/Firebase domain note

If you use Firebase Authentication, add your GitHub Pages domain as an authorized domain:

```text
Firebase Console → Authentication → Settings → Authorized domains
```

Add something like:

```text
yourusername.github.io
```

## How to use

1. Open the website.
2. Sign in with your Firebase user email/password if your rules require authentication.
3. Fill in the meeting details and task updates.
4. Click `Generate` to preview the minutes.
5. Click `Save to Firebase`.
6. Use `Load Latest`, `Refresh List`, or `Load Selected` to view saved records later.

## Backup option

You can still click `Download Data JSON` as a backup copy of the current meeting data.
