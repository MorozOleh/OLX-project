import { API_OLX } from './url';
import { fetchCall } from './fetch/fetchCall';
// import fetchFavourites from './fetch/fetchFavourites';
import fetchFavouritesDelete from './fetchFavouritesDelete';
import { fetchGetFavorites } from './fetch/fetchGetFavorites';
import { fetchPostAddFavoriteID } from './fetch/fetchPostAddFavoriteID';
import { fetchGetUserID } from './fetch/fetchGetUserID';

const modal = document.querySelector('[data-item-modal]');
const name = document.querySelector('[data-item-modal-title]');
const code = document.querySelector('[data-item-modal-code]');
const imgBig = document.querySelector('[data-item-modal-imagebig]');
const imagesSmall = document.querySelectorAll('[data-item-modal-imagesmall]');
const salerInfo = document.querySelector('[data-item-modal-salerinfo]');
const favourites = document.querySelector('[data-item-modal-favourites]');
const share = document.querySelector('[data-item-modal-share]');
const description = document.querySelector('[data-item-modal-description]');
const price = document.querySelector('[data-item-modal-price]');
const close = document.querySelector('[data-item-modal-close]');

const cardsContainer = document.querySelector('.cards');

favourites.addEventListener('click', onFavouritesClicked);
function onFavouritesClicked() {
  for (const item of favouritesList) {
    if (item === currentItem._id) {
      console.log('delete');
      fetchFavouritesDelete(API_OLX, currentItem._id).then(updateFavourites);
      favourites.classList.remove('selected');
      console.log(favouritesList);
      return;
    }
  }
  console.log('add');
  fetchPostAddFavoriteID(API_OLX, currentItem._id).then(updateFavourites);
  favourites.classList.add('selected');
  console.log(favouritesList);
  fetchGetFavorites(API_OLX).then(setFavourites);
}

function updateFavourites(render) {
  if (render === null) return;
  console.log(render);
  favouritesList = [];
  if (render.favourites !== undefined) {
    for (const item of render.favourites) {
      favouritesList.push(item._id);
    }
  } else {
    for (const item of render.newFavourites) {
      favouritesList.push(item._id);
    }
  }
}

cardsContainer.addEventListener('click', onItemClicked);

function onItemClicked(event) {
  console.log(event.target.src);
  fetchGetFavorites(API_OLX).then(setFavourites);
  const image = event.target.querySelector("[data-id]");
  console.log(image.dataset.id);
  for (const item of itemsData) {
    // if (item._id === undefined) continue;
    if (item._id.toString() === image.dataset.id) {
        fetchGetUserID(API_OLX, item.userId).then(setCurrentUser).catch(console.log)
      showModal(item);
      console.log(item);
      currentItem = item;
    }
  }
}
let currentItem;
let currentUser;

function setCurrentUser(user){
    currentUser = user;
    console.log(currentUser);
}

document.onkeydown = function (evt) {
  evt = evt || window.event;
  var isEscape = false;
  if ('key' in evt) {
    isEscape = evt.key === 'Escape' || evt.key === 'Esc';
  } else {
    isEscape = evt.keyCode === 27;
  }
  if (isEscape) {
    closeModal();
  }
};

console.log('modal');
console.log(cardsContainer);

close.addEventListener('click', closeModal);

function closeModal() {
  if (modal.classList.contains('isActive')) {
    modal.classList.remove('isActive');
  }
}
let favouritesList = [];
fetchGetFavorites(API_OLX).then(setFavourites);

function setFavourites(render) {
  favouritesList = [];
  for (const item of render.favourites) {
    favouritesList.push(item._id);
  }
}

fetchCall(API_OLX, 1).then(setData);
fetchCall(API_OLX, 2).then(setData);
fetchCall(API_OLX, 3).then(setData);

let itemsData = [];

function setData(render) {
  const keys = Object.keys(render);
  for (const key of keys) {
    const array = render[key];
    for (const item of array) {
      itemsData.push(item);
    }
  }

  console.log(itemsData.length);
}

salerInfo.addEventListener('mouseenter', addHoverText);

function removeSalerInfoChilds() {
  salerInfo.innerHTML = '';
}

function addHoverText() {
  removeSalerInfoChilds();
  salerInfo.insertAdjacentHTML(
    'afterbegin',
    '<div class="nav-and-description-button-hovered"><p data-item-modal-salerinfo class="nav-and-description-button-hovered-bold">'+currentUser.email+'</p><p data-item-modal-salerinfo>- на OLX с '+currentUser.registrationDate+'</p><p data-item-modal-salerinfo class="nav-and-description-button-hovered-bold">' +
      currentItem.phone +
      '</p></div>',
  );
}

salerInfo.addEventListener('mouseleave', addNonhoverText);

function addNonhoverText() {
  removeSalerInfoChilds();
  salerInfo.insertAdjacentHTML(
    'afterbegin',
    '<p class="nav-and-description-button-nonhovered">Информация о<br> продавце</p>',
  );
}

function showModal(item) {
  modal.classList.add('isActive');
  name.textContent = item.title;
  price.textContent = item.price + '.00 грн';
  description.textContent = item.description;
  imgBig.src = item.imageUrls[0];
  code.textContent = "Код товару | "+item._id;
  console.log(item.imageUrls.length);
  removeSalerInfoChilds();
  salerInfo.insertAdjacentHTML(
    'afterbegin',
    '<p class="nav-and-description-button-nonhovered">Информация о<br> продавце</p>',
  );

  console.log(favourites);
  for (const localeItem of favouritesList) {
    console.log(localeItem + '  ' + item._id);
    if (localeItem === item._id) {
      favourites.classList.add('selected');
      console.log('add!!');
      return;
    }
  }
  favourites.classList.remove('selected');
}

//<li class="image-block-small-list-item">
//            <img data-item-modal-imagesmall src="https://estore.ua/media/catalog/product/cache/8/image/650x650/9df78eab33525d08d6e5fb8d27136e95/m/t/mtp72_vw_34fr_watch-40-alum-gold-nc-5s_vw_34fr_wf_co_4.jpeg" alt="">
//            <div></div>
//          </li>