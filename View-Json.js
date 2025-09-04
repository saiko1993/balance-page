// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: brown; icon-glyph: code; share-sheet-inputs: file-url, url, plain-text;
// Depending on a user selection, performs one of two actions:
// 1. Pretty prints a JSON string
// 2. Presents a UI to browse a JSON object or arary
// The script is meeant to be triggered from a share sheet
// with a URL, file URL or a plain text as input.
let url = args.urls[0]
let fileURL = args.fileURLs[0]
let text = args.plainTexts[0]
if (url != null) {
  // We have a URL so we attempt to load the JSON.
  let r = new Request(url)
  let json = await r.loadJSON()
  await prompt(json)
} else if (fileURL != null) {
  // We have a file URL so we read the contents of the file
  // and parse it into an object.
  let fm = FileManager.local()
  let text = fm.readString(fileURL)
  await parseAndPrompt(text)
} else if (text != null) {
  // We have text so we parse it into an object.
  await parseAndPrompt(text)
} else {
  // We didn't get a valid input.
  let alert = new Alert()
  alert.title = "No valid input"
  alert.message = "There was no URL or text argument provided."
  alert.addCancelAction("OK")
  await alert.present()
}

async function parseAndPrompt(text) {
  let json = JSON.parse(text)
  if (json != null) {
    await prompt(json)
  } else {
    let alert = new Alert()
    alert.title = "Invalid JSON"
    alert.message = "The string could not be parsed to JSON."
    await alert.present()
  }
}

async function prompt(json) {
  let alert = new Alert()
  alert.addAction("Pretty Print")
  alert.addAction("Browse")
  alert.addCancelAction("Cancel")
  let idx = await alert.presentSheet()
  if (idx == 0) {
    await prettyPrint(json)
  } else if (idx == 1) {
    browse(json)
  }
}

async function prettyPrint(json) {
  let str = JSON.stringify(json, null, 2)
  await QuickLook.present(str)
}

async function browse(json) {
  await QuickLook.present(json)
}
