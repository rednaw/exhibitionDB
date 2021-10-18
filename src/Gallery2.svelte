<script>
  import { onMount } from 'svelte';
  import { gallery } from './stores/galleryStore.js';
  import { interactable } from './interactable.js';
  import { getContext } from 'svelte';
  import { showPopup } from './details/show.js';
  const { open } = getContext('simple-modal');

  let canvas;
  let element;
  const mouse = {
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
  };

  function mouseDown(e) {
    if (e.target.id === 'container') {
      const rects = [...canvas.querySelectorAll('.selection')];

      if (rects) {
        for (const rect of rects) {
          canvas.removeChild(rect);
        }
      }

      mouse.startX = mouse.x;
      mouse.startY = mouse.y;
      element = document.createElement('div');
      element.className = 'selection';
      element.style.border = '1px dashed black';
      element.style.position = 'absolute';
      element.style.left = mouse.x + 'px';
      element.style.top = mouse.y + 'px';
      canvas.appendChild(element);
    }
  }

  function setMousePosition(e) {
    const ev = e || window.event;

    if (ev.pageX) {
      mouse.x = ev.pageX + window.pageXOffset;
      mouse.y = ev.pageY + window.pageYOffset;
    } else if (ev.clientX) {
      mouse.x = ev.clientX + document.body.scrollLeft;
      mouse.y = ev.clientY + document.body.scrollTop;
    }
  }

  function mouseMove(e) {
    setMousePosition(e);
    if (element) {
      element.style.width = Math.abs(mouse.x - mouse.startX) + 'px';
      element.style.height = Math.abs(mouse.y - mouse.startY) + 'px';
      element.style.left =
        mouse.x - mouse.startX < 0 ? mouse.x + 'px' : mouse.startX + 'px';
      element.style.top =
        mouse.y - mouse.startY < 0 ? mouse.y + 'px' : mouse.startY + 'px';
    }
  }

  function mouseUp() {
    element = null;

    const rect = canvas.querySelector('.selection');
    const boxes = [...canvas.querySelectorAll('.item')];

    if (rect) {
      const inBounds = [];

      for (const box of boxes) {
        if (isInBounds(rect, box)) {
          inBounds.push(box);
        } else {
          box.style.boxShadow = 'none';
          box.classList.remove('selected');
        }
      }

      if (inBounds.length >= 2) {
        for (const box of inBounds) {
          box.style.boxShadow = '0 0 3pt 3pt hsl(141, 53%, 53%)';
          box.classList.add('selected');
        }
      }

      if (rect) canvas.removeChild(canvas.querySelector('.selection'));
    }
  }

  function isInBounds(obj1, obj2) {
    const a = obj1.getBoundingClientRect();
    const b = obj2.getBoundingClientRect();

    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  let galleryItems = [];
  const fetchGallery = async () => {
    galleryItems = await gallery.get();
  };

  onMount(async () => {
    await fetchGallery();
    const elements = [...document.querySelectorAll('.thumbnail')];
    if (elements) {
      for (const el of elements) {
        interactable(el);
      }
    }
  });

  function imageAction(node, metadata) {
    node.src = metadata.image_url;
    node.addEventListener('click', () => imageClick(metadata));
    return {
      update(metadata) {
        node.src = metadata.image_url;
      },
      destroy() {
        node.removeEventListener('input', imageClick);
      },
    };
  }

  function imageClick(metadata) {
    showPopup(open, 'Gallery', metadata);
  }
</script>

<svelte:head>
  <style>
    body {
      margin: 0;
      width: 100%;
      height: 2048px;

      background-image: url('static/images/background.webp');
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }
  </style>
</svelte:head>

<div
  bind:this={canvas}
  id="container"
  on:mouseup={mouseUp}
  on:mousedown={mouseDown}
  on:mousemove={mouseMove}
>
  <div class="row">
    {#each galleryItems as item}
      <div class="thumbnail">
        <div class="photoContainer">
          <img alt="" use:imageAction={item} />
          <div class="photoInfo">
            <h3>"{item.title}"</h3>
            <span class="paintingDate">{item.artist}, {item.date}</span>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  #container {
    background: transparent;
    height: 2048px;
  }
  .row {
    margin: 40px auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    width: 90%;
    grid-column-gap: 1%;
  }
  .thumbnail {
    justify-self: center;
    transition: 0.5s;
  }
  .photoContainer {
    border: 10px solid #000;
    text-align: center;
    position: relative;
    width: 90%;
  }
  .photoContainer img {
    object-fit: cover;
    width: 100%;
    opacity: 0.5;
  }
  .photoInfo {
    background-color: black;
    color: white;
    position: absolute;
    bottom: 0px;
    text-align: center;
    visibility: hidden;
  }
  .photoInfo h3 {
    margin: 7px 10px;
    font-size: 14px;
    font-weight: bold;
  }
  .photoInfo .paintingDate {
    text-decoration: none;
    font-size: 12px;
    padding: 2px;
  }
</style>
