# Chrome Side Panel Ad Previewer

This Chrome extension provides a convenient side panel for previewing and managing ad sources. It allows users to quickly load and preview ads via URL or file upload.

## Features

- Side panel integration with Chrome
- Two input methods for ad sources:
  - URL input
  - File upload
- Real-time ad preview

## Demos

- [Using the sidepanel](demo-videos/ad-previewer-demo-using-sidepanel.mp4)
- [Using the context menu](demo-videos/ad-previewer-demo-using-contextmenu.mp4)

## Installation
- A detailed install with screenshots is available here: https://go-sokal.notion.site/Ad-Previewer-Chrome-Extension-1d8a519dc946801ebcebeeb70bcfe64c?pvs=4

### Prerequisites

- Google Chrome Browser (Version 100+)
- Chrome with Side Panel support enabled

### Steps

1. Clone the repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the project directory

## Usage

1. Open the side panel from Chrome's toolbar
2. Choose between "URL" or "Upload" tabs
3. Paste a URL or upload an image file
4. Click "Replace Ads"

## Development

### Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Chrome Extension API

### Project Structure

- `sidepanel.html`: Main side panel interface
- `sidepanel.css`: Styling for the side panel
- `components/`: Modular CSS and component styles
