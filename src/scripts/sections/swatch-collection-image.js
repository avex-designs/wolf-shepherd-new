import $ from 'jquery';
import cssClasses from '../helpers/cssClasses';

/**
 * Export default SwatchCollectionImage.
 */
export default () => {

  // Selectors
  const selectors = {
    trigger: document.querySelectorAll('[js-swatch-image="trigger"]'),
  };


  function init() {
    selectors.trigger.forEach((item) => {
      item.addEventListener('click', handleImage);
    });
  }

  function handleImage(item) {
    const target = item.target;
    const href = target.dataset.href;
    const imageOne = target.dataset.variantImageOne;
    const imageTwo = target.dataset.variantImageTwo;
    const collectionGridItem = target.parentElement.parentElement.parentElement;
    const productLinks = collectionGridItem.querySelectorAll('a');
    console.log(href)
    for (let i = 0; i < collectionGridItem.childNodes.length; i++) {
      if (collectionGridItem.childNodes[i].className === 'collection-grid-item__image-wrapper') {
        const imageContainer = collectionGridItem.childNodes[i];
        removeImage(imageContainer, imageOne, imageTwo);
        break;
      }      
    }

    productLinks.forEach((productLink) => {
      //console.log(productLink)
      // console.log(href)
      updateURL(productLink, href);
    });

  }

  function removeImage(imageContainer, imageOne, imageTwo) {
    imageContainer.classList.add(cssClasses.loading);
    window.setTimeout(() => {  
      addImage(imageContainer, imageOne, imageTwo);
    }, 600);
  }

  function addImage(imageContainer, imageOne, imageTwo) {
    const markup = `
    <img src="${imageOne}" class="collection-grid-item__first-image"/>
    <img src="${imageTwo}" class="collection-grid-item__second-image"/>
    `;
    imageContainer.innerHTML = markup;
    window.setTimeout(() => {  
      imageContainer.classList.remove(cssClasses.loading);
    }, 400);
  }

  function updateURL(productLink, href) {
    if (productLink.classList.contains('collection-grid-item__review')) {
      return false;
    }
    productLink.href = href;
    return true;
  }

  /**
   * Return immutable object.
   */
  return Object.freeze({
    init,
  });
};


