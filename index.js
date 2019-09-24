'use strict';
const store = {
  items: [
    { id: cuid(), name: 'apples', checked: false, editBoolean: false },
    { id: cuid(), name: 'oranges', checked: false, editBoolean: false },
    { id: cuid(), name: 'milk', checked: true, editBoolean: false },
    { id: cuid(), name: 'bread', checked: false, editBoolean: false }
  ],
  hideCheckedItems: false,
  currentEditIndex: null
};

const generateItemElement = function (item) {
  
  let itemTitle = getItemTitleHtml(item);

  return `
    <li class='js-item-element' data-item-id='${item.id}'>
      ${itemTitle}
      <div class='shopping-item-controls'>
        <button class='shopping-item-toggle js-item-toggle'>
          <span class='button-label'>check</span>
        </button>
        <button class='shopping-item-delete js-item-delete'>
          <span class='button-label'>delete</span>
        </button>
        <button class='shopping-item-edit js-item-edit'>
          <span class='button-label'>edit</span>
        </button>
      </div>
    </li>`;
};

function getItemTitleHtml(item) {
  let itemTitle;

  if(item.editBoolean) {
    itemTitle = `
    <form id = 'js-edit-form'>
      <input type= 'text' placeholder = '${item.name}' class='shopping-item shopping-item__checked js-edit-input'>
      <button class='shopping-edit-submit js-edit-submit'>
          <span class='button-label'>submit</span>
      </button>
    </form>`;
    if (!item.checked) {
      itemTitle = `
      <form id = 'js-edit-form'>
        <input type= 'text' placeholder = '${item.name}' class='shopping-item js-edit-input'>
        <button class='shopping-edit-submit js-edit-submit'>
          <span class='button-label'>submit</span>
        </button>
      </form>`;
    }
  } else {

    itemTitle = `<span class='shopping-item shopping-item__checked'>${item.name}</span>`;
    if (!item.checked) {
      itemTitle = `
      <span class='shopping-item'>${item.name}</span>
      `;
    }
  }
  return itemTitle;
}

const generateShoppingItemsString = function (shoppingList) {
  const items = shoppingList.map((item) => generateItemElement(item));
  return items.join('');
};

/**
 * Render the shopping list in the DOM
 */
const render = function () {
  // Set up a copy of the store's items in a local 
  // variable 'items' that we will reassign to a new
  // version if any filtering of the list occurs.
  let items = [...store.items];
  // If the `hideCheckedItems` property is true, 
  // then we want to reassign filteredItems to a 
  // version where ONLY items with a "checked" 
  // property of false are included.
  if (store.hideCheckedItems) {
    items = items.filter(item => !item.checked);
  }

  /**
   * At this point, all filtering work has been 
   * done (or not done, if that's the current settings), 
   * so we send our 'items' into our HTML generation function
   */
  const shoppingListItemsString = generateShoppingItemsString(items);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
};

const addItemToShoppingList = function (itemName) {
  store.items.push({ id: cuid(), name: itemName, checked: false });
};

const handleNewItemSubmit = function () {
  $('#js-shopping-list-form').submit(function (event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    render();
  });
};

const toggleCheckedForListItem = function (id) {
  const foundItem = store.items.find(item => item.id === id);
  foundItem.checked = !foundItem.checked;
};

const handleItemCheckClicked = function () {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    const id = getItemIdFromElement(event.currentTarget);
    toggleCheckedForListItem(id);
    render();
  });
};

const getItemIdFromElement = function (item) {
  return $(item)
    .closest('.js-item-element')
    .data('item-id');
};

/**
 * Responsible for deleting a list item.
 * @param {string} id 
 */
const deleteListItem = function (id) {
  // As with 'addItemToShoppingLIst', this 
  // function also has the side effect of
  // mutating the global store value.
  //
  // First we find the index of the item with 
  // the specified id using the native
  // Array.prototype.findIndex() method. 
  const index = store.items.findIndex(item => item.id === id);
  // Then we call `.splice` at the index of 
  // the list item we want to remove, with 
  // a removeCount of 1.
  store.items.splice(index, 1);
};

const handleDeleteItemClicked = function () {
  // Like in `handleItemCheckClicked`, 
  // we use event delegation.
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    // Get the index of the item in store.items.
    const id = getItemIdFromElement(event.currentTarget);
    // Delete the item.
    deleteListItem(id);
    // Render the updated shopping list.
    render();
  });
};

/**
 * Toggles the store.hideCheckedItems property
 */
const toggleCheckedItemsFilter = function () {
  store.hideCheckedItems = !store.hideCheckedItems;
};

/**
 * Places an event listener on the checkbox 
 * for hiding completed items.
 */
const handleToggleFilterClick = function () {
  $('.js-filter-checked').click(() => {
    toggleCheckedItemsFilter();
    render();
  });
};









function changeName(id, newName) {
  let itemIndex = store.items.findIndex(item => item.id === id);

  store.items[itemIndex].name = newName;
  store.items[itemIndex].editBoolean = false;
  store.currentEditIndex = null;
}

function toggleEditBar(id) {
  //when edit clicked needs to change currenteditindex editboolean to false and selected editboolean to true and currentEditIndex to new item
  //editboolean true = the span class to an input type text with item.name as default text.
  //once submitted needs to toggle edit boolean and change item.name and resetcurrenteditindex to null
  let itemIndex = store.items.findIndex(item => item.id === id);
  if(store.currentEditIndex !== null) {
    store.items[store.currentEditIndex].editBoolean = false;
  }
  store.currentEditIndex = itemIndex;
  store.items[itemIndex].editBoolean = true;

}


function handleEditClicked() {
  $('.js-shopping-list').on('click', '.js-item-edit', e => {
    let id = getItemIdFromElement(e.currentTarget);

    toggleEditBar(id);
    console.log(store.currentEditIndex);
    console.log(id);
    render();

    $('.js-edit-input').focus();
  });
}

function handleSubmitEditForm() {
  $('.js-shopping-list').on('submit', '#js-edit-form', e => {
    e.preventDefault();
    let id = getItemIdFromElement(e.currentTarget);
    let newName = $(e.currentTarget).find('.js-edit-input').val();


    changeName(id, newName);
    render();
  });
}














/**
 * This function will be our callback when the
 * page loads. It is responsible for initially 
 * rendering the shopping list, then calling 
 * our individual functions that handle new 
 * item submission and user clicks on the 
 * "check" and "delete" buttons for individual 
 * shopping list items.
 */
const handleShoppingList = function () {
  render();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleFilterClick();
  handleEditClicked();
  handleSubmitEditForm();
};

// when the page loads, call `handleShoppingList`
$(handleShoppingList);