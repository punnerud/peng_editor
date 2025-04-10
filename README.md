# Advanced HTML Editor

A powerful visual HTML editor built with pure HTML, CSS, and JavaScript. This editor provides a rich text editing experience similar to professional editors like TinyMCE, CKEditor, and Quill.

## Features

- Full text formatting (bold, italic, underline, strikethrough)
- Paragraph formatting (headings, alignment, indentation)
- Lists (ordered and unordered)
- Insert tables with customizable rows, columns, and headers
- Insert links with custom text and target options
- Insert images with alt text and dimension controls
- Code block insertion
- Text and background color controls
- Font family and size selection
- Undo/redo functionality with history tracking
- HTML source view with syntax formatting
- Word and character count
- Save content as HTML file

## How to Use

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start editing your content in the editor area

## Toolbar Options

### Text Formatting
- **Bold**: Make text bold
- **Italic**: Make text italic
- **Underline**: Underline text
- **Strikethrough**: Strike through text

### Paragraph Formatting
- **Format Block**: Select heading level (h1-h6) or paragraph
- **Align Left/Center/Right/Justify**: Align text in paragraphs
- **Ordered List**: Create numbered list
- **Unordered List**: Create bullet list
- **Indent/Outdent**: Increase or decrease indentation

### Insert Options
- **Link**: Insert hyperlink with optional target setting
- **Image**: Insert image with alt text and dimension options
- **Table**: Insert table with customizable rows, columns, and header
- **Code**: Insert code block

### Style Options
- **Text Color**: Change text color
- **Background Color**: Change text background color
- **Font Family**: Change font family
- **Font Size**: Change font size
- **Clear Formatting**: Remove all formatting from selected text

### View Options
- **Source View**: Toggle between visual editor and HTML source code
- **Save**: Download the content as an HTML file

## Browser Compatibility

This editor uses the `document.execCommand()` API, which is supported by all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Customization

The editor is built with modular CSS and JavaScript, making it easy to customize:
- Modify `styles.css` to change the appearance
- Edit `editor.js` to add or modify functionality

## License

This project is available under the MIT License. Feel free to use, modify, and distribute it for personal or commercial projects. 