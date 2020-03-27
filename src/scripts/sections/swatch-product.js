import $ from 'jquery';
import cssClasses from '../helpers/cssClasses';
// import {extendDefaults} from '../helpers/utils';

/**
 * DOM selectors.
 */
const selectors = {
  container: '[js-product-swatches="container"]',
  productJson: '[data-product-json]',
  inventoryJson: '[data-inventory-json]',
  sizeToggle: '[js-size-toggle="trigger"]',
  $swatchColor: $('.product-form .swatch-product--color'),
  $miniSwatchOpen: $('.product-form-mini__form-toggle'),
  $miniSwatchClose: $('.product-form-mini__details__tab'),
};

/**
 * Export default Swatch Product.
 */
export default (config) => {

  const container = document.querySelector(`${config.container}`);
 
  const nodeSelectors = {
    container: container.querySelectorAll(selectors.container),
    productJson: container.querySelector(selectors.productJson),
    inventoryJson: container.querySelector(selectors.inventoryJson),
    sizeToggle: container.querySelectorAll(selectors.sizeToggle),
    $swatchColor: selectors.$swatchColor,
    $miniSwatchOpen: selectors.$miniSwatchOpen,
    $miniSwatchClose: selectors.$miniSwatchClose,
  };

  function init() {
    if (document.querySelector(`${config.container} ${selectors.container}`) === null) {
      return false;
    }
    
    nodeSelectors.container.forEach((element) => {
      element.addEventListener('click', handleClick);
      element.addEventListener('click', swatchChange);
    });

    nodeSelectors.sizeToggle.forEach((element) => {
      element.addEventListener('click', toggleSize);
    });

    nodeSelectors.$miniSwatchOpen.on('click', openMiniSwatch);
    nodeSelectors.$miniSwatchClose.on('click', closeMiniSwatch);
    
   
  }

  function handleClick(element) {
  
    const target = element.target;
   
    if (target.dataset.swatchOption === 'option-1') {
        $('[js-swatch-product="main"] [data-index="option2"]').val([])
        $('[data-section-type="product-miniform"] [data-index="option2"]').val([])
        $('[js-swatch-product="main"] [data-index="option3"]').val([])
        $('[data-section-type="product-miniform"] [data-index="option3"]').val([])
        optionActive(target, 1);
        checkInventory(target);
        updateColorTitle(target);
        setSwatchesToUnactive()    
        
        if (config.updateSlider === true) {
          updateSlider(target);
        }
    }
    
    if (target.dataset.swatchOption === 'option-2') {
      $('[js-swatch-product="main"] [data-index="option3"]').val([])
      $('[data-section-type="product-miniform"] [data-index="option3"]').val([])
      optionActive(target, 2);
      checkInventory(target);
      updateSizeTitle(target);
      setSwatchesToUnactivethird()  
    }

    if (target.dataset.swatchOption === 'option-3') {
      optionActive(target, 3);
      checkInventory(target);
    }
  }

  function getProductJSON() {
    return JSON.parse(nodeSelectors.productJson.innerHTML);
  }

  function getVariants() {
    const productJSON = getProductJSON();
    return productJSON.variants;
  }

  function getCurrentSelected(value) {
    const option = container.querySelector(`[data-swatch-option="option-${value}"].is-active`);
    if (option === null) {
      return false;
    } else {
      const optionValue = option.dataset.swatchValue;
      return optionValue;
    }
  }

  async function checkInventory(target) {
    const currentOption1 = await getCurrentSelected(1);
    const currentOption2 = await getCurrentSelected(2);
    const currentOption3 = await getCurrentSelected(3);
    const inventory = await getVariants();
    
    if(target.dataset.swatchOption === 'option-1'){
      setSwatchesToUnavailable()
      setSwatchesToAvailableThird()
    }
    if(target.dataset.swatchOption === 'option-2'){
      setSwatchesToUnavailableThird()
    }

    await inventory.forEach((variant, index) => {
      if (currentOption1 === variant.option1) {
        updateOption2(variant, inventory[index-1], index);
        if (currentOption3 !== false) {
          if (currentOption3 === variant.option3) {
            updateOption2(variant, inventory[index-1], index);
          }
        } 
        // else if (currentOption2 !== false) {
        //     updateOption2(variant, inventory[index-1], index);
        // }
      }

      if (currentOption1 === variant.option1 && currentOption2 === variant.option2) {
          updateOption3(variant);      
      }
    });


  }

  function updateOption2(variant, prev, index) {
    if (variant.available === false) {
      const target = container.querySelector(`[data-swatch-option="option-2"][data-swatch-value="${variant.option2}"]`);      
      if(index === 0){
        setToUnavailable(target);
      }else{
        if(prev.option2 !== variant.option2 && prev.option3 === variant.option3){
          setToUnavailable(target);
        }
      }      
    } else {
      const target = container.querySelector(`[data-swatch-option="option-2"][data-swatch-value="${variant.option2}"]`);
      setToAvailable(target);
    }
  }

  function updateOption3(variant) {
    if (variant.available === false) {
      const target = container.querySelector(`[data-swatch-option="option-3"][data-swatch-value="${variant.option3}"]`);
      setToUnavailable(target);
    } else {
      const target = container.querySelector(`[data-swatch-option="option-3"][data-swatch-value="${variant.option3}"]`);
      setToAvailable(target);
    }
  }

  function setSwatchesToUnavailable() {
    if(container.dataset.sectionId !== 'product-mini-form'){
      document.querySelector('#shopify-section-product-mini-form').querySelectorAll('[js-product-swatches="container"]').forEach((element) => {
        if(element.dataset.swatchOption === 'option-2' ){
          setToUnavailable(element);
        }    
      });
    }

    if(container.getAttribute('js-swatch-product') !== 'main'){
      document.querySelector('[js-swatch-product="main"]').querySelectorAll('[js-product-swatches="container"]').forEach((element) => {
        if(element.dataset.swatchOption === 'option-2' ){
          setToUnavailable(element);
        }    
      });
    }
    
    nodeSelectors.container.forEach((element) => {
      if(element.dataset.swatchOption === 'option-2' ){
        setToUnavailable(element);
      }
    });
  }

  function setSwatchesToUnavailableThird() {
    if(container.dataset.sectionId !== 'product-mini-form'){
      document.querySelector('#shopify-section-product-mini-form').querySelectorAll('[js-product-swatches="container"]').forEach((element) => {
        if(element.dataset.swatchOption === 'option-3' ){
          setToUnavailable(element);
        }    
      });
    }

    if(container.getAttribute('js-swatch-product') !== 'main'){
      document.querySelector('[js-swatch-product="main"]').querySelectorAll('[js-product-swatches="container"]').forEach((element) => {
        if(element.dataset.swatchOption === 'option-3' ){
          setToUnavailable(element);
        }    
      });
    }
    
    nodeSelectors.container.forEach((element) => {
      if(element.dataset.swatchOption === 'option-3' ){
        setToUnavailable(element);
      }
    });
  }

  function setSwatchesToAvailableThird() {
    if(container.dataset.sectionId !== 'product-mini-form'){
      document.querySelector('#shopify-section-product-mini-form').querySelectorAll('[js-product-swatches="container"]').forEach((element) => {
        if(element.dataset.swatchOption === 'option-3' ){
          setToAvailable(element);
        }    
      });
    }

    if(container.getAttribute('js-swatch-product') !== 'main'){
      document.querySelector('[js-swatch-product="main"]').querySelectorAll('[js-product-swatches="container"]').forEach((element) => {
        if(element.dataset.swatchOption === 'option-3' ){
          setToAvailable(element);
        }    
      });
    }
    
    nodeSelectors.container.forEach((element) => {
      if(element.dataset.swatchOption === 'option-3' ){
        setToAvailable(element);
      }
    });
  }

  function  setSwatchesToUnactive() {
    if(container.dataset.sectionId !== 'product-mini-form'){
      document.querySelector('#shopify-section-product-mini-form').querySelectorAll('[js-product-swatches="container"]').forEach((element) => {
        if(element.dataset.swatchOption !== 'option-1' ){
          element.classList.remove(cssClasses.active);
        }    
      });
    }

    if(container.getAttribute('js-swatch-product') !== 'main'){
      document.querySelector('[js-swatch-product="main"]').querySelectorAll('[js-product-swatches="container"]').forEach((element) => {
        if(element.dataset.swatchOption !== 'option-1' ){
          element.classList.remove(cssClasses.active);
        }    
      });
    }
    
    nodeSelectors.container.forEach((element) => {
      if(element.dataset.swatchOption !== 'option-1'){
        element.classList.remove(cssClasses.active);
      }      
    });
  }

  function  setSwatchesToUnactivethird() {
    nodeSelectors.container.forEach((element) => {
      if(element.dataset.swatchOption === 'option-3'){
        element.classList.remove(cssClasses.active);
      }      
    });
  }

  function setToUnavailable(element) {
    element.classList.add(cssClasses.disabled);
    //element.setAttribute("disabled", true);

    if(container.dataset.sectionId !== 'product-mini-form'){
      document.querySelector('#shopify-section-product-mini-form').querySelectorAll('[js-product-swatches="container"]').forEach((elm) => {
        if(element.dataset.swatchValue === elm.dataset.swatchValue ){
          element.classList.add(cssClasses.disabled);
          //element.setAttribute("disabled", true);
        }    
      });
    }

    if(container.getAttribute('js-swatch-product') !== 'main'){
      document.querySelector('[js-swatch-product="main"]').querySelectorAll('[js-product-swatches="container"]').forEach((elm ) => {
        if(element.dataset.swatchValue === elm.dataset.swatchValue){
          element.classList.add(cssClasses.disabled);
          //element.setAttribute("disabled", true);
        }    
      });
    }
    
  }

  function setToAvailable(element) {
   
    if(element){
      element.classList.remove(cssClasses.disabled);
    //element.removeAttribute("disabled");
    if(container.dataset.sectionId !== 'product-mini-form'){
      document.querySelector('#shopify-section-product-mini-form').querySelectorAll('[js-product-swatches="container"]').forEach((elm) => {
        if(element.dataset.swatchValue === elm.dataset.swatchValue ){
          elm.classList.remove(cssClasses.disabled);
         // elm.removeAttribute("disabled");
        }    
      });
    }
  }
    if(container.getAttribute('js-swatch-product') !== 'main'){
      document.querySelector('[js-swatch-product="main"]').querySelectorAll('[js-product-swatches="container"]').forEach((elm) => {
        if(element.dataset.swatchValue === elm.dataset.swatchValue ){
          elm.classList.remove(cssClasses.disabled);
         // elm.removeAttribute("disabled");
        }      
      });
    }
    
  }

  function optionActive(target, optionNumber) {
    if(container.dataset.sectionId !== 'product-mini-form'){
      document.querySelector('#shopify-section-product-mini-form').querySelectorAll(`[data-swatch-option="option-${optionNumber}"]`).forEach((element) => {
        if(target.dataset.swatchValue === element.dataset.swatchValue){
          element.classList.add(cssClasses.active);
        }else{
          element.classList.remove(cssClasses.active);
        }      
      });
    }

    if(container.getAttribute('js-swatch-product') !== 'main'){
      document.querySelector('[js-swatch-product="main"]').querySelectorAll(`[data-swatch-option="option-${optionNumber}"]`).forEach((element) => {
       // console.log(element, target)
        if(target.dataset.swatchValue === element.dataset.swatchValue){
          element.classList.add(cssClasses.active);
        }else{
          element.classList.remove(cssClasses.active);
        }      
      });
    }

    if(optionNumber === 1){
      let colormini = document.querySelector('#shopify-section-product-mini-form').querySelector('.product-form-mini__form-toggle [js-swatch="color"]')
      colormini.classList = ""
      colormini.classList.add("product-form-mini--"+target.dataset.swatchValue.replace(/\s+/g, '-').toLowerCase())
      colormini.innerHTML = target.dataset.swatchValue
      document.querySelector('#shopify-section-product-mini-form').querySelector('.product-form-mini__form-toggle [js-swatch="size"]').innerHTML = ''
    }
    if(optionNumber === 2){
      let sizemini = document.querySelector('#shopify-section-product-mini-form').querySelector('.product-form-mini__form-toggle [js-swatch="size"]')
      sizemini.innerHTML = target.dataset.swatchValue
    }

    container.querySelectorAll(`[data-swatch-option="option-${optionNumber}"]`).forEach((element) => {
      element.classList.remove(cssClasses.active);
    });
    target.classList.add(cssClasses.active);
  }

  function swatchChange() {
    const $this = $(this);
    const swatchValue = $this.attr('data-swatch-value');
    const swatchOption = $this.attr('data-swatch-option').replace('-', '') 
    $(`${config.container} [data-index="${swatchOption}"]`).val(swatchValue).trigger('change')
    if(container.dataset.sectionId !== 'product-mini-form'){
    $(`[data-section-type="product-miniform"] [data-index="${swatchOption}"]`).val(swatchValue).trigger('change')
    }
    // $('.affirm-as-low-as').attr('data-amount', 32900);
    // affirm.ui.refresh();
  }

  function updateSlider(target) {
    const swatchValue = target.dataset.slider;

    $('.product-images__container').removeClass(cssClasses.active);
    $(`#${swatchValue}`).addClass(cssClasses.active);
  }

  function updateColorTitle(target) {
    const swatchColor = target.dataset.swatchValue;

    container.querySelector('[js-swatch="color"]').innerHTML = swatchColor;
  }

  function updateSizeTitle(target) {
    const swatchSize = target.dataset.swatchValue;

    container.querySelector('[js-swatch="size"]').innerHTML = `SIZE: ${swatchSize}`;
  }

  function openMiniSwatch() {
    const $details = $('.product-form-mini__details');
    $details.addClass(cssClasses.active);
  }

  function closeMiniSwatch() {
    const $details = $('.product-form-mini__details');
    $details.removeClass(cssClasses.active);
  }

  function toggleSize(element) {
    const target = element.target;
    const wrapper = container.querySelector('.swatch__size-container');
    if (target.classList.contains(cssClasses.active)) {
      target.classList.remove(cssClasses.active);
      wrapper.classList.remove(cssClasses.active);
    } else {
      target.classList.add(cssClasses.active);
      wrapper.classList.add(cssClasses.active);
    }
  }

  /**
   * Return immutable object.
   */
  return Object.freeze({
    init,
    closeMiniSwatch,
  });
};


