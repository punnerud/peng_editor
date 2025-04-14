document.addEventListener('DOMContentLoaded', function() {
    // Base64 image storage system
    const base64Storage = {
        images: {},
        counter: 0,
        
        // Add a new BASE64 image and get its placeholder
        add: function(base64Data) {
            this.counter++;
            const placeholder = `(big_bunch_of_image_data)_V${this.counter}`;
            this.images[placeholder] = base64Data;
            return placeholder;
        },
        
        // Get BASE64 data from placeholder
        get: function(placeholder) {
            return this.images[placeholder] || placeholder;
        },
        
        // Replace all placeholders with actual BASE64 data
        expandPlaceholders: function(html) {
            let result = html;
            
            // First find all data URLs with placeholders
            const dataUrlRegex = /data:image\/[^;]+;base64,[^"'>}]+/g;
            result = result.replace(dataUrlRegex, (match) => {
                // Extract the placeholder part
                const parts = match.split(',');
                if (parts.length !== 2) return match;
                
                const prefix = parts[0];
                const placeholder = parts[1];
                
                // If we have this placeholder stored, replace it
                if (this.images[placeholder]) {
                    const fullDataUrl = this.images[placeholder];
                    console.log('Expanding placeholder:', placeholder);
                    return fullDataUrl;
                }
                
                return match;
            });
            
            return result;
        },
        
        // Replace all BASE64 data with placeholders
        createPlaceholders: function(html) {
            let result = html;
            const base64Regex = /data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g;
            
            result = result.replace(base64Regex, (match) => {
                // Don't replace if it's already a placeholder
                if (match.includes('(big_bunch_of_image_data)')) {
                    return match;
                }
                
                // Store the full data URL
                const placeholder = this.add(match);
                console.log('Created placeholder:', placeholder);
                
                // Return the data URL prefix with the placeholder
                const prefix = match.split(',')[0];
                return `${prefix},${placeholder}`;
            });
            
            return result;
        }
    };

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
    const printBtn = document.getElementById('print-btn');
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
            '🌄', '🌠', '🎇', '🎆', '🌇', '🌆', '🏙️', '🌃', '🌌', '🌉'
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
    let draggedHtml = ''; // Store formatted HTML content
    let draggedTextElement = null;
    let initialMousePosition = { x: 0, y: 0 };
    let initialSelectionPosition = { x: 0, y: 0 };
    
    // Add after editor state variables
    let activeImage = null;
    let imageToolbar = null;
    
    // Add after editor state variables
    let hideHandlesTimeout = null;
    
    // Add after editor state variables
    let activeImageDragHandler = null;
    
    // Initialize editor
    initEditor();
    
    // Editor initialization
    function initEditor() {
        // Set up the pipette button
        setupPipetteButton();
        
        // Add default styles to editor
        const editorStyles = document.createElement('style');
        editorStyles.textContent = `
            #editor {
                min-height: 500px;
                padding: 10px;
                overflow-y: auto;
                background: white;
            }
            #editor p {
                margin: 0;
                padding: 0;
                min-height: 1.2em;
            }
            #editor p:empty::after {
                content: '\\200B'; /* Zero-width space to maintain height */
            }
        `;
        document.head.appendChild(editorStyles);

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
        
        // Load content from localStorage if available
        const savedContent = localStorage.getItem('editorContent');
        if (savedContent) {
            editor.innerHTML = savedContent;
            // Show notification with Clear All button
            const notification = showNotification('Previous content has been restored', 'info', true);
            
            // Add Clear All button to the notification
            if (notification) {
                const clearBtn = document.createElement('button');
                clearBtn.className = 'notification-action-btn';
                clearBtn.textContent = 'Clear All';
                clearBtn.addEventListener('click', function() {
                    clearAllContent();
                    dismissNotification(notification);
                });
                
                // Add button to notification content
                const notificationContent = notification.querySelector('.notification-content');
                if (notificationContent) {
                    notificationContent.appendChild(clearBtn);
                }
            }
        }
        
        // Setup auto-save to localStorage
        setupAutoSave();
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
        printBtn.addEventListener('click', handlePrint);
        
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
        saveBtn.addEventListener('mouseenter', showFilenameInput);
        saveBtn.addEventListener('mouseover', function() {
            // Reset timer if we're already showing the filename input
            if (document.getElementById('filename-container').style.display === 'inline-flex') {
                resetFilenameTimer();
            }
        });
        saveBtn.addEventListener('mouseleave', function() {
            // Don't hide immediately to allow user to move mouse to the input
            window.filenameHideTimer = setTimeout(function() {
                hideFilenameInput();
            }, 500);
        });
        
        // Add Date button functionality
        const dateBtn = document.getElementById('date-btn');
        if (dateBtn) {
            dateBtn.addEventListener('click', insertDateFormat);
        }
        
        // Add keydown event to document to capture typing when hovering save button
        document.addEventListener('keydown', function(e) {
            // Only process if we're hovering over save button and not already focused in an input
            const filenameContainer = document.getElementById('filename-container');
            const filenameInput = document.getElementById('filename-input');
            
            // Check if save button is being hovered and we're not already in an input field
            const isHoveringSave = saveBtn.matches(':hover');
            const isTypingInInput = document.activeElement.tagName === 'INPUT' || 
                                   document.activeElement.tagName === 'TEXTAREA';
            
            if (isHoveringSave && !isTypingInInput) {
                // If it's a printable character (letters, numbers, symbols)
                if (e.key.length === 1) {
                    // Show filename input if not already visible
                    if (filenameContainer.style.display !== 'inline-flex') {
                        showFilenameInput();
                    }
                    
                    // Replace default filename if it's still the default
                    if (filenameInput.value === 'document') {
                        filenameInput.value = e.key;
                    } else {
                        // Otherwise append to existing filename
                        filenameInput.value += e.key;
                    }
                    
                    // Focus the input to continue typing
                    filenameInput.focus();
                    
                    // Move cursor to end of input
                    const length = filenameInput.value.length;
                    filenameInput.setSelectionRange(length, length);
                    
                    // Prevent default to avoid the keystroke affecting other elements
                    e.preventDefault();
                    
                    // Reset the timer
                    resetFilenameTimer();
                }
                // Handle backspace to delete characters
                else if (e.key === 'Backspace') {
                    // Show filename input if not already visible
                    if (filenameContainer.style.display !== 'inline-flex') {
                        showFilenameInput();
                    }
                    
                    // Delete last character
                    filenameInput.value = filenameInput.value.slice(0, -1);
                    
                    // Focus the input to continue typing
                    filenameInput.focus();
                    
                    // Move cursor to end of input
                    const length = filenameInput.value.length;
                    filenameInput.setSelectionRange(length, length);
                    
                    // Prevent default
                    e.preventDefault();
                    
                    // Reset the timer
                    resetFilenameTimer();
                }
                // Handle Enter key to save
                else if (e.key === 'Enter') {
                    saveContent();
                    e.preventDefault();
                }
            }
        });
        
        // Add events for the filename input
        const filenameContainer = document.getElementById('filename-container');
        const filenameInput = document.getElementById('filename-input');
        
        filenameContainer.addEventListener('mouseenter', function() {
            // Clear the hide timer when mouse enters the container
            if (window.filenameHideTimer) {
                clearTimeout(window.filenameHideTimer);
            }
            // Reset the display timer since user is interacting with it
            resetFilenameTimer();
        });
        
        filenameContainer.addEventListener('mouseleave', function() {
            // Set timer to hide the container when mouse leaves
            window.filenameHideTimer = setTimeout(function() {
                hideFilenameInput();
            }, 500);
        });
        
        // Reset timer when user focuses on or clicks the input
        filenameInput.addEventListener('focus', resetFilenameTimer);
        filenameInput.addEventListener('click', resetFilenameTimer);
        
        // Save on Enter key press in filename input
        filenameInput.addEventListener('keydown', function(e) {
            resetFilenameTimer(); // Reset timer when typing
            if (e.key === 'Enter') {
                saveContent();
            }
        });
        
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
        
        // The selectionchange event is already handled earlier in this function
        // No duplicate listener needed here
        
        // Settings button and save settings
        document.getElementById('settings-btn').addEventListener('click', showSettingsDialog);
        document.getElementById('save-settings-btn').addEventListener('click', saveSettings);
        
        // Add event listener for the settings dialog close button
        const settingsCloseBtn = document.getElementById('settings-dialog').querySelector('.close-dialog');
        if (settingsCloseBtn) {
            settingsCloseBtn.addEventListener('click', function() {
                document.getElementById('settings-dialog').style.display = 'none';
            });
        }
        
        // Load settings from localStorage 
        loadSettings();
        
        // Add image click handler
        editor.addEventListener('click', handleImageClick);
        editor.addEventListener('scroll', updateImageToolbarPosition);
        window.addEventListener('resize', updateImageToolbarPosition);
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
            } else if (command.startsWith('justify') && activeImage) {
                const wrapper = activeImage.closest('.image-wrapper');
                if (wrapper && !wrapper.classList.contains('absolute')) {
                    const alignment = command.replace('justify', '').toLowerCase();
                    wrapper.style.textAlign = alignment;
                    wrapper.style.float = '';
                    wrapper.style.margin = '1em 0';
                    
                    // Update alignment buttons state
                    updateAlignmentButtonsState();
                    saveHistory();
                    return;
                }
            } else {
                // Normal command execution for everything else
                document.execCommand(command, showUI, value);
                console.log(`Executed command: ${command}`, value ? `Value: ${value}` : '');
            }
            
            // Immediately update the toolbar state to reflect changes
            updateToolbarState();
            
            // Save history
            saveHistory();
        } catch (err) {
            console.error(`Error executing command ${command}:`, err);
        }
        
        // Ensure focus is maintained
        editor.focus();
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
            console.log('Switching to rich text view');
            
            // Expand all placeholders back to full BASE64
            const expandedHtml = base64Storage.expandPlaceholders(htmlSource.value);
            editor.innerHTML = expandedHtml;
            editor.style.display = 'block';
            htmlSource.style.display = 'none';
            
            // Remove source view specific classes
            htmlSource.classList.remove('editor-with-line-numbers');
            editor.classList.add('editor-with-line-numbers');
            
            sourceBtn.classList.remove('active');
        } else {
            // Switch to HTML source view
            console.log('Switching to source view');
            
            // Replace BASE64 data with placeholders
            const htmlWithPlaceholders = base64Storage.createPlaceholders(editor.innerHTML);
            htmlSource.value = formatHTML(htmlWithPlaceholders);
            
            // Copy editor dimensions to textarea
            const editorStyle = window.getComputedStyle(editor);
            htmlSource.style.minHeight = editorStyle.minHeight;
            htmlSource.style.height = editorStyle.height;
            htmlSource.style.padding = editorStyle.padding;
            
            // Add source view specific classes
            editor.classList.remove('editor-with-line-numbers');
            htmlSource.classList.add('editor-with-line-numbers');
            
            editor.style.display = 'none';
            htmlSource.style.display = 'block';
            sourceBtn.classList.add('active');
            
            // Ensure textarea adjusts its height
            adjustTextareaHeight();
        }
        
        isSourceView = !isSourceView;
        updateWordCount();
    }

    // Function to adjust textarea height based on content
    function adjustTextareaHeight() {
        const textarea = htmlSource;
        if (!textarea) return;
        
        // Reset height to allow shrinking
        textarea.style.height = 'auto';
        
        // Set new height based on scrollHeight
        textarea.style.height = textarea.scrollHeight + 'px';
        
        // Update line numbers
        updateLineNumbers();
    }

    // Add event listeners for textarea resizing
    htmlSource.addEventListener('input', adjustTextareaHeight);
    htmlSource.addEventListener('change', adjustTextareaHeight);
    
    // Also adjust on window resize
    window.addEventListener('resize', () => {
        if (isSourceView) {
            adjustTextareaHeight();
        }
    });

    // Initial setup for textarea
    const initialStyle = document.createElement('style');
    initialStyle.textContent = `
        #html-source.editor-with-line-numbers {
            width: 100%;
            min-height: 200px;
            padding: 10px 40px 10px 10px;
            line-height: 1.5;
            font-family: monospace;
            white-space: pre-wrap;
            word-wrap: break-word;
            resize: vertical;
            border: none;
            outline: none;
            background: #1e1e1e;
            color: #ffffff;
        }
        
        #html-source.editor-with-line-numbers:focus {
            outline: none;
            box-shadow: none;
        }
        
        .editor-main {
            position: relative;
        }
        
        /* Default light theme for visual editor */
        .line-numbers {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 30px;
            padding: 15px 0 20px 0;
            background: #f5f5f5;
            border-right: 1px solid #ddd;
            user-select: none;
            pointer-events: none;
            color: #333333;
        }

        /* Line number positioning */
        .line-number {
            position: absolute;
            right: 8px;
            text-align: right;
            color: #999;
            font-size: 12px;
            font-family: monospace;
            white-space: nowrap;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            width: 90%;
            transform: translateY(2px); /* Adjust line number position down slightly */
            height: auto !important;
            min-height: 20px;
            padding: 2px 0;
            touch-action: manipulation;
        }

        /* Dark theme line numbers only when in source view */
        .editor-main:has(#html-source.editor-with-line-numbers[style*="display: block"]) .line-numbers {
            background: #252526;
            border-right-color: #333333;
            color: #858585;
        }

        /* Adjust line number color for visual editor */
        .editor-main:has(#editor[style*="display: block"]) .line-number {
            color: #666;
        }
    `;
    document.head.appendChild(initialStyle);
    
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
        
        // Clear any previous values
        imageUrl.value = '';
        imageAlt.value = '';
        imageWidth.value = '';
        imageHeight.value = '';
        document.getElementById('image-file').value = '';
        
        // Add file input change handler
        const imageFileInput = document.getElementById('image-file');
        imageFileInput.addEventListener('change', handleImageFileSelect);
        
        // Show the dialog and focus URL field
        imageDialog.style.display = 'flex';
        imageUrl.focus();
    }

    // Handle file selection for image upload
    function handleImageFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Only accept image files
        if (!file.type.startsWith('image/')) {
            showNotification('Please select an image file', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Data = e.target.result;
            // Store the full data URL in base64Storage
            const placeholder = base64Storage.add(base64Data);
            
            // Store the data URL and placeholder
            imageUrl.dataset.base64 = base64Data;
            imageUrl.dataset.placeholder = placeholder;
            
            // Set a placeholder URL to indicate file is selected
            imageUrl.value = file.name;
            imageUrl.disabled = true;
            
            // Create a test image to verify the data URL works
            const testImg = new Image();
            testImg.onload = function() {
                console.log('Image data URL verified as valid');
            };
            testImg.onerror = function() {
                console.error('Image data URL verification failed');
            };
            testImg.src = base64Data;
            
            console.log('Image loaded and placeholder created');
        };
        
        reader.onerror = function() {
            console.error('Error reading file');
            showNotification('Error reading image file. Please try again.', 'error');
        };
        
        reader.readAsDataURL(file);
    }

    // Insert image
    function insertImage() {
        let url = imageUrl.value.trim();
        const alt = imageAlt.value.trim();
        const width = imageWidth.value.trim();
        const height = imageHeight.value.trim();
        
        // Check if we have a BASE64 image
        if (imageUrl.dataset.base64) {
            // Use the actual data URL for the image
            url = imageUrl.dataset.base64;
        }
        
        console.log(`Image insertion - Alt: ${alt}, Width: ${width}, Height: ${height}`);
        
        if (url) {
            const imgHTML = `<img src="${url}" alt="${alt}"${width ? ` width="${width}"` : ''}${height ? ` height="${height}"` : ''}>`;
            
            if (isSourceView) {
                insertAtCursor(htmlSource, imgHTML);
                console.log('Inserted image in source view');
            } else {
                try {
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
            console.log('No image URL or file provided, image not inserted');
            showNotification('Please provide an image URL or select a file', 'warning');
            return;
        }
        
        // Clear the dialog
        hideAllDialogs();
        imageUrl.value = '';
        imageUrl.disabled = false;
        imageUrl.dataset.base64 = '';
        imageAlt.value = '';
        imageWidth.value = '';
        imageHeight.value = '';
        document.getElementById('image-file').value = '';
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
        let content;
        if (isSourceView) {
            content = base64Storage.expandPlaceholders(htmlSource.value);
        } else {
            content = editor.innerHTML;
        }

        // Create a Blob with the HTML content
        const blob = new Blob([content], {type: 'text/html'});
        
        // Get the filename from the input field
        const filenameInput = document.getElementById('filename-input');
        let filename = filenameInput.value.trim();
        
        // Check if auto-date setting is enabled
        const settings = JSON.parse(localStorage.getItem('editorSettings')) || {};
        if (settings.autoDate) {
            // Add date to filename
            const now = new Date();
            const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD format
            
            // Only add date if not already present
            if (!filename.includes(dateStr)) {
                filename = `${dateStr}_${filename}`;
                filenameInput.value = filename; // Update input field
            }
        }
        
        // Add .html extension if not present
        if (!filename.toLowerCase().endsWith('.html')) {
            filename += '.html';
        }
        
        // Create a link element to download the file
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        
        // Trigger the download
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Clean up the URL object
        URL.revokeObjectURL(a.href);
        
        // Hide the filename input
        hideFilenameInput();
        
        // Also save to localStorage
        localStorage.setItem('editorContent', content);
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
                
                // Save to localStorage
                localStorage.setItem('editorContent', bodyContent);
                
                // Hide the clear all button after loading content
                const clearAllBtn = document.getElementById('clear-all-btn');
                if (clearAllBtn) {
                    clearAllBtn.style.display = 'none';
                }
                
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
    function showNotification(message, type = 'info', persistent = false) {
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
        
        // Set up auto-dismiss timer (if not persistent)
        let dismissTimer;
        if (!persistent) {
            dismissTimer = setTimeout(() => {
                dismissNotification(notification);
            }, 5000);
        }
        
        // Set up manual close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            if (dismissTimer) {
                clearTimeout(dismissTimer);
            }
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
        
        // Store the HTML content to preserve formatting
        const fragment = range.cloneContents();
        const tempDiv = document.createElement('div');
        tempDiv.appendChild(fragment);
        
        // Store the formatted HTML
        draggedHtml = tempDiv.innerHTML;
        
        // Check if we need to wrap the content to preserve parent element formatting
        // For example when the entire selection has the same formatting
        const commonAncestor = range.commonAncestorContainer;
        if (commonAncestor.nodeType === Node.TEXT_NODE) {
            // If the selection is inside a single text node, we need to get the parent's formatting
            const parentElement = commonAncestor.parentNode;
            if (parentElement && parentElement !== editor) {
                // Create a clone of the parent element to capture its style
                const clonedParent = parentElement.cloneNode(false);
                // Add the dragged HTML inside this parent
                clonedParent.innerHTML = draggedHtml;
                // Use this as our dragged HTML to preserve the formatting
                draggedHtml = clonedParent.outerHTML;
            }
        }
        
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
            
            // Check if we're below the last line of content
            const editorRect = editorElement.getBoundingClientRect();
            const allTextNodes = getAllTextNodesIn(editorElement);
            let belowLastLine = false;
            let atEndOfLastLine = false;
            
            if (allTextNodes.length > 0) {
                // Get the last text node
                const lastTextNode = allTextNodes[allTextNodes.length - 1];
                if (lastTextNode) {
                    const lastRange = document.createRange();
                    lastRange.selectNode(lastTextNode);
                    const lastLineRect = lastRange.getBoundingClientRect();
                    
                    // Check if we're below the last line
                    if (event.clientY > lastLineRect.bottom) {
                        belowLastLine = true;
                    }
                    
                    // Check if we're at the end of the last line
                    if (event.clientY >= lastLineRect.top && 
                        event.clientY <= lastLineRect.bottom && 
                        event.clientX > lastLineRect.right - 10) {  // Some margin for detection
                        atEndOfLastLine = true;
                    }
                }
            }
            
            // Handle positioning based on context
            if (belowLastLine) {
                // We're below the last line, set cursor to create a new line
                const lastParagraph = findLastBlock(editorElement);
                if (lastParagraph) {
                    // Position at the end of the last block
                    tempRange.selectNodeContents(lastParagraph);
                    tempRange.collapse(false); // Collapse to end
                    
                    // Store info for later use during actual insertion
                    tempRange.setAttribute = function(name, value) {
                        this[name] = value;
                    };
                    tempRange.setAttribute('addNewLine', true);
                }
            } else if (atEndOfLastLine) {
                // We're at the end of the last line
                const lastTextNode = allTextNodes[allTextNodes.length - 1];
                tempRange.setStart(lastTextNode, lastTextNode.length);
                tempRange.collapse(true);
                
                // Store info for later use
                tempRange.setAttribute = function(name, value) {
                    this[name] = value;
                };
                tempRange.setAttribute('atEndOfLine', true);
            } else {
                // Normal positioning logic
                if (targetElement.nodeType === Node.TEXT_NODE) {
                    // For text nodes, find the closest position
                    const offset = calculateOffsetInTextNode(targetElement, event.clientX, event.clientY);
                    tempRange.setStart(targetElement, offset);
                    tempRange.collapse(true);
                    
                    // Check if we're at the end of a line
                    const textRect = tempRange.getBoundingClientRect();
                    if (Math.abs(textRect.right - event.clientX) < 10) {
                        tempRange.setAttribute = function(name, value) {
                            this[name] = value;
                        };
                        tempRange.setAttribute('atEndOfLine', true);
                    }
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
            
            // For end of line or new line positions, use a special style
            if (range.addNewLine || range.atEndOfLine) {
                indicator.classList.add('text-drop-indicator-special');
            }
        }
    }

    // Function to get all text nodes within an element
    function getAllTextNodesIn(element) {
        const textNodes = [];
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            { acceptNode: function(node) { return NodeFilter.FILTER_ACCEPT; } },
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            if (node.nodeValue.trim() !== '') {
                textNodes.push(node);
            }
        }
        
        return textNodes;
    }

    // Function to find the last block element in the editor
    function findLastBlock(element) {
        // Common block elements in rich text editor
        const blockTags = ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BLOCKQUOTE', 'PRE'];
        let lastBlock = null;
        
        // Find all direct children that are block elements
        const blocks = Array.from(element.querySelectorAll(blockTags.join(',')));
        
        // Get the last one that's a direct child
        if (blocks.length > 0) {
            // Sort by document position to ensure we get the last one
            blocks.sort((a, b) => {
                const position = a.compareDocumentPosition(b);
                return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
            });
            
            lastBlock = blocks[blocks.length - 1];
        }
        
        // If no blocks found, use the editor itself
        return lastBlock || element;
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
            
            // Check for special positioning cases
            const allTextNodes = getAllTextNodesIn(editorElement);
            let belowLastLine = false;
            let atEndOfLine = false;
            let needsSpace = false;
            
            // Check if we're below the last line of content
            if (allTextNodes.length > 0) {
                // Get the last text node
                const lastTextNode = allTextNodes[allTextNodes.length - 1];
                if (lastTextNode) {
                    const lastRange = document.createRange();
                    lastRange.selectNode(lastTextNode);
                    const lastLineRect = lastRange.getBoundingClientRect();
                    
                    // Below the last line
                    if (event.clientY > lastLineRect.bottom) {
                        belowLastLine = true;
                        
                        // Find the last block element
                        const lastBlock = findLastBlock(editorElement);
                        
                        // Set drop range to the end of the last block
                        if (lastBlock) {
                            dropRange.selectNodeContents(lastBlock);
                            dropRange.collapse(false);
                        }
                    }
                    // At the end of the last line
                    else if (event.clientY >= lastLineRect.top && 
                             event.clientY <= lastLineRect.bottom && 
                             event.clientX > lastLineRect.right - 10) {
                        atEndOfLine = true;
                        dropRange.setStart(lastTextNode, lastTextNode.length);
                        dropRange.collapse(true);
                        
                        // Check if we need to add a space
                        if (lastTextNode.nodeValue.length > 0 && 
                            lastTextNode.nodeValue[lastTextNode.length - 1] !== ' ' && 
                            draggedText.charAt(0) !== ' ') {
                            needsSpace = true;
                        }
                    }
                }
            }
            
            // If not at a special position, use standard logic
            if (!belowLastLine && !atEndOfLine) {
                // Set the range based on the drop target
                if (targetElement.nodeType === Node.TEXT_NODE) {
                    // For text nodes, find the closest position
                    const offset = calculateOffsetInTextNode(targetElement, event.clientX, event.clientY);
                    dropRange.setStart(targetElement, offset);
                    
                    // Check if we're at the end of a line
                    const tempRange = document.createRange();
                    tempRange.setStart(targetElement, offset);
                    tempRange.collapse(true);
                    const rect = tempRange.getBoundingClientRect();
                    
                    if (Math.abs(rect.right - event.clientX) < 10 && 
                        offset === targetElement.length) {
                        atEndOfLine = true;
                        
                        // Check if we need to add a space
                        if (targetElement.nodeValue.length > 0 && 
                            targetElement.nodeValue[offset - 1] !== ' ' && 
                            draggedText.charAt(0) !== ' ') {
                            needsSpace = true;
                        }
                    }
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
            }
            
            // Collapse the range to insertion point
            dropRange.collapse(true);
            
            // Clear current selection and set to drop point
            selection.removeAllRanges();
            selection.addRange(dropRange);
            
            // Determine if we should use HTML or plain text insertion
            let useHtmlInsertion = true;
            
            // Plain text is better in some cases: new line and when adding spaces
            if (belowLastLine || needsSpace) {
                useHtmlInsertion = false;
            }
            
            // Prepare text with any necessary adjustments
            let textToMove = useHtmlInsertion ? draggedHtml : draggedText;
            
            // If we need to add a space
            if (needsSpace) {
                textToMove = ' ' + textToMove;
            }
            
            // If below the last line, add a newline first
            if (belowLastLine) {
                textToMove = '\n' + textToMove;
            }
            
            // Determine if we should add space or newline
            let needToAddSpace = needsSpace;
            let needToAddNewline = belowLastLine;
            
            // Return to the original selection to delete it
            selection.removeAllRanges();
            selection.addRange(sourceRange);
            
            // Delete the original text
            document.execCommand('delete');
            
            // Now go back to the drop point
            selection.removeAllRanges();
            selection.addRange(dropRange);
            
            // Insert space if needed
            if (needToAddSpace) {
                document.execCommand('insertText', false, ' ');
            }
            
            // Insert newline if needed
            if (needToAddNewline) {
                document.execCommand('insertText', false, '\n');
            }
            
            // Always insert with formatting preserved
            document.execCommand('insertHTML', false, draggedHtml);
            
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

    // Show the filename input when hovering over Save button
    function showFilenameInput() {
        // Get the filename container and input
        const filenameContainer = document.getElementById('filename-container');
        const filenameInput = document.getElementById('filename-input');
        
        // Clear any existing timeout
        if (window.filenameHideTimer) {
            clearTimeout(window.filenameHideTimer);
        }
        
        // Set a default filename if empty
        if (!filenameInput.value) {
            filenameInput.value = 'document';
        }
        
        // Show the container
        filenameContainer.style.display = 'inline-flex';
        filenameContainer.style.opacity = '1';
        
        // Set a timeout to hide the container after 5 seconds
        resetFilenameTimer();
    }

    // Reset the timer for the filename input
    function resetFilenameTimer() {
        // Clear any existing timeout
        if (window.filenameDisplayTimer) {
            clearTimeout(window.filenameDisplayTimer);
        }
        
        // Set a new timeout
        window.filenameDisplayTimer = setTimeout(function() {
            hideFilenameInput();
        }, 5000);
    }

    // Hide the filename input
    function hideFilenameInput() {
        const filenameContainer = document.getElementById('filename-container');
        
        // Don't hide if the input is focused - user is still interacting with it
        const filenameInput = document.getElementById('filename-input');
        if (document.activeElement === filenameInput) {
            resetFilenameTimer();
            return;
        }
        
        // Add fade out animation
        filenameContainer.style.animation = 'fadeOutFilename 0.5s forwards';
        
        // Hide after animation completes
        setTimeout(function() {
            filenameContainer.style.display = 'none';
            filenameContainer.style.animation = '';
        }, 500);
    }

    // Function to insert date format: YYYYMMDD_Filename_HHMMSS
    function insertDateFormat() {
        const filenameInput = document.getElementById('filename-input');
        const originalFilename = filenameInput.value.trim();
        
        // Get current date and time
        const now = new Date();
        
        // Format date as YYYYMMDD
        const datePrefix = now.getFullYear() +
                         String(now.getMonth() + 1).padStart(2, '0') +
                         String(now.getDate()).padStart(2, '0');
        
        // Format time as HHMMSS
        const timeSuffix = String(now.getHours()).padStart(2, '0') +
                          String(now.getMinutes()).padStart(2, '0') +
                          String(now.getSeconds()).padStart(2, '0');
        
        // Combine in the requested format: YYYYMMDD_Filename_HHMMSS
        const newFilename = `${datePrefix}_${originalFilename}_${timeSuffix}`;
        
        // Update the input value
        filenameInput.value = newFilename;
        
        // Focus the input and move cursor to end
        filenameInput.focus();
        const length = filenameInput.value.length;
        filenameInput.setSelectionRange(length, length);
        
        // Reset timer
        resetFilenameTimer();
    }

    // Function to setup auto-save
    function setupAutoSave() {
        // Auto-save content to localStorage when changes are made
        const saveToLocalStorage = () => {
            const content = isSourceView ? htmlSource.value : editor.innerHTML;
            localStorage.setItem('editorContent', content);
        };
        
        // Save content when user types or makes changes
        editor.addEventListener('input', saveToLocalStorage);
        htmlSource.addEventListener('input', saveToLocalStorage);
        
        // Also save on important editing actions
        editor.addEventListener('paste', saveToLocalStorage);
        editor.addEventListener('cut', saveToLocalStorage);
        
        // Save before user leaves/refreshes the page
        window.addEventListener('beforeunload', saveToLocalStorage);
    }

    // Function to clear all content with confirmation
    function clearAllContent() {
        if (confirm('Are you sure you want to clear all content? This cannot be undone.')) {
            // Clear editor content
            editor.innerHTML = '<p>Start typing your content here...</p>';
            htmlSource.value = '<p>Start typing your content here...</p>';
            
            // Clear localStorage
            localStorage.removeItem('editorContent');
            
            // Reset history
            editorHistory = [editor.innerHTML];
            historyIndex = 0;
            
            // Update UI
            updateWordCount();
            updateUndoRedoButtons();
            
            showNotification('All content has been cleared', 'success');
        }
    }

    // Load settings from localStorage
    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('editorSettings')) || {
            autoDate: false,
            showWords: true,
            showChars: true,
            showLineNumbers: false,
            pageWidth: 'a4' // Default to A4
        };
        
        // Apply settings to UI
        document.getElementById('setting-auto-date').checked = settings.autoDate;
        document.getElementById('setting-show-words').checked = settings.showWords;
        document.getElementById('setting-show-chars').checked = settings.showChars;
        document.getElementById('setting-show-line-numbers').checked = settings.showLineNumbers;
        document.getElementById('setting-page-width').value = settings.pageWidth;
        
        // Apply settings to editor
        applySettings(settings);
    }

    // Apply settings to the editor
    function applySettings(settings) {
        // Show/hide word count
        const wordCountElement = document.querySelector('.word-count');
        wordCountElement.style.display = settings.showWords ? 'block' : 'none';
        
        // Show/hide character count
        const charCountElement = document.querySelector('.char-count');
        charCountElement.style.display = settings.showChars ? 'flex' : 'none';
        
        // Show/hide line numbers
        toggleLineNumbers(settings.showLineNumbers);

        // Apply page width
        const editor = document.getElementById('editor');
        if (editor) {
            if (settings.pageWidth === 'none') {
                editor.classList.add('no-width-limit');
                editor.style.maxWidth = 'none';
            } else {
                editor.classList.remove('no-width-limit');
                editor.style.maxWidth = '210mm'; // Use A4 width for both A4 and Letter
            }
        }
    }

    // Save settings to localStorage
    function saveSettings() {
        const settings = {
            autoDate: document.getElementById('setting-auto-date').checked,
            showWords: document.getElementById('setting-show-words').checked,
            showChars: document.getElementById('setting-show-chars').checked,
            showLineNumbers: document.getElementById('setting-show-line-numbers').checked,
            pageWidth: document.getElementById('setting-page-width').value
        };
        
        // Save to localStorage
        localStorage.setItem('editorSettings', JSON.stringify(settings));
        
        // Apply settings
        applySettings(settings);
        
        // Close dialog
        document.getElementById('settings-dialog').style.display = 'none';
        
        // Show confirmation
        showNotification('Settings saved successfully', 'success');
    }

    // Show settings dialog
    function showSettingsDialog() {
        document.getElementById('settings-dialog').style.display = 'flex';
    }

    // Toggle line numbers display
    function toggleLineNumbers(show) {
        // Remove existing line numbers if any
        const existingLineNumbers = document.querySelector('.line-numbers');
        if (existingLineNumbers) {
            existingLineNumbers.remove();
        }
        
        // Toggle editor class
        editor.classList.toggle('editor-with-line-numbers', show);
        
        if (show) {
            // Create line numbers container
            const lineNumbersContainer = document.createElement('div');
            lineNumbersContainer.className = 'line-numbers';
            editor.parentElement.appendChild(lineNumbersContainer);
            
            // Create hidden mirror textarea to help with line number positioning
            const mirrorTextArea = document.createElement('div');
            mirrorTextArea.className = 'mirror-textarea';
            editor.parentElement.appendChild(mirrorTextArea);
            
            // Update line numbers
            updateLineNumbers();
            
            // Add mutation observer to update line numbers when content changes
            if (!window.lineNumbersObserver) {
                window.lineNumbersObserver = new MutationObserver(updateLineNumbers);
                window.lineNumbersObserver.observe(editor, { 
                    childList: true, 
                    subtree: true, 
                    characterData: true 
                });
            }
            
            // Add scroll sync between editor and line numbers
            editor.addEventListener('scroll', syncScroll);
        } else {
            // Disconnect observer if exists
            if (window.lineNumbersObserver) {
                window.lineNumbersObserver.disconnect();
                window.lineNumbersObserver = null;
            }
            
            // Remove mirror textarea if exists
            const mirrorTextArea = document.querySelector('.mirror-textarea');
            if (mirrorTextArea) {
                mirrorTextArea.remove();
            }
            
            // Remove scroll event listener
            editor.removeEventListener('scroll', syncScroll);
        }
    }

    // Sync scroll between editor and line numbers
    function syncScroll() {
        const lineNumbers = document.querySelector('.line-numbers');
        if (lineNumbers) {
            lineNumbers.scrollTop = editor.scrollTop;
        }
    }

    // Update line numbers display
    function updateLineNumbers() {
        const lineNumbersContainer = document.querySelector('.line-numbers');
        const mirrorTextArea = document.querySelector('.mirror-textarea');
        if (!lineNumbersContainer || !mirrorTextArea) return;
        
        // Get content and compute lines
        const content = editor.innerHTML;
        
        // Update mirror textarea with the same content but invisible
        mirrorTextArea.innerHTML = content.replace(/<br>/g, '\n<br>');
        
        // Count actual displayed lines by getting spans from mirror
        const textRects = getAllTextLineRects();
        const lineCount = textRects.length;
        
        // Generate line numbers HTML
        let lineNumbersHTML = '';
        for (let i = 1; i <= lineCount; i++) {
            lineNumbersHTML += `<div class="line-number">${i}</div>`;
        }
        
        lineNumbersContainer.innerHTML = lineNumbersHTML;
        
        // Align line numbers with the text content
        alignLineNumbers(textRects);
    }

    // Get all text line rectangles from the editor
    function getAllTextLineRects() {
        const textRects = [];
        const range = document.createRange();
        const textNodes = getAllTextNodesIn(editor);
        
        // Extract text nodes and compute their line positions
        textNodes.forEach(node => {
            const text = node.textContent;
            if (!text.trim()) return;
            
            // Process each line in the text node
            const lines = text.split('\n');
            for (let i = 0; i < lines.length; i++) {
                if (!lines[i].trim()) continue;
                
                try {
                    // Set range to this line
                    if (i === 0) {
                        range.setStart(node, 0);
                        range.setEnd(node, Math.min(lines[i].length, node.length));
                    } else {
                        // For other lines, we need to calculate position
                        const prevLinesLength = lines.slice(0, i).join('\n').length + i; // +i for the \n chars
                        range.setStart(node, prevLinesLength);
                        range.setEnd(node, prevLinesLength + lines[i].length);
                    }
                    
                    // Get rectangle for this range
                    const rect = range.getBoundingClientRect();
                    if (rect.height > 0) {
                        textRects.push({ 
                            top: rect.top,
                            height: rect.height
                        });
                    }
                } catch (e) {
                    console.error('Error computing text rectangle:', e);
                }
            }
        });
        
        // Add rectangles for block elements that might not have text
        const blockElements = editor.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, pre, blockquote');
        blockElements.forEach(element => {
            if (!element.textContent.trim()) { // Empty block element
                const rect = element.getBoundingClientRect();
                if (rect.height > 0) {
                    textRects.push({
                        top: rect.top,
                        height: rect.height
                    });
                }
            }
        });
        
        // Sort by top position
        textRects.sort((a, b) => a.top - b.top);
        
        // Deduplicate lines that are very close to each other (within 5px)
        const deduplicatedRects = [];
        for (let i = 0; i < textRects.length; i++) {
            if (i === 0 || Math.abs(textRects[i].top - textRects[i-1].top) > 5) {
                deduplicatedRects.push(textRects[i]);
            }
        }
        
        return deduplicatedRects;
    }

    // Align line number divs with the text content
    function alignLineNumbers(textRects) {
        const lineNumbers = document.querySelectorAll('.line-number');
        const editorRect = editor.getBoundingClientRect();
        
        lineNumbers.forEach((lineNumber, index) => {
            if (index < textRects.length) {
                const rect = textRects[index];
                const relativeTop = rect.top - editorRect.top;
                
                // Set position with a slight offset for better alignment
                lineNumber.style.top = `${relativeTop - 3}px`;
                
                // Set minimum height for touch targets, but don't enforce strict height matching
                const minHeight = Math.max(20, rect.height);
                lineNumber.style.minHeight = `${minHeight}px`;
                
                // Use padding for additional clickable area
                lineNumber.style.padding = '3px 0';
            }
        });
    }

    // Handle image click
    function handleImageClick(e) {
        const clickedImage = e.target.closest('img');
        
        // Remove active state from previous image
        if (activeImage && activeImage !== clickedImage) {
            const prevWrapper = activeImage.closest('.image-wrapper');
            if (prevWrapper) {
                const prevHandles = prevWrapper.querySelector('.resize-handles-container');
                if (prevHandles) prevHandles.remove();
            }
            const prevToolbar = document.querySelector('.toolbar-group.image-editing');
            if (prevToolbar) prevToolbar.remove();
        }
        
        // If clicking outside an image
        if (!clickedImage) {
            const toolbar = document.querySelector('.toolbar-group.image-editing');
            if (toolbar) toolbar.remove();
            const handles = document.querySelectorAll('.resize-handles-container');
            handles.forEach(h => h.remove());
            activeImage = null;
            
            // Reset alignment button handlers to default
            justifyLeftBtn.onclick = () => execCommand('justifyLeft');
            justifyCenterBtn.onclick = () => execCommand('justifyCenter');
            justifyRightBtn.onclick = () => execCommand('justifyRight');
            justifyFullBtn.onclick = () => execCommand('justifyFull');
            return;
        }
        
        // If clicking the same image, keep toolbar and handles
        if (clickedImage === activeImage) {
            showHandles(); // Make sure handles are visible
            return;
        }
        
        // Set active image and create toolbar
        activeImage = clickedImage;
        createImageToolbar();
        showHandles(); // Show handles immediately when clicking image
        
        // Override alignment button handlers for image alignment
        justifyLeftBtn.onclick = () => alignImage('left');
        justifyCenterBtn.onclick = () => alignImage('center');
        justifyRightBtn.onclick = () => alignImage('right');
        justifyFullBtn.onclick = () => alignImage('left'); // Default to left for justify full
        
        // Update alignment buttons state based on current image alignment
        updateAlignmentButtonsState();
    }

    // Create image toolbar
    function createImageToolbar() {
        if (!activeImage) return;
        
        // Remove any existing image-specific toolbar buttons
        const existingGroup = document.querySelector('.toolbar-group.image-editing');
        if (existingGroup) {
            existingGroup.remove();
        }
        
        // Create a new toolbar group for image editing
        const toolbarGroup = document.createElement('div');
        toolbarGroup.className = 'toolbar-group image-editing active';
        toolbarGroup.style.backgroundColor = '#d0e1ff'; // Darker blue background
        toolbarGroup.style.padding = '4px 8px';
        toolbarGroup.style.borderRadius = '4px';
        toolbarGroup.style.margin = '0 4px';
        toolbarGroup.style.border = '1px solid #a8c6ff'; // Darker blue border
        
        // Add toolbar buttons
        const buttons = [
            { icon: 'fa-arrows-alt', title: 'Resize', action: startImageResize },
            { icon: 'fa-crop', title: 'Crop', action: startImageCrop },
            { icon: 'fa-object-group', title: 'Adjust Size', action: showSizeDialog },
            { 
                icon: 'fa-expand', 
                title: 'Float Freely', 
                action: toggleFloating,
                id: 'float-btn'
            },
            { icon: 'fa-trash', title: 'Delete', action: deleteImage }
        ];
        
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.className = 'toolbar-btn';
            if (btn.id) button.id = btn.id;
            button.innerHTML = `<i class="fas ${btn.icon}"></i>`;
            button.title = btn.title;
            button.addEventListener('click', btn.action);
            
            // If it's the float button, check if image is currently floating
            if (btn.id === 'float-btn' && activeImage.closest('.image-wrapper.absolute')) {
                button.classList.add('active');
            }
            
            toolbarGroup.appendChild(button);
        });
        
        // Add the toolbar group after the first group
        const toolbar = document.querySelector('.toolbar');
        const firstGroup = toolbar.querySelector('.toolbar-group');
        firstGroup.parentNode.insertBefore(toolbarGroup, firstGroup.nextSibling);
        
        // Add resize handles directly to the image
        addResizeHandlesToImage();
        
        // Update the state of alignment buttons based on current image alignment
        updateAlignmentButtonsState();
    }

    // Add new function to add resize handles to image
    function addResizeHandlesToImage() {
        if (!activeImage) return;
        
        // Remove any existing handles
        const existingHandles = document.querySelectorAll('.resize-handles-container');
        existingHandles.forEach(handle => handle.remove());
        
        // Create container for handles
        const handleContainer = document.createElement('div');
        handleContainer.className = 'resize-handles-container';
        handleContainer.style.position = 'absolute';
        handleContainer.style.top = '0';
        handleContainer.style.left = '0';
        handleContainer.style.width = '100%';
        handleContainer.style.height = '100%';
        handleContainer.style.pointerEvents = 'none'; // Allow clicks to pass through container
        
        // Add resize handles
        const handles = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];
        handles.forEach(pos => {
            const handle = document.createElement('div');
            handle.className = `resize-handle ${pos}`;
            handle.dataset.handle = pos;
            handle.style.display = 'block';
            handle.style.opacity = '1';
            handle.style.position = 'absolute';
            handle.style.width = '10px';
            handle.style.height = '10px';
            handle.style.backgroundColor = '#fff';
            handle.style.border = '1px solid #0066cc';
            handle.style.pointerEvents = 'auto'; // Make handles clickable
            
            // Position handles
            switch(pos) {
                case 'nw':
                    handle.style.top = '-5px';
                    handle.style.left = '-5px';
                    handle.style.cursor = 'nw-resize';
                    break;
                case 'n':
                    handle.style.top = '-5px';
                    handle.style.left = '50%';
                    handle.style.transform = 'translateX(-50%)';
                    handle.style.cursor = 'n-resize';
                    break;
                case 'ne':
                    handle.style.top = '-5px';
                    handle.style.right = '-5px';
                    handle.style.cursor = 'ne-resize';
                    break;
                case 'w':
                    handle.style.top = '50%';
                    handle.style.left = '-5px';
                    handle.style.transform = 'translateY(-50%)';
                    handle.style.cursor = 'w-resize';
                    break;
                case 'e':
                    handle.style.top = '50%';
                    handle.style.right = '-5px';
                    handle.style.transform = 'translateY(-50%)';
                    handle.style.cursor = 'e-resize';
                    break;
                case 'sw':
                    handle.style.bottom = '-5px';
                    handle.style.left = '-5px';
                    handle.style.cursor = 'sw-resize';
                    break;
                case 's':
                    handle.style.bottom = '-5px';
                    handle.style.left = '50%';
                    handle.style.transform = 'translateX(-50%)';
                    handle.style.cursor = 's-resize';
                    break;
                case 'se':
                    handle.style.bottom = '-5px';
                    handle.style.right = '-5px';
                    handle.style.cursor = 'se-resize';
                    break;
            }
            
            handleContainer.appendChild(handle);
        });
        
        // Create a wrapper for the image if it doesn't exist
        let wrapper = activeImage.closest('.image-wrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'image-wrapper';
            wrapper.style.position = 'relative';
            wrapper.style.display = 'inline-block';
            activeImage.parentNode.insertBefore(wrapper, activeImage);
            wrapper.appendChild(activeImage);
        }
        
        // Ensure wrapper has correct positioning
        if (window.getComputedStyle(wrapper).position === 'static') {
            wrapper.style.position = 'relative';
        }
        
        wrapper.appendChild(handleContainer);
        
        // Add hover events to wrapper
        wrapper.addEventListener('mouseenter', showHandles);
        wrapper.addEventListener('mouseleave', hideHandlesWithDelay);
        
        setupResizeHandles(handleContainer);
    }

    // Update toolbar position
    function updateImageToolbarPosition() {
        if (!imageToolbar || !activeImage) return;
        
        const rect = activeImage.getBoundingClientRect();
        const editorRect = editor.getBoundingClientRect();
        
        // Position toolbar above image
        imageToolbar.style.top = `${rect.top - editorRect.top - 40}px`;
        imageToolbar.style.left = `${rect.left - editorRect.left}px`;
        imageToolbar.style.width = `${rect.width}px`;
        
        // Position resize handles
        const handles = imageToolbar.querySelectorAll('.resize-handle');
        handles.forEach(handle => {
            const pos = handle.dataset.handle;
            switch(pos) {
                case 'nw': handle.style.top = '-5px'; handle.style.left = '-5px'; break;
                case 'n': handle.style.top = '-5px'; handle.style.left = '50%'; break;
                case 'ne': handle.style.top = '-5px'; handle.style.right = '-5px'; break;
                case 'w': handle.style.top = '50%'; handle.style.left = '-5px'; break;
                case 'e': handle.style.top = '50%'; handle.style.right = '-5px'; break;
                case 'sw': handle.style.bottom = '-5px'; handle.style.left = '-5px'; break;
                case 's': handle.style.bottom = '-5px'; handle.style.left = '50%'; break;
                case 'se': handle.style.bottom = '-5px'; handle.style.right = '-5px'; break;
            }
        });
    }

    // Remove image toolbar
    function removeImageToolbar() {
        if (imageToolbar) {
            imageToolbar.remove();
            imageToolbar = null;
        }
    }

    // Image actions
    function startImageResize(e) {
        e.stopPropagation();
        const wrapper = activeImage.closest('.image-wrapper');
        if (wrapper) {
            const handles = wrapper.querySelectorAll('.resize-handle');
            handles.forEach(handle => {
                handle.style.display = 'block';
                handle.style.opacity = '1';
            });

            // Clear any existing timeout
            if (hideHandlesTimeout) {
                clearTimeout(hideHandlesTimeout);
            }

            // Set a longer timeout when clicking the resize button
            hideHandlesTimeout = setTimeout(() => {
                handles.forEach(handle => {
                    handle.style.opacity = '0';
                    setTimeout(() => {
                        if (handle.style.opacity === '0') {
                            handle.style.display = 'none';
                        }
                    }, 200);
                });
                hideHandlesTimeout = null;
            }, 5000); // 5 seconds timeout
        }
    }

    // Replace the setupResizeHandles function with this updated version
    function setupResizeHandles(handleContainer) {
        if (!handleContainer) return;
        
        let isResizing = false;
        let startX, startY, startWidth, startHeight;
        let activeHandle = null;
        
        const handles = handleContainer.querySelectorAll('.resize-handle');
        handles.forEach(handle => {
            handle.addEventListener('mousedown', (e) => startResize(e, handle));
        });
        
        function startResize(e, handle) {
            if (!activeImage) return;
            
            // Clear any hide timeout when starting resize
            if (hideHandlesTimeout) {
                clearTimeout(hideHandlesTimeout);
                hideHandlesTimeout = null;
            }
            
            isResizing = true;
            activeHandle = handle;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = activeImage.offsetWidth;
            startHeight = activeImage.offsetHeight;
            
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
            e.preventDefault();
        }
        
        function resize(e) {
            if (!isResizing || !activeImage || !activeHandle) return;
            
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            const handlePos = activeHandle.dataset.handle;
            const aspectRatio = startWidth / startHeight;
            
            let newWidth = startWidth;
            let newHeight = startHeight;
            
            // Calculate initial dimensions based on handle position
            if (handlePos.includes('e')) newWidth = startWidth + dx;
            if (handlePos.includes('w')) newWidth = startWidth - dx;
            if (handlePos.includes('s')) newHeight = startHeight + dy;
            if (handlePos.includes('n')) newHeight = startHeight - dy;
            
            // By default maintain aspect ratio, unless Shift is held
            if (!e.shiftKey) {
                // If it's a corner handle, use the larger change to determine the size
                if (handlePos.includes('n') || handlePos.includes('s')) {
                    // Vertical handles prioritize height change
                    newWidth = newHeight * aspectRatio;
                } else {
                    // Horizontal handles prioritize width change
                    newHeight = newWidth / aspectRatio;
                }
            }
            
            // Apply minimum size constraints
            newWidth = Math.max(50, newWidth);
            newHeight = Math.max(50, newHeight);
            
            activeImage.style.width = `${newWidth}px`;
            activeImage.style.height = `${newHeight}px`;
        }
        
        function stopResize() {
            if (isResizing) {
                isResizing = false;
                activeHandle = null;
                document.removeEventListener('mousemove', resize);
                document.removeEventListener('mouseup', stopResize);
                saveHistory();
            }
        }
    }

    function startImageCrop(e) {
        e.stopPropagation();
        if (!activeImage) return;

        // Store reference to the image being cropped
        const imageBeingCropped = activeImage;

        // Get image dimensions and position
        const wrapper = imageBeingCropped.closest('.image-wrapper');
        if (!wrapper) return;

        const imageRect = imageBeingCropped.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();

        // Create crop overlay
        const overlay = document.createElement('div');
        overlay.className = 'crop-overlay';
        overlay.style.display = 'block';
        
        // Position overlay relative to the actual image position
        overlay.style.position = 'absolute';
        overlay.style.left = (imageRect.left - wrapperRect.left) + 'px';
        overlay.style.top = (imageRect.top - wrapperRect.top) + 'px';
        overlay.style.width = imageRect.width + 'px';
        overlay.style.height = imageRect.height + 'px';

        // Create crop area
        const cropArea = document.createElement('div');
        cropArea.className = 'crop-area';

        // Set initial crop area size (75% of image size)
        const initialWidth = imageRect.width * 0.75;
        const initialHeight = imageRect.height * 0.75;
        const initialLeft = (imageRect.width - initialWidth) / 2;
        const initialTop = (imageRect.height - initialHeight) / 2;

        cropArea.style.width = initialWidth + 'px';
        cropArea.style.height = initialHeight + 'px';
        cropArea.style.left = initialLeft + 'px';
        cropArea.style.top = initialTop + 'px';

        // Add crop handles
        const handles = ['nw', 'ne', 'sw', 'se'];
        handles.forEach(pos => {
            const handle = document.createElement('div');
            handle.className = `crop-handle ${pos}`;
            cropArea.appendChild(handle);
        });

        // Add crop controls
        const controls = document.createElement('div');
        controls.className = 'crop-controls';
        controls.innerHTML = `
            <button class="apply-crop">Apply Crop</button>
            <button class="cancel-crop">Cancel</button>
        `;

        // Add elements to DOM
        overlay.appendChild(cropArea);
        wrapper.appendChild(overlay);
        wrapper.appendChild(controls);

        // Variables for drag state
        let isDragging = false;
        let isResizing = false;
        let activeHandle = null;
        let startX, startY, startWidth, startHeight, startLeft, startTop;

        // Handle crop area dragging
        cropArea.addEventListener('mousedown', startDrag);
        
        // Handle crop area resizing
        cropArea.querySelectorAll('.crop-handle').forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                isResizing = true;
                activeHandle = handle;
                startX = e.clientX;
                startY = e.clientY;
                startWidth = cropArea.offsetWidth;
                startHeight = cropArea.offsetHeight;
                startLeft = cropArea.offsetLeft;
                startTop = cropArea.offsetTop;
            });
        });

        function startDrag(e) {
            if (e.target !== cropArea) return;
            isDragging = true;
            startX = e.clientX - cropArea.offsetLeft;
            startY = e.clientY - cropArea.offsetTop;
        }

        function handleDrag(e) {
            if (!isDragging && !isResizing) return;

            if (isDragging) {
                let newLeft = e.clientX - startX;
                let newTop = e.clientY - startY;

                // Constrain to image boundaries
                newLeft = Math.max(0, Math.min(newLeft, imageRect.width - cropArea.offsetWidth));
                newTop = Math.max(0, Math.min(newTop, imageRect.height - cropArea.offsetHeight));

                cropArea.style.left = newLeft + 'px';
                cropArea.style.top = newTop + 'px';
            }

            if (isResizing) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                if (activeHandle.classList.contains('se')) {
                    const newWidth = Math.min(startWidth + dx, imageRect.width - startLeft);
                    const newHeight = Math.min(startHeight + dy, imageRect.height - startTop);
                    cropArea.style.width = Math.max(50, newWidth) + 'px';
                    cropArea.style.height = Math.max(50, newHeight) + 'px';
                } else if (activeHandle.classList.contains('sw')) {
                    const newWidth = Math.min(startWidth - dx, startLeft + startWidth);
                    const newHeight = Math.min(startHeight + dy, imageRect.height - startTop);
                    const newLeft = Math.max(0, startLeft + dx);
                    cropArea.style.width = Math.max(50, newWidth) + 'px';
                    cropArea.style.height = Math.max(50, newHeight) + 'px';
                    cropArea.style.left = newLeft + 'px';
                } else if (activeHandle.classList.contains('ne')) {
                    const newWidth = Math.min(startWidth + dx, imageRect.width - startLeft);
                    const newHeight = Math.min(startHeight - dy, startTop + startHeight);
                    const newTop = Math.max(0, startTop + dy);
                    cropArea.style.width = Math.max(50, newWidth) + 'px';
                    cropArea.style.height = Math.max(50, newHeight) + 'px';
                    cropArea.style.top = newTop + 'px';
                } else if (activeHandle.classList.contains('nw')) {
                    const newWidth = Math.min(startWidth - dx, startLeft + startWidth);
                    const newHeight = Math.min(startHeight - dy, startTop + startHeight);
                    const newLeft = Math.max(0, startLeft + dx);
                    const newTop = Math.max(0, startTop + dy);
                    cropArea.style.width = Math.max(50, newWidth) + 'px';
                    cropArea.style.height = Math.max(50, newHeight) + 'px';
                    cropArea.style.left = newLeft + 'px';
                    cropArea.style.top = newTop + 'px';
                }
            }
        }

        function stopDrag() {
            isDragging = false;
            isResizing = false;
            activeHandle = null;
        }

        // Add document-level event listeners
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', stopDrag);

        // Create a function that captures all necessary variables
        const handleApplyCrop = () => {
            applyCrop(wrapper, cropArea, imageRect, imageBeingCropped);
        };

        // Handle crop controls
        controls.querySelector('.apply-crop').addEventListener('click', handleApplyCrop);

        controls.querySelector('.cancel-crop').addEventListener('click', () => {
            cleanup();
        });

        function cleanup() {
            overlay.remove();
            controls.remove();
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', stopDrag);
        }
    }

    function applyCrop(wrapper, cropArea, imageRect, imageBeingCropped) {
        if (!imageBeingCropped) {
            console.error('No image to crop');
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calculate crop dimensions
        const scale = imageBeingCropped.naturalWidth / imageRect.width;
        const cropX = cropArea.offsetLeft * scale;
        const cropY = cropArea.offsetTop * scale;
        const cropWidth = cropArea.offsetWidth * scale;
        const cropHeight = cropArea.offsetHeight * scale;

        // Set canvas dimensions to crop size
        canvas.width = cropWidth;
        canvas.height = cropHeight;

        // Draw cropped portion of image
        ctx.drawImage(
            imageBeingCropped,
            cropX, cropY, cropWidth, cropHeight,
            0, 0, cropWidth, cropHeight
        );

        // Update the source of the original image
        imageBeingCropped.src = canvas.toDataURL();
        imageBeingCropped.style.width = '100%';
        imageBeingCropped.style.height = 'auto';

        // Clean up crop interface
        wrapper.querySelector('.crop-overlay').remove();
        wrapper.querySelector('.crop-controls').remove();

        // Save history
        saveHistory();
    }

    function showSizeDialog(e) {
        e.stopPropagation();
        
        // Create size dialog
        const dialog = document.createElement('div');
        dialog.className = 'image-size-dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <h3>Adjust Image Size</h3>
                <div class="form-group">
                    <label>Width (px):</label>
                    <input type="number" id="resize-width" value="${activeImage.offsetWidth}">
                </div>
                <div class="form-group">
                    <label>Height (px):</label>
                    <input type="number" id="resize-height" value="${activeImage.offsetHeight}">
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="maintain-aspect" checked>
                        Maintain aspect ratio
                    </label>
                </div>
                <div class="dialog-buttons">
                    <button id="apply-size">Apply</button>
                    <button id="cancel-size">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        const widthInput = dialog.querySelector('#resize-width');
        const heightInput = dialog.querySelector('#resize-height');
        const aspectCheckbox = dialog.querySelector('#maintain-aspect');
        const aspectRatio = activeImage.offsetWidth / activeImage.offsetHeight;
        
        // Handle width/height changes
        widthInput.addEventListener('input', () => {
            if (aspectCheckbox.checked) {
                heightInput.value = Math.round(widthInput.value / aspectRatio);
            }
        });
        
        heightInput.addEventListener('input', () => {
            if (aspectCheckbox.checked) {
                widthInput.value = Math.round(heightInput.value * aspectRatio);
            }
        });
        
        // Handle buttons
        dialog.querySelector('#apply-size').addEventListener('click', () => {
            activeImage.style.width = `${widthInput.value}px`;
            activeImage.style.height = `${heightInput.value}px`;
            updateImageToolbarPosition();
            dialog.remove();
            saveHistory();
        });
        
        dialog.querySelector('#cancel-size').addEventListener('click', () => {
            dialog.remove();
        });
    }

    function alignImage(alignment) {
        if (!activeImage) return;
        
        const wrapper = activeImage.closest('.image-wrapper');
        if (!wrapper) return;
        
        // Don't allow alignment changes in floating mode
        if (wrapper.classList.contains('absolute')) {
            showNotification('Cannot change alignment while image is floating. Disable float mode first.', 'warning');
            return;
        }
        
        // Reset wrapper styles that might interfere with alignment
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';
        wrapper.style.left = '';
        wrapper.style.transform = '';
        wrapper.style.margin = '';
        
        // Create or find alignment container
        let alignContainer = wrapper.parentElement;
        if (!alignContainer.classList.contains('image-align-container')) {
            alignContainer = document.createElement('div');
            alignContainer.className = 'image-align-container';
            wrapper.parentNode.insertBefore(alignContainer, wrapper);
            alignContainer.appendChild(wrapper);
        }
        
        // Set container styles
        alignContainer.style.display = 'block';
        alignContainer.style.textAlign = alignment;
        
        // Update toolbar state
        const alignButtons = document.querySelectorAll('.toolbar-btn i[class*="fa-align-"]');
        alignButtons.forEach(btn => btn.parentElement.classList.remove('active'));
        const activeBtn = document.querySelector(`.toolbar-btn i.fa-align-${alignment}`);
        if (activeBtn) activeBtn.parentElement.classList.add('active');
        
        saveHistory();
    }

    function deleteImage() {
        if (!activeImage) return;
        
        // Remove the image
        activeImage.remove();
        removeImageToolbar();
        activeImage = null;
        saveHistory();
    }

    // Add these new functions
    function showHandles() {
        // Clear any pending hide timeout
        if (hideHandlesTimeout) {
            clearTimeout(hideHandlesTimeout);
            hideHandlesTimeout = null;
        }
        
        // Only proceed if we have an active image
        if (!activeImage) return;
        
        // Show handles immediately
        const wrapper = activeImage.closest('.image-wrapper');
        if (wrapper) {
            const handles = wrapper.querySelectorAll('.resize-handle');
            handles.forEach(handle => {
                handle.style.display = 'block';
                handle.style.opacity = '1';
            });
        }
    }

    function hideHandlesWithDelay() {
        // Clear any existing timeout
        if (hideHandlesTimeout) {
            clearTimeout(hideHandlesTimeout);
        }
        
        // Only proceed if we have an active image
        if (!activeImage) return;
        
        // Set new timeout to hide handles
        hideHandlesTimeout = setTimeout(() => {
            const wrapper = activeImage.closest('.image-wrapper');
            if (wrapper) {
                const handles = wrapper.querySelectorAll('.resize-handle');
                handles.forEach(handle => {
                    handle.style.opacity = '0';
                    // Remove display after fade out
                    setTimeout(() => {
                        if (handle.style.opacity === '0') {
                            handle.style.display = 'none';
                        }
                    }, 200);
                });
            }
            hideHandlesTimeout = null;
        }, 700); // 0.7 seconds for hover behavior
    }

    // Add new function to handle image wrapping
    function toggleFloating(e) {
        if (!activeImage) return;
        
        const wrapper = activeImage.closest('.image-wrapper');
        if (!wrapper) return;
        
        const floatBtn = document.getElementById('float-btn');
        const isCurrentlyFloating = wrapper.classList.contains('absolute');
        
        // Reset all positioning styles
        wrapper.style.position = '';
        wrapper.style.float = '';
        wrapper.style.margin = '';
        wrapper.style.display = '';
        wrapper.style.left = '';
        wrapper.style.top = '';
        wrapper.style.width = '';
        wrapper.style.cursor = '';
        wrapper.classList.remove('absolute');
        
        // Remove draggable functionality if it exists
        if (activeImageDragHandler) {
            wrapper.removeEventListener('mousedown', activeImageDragHandler);
            activeImageDragHandler = null;
        }
        
        if (!isCurrentlyFloating) {
            // Switch to floating mode
            wrapper.style.position = 'absolute';
            wrapper.style.display = 'inline-block';
            wrapper.classList.add('absolute');
            
            // Position near current location
            const rect = wrapper.getBoundingClientRect();
            const editorRect = editor.getBoundingClientRect();
            wrapper.style.top = (rect.top - editorRect.top) + 'px';
            wrapper.style.left = (rect.left - editorRect.left) + 'px';
            
            makeWrapperDraggable(wrapper);
            floatBtn.classList.add('active');
        } else {
            // Switch back to in-text mode
            wrapper.style.position = 'relative';
            wrapper.style.display = 'block';
            floatBtn.classList.remove('active');
        }
        
        // Ensure the editor recognizes the change
        const tempText = document.createTextNode('\u200B');
        editor.appendChild(tempText);
        editor.removeChild(tempText);
        
        saveHistory();
    }

    // Add function to make wrapper draggable for absolute positioning
    function makeWrapperDraggable(wrapper) {
        if (!wrapper) return;
        
        let isDragging = false;
        let startX, startY;
        let startPosX, startPosY;
        
        wrapper.style.cursor = 'move';
        
        // Create the startDrag function
        function startDrag(e) {
            // Only handle primary button (usually left click)
            if (e.button !== 0) return;
            
            // Don't start drag if clicking resize handle
            if (e.target.classList.contains('resize-handle')) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startPosX = parseInt(wrapper.style.left) || 0;
            startPosY = parseInt(wrapper.style.top) || 0;
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
            
            e.preventDefault();
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            wrapper.style.left = (startPosX + dx) + 'px';
            wrapper.style.top = (startPosY + dy) + 'px';
        }
        
        function stopDrag() {
            if (!isDragging) return;
            
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
            saveHistory();
        }
        
        // Store the startDrag handler for later removal
        activeImageDragHandler = startDrag;
        wrapper.addEventListener('mousedown', activeImageDragHandler);
    }

    // Add new function to update alignment buttons state
    function updateAlignmentButtonsState() {
        const wrapper = activeImage.closest('.image-wrapper');
        if (!wrapper || wrapper.classList.contains('absolute')) return;
        
        // Get all alignment buttons
        const alignButtons = {
            left: document.querySelector('#justify-left-btn'),
            center: document.querySelector('#justify-center-btn'),
            right: document.querySelector('#justify-right-btn'),
            full: document.querySelector('#justify-full-btn')
        };
        
        // Remove active state from all buttons
        Object.values(alignButtons).forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
        
        // Get current alignment
        const textAlign = wrapper.style.textAlign;
        
        // Update corresponding button
        if (alignButtons[textAlign]) {
            alignButtons[textAlign].classList.add('active');
        }
    }

    // Add print functionality
    function handlePrint() {
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        
        // Get the editor content
        const content = editor.innerHTML;
        
        // Get current page width setting from localStorage
        const settings = JSON.parse(localStorage.getItem('editorSettings')) || {};
        const pageWidth = settings.pageWidth || 'a4';
        
        // Define page dimensions
        const pageDimensions = {
            a4: {
                width: '210mm',
                height: '297mm'
            },
            letter: {
                width: '216mm',
                height: '279mm'
            }
        };
        
        // Get the dimensions for the current page format
        const currentPageDims = pageWidth !== 'none' ? pageDimensions[pageWidth] : null;
        
        // Create a styled document for printing
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Print Document</title>
                <style>
                    @page {
                        size: ${pageWidth === 'none' ? 'auto' : pageWidth + ' portrait'};
                        margin: 20mm;
                    }
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.2;
                        margin: 0;
                        color: #000;
                        background: white;
                    }
                    .content-wrapper {
                        ${currentPageDims ? `
                            width: ${currentPageDims.width};
                            margin: 0 auto;
                            background: white;
                            position: relative;
                            box-sizing: border-box;
                            padding: 20px;
                        ` : `
                            margin: 20px;
                        `}
                        /* Editor-like text rendering */
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        word-break: break-word;
                        overflow-wrap: break-word;
                    }
                    /* Reset paragraph spacing */
                    .content-wrapper p {
                        margin: 0;
                        padding: 0;
                        min-height: 1.2em;
                    }
                    /* Handle empty paragraphs */
                    .content-wrapper p:empty::after {
                        content: '\\200B'; /* Zero-width space */
                    }
                    /* Preserve spaces and tabs */
                    .content-wrapper pre {
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        font-family: monospace;
                        margin: 0;
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                        vertical-align: middle;
                    }
                    /* Image wrapper styles */
                    .image-wrapper {
                        display: inline-block;
                        position: relative;
                    }
                    .image-wrapper.absolute {
                        position: absolute;
                    }
                    /* Image alignment container */
                    .image-align-container {
                        display: block;
                        text-align: inherit;
                    }
                    @media print {
                        body {
                            margin: 0;
                            padding: 0;
                        }
                        .content-wrapper {
                            margin: 0 auto;
                            padding: 0;
                            width: 100%;
                        }
                        img {
                            page-break-inside: avoid;
                        }
                        h1, h2, h3, h4, h5, h6 {
                            page-break-after: avoid;
                            margin: 0.5em 0;
                        }
                        /* Ensure floating images print correctly */
                        .image-wrapper.absolute {
                            position: relative !important;
                            float: left;
                            margin: 10px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="content-wrapper">
                    ${content}
                </div>
                <script>
                    // Fix any absolute positioned images for printing
                    document.querySelectorAll('.image-wrapper.absolute').forEach(wrapper => {
                        const rect = wrapper.getBoundingClientRect();
                        wrapper.style.position = 'relative';
                        wrapper.style.float = 'left';
                        wrapper.style.margin = '10px';
                    });

                    // Automatically trigger print when content is loaded
                    window.onload = function() {
                        window.print();
                        // Close the window after printing (for most browsers)
                        setTimeout(function() {
                            window.close();
                        }, 500);
                    };
                </script>
            </body>
            </html>
        `);
        
        printWindow.document.close();
    }
}); 