# IT Meeting Minutes Generator

A static website for generating clean IT meeting minutes from task updates.

## What this website does

- Lets you enter meeting title, date, time, attendance and objective.
- Lets you add/edit IT Support and Project task updates.
- Converts long task notes into a clean meeting minutes format.
- Groups minutes by section.
- Creates summary counts, key decisions, and action items automatically.
- Supports Copy, Print, Download HTML, Download Word, Save Draft, Load Draft and Reset.
- Works on GitHub Pages without backend, database or build process.

## How to deploy to GitHub Pages

1. Create a new GitHub repository.
2. Upload these files directly into the repository root:

```text
index.html
styles.css
app.js
sample-data.js
README.md
```

3. Go to **Settings → Pages**.
4. Set **Source** to **Deploy from a branch**.
5. Select **Branch: main** and **Folder: /root**.
6. Click **Save**.

Your website should be available after GitHub Pages finishes deployment.

## How to edit the default meeting data

Open `sample-data.js` and update the `DEFAULT_MEETING` object.

Each task uses this format:

```js
{
  section: "IT Support",
  pic: "Adly",
  task: "Task title",
  status: "Still In Progress",
  description: "Main discussion or progress update.",
  instruction: "New instruction, decision or latest update.",
  taskDate: "",
  deadline: "Before end of July",
  extendedDeadline: "",
  dateComplete: "",
  comment: "Additional notes."
}
```

## How to use during meeting

1. Open the website.
2. Update meeting details.
3. Add or edit tasks.
4. Click **Generate**.
5. Review the generated minutes.
6. Click **Copy**, **Print**, **Download HTML**, or **Download Word**.

## Notes

- Save Draft stores the current form in the browser only.
- Load Draft works only on the same browser/device where the draft was saved.
- No meeting data is uploaded anywhere.
