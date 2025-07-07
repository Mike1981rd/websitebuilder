# Icon System Analysis - Multicolumn Module

## Icon Library Used
The multicolumn module uses **Material Icons** from Google Fonts:
- CDN Link: `https://fonts.googleapis.com/icon?family=Material+Icons`
- Icon class: `material-icons`
- Icons are rendered using: `<i class="material-icons">{icon_name}</i>`

## Icon Selection System

### 1. Dropdown Selection
The module provides a dropdown select with categorized icons:
```javascript
<select id="column-icon" class="shopify-select">
    ${this.generateIconOptions(icon)}
</select>
```

### 2. Available Icons (Categorized)
The `generateIconOptions` function includes ~86 icons organized in 7 categories:

**General Icons:**
- none, settings, search, visibility, visibility_off, person, favorite_border, favorite, thumb_up, thumb_down, lightbulb, star_outline, star, delete, description, content_copy, share, add, remove, check, arrow_forward, arrow_back, undo, redo, refresh, notifications, schedule, event, info

**Commerce Icons:**
- store, shopping_bag, shopping_cart, barcode, local_offer, card_giftcard, sell, discount, military_tech, edit, palette, directions_car, coffee, cake, checkroom, shirt, dress, jewelry, chair, toys

**Shipping Icons:**
- local_shipping, inventory_2, location_on, speed, assignment_return, public, flight, work, route

**Payment Icons:**
- security, credit_card, lock, shield, verified_user, account_balance_wallet, payments, receipt, label, list, qr_code_scanner

**Communication Icons:**
- forum, phone, chat, message, email, support_agent, print

**Devices Icons:**
- devices, smartphone

**Ecology Icons:**
- eco, bug_report, masks, pets

### 3. Custom Icon Upload
The module also supports custom icon uploads:
```javascript
// HTML structure
<div class="custom-icon-upload">
    <button class="shopify-button select-icon-btn">Seleccionar</button>
</div>
<input type="file" id="custom-icon-input" accept="image/*" style="display: none;">

// Upload handling
$('#custom-icon-input').on('change', async function(e) {
    const file = e.target.files[0];
    // FormData upload to server
    // Returns image URL for storage
});
```

### 4. Icon Display Properties
- **Size control**: Range slider from 32px to 128px
- **Default size**: 48px
- **Color**: Inherits from theme color scheme (`schemeColors.text`)

### 5. UI Patterns
1. **Icon dropdown** with grouped options
2. **"See what icon stands for each label"** help link
3. **Custom icon upload** with preview
4. **Change/Remove buttons** for uploaded icons
5. **Size slider** with numeric input
6. **Real-time preview** updates

## Storage Structure
Icons are stored in the column configuration:
```javascript
column: {
    icon: 'barcode',          // Material icon name or 'custom'
    customIcon: 'url/to/image.jpg',  // URL if custom icon uploaded
    iconSize: 48              // Size in pixels
}
```

## Implementation Notes
- Icons use Material Icons font family
- Custom icons are uploaded to server and URL is stored
- Icon selection updates preview in real-time
- Icons can be aligned with column content (left/center/right)
- Special handling for 'none' and 'custom' icon values