document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const editor = document.getElementById('editor');
    const htmlSource = document.getElementById('html-source');
    const wordCount = document.getElementById('word-count');
    const charCount = document.getElementById('char-count');
    
    // Notification area
    const notificationArea = document.getElementById('notification-area');
    
    // Toolbar buttons
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    const boldBtn = document.getElementById('bold-btn');
    const italicBtn = document.getElementById('italic-btn');
    const underlineBtn = document.getElementById('underline-btn');
    const strikethroughBtn = document.getElementById('strikethrough-btn');
    const formatBlock = document.getElementById('format-block');
    const justifyLeftBtn = document.getElementById('justify-left-btn');
    const justifyCenterBtn = document.getElementById('justify-center-btn');
    const justifyRightBtn = document.getElementById('justify-right-btn');
    const justifyFullBtn = document.getElementById('justify-full-btn');
    const orderedListBtn = document.getElementById('ordered-list-btn');
    const unorderedListBtn = document.getElementById('unordered-list-btn');
    const indentBtn = document.getElementById('indent-btn');
    const outdentBtn = document.getElementById('outdent-btn');
    const linkBtn = document.getElementById('link-btn');
    const imageBtn = document.getElementById('image-btn');
    const tableBtn = document.getElementById('table-btn');
    const codeBtn = document.getElementById('code-btn');
    const emojiBtn = document.getElementById('emoji-btn');
    const forecolorPicker = document.getElementById('forecolor-picker');
    const backcolorPicker = document.getElementById('backcolor-picker');
    const fontFamily = document.getElementById('font-family');
    const fontSize = document.getElementById('font-size');
    const clearFormatBtn = document.getElementById('clear-format-btn');
    const sourceBtn = document.getElementById('source-btn');
    const saveBtn = document.getElementById('save-btn');
    const loadBtn = document.getElementById('load-btn');
    const pipetteBtn = document.createElement('button'); // Create new pipette button
    
    // Dialog elements
    const linkDialog = document.getElementById('link-dialog');
    const linkUrl = document.getElementById('link-url');
    const linkText = document.getElementById('link-text');
    const linkTarget = document.getElementById('link-target');
    const insertLinkBtn = document.getElementById('insert-link-btn');
    
    const imageDialog = document.getElementById('image-dialog');
    const imageUrl = document.getElementById('image-url');
    const imageAlt = document.getElementById('image-alt');
    const imageWidth = document.getElementById('image-width');
    const imageHeight = document.getElementById('image-height');
    const insertImageBtn = document.getElementById('insert-image-btn');
    
    const tableDialog = document.getElementById('table-dialog');
    const tableRows = document.getElementById('table-rows');
    const tableCols = document.getElementById('table-cols');
    const tableHeader = document.getElementById('table-header');
    const tableBorder = document.getElementById('table-border');
    const insertTableBtn = document.getElementById('insert-table-btn');
    
    const emojiDialog = document.getElementById('emoji-dialog');
    const emojiSearch = document.getElementById('emoji-search');
    const emojiGrid = document.getElementById('emoji-grid');
    const emojiCategories = document.querySelectorAll('.emoji-category');
    const recentEmojis = document.getElementById('recent-emojis');
    
    // Emoji data
    const emojiData = {
        smileys: [
            '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', 
            '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', 
            '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', 
            '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', 
            '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', 
            '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', 
            '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', 
            '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', 
            '😞', '😓', '😩', '😫', '🥱', '😤'
        ],
        people: [
            '👋', '🤚', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', 
            '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', 
            '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', 
            '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', 
            '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '👶', '🧒', 
            '👦', '👧', '🧑', '👱', '👨', '🧔', '👨‍🦰', '👨‍🦱', '👨‍🦳', '👨‍🦲', 
            '👩', '👩‍🦰', '👩‍🦱', '👩‍🦳', '👩‍🦲', '👱‍♀️', '👱‍♂️', '🧓', '👴', '👵', 
            '🙍', '🙍‍♂️', '🙍‍♀️', '🙎', '🙎‍♂️', '🙎‍♀️', '🙅', '🙅‍♂️', '🙅‍♀️', '🙆', 
            '🙆‍♂️', '🙆‍♀️', '💁', '💁‍♂️', '💁‍♀️', '🙋', '🙋‍♂️', '🙋‍♀️', '🧏', '🧏‍♂️', 
            '🧏‍♀️', '🙇', '🙇‍♂️', '🙇‍♀️', '🤦', '🤦‍♂️', '🤦‍♀️', '🤷', '🤷‍♂️', '🤷‍♀️'
        ],
        animals: [
            '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', 
            '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', 
            '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', 
            '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', 
            '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', 
            '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', 
            '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', 
            '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', 
            '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', 
            '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', 
            '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔'
        ],
        food: [
            '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', 
            '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', 
            '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', 
            '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', 
            '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🥙', '🧆', '🥘', 
            '🍲', '🥣', '🥗', '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', 
            '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', 
            '🍡', '🥟', '🥠', '🥡', '🦪', '🍦', '🍧', '🍨', '🍩', '🍪', 
            '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', 
            '🥛', '☕', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', 
            '🥂', '🥃', '🥤', '🧃', '🧉', '🧊'
        ],
        travel: [
            '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', 
            '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🏍️', '🚨', '🚔', '🚍', 
            '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', 
            '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫', '🛬', 
            '🛩️', '💺', '🛰️', '🚀', '🛸', '🚁', '🛶', '⛵', '🚤', '🛥️', 
            '🛳️', '⛴️', '🚢', '⚓', '⛽', '🚧', '🚦', '🚥', '🚏', '🗺️', 
            '🗿', '🗽', '🗼', '🏰', '🏯', '🏟️', '🎡', '🎢', '🎠', '⛲', 
            '⛱️', '🏖️', '🏝️', '🏜️', '🌋', '⛰️', '🏔️', '🗻', '🏕️', '⛺', 
            '🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏭', '🏢', '🏬', '🏣', '🏤', 
            '🏥', '🏦', '🏨', '🏪', '🏫', '🏩', '💒', '🏛️', '⛪', '🕌', 
            '🕍', '🛕', '🕋', '⛩️', '🛤️', '🛣️', '🗾', '🎑', '🏞️', '🌅', 
            '🌄', '🌠', '🎇', '🎆', '🌇', '🌆', '🏙️', '🌃', '🌌', '🌉', 
            '🌁'
        ],
        activities: [
            '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', 
            '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🪁', 
            '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', 
            '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🏋️‍♂️', '🏋️‍♀️', '🤼', '🤼‍♂️', 
            '🤼‍♀️', '🤸', '🤸‍♂️', '🤸‍♀️', '⛹️', '⛹️‍♂️', '⛹️‍♀️', '🤺', '🤾', '🤾‍♂️', 
            '🤾‍♀️', '🏌️', '🏌️‍♂️', '🏌️‍♀️', '🏇', '🧘', '🧘‍♂️', '🧘‍♀️', '🏄', '🏄‍♂️', 
            '🏄‍♀️', '🏊', '🏊‍♂️', '🏊‍♀️', '🤽', '🤽‍♂️', '🤽‍♀️', '🚣', '🚣‍♂️', '🚣‍♀️', 
            '🧗', '🧗‍♂️', '🧗‍♀️', '🚵', '🚵‍♂️', '🚵‍♀️', '🚴', '🚴‍♂️', '🚴‍♀️', '🏆', 
            '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️', '🎪', 
            '🤹', '🤹‍♂️', '🤹‍♀️', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', 
            '🥁', '🎷', '🎺', '🎸', '🪕', '🎻', '🎲', '♟️', '🎯', '🎳', 
            '🎮', '🎰', '🧩'
        ],
        objects: [
            '💡', '🔦', '🏮', '🪔', '📔', '📕', '📖', '📗', '📘', '📙', 
            '📚', '📓', '📒', '📃', '📜', '📄', '📰', '🗞️', '📑', '🔖', 
            '🏷️', '💰', '💴', '💵', '💶', '💷', '💸', '💳', '🧾', '💹', 
            '✉️', '📧', '📨', '📩', '📤', '📥', '📦', '📫', '📪', '📬', 
            '📭', '📮', '🗳️', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝', 
            '💼', '📁', '📂', '🗂️', '📅', '📆', '🗒️', '🗓️', '📇', '📈', 
            '📉', '📊', '📋', '📌', '📍', '📎', '🖇️', '📏', '📐', '✂️', 
            '🗃️', '🗄️', '🗑️', '🔒', '🔓', '🔏', '🔐', '🔑', '🗝️', '🔨', 
            '🪓', '⛏️', '⚒️', '🛠️', '🗡️', '⚔️', '🔫', '🏹', '🛡️', '🔧', 
            '🔩', '⚙️', '🗜️', '⚖️', '🦯', '🔗', '⛓️', '🧰', '🧲', '⚗️', 
            '🧪', '🧫', '🧬', '🔬', '🔭', '📡', '💉', '🩸', '💊', '🩹', 
            '🩺', '🚪', '🛏️', '🛋️', '🪑', '🚽', '🚿', '🛁', '🪒', '🧴', 
            '🧷', '🧹', '🧺', '🧻', '🧼', '🧽', '🧯', '🛒', '🚬', '⚰️', 
            '⚱️', '🗿', '🏧', '🚮', '🚰', '♿', '🚹', '🚺', '🚻', '🚼', 
            '🚾', '🛂', '🛃', '🛄', '🛅'
        ],
        symbols: [
            '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', 
            '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', 
            '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', 
            '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', 
            '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', 
            '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', 
            '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', 
            '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', 
            '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', 
            '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', 
            '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 
            'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🈳', '🈂️', '🛂', 
            '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '🚻', '🚮', '🎦', '📶', 
            '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', 
            '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', 
            '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸️', '⏯️', 
            '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', 
            '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', 
            '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', 
            '🎵', '🎶', '〰️', '➰', '➿', '✔️', '☑️', '🔘', '🔴', '🟠', 
            '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻', '🔸', 
            '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', 
            '◻️', '⬛', '⬜', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫'
        ],
        flags: [
            '🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏴‍☠️', '🇦🇨', '🇦🇩', '🇦🇪', 
            '🇦🇫', '🇦🇬', '🇦🇮', '🇦🇱', '🇦🇲', '🇦🇴', '🇦🇶', '🇦🇷', '🇦🇸', '🇦🇹', 
            '🇦🇺', '🇦🇼', '🇦🇽', '🇦🇿', '🇧🇦', '🇧🇧', '🇧🇩', '🇧🇪', '🇧🇫', '🇧🇬', 
            '🇧🇭', '🇧🇮', '🇧🇯', '🇧🇱', '🇧🇲', '🇧🇳', '🇧🇴', '🇧🇶', '🇧🇷', '🇧🇸', 
            '🇧🇹', '🇧🇻', '🇧🇼', '🇧🇾', '🇧🇿', '🇨🇦', '🇨🇨', '🇨🇩', '🇨🇫', '🇨🇬', 
            '🇨🇭', '🇨🇮', '🇨🇰', '🇨🇱', '🇨🇲', '🇨🇳', '🇨🇴', '🇨🇵', '🇨🇷', '🇨🇺', 
            '🇨🇻', '🇨🇼', '🇨🇽', '🇨🇾', '🇨🇿', '🇩🇪', '🇩🇬', '🇩🇯', '🇩🇰', '🇩🇲'
        ]
    };
    
    // Store recently used emojis
    let recentEmojisList = [];
    
    // Create a hidden file input for loading HTML files
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.html,.htm';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    // Close dialog buttons
    const closeDialogBtns = document.querySelectorAll('.close-dialog');
    
    // Editor state
    let isSourceView = false;
    let editorHistory = [];
    let historyIndex = -1;
    const MAX_HISTORY = 50;
    let isPipetteActive = false; // Add state for pipette tool
    let pipetteStyles = null; // Store picked up styles
    let pipetteDebounceTimer = null; // For debouncing pipette updates
    let lastPipetteElement = null; // Track last element for pipette
    
    // Text selection drag handle variables
    let dragHandle = null;
    let isDragging = false;
    let draggedText = '';
    let draggedTextElement = null;
    let initialMousePosition = { x: 0, y: 0 };
    let initialSelectionPosition = { x: 0, y: 0 };
    
    // Initialize editor
    initEditor();
    
    // Editor initialization
    function initEditor() {
        // Set up the pipette button
        setupPipetteButton();
        
        // Remove default content if editor is empty or just contains placeholder
        if (editor.innerHTML.trim() === '' || 
            editor.innerHTML.includes('Start typing your content here')) {
            // Insert a paragraph to ensure proper editing
            editor.innerHTML = '<p>Start typing your content here...</p>';
            
            // Position cursor at the beginning of the paragraph
            const selection = window.getSelection();
            const range = document.createRange();
            const firstParagraph = editor.querySelector('p');
            
            if (firstParagraph && firstParagraph.firstChild) {
                range.setStart(firstParagraph.firstChild, 0);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
        
        // Initial content
        updateWordCount();
        saveHistory();
        
        // Set up event listeners
        setupEventListeners();
        
        console.log('Editor initialized with content:', editor.innerHTML);
    }
    
    // Set up the pipette button
    function setupPipetteButton() {
        // Create and configure the pipette button
        pipetteBtn.id = 'pipette-btn';
        pipetteBtn.title = 'Style Pipette';
        pipetteBtn.innerHTML = '<i class="fas fa-eye-dropper"></i>';
        
        // Add it to the same toolbar group as the forecolor/backcolor pickers
        const colorToolbarGroup = forecolorPicker.parentElement;
        colorToolbarGroup.appendChild(pipetteBtn);
        
        // Add style for the button
        const style = document.createElement('style');
        style.textContent = `
            #pipette-btn.active {
                background-color: #e0e0e0;
                box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
            }
            .pipette-cursor {
                cursor: crosshair !important;
            }
            .pipette-preview {
                outline: 2px dashed #3498db !important;
                transition: outline-color 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Ensure editor has focus and proper selection
    function ensureEditorFocus() {
        // Focus the editor
        editor.focus();
        
        // Get current selection
        const selection = window.getSelection();
        
        // If there's no range in the editor, create one at the end of content
        if (!selection.rangeCount || !editor.contains(selection.getRangeAt(0).commonAncestorContainer)) {
            console.log('Creating new selection in editor');
            const range = document.createRange();
            
            // First check if we have any text content
            if (editor.textContent.trim() === '') {
                // Editor is empty, add a paragraph with placeholder text
                const p = document.createElement('p');
                p.textContent = 'Start typing here...';
                editor.appendChild(p);
                
                // Place cursor at start of paragraph
                range.setStart(p.firstChild, 0);
                range.collapse(true);
            } else {
                // Find the cursor insertion point (preferably at end of content)
                // Try to find the last paragraph
                const paragraphs = editor.querySelectorAll('p');
                if (paragraphs.length > 0) {
                    const lastP = paragraphs[paragraphs.length - 1];
                    
                    // If paragraph has text content, put cursor at end
                    if (lastP.textContent.length > 0) {
                        const lastChild = lastP.lastChild;
                        if (lastChild && lastChild.nodeType === 3) { // Text node
                            range.setStart(lastChild, lastChild.length);
                            range.collapse(true);
                        } else {
                            // Append to paragraph
                            range.setStartAfter(lastP.lastChild || lastP);
                            range.collapse(true);
                        }
                    } else {
                        // Empty paragraph, place cursor inside
                        range.setStart(lastP, 0);
                        range.collapse(true);
                    }
                } else {
                    // No paragraphs, just place at end of editor
                    range.selectNodeContents(editor);
                    range.collapse(false);
                }
            }
            
            // Apply the new range
            selection.removeAllRanges();
            selection.addRange(range);
            
            console.log('New selection created in editor');
        }
        
        return selection;
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Add event listener for the pipette button
        pipetteBtn.addEventListener('click', togglePipette);
        
        // Initial click handler to handle the first click properly
        editor.addEventListener('click', function initialClickHandler(e) {
            // Select all text in the editor on first click if it's the placeholder text
            if (editor.textContent.trim() === 'Start typing your content here...') {
                // Create a range for the entire content
                const range = document.createRange();
                range.selectNodeContents(editor.firstChild);
                
                // Apply the selection
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                
                console.log('Selected all placeholder text on first click');
                
                // Remove this event listener after first use
                editor.removeEventListener('click', initialClickHandler);
            }
        });
        
        // Add a general click handler to remove the drag handle when clicking elsewhere in the editor
        editor.addEventListener('mousedown', function(e) {
            // Check if the click was on the drag handle
            if (dragHandle && !dragHandle.contains(e.target)) {
                // If not dragging, remove the handle
                if (!isDragging) {
                    removeDragHandle();
                }
            }
        });
        
        // Editor content change event
        editor.addEventListener('input', function() {
            updateWordCount();
            saveHistory();
            updateToolbarState();
        });
        
        // Editor selection change event
        document.addEventListener('selectionchange', function() {
            if (document.activeElement === editor) {
                updateToolbarState();
                
                // Handle text selection for drag handle
                handleTextSelection();
            }
        });
        
        // Update toolbar state when mouse button is released (useful for drag selections)
        editor.addEventListener('mouseup', function() {
            updateToolbarState();
            
            // Add a slight delay to let the selection finalize
            setTimeout(handleTextSelection, 10);
        });
        
        // Update toolbar when key is released (useful for keyboard selections)
        editor.addEventListener('keyup', function(e) {
            // Only update for navigation and selection keys
            const navKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 
                           'Home', 'End', 'PageUp', 'PageDown', 'Shift'];
            if (navKeys.includes(e.key) || e.shiftKey) {
                updateToolbarState();
                
                // Handle text selection for keyboard selections
                setTimeout(handleTextSelection, 10);
            }
        });
        
        // Add event listeners to toolbar buttons
        undoBtn.addEventListener('click', handleUndo);
        redoBtn.addEventListener('click', handleRedo);
        boldBtn.addEventListener('click', () => execCommand('bold'));
        italicBtn.addEventListener('click', () => execCommand('italic'));
        underlineBtn.addEventListener('click', () => execCommand('underline'));
        strikethroughBtn.addEventListener('click', () => execCommand('strikeThrough'));
        
        formatBlock.addEventListener('change', function() {
            execCommand('formatBlock', false, '<' + this.value + '>');
        });
        
        justifyLeftBtn.addEventListener('click', () => execCommand('justifyLeft'));
        justifyCenterBtn.addEventListener('click', () => execCommand('justifyCenter'));
        justifyRightBtn.addEventListener('click', () => execCommand('justifyRight'));
        justifyFullBtn.addEventListener('click', () => execCommand('justifyFull'));
        
        orderedListBtn.addEventListener('click', () => execCommand('insertOrderedList'));
        unorderedListBtn.addEventListener('click', () => execCommand('insertUnorderedList'));
        indentBtn.addEventListener('click', () => execCommand('indent'));
        outdentBtn.addEventListener('click', () => execCommand('outdent'));
        
        linkBtn.addEventListener('click', showLinkDialog);
        imageBtn.addEventListener('click', showImageDialog);
        tableBtn.addEventListener('click', showTableDialog);
        codeBtn.addEventListener('click', insertCodeBlock);
        emojiBtn.addEventListener('click', showEmojiDialog);
        
        // Add event listeners to color pickers
        forecolorPicker.addEventListener('input', function() {
            execCommand('foreColor', false, this.value);
        });
        
        forecolorPicker.addEventListener('click', function() {
            // Update the picker to show current text color before the color picker opens
            updateColorPickerState();
        });
        
        backcolorPicker.addEventListener('input', function() {
            execCommand('hiliteColor', false, this.value);
        });
        
        backcolorPicker.addEventListener('click', function() {
            // Update the picker to show current background color before the color picker opens
            updateColorPickerState();
        });
        
        fontFamily.addEventListener('change', function() {
            execCommand('fontName', false, this.value);
        });
        
        fontSize.addEventListener('change', function() {
            execCommand('fontSize', false, this.value);
        });
        
        clearFormatBtn.addEventListener('click', function() {
            execCommand('removeFormat');
        });
        
        sourceBtn.addEventListener('click', toggleSourceView);
        
        saveBtn.addEventListener('click', saveContent);
        loadBtn.addEventListener('click', loadContent);
        fileInput.addEventListener('change', handleFileUpload);
        
        // Dialog event listeners
        insertLinkBtn.addEventListener('click', insertLink);
        insertImageBtn.addEventListener('click', insertImage);
        insertTableBtn.addEventListener('click', insertTable);
        
        // Close dialog buttons
        closeDialogBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                hideAllDialogs();
            });
        });
        
        // Close dialogs on click outside
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('dialog')) {
                hideAllDialogs();
            }
        });
        
        // Emoji search event listener
        emojiSearch.addEventListener('input', handleEmojiSearch);
        
        // Emoji category buttons event listeners
        emojiCategories.forEach(function(btn) {
            btn.addEventListener('click', function() {
                setActiveEmojiCategory(this.dataset.category);
            });
        });
        
        // Selection change event to update toolbar and show drag handle
        document.addEventListener('selectionchange', function() {
            updateToolbar();
            handleTextSelection();
        });
    }
    
    // Execute command
    function execCommand(command, showUI, value) {
        if (isSourceView) return;
        
        try {
            // Make sure we have focus and selection in the editor
            ensureEditorFocus();
            
            // Special handling for background color
            if (command === 'hiliteColor') {
                // Some browsers have issues with hiliteColor, so use backColor as a fallback
                try {
                    document.execCommand(command, showUI, value);
                    console.log(`Executed command: ${command}`, value ? `Value: ${value}` : '');
                } catch (e) {
                    console.log('hiliteColor failed, trying backColor instead');
                    document.execCommand('backColor', showUI, value);
                    console.log(`Executed fallback command: backColor`, value ? `Value: ${value}` : '');
                }
                
                // Additionally, apply CSS to ensure the background color is visible
                try {
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        
                        // If it's a text node, we need to wrap it in a span
                        if (range.startContainer.nodeType === 3) {
                            const span = document.createElement('span');
                            span.style.backgroundColor = value;
                            
                            // Use range surroundContents to wrap the selection
                            try {
                                range.surroundContents(span);
                                console.log('Applied background color using span wrapping');
                            } catch (err) {
                                console.log('Could not wrap in span, selection may cross element boundaries');
                            }
                        }
                    }
                } catch (bgErr) {
                    console.log('Additional background color handling failed:', bgErr);
                }
            } else {
                // Normal command execution for everything else
                document.execCommand(command, showUI, value);
                console.log(`Executed command: ${command}`, value ? `Value: ${value}` : '');
            }
            
            // Immediately update the toolbar state to reflect changes
            updateToolbarState();
        } catch (err) {
            console.error(`Error executing command ${command}:`, err);
        }
        
        // Ensure focus is maintained
        editor.focus();
        
        // Save history
        saveHistory();
    }
    
    // Update toolbar state based on current selection
    function updateToolbarState() {
        if (isSourceView) return;
        
        try {
            // Get the current selection
            const selection = window.getSelection();
            if (!selection.rangeCount) return;
            
            const range = selection.getRangeAt(0);
            if (!editor.contains(range.commonAncestorContainer)) return;
            
            // Update styling buttons state
            boldBtn.classList.toggle('active', document.queryCommandState('bold'));
            italicBtn.classList.toggle('active', document.queryCommandState('italic'));
            underlineBtn.classList.toggle('active', document.queryCommandState('underline'));
            strikethroughBtn.classList.toggle('active', document.queryCommandState('strikeThrough'));
            
            // Update alignment buttons
            justifyLeftBtn.classList.toggle('active', document.queryCommandState('justifyLeft'));
            justifyCenterBtn.classList.toggle('active', document.queryCommandState('justifyCenter'));
            justifyRightBtn.classList.toggle('active', document.queryCommandState('justifyRight'));
            justifyFullBtn.classList.toggle('active', document.queryCommandState('justifyFull'));
            
            // Update list buttons
            orderedListBtn.classList.toggle('active', document.queryCommandState('insertOrderedList'));
            unorderedListBtn.classList.toggle('active', document.queryCommandState('insertUnorderedList'));
            
            // Update format block select
            try {
                const currentBlock = document.queryCommandValue('formatBlock').replace(/[<>]/g, '');
                if (currentBlock && formatBlock.querySelector(`option[value="${currentBlock}"]`)) {
                    formatBlock.value = currentBlock;
                }
            } catch (e) {
                console.log('Format block selection error:', e);
            }
            
            // Update font family select
            try {
                const currentFont = document.queryCommandValue('fontName');
                if (currentFont && currentFont.trim() !== '') {
                    // Extract primary font name without quotes
                    const primaryFont = currentFont.split(',')[0].replace(/['"]/g, '').trim();
                    
                    // Find the option that best matches
                    for (let i = 0; i < fontFamily.options.length; i++) {
                        const optionFont = fontFamily.options[i].value.split(',')[0].replace(/['"]/g, '').trim();
                        if (optionFont.toLowerCase() === primaryFont.toLowerCase()) {
                            fontFamily.selectedIndex = i;
                            break;
                        }
                    }
                }
            } catch (e) {
                console.log('Font family selection error:', e);
            }
            
            // Update font size select
            try {
                const currentSize = document.queryCommandValue('fontSize');
                if (currentSize && currentSize.trim() !== '') {
                    // Find matching option
                    for (let i = 0; i < fontSize.options.length; i++) {
                        if (fontSize.options[i].value === currentSize) {
                            fontSize.selectedIndex = i;
                            break;
                        }
                    }
                }
            } catch (e) {
                console.log('Font size selection error:', e);
            }
            
            // Update color pickers
            try {
                // Text color
                const currentColor = document.queryCommandValue('foreColor');
                if (currentColor && currentColor !== 'rgba(0, 0, 0, 0)') {
                    forecolorPicker.value = rgbToHex(currentColor);
                    console.log('Updated text color picker to:', forecolorPicker.value);
                }
                
                // Background color - use an alternative approach since hiliteColor might not work reliably
                // First try the standard method
                let currentBgColor = document.queryCommandValue('hiliteColor');
                
                // If that fails, try to get the computed style of the selected element
                if (!currentBgColor || currentBgColor === 'rgba(0, 0, 0, 0)' || currentBgColor === 'transparent') {
                    // Get the element at the current selection
                    const anchorNode = range.commonAncestorContainer;
                    let element = anchorNode;
                    
                    // If it's a text node, get its parent element
                    if (anchorNode.nodeType === 3) {
                        element = anchorNode.parentElement;
                    }
                    
                    // Walk up the DOM to find the nearest element with a background color
                    while (element && element !== editor) {
                        const computedStyle = window.getComputedStyle(element);
                        const bgColor = computedStyle.backgroundColor;
                        
                        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                            currentBgColor = bgColor;
                            break;
                        }
                        
                        element = element.parentElement;
                    }
                }
                
                // Verify we got a valid background color and update the picker
                if (currentBgColor && currentBgColor !== 'rgba(0, 0, 0, 0)' && currentBgColor !== 'transparent') {
                    backcolorPicker.value = rgbToHex(currentBgColor);
                    console.log('Updated background color picker to:', backcolorPicker.value);
                } else {
                    // Reset to default if no background color is found
                    backcolorPicker.value = '#ffffff';
                }
            } catch (e) {
                console.log('Color picker update error:', e);
            }
            
            // Check for link - update link button if cursor is inside a link
            try {
                let node = range.commonAncestorContainer;
                let isInsideLink = false;
                
                // Traverse up to check if we're inside a link
                while (node && node !== editor) {
                    if (node.nodeType === 1 && node.tagName.toLowerCase() === 'a') {
                        isInsideLink = true;
                        break;
                    }
                    node = node.parentNode;
                }
                
                linkBtn.classList.toggle('active', isInsideLink);
            } catch (e) {
                console.log('Link detection error:', e);
            }
            
            // Check for code block - update code button
            try {
                let node = range.commonAncestorContainer;
                let isInsideCode = false;
                
                // Traverse up to check if we're inside a pre or code tag
                while (node && node !== editor) {
                    if (node.nodeType === 1 && (node.tagName.toLowerCase() === 'pre' || node.tagName.toLowerCase() === 'code')) {
                        isInsideCode = true;
                        break;
                    }
                    node = node.parentNode;
                }
                
                codeBtn.classList.toggle('active', isInsideCode);
            } catch (e) {
                console.log('Code block detection error:', e);
            }
            
        } catch (err) {
            console.error('Error updating toolbar state:', err);
        }
    }
    
    // Helper to convert RGB to HEX for color pickers
    function rgbToHex(rgb) {
        // Check if it's already in hex format
        if (rgb.startsWith('#')) return rgb;
        
        // Handle rgb/rgba format
        const rgbRegex = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/i;
        const match = rgb.match(rgbRegex);
        
        if (!match) return '#000000'; // Default to black if format is unrecognized
        
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    // Toggle between rich text and HTML source view
    function toggleSourceView() {
        if (isSourceView) {
            // Switch back to rich text view
            editor.innerHTML = htmlSource.value;
            editor.style.display = 'block';
            htmlSource.style.display = 'none';
            sourceBtn.classList.remove('active');
        } else {
            // Switch to HTML source view
            htmlSource.value = formatHTML(editor.innerHTML);
            editor.style.display = 'none';
            htmlSource.style.display = 'block';
            sourceBtn.classList.add('active');
        }
        
        isSourceView = !isSourceView;
        updateWordCount();
    }
    
    // Format HTML with indentation for better readability
    function formatHTML(html) {
        let formatted = '';
        let indent = '';
        
        html.split(/>\s*</).forEach(function(element) {
            if (element.match(/^\/\w/)) {
                indent = indent.substring(2);
            }
            
            formatted += indent + '<' + element + '>\r\n';
            
            if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith('input') && !element.startsWith('img')) {
                indent += '  ';
            }
        });
        
        return formatted.substring(1, formatted.length - 3);
    }
    
    // Update word and character count
    function updateWordCount() {
        const text = isSourceView ? htmlSource.value : editor.innerText || '';
        
        // Count words (any sequence of non-whitespace characters)
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        wordCount.textContent = words.length;
        
        // Count characters (excluding whitespace)
        charCount.textContent = text.replace(/\s+/g, '').length;
    }
    
    // Show link dialog
    function showLinkDialog() {
        // First focus the editor to ensure selection is within it
        editor.focus();
        
        // Save the current selection before opening dialog
        const selection = window.getSelection();
        
        // Store the range for later use when we insert the link
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            // Get the selected text
            const selectedText = selection.toString().trim();
            
            // Set it in the dialog
            linkText.value = selectedText;
            
            console.log(`Opening link dialog with selection: "${selectedText}"`);
            
            // Save more detailed information about the selection
            window.selectionData = {
                range: range.cloneRange(),
                text: selectedText,
                // Store the container and offset information
                startContainer: range.startContainer,
                startOffset: range.startOffset,
                endContainer: range.endContainer,
                endOffset: range.endOffset,
                // Store parent element for easier reference
                parentElement: range.commonAncestorContainer.nodeType === 1 ? 
                               range.commonAncestorContainer : 
                               range.commonAncestorContainer.parentElement
            };
            
            console.log('Stored detailed selection data:', 
                        'Start:', window.selectionData.startOffset,
                        'End:', window.selectionData.endOffset,
                        'Parent:', window.selectionData.parentElement.tagName);
            
            // Make the selection visible to the user (will be cleaned up on dialog close)
            if (selectedText && !isSourceView) {
                try {
                    // Create a marker span
                    const highlightSpan = document.createElement('span');
                    highlightSpan.style.backgroundColor = '#FFFF80';
                    highlightSpan.className = 'selection-highlight';
                    highlightSpan.textContent = selectedText;
                    
                    // Replace the selection with our highlight span
                    range.deleteContents();
                    range.insertNode(highlightSpan);
                    
                    console.log('Highlighted using custom span');
                } catch (e) {
                    console.error('Could not highlight using span:', e);
                    document.execCommand('hiliteColor', false, '#FFFF80');
                    console.log('Highlighted using execCommand fallback');
                }
            }
        } else {
            // Clear the text field if nothing is selected
            linkText.value = '';
            console.log('Opening link dialog with no selection');
            window.selectionData = null;
        }
        
        // Show the dialog
        linkDialog.style.display = 'flex';
        
        // Focus the URL field
        linkUrl.focus();
    }
    
    // Debug helper to log the HTML content of elements
    function logElement(element, name) {
        console.log(`${name} HTML:`, element.innerHTML);
        console.log(`${name} text:`, element.textContent);
    }
    
    // A more robust way to ensure content is replaced
    function replaceSelectionWithHTML(html) {
        try {
            // Get current selection
            const selection = window.getSelection();
            
            if (selection.rangeCount === 0) {
                console.warn('No selection range available');
                return false;
            }
            
            // Get the range
            const range = selection.getRangeAt(0);
            logElement(range.commonAncestorContainer, 'Range ancestor');
            
            // Delete the current contents
            range.deleteContents();
            console.log('Deleted range contents');
            
            // Create a div with the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            
            // Get the fragment to insert
            const fragment = document.createDocumentFragment();
            let node, lastNode;
            while ((node = tempDiv.firstChild)) {
                lastNode = fragment.appendChild(node);
            }
            
            // Insert the fragment
            range.insertNode(fragment);
            console.log('Inserted HTML fragment');
            
            // Clear current selection and create new one after the inserted content
            if (lastNode) {
                range.setStartAfter(lastNode);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
                console.log('Moved selection after inserted content');
            }
            
            return true;
        } catch (err) {
            console.error('Error in replaceSelectionWithHTML:', err);
            return false;
        }
    }
    
    // Insert link with precise selection handling
    function insertLink() {
        const url = linkUrl.value.trim();
        const text = linkText.value.trim() || url;
        const target = linkTarget.checked ? '_blank' : '';
        
        console.log(`Link insertion - URL: ${url}, Text: ${text}, Target: ${target ? '_blank' : 'same window'}`);
        
        if (url) {
            if (isSourceView) {
                const linkHTML = `<a href="${url}"${target ? ` target="${target}"` : ''}>${text}</a>`;
                insertAtCursor(htmlSource, linkHTML);
                console.log('Inserted link in source view');
            } else {
                try {
                    // Focus editor first
                    editor.focus();
                    
                    // Create the link HTML that we'll insert
                    const linkHTML = `<a href="${url}"${target ? ` target="${target}"` : ''}>${text}</a>`;
                    
                    // First find any highlight spans before removing them
                    const highlightSpans = document.querySelectorAll('.selection-highlight, span[style*="background-color: rgb(255, 255, 128)"]');
                    
                    if (highlightSpans.length > 0) {
                        console.log(`Found ${highlightSpans.length} highlight spans`);
                        
                        // Try to replace the highlight with our link
                        try {
                            let span = highlightSpans[0];
                            console.log('Replacing highlight span with link HTML');
                            
                            // Use direct HTML replacement for reliability
                            if (span && span.parentNode) {
                                // Insert the link just before the span
                                span.insertAdjacentHTML('beforebegin', linkHTML);
                                // Remove the span
                                span.parentNode.removeChild(span);
                                console.log('Successfully replaced span with link');
                                
                                // Done with insertion, don't try other methods
                                setTimeout(() => {
                                    console.log('Editor content after link insertion:', editor.innerHTML);
                                    updateToolbarState();
                                    saveHistory();
                                }, 100);
                                
                                // Clear selection data
                                window.selectionData = null;
                                
                                // Clean up dialogs
                                hideAllDialogs();
                                linkUrl.value = '';
                                linkText.value = '';
                                linkTarget.checked = false;
                                
                                return; // Exit early after successful insertion
                            } else {
                                console.warn('Span or parent node is invalid, trying alternate method');
                            }
                        } catch (spanErr) {
                            console.error('Error replacing span:', spanErr);
                        }
                    }
                    
                    // Remove any highlighting to avoid artifacts
                    removeHighlighting();
                    
                    // Handle insertion based on stored selection data
                    if (window.selectionData && window.selectionData.text) {
                        console.log(`Using stored selection data for text: "${window.selectionData.text}"`);
                        
                        // Try to find the text directly in the document
                        const originalText = window.selectionData.text;
                        const editorHTML = editor.innerHTML;
                        
                        // Try simple direct replacement first
                        if (editorHTML.includes(originalText)) {
                            console.log(`Found text in editor HTML, using direct replacement`);
                            editor.innerHTML = editorHTML.replace(
                                originalText, 
                                linkHTML
                            );
                            console.log('Successfully replaced text with link');
                            
                            // Let UI update and save history
                            setTimeout(() => {
                                console.log('Editor content after link insertion:', editor.innerHTML);
                                updateToolbarState();
                                saveHistory();
                            }, 100);
                        } else {
                            // Try plain text search as a fallback
                            const plainText = editor.textContent;
                            const textIndex = plainText.indexOf(originalText);
                            
                            if (textIndex >= 0) {
                                console.log(`Found text at index ${textIndex}, attempting selection`);
                                
                                // Create selection and replace it
                                try {
                                    // Find the text node containing our text
                                    let currentNode = null;
                                    let offset = 0;
                                    
                                    function findTextPosition(node, searchText) {
                                        if (node.nodeType === 3) { // Text node
                                            const indexOf = node.textContent.indexOf(searchText);
                                            if (indexOf >= 0) {
                                                currentNode = node;
                                                offset = indexOf;
                                                return true;
                                            }
                                        } else if (node.childNodes) {
                                            for (let i = 0; i < node.childNodes.length; i++) {
                                                if (findTextPosition(node.childNodes[i], searchText)) {
                                                    return true;
                                                }
                                            }
                                        }
                                        return false;
                                    }
                                    
                                    // Search for the text in the editor
                                    findTextPosition(editor, originalText);
                                    
                                    if (currentNode) {
                                        console.log('Found text node containing the selection');
                                        
                                        // Create a range for the found text
                                        const selection = window.getSelection();
                                        const range = document.createRange();
                                        range.setStart(currentNode, offset);
                                        range.setEnd(currentNode, offset + originalText.length);
                                        
                                        // Apply selection and replace with link
                                        selection.removeAllRanges();
                                        selection.addRange(range);
                                        
                                        // Insert the link
                                        document.execCommand('insertHTML', false, linkHTML);
                                        console.log('Inserted link at found text position');
                                    } else {
                                        // Just insert at end as a fallback
                                        console.log('Could not find exact text node, inserting at cursor');
                                        document.execCommand('insertHTML', false, linkHTML);
                                    }
                                } catch (searchErr) {
                                    console.error('Error during text search:', searchErr);
                                    document.execCommand('insertHTML', false, linkHTML);
                                }
                            } else {
                                // Just insert at current position if all else fails
                                console.log('Text not found, inserting at cursor position');
                                document.execCommand('insertHTML', false, linkHTML);
                            }
                            
                            // Let UI update and save history
                            setTimeout(() => {
                                console.log('Editor content after fallback insertion:', editor.innerHTML);
                                updateToolbarState();
                                saveHistory();
                            }, 100);
                        }
                    } else {
                        // No selection data, just insert at current position
                        console.log('No selection data, inserting at cursor');
                        document.execCommand('insertHTML', false, linkHTML);
                        
                        // Let UI update and save history
                        setTimeout(() => {
                            console.log('Editor content after cursor insertion:', editor.innerHTML);
                            updateToolbarState();
                            saveHistory();
                        }, 100);
                    }
                    
                    // Clear selection data
                    window.selectionData = null;
                } catch (err) {
                    console.error('Error inserting link:', err);
                    
                    // Last resort fallback
                    try {
                        const linkHTML = `<a href="${url}"${target ? ` target="${target}"` : ''}>${text}</a>`;
                        
                        // Just append to the end of the editor
                        editor.innerHTML += linkHTML;
                        console.log('Last resort: Added link to end of editor');
                        
                        setTimeout(() => {
                            updateToolbarState();
                            saveHistory();
                        }, 100);
                    } catch (fallbackErr) {
                        console.error('All link insertion methods failed:', fallbackErr);
                    }
                }
            }
        } else {
            console.log('No URL provided, link not inserted');
        }
        
        hideAllDialogs();
        linkUrl.value = '';
        linkText.value = '';
        linkTarget.checked = false;
    }
    
    // Show image dialog
    function showImageDialog() {
        // First focus the editor to ensure selection is within it
        editor.focus();
        
        // Save the current selection for later use
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            // Store the range for later use
            window.storedRange = selection.getRangeAt(0).cloneRange();
            console.log('Stored range for image insertion');
            
            // If there's a selection, highlight it so the user knows where the image will go
            const selectedText = selection.toString().trim();
            if (selectedText && !isSourceView) {
                // Use surroundContents to wrap the selection in a highlight span
                const range = selection.getRangeAt(0);
                const highlightSpan = document.createElement('span');
                highlightSpan.style.backgroundColor = '#FFFF80';
                
                try {
                    // Try to surround the contents with the span
                    range.surroundContents(highlightSpan);
                    console.log('Highlighted selected location for image');
                } catch (e) {
                    console.error('Could not highlight using surroundContents:', e);
                    // Fallback - use execCommand to highlight
                    document.execCommand('hiliteColor', false, '#FFFF80');
                    console.log('Highlighted selected location using execCommand');
                }
            }
        } else {
            window.storedRange = null;
            console.log('No selection range to store for image');
        }
        
        // Show the dialog and focus URL field
        imageDialog.style.display = 'flex';
        imageUrl.focus();
    }
    
    // Insert image
    function insertImage() {
        const url = imageUrl.value.trim();
        const alt = imageAlt.value.trim();
        const width = imageWidth.value.trim();
        const height = imageHeight.value.trim();
        
        console.log(`Image insertion - URL: ${url}, Alt: ${alt}, Width: ${width}, Height: ${height}`);
        
        if (url) {
            if (isSourceView) {
                const imgHTML = `<img src="${url}" alt="${alt}"${width ? ` width="${width}"` : ''}${height ? ` height="${height}"` : ''}>`;
                insertAtCursor(htmlSource, imgHTML);
                console.log('Inserted image in source view');
            } else {
                try {
                    // Create image HTML
                    const imgHTML = `<img src="${url}" alt="${alt}"${width ? ` width="${width}"` : ''}${height ? ` height="${height}"` : ''}>`;
                    
                    // First remove any existing highlighting
                    removeHighlighting();
                    
                    // Focus the editor
                    editor.focus();
                    
                    if (window.storedRange) {
                        console.log('Using stored range for image insertion');
                        
                        // Create a new selection using the stored range
                        const selection = window.getSelection();
                        selection.removeAllRanges();
                        selection.addRange(window.storedRange);
                        
                        // First delete the selected content
                        document.execCommand('delete');
                        
                        // Then insert the image
                        document.execCommand('insertHTML', false, imgHTML);
                        
                        console.log('Replaced selected content with image');
                        
                        // Clear stored range
                        window.storedRange = null;
                    } else {
                        // No stored range, ensure we have a valid selection
                        ensureEditorFocus();
                        
                        // Insert at current position
                        document.execCommand('insertHTML', false, imgHTML);
                        console.log('Inserted image at current cursor position');
                    }
                    
                    // Let UI update and save history
                    setTimeout(() => {
                        updateToolbarState();
                        saveHistory();
                        console.log('Editor content after image insertion:', editor.innerHTML);
                    }, 100);
                } catch (err) {
                    console.error('Error inserting image:', err);
                    
                    // Fallback 
                    try {
                        const selection = window.getSelection();
                        if (selection.rangeCount > 0) {
                            // Get the range and explicitly delete its contents
                            const range = selection.getRangeAt(0);
                            range.deleteContents();
                            
                            // Create image element
                            const img = document.createElement('img');
                            img.src = url;
                            img.alt = alt;
                            if (width) img.width = parseInt(width);
                            if (height) img.height = parseInt(height);
                            
                            // Insert the image
                            range.insertNode(img);
                            console.log('Fallback: Inserted image using DOM methods');
                        } else {
                            // Append to end as last resort
                            editor.innerHTML += imgHTML;
                            console.log('Last resort: Appended image to end of editor');
                        }
                        
                        setTimeout(() => saveHistory(), 100);
                    } catch (fallbackErr) {
                        console.error('All image insertion methods failed:', fallbackErr);
                    }
                }
            }
        } else {
            console.log('No image URL provided, image not inserted');
        }
        
        hideAllDialogs();
        imageUrl.value = '';
        imageAlt.value = '';
        imageWidth.value = '';
        imageHeight.value = '';
    }
    
    // Show table dialog
    function showTableDialog() {
        console.log('Opening table dialog');
        tableDialog.style.display = 'flex';
        tableRows.focus();
        
        // Store current selection if any
        const selection = window.getSelection();
        let selectedText = '';
        
        if (selection.rangeCount > 0) {
            // Get any selected text
            selectedText = selection.toString().trim();
            
            // Store the range for later use
            window.storedRange = selection.getRangeAt(0).cloneRange();
            console.log(`Stored range for table insertion with text: "${selectedText}"`);
            
            // Highlight the selection if there is text
            if (selectedText) {
                // Use surroundContents to wrap the selection in a highlight span
                const range = selection.getRangeAt(0);
                const highlightSpan = document.createElement('span');
                highlightSpan.style.backgroundColor = '#FFFF80';
                
                try {
                    // Try to surround the contents with the span
                    range.surroundContents(highlightSpan);
                    console.log('Highlighted selected text for table');
                } catch (e) {
                    console.error('Could not highlight using surroundContents:', e);
                    // Fallback - use execCommand to highlight
                    document.execCommand('hiliteColor', false, '#FFFF80');
                    console.log('Highlighted selected text using execCommand');
                }
            }
        } else {
            console.log('No selection range to store for table insertion');
            window.storedRange = null;
        }
    }
    
    // Insert table
    function insertTable() {
        console.log('Starting table insertion process');
        const rows = parseInt(tableRows.value) || 3;
        const cols = parseInt(tableCols.value) || 3;
        const hasHeader = tableHeader.checked;
        const border = parseInt(tableBorder.value) || 1;
        
        console.log(`Table params: rows=${rows}, cols=${cols}, hasHeader=${hasHeader}, border=${border}`);
        
        if (rows > 0 && cols > 0) {
            if (isSourceView) {
                console.log('Inserting table in source view mode');
                let tableHTML = `<table border="${border}" style="width:100%;">\n`;
                
                if (hasHeader) {
                    tableHTML += '  <thead>\n    <tr>\n';
                    for (let c = 0; c < cols; c++) {
                        tableHTML += `      <th>Header ${c + 1}</th>\n`;
                    }
                    tableHTML += '    </tr>\n  </thead>\n';
                }
                
                tableHTML += '  <tbody>\n';
                
                for (let r = 0; r < rows; r++) {
                    tableHTML += '    <tr>\n';
                    for (let c = 0; c < cols; c++) {
                        tableHTML += `      <td>Cell ${r + 1}-${c + 1}</td>\n`;
                    }
                    tableHTML += '    </tr>\n';
                }
                
                tableHTML += '  </tbody>\n</table>';
                
                console.log('Generated table HTML for source view:', tableHTML);
                insertAtCursor(htmlSource, tableHTML);
                console.log('Table HTML inserted into source view');
            } else {
                console.log('Inserting table in visual editor mode');
                // Generate table HTML
                let tableHTML = `<table border="${border}" style="width:100%;">`;
                
                if (hasHeader) {
                    tableHTML += '<thead><tr>';
                    for (let c = 0; c < cols; c++) {
                        tableHTML += `<th>Header ${c + 1}</th>`;
                    }
                    tableHTML += '</tr></thead>';
                }
                
                tableHTML += '<tbody>';
                
                for (let r = 0; r < rows; r++) {
                    tableHTML += '<tr>';
                    for (let c = 0; c < cols; c++) {
                        tableHTML += `<td>Cell ${r + 1}-${c + 1}</td>`;
                    }
                    tableHTML += '</tr>';
                }
                
                tableHTML += '</tbody></table>';
                
                console.log('Generated table HTML for visual editor:', tableHTML);
                
                // First remove any existing highlighting
                removeHighlighting();
                
                try {
                    // First ensure we have focus
                    console.log('Ensuring editor has focus before table insertion');
                    ensureEditorFocus();
                    
                    if (window.storedRange) {
                        console.log('Using stored range for table insertion');
                        
                        // Create a new selection using the stored range
                        const selection = window.getSelection();
                        selection.removeAllRanges();
                        selection.addRange(window.storedRange);
                        
                        // First delete the selected content
                        document.execCommand('delete');
                        
                        // Then insert the table
                        document.execCommand('insertHTML', false, tableHTML);
                        
                        console.log('Replaced selected content with table');
                        
                        // Clear stored range
                        window.storedRange = null;
                    } else {
                        // Insert the table using execCommand at current position
                        console.log('Executing insertHTML command for table at current position');
                        document.execCommand('insertHTML', false, tableHTML);
                        console.log('Table HTML inserted via execCommand');
                    }
                    
                    // Focus back on the editor
                    editor.focus();
                    
                    // Check if table was actually inserted
                    setTimeout(() => {
                        const tables = editor.querySelectorAll('table');
                        console.log(`Number of tables in editor after insertion: ${tables.length}`);
                    }, 100);
                } catch (error) {
                    console.error('Error during table insertion:', error);
                    
                    // Fallback method if execCommand fails
                    try {
                        console.log('Trying fallback method for table insertion');
                        const selection = window.getSelection();
                        if (selection.rangeCount > 0) {
                            const range = selection.getRangeAt(0);
                            range.deleteContents();
                            
                            // Create table element from HTML
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = tableHTML;
                            const tableElement = tempDiv.firstChild;
                            
                            // Insert the table
                            range.insertNode(tableElement);
                            console.log('Table inserted using DOM methods fallback');
                        } else {
                            // Last resort - append to editor
                            console.log('No selection range, appending table to editor content');
                            editor.innerHTML += tableHTML;
                        }
                    } catch (fallbackError) {
                        console.error('All table insertion methods failed:', fallbackError);
                    }
                }
            }
            
            console.log('Saving history after table insertion');
            saveHistory();
        } else {
            console.warn('Invalid table dimensions. Rows and columns must be greater than 0.');
        }
        
        console.log('Hiding table dialog');
        hideAllDialogs();
        
        // Verify if the table exists in the editor after insertion
        setTimeout(() => {
            const tableCount = editor.querySelectorAll('table').length;
            console.log(`Final check: ${tableCount} tables found in editor`);
        }, 500);
    }
    
    // Insert code block
    function insertCodeBlock() {
        console.log('Code block insertion');
        
        if (isSourceView) {
            insertAtCursor(htmlSource, '<pre><code>// Your code here</code></pre>');
            console.log('Inserted code block in source view');
        } else {
            try {
                // First focus the editor
                editor.focus();
                
                // Save the current selection for later use
                const selection = window.getSelection();
                let selectedText = '';
                
                if (selection.rangeCount > 0) {
                    // Get any selected text
                    selectedText = selection.toString().trim();
                    
                    // Store the range for later use
                    window.storedRange = selection.getRangeAt(0).cloneRange();
                    console.log(`Stored range for code block insertion with text: "${selectedText}"`);
                    
                    // Highlight the selection if there is text
                    if (selectedText) {
                        // Use surroundContents to wrap the selection in a highlight span
                        const range = selection.getRangeAt(0);
                        const highlightSpan = document.createElement('span');
                        highlightSpan.style.backgroundColor = '#FFFF80';
                        
                        try {
                            // Try to surround the contents with the span
                            range.surroundContents(highlightSpan);
                            console.log('Highlighted selected text for code block');
                        } catch (e) {
                            console.error('Could not highlight using surroundContents:', e);
                            // Fallback - use execCommand to highlight
                            document.execCommand('hiliteColor', false, '#FFFF80');
                            console.log('Highlighted selected text using execCommand');
                        }
                    }
                } else {
                    window.storedRange = null;
                    console.log('No selection range to store for code block');
                }
                
                // Create the code block HTML
                const codeHTML = `<pre>${selectedText || '// Your code here'}</pre>`;
                
                // First remove any existing highlighting
                removeHighlighting();
                
                if (window.storedRange) {
                    console.log('Using stored range for code block insertion');
                    
                    // Create a new selection using the stored range
                    selection.removeAllRanges();
                    selection.addRange(window.storedRange);
                    
                    // First delete the selected content
                    document.execCommand('delete');
                    
                    // Then insert the code block
                    document.execCommand('insertHTML', false, codeHTML);
                    
                    console.log('Replaced selected content with code block');
                    
                    // Clear stored range
                    window.storedRange = null;
                } else {
                    // No stored range, ensure we have a valid selection
                    ensureEditorFocus();
                    
                    // Insert at current position
                    document.execCommand('insertHTML', false, codeHTML);
                    console.log('Inserted code block at current cursor position');
                }
                
                // Let UI update and save history
                setTimeout(() => {
                    updateToolbarState();
                    saveHistory();
                    console.log('Editor content after code block insertion:', editor.innerHTML);
                }, 100);
            } catch (err) {
                console.error('Error inserting code block:', err);
                
                // Fallback 
                try {
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        // Get the range and explicitly delete its contents
                        const range = selection.getRangeAt(0);
                        range.deleteContents();
                        
                        // Create code element
                        const pre = document.createElement('pre');
                        pre.textContent = '// Your code here';
                        
                        // Insert the code block
                        range.insertNode(pre);
                        console.log('Fallback: Inserted code block using DOM methods');
                    } else {
                        // Append to end as last resort
                        const codeHTML = `<pre>// Your code here</pre>`;
                        editor.innerHTML += codeHTML;
                        console.log('Last resort: Appended code block to end of editor');
                    }
                    
                    setTimeout(() => saveHistory(), 100);
                } catch (fallbackErr) {
                    console.error('All code block insertion methods failed:', fallbackErr);
                }
            }
        }
    }
    
    // Insert text at cursor position in textarea
    function insertAtCursor(textarea, text) {
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        
        textarea.value = textarea.value.substring(0, startPos) + text + textarea.value.substring(endPos);
        
        // Move cursor after inserted text
        textarea.selectionStart = textarea.selectionEnd = startPos + text.length;
        textarea.focus();
    }
    
    // Hide all dialogs
    function hideAllDialogs() {
        linkDialog.style.display = 'none';
        imageDialog.style.display = 'none';
        tableDialog.style.display = 'none';
        emojiDialog.style.display = 'none';
        
        // Clear dialog inputs
        linkUrl.value = '';
        linkText.value = '';
        linkTarget.checked = false;
        
        imageUrl.value = '';
        imageAlt.value = '';
        imageWidth.value = '';
        imageHeight.value = '';
        
        // Note: We don't clear storedRange here as it needs to persist
        // for emoji insertion. It will be cleared after insertion.
        
        // Return focus to editor
        editor.focus();
    }
    
    // Remove highlighting from editor content
    function removeHighlighting() {
        if (isSourceView) return;
        
        try {
            // Remove any leftover highlighting spans using classes or styles
            const highlightedSpans = editor.querySelectorAll('.selection-highlight, span[style*="background-color: rgb(255, 255, 128)"]');
            if (highlightedSpans.length > 0) {
                console.log(`Removing ${highlightedSpans.length} highlight spans`);
                
                highlightedSpans.forEach(span => {
                    // Replace the span with its text content
                    const textNode = document.createTextNode(span.textContent);
                    span.parentNode.replaceChild(textNode, span);
                });
            }
        } catch (err) {
            console.error('Error removing highlights:', err);
        }
    }
    
    // Save content
    function saveContent() {
        const content = isSourceView ? htmlSource.value : editor.innerHTML;
        
        // Create a Blob with the HTML content
        const blob = new Blob([content], {type: 'text/html'});
        
        // Create a link element to download the file
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'editor-content.html';
        
        // Trigger the download
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Clean up the URL object
        URL.revokeObjectURL(a.href);
    }
    
    // Save current state to history
    function saveHistory() {
        const content = isSourceView ? htmlSource.value : editor.innerHTML;
        
        // Don't save if content hasn't changed
        if (editorHistory.length > 0 && historyIndex >= 0 && editorHistory[historyIndex] === content) {
            return;
        }
        
        // If we're not at the end of the history, remove everything after current index
        if (historyIndex < editorHistory.length - 1) {
            editorHistory = editorHistory.slice(0, historyIndex + 1);
        }
        
        // Add the new state to history
        editorHistory.push(content);
        
        // Limit history size
        if (editorHistory.length > MAX_HISTORY) {
            editorHistory.shift();
        }
        
        historyIndex = editorHistory.length - 1;
        
        // Update undo/redo button states
        updateUndoRedoButtons();
    }
    
    // Handle undo
    function handleUndo() {
        if (historyIndex > 0) {
            historyIndex--;
            restoreFromHistory();
        }
    }
    
    // Handle redo
    function handleRedo() {
        if (historyIndex < editorHistory.length - 1) {
            historyIndex++;
            restoreFromHistory();
        }
    }
    
    // Restore editor content from history
    function restoreFromHistory() {
        const content = editorHistory[historyIndex];
        
        if (isSourceView) {
            htmlSource.value = content;
        } else {
            editor.innerHTML = content;
        }
        
        updateUndoRedoButtons();
        updateWordCount();
    }
    
    // Update undo/redo button states
    function updateUndoRedoButtons() {
        undoBtn.disabled = historyIndex <= 0;
        redoBtn.disabled = historyIndex >= editorHistory.length - 1;
    }
    
    // Toggle pipette mode
    function togglePipette() {
        isPipetteActive = !isPipetteActive;
        pipetteBtn.classList.toggle('active', isPipetteActive);
        
        // Toggle cursor style for the editor
        editor.classList.toggle('pipette-cursor', isPipetteActive);
        
        if (isPipetteActive) {
            console.log('Pipette activated: Click on text to pick up its style');
            
            // Initialize or reset the combined styles object
            if (!window.combinedPipetteStyles) {
                window.combinedPipetteStyles = {};
            }
            
            // Store current selection for later use
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                // Store the selection as a range
                window.storedRange = selection.getRangeAt(0).cloneRange();
                
                // Highlight the selected text so user can see what will be styled
                if (window.storedRange && !window.storedRange.collapsed) {
                    try {
                        // Create a marker span
                        const highlightSpan = document.createElement('span');
                        highlightSpan.style.backgroundColor = '#FFFF80';
                        highlightSpan.className = 'stored-selection-highlight';
                        
                        // Store the selected text for restoration
                        const selectedText = window.storedRange.toString();
                        window.storedText = selectedText;
                        
                        console.log(`Stored selection text: "${selectedText}"`);
                        
                        // Create a temporary working range and highlight it
                        const tempRange = window.storedRange.cloneRange();
                        tempRange.surroundContents(highlightSpan);
                    } catch (e) {
                        console.error('Could not highlight selection:', e);
                    }
                }
            }
            
            editor.addEventListener('mousemove', handlePipetteHover);
            editor.addEventListener('click', handlePipettePick);
        } else {
            console.log('Pipette deactivated');
            editor.removeEventListener('mousemove', handlePipetteHover);
            editor.removeEventListener('click', handlePipettePick);
            
            // Clean up any stored selection highlights without applying styles
            clearStoredSelectionHighlight(false);
            
            // Reset combined styles when deactivating
            window.combinedPipetteStyles = null;
        }
    }
    
    // Handle pipette hovering
    function handlePipetteHover(e) {
        // Debounce hover events to improve performance
        if (pipetteDebounceTimer) {
            // Don't process if mouse hasn't moved much
            if (lastPipetteElement === e.target) {
                return;
            }
            clearTimeout(pipetteDebounceTimer);
        }
        
        pipetteDebounceTimer = setTimeout(() => {
            // Clear any previous highlights
            clearPipettePreview();
            
            // Get the element under the cursor
            const element = document.elementFromPoint(e.clientX, e.clientY);
            lastPipetteElement = element;
            
            // Only highlight if it's inside the editor and not our stored selection highlight
            if (element && editor.contains(element) && 
                !element.classList.contains('stored-selection-highlight')) {
                element.classList.add('pipette-preview');
            }
            
            pipetteDebounceTimer = null;
        }, 50);
    }
    
    // Handle pipette picking
    function handlePipettePick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Get the element under the cursor
        const element = document.elementFromPoint(e.clientX, e.clientY);
        
        // Don't pick from our own stored selection highlight
        if (element && element.classList.contains('stored-selection-highlight')) {
            console.log('Cannot pick styles from the current selection');
            return;
        }
        
        if (element && editor.contains(element)) {
            // Extract styles from the element
            const computedStyle = window.getComputedStyle(element);
            
            // Check element and parent elements for style information
            let currentElement = element;
            
            // Create new styles with explicit default values for formatting flags
            const newStyles = {
                // Store text styles
                fontFamily: computedStyle.fontFamily,
                fontSize: computedStyle.fontSize,
                fontWeight: computedStyle.fontWeight,
                fontStyle: computedStyle.fontStyle,
                textDecoration: computedStyle.textDecoration,
                color: computedStyle.color,
                backgroundColor: 'transparent', // Default to transparent
                
                // Store alignment
                textAlign: computedStyle.textAlign,
                
                // Store link information if it's an anchor
                isLink: element.tagName.toLowerCase() === 'a',
                href: element.tagName.toLowerCase() === 'a' ? element.getAttribute('href') : null,
                
                // Store element type for formatting blocks
                tagName: element.tagName.toLowerCase(),
                
                // Explicitly initialize formatting flags to false
                isBold: false,
                isItalic: false,
                isUnderline: false,
                isStrikethrough: false,
                
                // Explicit flag for background color
                hasBackgroundColor: false
            };
            
            // Now check for formatting using various methods
            
            // Check if element or any parent is a tag that implies formatting
            let isBoldTag = false;
            let isItalicTag = false;
            let isUnderlineTag = false;
            let isStrikeTag = false;
            
            // Reset currentElement
            currentElement = element;
            
            while (currentElement && editor.contains(currentElement)) {
                const tagName = currentElement.tagName.toLowerCase();
                
                // Check for tag-based formatting
                if (tagName === 'b' || tagName === 'strong') isBoldTag = true;
                if (tagName === 'i' || tagName === 'em') isItalicTag = true;
                if (tagName === 'u') isUnderlineTag = true;
                if (tagName === 's' || tagName === 'strike' || tagName === 'del') isStrikeTag = true;
                
                // Also check for style attributes
                if (currentElement.style) {
                    if (currentElement.style.fontWeight === 'bold' || parseInt(currentElement.style.fontWeight) >= 700) isBoldTag = true;
                    if (currentElement.style.fontStyle === 'italic') isItalicTag = true;
                    if (currentElement.style.textDecoration && currentElement.style.textDecoration.includes('underline')) isUnderlineTag = true;
                    if (currentElement.style.textDecoration && currentElement.style.textDecoration.includes('line-through')) isStrikeTag = true;
                }
                
                currentElement = currentElement.parentElement;
            }
            
            console.log('Tag-based style detection:', 
                       'Bold tag:', isBoldTag, 
                       'Italic tag:', isItalicTag, 
                       'Underline tag:', isUnderlineTag, 
                       'Strike tag:', isStrikeTag);
            
            // Update our formatting flags based on tag detection
            newStyles.isBold = isBoldTag;
            newStyles.isItalic = isItalicTag;
            newStyles.isUnderline = isUnderlineTag;
            newStyles.isStrikethrough = isStrikeTag;
            
            // Also check computed style properties
            if (parseInt(computedStyle.fontWeight) >= 700 || computedStyle.fontWeight === 'bold') {
                newStyles.isBold = true;
            }
            
            if (computedStyle.fontStyle === 'italic') {
                newStyles.isItalic = true;
            }
            
            if (computedStyle.textDecoration.includes('underline')) {
                newStyles.isUnderline = true;
            }
            
            if (computedStyle.textDecoration.includes('line-through')) {
                newStyles.isStrikethrough = true;
            }
            
            // Check for background color
            if (computedStyle.backgroundColor && 
                computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                computedStyle.backgroundColor !== 'transparent') {
                newStyles.backgroundColor = computedStyle.backgroundColor;
                newStyles.hasBackgroundColor = true;
                console.log('Detected background color:', computedStyle.backgroundColor);
            } else {
                console.log('No background color detected');
            }
            
            // Log ALL the style props for debugging
            console.log('Element:', element.tagName, 
                        'fontWeight:', computedStyle.fontWeight,
                        'fontStyle:', computedStyle.fontStyle,
                        'textDecoration:', computedStyle.textDecoration);
            
            console.log('Detected style properties:', 
                        'Bold:', newStyles.isBold, 
                        'Italic:', newStyles.isItalic,
                        'Underline:', newStyles.isUnderline,
                        'Strikethrough:', newStyles.isStrikethrough);
            
            // Apply the document.queryCommandState method for extra verification
            try {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    
                    // Store current selection
                    const currentRange = range.cloneRange();
                    
                    // Create a temporary selection on the element we're checking
                    const tempRange = document.createRange();
                    tempRange.selectNodeContents(element);
                    selection.removeAllRanges();
                    selection.addRange(tempRange);
                    
                    // Check command states
                    const cmdBold = document.queryCommandState('bold');
                    const cmdItalic = document.queryCommandState('italic');
                    const cmdUnderline = document.queryCommandState('underline');
                    const cmdStrike = document.queryCommandState('strikeThrough');
                    
                    console.log('Command state detection:', 
                               'Bold:', cmdBold,
                               'Italic:', cmdItalic,
                               'Underline:', cmdUnderline,
                               'Strikethrough:', cmdStrike);
                    
                    // Update formatting flags with command state results
                    newStyles.isBold = newStyles.isBold || cmdBold;
                    newStyles.isItalic = newStyles.isItalic || cmdItalic;
                    newStyles.isUnderline = newStyles.isUnderline || cmdUnderline;
                    newStyles.isStrikethrough = newStyles.isStrikethrough || cmdStrike;
                    
                    // Restore original selection
                    selection.removeAllRanges();
                    selection.addRange(currentRange);
                }
            } catch (err) {
                console.error('Error checking command states:', err);
            }
            
            // Final detection result
            console.log('Final style detection:', 
                        'Bold:', newStyles.isBold, 
                        'Italic:', newStyles.isItalic,
                        'Underline:', newStyles.isUnderline,
                        'Strikethrough:', newStyles.isStrikethrough);
            
            // Combine with existing styles or initialize combined styles
            if (!window.combinedPipetteStyles) {
                window.combinedPipetteStyles = {};
            }
            
            // Ensure formatting flags are always included in combined styles
            window.combinedPipetteStyles.isBold = newStyles.isBold;
            window.combinedPipetteStyles.isItalic = newStyles.isItalic; 
            window.combinedPipetteStyles.isUnderline = newStyles.isUnderline;
            window.combinedPipetteStyles.isStrikethrough = newStyles.isStrikethrough;
            
            // Always include background color state
            window.combinedPipetteStyles.hasBackgroundColor = newStyles.hasBackgroundColor;
            window.combinedPipetteStyles.backgroundColor = newStyles.backgroundColor;
            
            // Only update properties that have meaningful values
            if (newStyles.fontFamily && newStyles.fontFamily !== 'inherit') {
                window.combinedPipetteStyles.fontFamily = newStyles.fontFamily;
            }
            
            if (newStyles.fontSize && newStyles.fontSize !== 'inherit') {
                window.combinedPipetteStyles.fontSize = newStyles.fontSize;
            }
            
            if (newStyles.color && newStyles.color !== 'rgba(0, 0, 0, 0)') {
                window.combinedPipetteStyles.color = newStyles.color;
            }
            
            // Remove the redundant background color setting since we already set it explicitly above
            // if (newStyles.backgroundColor && newStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
            //     newStyles.backgroundColor !== 'transparent') {
            //     window.combinedPipetteStyles.backgroundColor = newStyles.backgroundColor;
            // }
            
            if (newStyles.textAlign && newStyles.textAlign !== 'inherit') {
                window.combinedPipetteStyles.textAlign = newStyles.textAlign;
            }
            
            if (newStyles.isLink && newStyles.href) {
                window.combinedPipetteStyles.isLink = true;
                window.combinedPipetteStyles.href = newStyles.href;
            }
            
            if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre'].includes(newStyles.tagName)) {
                window.combinedPipetteStyles.tagName = newStyles.tagName;
            }
            
            console.log('Picked and combined styles:', window.combinedPipetteStyles);
            
            // Apply the combined styles to the selected text
            pipetteStyles = window.combinedPipetteStyles;
            applyPipetteStyles();
            
            // Reset combined styles for next use
            window.combinedPipetteStyles = null;
            
            // Toggle off pipette mode
            isPipetteActive = false;
            pipetteBtn.classList.remove('active');
            editor.classList.remove('pipette-cursor');
            editor.removeEventListener('mousemove', handlePipetteHover);
            editor.removeEventListener('click', handlePipettePick);
            console.log('Pipette deactivated');
            
            // Clear any preview highlights
            clearPipettePreview();
        }
    }
    
    // Clear stored selection highlight
    function clearStoredSelectionHighlight(applyStyles) {
        // Find any stored selection highlights
        const highlights = editor.querySelectorAll('.stored-selection-highlight');
        
        if (highlights.length > 0) {
            // Create a new temporary range for the current position
            const selection = window.getSelection();
            let tempRange = null;
            
            if (selection.rangeCount > 0) {
                tempRange = selection.getRangeAt(0).cloneRange();
            }
            
            // Process each highlight
            highlights.forEach(highlight => {
                if (applyStyles) {
                    // Keep the range location for applying styles
                    const range = document.createRange();
                    range.selectNodeContents(highlight);
                    window.storedRange = range.cloneRange();
                    
                    // Set the selection to this range before removing the highlight
                    selection.removeAllRanges();
                    selection.addRange(range.cloneRange());
                    console.log('Set selection to highlight content:', highlight.textContent);
                }
                
                // Replace the highlight with its text content
                const text = highlight.textContent;
                const textNode = document.createTextNode(text);
                const parent = highlight.parentNode;
                if (parent) {
                    parent.replaceChild(textNode, highlight);
                    console.log('Removed highlight while preserving text:', text);
                    
                    if (applyStyles) {
                        // After replacing, update the range to the new text node
                        const newRange = document.createRange();
                        newRange.setStart(textNode, 0);
                        newRange.setEnd(textNode, text.length);
                        window.storedRange = newRange.cloneRange();
                        
                        // Also update the selection
                        selection.removeAllRanges();
                        selection.addRange(newRange);
                        console.log('Updated selection to text node, length:', text.length);
                    }
                }
            });
            
            // Restore selection to where it was if not applying styles
            if (!applyStyles && tempRange) {
                selection.removeAllRanges();
                selection.addRange(tempRange);
            }
        }
    }
    
    // Apply picked styles to selection - with fallback mechanisms
    function applyPipetteStyles() {
        if (!pipetteStyles) return;
        
        try {
            // First clear any highlight spans and get the selection ready
            clearStoredSelectionHighlight(true);
            
            // Focus the editor
            editor.focus();
            
            // Check if we have a valid selection
            const selection = window.getSelection();
            if (!selection.rangeCount || selection.getRangeAt(0).collapsed) {
                console.log('No valid selection after clearing highlight, trying recovery...');
                
                // Recovery attempt 1: Try to use the stored text to find matching content
                if (window.storedText && window.storedText.length > 0) {
                    console.log('Attempting to recover selection using stored text:', window.storedText);
                    
                    // Look for the text in the editor content
                    const allTextNodes = [];
                    const nodeWalker = document.createTreeWalker(
                        editor, 
                        NodeFilter.SHOW_TEXT,
                        null,
                        false
                    );
                    
                    // Collect all text nodes
                    let currentNode;
                    while (currentNode = nodeWalker.nextNode()) {
                        allTextNodes.push(currentNode);
                    }
                    
                    // Find the node containing our text
                    let foundNode = null;
                    let foundIndex = -1;
                    
                    for (let i = 0; i < allTextNodes.length; i++) {
                        const node = allTextNodes[i];
                        const index = node.textContent.indexOf(window.storedText);
                        if (index >= 0) {
                            foundNode = node;
                            foundIndex = index;
                            break;
                        }
                    }
                    
                    if (foundNode && foundIndex >= 0) {
                        console.log('Found text node containing stored text');
                        
                        // Create a new range and selection
                        const range = document.createRange();
                        range.setStart(foundNode, foundIndex);
                        range.setEnd(foundNode, foundIndex + window.storedText.length);
                        
                        selection.removeAllRanges();
                        selection.addRange(range);
                        
                        console.log('Recovered selection successfully');
                    } else {
                        // Recovery attempt 2: Direct HTML replacement
                        console.log('Could not find text node, trying direct HTML replacement');
                        
                        // Create a styled version of the text
                        const containerDiv = document.createElement('div');
                        containerDiv.textContent = window.storedText;
                        
                        // Apply all the styling to this container
                        applyStylesToElement(containerDiv);
                        
                        // Replace the original text in the editor's HTML
                        const escapedText = window.storedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        const regex = new RegExp(escapedText, 'g');
                        
                        // Use innerHTML manipulation as a last resort
                        const currentHTML = editor.innerHTML;
                        const updatedHTML = currentHTML.replace(regex, containerDiv.innerHTML);
                        
                        if (currentHTML !== updatedHTML) {
                            editor.innerHTML = updatedHTML;
                            console.log('Applied styles via direct HTML replacement');
                            saveHistory();
                            return;
                        } else {
                            console.log('Direct replacement failed, no match found');
                            return;
                        }
                    }
                } else {
                    console.log('No stored text available for recovery');
                    return;
                }
            }
            
            // Log the current selection for debugging
            const selText = selection.toString();
            console.log('Applying styles to selection:', selText, 'Length:', selText.length);
            
            // Apply the styles only if we have a real selection
            if (selText.length > 0) {
                // First check if we need to reset any formatting that should be removed
                resetFormatting();
                
                // Then apply the styles using standard execCommand methods
                applyStylesToSelection();
                console.log('Successfully applied picked styles to selection');
                saveHistory();
            } else {
                console.log('Selection is empty, cannot apply styles');
            }
            
            // Clear the stored data
            window.storedRange = null;
            window.storedText = null;
        } catch (err) {
            console.error('Error applying pipette styles:', err);
        }
    }
    
    // Reset text formatting to remove any existing formatting
    function resetFormatting() {
        // Only remove formatting if we have formatting flags in the pipette styles
        if (pipetteStyles.hasOwnProperty('isBold') || 
            pipetteStyles.hasOwnProperty('isItalic') || 
            pipetteStyles.hasOwnProperty('isUnderline') || 
            pipetteStyles.hasOwnProperty('isStrikethrough') ||
            pipetteStyles.hasOwnProperty('hasBackgroundColor')) {
            
            console.log('Explicitly handling formatting flags');
            
            // Check current formatting status
            const currentIsBold = document.queryCommandState('bold');
            const currentIsItalic = document.queryCommandState('italic');
            const currentIsUnderline = document.queryCommandState('underline');
            const currentIsStrikethrough = document.queryCommandState('strikeThrough');
            
            // Get the current selection's background color
            let currentBackgroundColor = null;
            try {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const selectedNode = range.startContainer;
                    
                    // If it's a text node, get its parent element
                    const element = selectedNode.nodeType === 3 ? selectedNode.parentElement : selectedNode;
                    
                    if (element) {
                        const computedStyle = window.getComputedStyle(element);
                        currentBackgroundColor = computedStyle.backgroundColor;
                        console.log('Current background color:', currentBackgroundColor);
                    }
                }
            } catch (e) {
                console.error('Error checking current background color:', e);
            }
            
            console.log('Current formatting:', 
                       'Bold:', currentIsBold, 
                       'Italic:', currentIsItalic, 
                       'Underline:', currentIsUnderline, 
                       'Strikethrough:', currentIsStrikethrough,
                       'Has background color:', currentBackgroundColor && 
                           currentBackgroundColor !== 'rgba(0, 0, 0, 0)' && 
                           currentBackgroundColor !== 'transparent');
            
            // Explicitly toggle formatting based on target state
            
            // Handle bold
            if (pipetteStyles.hasOwnProperty('isBold')) {
                if (currentIsBold && !pipetteStyles.isBold) {
                    console.log('Removing bold formatting');
                    document.execCommand('bold', false, null);
                }
            }
            
            // Handle italic
            if (pipetteStyles.hasOwnProperty('isItalic')) {
                if (currentIsItalic && !pipetteStyles.isItalic) {
                    console.log('Removing italic formatting');
                    document.execCommand('italic', false, null);
                }
            }
            
            // Handle underline
            if (pipetteStyles.hasOwnProperty('isUnderline')) {
                if (currentIsUnderline && !pipetteStyles.isUnderline) {
                    console.log('Removing underline formatting');
                    document.execCommand('underline', false, null);
                }
            }
            
            // Handle strikethrough
            if (pipetteStyles.hasOwnProperty('isStrikethrough')) {
                if (currentIsStrikethrough && !pipetteStyles.isStrikethrough) {
                    console.log('Removing strikethrough formatting');
                    document.execCommand('strikeThrough', false, null);
                }
            }
            
            // Handle background color
            if (pipetteStyles.hasOwnProperty('hasBackgroundColor')) {
                const hasCurrentBgColor = currentBackgroundColor && 
                                         currentBackgroundColor !== 'rgba(0, 0, 0, 0)' && 
                                         currentBackgroundColor !== 'transparent';
                
                if (hasCurrentBgColor && !pipetteStyles.hasBackgroundColor) {
                    console.log('Removing background color');
                    
                    // Apply transparent background to remove existing background color
                    document.execCommand('hiliteColor', false, 'transparent');
                }
            }
        }
    }
    
    // Helper function to apply styles to the current selection
    function applyStylesToSelection() {
        // Apply bold, italic, underline, strikethrough first
        if (pipetteStyles.isBold) {
            console.log('Applying bold formatting');
            document.execCommand('bold', false, null);
        }
        
        if (pipetteStyles.isItalic) {
            console.log('Applying italic formatting');
            document.execCommand('italic', false, null);
        }
        
        if (pipetteStyles.isUnderline) {
            console.log('Applying underline formatting');
            document.execCommand('underline', false, null);
        }
        
        if (pipetteStyles.isStrikethrough) {
            console.log('Applying strikethrough formatting');
            document.execCommand('strikeThrough', false, null);
        }
        
        // Apply text styles
        if (pipetteStyles.fontFamily) {
            document.execCommand('fontName', false, pipetteStyles.fontFamily);
        }
        
        // Apply colors
        if (pipetteStyles.color && pipetteStyles.color !== 'rgba(0, 0, 0, 0)') {
            document.execCommand('foreColor', false, pipetteStyles.color);
        }
        
        // Only apply background color if the hasBackgroundColor flag is true
        if (pipetteStyles.hasBackgroundColor && pipetteStyles.backgroundColor && 
            pipetteStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
            pipetteStyles.backgroundColor !== 'transparent') {
            console.log('Applying background color:', pipetteStyles.backgroundColor);
            document.execCommand('hiliteColor', false, pipetteStyles.backgroundColor);
        }
        
        // Apply alignment
        if (pipetteStyles.textAlign) {
            switch (pipetteStyles.textAlign) {
                case 'left':
                    document.execCommand('justifyLeft', false, null);
                    break;
                case 'center':
                    document.execCommand('justifyCenter', false, null);
                    break;
                case 'right':
                    document.execCommand('justifyRight', false, null);
                    break;
                case 'justify':
                    document.execCommand('justifyFull', false, null);
                    break;
            }
        }
        
        // Apply format block (like headings)
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre'].includes(pipetteStyles.tagName)) {
            document.execCommand('formatBlock', false, '<' + pipetteStyles.tagName + '>');
        }
        
        // Apply link if the picked element was a link
        if (pipetteStyles.isLink && pipetteStyles.href) {
            document.execCommand('createLink', false, pipetteStyles.href);
        }
    }
    
    // Helper function to apply styles to a given element
    function applyStylesToElement(element) {
        if (pipetteStyles.fontFamily) {
            element.style.fontFamily = pipetteStyles.fontFamily;
        }
        
        if (pipetteStyles.fontWeight === 'bold' || parseInt(pipetteStyles.fontWeight) >= 700) {
            element.style.fontWeight = 'bold';
        }
        
        if (pipetteStyles.fontStyle === 'italic') {
            element.style.fontStyle = 'italic';
        }
        
        if (pipetteStyles.textDecoration.includes('underline')) {
            element.style.textDecoration = (element.style.textDecoration || '') + ' underline';
        }
        
        if (pipetteStyles.textDecoration.includes('line-through')) {
            element.style.textDecoration = (element.style.textDecoration || '') + ' line-through';
        }
        
        if (pipetteStyles.color && pipetteStyles.color !== 'rgba(0, 0, 0, 0)') {
            element.style.color = pipetteStyles.color;
        }
        
        if (pipetteStyles.backgroundColor && pipetteStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
            pipetteStyles.backgroundColor !== 'transparent') {
            element.style.backgroundColor = pipetteStyles.backgroundColor;
        }
        
        if (pipetteStyles.textAlign) {
            element.style.textAlign = pipetteStyles.textAlign;
        }
        
        // For links we need to create an actual <a> element
        if (pipetteStyles.isLink && pipetteStyles.href) {
            const link = document.createElement('a');
            link.href = pipetteStyles.href;
            link.textContent = element.textContent;
            
            // Copy all styles to the link
            link.style.cssText = element.style.cssText;
            
            // Replace element's content with the link
            element.textContent = '';
            element.appendChild(link);
        }
    }
    
    // Clear any pipette preview highlights
    function clearPipettePreview() {
        const highlighted = editor.querySelectorAll('.pipette-preview');
        highlighted.forEach(el => el.classList.remove('pipette-preview'));
    }
    
    // Load content
    function loadContent() {
        // Trigger the hidden file input click
        fileInput.click();
    }
    
    // Handle file upload
    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Only accept .html or .htm files
        if (!file.name.match(/\.(html|htm)$/i)) {
            showNotification('Please select an HTML file (.html or .htm)', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const content = e.target.result;
                
                // Parse and sanitize the HTML content
                const parser = new DOMParser();
                const doc = parser.parseFromString(content, 'text/html');
                
                // Get the body content from the HTML file
                let bodyContent = '';
                
                // Check if there's a body tag with content
                if (doc.body && doc.body.innerHTML.trim()) {
                    bodyContent = doc.body.innerHTML;
                } else {
                    // If no body tag or it's empty, use the entire content
                    bodyContent = content;
                }
                
                // Apply the content to the editor
                if (isSourceView) {
                    htmlSource.value = bodyContent;
                } else {
                    editor.innerHTML = bodyContent;
                }
                
                // Update word count and history
                updateWordCount();
                saveHistory();
                
                console.log('Content loaded from file:', file.name);
                showNotification(`Content loaded successfully from ${file.name}`, 'success');
            } catch (err) {
                console.error('Error loading file:', err);
                showNotification('Error loading file. Please try again with a valid HTML file.', 'error');
            }
            
            // Reset the file input to allow loading the same file again
            fileInput.value = '';
        };
        
        reader.onerror = function() {
            console.error('Error reading file');
            showNotification('Error reading file. Please try again.', 'error');
            fileInput.value = '';
        };
        
        // Read the file as text
        reader.readAsText(file);
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Set up notification content
        let icon = '';
        switch (type) {
            case 'success':
                icon = '<i class="fas fa-check-circle notification-icon"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-exclamation-circle notification-icon"></i>';
                break;
            case 'warning':
                icon = '<i class="fas fa-exclamation-triangle notification-icon"></i>';
                break;
            default:
                icon = '<i class="fas fa-info-circle notification-icon"></i>';
                break;
        }
        
        notification.innerHTML = `
            <div class="notification-content">
                ${icon}
                <span class="notification-message">${message}</span>
            </div>
            <span class="notification-close">&times;</span>
        `;
        
        // Add to notification area
        notificationArea.appendChild(notification);
        
        // Ensure notification area is visible
        notificationArea.style.maxHeight = '200px';
        notificationArea.style.padding = '10px';
        
        // Set up auto-dismiss timer
        const dismissTimer = setTimeout(() => {
            dismissNotification(notification);
        }, 5000);
        
        // Set up manual close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(dismissTimer);
            dismissNotification(notification);
        });
        
        // Store timer reference for potential early dismissal
        notification.dismissTimer = dismissTimer;
        
        return notification;
    }
    
    // Dismiss notification with animation
    function dismissNotification(notification) {
        // Add fade out animation
        notification.style.animation = 'fadeOut 0.3s forwards';
        
        // Remove element after animation completes
        notification.addEventListener('animationend', () => {
            notification.remove();
            
            // Hide notification area if empty
            if (notificationArea.children.length === 0) {
                notificationArea.style.maxHeight = '0';
                notificationArea.style.padding = '0';
            }
        });
        
        // Clear any existing timers
        if (notification.dismissTimer) {
            clearTimeout(notification.dismissTimer);
        }
    }
    
    // Dedicated function to update just the color pickers
    function updateColorPickerState() {
        if (isSourceView) return;
        
        try {
            // Get the current selection
            const selection = window.getSelection();
            if (!selection.rangeCount) return;
            
            const range = selection.getRangeAt(0);
            if (!editor.contains(range.commonAncestorContainer)) return;
            
            // Text color
            const currentColor = document.queryCommandValue('foreColor');
            if (currentColor && currentColor !== 'rgba(0, 0, 0, 0)') {
                forecolorPicker.value = rgbToHex(currentColor);
                console.log('Clicked color picker - updated text color to:', forecolorPicker.value);
            }
            
            // Background color - use robust detection
            let currentBgColor = document.queryCommandValue('hiliteColor');
            let foundBgColor = false;
            
            // Try to get computed style if execCommand fails
            if (!currentBgColor || currentBgColor === 'rgba(0, 0, 0, 0)' || currentBgColor === 'transparent') {
                // Get current element at selection
                const anchorNode = range.commonAncestorContainer;
                let element = anchorNode;
                
                // If it's a text node, get its parent element
                if (anchorNode.nodeType === 3) {
                    element = anchorNode.parentElement;
                }
                
                // Walk up the DOM to find background color
                while (element && element !== editor) {
                    const computedStyle = window.getComputedStyle(element);
                    const bgColor = computedStyle.backgroundColor;
                    
                    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                        currentBgColor = bgColor;
                        foundBgColor = true;
                        break;
                    }
                    
                    element = element.parentElement;
                }
            } else {
                foundBgColor = true;
            }
            
            if (foundBgColor) {
                backcolorPicker.value = rgbToHex(currentBgColor);
                console.log('Clicked color picker - updated background color to:', backcolorPicker.value);
            } else {
                // Reset to white if no background color was found
                backcolorPicker.value = '#ffffff';
            }
            
        } catch (e) {
            console.error('Error updating color pickers on click:', e);
        }
    }
    
    // Show emoji dialog
    function showEmojiDialog() {
        // Store the current selection for later use
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            // Store the range for later use
            window.storedRange = selection.getRangeAt(0).cloneRange();
            console.log('Stored range for emoji insertion');
        }
        
        // Clear the search field
        emojiSearch.value = '';
        
        // Ensure we have focus and selection in the editor
        ensureEditorFocus();
        
        // Show emoji dialog
        emojiDialog.style.display = 'flex';
        
        // Set active category
        setActiveEmojiCategory('smileys');
        
        // Focus the search field
        setTimeout(() => {
            emojiSearch.focus();
        }, 100);
        
        // Load recently used emojis
        loadRecentEmojis();
    }
    
    // Set active emoji category
    function setActiveEmojiCategory(category) {
        // Remove active class from all category buttons
        emojiCategories.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to selected category
        document.querySelector(`.emoji-category[data-category="${category}"]`).classList.add('active');
        
        // Load emojis for the category
        loadEmojis(category);
    }
    
    // Load emojis for a category
    function loadEmojis(category) {
        // Clear the emoji grid
        emojiGrid.innerHTML = '';
        
        // Get emojis for the category
        const emojis = emojiData[category];
        
        // Create emoji items and add them to the grid
        emojis.forEach(emoji => {
            const emojiItem = document.createElement('div');
            emojiItem.classList.add('emoji-item');
            emojiItem.textContent = emoji;
            emojiItem.title = `Insert ${emoji}`;
            emojiItem.addEventListener('click', () => {
                insertEmoji(emoji);
            });
            
            emojiGrid.appendChild(emojiItem);
        });
    }
    
    // Handle search in emoji dialog
    function handleEmojiSearch() {
        const searchTerm = emojiSearch.value.toLowerCase();
        
        if (!searchTerm) {
            // If search term is empty, show the active category
            const activeCategory = document.querySelector('.emoji-category.active').dataset.category;
            loadEmojis(activeCategory);
            return;
        }
        
        // Clear the emoji grid
        emojiGrid.innerHTML = '';
        
        // Search in all categories
        let results = [];
        for (const category in emojiData) {
            const categoryEmojis = emojiData[category];
            // Add all emojis from the category (no real search, just display all when searching)
            // In a real implementation, we would filter based on emoji descriptions
            results = results.concat(categoryEmojis);
        }
        
        // Limit results to prevent performance issues
        results = results.slice(0, 100);
        
        // Create emoji items and add them to the grid
        results.forEach(emoji => {
            const emojiItem = document.createElement('div');
            emojiItem.classList.add('emoji-item');
            emojiItem.textContent = emoji;
            emojiItem.title = `Insert ${emoji}`;
            emojiItem.addEventListener('click', () => {
                insertEmoji(emoji);
            });
            
            emojiGrid.appendChild(emojiItem);
        });
    }
    
    // Insert emoji at cursor position
    function insertEmoji(emoji) {
        // First restore the saved selection if available
        if (window.storedRange) {
            try {
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(window.storedRange);
                console.log('Restored selection range for emoji insertion');
            } catch (err) {
                console.error('Error restoring selection for emoji:', err);
            }
        }
        
        // Ensure we have focus and selection in the editor
        ensureEditorFocus();
        
        // Execute command to insert the emoji
        document.execCommand('insertText', false, emoji);
        
        // Save to recently used emojis
        addToRecentEmojis(emoji);
        
        // Show quick emoji button
        showQuickEmojiButton(emoji);
        
        // Close the emoji dialog
        hideAllDialogs();
        
        // Update word count
        updateWordCount();
        
        // Save history
        saveHistory();
        
        // Clear the stored range
        window.storedRange = null;
    }
    
    // Add emoji to recently used list
    function addToRecentEmojis(emoji) {
        // Remove if already exists
        recentEmojisList = recentEmojisList.filter(item => item !== emoji);
        
        // Add to beginning of the list
        recentEmojisList.unshift(emoji);
        
        // Limit to 16 recent emojis
        if (recentEmojisList.length > 16) {
            recentEmojisList = recentEmojisList.slice(0, 16);
        }
        
        // Save to local storage
        localStorage.setItem('recentEmojis', JSON.stringify(recentEmojisList));
    }
    
    // Load recently used emojis
    function loadRecentEmojis() {
        // Clear the recent emojis grid
        recentEmojis.innerHTML = '';
        
        // Try to get from local storage
        const storedEmojis = localStorage.getItem('recentEmojis');
        if (storedEmojis) {
            recentEmojisList = JSON.parse(storedEmojis);
        }
        
        // If no recent emojis, hide the section
        if (recentEmojisList.length === 0) {
            document.querySelector('.recently-used-emojis').style.display = 'none';
            return;
        }
        
        // Show the section
        document.querySelector('.recently-used-emojis').style.display = 'block';
        
        // Create emoji items and add them to the grid
        recentEmojisList.forEach(emoji => {
            const emojiItem = document.createElement('div');
            emojiItem.classList.add('emoji-item');
            emojiItem.textContent = emoji;
            emojiItem.title = `Insert ${emoji}`;
            emojiItem.addEventListener('click', () => {
                insertEmoji(emoji);
            });
            
            recentEmojis.appendChild(emojiItem);
        });
    }

    // Show the quick emoji button with the last used emoji
    function showQuickEmojiButton(emoji) {
        // Get the quick emoji button
        const quickEmojiBtn = document.getElementById('quick-emoji-btn');
        
        // Clear any existing timeout
        if (window.quickEmojiBtnTimeout) {
            clearTimeout(window.quickEmojiBtnTimeout);
        }
        
        // Set the button text to the emoji
        quickEmojiBtn.textContent = emoji;
        
        // Store the emoji for reuse
        quickEmojiBtn.dataset.emoji = emoji;
        
        // Show the button
        quickEmojiBtn.style.display = 'inline-flex';
        quickEmojiBtn.style.opacity = '1';
        
        // Add click handler if not already added
        if (!quickEmojiBtn.hasClickListener) {
            quickEmojiBtn.addEventListener('click', handleQuickEmojiClick);
            quickEmojiBtn.hasClickListener = true;
        }
        
        // Set a timeout to hide the button after 5 seconds
        window.quickEmojiBtnTimeout = setTimeout(() => {
            hideQuickEmojiButton();
        }, 5000);
    }

    // Handle click on quick emoji button
    function handleQuickEmojiClick() {
        // Get the emoji from the button
        const emoji = this.dataset.emoji;
        
        // Focus the editor and ensure selection
        const editor = document.getElementById('editor');
        editor.focus();
        
        // Insert the emoji
        document.execCommand('insertText', false, emoji);
        
        // Reset the timeout
        if (window.quickEmojiBtnTimeout) {
            clearTimeout(window.quickEmojiBtnTimeout);
        }
        
        // Set a new timeout
        window.quickEmojiBtnTimeout = setTimeout(() => {
            hideQuickEmojiButton();
        }, 5000);
        
        // Save history and update word count
        if (typeof saveHistory === 'function') {
            saveHistory();
        }
        
        if (typeof updateWordCount === 'function') {
            updateWordCount();
        }
    }

    // Hide the quick emoji button with animation
    function hideQuickEmojiButton() {
        const quickEmojiBtn = document.getElementById('quick-emoji-btn');
        
        // Add the fade out animation
        quickEmojiBtn.style.animation = 'quickEmojiButtonFadeOut 0.5s forwards';
        
        // Hide the button after animation completes
        setTimeout(() => {
            quickEmojiBtn.style.display = 'none';
            quickEmojiBtn.style.animation = '';
        }, 500);
    }

    // Function to handle text selection and display the drag handle
    function handleTextSelection() {
        // Remove any existing drag handle
        removeDragHandle();
        
        const selection = window.getSelection();
        
        // If there's no selection or it's collapsed (cursor only), return
        if (!selection || selection.isCollapsed || !selection.rangeCount) {
            return;
        }
        
        // Make sure we're selecting within the editor
        const range = selection.getRangeAt(0);
        const editorElement = document.getElementById('editor');
        if (!editorElement.contains(range.commonAncestorContainer)) {
            return;
        }
        
        // Get the selection rectangle
        const rect = range.getBoundingClientRect();
        
        // Only proceed if we got valid dimensions
        if (rect.width === 0 && rect.height === 0) {
            return;
        }
        
        // Create drag handle
        dragHandle = document.createElement('div');
        dragHandle.className = 'text-drag-handle';
        document.body.appendChild(dragHandle);
        
        // Position the drag handle at the end of the selection
        dragHandle.style.left = rect.right + 'px';
        dragHandle.style.top = rect.bottom + 'px';
        
        // Set up drag handle events
        dragHandle.addEventListener('mousedown', startDragging);
    }

    // Function to start dragging process
    function startDragging(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        // Store the selected text
        draggedText = selection.toString();
        if (!draggedText.trim()) return;
        
        // Get selection details
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Create an element to show while dragging
        draggedTextElement = document.createElement('div');
        draggedTextElement.className = 'dragging-selection';
        
        // Limit displayed text length with ellipsis
        const displayText = draggedText.length > 30 ? 
            draggedText.substring(0, 30) + '...' : 
            draggedText;
        
        draggedTextElement.textContent = displayText;
        
        // Add visual styling to indicate it's being moved
        draggedTextElement.style.opacity = '0.85';
        draggedTextElement.style.transform = 'rotate(1deg)';
        document.body.appendChild(draggedTextElement);
        
        // Store initial positions
        initialMousePosition = { x: event.clientX, y: event.clientY };
        initialSelectionPosition = { x: rect.left, y: rect.top };
        
        // Update dragged text element position
        draggedTextElement.style.left = initialSelectionPosition.x + 'px';
        draggedTextElement.style.top = initialSelectionPosition.y + 'px';
        
        // Highlight the original text to indicate it's being moved
        const originalTextHighlight = document.createElement('span');
        originalTextHighlight.className = 'dragged-source-highlight';
        originalTextHighlight.id = 'dragged-source-highlight';
        
        // Make a copy of the range contents to highlight the original text 
        // (this won't be visible in the document, just for reference)
        try {
            const originalContent = range.cloneContents();
            originalTextHighlight.appendChild(originalContent);
        } catch (e) {
            console.error('Error creating source highlight:', e);
        }
        
        // Mark as dragging
        isDragging = true;
        
        // Add document event listeners for move and up
        document.addEventListener('mousemove', handleDragging);
        document.addEventListener('mouseup', stopDragging);
    }

    // Function to handle the dragging movement
    function handleDragging(event) {
        if (!isDragging || !draggedTextElement) return;
        
        const deltaX = event.clientX - initialMousePosition.x;
        const deltaY = event.clientY - initialMousePosition.y;
        
        // Move the dragged text element
        draggedTextElement.style.left = (initialSelectionPosition.x + deltaX) + 'px';
        draggedTextElement.style.top = (initialSelectionPosition.y + deltaY) + 'px';

        // Find potential drop target
        const targetElement = document.elementFromPoint(event.clientX, event.clientY);
        const editorElement = document.getElementById('editor');
        
        // Remove previous drop indicator if it exists
        removeDropIndicator();
        
        // Only show drop indicator if we're over the editor
        if (editorElement.contains(targetElement)) {
            // Create a temporary range to show where text would be inserted
            const tempRange = document.createRange();
            
            // Determine insertion point based on element type
            if (targetElement.nodeType === Node.TEXT_NODE) {
                // For text nodes, find the closest position
                const offset = calculateOffsetInTextNode(targetElement, event.clientX, event.clientY);
                tempRange.setStart(targetElement, offset);
                tempRange.collapse(true);
            } else if (targetElement.childNodes.length > 0) {
                // For element nodes with children
                const childNode = findClosestChildNode(targetElement, event.clientX, event.clientY);
                if (childNode) {
                    if (childNode.nodeType === Node.TEXT_NODE) {
                        const offset = calculateOffsetInTextNode(childNode, event.clientX, event.clientY);
                        tempRange.setStart(childNode, offset);
                        tempRange.collapse(true);
                    } else {
                        tempRange.setStartBefore(childNode);
                        tempRange.collapse(true);
                    }
                } else {
                    // If no suitable child, append to element
                    tempRange.setStart(targetElement, targetElement.childNodes.length);
                    tempRange.collapse(true);
                }
            } else {
                // For empty elements
                tempRange.setStart(targetElement, 0);
                tempRange.collapse(true);
            }
            
            // Create and position drop indicator
            createDropIndicator(tempRange);
        }
        
        // Remember to prevent text selection during drag
        event.preventDefault();
    }

    // Function to create a visual drop indicator
    function createDropIndicator(range) {
        // Create indicator element
        const indicator = document.createElement('div');
        indicator.className = 'text-drop-indicator';
        document.body.appendChild(indicator);
        
        // Position indicator at the range position
        const rect = range.getBoundingClientRect();
        
        // If we have a valid rect with dimensions
        if (rect && rect.width !== undefined) {
            indicator.style.left = rect.left + 'px';
            indicator.style.top = rect.top + 'px';
            indicator.style.height = rect.height + 'px';
        }
    }

    // Function to remove drop indicator
    function removeDropIndicator() {
        const indicator = document.querySelector('.text-drop-indicator');
        if (indicator) {
            document.body.removeChild(indicator);
        }
    }

    // Function to complete the drag and insert text at new position
    function stopDragging(event) {
        if (!isDragging) return;
        
        // Remove the drop indicator
        removeDropIndicator();
        
        // Remove any source highlight
        const sourceHighlight = document.getElementById('dragged-source-highlight');
        if (sourceHighlight && sourceHighlight.parentNode) {
            sourceHighlight.parentNode.removeChild(sourceHighlight);
        }
        
        // Get the element under the cursor at drop position
        const targetElement = document.elementFromPoint(event.clientX, event.clientY);
        
        // Check if we're still within the editor
        const editorElement = document.getElementById('editor');
        if (editorElement.contains(targetElement)) {
            // Add a visual effect at the drop location
            const dropEffect = document.createElement('div');
            dropEffect.className = 'text-drop-effect';
            dropEffect.style.left = event.clientX + 'px';
            dropEffect.style.top = event.clientY + 'px';
            document.body.appendChild(dropEffect);
            
            // Remove the effect after animation completes
            setTimeout(() => {
                if (dropEffect.parentNode) {
                    dropEffect.parentNode.removeChild(dropEffect);
                }
            }, 500);
            
            // Create a range for the current selection (the text we're moving)
            const selection = window.getSelection();
            const sourceRange = selection.getRangeAt(0).cloneRange();
            
            // Create a new range at the drop position
            const dropRange = document.createRange();
            
            // Set the range based on the drop target
            if (targetElement.nodeType === Node.TEXT_NODE) {
                // For text nodes, find the closest position in the text
                const offset = calculateOffsetInTextNode(targetElement, event.clientX, event.clientY);
                dropRange.setStart(targetElement, offset);
            } else if (targetElement.childNodes.length > 0) {
                // For element nodes with children, try to find the best insertion point
                const childNode = findClosestChildNode(targetElement, event.clientX, event.clientY);
                if (childNode) {
                    if (childNode.nodeType === Node.TEXT_NODE) {
                        const offset = calculateOffsetInTextNode(childNode, event.clientX, event.clientY);
                        dropRange.setStart(childNode, offset);
                    } else {
                        dropRange.setStartBefore(childNode);
                    }
                } else {
                    // If no suitable child found, append to the element
                    dropRange.setStart(targetElement, targetElement.childNodes.length);
                }
            } else {
                // For empty elements, just set to position 0
                dropRange.setStart(targetElement, 0);
            }
            
            // Collapse the range to insertion point
            dropRange.collapse(true);
            
            // Clear current selection and set to drop point
            selection.removeAllRanges();
            selection.addRange(dropRange);
            
            // Store the text we're moving
            const textToMove = draggedText;
            
            // Return to the original selection to delete it
            selection.removeAllRanges();
            selection.addRange(sourceRange);
            
            // Delete the original text
            document.execCommand('delete');
            
            // Now go back to the drop point
            selection.removeAllRanges();
            selection.addRange(dropRange);
            
            // Insert the text at the new position
            document.execCommand('insertText', false, textToMove);
            
            // Save history and update word count
            saveHistory();
            updateWordCount();
            
            // Focus the editor
            editorElement.focus();
        }
        
        // Clean up
        isDragging = false;
        if (draggedTextElement) {
            // Add a fade out animation before removing
            draggedTextElement.style.opacity = '0';
            draggedTextElement.style.transition = 'opacity 0.2s ease';
            
            // Remove after animation completes
            setTimeout(() => {
                if (draggedTextElement && draggedTextElement.parentNode) {
                    document.body.removeChild(draggedTextElement);
                    draggedTextElement = null;
                }
            }, 200);
        }
        removeDragHandle();
        
        // Remove document event listeners
        document.removeEventListener('mousemove', handleDragging);
        document.removeEventListener('mouseup', stopDragging);
    }

    // Helper function to find the closest child node to a position
    function findClosestChildNode(parentElement, x, y) {
        if (!parentElement || !parentElement.childNodes.length) return null;
        
        let closestNode = null;
        let closestDistance = Infinity;
        
        for (let i = 0; i < parentElement.childNodes.length; i++) {
            const node = parentElement.childNodes[i];
            
            // Skip comment nodes
            if (node.nodeType === Node.COMMENT_NODE) continue;
            
            // For text nodes or element nodes that can be measured
            if (node.nodeType === Node.TEXT_NODE || node.getBoundingClientRect) {
                let rect;
                
                try {
                    if (node.nodeType === Node.TEXT_NODE) {
                        // For text nodes, create a temp range
                        const range = document.createRange();
                        range.selectNode(node);
                        rect = range.getBoundingClientRect();
                    } else {
                        // For element nodes
                        rect = node.getBoundingClientRect();
                    }
                    
                    // Calculate distance to the point
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                    
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestNode = node;
                    }
                } catch (e) {
                    console.error('Error measuring node:', e);
                }
            }
        }
        
        return closestNode;
    }

    // Helper function to calculate text node offset based on position
    function calculateOffsetInTextNode(textNode, x, y) {
        const textLength = textNode.length;
        let bestOffset = 0;
        let bestDistance = Infinity;
        
        // Use binary search for efficiency
        let start = 0;
        let end = textLength;
        
        while (end - start > 1) {
            const mid = Math.floor((start + end) / 2);
            
            const range = document.createRange();
            range.setStart(textNode, 0);
            range.setEnd(textNode, mid);
            
            const rect = range.getBoundingClientRect();
            const midX = rect.right;
            const midY = rect.bottom;
            
            const distance = Math.sqrt(Math.pow(x - midX, 2) + Math.pow(y - midY, 2));
            
            if (distance < bestDistance) {
                bestDistance = distance;
                bestOffset = mid;
            }
            
            if (x < midX) {
                end = mid;
            } else {
                start = mid;
            }
        }
        
        return bestOffset;
    }

    // Function to remove the drag handle
    function removeDragHandle() {
        if (dragHandle) {
            dragHandle.removeEventListener('mousedown', startDragging);
            document.body.removeChild(dragHandle);
            dragHandle = null;
        }
    }
}); 