# IT Meeting Minutes Generator — sample-data.js Version

A GitHub Pages website for generating structured IT meeting minutes. The visual layout remains unchanged, but permanent meeting records are now managed manually in `sample-data.js`.

## Main data-entry method

1. Open `sample-data.js`.
2. Copy one complete meeting object inside `MEETING_RECORDS`.
3. Paste the copied object at the top of the list.
4. Give it a unique `id`.
5. Update the meeting details, tasks, statuses, deadlines, comments, and image URLs.
6. Commit or upload `sample-data.js` to GitHub.
7. Reload the GitHub Pages website.

The website sorts meetings by date and treats the newest record as **Latest**.

## Example structure

```js
const MEETING_RECORDS = [
  {
    id: "2026-08-12-it-meeting",
    title: "I.T Meeting",
    preparedBy: "Prepared by: IT Legend",
    date: "2026-08-12",
    time: "9.30 AM",
    attendance: "Name 1, Name 2",
    objective: "Meeting objective",
    tasks: [
      {
        section: "IT Support",
        pic: "Person in charge",
        task: "Task title",
        status: "Still In Progress",
        description: "Discussion or update",
        instruction: "Latest instruction",
        taskDate: "",
        deadline: "",
        extendedDeadline: "",
        dateComplete: "",
        comment: "",
        images: [{ url: "https://example.com/image.jpg", caption: "Evidence" }]
      }
    ]
  }
];

const DEFAULT_MEETING = MEETING_RECORDS[0];
```

## Controls

- **Load Latest** loads the newest dated record.
- **Load Selected** loads a previous record.
- **Refresh List** rebuilds the selector.
- **Data Entry Guide** explains the JavaScript workflow.
- JSON import is temporary; JSON download remains available as backup.
- Copy, print, HTML export, and Word export continue to work.

## GitHub Pages

Deploy from `Settings → Pages → Deploy from a branch → main → /root`.
